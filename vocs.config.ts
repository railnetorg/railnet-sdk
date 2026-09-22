import { Changelog, defineConfig, McpSource } from 'vocs/config'

const actions = (names: string[]) => names.map((name) => ({ text: name, link: `/actions/${name}` }))

export default defineConfig({
  title: 'Railnet SDK',
  description: 'TypeScript SDK for interacting with the Railnet protocol',
  srcDir: 'docs',
  outDir: 'docs/dist',
  renderStrategy: 'partial-static',
  baseUrl: 'https://sdk.railnet.org',
  sitemap: false,
  // viem's JSDoc links to /docs/actions/public/introduction; twoslash hovers surface it as a dead link.
  checkDeadlinks: 'warn',
  twoslash: {
    // 4 is ts.JsxEmit.ReactJSX; importing typescript here would bundle it into the client config.
    twoslashOptions: { compilerOptions: { jsx: 4 } },
  },
  head: { meta: { robots: 'noindex, nofollow' } },
  ogImageUrl: (pagePath, { baseUrl }) =>
    `${baseUrl}/api/og?title=%title&description=%description&section=${pagePath.split('/').filter(Boolean)[0] ?? ''}`,
  mcp: {
    enabled: true,
    sources: [McpSource.github({ name: 'railnet-sdk', repo: 'railnetorg/railnet-sdk' })],
  },
  topNav: [
    { text: 'Docs', link: '/getting-started', match: (path) => path !== '/changelog' },
    { text: 'Changelog', link: '/changelog' },
  ],
  changelog: Changelog.github({ repo: 'railnetorg/railnet-sdk' }),
  accentColor: 'light-dark(#cc3f00, #ff9465)',
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  editLink: {
    link: 'https://github.com/railnetorg/railnet-sdk/edit/main/docs/pages/:path',
  },
  socials: [{ icon: 'github', link: 'https://github.com/railnetorg/railnet-sdk' }],
  sidebar: [
    { text: 'Introduction', link: '/' },
    { text: 'Getting started', link: '/getting-started' },
    {
      text: 'Guides',
      items: [
        { text: 'Deploying a conduit', link: '/guides/deployingAConduit' },
        { text: 'Deploying a vehicle', link: '/guides/deployingAVehicle' },
        { text: 'Deploying a multi-vehicle', link: '/guides/deployingAMultiVehicle' },
        { text: 'Depositing and redeeming', link: '/guides/depositingAndRedeeming' },
        { text: 'Operating a multi-vehicle', link: '/guides/operatingAMultiVehicle' },
        { text: 'Rebalancing between vehicles', link: '/guides/rebalancingBetweenVehicles' },
        { text: 'Managing roles', link: '/guides/managingRoles' },
        { text: 'Handling reverts', link: '/guides/handlingReverts' },
        { text: 'Sending from React', link: '/guides/sendingFromReact' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Call builders', link: '/actions/callBuilders' },
        {
          text: 'Addresses',
          items: [
            { text: 'getAddresses', link: '/contracts/getAddresses' },
            { text: 'isSupportedChain', link: '/contracts/isSupportedChain' },
            { text: 'Staging deployments', link: '/contracts/staging' },
          ],
        },
        { text: 'Errors', link: '/utilities/errors' },
        {
          text: 'Access Control',
          collapsed: true,
          items: [
            {
              text: 'buildAcceptDefaultAdminTransferCall',
              link: '/actions/defaultAdminTransfer#buildacceptdefaultadmintransfercall',
            },
            {
              text: 'buildBeginDefaultAdminTransferCall',
              link: '/actions/defaultAdminTransfer#buildbegindefaultadmintransfercall',
            },
            {
              text: 'buildCancelDefaultAdminTransferCall',
              link: '/actions/defaultAdminTransfer#buildcanceldefaultadmintransfercall',
            },
            {
              text: 'buildGrantRoleCall',
              link: '/actions/globalRoles#buildgrantrolecall--buildrevokerolecall',
            },
            ...actions(['buildGrantScopedRoleCall']),
            { text: 'buildRenounceRoleCall', link: '/actions/globalRoles#buildrenouncerolecall' },
            ...actions(['buildRenounceScopedRoleCall']),
            {
              text: 'buildRevokeRoleCall',
              link: '/actions/globalRoles#buildgrantrolecall--buildrevokerolecall',
            },
            ...actions(['buildRevokeScopedRoleCall']),
            { text: 'buildSetRolePublicCall', link: '/actions/globalRoles#buildsetrolepubliccall' },
            ...actions([
              'buildSetScopedRolePublicCall',
              'buildSpawnAccessControlCall',
              'getHasRole',
            ]),
            {
              text: 'getPendingDefaultAdmin',
              link: '/actions/defaultAdminTransfer#getpendingdefaultadmin',
            },
            { text: 'Default admin transfer', link: '/actions/defaultAdminTransfer' },
            { text: 'Roles', link: '/constants/roles' },
          ],
        },
        {
          text: 'Account List',
          collapsed: true,
          items: [
            {
              text: 'buildAddToAllowListCall',
              link: '/actions/accountListConfiguration#the-four-list-calls',
            },
            {
              text: 'buildAddToBlockListCall',
              link: '/actions/accountListConfiguration#the-four-list-calls',
            },
            {
              text: 'buildRemoveFromAllowListCall',
              link: '/actions/accountListConfiguration#the-four-list-calls',
            },
            {
              text: 'buildRemoveFromBlockListCall',
              link: '/actions/accountListConfiguration#the-four-list-calls',
            },
            {
              text: 'buildSetAllowlistModeCall',
              link: '/actions/accountListConfiguration#buildsetallowlistmodecall',
            },
            {
              text: 'buildSetSanctionsOracleCall',
              link: '/actions/accountListConfiguration#sanctions-screening',
            },
            ...actions(['buildSpawnAccountListCall']),
            {
              text: 'buildToggleSanctionsCall',
              link: '/actions/accountListConfiguration#sanctions-screening',
            },
            ...actions(['getAccountListStatus', 'predictAccountListDeployment']),
          ],
        },
        { text: 'Asset Registry', collapsed: true, items: actions(['getInitialDepositAmount']) },
        {
          text: 'Conduit',
          collapsed: true,
          items: [
            ...actions([
              'buildDepositConduitCall',
              'buildDepositConduitQuery',
              'buildEnableConduitTransfersCall',
              'buildFinalizeConduitDepositCall',
              'buildForceRedeemCall',
              'buildProcessConduitQueryCall',
              'buildRedeemConduitCall',
            ]),
            {
              text: 'buildSetConduitInterceptionsCall',
              link: '/actions/setInterceptions#the-two-calls',
            },
            ...actions(['buildSpawnConduitCall', 'estimateConduit', 'getConduitInfo']),
            {
              text: 'getConduitInterceptions',
              link: '/actions/getInterceptions#getconduitinterceptions',
            },
            ...actions([
              'getConduitPosition',
              'getDepositConduitCall',
              'getIsTransferable',
              'getRedeemConduitCall',
              'predictConduitDeployment',
            ]),
          ],
        },
        {
          text: 'Fee Manager',
          collapsed: true,
          items: actions([
            'buildDispatchFeesCall',
            'buildSetFeeRecipientsCall',
            'buildSetFeesCall',
            'buildSpawnFeeManagerCall',
            'predictFeeManagerDeployment',
          ]),
        },
        {
          text: 'MultiVehicle',
          collapsed: true,
          items: [
            ...actions([
              'buildAllocateIdleCall',
              'buildAuthorizeVehicleCall',
              'buildConfigureVehicleCall',
              'buildDispatchVehicleCall',
            ]),
            {
              text: 'buildFeedQueryRedeemQueueCall',
              link: '/actions/queryRedeemQueue#buildfeedqueryredeemqueuecall',
            },
            ...actions([
              'buildMoveBetweenSectorsCall',
              'buildProgressQueryCall',
              'buildRebalanceRedeemCall',
            ]),
            {
              text: 'buildRetrieveQueryRedeemQueueAssetsCall',
              link: '/actions/queryRedeemQueue#buildretrievequeryredeemqueueassetscall',
            },
            ...actions([
              'buildSetMaxTotalAssetsCall',
              'buildSetQueuesCall',
              'buildSetThresholdsCall',
              'buildSpawnMultiVehicleCall',
              'buildUnauthorizeVehicleCall',
              'buildWithdrawToIdleCall',
              'getSectorBalance',
              'getVehicleManagerLimits',
            ]),
            {
              text: 'simulateDispatchVehicle',
              link: '/actions/buildDispatchVehicleCall#simulatedispatchvehicle',
            },
            { text: 'toSubQuery', link: '/actions/buildProgressQueryCall#tosubquery' },
          ],
        },
        {
          text: 'Owner Registry',
          collapsed: true,
          items: [
            ...actions(['buildSpawnOwnerRegistryCall', 'buildWrapQueryCall']),
            { text: 'getQueryClaim', link: '/actions/buildWrapQueryCall#getqueryclaim' },
            ...actions(['predictOwnerRegistryDeployment']),
          ],
        },
        {
          text: 'Vehicle',
          collapsed: true,
          items: [
            { text: 'applySlippage', link: '/actions/estimateVehicle#applyslippage' },
            {
              text: 'buildSetVehicleInterceptionsCall',
              link: '/actions/setInterceptions#the-two-calls',
            },
            ...actions([
              'buildSpawnAaveV3VehicleCall',
              'buildSpawnErc4626VehicleCall',
              'buildSpawnMorphoBlueVehicleCall',
              'buildSpawnWrapperVehicleCall',
              'estimateVehicle',
            ]),
            {
              text: 'getMorphoBlueSingleton',
              link: '/actions/buildSpawnMorphoBlueVehicleCall#getmorphobluesingleton',
            },
            {
              text: 'getMorphoMarketAsset',
              link: '/actions/buildSpawnMorphoBlueVehicleCall#getmorphomarketasset',
            },
            ...actions(['getVehicleConversion']),
            {
              text: 'getVehicleInterceptions',
              link: '/actions/getInterceptions#getvehicleinterceptions',
            },
          ],
        },
        {
          text: 'Utilities',
          collapsed: true,
          items: [
            { text: 'randomSalt', link: '/utilities/randomSalt' },
            { text: 'Receipt helpers', link: '/utilities/receiptHelpers' },
            { text: 'toCall', link: '/utilities/toCall' },
            { text: 'toQueryId', link: '/utilities/queryIdentity#toqueryid' },
            { text: 'toQuerySalt', link: '/utilities/queryIdentity#toquerysalt' },
          ],
        },
        {
          text: 'Types',
          collapsed: true,
          items: [
            ...[
              'Asset',
              'ChainAddresses',
              'ConduitInfo',
              'ConduitPosition',
              'Enums',
              'Interception',
              'Query',
              'Sector',
            ].map((name) => ({ text: name, link: `/types/${name}` })),
            { text: 'vehicleSector', link: '/types/Sector#vehicle-sectors' },
          ],
        },
      ],
    },
    {
      text: 'React',
      items: [
        { text: 'Query options', link: '/react/queryOptions' },
        ...[
          'useAccountListStatus',
          'useConduitInfo',
          'useConduitInterceptions',
          'useConduitPosition',
          'useDepositConduitCall',
          'useEstimateConduit',
          'useEstimateVehicle',
          'useHasRole',
          'useInitialDepositAmount',
          'useIsTransferable',
          'useMorphoBlueSingleton',
          'useMorphoMarketAsset',
          'usePendingDefaultAdmin',
          'usePredictAccountListDeployment',
          'usePredictConduitDeployment',
          'usePredictFeeManagerDeployment',
          'usePredictOwnerRegistryDeployment',
          'useQueryClaim',
          'useRedeemConduitCall',
          'useSectorBalance',
          'useVehicleConversion',
          'useVehicleInterceptions',
          'useVehicleManagerLimits',
        ].map((name) => ({ text: name, link: `/react/${name}` })),
      ],
    },
    { text: 'AI Agents', link: '/agents' },
    { text: 'Changelog', link: '/changelog' },
  ],
})
