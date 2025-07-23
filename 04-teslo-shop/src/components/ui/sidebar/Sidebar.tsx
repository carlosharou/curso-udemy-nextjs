'use client';

import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5";
import SidebarMenuItem from "./SidebarMenuItem";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { logout } from "@/actions";
import { useSession } from "next-auth/react";

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeSideMenu = useUIStore(state => state.closeSideMenu);
    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === "admin";


    interface MenuItem {
        href: string;
        icon: React.ReactNode;
        title: string;
        onClick: () => void;
    }


    const menu1: MenuItem[] = [
        {
            href: "/orders",
            icon: <IoTicketOutline size={30} />,
            title: "Ordenes",
            onClick: closeSideMenu
        }
    ];
    const menu2: MenuItem[] = [
        {
            href: "/admin/products",
            icon: <IoShirtOutline size={30} />,
            title: "Productos",
            onClick: closeSideMenu
        }, {
            href: "/admin/orders",
            icon: <IoTicketOutline size={30} />,
            title: "Ordenes",
            onClick: closeSideMenu
        }, {
            href: "/admin/users",
            icon: <IoPeopleOutline size={30} />,
            title: "Usuarios",
            onClick: closeSideMenu
        }
    ];


    if (isAuthenticated) {
        menu1.unshift({
            href: "/profile",
            icon: <IoPersonOutline size={30} />,
            title: "Perfil",
            onClick: closeSideMenu
        });
        menu1.push({
            href: "/",
            icon: <IoLogOutOutline size={30} />,
            title: "Salir",
            onClick: () => { closeSideMenu(); logout(); window.location.replace('/'); }
        });
    } else {
        menu1.push({
            href: "/auth/login",
            icon: <IoLogInOutline size={30} />,
            title: "Ingresar",
            onClick: closeSideMenu
        });
    }


    return (
        <div>
            {/* Background black */}
            {
                isSideMenuOpen && (
                    <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
                )
            }

            {/* Blur */}
            {
                isSideMenuOpen && (
                    <div 
                        className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                        onClick={closeSideMenu}
                    />
                )
            }

            {/* Sidemenu */}
            <nav className={
                clsx(
                    "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen
                    }
                )
            }>
                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={closeSideMenu}
                />

                {/* Input */}
                <div className="relative mt-14">
                    <IoSearchOutline
                        size={20}
                        className="absolute top-2 left-2"
                    />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded px-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Menu 1 */}
                {
                    menu1.map(item => (
                        <SidebarMenuItem
                            key={item.title}
                            href={item.href}
                            icon={item.icon}
                            title={item.title}
                            onClick={item.onClick}
                        />
                    ))
                }

                {
                    isAdmin && (
                        <>
                            {/* Line Separator */}
                            <div className="w-full h-px bg-gray-200 my-10" />

                            {/* Menu 2 */}
                            {
                                menu2.map(item => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        href={item.href}
                                        icon={item.icon}
                                        title={item.title}
                                        onClick={item.onClick}
                                    />
                                ))
                            }
                        </>
                    )
                }
            </nav>
        </div>
    );
}

export default Sidebar;