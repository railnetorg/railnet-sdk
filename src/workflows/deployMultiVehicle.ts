import { type Address, type Client, erc20Abi, type Hash, type Hex } from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { externalAccessControlAbi } from '../abi/externalAccessControl.js'
import { grantScopedRole } from '../actions/accessControl/grantScopedRole.js'
import { spawnAccessControl } from '../actions/accessControl/spawnAccessControl.js'
import { getInitialDepositAmount } from '../actions/assetRegistry/getInitialDepositAmount.js'
import { authorizeVehicle } from '../actions/multiVehicle/authorizeVehicle.js'
import { setQueues } from '../actions/multiVehicle/setQueues.js'
import { spawnMultiVehicle } from '../actions/multiVehicle/spawnMultiVehicle.js'
import {
  MULTI_VEHICLE_SET_QUEUES,
  MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION,
  VEHICLE_STEAM_DEPOSIT,
  VEHICLE_STEAM_REDEEM,
} from '../constants/roles.js'
import { getAddresses } from '../contracts/chains.js'
import type { ContractCallOptions } from '../types.js'
import {
  extractAccessControlAddress,
  extractMultiVehicleContracts,
  type MultiVehicleContracts,
} from '../utils/receipt.js'

export type VehicleEntry = {
  address: Address
  depositTarget: { value: bigint; threshold: bigint }
  redeemTarget: { value: bigint; threshold: bigint }
}

export type DeployMultiVehicleParameters = {
  asset: Address
  name: string
  symbol: string
  queryRegistry?: Address
  vehicles: VehicleEntry[]
  accessControl?: Address
  adminAddress?: Address
  forbiddenAddresses?: Address[]
  feeManager?: Address
  modulesManager?: Address
}

export type DeployMultiVehicleResult = {
  eacAddress: Address
  multiVehicleContracts: MultiVehicleContracts
  transactionHashes: Hash[]
}

/**
 * Deploys a complete multi-vehicle ecosystem in a single workflow: spawns access control, approves the factory for the asset's initial deposit amount (read from the AssetRegistry), spawns the multi-vehicle, grants required roles (VEHICLE_STEAM_DEPOSIT, VEHICLE_STEAM_REDEEM, SET_QUEUES, SET_VEHICLE_AUTHORIZATION), authorizes sub-vehicles, and configures allocation queues.
 *
 * @param parameters - {@link DeployMultiVehicleParameters}
 *
 * @example
 * import { deployMultiVehicle, getAddresses } from '@railnetorg/railnet-sdk'
 * import { base } from 'viem/chains'
 *
 * const { usdc } = getAddresses(base.id)
 *
 * const { eacAddress, multiVehicleContracts } = await deployMultiVehicle(walletClient, {
 *   asset: usdc,
 *   name: 'My Strategy',
 *   symbol: 'MSTRAT',
 *   vehicles: [
 *     {
 *       address: aaveV3VehicleAddress,
 *       depositTarget: { value: 5_000n * 10n ** 18n, threshold: 0n },
 *       redeemTarget: { value: 0n, threshold: 0n },
 *     },
 *   ],
 *   account: account.address,
 * })
 */
