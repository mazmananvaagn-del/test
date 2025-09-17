"use client";

import { createContext, ReactNode, useContext, useMemo, useReducer } from "react";

export type CheckoutStep = 1 | 2 | 3;

export interface CustomerInformation {
    firstName: string;
    lastName: string;
    email: string;
}

export interface DeliveryInformation {
    cityId: string | null;
    deliveryType: string | null;
}

export interface CheckoutState {
    currentStep: CheckoutStep;
    information: CustomerInformation;
    delivery: DeliveryInformation;
}

type CheckoutAction =
    | { type: "NEXT_STEP" }
    | { type: "PREV_STEP" }
    | { type: "GOTO_STEP"; step: CheckoutStep }
    | { type: "SET_INFORMATION"; payload: Partial<CustomerInformation> }
    | { type: "SET_DELIVERY"; payload: Partial<DeliveryInformation> }
    | { type: "RESET" };

const initialState: CheckoutState = {
    currentStep: 1,
    information: {
        firstName: "",
        lastName: "",
        email: "",
    },
    delivery: {
        cityId: null,
        deliveryType: null,
    },
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case "NEXT_STEP": {
            const next = Math.min(3, (state.currentStep + 1) as CheckoutStep);
            return { ...state, currentStep: next };
        }
        case "PREV_STEP": {
            const prev = Math.max(1, (state.currentStep - 1) as CheckoutStep);
            return { ...state, currentStep: prev };
        }
        case "GOTO_STEP": {
            return { ...state, currentStep: action.step };
        }
        case "SET_INFORMATION": {
            return { ...state, information: { ...state.information, ...action.payload } };
        }
        case "SET_DELIVERY": {
            return { ...state, delivery: { ...state.delivery, ...action.payload } };
        }
        case "RESET": {
            return initialState;
        }
        default:
            return state;
    }
}

interface CheckoutContextValue extends CheckoutState {
    nextStep: () => void;
    prevStep: () => void;
    gotoStep: (step: CheckoutStep) => void;
    setInformation: (payload: Partial<CustomerInformation>) => void;
    setDelivery: (payload: Partial<DeliveryInformation>) => void;
    reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children, initialInformation }: { children: ReactNode; initialInformation?: Partial<CustomerInformation> }) {
    const [state, dispatch] = useReducer(
        checkoutReducer,
        { ...initialState, information: { ...initialState.information, ...initialInformation } }
    );

    const value = useMemo<CheckoutContextValue>(() => ({
        ...state,
        nextStep: () => dispatch({ type: "NEXT_STEP" }),
        prevStep: () => dispatch({ type: "PREV_STEP" }),
        gotoStep: (step: CheckoutStep) => dispatch({ type: "GOTO_STEP", step }),
        setInformation: (payload) => dispatch({ type: "SET_INFORMATION", payload }),
        setDelivery: (payload) => dispatch({ type: "SET_DELIVERY", payload }),
        reset: () => dispatch({ type: "RESET" }),
    }), [state]);

    return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
    return ctx;
}


