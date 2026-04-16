import { NextResponse } from "next/server";
import { createSpu, listSpus } from "@/app/lib/store";
import { spuInputSchema } from "@/app/lib/schema";

export async function GET() {
  return NextResponse.json({ data: listSpus() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = spuInputSchema.parse(body);
    const created = createSpu(payload);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建 SPU 失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