export async function deployMultiVehicle(
  client: Client,
  parameters: DeployMultiVehicleParameters & { account: Address },
  options?: ContractCallOptions,
): Promise<DeployMultiVehicleResult> {
  const chain = client.chain
  if (!chain) throw new Error('Client must have a chain configured')
  const {
    eacFactory,
    multiVehicleFactory,
    assetRegistry,
    queryRegistry: chainQueryRegistry,
  } = getAddresses(chain.id)

  const transactionHashes: Hash[] = []
  const adminAddress = parameters.adminAddress ?? parameters.account
  const initialDepositAmount = await getInitialDepositAmount(client, {
    assetRegistry,
    asset: parameters.asset,
  })
  if (initialDepositAmount === 0n) {
    throw new Error(
      `Asset ${parameters.asset} has no initial deposit amount registered in the AssetRegistry, the factory would reject the spawn`,
    )
  }

  let eacAddress: Address
  if (parameters.accessControl) {
    eacAddress = parameters.accessControl

    const { request: approveRequest } = await simulateContract(client, {
      ...options,
      address: parameters.asset,
      abi: erc20Abi,
      functionName: 'approve',
      args: [multiVehicleFactory, initialDepositAmount],
      account: parameters.account,
    })
    const approveHash = await writeContract(client, approveRequest)
    await waitForTransactionReceipt(client, { hash: approveHash })
    transactionHashes.push(approveHash)
  } else {
    const [eacHash, approveHash] = await Promise.all([
      spawnAccessControl(
        client,
        {
          factory: eacFactory,
          initialDefaultAdmin: adminAddress,
          initialDelay: 0,
          initialRoles: [],
          account: parameters.account,
        },
        options,
      ),
      simulateContract(client, {
        ...options,
        address: parameters.asset,
        abi: erc20Abi,
        functionName: 'approve',
        args: [multiVehicleFactory, initialDepositAmount],
        account: parameters.account,
      }).then(({ request }) => writeContract(client, request)),
    ])

    const [eacReceipt] = await Promise.all([
      waitForTransactionReceipt(client, { hash: eacHash }),
      waitForTransactionReceipt(client, { hash: approveHash }),
    ])

    const extractedEac = extractAccessControlAddress(eacReceipt, eacFactory)
    if (!extractedEac) {
      throw new Error('Could not extract access control address from transaction logs')
    }
    eacAddress = extractedEac
    transactionHashes.push(eacHash, approveHash)
  }

  const mvSpawnParams: Parameters<typeof spawnMultiVehicle>[1] = {
    factory: multiVehicleFactory,
    asset: parameters.asset,
    name: parameters.name,
    symbol: parameters.symbol,
    accessControl: eacAddress,
    queryRegistry: parameters.queryRegistry ?? chainQueryRegistry,
    account: parameters.account,
  }
  if (parameters.forbiddenAddresses !== undefined) {
    mvSpawnParams.forbiddenAddresses = parameters.forbiddenAddresses
  }
  if (parameters.feeManager !== undefined) {
    mvSpawnParams.feeManager = parameters.feeManager
  }
  if (parameters.modulesManager !== undefined) {
    mvSpawnParams.modulesManager = parameters.modulesManager
  }
  const mvHash = await spawnMultiVehicle(client, mvSpawnParams, options)
  const mvReceipt = await waitForTransactionReceipt(client, { hash: mvHash })
  const mvContracts = extractMultiVehicleContracts(mvReceipt, multiVehicleFactory)
  if (!mvContracts) {
    throw new Error('Could not extract multi-vehicle contracts from transaction logs')
  }
  transactionHashes.push(mvHash)

  const [adminRoleHashes, vehicleHashes] = await Promise.all([
    Promise.all([
      grantScopedRole(
        client,
        {
          accessControl: eacAddress,
          role: MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION as Hex,
          scope: mvContracts.vehicleManager,
          grantee: adminAddress,
          account: parameters.account,
        },
        options,
      ),
      grantScopedRole(
        client,
        {
          accessControl: eacAddress,
          role: MULTI_VEHICLE_SET_QUEUES as Hex,
          scope: mvContracts.queueStrategyEngine,
          grantee: adminAddress,
          account: parameters.account,
        },
        options,
      ),
    ]),

    Promise.all(
      parameters.vehicles.map(async (vehicle): Promise<Hash[]> => {
        const hashes: Hash[] = []

        const steamRoles = [VEHICLE_STEAM_DEPOSIT, VEHICLE_STEAM_REDEEM]
        const steamGrantees = [
          mvContracts.multiVehicle,
          mvContracts.sectorAccountingEngine,
          mvContracts.subQueryEngine,
        ]

        const isPublic = await Promise.all(
          steamRoles.map((role) =>
            readContract(client, {
              address: eacAddress,
              abi: externalAccessControlAbi,
              functionName: 'isScopedRolePublic',
              args: [role, vehicle.address],
            }),
          ),
        )

        const steamHashes = await Promise.all(
          steamRoles.flatMap((role, index) =>
            isPublic[index]
              ? []
              : steamGrantees.map((grantee) =>
                  grantScopedRole(
                    client,
                    {
                      accessControl: eacAddress,
                      role,
                      scope: vehicle.address,
                      grantee,
                      account: parameters.account,
                    },
                    options,
                  ),
                ),
          ),
        )
        hashes.push(...steamHashes)

        hashes.push(
          await authorizeVehicle(
            client,
            {
              vehicleManager: mvContracts.vehicleManager,
              vehicle: vehicle.address,
              account: parameters.account,
            },
            options,
          ),
        )

        return hashes
      }),
    ),
  ])

  transactionHashes.push(...adminRoleHashes, ...vehicleHashes.flat())

  transactionHashes.push(
    await setQueues(
      client,
      {
        queueStrategyEngine: mvContracts.queueStrategyEngine,
        depositQueue: parameters.vehicles.map((v) => ({
          vehicle: v.address,
          target: v.depositTarget,
        })),
        redeemQueue: parameters.vehicles.map((v) => ({
          vehicle: v.address,
          target: v.redeemTarget,
        })),
        account: parameters.account,
      },
      options,
    ),
  )

  return {
    eacAddress,
    multiVehicleContracts: mvContracts,
    transactionHashes,
  }
}
