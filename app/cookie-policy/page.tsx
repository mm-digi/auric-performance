import type { Metadata } from "next";
import { getLegalPage } from "../legal-pages";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Auric Performance uses cookies and similar technologies and how visitors can control their choices." };
export default function CookiePolicyPage() {
  const page = getLegalPage("cookie-policy");
  return <main><section className="page-hero"><div className="wrap"><div className="kicker">Cookies &amp; online choices</div><h1 className="display">Cookie <span>Policy</span></h1><p className="lead">How Auric Performance uses cookies and similar technologies, and how you can control your choices.</p></div></section><article className="wrap privacy-policy legal-policy"><p className="price-note">Effective 14 July 2026 · Last reviewed 14 July 2026</p><div dangerouslySetInnerHTML={{ __html: page?.body ?? "" }} /></article></main>;
}
