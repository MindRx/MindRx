import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindRx',
  description: 'Cognitive state simulation for AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="app-container min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
