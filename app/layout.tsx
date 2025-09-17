import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CartProvider } from "@/store/cartsStore";

export const metadata: Metadata = {
	title: "Checkout",
	description: "Cart and checkout page",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
                <CartProvider>
				    {children}
                </CartProvider>
			</body>
		</html>
	);
}
