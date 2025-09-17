"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/cartsStore";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";


export default function CartPage() {
    const {cartItems, handleCartRemove} = useCart()
    const router = useRouter()
    const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0), [cartItems])

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardContent className="p-6">
						<h1 className="text-3xl font-bold mb-6">Cart</h1>

						<div className="space-y-4 mb-6">
							{cartItems.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-4 p-4 border rounded-lg"
								>
									<div className="relative w-20 h-20 flex-shrink-0">
										<Image
											src={item.imageUrl || "/placeholder.svg"}
											alt={item.name}
											fill
											className="object-cover rounded-md"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-lg truncate">
											{item.name} - {item.price.toFixed(2)}$
										</h3>
										<p className="text-muted-foreground">
											By: {item.manufacturer}
										</p>

										<div className="flex items-center gap-2 mt-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => {}}
												className="h-8 w-8 p-0"
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span className="w-8 text-center font-medium">
												{item.quantity ?? 1}
											</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {}}
												className="h-8 w-8 p-0"
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<div className="text-right">
										<p className="font-semibold text-lg">
											{(item.price * (item.quantity ?? 1)).toFixed(2)}$
										</p>
										<Button
                                        
											variant="outline"
											size="sm"
											onClick={() => handleCartRemove(item.id)}
											className="mt-2"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-semibold">Total:</span>
                                <span className="text-2xl font-bold">{total.toFixed(2)}$</span>
                            </div>

                            <Button onClick={() => router.push('/checkout')} className="w-full" size="lg">
                                Go to checkout
                            </Button>
                        </div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
