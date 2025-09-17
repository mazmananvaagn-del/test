"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/store/cartsStore";
import { useCheckout } from "@/store/checkoutStore";
import { cities } from "@/lib/data";

interface SummaryStepProps {
	onBack: () => void;
}

export function SummaryStep({ onBack }: SummaryStepProps) {
    const router = useRouter();
    const { cartItems } = useCart();
    const { information, delivery } = useCheckout();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    const deliveryMeta = useMemo(() => {
        if (!delivery.cityId || !delivery.deliveryType) return { label: "-", price: 0 };
        const city = cities.find(c => String(c.id) === String(delivery.cityId));
        const price = city?.delivery?.[delivery.deliveryType as keyof typeof city.delivery] ?? 0;
        const labelMap: Record<string, string> = { fast: "Fast", regular: "Regular", slow: "Slow" };
        return { label: labelMap[delivery.deliveryType] ?? delivery.deliveryType, price: Number(price ?? 0) };
    }, [delivery.cityId, delivery.deliveryType]);

    const totalProductsPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
    }, [cartItems]);

    const finalTotal = totalProductsPrice + deliveryMeta.price;

    const handlePlaceOrder = async () => {
        try {
            setOrderError(null);
            setIsPlacingOrder(true);
            const payload = {
                cityId: delivery.cityId,
                deliveryType: delivery.deliveryType,
                customer: information,
                items: cartItems.map(i => ({ id: i.id, quantity: i.quantity ?? 1 })),
            };
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || `Request failed: ${res.status}`);
            }
            router.push("/success");
        } catch (e: any) {
            setOrderError(e?.message ?? "Failed to place order");
        } finally {
            setIsPlacingOrder(false);
        }
    };

	return (
		<div className="space-y-6">
            <div>
				<h3 className="text-lg font-semibold mb-4">Products</h3>
				<div className="space-y-3">
                    {cartItems.map((item: any) => (
						<div
							key={item.id}
							className="flex items-center gap-3 p-3 border rounded-lg"
						>
							<div className="relative w-12 h-12 flex-shrink-0">
								<Image
									src={item.imageUrl || "/placeholder.svg"}
									alt={item.name}
									fill
									className="object-cover rounded"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate">{item.name}</p>
								<p className="text-sm text-muted-foreground">
									By: {item.manufacturer}
								</p>
								{item.quantity > 1 && (
									<p className="text-sm text-muted-foreground">
										Qty: {item.quantity}
									</p>
								)}
							</div>
							<div className="text-right">
								<p className="font-medium">
                                    {(item.price * (item.quantity ?? 1)).toFixed(2)}$
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

            <div>
				<h3 className="text-lg font-semibold mb-4">Customer information</h3>
				<div className="space-y-2 text-sm">
					<div>
						<span className="text-muted-foreground">First name</span>
                        <p className="font-medium">{information.firstName}</p>
					</div>
					<div>
						<span className="text-muted-foreground">Last name</span>
                        <p className="font-medium">{information.lastName}</p>
					</div>
					<div>
						<span className="text-muted-foreground">Email</span>
                        <p className="font-medium">{information.email}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center space-x-2">
				<label htmlFor="terms" className="text-sm cursor-pointer">
					I approve this information isn't real
				</label>
			</div>

            <div className="border-t pt-4 space-y-2">
				<div className="flex justify-between">
					<span>Products</span>
                    <span>{totalProductsPrice.toFixed(2)}$</span>
				</div>
				<div className="flex justify-between">
					<span>
                        {deliveryMeta.label} delivery
					</span>
                    <span>{deliveryMeta.price.toFixed(2)}$</span>
				</div>
				<div className="flex justify-between text-xl font-bold pt-2">
					<span>Total</span>
                    <span>{finalTotal.toFixed(2)}$</span>
				</div>
			</div>

			{orderError && (
				<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
					<p className="text-sm text-destructive">{orderError}</p>
				</div>
			)}

			<div className="flex flex-col gap-3">
				<Button onClick={handlePlaceOrder} className="w-full">
					{isPlacingOrder ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
							Placing order...
						</>
					) : (
						"Place an order"
					)}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="w-full bg-transparent"
				>
					Back to delivery
				</Button>
			</div>
		</div>
	);
}
