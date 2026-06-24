---
layout: post
title: "常见排序算法对比"
date: "2026-05-09 00:00:00"
updated: "2026-05-09 00:00:00"
permalink: "algorithm/common_algorithm/6/"
tags:
  - "Algorithm"
  - "排序"
---
# 常见排序算法详解与 C++ 实现

本文详细介绍以下 7 种常见排序算法：

- 快速排序
- 归并排序
- 堆排序
- 插入排序
- 计数排序
- 基数排序
- 桶排序

内容包括：核心思想、执行过程、复杂度、稳定性、适用场景和 C++ 参考实现。

---

## 1. 总览对比

| 排序算法 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 是否稳定 | 是否比较排序 | 典型特点 |
|---|---:|---:|---:|---|---|---|
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 | 是 | 平均性能好，实际开发常用 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 | 是 | 稳定可靠，适合链表和外部排序 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 | 是 | 原地排序，最坏性能稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 | 是 | 小数据、近乎有序时效率高 |
| 计数排序 | O(n + k) | O(n + k) | O(k) | 可稳定 | 否 | 适合整数范围较小的数据 |
| 基数排序 | O(d × (n + k)) | O(d × (n + k)) | O(n + k) | 稳定 | 否 | 适合固定位数整数、编号、字符串 |
| 桶排序 | O(n + k) | 可能退化为 O(n²) | O(n + k) | 可稳定 | 否 | 适合分布均匀的数据 |

说明：

- `n`：元素数量
- `k`：数据范围、桶数量或每一位的取值范围
- `d`：数字位数

---

# 2. 快速排序

## 2.1 核心思想

快速排序是一种典型的 **分治排序算法**。

它的基本思路是：

1. 从数组中选择一个基准值 `pivot`。
2. 将数组划分为两部分：
   - 小于 `pivot` 的元素放左边
   - 大于 `pivot` 的元素放右边
3. 对左右两部分继续递归执行快速排序。

实际工程中常见优化包括：

- 随机选择 `pivot`
- 三数取中选择 `pivot`
- 小数组切换为插入排序
- 三路快排处理大量重复元素

---

## 2.2 示例

原数组：

```text
[6, 3, 8, 5, 2, 7, 4]
```

选择 `6` 作为基准值：

```text
小于 6: [3, 5, 2, 4]
等于 6: [6]
大于 6: [8, 7]
```

递归排序左右两部分后：

```text
[2, 3, 4, 5, 6, 7, 8]
```

---

## 2.3 复杂度与稳定性

| 情况 | 时间复杂度 |
|---|---:|
| 最好情况 | O(n log n) |
| 平均情况 | O(n log n) |
| 最坏情况 | O(n²) |

空间复杂度：

- 平均：O(log n)
- 最坏：O(n)

稳定性：**不稳定**。

快速排序最坏情况通常出现在每次选择的 `pivot` 都是当前区间的最大值或最小值时。使用随机化或三数取中可以显著降低退化概率。

---

## 2.4 常用场景

快速排序适合：

- 普通数组排序
- 对稳定性没有要求
- 希望平均性能较好
- 内存空间不想额外占用太多

不太适合：

- 对稳定性有严格要求的场景
- 最坏时间复杂度必须稳定为 O(n log n) 的场景

---

## 2.5 C++ 实现：三路快速排序

```cpp
#include <algorithm>
#include <random>
#include <vector>
using namespace std;

class QuickSort {
public:
    static void sort(vector<int>& nums) {
        if (nums.empty()) return;
        random_device rd;
        mt19937 gen(rd());
        quickSort(nums, 0, static_cast<int>(nums.size()) - 1, gen);
    }

private:
    static void quickSort(vector<int>& nums, int left, int right, mt19937& gen) {
        if (left >= right) return;

        uniform_int_distribution<int> dist(left, right);
        int pivotIndex = dist(gen);
        swap(nums[left], nums[pivotIndex]);

        int pivot = nums[left];
        int lt = left;
        int gt = right + 1;
        int i = left + 1;

        // nums[left + 1 ... lt] < pivot
        // nums[lt + 1 ... i - 1] == pivot
        // nums[gt ... right] > pivot
        while (i < gt) {
            if (nums[i] < pivot) {
                swap(nums[i], nums[lt + 1]);
                lt++;
                i++;
            } else if (nums[i] > pivot) {
                swap(nums[i], nums[gt - 1]);
                gt--;
            } else {
                i++;
            }
        }

        swap(nums[left], nums[lt]);

        quickSort(nums, left, lt - 1, gen);
        quickSort(nums, gt, right, gen);
    }
};
```

