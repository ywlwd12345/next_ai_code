"use client";

import { useEffect, useMemo, useState } from "react";
import type { Sku, Spu } from "@/app/lib/types";

interface ApiListResponse<T> {
  data: T[];
}

type FormState = {
  error: string;
  success: string;
};

const initialFormState: FormState = { error: "", success: "" };

function parseAttributes(input: string) {
  if (!input.trim()) return {};

  return input.split(",").reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split(":").map((piece) => piece.trim());
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function Dashboard() {
  const [spus, setSpus] = useState<Spu[]>([]);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [spuForm, setSpuForm] = useState({ name: "", category: "", description: "" });
  const [skuForm, setSkuForm] = useState({
    spuId: "",
    title: "",
    price: "",
    stock: "",
    attributesText: ""
  });
  const [spuState, setSpuState] = useState<FormState>(initialFormState);
  const [skuState, setSkuState] = useState<FormState>(initialFormState);

  const spuMap = useMemo(() => Object.fromEntries(spus.map((spu) => [spu.id, spu])), [spus]);

  const refresh = async () => {
    const [spuRes, skuRes] = await Promise.all([
      fetch("/api/spus", { cache: "no-store" }),
      fetch("/api/skus", { cache: "no-store" })
    ]);

    const spuJson: ApiListResponse<Spu> = await spuRes.json();
    const skuJson: ApiListResponse<Sku> = await skuRes.json();

    setSpus(spuJson.data ?? []);
    setSkus(skuJson.data ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const createSpu = async (event: React.FormEvent) => {
    event.preventDefault();
    setSpuState(initialFormState);

    const res = await fetch("/api/spus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spuForm)
    });

    const json = await res.json();
    if (!res.ok) {
      setSpuState({ error: json.error ?? "创建 SPU 失败", success: "" });
      return;
    }

    setSpuForm({ name: "", category: "", description: "" });
    setSpuState({ error: "", success: "SPU 创建成功" });
    await refresh();
  };

  const createSku = async (event: React.FormEvent) => {
    event.preventDefault();
    setSkuState(initialFormState);

    const payload = {
      spuId: skuForm.spuId,
      title: skuForm.title,
      price: Number(skuForm.price),
      stock: Number(skuForm.stock),
      attributes: parseAttributes(skuForm.attributesText)
    };

    const res = await fetch("/api/skus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok) {
      setSkuState({ error: json.error ?? "创建 SKU 失败", success: "" });
      return;
    }

    setSkuForm({ spuId: "", title: "", price: "", stock: "", attributesText: "" });
    setSkuState({ error: "", success: "SKU 创建成功" });
    await refresh();
  };

  return (
    <main className="main">
      <header className="header">
        <h1>SKU / SPU 智能商品管理台</h1>
        <p>Next.js + TypeScript + API Route + Zod 校验，支持 SPU 与 SKU 的联动管理。</p>
      </header>

      <section className="grid">
        <article className="card">
          <h2>创建 SPU</h2>
          <form onSubmit={createSpu}>
            <label>
              SPU 名称
              <input
                value={spuForm.name}
                onChange={(event) => setSpuForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="如：Aurora X 手机"
              />
            </label>
            <label>
              分类
              <input
                value={spuForm.category}
                onChange={(event) => setSpuForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="如：智能手机"
              />
            </label>
            <label>
              描述
              <input
                value={spuForm.description}
                onChange={(event) =>
                  setSpuForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="卖点描述（可选）"
              />
            </label>
            <button type="submit">新增 SPU</button>
          </form>
          {spuState.error && <p className="error">{spuState.error}</p>}
          {spuState.success && <p className="success">{spuState.success}</p>}

          <table className="table">
            <thead>
              <tr>
                <th>名称</th>
                <th>分类</th>
              </tr>
            </thead>
            <tbody>
              {spus.map((spu) => (
                <tr key={spu.id}>
                  <td>
                    {spu.name} <span className="badge">{spu.id}</span>
                  </td>
                  <td>{spu.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <h2>创建 SKU</h2>
          <form onSubmit={createSku}>
            <label>
              归属 SPU
              <select
                value={skuForm.spuId}
                onChange={(event) => setSkuForm((prev) => ({ ...prev, spuId: event.target.value }))}
              >
                <option value="">请选择 SPU</option>
                {spus.map((spu) => (
                  <option key={spu.id} value={spu.id}>
                    {spu.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              SKU 标题
              <input
                value={skuForm.title}
                onChange={(event) => setSkuForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="如：Aurora X · 黑色 · 256G"
              />
            </label>
            <label>
              价格（元）
              <input
                type="number"
                min="0"
                value={skuForm.price}
                onChange={(event) => setSkuForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </label>
            <label>
              库存
              <input
                type="number"
                min="0"
                value={skuForm.stock}
                onChange={(event) => setSkuForm((prev) => ({ ...prev, stock: event.target.value }))}
              />
            </label>
            <label>
              属性
              <input
                value={skuForm.attributesText}
                onChange={(event) =>
                  setSkuForm((prev) => ({ ...prev, attributesText: event.target.value }))
                }
                placeholder="color:黑色,storage:256G"
              />
            </label>
            <button type="submit">新增 SKU</button>
          </form>
          {skuState.error && <p className="error">{skuState.error}</p>}
          {skuState.success && <p className="success">{skuState.success}</p>}

          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>价格</th>
                <th>库存</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={sku.id}>
                  <td>
                    <div>{sku.title}</div>
                    <small>{spuMap[sku.spuId]?.name ?? "未知 SPU"}</small>
                  </td>
                  <td>¥{sku.price.toFixed(2)}</td>
                  <td>{sku.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
