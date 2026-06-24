# 个人博客

Hexo personal technical blog deployed to GitHub Pages at <https://xinshuowang.github.io>.

## Commands

| Command | Action |
| :-- | :-- |
| `pnpm dev` | Start the local Hexo dev server for preview. |
| `pnpm test:posts` | Test automatic post front matter preparation. |
| `pnpm build` | Optional local production build into `public/`. |

## Writing

Create new posts under `source/_posts/YYYY/`. The year folder is only for file organization; use `tags` for topics.

When writing from GitHub, only `tags` and an H1 title are needed:

```md
---
tags:
  - Database
  - SparkSQL
---

# SparkSQL 优化器笔记

正文内容
```

During the GitHub Actions build, `pnpm build` runs `pnpm prepare:posts` first. Missing `title`, `date`, `updated`, and `permalink` fields are generated from the H1, Git history, and file path. Existing posts with explicit front matter keep their values.

## Deployment

Pushing `main` to `git@github.com:XinShuoWang/xinshuowang.github.io.git` triggers GitHub Actions. The workflow installs dependencies, runs `pnpm build`, uploads `public/`, and publishes the site to GitHub Pages, so a local build is not required before pushing.
