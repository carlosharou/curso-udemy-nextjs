'use client';

import { getInStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
    slug: string;
}


const StockLabel = ({ slug }: Props) => {
    const [ inStock, setInStock ] = useState(0);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const getInStock = async() => {
            const _inStock = await getInStockBySlug(slug);
            setInStock(_inStock);
            setIsLoading(false);
        }

        getInStock();
    }, [slug]);


    return (
        <>
            {
                isLoading
                ? (
                    <h1 className={`${titleFont.className} antialiased font-bold text-xl animate-pulse bg-gray-200`}>
                        &nbsp;
                    </h1>
                ) : (
                    <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                        Stock: { inStock }
                    </h1>
                )
            }
        </>
    )
}

export default StockLabel;