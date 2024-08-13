import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Titulo de Pricing',
    description: 'Descripción de Pricing'
}

export default function PricingPage() {
    return (
        <>
            <span className="text-7xl">Pricing</span>
        </>
    )
}