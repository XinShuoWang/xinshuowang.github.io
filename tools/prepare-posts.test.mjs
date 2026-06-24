import assert from "node:assert/strict";
import test from "node:test";

import {
  derivePermalink,
  deriveTitle,
  preparePostContent,
} from "./prepare-posts.mjs";

test("preparePostContent fills missing fields for a lightweight GitHub-authored post", () => {
  const input = `---
tags:
  - Database
  - SparkSQL
---

# SparkSQL 优化器笔记

正文内容
`;

  const output = preparePostContent({
    content: input,
    filePath: "source/_posts/2026/spark-sql-optimizer.md",
    createdAt: "2026-06-24 00:00:00",
    updatedAt: "2026-06-25 00:00:00",
  });

  assert.equal(
    output,
    `---
title: "SparkSQL 优化器笔记"
date: "2026-06-24 00:00:00"
updated: "2026-06-25 00:00:00"
permalink: "2026/spark-sql-optimizer/"
tags:
  - Database
  - SparkSQL
---

正文内容
`,
  );
});

test("preparePostContent keeps explicit legacy fields unchanged", () => {
  const input = `---
layout: post
title: "查询模块综述"
date: "2022-08-11 00:00:00"
updated: "2022-08-17 00:00:00"
permalink: "database/query/1/"
tags:
  - "Database"
---
正文
`;

  const output = preparePostContent({
    content: input,
    filePath: "source/_posts/2022/database-query-1.md",
    createdAt: "2026-06-24 00:00:00",
    updatedAt: "2026-06-25 00:00:00",
  });

  assert.equal(output, input);
});

test("derivePermalink uses year folder and file slug", () => {
  assert.equal(
    derivePermalink("source/_posts/2026/Spark SQL Optimizer.md"),
    "2026/spark-sql-optimizer/",
  );
});

test("deriveTitle prefers first top-level heading and falls back to filename", () => {
  assert.equal(deriveTitle("# 查询优化\n\n正文", "source/_posts/2026/query.md"), "查询优化");
  assert.equal(deriveTitle("正文", "source/_posts/2026/vector-search.md"), "Vector Search");
});
