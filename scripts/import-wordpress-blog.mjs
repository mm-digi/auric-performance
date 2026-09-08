import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const xml = readFileSync(resolve("..", "auricperformance.WordPress.2026-07-28.xml"), "utf8");
const wanted = [
  "how-to-prepare-for-selection-without-burning-out",
  "return-to-training-after-injury-a-smarter-starting-point",
  "strength-conditioning-for-tactical-roles",
  "how-to-build-running-fitness-without-losing-strength",
  "common-selection-prep-mistakes-that-cost-progress",
  "what-is-return-to-capability",
  "training-through-fatigue-when-to-push-and-when-to-back-off",
];
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#039;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const clean = (value) => decode(value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim());
const match = (value, expression, fallback = "") => clean(value.match(expression)?.[1] ?? fallback);

const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((entry) => entry[1]).map((item) => {
  const slug = match(item, /<wp:post_name[^>]*>([\s\S]*?)<\/wp:post_name>/);
  if (!wanted.includes(slug)) return null;
  const content = match(item, /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/);
  const meta = content.match(/<div class="ap-post-meta">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const metaParts = [...meta.matchAll(/<span>(.*?)<\/span>/g)].map((part) => part[1].trim());
  const body = content.match(/<div class="ap-article-body ap-reveal">([\s\S]*?)<div class="ap-article-divider"/)?.[1].trim() ?? "";
  const imageUrl = content.match(/\.ap-hero-media::before[\s\S]*?background-image:\s*url\('([^']+)'\)/)?.[1] ?? "";
  return {
    slug,
    title: match(item, /<title>([\s\S]*?)<\/title>/),
    description: decode(content.match(/<meta name="description" content="([^"]+)">/)?.[1] ?? ""),
    category: metaParts[0] ?? "Performance",
    readTime: metaParts[1] ?? "6 Min Read",
    date: metaParts[2] ?? "02 June 2026",
    image: `/blog/${basename(imageUrl)}`,
    body,
  };
}).filter(Boolean).sort((a, b) => wanted.indexOf(a.slug) - wanted.indexOf(b.slug));

writeFileSync(resolve("app", "blog", "posts.ts"), `export type BlogPost = { slug: string; title: string; description: string; category: string; readTime: string; date: string; image: string; body: string; };\n\nexport const posts: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n\nexport function getPost(slug: string) { return posts.find((post) => post.slug === slug); }\n`);
console.log(`Imported ${posts.length} WordPress articles.`);
