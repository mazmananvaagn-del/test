"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckout } from "@/store/checkoutStore";
import { useForm } from "react-hook-form";
import { cities as citiesData } from "@/lib/data";

interface DeliveryStepProps {
	onNext: () => void;
	onBack: () => void;
}

type City = { id: number; name: string };

export function DeliveryStep({ onNext, onBack }: DeliveryStepProps) {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);
    const { delivery, setDelivery } = useCheckout();
    const { handleSubmit, setValue, watch, setError, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            cityId: delivery.cityId ?? "",
            deliveryType: delivery.deliveryType ?? "",
        },
    });

    const selectedCityId = watch("cityId");

    const selectedCityDelivery = useMemo(() => {
        const city = citiesData.find(c => String(c.id) === String(selectedCityId));
        return city?.delivery ?? null;
    }, [selectedCityId]);

    const getDeliveryOptions = () => {
        const delivery = selectedCityDelivery;
        const options = [
            { key: "fast", label: "Fast" },
            { key: "regular", label: "Regular" },
            { key: "slow", label: "Slow" },
        ] as const;
        return options.map(opt => {
            const price = (delivery as any)?.[opt.key];
            const available = price !== null && price !== undefined;
            return {
                type: opt.key,
                label: opt.label,
                price: available ? Number(price) : 0,
                available,
            };
        });
    };

    const unavailableOption = false;
    const defaultOptions = true;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCities(citiesData.map(c => ({ id: c.id, name: c.name })));
            setIsLoadingCities(false);
        }, 400);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const subscription = watch((values) => {
            setDelivery({ cityId: values.cityId || null, deliveryType: values.deliveryType || null });
        });
        return () => subscription.unsubscribe();
    }, [watch, setDelivery]);

    useEffect(() => {
        const currentType = watch("deliveryType");
        if (!currentType) return;
        const opts = getDeliveryOptions();
        const stillAvailable = opts.find(o => o.type === currentType && o.available);
        if (!stillAvailable) setValue("deliveryType", "");
    }, [selectedCityId]);

    const onSubmit = (values: { cityId: string; deliveryType: string }) => {
        if (!values.cityId) {
            setError("cityId", { type: "required", message: "City is required" });
            return;
        }
        const opts = getDeliveryOptions();
        const selected = opts.find(o => o.type === values.deliveryType);
        if (!values.deliveryType || !selected || !selected.available) {
            setError("deliveryType", { type: "required", message: "Select available delivery type" });
            return;
        }
        clearErrors();
        setDelivery({ cityId: values.cityId, deliveryType: values.deliveryType });
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-4">
				<div>
					<Label htmlFor="city">City</Label>
					{isLoadingCities ? (
						<div className="flex items-center gap-2 p-3 border rounded-md">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm text-muted-foreground">
								Loading cities...
							</span>
						</div>
                    ) : (
                        <Select value={watch("cityId") || ""} onValueChange={(val) => setValue("cityId", val, { shouldValidate: true })}>
							<SelectTrigger className={`w-full mt-2`}>
								<SelectValue placeholder="Select city" />
							</SelectTrigger>
							<SelectContent>
								{cities.map((city) => (
									<SelectItem key={city.id} value={city.id.toString()}>
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
                    {errors.cityId && (
                        <p className="text-sm text-destructive mt-2">{String(errors.cityId.message)}</p>
                    )}
				</div>

				<div>
					<Label>Delivery type</Label>
                    <RadioGroup value={watch("deliveryType") || undefined} onValueChange={(value) => setValue("deliveryType", value, { shouldValidate: true })} className="mt-2">
						<div className="grid grid-cols-3 gap-3">
							{getDeliveryOptions().map((option) => (
								<div key={option.type}>
									<div
										className={cn(
											"flex items-center space-x-3 p-4 border rounded-lg transition-colors",
                                            unavailableOption &&
                                                "opacity-50 cursor-not-allowed bg-muted/50",
                                            watch("deliveryType") === option.type && "border-primary bg-primary/5",
											defaultOptions && "hover:bg-muted/50"
										)}
									>
										<RadioGroupItem
											value={option.type}
											id={option.type}
											disabled={!option.available}
											className={!option.available ? "opacity-50" : ""}
										/>
										<div className="flex-1 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Label
													htmlFor={option.type}
													className={cn(
														"font-medium cursor-pointer",
														!option.available &&
															"cursor-not-allowed line-through"
													)}
                                                >
                                                    {option.label} {option.available ? `- $${option.price}` : "(unavailable)"}
												</Label>
                                                {watch("deliveryType") === option.type && (
													<Check className="h-4 w-4 text-primary" />
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</RadioGroup>
                    {errors.deliveryType && (
                        <p className="text-sm text-destructive mt-2">{String(errors.deliveryType.message)}</p>
                    )}
				</div>
			</div>

			<div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
					To summary
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="w-full bg-transparent"
				>
					Back to information
				</Button>
			</div>
		</form>
	);
}
