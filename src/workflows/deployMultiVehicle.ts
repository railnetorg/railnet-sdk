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
import { authorizeVehicle } from '../actions/multiVehicle/authorizeVehicle.js'
import { setQueues } from '../actions/multiVehicle/setQueues.js'
import { spawnMultiVehicle } from '../actions/multiVehicle/spawnMultiVehicle.js'
import {
  MULTI_VEHICLE_SET_QUEUES,
  MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION,
  VEHICLE_STEAM,
} from '../constants/roles.js'
import { getAddresses } from '../contracts/chains.js'
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
  initialDepositAmount: bigint
  vehicles: VehicleEntry[]
  accessControl?: Address
  adminAddress?: Address
  initialExpectedSupply?: bigint
  feeManager?: Address
  modulesManager?: Address
}

export type DeployMultiVehicleResult = {
  eacAddress: Address
  multiVehicleContracts: MultiVehicleContracts
  transactionHashes: Hash[]
}

export async function deployMultiVehicle(
  client: Client,
  parameters: DeployMultiVehicleParameters & { account: Address },
): Promise<DeployMultiVehicleResult> {
  const chain = client.chain
  if (!chain) throw new Error('Client must have a chain configured')
  const { eacFactory, multiVehicleFactory } = getAddresses(chain.id)

  const transactionHashes: Hash[] = []
  const adminAddress = parameters.adminAddress ?? parameters.account
  const initialExpectedSupply = parameters.initialExpectedSupply ?? 10n ** 18n

  let eacAddress: Address
  if (parameters.accessControl) {
    eacAddress = parameters.accessControl
  } else {
    const eacHash = await spawnAccessControl(client, {
      factory: eacFactory,
      initialDefaultAdmin: adminAddress,
      initialDelay: 0,
      initialRoles: [],
      account: parameters.account,
    })
    const eacReceipt = await waitForTransactionReceipt(client, { hash: eacHash })
    const extractedEac = extractAccessControlAddress(eacReceipt, eacFactory)
    if (!extractedEac) {
      throw new Error('Could not extract access control address from transaction logs')
    }
    eacAddress = extractedEac
    transactionHashes.push(eacHash)
  }

  const { request: approveRequest } = await simulateContract(client, {
    address: parameters.asset,
    abi: erc20Abi,
    functionName: 'approve',
    args: [multiVehicleFactory, parameters.initialDepositAmount],
    account: parameters.account,
  })
  const approveHash = await writeContract(client, approveRequest)
  await waitForTransactionReceipt(client, { hash: approveHash })
  transactionHashes.push(approveHash)

  const mvSpawnParams: Parameters<typeof spawnMultiVehicle>[1] = {
    factory: multiVehicleFactory,
    asset: parameters.asset,
    name: parameters.name,
    symbol: parameters.symbol,
    accessControl: eacAddress,
    initialDepositSize: parameters.initialDepositAmount,
    initialExpectedSupply,
    account: parameters.account,
  }
  if (parameters.feeManager !== undefined) {
    mvSpawnParams.feeManager = parameters.feeManager
  }
  if (parameters.modulesManager !== undefined) {
    mvSpawnParams.modulesManager = parameters.modulesManager
  }
  const mvHash = await spawnMultiVehicle(client, mvSpawnParams)
  const mvReceipt = await waitForTransactionReceipt(client, { hash: mvHash })
  const mvContracts = extractMultiVehicleContracts(mvReceipt, multiVehicleFactory)
  if (!mvContracts) {
    throw new Error('Could not extract multi-vehicle contracts from transaction logs')
  }
  transactionHashes.push(mvHash)

  transactionHashes.push(
    await grantScopedRole(client, {
      accessControl: eacAddress,
      role: MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION as Hex,
      scope: mvContracts.vehicleRegistry,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(client, {
      accessControl: eacAddress,
      role: MULTI_VEHICLE_SET_QUEUES as Hex,
      scope: mvContracts.queueStrategyEngine,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  for (const vehicle of parameters.vehicles) {
    const isPublic = await readContract(client, {
      address: eacAddress,
      abi: externalAccessControlAbi,
      functionName: 'isScopedRolePublic',
      args: [VEHICLE_STEAM, vehicle.address],
    })

    if (!isPublic) {
      transactionHashes.push(
        await grantScopedRole(client, {
          accessControl: eacAddress,
          role: VEHICLE_STEAM as Hex,
          scope: vehicle.address,
          grantee: mvContracts.multiVehicle,
          account: parameters.account,
        }),
      )

      transactionHashes.push(
        await grantScopedRole(client, {
          accessControl: eacAddress,
          role: VEHICLE_STEAM as Hex,
          scope: vehicle.address,
          grantee: mvContracts.sectorAccountingEngine,
          account: parameters.account,
        }),
      )

      transactionHashes.push(
        await grantScopedRole(client, {
          accessControl: eacAddress,
          role: VEHICLE_STEAM as Hex,
          scope: vehicle.address,
          grantee: mvContracts.subQueryEngine,
          account: parameters.account,
        }),
      )
    }

    transactionHashes.push(
      await authorizeVehicle(client, {
        vehicleRegistry: mvContracts.vehicleRegistry,
        vehicle: vehicle.address,
        account: parameters.account,
      }),
    )
  }

  transactionHashes.push(
    await setQueues(client, {
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
    }),
  )

  return {
    eacAddress,
    multiVehicleContracts: mvContracts,
    transactionHashes,
  }
}
