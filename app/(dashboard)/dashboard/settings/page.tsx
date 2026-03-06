export const metadata = { title: 'Settings — Creatiq' }

export default function SettingsPage() {
  return (
    <>
      <div
        className="sticky top-0 z-40 shrink-0 flex items-center gap-4"
        style={{
          height: '56px',
          borderBottom: '1px solid var(--dash-border)',
          padding: '0 28px',
          background: 'var(--dash-bg)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--dash-text)',
            flex: 1,
          }}
        >
          Settings
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center dashboard-scroll" style={{ padding: '28px' }}>
        <div className="text-center">
          <h2
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--dash-text)',
              marginBottom: '8px',
            }}
          >
            Settings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
            Manage your account, API keys, and integrations.
          </p>
        </div>
      </div>
    </>
  )
}