---

# 3. 归并排序

## 3.1 核心思想

归并排序也是一种 **分治排序算法**。

它的过程是：

1. 将数组不断拆成两半。
2. 当子数组长度为 1 时，认为它天然有序。
3. 将两个有序子数组合并成一个更大的有序数组。

归并排序的关键是：**合并两个有序数组**。

---

## 3.2 示例

原数组：

```text
[6, 3, 8, 5, 2, 7, 4]
```

拆分过程：

```text
[6, 3, 8, 5] [2, 7, 4]
[6, 3] [8, 5] [2, 7] [4]
[6] [3] [8] [5] [2] [7] [4]
```

合并过程：

```text
[3, 6] [5, 8] [2, 7] [4]
[3, 5, 6, 8] [2, 4, 7]
[2, 3, 4, 5, 6, 7, 8]
```

---

## 3.3 复杂度与稳定性

| 情况 | 时间复杂度 |
|---|---:|
| 最好情况 | O(n log n) |
| 平均情况 | O(n log n) |
| 最坏情况 | O(n log n) |

空间复杂度：O(n)。

稳定性：**稳定**。

只要在合并时，当两个元素相等时优先取左侧数组中的元素，就可以保持稳定性。

---

## 3.4 常用场景

归并排序适合：

- 需要稳定排序
- 链表排序
- 大文件排序
- 外部排序
- 最坏情况也必须保持 O(n log n)

常见例子：

- 按用户年龄排序，年龄相同时保持注册时间顺序
- 对链表进行排序
- 文件太大无法一次性放入内存，需要分块排序后归并

---

## 3.5 C++ 实现

```cpp
#include <vector>
using namespace std;

class MergeSort {
public:
    static void sort(vector<int>& nums) {
        if (nums.empty()) return;
        vector<int> temp(nums.size());
        mergeSort(nums, temp, 0, static_cast<int>(nums.size()) - 1);
    }

private:
    static void mergeSort(vector<int>& nums, vector<int>& temp, int left, int right) {
        if (left >= right) return;

        int mid = left + (right - left) / 2;

        mergeSort(nums, temp, left, mid);
        mergeSort(nums, temp, mid + 1, right);
        merge(nums, temp, left, mid, right);
    }

    static void merge(vector<int>& nums, vector<int>& temp, int left, int mid, int right) {
        int i = left;
        int j = mid + 1;
        int k = left;

        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) {
                temp[k++] = nums[i++];
            } else {
                temp[k++] = nums[j++];
            }
        }

        while (i <= mid) {
            temp[k++] = nums[i++];
        }

        while (j <= right) {
            temp[k++] = nums[j++];
        }

        for (int p = left; p <= right; p++) {
            nums[p] = temp[p];
        }
    }
};
```

---

# 4. 堆排序

## 4.1 核心思想

堆排序基于 **二叉堆**。

二叉堆常见两种：

- 大顶堆：父节点大于等于子节点
- 小顶堆：父节点小于等于子节点

升序排序通常使用 **大顶堆**。

步骤：

1. 将数组构造成大顶堆。
2. 堆顶元素是当前最大值。
3. 将堆顶元素和数组末尾元素交换。
4. 缩小堆的范围。
5. 重新调整堆。
6. 重复直到排序完成。

---

## 4.2 示例

原数组：

```text
[4, 6, 8, 5, 9]
```

构建大顶堆后：

```text
[9, 6, 8, 5, 4]
```

将最大值 `9` 放到最后：

```text
[4, 6, 8, 5, 9]
```

重新调整前面部分：

```text
[8, 6, 4, 5, 9]
```

继续重复，最终完成排序。

---

## 4.3 复杂度与稳定性

| 情况 | 时间复杂度 |
|---|---:|
| 最好情况 | O(n log n) |
| 平均情况 | O(n log n) |
| 最坏情况 | O(n log n) |

空间复杂度：O(1)。

稳定性：**不稳定**。

---

## 4.4 常用场景

堆排序适合：

- 需要 O(1) 额外空间
- 不希望快速排序退化
- 对稳定性没有要求
- 需要频繁取最大值或最小值

常见应用：

- Top K 问题
- 优先队列
- 找第 K 大元素
- 任务调度
- 实时排行榜

---

