import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans } from "@/config/fonts";
import Providers from "@/components/providers/Providers";



export const metadata: Metadata = {
    title: {
        template: '%s - Teslo | Shop',
        default: 'Home - Teslo | Shop'
    },
    description: "Una tienda de Productos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <Providers>
                        {children}
                    </Providers>
            </body>
        </html>
    );
}
