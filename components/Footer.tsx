import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <Link href="/" className="brand">
              <Image src="/images/logo.png" alt="" width={46} height={46} />
              <span className="brand-text">
                <strong>
                  Auric <span>Performance</span>
                </strong>
                <small>Physical Performance Coaching</small>
              </span>
            </Link>
            <p style={{ marginTop: 18, maxWidth: 420 }}>
              Evidence-informed performance coaching for people who want
              strength, endurance, work capacity and measurable progress.
            </p>
            <div className="socials">
              <a
                href="https://www.instagram.com/auricperformance/"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61589179450146"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/auric-perfomance/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 10v7M8 7.5v.5M12 17v-4.2a2.3 2.3 0 0 1 4.6 0V17" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3>Explore</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/programmes">Programmes</Link>
              </li>
              <li>
                <Link href="/programmes#plans">Plans</Link>
              </li>
              <li>
                <Link href="/store">Store</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="mailto:info@auricperformance.co.uk">
                  info@auricperformance.co.uk
                </a>
              </li>
              <li>
                <Link href="/contact">Book a call with Alex or Courtney</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Auric Performance. All rights reserved.</span>
          <span>United Kingdom</span>
        </div>
      </div>
    </footer>
  );
}
