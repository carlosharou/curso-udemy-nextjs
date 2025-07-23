import { getOrderById } from "@/actions";
import { Title } from "@/components";
import OrderStatus from "@/components/orders/OrderStatus";
import PayPalButton from "@/components/paypal/PayPalButton";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";


interface Props {
    params: Promise<{ id: string }>
}


const Orders = async({ params }: Props) => {
    const { id } = await params;
    const { orden, ok  } = await getOrderById(id);

    
    if (!ok) {
        redirect('/');
    }


    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Orden #${orden?.id}`} />

                <div className="grid grid-col2-1 sm:grid-cols-2 gap-10">
                    {/* Carrito */}
                    <div className="flex flex-col mt-5">
                        <OrderStatus isPaid={ orden!.isPaid } />

                        {/* Items */}
                        {
                            orden?.OrderItem.map((_ordenProduct) => (
                                <div key={_ordenProduct.product.slug} className="flex mb-5">
                                    <Image
                                        src={`/products/${_ordenProduct.product.productImage[0].url}`}
                                        width={100}
                                        height={100}
                                        alt={_ordenProduct.product.title}
                                        className="mr-5 rounded"
                                    />
                                    <div>
                                        <p>{`${_ordenProduct.product.title} - ${_ordenProduct.quantity} - ${_ordenProduct.size}`}</p>
                                        <p>${_ordenProduct.price}</p>
                                        <p className="font-bold">Subtotal: ${_ordenProduct.price * _ordenProduct.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Checkout */}
                    <div className="bg-white rounded-xl shadow-xl p-7">
                        <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
                        <div className="mb-10">
                            <p className="text-xl">{`${orden?.OrderAddress?.firstName} ${orden?.OrderAddress?.lastName}`}</p>
                            <p>{orden?.OrderAddress?.address2}</p>
                            <p>{`${orden?.OrderAddress?.city}, ${orden?.OrderAddress?.countryId}`}</p>
                        </div>

                        <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

                        <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
                        <div className="grid grid-cols-2">
                            <span>No. Productos</span>
                            <span className="text-right">{orden?.itemsInOrder} artículo{orden?.itemsInOrder ? (orden?.itemsInOrder > 1 ? 's' : '') : ''}</span>

                            <span>Subtotal</span>
                            <span className="text-right">{currencyFormat(orden?.subTotal ? orden.subTotal : 0)}</span>

                            <span>Impuestos (16%)</span>
                            <span className="text-right">{currencyFormat(orden?.tax ? orden.tax : 0)}</span>

                            <span className="mt-5 text-2xl">Total:</span>
                            <span className="mt-5 text-2xl text-right">{currencyFormat(orden?.total ? orden.total : 0)}</span>
                        </div>

                        <div className="mt-5 mb-2 w-full">
                            {
                                orden?.isPaid
                                ? (
                                    <OrderStatus isPaid={ orden!.isPaid } />
                                ) : (
                                    <PayPalButton
                                        orderId={orden!.id}
                                        amount={orden!.total}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;