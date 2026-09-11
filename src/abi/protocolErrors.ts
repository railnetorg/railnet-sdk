/**
 * Every error the protocol declares, as a fallback ABI fragment for a revert viem left undecoded.
 *
 * viem decodes a revert against the ABI of the call, so an error the called contract does not
 * declare arrives as raw bytes even when it is genuinely reachable: `AssetNotAuthorized` is thrown
 * by the AssetRegistry during `conduitFactory.spawn`, `EnforcedPause` by the beacon on any call
 * routed through a vehicle proxy, the Aave reserve checks by a facet inside a spawn's initializer,
 * and `InvalidOutput` by `ErrorLib` through assembly, which solc lists on no contract at all.
 *
 * {@link getRailnetError} falls back to this fragment. It covers the 167 error names declared
 * across `hangar/src`; `QueryAlreadyRegistered` and `QueryAlreadyWrapped` each exist in two
 * signatures, hence 169 entries.
 */
export const protocolErrorsAbi = [
  {
    type: 'error',
    name: 'AccountingError',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'expectedBalance', type: 'uint256', internalType: 'uint256' },
      { name: 'actualBalance', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'AccountingOverflow',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'asset', type: 'address', internalType: 'contract IERC20' },
      { name: 'currentValue', type: 'uint256', internalType: 'uint256' },
      { name: 'incrementValue', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'AccountingUnderflow',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'asset', type: 'address', internalType: 'contract IERC20' },
      { name: 'currentValue', type: 'uint256', internalType: 'uint256' },
      { name: 'decrementValue', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'AddressAlreadyListed',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AddressNotListed',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AddressOnOtherList',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AlreadyAllowed',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AlreadyDisallowed',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'AmountTooHigh',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'address' },
      { name: 'requiredAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'availableAmount', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'AssetNotAuthorized',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'BeaconFrozen',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CannotAuthorizeMultiVehicle',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CannotShortenPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CreateNotAllowed',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'CyclicalDependencyDetected',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DefaultAdminCannotBePublic',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DefaultAdminCannotBeRenounced',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DemandFullyClaimed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DemandIdAlreadyRedeemed',
    inputs: [{ name: 'demandId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'DepositLimitedByCap',
    inputs: [
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'cap', type: 'uint256', internalType: 'uint256' },
      { name: 'currentHoldings', type: 'uint256', internalType: 'uint256' },
      { name: 'attemptedAmount', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'DisabledConduit',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DisabledVehicle',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DispatchDepositAmountTooHigh',
    inputs: [
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'requestedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'sectorBalance', type: 'uint256', internalType: 'uint256' },
      { name: 'maxDeposit', type: 'uint256', internalType: 'uint256' },
      { name: 'cap', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'DispatchRedeemAmountTooHigh',
    inputs: [
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'requestedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'sectorBalance', type: 'uint256', internalType: 'uint256' },
      { name: 'maxRedeem', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'DuplicateQuery',
    inputs: [
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      {
        name: 'query',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'receiver', type: 'address', internalType: 'address' },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
          { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'EmptyStrictDispatch',
    inputs: [
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
      { name: 'requestedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'sectorBalance', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'EnforcedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExistingModule',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'ExpectedPause',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExpectedSupplyNotReached',
    inputs: [
      { name: 'totalSupply', type: 'uint256', internalType: 'uint256' },
      { name: 'expectedSupply', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ExtraAssetsForWithdrawalRequestsTooHigh',
    inputs: [
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'max', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'FactoryDeprecated',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedConduitCreation',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedContractCreation',
    inputs: [{ name: 'factory', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'FailedModuleInitialization',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'FailedVehicleCreation',
    inputs: [{ name: 'factory', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'FailedVehicleUnlock',
    inputs: [
      { name: 'factory', type: 'address', internalType: 'address' },
      {
        name: 'query',
        type: 'tuple',
        internalType: 'struct Query',
        components: [
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'receiver', type: 'address', internalType: 'address' },
          {
            name: 'input',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          {
            name: 'output',
            type: 'tuple',
            internalType: 'struct Asset',
            components: [
              { name: 'asset', type: 'address', internalType: 'address' },
              { name: 'value', type: 'uint256', internalType: 'uint256' },
            ],
          },
          { name: 'mode', type: 'uint8', internalType: 'enum Mode' },
          { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
          { name: 'data', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'FeeTooHigh',
    inputs: [
      { name: 'attemptedFee', type: 'uint32', internalType: 'uint32' },
      { name: 'maxFee', type: 'uint32', internalType: 'uint32' },
    ],
  },
  {
    type: 'error',
    name: 'ForceRedeemNotAllowed',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'caller', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'ForceRedeemUnavailable',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FulfillmentExhausted',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FulfillmentNotMatchingDemand',
    inputs: [
      { name: 'demandId', type: 'uint256', internalType: 'uint256' },
      { name: 'fulfillmentId', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'FulfillmentOutOfRange',
    inputs: [
      { name: 'demandCursor', type: 'uint256', internalType: 'uint256' },
      { name: 'fulfillmentStart', type: 'uint256', internalType: 'uint256' },
      { name: 'fulfillmentEnd', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'IllegalTransition',
    inputs: [
      { name: 'startingState', type: 'uint8', internalType: 'enum State' },
      { name: 'endingState', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'IncompatibleVehicle',
    inputs: [
      { name: 'vehicleAsset', type: 'address', internalType: 'address' },
      {
        name: 'depositRoutes',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          { name: 'input', type: 'address', internalType: 'address' },
          { name: 'output', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: 'redeemRoutes',
        type: 'tuple[]',
        internalType: 'struct Route[]',
        components: [
          { name: 'input', type: 'address', internalType: 'address' },
          { name: 'output', type: 'address', internalType: 'address' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'IneffectiveMove',
    inputs: [
      { name: 'from', type: 'bytes32', internalType: 'Sector' },
      { name: 'to', type: 'bytes32', internalType: 'Sector' },
    ],
  },
  {
    type: 'error',
    name: 'InitialAccountingError',
    inputs: [
      { name: 'totalAssets', type: 'uint256', internalType: 'uint256' },
      { name: 'totalSupply', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InsufficientAllowance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientAssetBalance',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InterceptionSharesTooHigh',
    inputs: [{ name: 'asset', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidAccessControl',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAsset',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidAssetRegistry',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidBeacon',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidBps',
    inputs: [{ name: 'bpsValue', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidBpsValue',
    inputs: [{ name: 'invalidValue', type: 'uint32', internalType: 'uint32' }],
  },
  {
    type: 'error',
    name: 'InvalidCaller',
    inputs: [
      { name: 'expected', type: 'address', internalType: 'address' },
      { name: 'actual', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidConduitAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidContract',
    inputs: [{ name: 'contractAddress', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidConvertedAsset',
    inputs: [
      {
        name: 'invalidAsset',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidCoreFactory',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidDemandId',
    inputs: [{ name: 'demandId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidEstimatedAsset',
    inputs: [
      {
        name: 'invalidAsset',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidEstimation',
    inputs: [
      {
        name: 'queryOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'estimationOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidFulfillmentId',
    inputs: [{ name: 'fulfillmentId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidImplementation',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInitialDepositSize',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInitialExpectedSupply',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInput',
    inputs: [
      {
        name: 'queryInput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidMarketId',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidMorpho',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidMsgValue',
    inputs: [
      { name: 'expected', type: 'uint256', internalType: 'uint256' },
      { name: 'actual', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidOutput',
    inputs: [
      {
        name: 'queryOutput',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidPoolAddressesProvider',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidQueryOwnerOrReceiver',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'receiver', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidQueryRegistry',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidQuerySalt',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidQuerySector',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'source', type: 'bool', internalType: 'bool' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidQueueEntry',
    inputs: [
      { name: 'index', type: 'uint256', internalType: 'uint256' },
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'reason', type: 'bytes32', internalType: 'bytes32' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidReceiver',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRecipient',
    inputs: [{ name: 'forbiddenAddress', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidSector',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'source', type: 'bool', internalType: 'bool' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidSectorConversion',
    inputs: [{ name: 'sector', type: 'bytes32', internalType: 'Sector' }],
  },
  {
    type: 'error',
    name: 'InvalidStakedUSDe',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidState',
    inputs: [
      { name: 'expected', type: 'uint8', internalType: 'enum State' },
      { name: 'actual', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidStaticSector',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'source', type: 'bool', internalType: 'bool' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidTarget',
    inputs: [
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'threshold', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidTransferGate',
    inputs: [{ name: 'transferGate', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidUSDeDecimals',
    inputs: [
      { name: 'decimals', type: 'uint8', internalType: 'uint8' },
      { name: 'expectedDecimals', type: 'uint8', internalType: 'uint8' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidValue',
    inputs: [{ name: 'value', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InvalidVault',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidVehicle',
    inputs: [{ name: 'vehicle', type: 'address', internalType: 'contract IVehicle' }],
  },
  {
    type: 'error',
    name: 'InvalidVehicleSector',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'source', type: 'bool', internalType: 'bool' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidWrappedAsset',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketDecimalsMismatch',
    inputs: [
      { name: 'assetDecimals', type: 'uint8', internalType: 'uint8' },
      { name: 'marketDecimals', type: 'uint8', internalType: 'uint8' },
    ],
  },
  {
    type: 'error',
    name: 'MarketDoesNotExist',
    inputs: [{ name: 'marketId', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'MaxDepositTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'maxDeposit',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'MaxRedeemTooLow',
    inputs: [
      {
        name: 'input',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'maxRedeem',
        type: 'tuple',
        internalType: 'struct Asset',
        components: [
          { name: 'asset', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'MaxTotalAssetsExceeded',
    inputs: [
      { name: 'cap', type: 'uint256', internalType: 'uint256' },
      { name: 'actual', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'MinOutputRequiresPinnedAmount',
    inputs: [
      { name: 'vehicle', type: 'address', internalType: 'contract IVehicle' },
      { name: 'minOutput', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'MisconfiguredMultiVehicle',
    inputs: [
      { name: 'satellite', type: 'address', internalType: 'address' },
      { name: 'reason', type: 'bytes32', internalType: 'bytes32' },
    ],
  },
  {
    type: 'error',
    name: 'MissingAccessControl',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingFacet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingModulesManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MissingRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'scope', type: 'address', internalType: 'address' },
      { name: 'caller', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'ModeUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ModuleDoesNotAcceptNativeCurrency',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ModuleNotAllowed',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'ModuleNotFound',
    inputs: [{ name: 'module', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'NoPendingDeposit',
    inputs: [{ name: 'conduit', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'NonExistingConfigId',
    inputs: [{ name: 'configId', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'NonWrappableState',
    inputs: [
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'state', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'NotAllowed',
    inputs: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'to', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'NotDeployedByFactory',
    inputs: [
      { name: 'factory', type: 'address', internalType: 'address' },
      { name: 'addr', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'NothingToFulfill',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NothingToRedeem',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OnlyManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OnlyMultiVehicleOrManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OnlyOwnerCanRenounce',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'scope', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'OracleUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OutcomeLocked',
    inputs: [
      { name: 'qid', type: 'bytes32', internalType: 'Id' },
      { name: 'current', type: 'uint8', internalType: 'enum Outcome' },
      { name: 'attempted', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'PublicRoleAuthDenied',
    inputs: [],
  },
  {
    type: 'error',
    name: 'QueryAlreadyExists',
    inputs: [{ name: 'queryId', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'QueryAlreadyRegistered',
    inputs: [
      { name: 'conduit', type: 'address', internalType: 'address' },
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'existingOwner', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'QueryAlreadyRegistered',
    inputs: [{ name: 'qid', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'QueryAlreadyWrapped',
    inputs: [
      { name: 'conduit', type: 'address', internalType: 'address' },
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
      { name: 'tokenId', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'QueryAlreadyWrapped',
    inputs: [{ name: 'qid', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'QueryMismatch',
    inputs: [
      { name: 'expectedQueryId', type: 'bytes32', internalType: 'Id' },
      { name: 'actualQueryId', type: 'bytes32', internalType: 'Id' },
    ],
  },
  {
    type: 'error',
    name: 'QueryNotFound',
    inputs: [{ name: 'qid', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'QueryNotRegistered',
    inputs: [
      { name: 'conduit', type: 'address', internalType: 'address' },
      { name: 'queryId', type: 'bytes32', internalType: 'Id' },
    ],
  },
  {
    type: 'error',
    name: 'RecipientsNotStrictlyAscending',
    inputs: [{ name: 'recipient', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'RequestIdChanged',
    inputs: [
      { name: 'previous', type: 'uint256', internalType: 'uint256' },
      { name: 'current', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ReserveFrozen',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReserveNotActive',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ReservePaused',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RolePublicStatusUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SanctionsOracleRequired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SanctionsUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'StakedUSDeMismatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'StateUnchanged',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SubQueryAlreadyFinalized',
    inputs: [
      { name: 'subQueryId', type: 'bytes32', internalType: 'Id' },
      { name: 'finalState', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'TerminalState',
    inputs: [
      { name: 'qid', type: 'bytes32', internalType: 'Id' },
      { name: 'state', type: 'uint8', internalType: 'enum State' },
    ],
  },
  {
    type: 'error',
    name: 'TransferNotAllowed',
    inputs: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'to', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'Unauthorized',
    inputs: [
      { name: 'expectedCaller', type: 'address', internalType: 'address' },
      { name: 'caller', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'UnauthorizedVehicle',
    inputs: [{ name: 'vehicle', type: 'address', internalType: 'contract IVehicle' }],
  },
  {
    type: 'error',
    name: 'UnauthorizedWrap',
    inputs: [
      { name: 'caller', type: 'address', internalType: 'address' },
      { name: 'owner', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'UnchangedDemand',
    inputs: [
      { name: 'demandId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'demand',
        type: 'tuple',
        internalType: 'struct IQueryRedeemQueue.Demand',
        components: [
          { name: 'position', type: 'uint256', internalType: 'uint256' },
          { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
          { name: 'maxAmountOut', type: 'uint256', internalType: 'uint256' },
          { name: 'highestFulfillmentId', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'error',
    name: 'UnexpectedMsgValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Unimplemented',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UninitializedFeeManager',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnknownQuery',
    inputs: [{ name: 'queryId', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'UnknownSubQuery',
    inputs: [{ name: 'subQueryId', type: 'bytes32', internalType: 'Id' }],
  },
  {
    type: 'error',
    name: 'UnredeemableDemand',
    inputs: [{ name: 'demandId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'UnsupportedAsset',
    inputs: [
      { name: 'asset', type: 'address', internalType: 'contract IERC20' },
      { name: 'decimals', type: 'uint8', internalType: 'uint8' },
    ],
  },
  {
    type: 'error',
    name: 'VehicleAlreadyAuthorized',
    inputs: [{ name: 'vehicle', type: 'address', internalType: 'contract IVehicle' }],
  },
  {
    type: 'error',
    name: 'VehicleNotAuthorized',
    inputs: [{ name: 'vehicle', type: 'address', internalType: 'contract IVehicle' }],
  },
  {
    type: 'error',
    name: 'VehicleNotPending',
    inputs: [{ name: 'vehicle', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'VehicleNotReady',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroAddressOwner',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroAssetValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroBalance',
    inputs: [
      { name: 'sector', type: 'bytes32', internalType: 'Sector' },
      { name: 'asset', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'ZeroCode',
    inputs: [{ name: 'invalidContract', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'ZeroInputValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroLength',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroOutputValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroSharesValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroTotalAssets',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ZeroValue',
    inputs: [],
  },
] as const