## 4.5 C++ 实现

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class HeapSort {
public:
    static void sort(vector<int>& nums) {
        int n = static_cast<int>(nums.size());

        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(nums, n, i);
        }

        for (int end = n - 1; end > 0; end--) {
            swap(nums[0], nums[end]);
            heapify(nums, end, 0);
        }
    }

private:
    static void heapify(vector<int>& nums, int heapSize, int root) {
        int largest = root;
        int left = root * 2 + 1;
        int right = root * 2 + 2;

        if (left < heapSize && nums[left] > nums[largest]) {
            largest = left;
        }

        if (right < heapSize && nums[right] > nums[largest]) {
            largest = right;
        }

        if (largest != root) {
            swap(nums[root], nums[largest]);
            heapify(nums, heapSize, largest);
        }
    }
};
```

---

# 5. 插入排序

## 5.1 核心思想

插入排序类似整理扑克牌。

它将数组分为两部分：

- 左侧：已经有序
- 右侧：尚未排序

每次从右侧取出一个元素，将它插入到左侧有序区间的正确位置。

---

## 5.2 示例

原数组：

```text
[5, 3, 4, 1]
```

过程：

```text
[5] [3, 4, 1]
[3, 5] [4, 1]
[3, 4, 5] [1]
[1, 3, 4, 5]
```

---

## 5.3 复杂度与稳定性

| 情况 | 时间复杂度 |
|---|---:|
| 最好情况 | O(n) |
| 平均情况 | O(n²) |
| 最坏情况 | O(n²) |

空间复杂度：O(1)。

稳定性：**稳定**。

只要插入时不让相等元素互相越过，就可以保持稳定性。

---

## 5.4 常用场景

插入排序适合：

- 小数组
- 基本有序的数据
- 在线排序
- 高级排序中的小区间优化

很多工程级排序算法会在子数组较小时切换到插入排序，因为它实现简单、常数小、局部性能好。

---

## 5.5 C++ 实现

```cpp
#include <vector>
using namespace std;

class InsertionSort {
public:
    static void sort(vector<int>& nums) {
        int n = static_cast<int>(nums.size());

        for (int i = 1; i < n; i++) {
            int current = nums[i];
            int j = i - 1;

            while (j >= 0 && nums[j] > current) {
                nums[j + 1] = nums[j];
                j--;
            }

            nums[j + 1] = current;
        }
    }
};
```

---

# 6. 计数排序

## 6.1 核心思想

计数排序不是基于比较，而是基于 **统计次数**。

它适用于：

- 整数
- 数据范围不大

例如数组：

```text
[3, 1, 2, 3, 2, 1, 0]
```

统计次数：

```text
0 出现 1 次
1 出现 2 次
2 出现 2 次
3 出现 2 次
```

按次数输出：

```text
[0, 1, 1, 2, 2, 3, 3]
```

---

## 6.2 复杂度与稳定性

设：

- `n` 是元素个数
- `k` 是数据范围大小

时间复杂度：O(n + k)。

空间复杂度：O(k)。

稳定性：**可以稳定**。

如果使用前缀和，并从后往前遍历原数组放置元素，就可以实现稳定计数排序。

---

## 6.3 常用场景

计数排序适合：

- 年龄排序
- 分数排序
- 等级排序
- 状态码排序
- 数据范围较小的整数排序

典型例子：

```text
100 万个学生成绩，成绩范围是 0 到 100
```

这种情况非常适合计数排序。

不适合：

- 数据范围很大
- 数据是浮点数
- 数据无法映射成较小整数范围

---

## 6.4 C++ 实现：支持负数的稳定计数排序

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class CountingSort {
public:
    static vector<int> sort(const vector<int>& nums) {
        if (nums.empty()) return {};

        int minValue = *min_element(nums.begin(), nums.end());
        int maxValue = *max_element(nums.begin(), nums.end());
        int range = maxValue - minValue + 1;

        vector<int> count(range, 0);

        for (int num : nums) {
            count[num - minValue]++;
        }

        for (int i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        vector<int> result(nums.size());

        for (int i = static_cast<int>(nums.size()) - 1; i >= 0; i--) {
            int num = nums[i];
            int index = num - minValue;
            result[count[index] - 1] = num;
            count[index]--;
        }

        return result;
    }
};
```

---

# 7. 基数排序

## 7.1 核心思想

基数排序也是非比较排序。

它按数字的每一位进行排序。

以十进制整数为例：

