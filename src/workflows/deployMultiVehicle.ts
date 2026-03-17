import {
  type Address,
  type Chain,
  erc20Abi,
  type Hash,
  type Hex,
  type PublicClient,
  type Transport,
  type WalletClient,
} from 'viem'
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
  publicClient: PublicClient<Transport, Chain>,
  walletClient: WalletClient<Transport, Chain>,
  parameters: DeployMultiVehicleParameters & { account: Address },
): Promise<DeployMultiVehicleResult> {
  const chain = publicClient.chain
  if (!chain) throw new Error('PublicClient must have a chain configured')
  const { eacFactory, multiVehicleFactory } = getAddresses(chain.id)

  const transactionHashes: Hash[] = []
  const adminAddress = parameters.adminAddress ?? parameters.account
  const initialExpectedSupply = parameters.initialExpectedSupply ?? 10n ** 18n

  let eacAddress: Address
  if (parameters.accessControl) {
    eacAddress = parameters.accessControl
  } else {
    const eacHash = await spawnAccessControl(publicClient, walletClient, {
      factory: eacFactory,
      initialDefaultAdmin: adminAddress,
      initialDelay: 0,
      initialRoles: [],
      account: parameters.account,
    })
    const eacReceipt = await publicClient.waitForTransactionReceipt({ hash: eacHash })
    const extractedEac = extractAccessControlAddress(eacReceipt, eacFactory)
    if (!extractedEac) {
      throw new Error('Could not extract access control address from transaction logs')
    }
    eacAddress = extractedEac
    transactionHashes.push(eacHash)
  }

  const { request: approveRequest } = await publicClient.simulateContract({
    address: parameters.asset,
    abi: erc20Abi,
    functionName: 'approve',
    args: [multiVehicleFactory, parameters.initialDepositAmount],
    account: parameters.account,
  })
  const approveHash = await walletClient.writeContract(approveRequest)
  await publicClient.waitForTransactionReceipt({ hash: approveHash })
  transactionHashes.push(approveHash)

  const mvSpawnParams: Parameters<typeof spawnMultiVehicle>[2] = {
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
  const mvHash = await spawnMultiVehicle(publicClient, walletClient, mvSpawnParams)
  const mvReceipt = await publicClient.waitForTransactionReceipt({ hash: mvHash })
  const mvContracts = extractMultiVehicleContracts(mvReceipt, multiVehicleFactory)
  if (!mvContracts) {
    throw new Error('Could not extract multi-vehicle contracts from transaction logs')
  }
  transactionHashes.push(mvHash)

  transactionHashes.push(
    await grantScopedRole(publicClient, walletClient, {
      accessControl: eacAddress,
      role: MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION as Hex,
      scope: mvContracts.vehicleRegistry,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(publicClient, walletClient, {
      accessControl: eacAddress,
      role: MULTI_VEHICLE_SET_QUEUES as Hex,
      scope: mvContracts.queueStrategyEngine,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  for (const vehicle of parameters.vehicles) {
    transactionHashes.push(
      await grantScopedRole(publicClient, walletClient, {
        accessControl: eacAddress,
        role: VEHICLE_STEAM as Hex,
        scope: vehicle.address,
        grantee: mvContracts.multiVehicle,
        account: parameters.account,
      }),
    )

    transactionHashes.push(
      await grantScopedRole(publicClient, walletClient, {
        accessControl: eacAddress,
        role: VEHICLE_STEAM as Hex,
        scope: vehicle.address,
        grantee: mvContracts.sectorAccountingEngine,
        account: parameters.account,
      }),
    )

    transactionHashes.push(
      await grantScopedRole(publicClient, walletClient, {
        accessControl: eacAddress,
        role: VEHICLE_STEAM as Hex,
        scope: vehicle.address,
        grantee: mvContracts.subQueryEngine,
        account: parameters.account,
      }),
    )

    transactionHashes.push(
      await authorizeVehicle(publicClient, walletClient, {
        vehicleRegistry: mvContracts.vehicleRegistry,
        vehicle: vehicle.address,
        account: parameters.account,
      }),
    )
  }

  transactionHashes.push(
    await setQueues(publicClient, walletClient, {
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
