import Link from "next/link";
import Image from "next/image";

import SidebarItem from "../SidebarItem/SidebarItem";
import { IoBaseballOutline, IoCalendarOutline, IoCheckboxOutline, IoCodeWorkingOutline, IoListOutline, IoPersonOutline } from "react-icons/io5";
import { getServerSession } from "next-auth";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const menuItems = [
    { 
        title: 'Dashboard', 
        path: '/dashboard',
        icon: <IoCalendarOutline size={30} />
    },
    { 
        title: 'Rest TODOS', 
        path: '/dashboard/rest-todos',
        icon: <IoCheckboxOutline size={30} />
    }, { 
        title: 'Server Actions', 
        path: '/dashboard/server-todos',
        icon: <IoListOutline size={30} />
    }, { 
        title: 'Cookies', 
        path: '/dashboard/cookies',
        icon: <IoCodeWorkingOutline size={30} />
    }, { 
        title: 'Productos', 
        path: '/dashboard/products',
        icon: <IoBaseballOutline size={30} />
    }, { 
        title: 'Perfil', 
        path: '/dashboard/profile',
        icon: <IoPersonOutline size={30} />
    }
]


export const Sidebar = async() => {
    const session = await getServerSession(authOptions);
    const userName = session?.user?.name ?? 'Cynthia J. Watts';
    const avatar = session?.user?.image ?? 'https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp';
    const userRoles = session?.user?.roles ?? ['no roles'];


    return (
        <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
            <div>
                <div className="-mx-6 px-6 py-4">
                    <Link href="/" title="home">
                        <Image
                            width={50}
                            height={50}
                            src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg"
                            className="w-32" 
                            alt="tailus logo"
                        />
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <Image
                        width={100}
                        height={100}
                        src={avatar}
                        alt="user tilus"
                        className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
                    />
                    <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">{userName}</h5>
                    <span className="hidden text-gray-400 lg:block capitalize">{userRoles}</span>
                </div>

                <ul className="space-y-2 tracking-wide mt-8">
                    {
                        menuItems.map((item) => (
                            <SidebarItem 
                                key={item.path}
                                title={item.title}
                                path={item.path}
                                icon={item.icon}
                            />
                        ))
                    }
                </ul>
            </div>

            <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
                <LogoutButton />
            </div>
        </aside>
    );
}

export default Sidebar;