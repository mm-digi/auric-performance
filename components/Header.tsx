"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/programmes", label: "Programmes" },
  { href: "/store", label: "Store" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Auric Performance"
            width={46}
            height={46}
            priority
          />
          <span className="brand-text">
            <strong>
              Auric <span>Performance</span>
            </strong>
            <small>Physical Performance Coaching</small>
          </span>
        </Link>

        <nav className={open ? "nav open" : "nav"}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-gold" onClick={() => setOpen(false)}>
            Book a call
          </Link>
        </nav>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
