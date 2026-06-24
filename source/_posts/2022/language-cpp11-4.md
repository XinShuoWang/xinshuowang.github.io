---
layout: post
title: "C++计时器"
date: "2022-08-11 00:00:00"
updated: "2022-08-11 00:00:00"
permalink: "language/cpp11/4/"
tags:
  - "C/C++"
  - "C++11"
---
```
#pragma once

#include <bits/stdc++.h>

class Timer {
private:
    std::chrono::time_point<std::chrono::steady_clock> start_;
    std::chrono::time_point<std::chrono::steady_clock> end_;
public:
    Timer()
    {
        start_ = std::chrono::steady_clock::now();
    }
    ~Timer()
    {
        end_ = std::chrono::steady_clock::now();
        std::chrono::duration<double> elapsed_seconds = end_ - start_;
        std::cout << "Elapsed time: " << elapsed_seconds.count() << "s\n";
    }
};
```
