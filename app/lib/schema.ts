import { z } from "zod";

export const spuInputSchema = z.object({
  name: z.string().min(2, "SPU 名称至少 2 个字符"),
  category: z.string().min(2, "分类至少 2 个字符"),
  description: z.string().max(120, "描述最多 120 字").optional()
});

export const skuInputSchema = z.object({
  spuId: z.string().min(1, "请选择 SPU"),
  title: z.string().min(2, "SKU 标题至少 2 个字符"),
  price: z.coerce.number().positive("价格必须大于 0"),
  stock: z.coerce.number().int().nonnegative("库存不能小于 0"),
  attributes: z
    .record(z.string())
    .default({})
    .refine((attrs) => Object.keys(attrs).length <= 8, "属性最多 8 个")
});

export type SpuInput = z.infer<typeof spuInputSchema>;
export type SkuInput = z.infer<typeof skuInputSchema>;
