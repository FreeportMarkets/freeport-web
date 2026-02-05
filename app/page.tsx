export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#000000',
    }}>
      <h1 style={{
        fontSize: 56,
        fontWeight: 700,
        color: '#e7e9ea',
        marginBottom: 12,
        letterSpacing: '-1px',
      }}>
        Freeport
      </h1>
      <p style={{
        color: '#71767b',
        fontSize: 18,
        marginBottom: 32,
      }}>
        Trade smarter with real-time signals
      </p>
      <a
        href="https://apps.apple.com/app/freeport/id6745072874"
        style={{
          padding: '16px 32px',
          backgroundColor: '#1d9bf0',
          color: '#fff',
          borderRadius: 9999,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Download Freeport
      </a>
      <p style={{
        marginTop: 48,
        color: '#71767b',
        fontSize: 14,
      }}>
        Available on iOS
      </p>
    </div>
  );
}
