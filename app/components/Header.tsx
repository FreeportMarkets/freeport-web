/**
 * Minimal site header — dark, inline-style consistent with the rest of the site.
 * Renders the Freeport wordmark (linking /) and a "Predict" nav link (/predict).
 * Server component (no 'use client' needed — no interactivity).
 */

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #27272a',
    width: '100%',
  },
  inner: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 20px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  wordmark: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: '#a1a1aa',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 8,
    transition: 'color 0.15s',
  },
  navLinkActive: {
    fontSize: 14,
    fontWeight: 600,
    color: '#ffffff',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 8,
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
  },
};

interface HeaderProps {
  activePath?: string;
}

export default function Header({ activePath }: HeaderProps) {
  const isPredictActive = activePath?.startsWith('/predict');

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* Wordmark */}
        <a href="/" style={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-boat.png"
            alt=""
            width={24}
            height={24}
            style={{ objectFit: 'contain' }}
          />
          <span style={styles.wordmark}>Freeport</span>
        </a>

        {/* Nav */}
        <nav style={styles.nav} aria-label="Site navigation">
          <a
            href="/predict"
            style={isPredictActive ? styles.navLinkActive : styles.navLink}
            aria-current={isPredictActive ? 'page' : undefined}
          >
            Predict
          </a>
        </nav>
      </div>
    </header>
  );
}
