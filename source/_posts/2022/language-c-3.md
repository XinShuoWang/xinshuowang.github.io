---
layout: post
title: "do{...}while(0)"
date: "2022-08-11 00:00:00"
updated: "2022-08-11 00:00:00"
permalink: "language/c/3/"
tags:
  - "C/C++"
  - "C基础"
---
如果不加do-while可能会出现意外情况
```
if (condition)
        statement_1;
        statement_2;
```
这样的话if之后就只能执行statement1，而不会执行连带着statement2一起执行，使用了do-while之后，就变成了这样
```
#define foo \
        do { \
                statement_1; \
                statement_2; \
        } while (0)
```
