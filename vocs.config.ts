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
    accentColor: '#FD5100',
    colorScheme: 'dark',
    variables: {
      color: {
        background: '#141414',
        background2: '#1a1a1a',
        background3: '#222222',
        background4: '#2a2a2a',
        background5: '#0a0a0a',
        backgroundAccent: '#500000',
        backgroundAccentHover: '#6b0000',
        backgroundAccentText: '#F8EBE5',
        backgroundDark: '#0c0c0c',
        backgroundDarkTint: '#1a1a1a',
        border: '#2a2a2a',
        border2: '#333333',
        borderAccent: '#FD5100',
        heading: '#F8EBE5',
        title: '#F8EBE5',
        text: '#F8EBE5',
        text2: '#d4c4bb',
        text3: '#9a8e87',
        text4: '#6b6260',
        textAccent: '#FD5100',
        textAccentHover: '#CC3F00',
        textHover: '#ffffff',
        shadow: 'rgba(0, 0, 0, 0.3)',
        shadow2: 'rgba(0, 0, 0, 0.5)',
        codeBlockBackground: '#0c0c0c',
        codeInlineBackground: 'rgba(253, 81, 0, 0.08)',
        codeInlineBorder: 'rgba(253, 81, 0, 0.15)',
        codeInlineText: '#FD5100',
        codeHighlightBackground: 'rgba(253, 81, 0, 0.06)',
        codeHighlightBorder: '#500000',
        codeTitleBackground: '#141414',
        link: '#FD5100',
        linkHover: '#CC3F00',
        tableBorder: '#2a2a2a',
        tableHeaderBackground: '#1a1a1a',
        tableHeaderText: '#F8EBE5',
        tipBackground: 'rgba(253, 81, 0, 0.05)',
        tipBorder: '#FD5100',
        tipText: '#FD5100',
        tipTextHover: '#CC3F00',
        warningBackground: 'rgba(204, 63, 0, 0.05)',
        warningBorder: '#CC3F00',
        warningText: '#CC3F00',
        warningTextHover: '#FD5100',
        dangerBackground: 'rgba(204, 63, 0, 0.08)',
        dangerBorder: '#CC3F00',
        dangerText: '#CC3F00',
        dangerTextHover: '#FD5100',
        searchHighlightBackground: '#FD5100',
        searchHighlightText: '#0c0c0c',
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
      text: 'React',
      collapsed: false,
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
      text: 'TanStack Query',
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
