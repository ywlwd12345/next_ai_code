import { NextResponse } from "next/server";
import { createSku, listSkus } from "@/app/lib/store";
import { skuInputSchema } from "@/app/lib/schema";

export async function GET() {
  return NextResponse.json({ data: listSkus() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = skuInputSchema.parse(body);
    const created = createSku(payload);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建 SKU 失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
