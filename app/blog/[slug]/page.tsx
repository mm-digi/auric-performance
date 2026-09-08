import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "../posts";

export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.description, openGraph: { images: [post.image], type: "article" } } : {};
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <main><article>
    <header className={`blog-post-hero blog-post-hero--${post.slug}`}><Image src={post.image} alt="" fill priority sizes="100vw" /><div className="blog-post-shade" /><div className="wrap blog-post-heading"><div className="kicker">{post.category} · {post.readTime} · {post.date}</div><h1>{post.title}</h1><p>{post.description}</p></div></header>
    <section className="section"><div className="blog-article" dangerouslySetInnerHTML={{ __html: post.body }} /><div className="blog-back"><Link href="/blog" className="btn">← All articles</Link><Link href="/contact" className="btn btn-gold">Ask about coaching</Link></div></section>
  </article></main>;
}
