'use client';

import { deleteUserAddress, setUserAddress } from '@/actions';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import type { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from "react-hook-form"


interface Props {
    countries: Country[];
    userStoreAddress?: Partial<Address> | null;
}


type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
}


const AddressForm = ({ countries, userStoreAddress = {} }: Props) => {
    const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            //...(userStoreAddress as any),
            ...userStoreAddress,
            rememberAddress: false
        },
    });
    const setAddress = useAddressStore( state => state.setAddress );
    const getAddress = useAddressStore( state => state.address );
    const { data: dataSession } = useSession({
        required: true
    });
    const router = useRouter();


    const onSubmit = async( data: FormInputs ) => {
        const { rememberAddress, ...restAddress } = data;
        console.log(rememberAddress);
        await setAddress(restAddress);

        if (data.rememberAddress) {
            await setUserAddress(restAddress, dataSession!.user.id);
        } else {
            await deleteUserAddress(dataSession!.user.id);
        }

        router.push('/checkout');
    }


    useEffect(() => {
        if (getAddress.firstName) {
            reset(getAddress);
        }
    }, [getAddress, reset]);


    return (
        <form
            className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
            onSubmit={ handleSubmit( onSubmit ) }>

            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('firstName', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('lastName', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('address', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('address2') }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('postalCode', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('city', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <select 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('country', { required: true }) }>
                    <option value="">[ Seleccione ]</option>
                    {
                        countries.map(( country) => (
                            <option
                                key={ country.id }
                                value={ country.id }>
                                { country.name }
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <input 
                    type="text" 
                    className="p-2 border rounded-md bg-gray-200"
                    { ...register('phone', { required: true }) }
                />
            </div>

            <div className="flex flex-col mb-2 sm:mt-1">
                <Checkbox
                    label='¿Recordar dirección?'
                    registerForm={ register('rememberAddress') }
                />
                { /* href='/checkout' */ }
                <button 
                    className={clsx(
                        "flex w-full sm:w-1/2 justify-center mt-10",
                        {"btn-primary": isValid},
                        {"btn-disabled": !isValid}
                    )}
                    type='submit'
                    disabled={!isValid}>
                    Siguiente
                </button>
            </div>

        </form>
    );
}

export default AddressForm;