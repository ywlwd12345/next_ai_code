# SKU / SPU Next.js 项目

一个面向电商商品管理场景的 Next.js（App Router）示例，聚焦 **SPU 抽象层** 与 **SKU 销售层** 的联动管理。

## 特性

- 基于 Next.js 15 + React 19 + TypeScript 严格模式
- App Router API Route：`/api/spus`、`/api/skus`
- Zod 入参校验（服务端）
- 前端控制台支持新增 SPU / SKU、列表联动展示
- 内存数据仓储示例（可替换为数据库）

## 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 数据建模

- **SPU**：标准化商品（名称、分类、描述）
- **SKU**：可售卖单元（关联 SPU、价格、库存、属性）

## 可扩展建议

- 接入 Prisma + PostgreSQL
- 增加库存流水、批量导入、权限控制
- 为 SKU 属性增加可配置模板（如颜色、尺码、版本）
