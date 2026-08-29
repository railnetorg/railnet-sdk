import { Handler } from 'vocs/server'

// Content width is 1056px (1200 - 2x72 padding).
function toTitleFontSize(title: string) {
  if (title.length <= 20) return 72
  if (title.length <= 28) return 56
  return 44
}

function toSectionLabel(section: string | null) {
  if (!section) return 'Overview'
  return section.charAt(0).toUpperCase() + section.slice(1)
}

export default function handler(request: Request) {
  const requestUrl = new URL(request.url)
  const section = toSectionLabel(requestUrl.searchParams.get('section'))
  const logoUrl = new URL('/logo-dark.svg', requestUrl.origin).href

  return Handler.og(({ title, description }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 72,
        backgroundColor: '#141414',
        backgroundImage: 'linear-gradient(135deg, #141414 45%, #3a1a10 100%)',
      }}
    >
      {/* The SVG has only a viewBox, so the 98:16 ratio must be pinned on both axes. */}
      <img alt="" src={logoUrl} style={{ width: 345, height: 56 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 26, color: '#FD5100' }}>{section}</div>
        <div
          style={{
            fontSize: toTitleFontSize(title),
            fontWeight: 700,
            color: '#F8EBE5',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {description ? (
          <div style={{ fontSize: 28, color: 'rgba(248, 235, 229, 0.6)', maxWidth: 900 }}>
            {description}
          </div>
        ) : null}
      </div>
    </div>
  )).fetch(request)
}
