import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'About Page Title',
    description: 'About Page Description',
    keywords: ['About Page', 'Carlos', 'informacion']
}

export default function AboutPage() {
    return (
        <>
            <span className="text-7xl">About Page</span>
        </>
    );
}