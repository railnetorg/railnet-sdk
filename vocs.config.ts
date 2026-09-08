import { defineConfig, McpSource } from 'vocs/config'

export default defineConfig({
  title: 'Railnet SDK',
  description: 'TypeScript SDK for interacting with the Railnet protocol',
  srcDir: 'docs',
  outDir: 'docs/dist',
  renderStrategy: 'partial-static',
  baseUrl: 'https://sdk.railnet.org',
  sitemap: false,
  head: { meta: { robots: 'noindex, nofollow' } },
  ogImageUrl: (pagePath, { baseUrl }) =>
    `${baseUrl}/api/og?title=%title&description=%description&section=${pagePath.split('/').filter(Boolean)[0] ?? ''}`,
  mcp: {
    enabled: true,
    sources: [McpSource.github({ name: 'railnet-sdk', repo: 'railnetorg/railnet-sdk' })],
  },
  accentColor: 'light-dark(#cc3f00, #ff9465)',
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  sidebar: [
    {
      text: 'Introduction',
      link: '/',
    },
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'AI Agents',
      link: '/agents',
    },
    {
      text: 'Actions',
      collapsed: false,
      items: [
        {
          text: 'build*Call (Call Builders)',
          link: '/actions/callBuilders',
        },
        {
          text: 'Conduit',
          items: [
            {
              text: 'getConduitPosition',
              link: '/actions/getConduitPosition',
            },
            {
              text: 'getConduitInfo',
              link: '/actions/getConduitInfo',
            },
            {
              text: 'buildDepositConduitCall',
              link: '/actions/buildDepositConduitCall',
            },
            {
              text: 'buildRedeemConduitCall',
              link: '/actions/buildRedeemConduitCall',
            },
            {
              text: 'getDepositConduitCall',
              link: '/actions/getDepositConduitCall',
            },
            {
              text: 'getRedeemConduitCall',
              link: '/actions/getRedeemConduitCall',
            },
            {
              text: 'buildSpawnConduitCall',
              link: '/actions/buildSpawnConduitCall',
            },
            {
              text: 'buildEnableConduitCall',
              link: '/actions/buildEnableConduitCall',
            },
            {
              text: 'estimateConduit',
              link: '/actions/estimateConduit',
            },
            {
              text: 'predictConduitDeployment',
              link: '/actions/predictConduitDeployment',
            },
            {
              text: 'buildFinalizeConduitDepositCall',
              link: '/actions/buildFinalizeConduitDepositCall',
            },
            {
              text: 'buildProcessConduitQueryCall',
              link: '/actions/buildProcessConduitQueryCall',
            },
          ],
        },
        {
          text: 'MultiVehicle',
          items: [
            {
              text: 'buildSpawnMultiVehicleCall',
              link: '/actions/buildSpawnMultiVehicleCall',
            },
            {
              text: 'buildAuthorizeVehicleCall',
              link: '/actions/buildAuthorizeVehicleCall',
            },
            {
              text: 'buildSetQueuesCall',
              link: '/actions/buildSetQueuesCall',
            },
            {
              text: 'buildMoveBetweenSectorsCall',
              link: '/actions/buildMoveBetweenSectorsCall',
            },
            {
              text: 'buildDispatchVehicleCall',
              link: '/actions/buildDispatchVehicleCall',
            },
          ],
        },
        {
          text: 'Access Control',
          items: [
            {
              text: 'buildSpawnAccessControlCall',
              link: '/actions/buildSpawnAccessControlCall',
            },
            {
              text: 'buildGrantScopedRoleCall',
              link: '/actions/buildGrantScopedRoleCall',
            },
            {
              text: 'buildRevokeScopedRoleCall',
              link: '/actions/buildRevokeScopedRoleCall',
            },
            {
              text: 'buildSetScopedRolePublicCall',
              link: '/actions/buildSetScopedRolePublicCall',
            },
          ],
        },
        {
          text: 'Vehicle',
          items: [
            {
              text: 'buildSpawnAaveV3VehicleCall',
              link: '/actions/buildSpawnAaveV3VehicleCall',
            },
          ],
        },
        {
          text: 'Asset Registry',
          items: [
            {
              text: 'getInitialDepositAmount',
              link: '/actions/getInitialDepositAmount',
            },
          ],
        },
      ],
    },
    {
      text: 'Workflows',
      collapsed: false,
      items: [
        {
          text: 'Deploying a multi-vehicle',
          link: '/workflows/deployingAMultiVehicle',
        },
      ],
    },
    {
      text: 'Utilities',
      collapsed: false,
      items: [
        { text: 'Receipt Helpers', link: '/utilities/receiptHelpers' },
        { text: 'randomSalt', link: '/utilities/randomSalt' },
        { text: 'Query identity', link: '/utilities/queryIdentity' },
        { text: 'toCall', link: '/utilities/toCall' },
      ],
    },
    {
      text: 'Contracts',
      collapsed: false,
      items: [
        {
          text: 'getAddresses',
          link: '/contracts/getAddresses',
        },
        {
          text: 'isSupportedChain',
          link: '/contracts/isSupportedChain',
        },
        {
          text: 'Staging deployments',
          link: '/contracts/staging',
        },
      ],
    },
    {
      text: 'Constants',
      collapsed: false,
      items: [
        {
          text: 'Roles',
          link: '/constants/roles',
        },
      ],
    },
    {
      text: 'React',
      collapsed: false,
      items: [
        {
          text: 'Conduit',
          items: [
            {
              text: 'useConduitPosition',
              link: '/react/useConduitPosition',
            },
            {
              text: 'useConduitInfo',
              link: '/react/useConduitInfo',
            },
            {
              text: 'useEstimateConduit',
              link: '/react/useEstimateConduit',
            },
            {
              text: 'usePredictConduitDeployment',
              link: '/react/usePredictConduitDeployment',
            },
            {
              text: 'useDepositConduitCall',
              link: '/react/useDepositConduitCall',
            },
            {
              text: 'useRedeemConduitCall',
              link: '/react/useRedeemConduitCall',
            },
          ],
        },
        {
          text: 'Sending a call',
          link: '/react/sendingCalls',
        },
      ],
    },
    {
      text: 'Query Options',
      collapsed: false,
      items: [
        {
          text: 'conduitPositionQueryOptions',
          link: '/query/conduitPositionQueryOptions',
        },
        {
          text: 'conduitInfoQueryOptions',
          link: '/query/conduitInfoQueryOptions',
        },
        {
          text: 'estimateConduitQueryOptions',
          link: '/query/estimateConduitQueryOptions',
        },
        {
          text: 'predictConduitDeploymentQueryOptions',
          link: '/query/predictConduitDeploymentQueryOptions',
        },
        {
          text: 'depositConduitCallQueryOptions',
          link: '/query/depositConduitCallQueryOptions',
        },
        {
          text: 'redeemConduitCallQueryOptions',
          link: '/query/redeemConduitCallQueryOptions',
        },
      ],
    },
    {
      text: 'Types',
      collapsed: false,
      items: [
        {
          text: 'ChainAddresses',
          link: '/types/ChainAddresses',
        },
        {
          text: 'ConduitPosition',
          link: '/types/ConduitPosition',
        },
        {
          text: 'ConduitInfo',
          link: '/types/ConduitInfo',
        },
        {
          text: 'Asset',
          link: '/types/Asset',
        },
        {
          text: 'Interception',
          link: '/types/Interception',
        },
        {
          text: 'Sector',
          link: '/types/Sector',
        },
        {
          text: 'Enums',
          link: '/types/Enums',
        },
      ],
    },
  ],
})
