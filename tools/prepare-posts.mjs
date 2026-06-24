import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const POSTS_DIR = "source/_posts";
const SITE_TIME_ZONE = "Asia/Shanghai";

function parseFrontMatter(content) {
  const normalized = content.replace(/^\ufeff/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return {
      frontMatter: "",
      body: normalized,
      hasFrontMatter: false,
    };
  }

  const endIndex = normalized.indexOf("\n---", 4);
  if (endIndex === -1) {
    return {
      frontMatter: "",
      body: normalized,
      hasFrontMatter: false,
    };
  }

  const afterFence = normalized[endIndex + 4] === "\n" ? endIndex + 5 : endIndex + 4;
  return {
    frontMatter: normalized.slice(4, endIndex),
    body: normalized.slice(afterFence),
    hasFrontMatter: true,
  };
}

function hasFrontMatterField(frontMatter, key) {
  const pattern = new RegExp(`^${key}\\s*:`, "m");
  return pattern.test(frontMatter);
}

function quoteYaml(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function titleizeSlug(slug) {
  return slug
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[\p{Letter}\p{Number}]/gu, (match) => match.toUpperCase());
}

function firstHeading(body) {
  const match = body.match(/^#\s+(.+?)\s*#*\s*$/m);
  if (!match) return null;
  return {
    title: match[1].trim(),
    line: match[0],
    index: match.index ?? 0,
  };
}

function removeLeadingHeading(body, heading) {
  const beforeHeading = body.slice(0, heading.index);
  if (beforeHeading.trim()) return body;
  const afterHeading = body.slice(heading.index + heading.line.length);
  return afterHeading.replace(/^\n{1,2}/, "");
}

export function deriveTitle(body, filePath) {
  const heading = firstHeading(body);
  if (heading) return heading.title;

  const basename = path.basename(filePath, path.extname(filePath));
  return titleizeSlug(basename) || "Untitled";
}

export function derivePermalink(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  const match = normalized.match(/(?:^|\/)source\/_posts\/(\d{4})\/(.+)\.md$/);
  if (match) {
    return `${match[1]}/${slugifyPath(match[2])}/`;
  }

  const basename = path.basename(filePath, path.extname(filePath));
  return `${slugifyPath(basename)}/`;
}

function slugifyPath(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function preparePostContent({ content, filePath, createdAt, updatedAt }) {
  const parsed = parseFrontMatter(content);
  let body = parsed.body;
  const frontMatter = parsed.frontMatter.trimEnd();
  const generatedFields = [];

  if (!hasFrontMatterField(frontMatter, "title")) {
    const heading = firstHeading(body);
    const title = heading ? heading.title : deriveTitle(body, filePath);
    generatedFields.push(`title: ${quoteYaml(title)}`);
    if (heading) {
      body = removeLeadingHeading(body, heading);
    }
  }

  if (!hasFrontMatterField(frontMatter, "date")) {
    generatedFields.push(`date: ${quoteYaml(createdAt)}`);
  }

  if (!hasFrontMatterField(frontMatter, "updated")) {
    generatedFields.push(`updated: ${quoteYaml(updatedAt)}`);
  }

  if (!hasFrontMatterField(frontMatter, "permalink")) {
    generatedFields.push(`permalink: ${quoteYaml(derivePermalink(filePath))}`);
  }

  if (!generatedFields.length) {
    return content;
  }

  const nextFrontMatter = [generatedFields.join("\n"), frontMatter]
    .filter(Boolean)
    .join("\n");
  return `---\n${nextFrontMatter}\n---\n${body.startsWith("\n") ? "" : "\n"}${body}`;
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

function formatDateTime(epochSeconds) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(new Date(epochSeconds * 1000))
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function fallbackTimestamps(filePath) {
  const stat = fs.statSync(filePath);
  const seconds = Math.floor(stat.mtimeMs / 1000);
  const formatted = formatDateTime(seconds);
  return {
    createdAt: formatted,
    updatedAt: formatted,
  };
}

function gitTimestamps(filePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "--follow", "--format=%ct", "--", filePath],
      { encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);

    if (!output.length) return fallbackTimestamps(filePath);

    return {
      createdAt: formatDateTime(Number(output[output.length - 1])),
      updatedAt: formatDateTime(Number(output[0])),
    };
  } catch {
    return fallbackTimestamps(filePath);
  }
}

export function preparePostFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const timestamps = gitTimestamps(filePath);
  const nextContent = preparePostContent({
    content,
    filePath,
    ...timestamps,
  });

  if (nextContent === content) return false;
  fs.writeFileSync(filePath, nextContent);
  return true;
}

export function preparePosts(rootDir = process.cwd()) {
  const postsDir = path.join(rootDir, POSTS_DIR);
  const files = listMarkdownFiles(postsDir);
  let changed = 0;

  for (const file of files) {
    if (preparePostFile(file)) changed += 1;
  }

  return {
    scanned: files.length,
    changed,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = preparePosts();
  console.log(`Prepared posts: ${result.changed}/${result.scanned} updated`);
}
