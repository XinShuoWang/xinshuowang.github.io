## Development

This project is a Hexo blog.

Common commands:

```
pnpm dev
pnpm test:posts
pnpm build
```

`pnpm dev` starts a foreground Hexo server. Stop it with `Ctrl+C` when finished.

Add new posts under `source/_posts/YYYY/`. Keep file organization by year only; use front matter `tags` for topics and categories. New GitHub-authored posts may omit `title`, `date`, `updated`, and `permalink`; `pnpm prepare:posts` fills those before Hexo builds. A local production build is optional for verification; pushing `main` triggers GitHub Actions, which runs `pnpm build` and deploys `public/` to GitHub Pages.

## Documentation

Full documentation: https://hexo.io/docs/

Consult these guides before working on related tasks:

- [Writing posts](https://hexo.io/docs/writing)
- [Front-matter](https://hexo.io/docs/front-matter)
- [Permalinks](https://hexo.io/docs/permalinks)
- [GitHub Pages](https://hexo.io/docs/github-pages)
