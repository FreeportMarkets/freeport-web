export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#0a0a0a',
    }}>
      {/* Logo in rounded container */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        padding: 12,
      }}>
        <img
          src="/logo-boat.png"
          alt="Freeport"
          width={56}
          height={56}
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <h1 style={{
        fontSize: 48,
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: 12,
        marginTop: 0,
        letterSpacing: '-1px',
      }}>
        Freeport
      </h1>
      <p style={{
        color: '#a1a1aa',
        fontSize: 18,
        marginBottom: 40,
        marginTop: 0,
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 1.5,
      }}>
        Trade smarter with real-time signals
      </p>
      <a
        href="https://apps.apple.com/app/freeport/id6745072874"
        style={{
          padding: '16px 40px',
          backgroundColor: '#1d9bf0',
          color: '#fff',
          borderRadius: 9999,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 17,
        }}
      >
        Download on iOS
      </a>
      <p style={{
        marginTop: 56,
        color: '#52525b',
        fontSize: 13,
      }}>
        Available on the App Store
      </p>
    </div>
  );
}
