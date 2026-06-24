---
layout: post
title: "Clickhouse增加日志打印代码"
date: "2022-08-11 00:00:00"
updated: "2022-08-11 00:00:00"
permalink: "db/build/4/"
tags:
  - "Database"
  - "编译安装"
---
```
#include <common/logger_useful.h>

class FilterTransform {
 private:
  Poco::Logger * log;
 public:
  FilterTransform() log(&Poco::Logger::get("FilterTransform")) {}
  void work() {
    ...
    LOG_INFO(log, "FilterTransform input_data is {} rows, {} columns." \
        "filter action is {}, filter column name is {}. Status is {}.",
        input_data.chunk.getNumRows(),
        input_data.chunk.getNumColumns(),
        expression->dumpActions(),
        filter_column_name, statusToName(status));
    ...
  }
};
```
