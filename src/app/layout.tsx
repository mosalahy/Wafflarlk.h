import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Field Force Manager - Global Time Zone Clock',
  description: 'Production-ready Arabic-first field sales management platform with global time zone tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
