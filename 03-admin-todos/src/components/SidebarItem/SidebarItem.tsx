"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";


interface Props {
    title: string;
    path: string;
    icon: React.ReactNode;
}


const SidebarItem = ({ title, path, icon }: Props ) => {
    let classes = 'rounded-md text-gray-600 group';
    const pathName = usePathname();


    if (path === pathName) {
        classes = "relative rounded-xl text-white bg-gradient-to-r from-sky-600 to-cyan-400";
    }


    return (
        <li>
            <Link 
                href={path} 
                className={`px-4 py-3 flex items-center space-x-4 hover:bg-gradient-to-r hover:bg-sky-600 hover:text-white ${classes}`}>
                {icon}
                <span className="group-hover:text-white">{title}</span>
            </Link>
        </li>
    );
}

export default SidebarItem;