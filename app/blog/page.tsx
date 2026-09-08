import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = { title: "Blog", description: "Practical guidance on hybrid performance, tactical preparation, rehabilitation and recovery from Auric Performance." };

export default function BlogPage() {
  return <main>
    <section className="page-hero blog-hero"><div className="wrap"><div className="kicker">Auric insights</div><h1 className="display">TRAIN WITH <span>INTENT</span></h1><p className="lead">Practical guidance for building strength, endurance, resilience and real-world capability.</p></div></section>
    <section className="section"><div className="wrap blog-grid">{posts.map((post) => <article className="blog-card" key={post.slug}>
      <Link href={`/blog/${post.slug}`} className="blog-card-image"><Image src={post.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" /></Link>
      <div className="blog-card-copy"><div className="kicker">{post.category} · {post.readTime}</div><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p><Link href={`/blog/${post.slug}`} className="text-link">Read article →</Link></div>
    </article>)}</div></section>
  </main>;
}