1. 先按个位排序。
2. 再按十位排序。
3. 再按百位排序。
4. 直到最高位。

每一轮通常使用稳定的计数排序。

---

## 7.2 示例

原数组：

```text
[170, 45, 75, 90, 802, 24, 2, 66]
```

按个位排序：

```text
[170, 90, 802, 2, 24, 45, 75, 66]
```

按十位排序：

```text
[802, 2, 24, 45, 66, 170, 75, 90]
```

按百位排序：

```text
[2, 24, 45, 66, 75, 90, 170, 802]
```

---

## 7.3 复杂度与稳定性

设：

- `n` 是元素个数
- `d` 是最大数字的位数
- `k` 是每一位的取值范围，十进制下 `k = 10`

时间复杂度：O(d × (n + k))。

当 `k` 是常数时，可以近似看作 O(dn)。

空间复杂度：O(n + k)。

稳定性：**稳定**。

---

## 7.4 常用场景

基数排序适合：

- 非负整数排序
- 固定位数编号排序
- 手机号排序
- 学号排序
- 订单号排序
- IP 地址排序
- 字符串按字符排序

不适合：

- 普通对象排序
- 比较逻辑复杂的排序
- 小数排序
- 负数很多且不方便拆分处理的场景

---

## 7.5 C++ 实现：非负整数基数排序

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class RadixSort {
public:
    static void sort(vector<int>& nums) {
        if (nums.empty()) return;

        int maxValue = *max_element(nums.begin(), nums.end());

        for (int exp = 1; maxValue / exp > 0; exp *= 10) {
            countingSortByDigit(nums, exp);
        }
    }

private:
    static void countingSortByDigit(vector<int>& nums, int exp) {
        int n = static_cast<int>(nums.size());
        vector<int> output(n);
        vector<int> count(10, 0);

        for (int num : nums) {
            int digit = (num / exp) % 10;
            count[digit]++;
        }

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (int i = n - 1; i >= 0; i--) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }

        nums = output;
    }
};
```

注意：上面的实现只适用于 **非负整数**。如果有负数，通常需要单独处理负数部分。

---

# 8. 桶排序

## 8.1 核心思想

桶排序的核心思想是：

1. 准备若干个桶。
2. 根据映射规则，把元素放入对应桶中。
3. 每个桶内部排序。
4. 按桶顺序合并结果。

桶排序的效果高度依赖数据分布。如果数据分布均匀，每个桶里的元素数量较少，排序会非常快。

---

## 8.2 示例

假设有一组 `[0, 1)` 范围内的小数：

```text
[0.78, 0.17, 0.39, 0.26, 0.72, 0.94]
```

分成 5 个桶：

```text
桶 1: [0.0, 0.2)
桶 2: [0.2, 0.4)
桶 3: [0.4, 0.6)
桶 4: [0.6, 0.8)
桶 5: [0.8, 1.0)
```

分桶后：

```text
桶 1: [0.17]
桶 2: [0.39, 0.26]
桶 3: []
桶 4: [0.78, 0.72]
桶 5: [0.94]
```

桶内排序后：

```text
桶 1: [0.17]
桶 2: [0.26, 0.39]
桶 3: []
桶 4: [0.72, 0.78]
桶 5: [0.94]
```

合并：

```text
[0.17, 0.26, 0.39, 0.72, 0.78, 0.94]
```

---

## 8.3 复杂度与稳定性

理想情况下，时间复杂度：O(n + k)。

最坏情况下，如果所有元素都落入同一个桶中，复杂度取决于桶内排序算法。如果桶内使用插入排序，最坏可能是 O(n²)。

空间复杂度：O(n + k)。

稳定性：**取决于桶内排序算法**。

如果桶内使用稳定排序，并且入桶和出桶时保持顺序，那么桶排序可以是稳定的。

---

## 8.4 常用场景

桶排序适合：

- 数据分布比较均匀
- 浮点数排序
- 分数段排序
- 价格区间排序
- 海量数据按范围分桶处理

典型例子：

```text
100 万个 [0, 1) 范围内均匀分布的小数
```

不适合：

- 数据分布极不均匀
- 很难设计桶映射函数
- 空间有限
- 数据范围未知或变化很大

---

## 8.5 C++ 实现：排序 [0, 1) 范围内的小数

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class BucketSort {
public:
    static void sort(vector<double>& nums) {
        int n = static_cast<int>(nums.size());
        if (n <= 1) return;

        vector<vector<double>> buckets(n);

        for (double num : nums) {
            int index = static_cast<int>(num * n);

            if (index >= n) {
                index = n - 1;
            }

            buckets[index].push_back(num);
        }

        for (auto& bucket : buckets) {
            stable_sort(bucket.begin(), bucket.end());
        }

        int pos = 0;
        for (const auto& bucket : buckets) {
            for (double num : bucket) {
                nums[pos++] = num;
            }
        }
    }
};
```

