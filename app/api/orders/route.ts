import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cityId, deliveryType, customer, items } = body || {};

        if (!cityId || !deliveryType || !customer?.email || !Array.isArray(items)) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        // Simulate processing delay
        await new Promise((res) => setTimeout(res, 500));

        const orderId = Math.floor(Math.random() * 1_000_000);
        return NextResponse.json({
            success: true,
            orderId,
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message ?? "Unknown error" }, { status: 500 });
    }
}


