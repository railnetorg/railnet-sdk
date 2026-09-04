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
          text: 'prepare* (Prepared Writes)',
          link: '/actions/preparedWrites',
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
              text: 'depositConduit',
              link: '/actions/depositConduit',
            },
            {
              text: 'redeemConduit',
              link: '/actions/redeemConduit',
            },
            {
              text: 'spawnConduit',
              link: '/actions/spawnConduit',
            },
            {
              text: 'enableConduit',
              link: '/actions/enableConduit',
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
              text: 'finalizeConduitDeposit',
              link: '/actions/finalizeConduitDeposit',
            },
            {
              text: 'processConduitQuery',
              link: '/actions/processConduitQuery',
            },
          ],
        },
        {
          text: 'MultiVehicle',
          items: [
            {
              text: 'spawnMultiVehicle',
              link: '/actions/spawnMultiVehicle',
            },
            {
              text: 'authorizeVehicle',
              link: '/actions/authorizeVehicle',
            },
            {
              text: 'setQueues',
              link: '/actions/setQueues',
            },
            {
              text: 'moveBetweenSectors',
              link: '/actions/moveBetweenSectors',
            },
            {
              text: 'dispatchVehicle',
              link: '/actions/dispatchVehicle',
            },
          ],
        },
        {
          text: 'Access Control',
          items: [
            {
              text: 'spawnAccessControl',
              link: '/actions/spawnAccessControl',
            },
            {
              text: 'grantScopedRole',
              link: '/actions/grantScopedRole',
            },
            {
              text: 'revokeScopedRole',
              link: '/actions/revokeScopedRole',
            },
            {
              text: 'setScopedRolePublic',
              link: '/actions/setScopedRolePublic',
            },
          ],
        },
        {
          text: 'Vehicle',
          items: [
            {
              text: 'spawnAaveV3Vehicle',
              link: '/actions/spawnAaveV3Vehicle',
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
          text: 'deployMultiVehicle',
          link: '/workflows/deployMultiVehicle',
        },
      ],
    },
    {
      text: 'Utilities',
      collapsed: false,
      items: [
        { text: 'Receipt Helpers', link: '/utilities/receiptHelpers' },
        { text: 'randomSalt', link: '/utilities/randomSalt' },
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
              text: 'useDepositConduit',
              link: '/react/useDepositConduit',
            },
            {
              text: 'useRedeemConduit',
              link: '/react/useRedeemConduit',
            },
            {
              text: 'useSpawnConduit',
              link: '/react/useSpawnConduit',
            },
            {
              text: 'useEnableConduit',
              link: '/react/useEnableConduit',
            },
            {
              text: 'useFinalizeConduitDeposit',
              link: '/react/useFinalizeConduitDeposit',
            },
            {
              text: 'useProcessConduitQuery',
              link: '/react/useProcessConduitQuery',
            },
          ],
        },
        {
          text: 'MultiVehicle',
          items: [
            {
              text: 'useSpawnMultiVehicle',
              link: '/react/useSpawnMultiVehicle',
            },
            {
              text: 'useAuthorizeVehicle',
              link: '/react/useAuthorizeVehicle',
            },
            {
              text: 'useSetQueues',
              link: '/react/useSetQueues',
            },
            {
              text: 'useDeployMultiVehicle',
              link: '/react/useDeployMultiVehicle',
            },
          ],
        },
        {
          text: 'Access Control',
          items: [
            {
              text: 'useSpawnAccessControl',
              link: '/react/useSpawnAccessControl',
            },
            {
              text: 'useGrantScopedRole',
              link: '/react/useGrantScopedRole',
            },
            {
              text: 'useRevokeScopedRole',
              link: '/react/useRevokeScopedRole',
            },
            {
              text: 'useSetScopedRolePublic',
              link: '/react/useSetScopedRolePublic',
            },
          ],
        },
        {
          text: 'Vehicle',
          items: [
            {
              text: 'useSpawnAaveV3Vehicle',
              link: '/react/useSpawnAaveV3Vehicle',
            },
          ],
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
