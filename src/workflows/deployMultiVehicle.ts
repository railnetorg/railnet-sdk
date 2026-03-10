import {
  type Address,
  type Chain,
  erc20Abi,
  type Hash,
  type Transport,
  type WalletClient,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
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
import type { MultiVehicleContracts } from '../utils/receipt.js'

export type DeployMultiVehicleParameters = {
  asset: Address
  name: string
  symbol: string
  initialDepositAmount: bigint
  vehicle: Address
  adminAddress?: Address
  factories: {
    eacFactory: Address
    multiVehicleFactory: Address
  }
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
  walletClient: WalletClient<Transport, Chain>,
  parameters: DeployMultiVehicleParameters & { account: Address },
): Promise<DeployMultiVehicleResult> {
  const transactionHashes: Hash[] = []
  const adminAddress = parameters.adminAddress ?? parameters.account
  const initialExpectedSupply = parameters.initialExpectedSupply ?? 10n ** 18n

  const eacResult = await spawnAccessControl(walletClient, {
    factory: parameters.factories.eacFactory,
    initialDefaultAdmin: adminAddress,
    initialDelay: 0,
    initialRoles: [],
    account: parameters.account,
  })
  transactionHashes.push(eacResult.transactionHash)

  const approveMvHash = await walletClient.writeContract({
    address: parameters.asset,
    abi: erc20Abi,
    functionName: 'approve',
    args: [parameters.factories.multiVehicleFactory, parameters.initialDepositAmount],
    account: parameters.account,
    chain: walletClient.chain,
  })
  const approveMvReceipt = await waitForTransactionReceipt(walletClient, { hash: approveMvHash })
  if (approveMvReceipt.status === 'reverted') {
    throw new Error('ERC20 approve for MultiVehicle factory reverted')
  }
  transactionHashes.push(approveMvHash)

  const mvSpawnParams: Parameters<typeof spawnMultiVehicle>[1] = {
    factory: parameters.factories.multiVehicleFactory,
    asset: parameters.asset,
    name: parameters.name,
    symbol: parameters.symbol,
    accessControl: eacResult.accessControlAddress,
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
  const mvResult = await spawnMultiVehicle(walletClient, mvSpawnParams)
  transactionHashes.push(mvResult.transactionHash)

  transactionHashes.push(
    await grantScopedRole(walletClient, {
      accessControl: eacResult.accessControlAddress,
      role: MULTI_VEHICLE_SET_VEHICLE_AUTHORIZATION,
      scope: mvResult.contracts.sectorAccountingEngine,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(walletClient, {
      accessControl: eacResult.accessControlAddress,
      role: MULTI_VEHICLE_SET_QUEUES,
      scope: mvResult.contracts.queueStrategyEngine,
      grantee: adminAddress,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(walletClient, {
      accessControl: eacResult.accessControlAddress,
      role: VEHICLE_STEAM,
      scope: parameters.vehicle,
      grantee: mvResult.contracts.multiVehicle,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(walletClient, {
      accessControl: eacResult.accessControlAddress,
      role: VEHICLE_STEAM,
      scope: parameters.vehicle,
      grantee: mvResult.contracts.sectorAccountingEngine,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await grantScopedRole(walletClient, {
      accessControl: eacResult.accessControlAddress,
      role: VEHICLE_STEAM,
      scope: parameters.vehicle,
      grantee: mvResult.contracts.subQueryEngine,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await authorizeVehicle(walletClient, {
      vehicleRegistry: mvResult.contracts.vehicleRegistry,
      vehicle: parameters.vehicle,
      account: parameters.account,
    }),
  )

  transactionHashes.push(
    await setQueues(walletClient, {
      queueStrategyEngine: mvResult.contracts.queueStrategyEngine,
      depositQueue: [{ vehicle: parameters.vehicle, target: { value: 10n ** 27n, threshold: 0n } }],
      redeemQueue: [{ vehicle: parameters.vehicle, target: { value: 0n, threshold: 0n } }],
      account: parameters.account,
    }),
  )

  return {
    eacAddress: eacResult.accessControlAddress,
    multiVehicleContracts: mvResult.contracts,
    transactionHashes,
  }
}