---

# 9. 如何选择排序算法

## 9.1 普通数组排序

推荐：**快速排序**。

原因：

- 平均性能优秀
- 原地排序
- 实际运行速度快

---

## 9.2 需要稳定排序

推荐：**归并排序**。

原因：

- 稳定
- 最坏情况也是 O(n log n)

---

## 9.3 空间要求严格

推荐：**堆排序**。

原因：

- 额外空间复杂度 O(1)
- 最坏时间复杂度 O(n log n)

---

## 9.4 数据量小或基本有序

推荐：**插入排序**。

原因：

- 实现简单
- 常数小
- 基本有序时接近 O(n)

---

## 9.5 整数范围很小

推荐：**计数排序**。

典型数据：

- 年龄
- 分数
- 等级
- 状态码

---

## 9.6 固定位数整数或编号

推荐：**基数排序**。

典型数据：

- 手机号
- 学号
- 订单号
- IP 地址

---

## 9.7 数据均匀分布

推荐：**桶排序**。

典型数据：

- `[0, 1)` 区间均匀小数
- 分数段
- 价格区间
- 海量数据分区处理

---

# 10. 记忆口诀

```text
快排平均快，归并稳定强；
堆排省空间，插入小而香；
计数看范围，基数看位数；
桶排看分布，用错会退化。
```

---

# 11. 完整可运行 C++ 示例

下面代码把几种排序算法放在一个文件里，方便直接编译运行。

