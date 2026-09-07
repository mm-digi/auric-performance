import Link from "next/link";

export type LegalSection = { title: string; body: React.ReactNode };

export default function LegalPage({ kicker, title, intro, sections }: { kicker: string; title: string; intro: string; sections: LegalSection[] }) {
  return <main><section className="page-hero legal-hero"><div className="wrap"><div className="kicker">{kicker}</div><h1 className="display">{title}</h1><p className="lead">{intro}</p><span className="legal-date">Last reviewed: 14 July 2026</span></div></section><article className="legal-content wrap">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><div>{section.body}</div></section>)}<aside className="legal-contact"><strong>Questions?</strong><span>Email info@auricperformance.co.uk</span><Link href="/contact" className="text-link">Contact Auric Performance →</Link></aside></article></main>;
}
