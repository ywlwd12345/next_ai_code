import { randomUUID } from "crypto";
import type { Sku, Spu } from "@/app/lib/types";
import type { SkuInput, SpuInput } from "@/app/lib/schema";

const spus: Spu[] = [
  {
    id: "spu_phone_001",
    name: "Aurora X 手机",
    category: "智能手机",
    description: "旗舰芯片 + 120Hz 屏幕",
    createdAt: new Date().toISOString()
  }
];

const skus: Sku[] = [
  {
    id: "sku_phone_black_256",
    spuId: "spu_phone_001",
    title: "Aurora X · 黑色 · 256G",
    price: 4599,
    stock: 86,
    attributes: { color: "黑色", storage: "256G" },
    createdAt: new Date().toISOString()
  }
];

export function listSpus() {
  return [...spus].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listSkus() {
  return [...skus].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSpu(input: SpuInput): Spu {
  const spu: Spu = {
    id: `spu_${randomUUID().slice(0, 8)}`,
    name: input.name,
    category: input.category,
    description: input.description,
    createdAt: new Date().toISOString()
  };

  spus.push(spu);
  return spu;
}

export function createSku(input: SkuInput): Sku {
  const existingSpu = spus.find((spu) => spu.id === input.spuId);
  if (!existingSpu) {
    throw new Error("关联的 SPU 不存在");
  }

  const sku: Sku = {
    id: `sku_${randomUUID().slice(0, 8)}`,
    spuId: input.spuId,
    title: input.title,
    price: input.price,
    stock: input.stock,
    attributes: input.attributes,
    createdAt: new Date().toISOString()
  };

  skus.push(sku);
  return sku;
}
