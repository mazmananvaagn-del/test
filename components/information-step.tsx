"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckout } from "@/store/checkoutStore";
import { useForm } from "react-hook-form";

interface InformationStepProps {
	onNext: () => void;
	onBack: () => void;
}

export function InformationStep({ onNext, onBack }: InformationStepProps) {
	const { information, setInformation } = useCheckout();
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: {
			firstName: information.firstName,
			lastName: information.lastName,
			email: information.email,
		},
	});

	const onSubmit = (values: { firstName: string; lastName: string; email: string }) => {
		setInformation(values);
		onNext();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="firstName">First name</Label>
					<Input
						id="firstName"
						placeholder="Enter your first name"
						aria-invalid={!!errors.firstName}
						{...register("firstName", { required: "First name is required" })}
					/>
					{errors.firstName && (
						<p className="text-sm text-destructive">{String(errors.firstName.message)}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="lastName">Last name</Label>
					<Input
						id="lastName"
						placeholder="Enter your last name"
						aria-invalid={!!errors.lastName}
						{...register("lastName", { required: "Last name is required" })}
					/>
					{errors.lastName && (
						<p className="text-sm text-destructive">{String(errors.lastName.message)}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email address"
						aria-invalid={!!errors.email}
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Enter a valid email",
							},
						})}
					/>
					{errors.email && (
						<p className="text-sm text-destructive">{String(errors.email.message)}</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Button type="submit" className="w-full">
					To delivery step
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="w-full bg-transparent"
				>
					Back to cart
				</Button>
			</div>
		</form>
	);
}
