'use client'

import { useAppDispatch, useAppSelector } from "@/store";
import { initCounterState, substractOne } from "@/store/counter/CounterSlice";
import { useEffect, useState } from "react";


interface Props {
    value?: number;
}


const getApiCounter = async() => {
    const data = await fetch('/api/counter').then( res => res.json());
    
    return data;
}


export const CartCounter = ({ value = 0 }: Props) => {
    const [ contador, setContador ] = useState(value);

    const aumentarContador = () => {
        setContador(prev => prev + 1);
    }

    /*const decrementarContador = () => {
        setContador(prev => prev - 1);
    }*/


    const count = useAppSelector(state => state.counter.count);
    const dispatch = useAppDispatch();


    /*useEffect(() => {
        dispatch(initCounterState(value));
    }, [dispatch, value]);*/


    useEffect(() => {
        getApiCounter()
            .then(({ count }) => dispatch(initCounterState(count)));
    }, [dispatch]);


    return (
        <>
            <span className="text-9xl"> {count} </span>
            <div className="flex">
                <button onClick={aumentarContador}
                    className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
                    +1
                </button>
                <button onClick={() => dispatch(substractOne())}
                    className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
                    -1
                </button>
            </div>
        </>
    )

    /*
        <button onClick={decrementarContador}
                    className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2">
                    -1
                </button>
    */
}