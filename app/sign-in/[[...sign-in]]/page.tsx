import { SignIn } from '@clerk/nextjs'

export const metadata = { title: 'Sign In — Creatiq' }

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'var(--dash-bg)', padding: '20px' }}
    >
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            color: 'var(--acid)',
            letterSpacing: '0.05em',
          }}
        >
          CREATIQ
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '10px',
            color: 'var(--dash-text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            marginTop: '4px',
          }}
        >
          Creative Analytics
        </div>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: { width: '100%', maxWidth: '400px' },
            card: {
              background: 'var(--dash-bg2)',
              border: '1px solid var(--dash-border)',
              borderRadius: '8px',
            },
          },
        }}
      />
    </div>
  )
}
