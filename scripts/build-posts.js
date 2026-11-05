const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "blog", "posts");
const OUT_FILE = path.join(__dirname, "..", "blog", "posts.json");

function parseFrontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: src.slice(m[0].length) };
}

function firstParagraph(body) {
  const noCode = body.replace(/```[\s\S]*?```/g, "");
  const para = noCode
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.trim())
    .find(p => p && !p.startsWith("#") && !p.startsWith("![") && !p.startsWith(">") && !p.startsWith("|"));
  return (para || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")      // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")   // links -> text
    .replace(/[*_`]/g, "")                     // emphasis / inline code
    .replace(/\s+/g, " ")
    .trim();
}

function readTime(body) {
  const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const posts = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith(".md"))
  .map(f => {
    const id = path.basename(f, ".md");
    const { meta, body } = parseFrontMatter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
    if (meta.draft === "true") return null;
    return {
      title: meta.title || id,
      date: meta.date,
      url: `/blog/post?id=${id}`,
      readTime: meta.readTime || readTime(body),
      description: meta.description || firstParagraph(body),
      ...(meta.category && { category: meta.category }),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.date.localeCompare(b.date));

fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2) + "\n");
console.log(`Wrote ${posts.length} posts to ${path.relative(process.cwd(), OUT_FILE)}`);