'use client'

import { IoCafeOutline } from "react-icons/io5";
import { SimpleWidget } from "./SimpleWidget";
import { useAppSelector } from "@/store";


export const WidgetsGrid = () => {
    const isCart = useAppSelector(state => state.counter.count);

    return (
        <div className="flex flex-wrap p-2 items-center justify-center">
            <SimpleWidget
                title={`${isCart}`}
                subTitle="Subtitulo"
                label="Contador"
                icon={<IoCafeOutline size={50} className="text-blue-500" />}
                href="/dashboard/favorites"
            />
        </div>
    );
}