```cpp
#include <algorithm>
#include <iostream>
#include <random>
#include <vector>
using namespace std;

class Sorts {
public:
    static void quickSort(vector<int>& nums) {
        if (nums.empty()) return;
        random_device rd;
        mt19937 gen(rd());
        quickSortImpl(nums, 0, static_cast<int>(nums.size()) - 1, gen);
    }

    static void mergeSort(vector<int>& nums) {
        if (nums.empty()) return;
        vector<int> temp(nums.size());
        mergeSortImpl(nums, temp, 0, static_cast<int>(nums.size()) - 1);
    }

    static void heapSort(vector<int>& nums) {
        int n = static_cast<int>(nums.size());

        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(nums, n, i);
        }

        for (int end = n - 1; end > 0; end--) {
            swap(nums[0], nums[end]);
            heapify(nums, end, 0);
        }
    }

    static void insertionSort(vector<int>& nums) {
        int n = static_cast<int>(nums.size());

        for (int i = 1; i < n; i++) {
            int current = nums[i];
            int j = i - 1;

            while (j >= 0 && nums[j] > current) {
                nums[j + 1] = nums[j];
                j--;
            }

            nums[j + 1] = current;
        }
    }

    static vector<int> countingSort(const vector<int>& nums) {
        if (nums.empty()) return {};

        int minValue = *min_element(nums.begin(), nums.end());
        int maxValue = *max_element(nums.begin(), nums.end());
        int range = maxValue - minValue + 1;

        vector<int> count(range, 0);

        for (int num : nums) {
            count[num - minValue]++;
        }

        for (int i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        vector<int> result(nums.size());

        for (int i = static_cast<int>(nums.size()) - 1; i >= 0; i--) {
            int num = nums[i];
            int index = num - minValue;
            result[count[index] - 1] = num;
            count[index]--;
        }

        return result;
    }

    static void radixSort(vector<int>& nums) {
        if (nums.empty()) return;

        int maxValue = *max_element(nums.begin(), nums.end());

        for (int exp = 1; maxValue / exp > 0; exp *= 10) {
            countingSortByDigit(nums, exp);
        }
    }

    static void bucketSort(vector<double>& nums) {
        int n = static_cast<int>(nums.size());
        if (n <= 1) return;

        vector<vector<double>> buckets(n);

        for (double num : nums) {
            int index = static_cast<int>(num * n);
            if (index >= n) index = n - 1;
            buckets[index].push_back(num);
        }

        for (auto& bucket : buckets) {
            stable_sort(bucket.begin(), bucket.end());
        }

        int pos = 0;
        for (const auto& bucket : buckets) {
            for (double num : bucket) {
                nums[pos++] = num;
            }
        }
    }

private:
    static void quickSortImpl(vector<int>& nums, int left, int right, mt19937& gen) {
        if (left >= right) return;

        uniform_int_distribution<int> dist(left, right);
        int pivotIndex = dist(gen);
        swap(nums[left], nums[pivotIndex]);

        int pivot = nums[left];
        int lt = left;
        int gt = right + 1;
        int i = left + 1;

        while (i < gt) {
            if (nums[i] < pivot) {
                swap(nums[i], nums[lt + 1]);
                lt++;
                i++;
            } else if (nums[i] > pivot) {
                swap(nums[i], nums[gt - 1]);
                gt--;
            } else {
                i++;
            }
        }

        swap(nums[left], nums[lt]);

        quickSortImpl(nums, left, lt - 1, gen);
        quickSortImpl(nums, gt, right, gen);
    }

    static void mergeSortImpl(vector<int>& nums, vector<int>& temp, int left, int right) {
        if (left >= right) return;

        int mid = left + (right - left) / 2;
        mergeSortImpl(nums, temp, left, mid);
        mergeSortImpl(nums, temp, mid + 1, right);
        merge(nums, temp, left, mid, right);
    }

    static void merge(vector<int>& nums, vector<int>& temp, int left, int mid, int right) {
        int i = left;
        int j = mid + 1;
        int k = left;

        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) {
                temp[k++] = nums[i++];
            } else {
                temp[k++] = nums[j++];
            }
        }

        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];

        for (int p = left; p <= right; p++) {
            nums[p] = temp[p];
        }
    }

    static void heapify(vector<int>& nums, int heapSize, int root) {
        int largest = root;
        int left = root * 2 + 1;
        int right = root * 2 + 2;

        if (left < heapSize && nums[left] > nums[largest]) largest = left;
        if (right < heapSize && nums[right] > nums[largest]) largest = right;

        if (largest != root) {
            swap(nums[root], nums[largest]);
            heapify(nums, heapSize, largest);
        }
    }

    static void countingSortByDigit(vector<int>& nums, int exp) {
        int n = static_cast<int>(nums.size());
        vector<int> output(n);
        vector<int> count(10, 0);

        for (int num : nums) {
            int digit = (num / exp) % 10;
            count[digit]++;
        }

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (int i = n - 1; i >= 0; i--) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }

        nums = output;
    }
};

void printVector(const vector<int>& nums) {
    for (int num : nums) {
        cout << num << " ";
    }
    cout << endl;
}

void printDoubleVector(const vector<double>& nums) {
    for (double num : nums) {
        cout << num << " ";
    }
    cout << endl;
}

int main() {
    vector<int> nums = {6, 3, 8, 5, 2, 7, 4, 4, 6};

    vector<int> a = nums;
    Sorts::quickSort(a);
    cout << "QuickSort: ";
    printVector(a);

    vector<int> b = nums;
    Sorts::mergeSort(b);
    cout << "MergeSort: ";
    printVector(b);

    vector<int> c = nums;
    Sorts::heapSort(c);
    cout << "HeapSort: ";
    printVector(c);

    vector<int> d = nums;
    Sorts::insertionSort(d);
    cout << "InsertionSort: ";
    printVector(d);

    vector<int> e = {3, -1, 2, 3, 2, -1, 0};
    vector<int> eSorted = Sorts::countingSort(e);
    cout << "CountingSort: ";
    printVector(eSorted);

    vector<int> f = {170, 45, 75, 90, 802, 24, 2, 66};
    Sorts::radixSort(f);
    cout << "RadixSort: ";
    printVector(f);

    vector<double> g = {0.78, 0.17, 0.39, 0.26, 0.72, 0.94};
    Sorts::bucketSort(g);
    cout << "BucketSort: ";
    printDoubleVector(g);

    return 0;
}
```

---

# 12. 总结

| 场景 | 推荐算法 |
|---|---|
| 普通数组排序 | 快速排序 |
| 要稳定排序 | 归并排序 |
| 空间要求低 | 堆排序 |
| 小数组 | 插入排序 |
| 基本有序数组 | 插入排序 |
| 整数范围小 | 计数排序 |
| 固定位数整数、编号、手机号 | 基数排序 |
| 数据均匀分布 | 桶排序 |
| 链表排序 | 归并排序 |
| Top K 问题 | 堆 |
```
