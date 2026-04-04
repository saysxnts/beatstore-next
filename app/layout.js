import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import Cart from "./components/Cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buy Beats - saysxnts",
  description: "Official beat store",
};

const MARQUEE_TEXT = "SAYSXNTS · BEAT STORE · EXCLUSIVE BEATS · TRAP · DRILL · HIP-HOP · PREMIUM QUALITY · ";
const HERO_MARQUEE_TEXT = " PROMO ALL $19,95 ";

export default function RootLayout({ children }) {
  const paypalSrc = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <Navbar />

          <div className="site-wrapper">
            <header className="main-header">
              <video
                className="header-video"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/header.gif"
              >
                <source src="/videos/header.mp4" type="video/mp4" />
                <img src="/images/header.gif" alt="header gif" className="header-gif" />
              </video>
            </header>

            {/* Hero marquee divider */}
            <div className="hero-marquee">
              <div className="marquee-track" style={{ animationDuration: '30s' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i}>{HERO_MARQUEE_TEXT}</span>
                ))}
              </div>
            </div>

            {children}
          </div>

          <Player />
          <Cart />

          <footer className="site-footer">
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/saysxnts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com/@saysxnts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <p className="footer-copyright">
              I hereby inform you that none of the beats have exclusive rights or licenses. <br /><br />
              ©2026 saysxnts.<br /> All rights reserved.
            </p>
          </footer>
        </StoreProvider>

        <Script src={paypalSrc} strategy="lazyOnload" />
      </body>
    </html>
  );
}