import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const GTM_ID = 'GTM-MHMCGJ6M'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aurorafac.co.kr'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { template: '%s | 오로라팩', default: '오로라팩' },
  description: '포장재 전문 공장직 쇼핑몰. 발포지·에어캡봉투·보냉봉투·라미봉투를 합리적인 가격으로 만나보세요.',
  openGraph: {
    siteName: '오로라팩',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/aurora_logo.jpg', width: 800, height: 600, alt: '오로라팩 로고' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '주식회사 오로라팩',
  url: BASE_URL,
  logo: `${BASE_URL}/images/aurora_logo.jpg`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '010-2603-1599',
    contactType: 'customer service',
    areaServed: 'KR',
    availableLanguage: 'Korean',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '보개면 오두리 161',
    addressLocality: '안성시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="2768adfa2c05844d8366f8187d1838a87beb6914"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.className}`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  )
}
