import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       'CampusConnect — University Achievement Platform',
  description: 'Submit, verify, and showcase your university achievements. Built for students, teachers, and administrators.',
  keywords:    'university achievements, student portfolio, achievement verification, campus',
  authors:     [{ name: 'CampusConnect' }],
  openGraph: {
    title:       'CampusConnect',
    description: 'University Achievement Verification Platform',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
