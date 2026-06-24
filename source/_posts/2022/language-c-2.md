---
layout: post
title: "内存对齐"
date: "2022-08-11 00:00:00"
updated: "2022-08-11 00:00:00"
permalink: "language/c/2/"
tags:
  - "C/C++"
  - "C基础"
---
内存对齐归根结底是cpu去内存取数据的时候，一次拿上来一个cacheline大小的数据（64B），如果没有对齐的话有可能需要拿2次才能把跨cacheline的数据都拿到
