import type { Metadata } from "next";
import { getLegalPage } from "../legal-pages";

export const metadata: Metadata = { title: "Terms and Conditions", description: "Terms governing the Auric Performance website, coaching, programming and related services." };
export default function TermsPage() {
  const page = getLegalPage("terms-and-conditions");
  return <main><section className="page-hero"><div className="wrap"><div className="kicker">Website &amp; service terms</div><h1 className="display">Terms &amp; <span>Conditions</span></h1><p className="lead">The terms governing use of our website and the purchase or use of Auric Performance services.</p></div></section><article className="wrap privacy-policy legal-policy"><p className="price-note">Effective 14 July 2026 · Last reviewed 14 July 2026</p><div dangerouslySetInnerHTML={{ __html: page?.body ?? "" }} /></article></main>;
}
