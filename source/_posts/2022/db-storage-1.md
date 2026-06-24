---
layout: post
title: "Clickhouse的MergeTree存储"
date: "2022-08-11 00:00:00"
updated: "2022-08-11 00:00:00"
permalink: "db/storage/1/"
tags:
  - "Database"
  - "存储"
---
# 存储级别
其中Partition是逻辑的，物理上最高级别就是Part

![e1b589041c156b3fb7e5a40584d30b7](https://user-images.githubusercontent.com/56379080/146924453-d21c3684-3c0e-4303-b05a-fdcb36932240.png)
