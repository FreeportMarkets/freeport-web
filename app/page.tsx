export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>Freeport</h1>
      <p style={{ color: '#6b7280', fontSize: 18 }}>Trade smarter.</p>
      <a
        href="https://apps.apple.com/app/freeport/id6745072874"
        style={{
          marginTop: 32,
          padding: '16px 32px',
          backgroundColor: '#4d91f0',
          color: '#fff',
          borderRadius: 12,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        Get Freeport
      </a>
    </div>
  );
}
