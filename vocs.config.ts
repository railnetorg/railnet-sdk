import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Railnet SDK',
  description: 'TypeScript SDK for interacting with the Railnet protocol',
  rootDir: 'docs',
  iconUrl: '/favicon.png',
  logoUrl: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  font: {
    default: {
      google: 'Inter Tight',
    },
  },
  theme: {
    accentColor: { light: '#CC3F00', dark: '#FD5100' },
    variables: {
      color: {
        background: { light: '#ffffff', dark: '#141414' },
        background2: { light: '#f7f4f2', dark: '#1a1a1a' },
        background3: { light: '#eee9e6', dark: '#222222' },
        background4: { light: '#e5dfdb', dark: '#2a2a2a' },
        background5: { light: '#faf8f7', dark: '#0a0a0a' },
        backgroundAccent: { light: '#fff0e6', dark: '#500000' },
        backgroundAccentHover: { light: '#ffe0cc', dark: '#6b0000' },
        backgroundAccentText: { light: '#1a1210', dark: '#F8EBE5' },
        backgroundDark: { light: '#f7f4f2', dark: '#0c0c0c' },
        backgroundDarkTint: { light: '#eee9e6', dark: '#1a1a1a' },
        border: { light: '#e5dfdb', dark: '#2a2a2a' },
        border2: { light: '#d4ccc6', dark: '#333333' },
        borderAccent: { light: '#CC3F00', dark: '#FD5100' },
        heading: { light: '#1a1210', dark: '#F8EBE5' },
        title: { light: '#1a1210', dark: '#F8EBE5' },
        text: { light: '#1a1210', dark: '#F8EBE5' },
        text2: { light: '#4a3f38', dark: '#d4c4bb' },
        text3: { light: '#7a6e67', dark: '#9a8e87' },
        text4: { light: '#9a8e87', dark: '#6b6260' },
        textAccent: { light: '#CC3F00', dark: '#FD5100' },
        textAccentHover: { light: '#a33300', dark: '#CC3F00' },
        textHover: { light: '#000000', dark: '#ffffff' },
        shadow: { light: 'rgba(0, 0, 0, 0.06)', dark: 'rgba(0, 0, 0, 0.3)' },
        shadow2: { light: 'rgba(0, 0, 0, 0.1)', dark: 'rgba(0, 0, 0, 0.5)' },
        codeBlockBackground: { light: '#faf8f7', dark: '#0c0c0c' },
        codeInlineBackground: { light: 'rgba(204, 63, 0, 0.06)', dark: 'rgba(253, 81, 0, 0.08)' },
        codeInlineBorder: { light: 'rgba(204, 63, 0, 0.12)', dark: 'rgba(253, 81, 0, 0.15)' },
        codeInlineText: { light: '#CC3F00', dark: '#FD5100' },
        codeHighlightBackground: {
          light: 'rgba(204, 63, 0, 0.05)',
          dark: 'rgba(253, 81, 0, 0.06)',
        },
        codeHighlightBorder: { light: '#CC3F00', dark: '#500000' },
        codeTitleBackground: { light: '#f7f4f2', dark: '#141414' },
        link: { light: '#CC3F00', dark: '#FD5100' },
        linkHover: { light: '#a33300', dark: '#CC3F00' },
        tableBorder: { light: '#e5dfdb', dark: '#2a2a2a' },
        tableHeaderBackground: { light: '#f7f4f2', dark: '#1a1a1a' },
        tableHeaderText: { light: '#1a1210', dark: '#F8EBE5' },
        tipBackground: { light: 'rgba(204, 63, 0, 0.04)', dark: 'rgba(253, 81, 0, 0.05)' },
        tipBorder: { light: '#CC3F00', dark: '#FD5100' },
        tipText: { light: '#CC3F00', dark: '#FD5100' },
        tipTextHover: { light: '#a33300', dark: '#CC3F00' },
        warningBackground: { light: 'rgba(204, 63, 0, 0.04)', dark: 'rgba(204, 63, 0, 0.05)' },
        warningBorder: { light: '#CC3F00', dark: '#CC3F00' },
        warningText: { light: '#CC3F00', dark: '#CC3F00' },
        warningTextHover: { light: '#a33300', dark: '#FD5100' },
        dangerBackground: { light: 'rgba(204, 63, 0, 0.06)', dark: 'rgba(204, 63, 0, 0.08)' },
        dangerBorder: { light: '#CC3F00', dark: '#CC3F00' },
        dangerText: { light: '#CC3F00', dark: '#CC3F00' },
        dangerTextHover: { light: '#a33300', dark: '#FD5100' },
        searchHighlightBackground: { light: '#CC3F00', dark: '#FD5100' },
        searchHighlightText: { light: '#ffffff', dark: '#0c0c0c' },
      },
      fontFamily: {
        default: '"Inter Tight", system-ui, -apple-system, sans-serif',
        mono: '"JetBrains Mono", "Fira Code", monospace',
      },
      borderRadius: {
        0: '0px',
        2: '0px',
        3: '0px',
        4: '0px',
        6: '0px',
        8: '0px',
        round: '0px',
      },
    },
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
      text: 'Actions',
      collapsed: false,
      items: [
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
          text: 'Enums',
          link: '/types/Enums',
        },
      ],
    },
  ],
})
