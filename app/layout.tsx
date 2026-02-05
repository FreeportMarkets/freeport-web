import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freeport',
  description: 'Trade smarter with Freeport',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        backgroundColor: '#0d0d0e',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {children}
      </body>
    </html>
  );
}
