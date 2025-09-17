"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckoutSteps } from "@/components/checkout-steps";
import { InformationStep } from "@/components/information-step";
import { DeliveryStep } from "@/components/delivery-step";
import { SummaryStep } from "@/components/summary-step";
import { CheckoutProvider, useCheckout } from "@/store/checkoutStore";
import { getMockCurrentUser } from "@/lib/auth";

const steps = ["Information", "Delivery", "Summary"];

function CheckoutContent() {
    const { currentStep, nextStep, prevStep, gotoStep } = useCheckout();

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="p-6">
                        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                        <CheckoutSteps currentStep={currentStep} steps={steps} onStepClick={(s) => gotoStep(s as any)} />

                        {currentStep === 1 && (
                            <InformationStep onNext={nextStep} onBack={prevStep} />
                        )}

                        {currentStep === 2 && (
                            <DeliveryStep onNext={nextStep} onBack={prevStep} />
                        )}

                        {currentStep === 3 && (
                            <SummaryStep onBack={prevStep} />
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const mockUser = getMockCurrentUser();
    const nameParts = (mockUser?.name ?? "").trim().split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    return (
        <CheckoutProvider initialInformation={{
            firstName,
            lastName,
            email: mockUser?.email ?? "",
        }}>
            <CheckoutContent />
        </CheckoutProvider>
    );
}
