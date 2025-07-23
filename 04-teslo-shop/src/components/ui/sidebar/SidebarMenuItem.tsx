import Link from "next/link";
import { ReactNode } from "react";

interface Props {
    href: string;
    title: string;
    icon: ReactNode;
    onClick: () => void;
}

export const SidebarMenuItem = ({ href, title, icon, onClick }: Props) => {
    return (
        <Link 
            href={href}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={ onClick }>
            {icon}
            <span className="ml-3 text-xl">{title}</span>
        </Link>
    );
}

export default SidebarMenuItem;