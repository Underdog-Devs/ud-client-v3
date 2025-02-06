import Layout from "../components/Layout";
import "./styles/index.scss";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UnderdogDevs - helping aspiring developers who are either formerly incarcerated or from a disadvantaged background.',
  description: 'We are a group of software engineers helping aspiring developers who are either formerly incarcerated or from an economically disadvantaged background. We are creating opportunities in tech for people who might not otherwise get an opportunity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#fff9f4' }}>
        <Layout>
            {children}
          </Layout>
      </body>
    </html>
  );
}
