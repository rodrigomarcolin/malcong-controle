import { Link, NavLink, useLocation } from 'react-router-dom'
import { mainMenu } from '@/config/menu'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { AppLogo } from './app-logo'
import { buttonVariants } from './ui/button'
import { appConfig } from '@/config/app'
import GitHub from './icons/github'

export function AppHeader() {
    const location = useLocation()

    return (
        <header className="bg-background sticky top-0 z-50 border-b">
            <div className="w-full ~max-w-7xl mx-auto flex items-center gap-2 h-14 px-4 md:px-8">
                <div className='flex items-center gap-2 md:gap-0'>
                    <Link to="/">
                        <AppLogo />
                    </Link>
                </div>

                <div className='ml-4 flex-1 flex items-center justify-between'>
                    <div className='flex-1'>
                        <nav className="hidden md:flex gap-1">
                            {mainMenu.map((item, index) => (
                                (item.items && item.items.length > 0) ? (
                                    <DropdownMenu key={index}>
                                        <DropdownMenuTrigger className='focus-visible:outline-none'>
                                            <NavLink
                                                key={index}
                                                to={item.url}
                                                className={({ isActive }) => cn(
                                                    "flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4",
                                                    "h-8 text-sm hover:bg-accent hover:text-accent-foreground",
                                                    isActive ? "text-foreground bg-accent" : "text-foreground/70"
                                                )}>
                                                {item.icon && <item.icon />}
                                                <span className='font-medium'>{item.title}</span>
                                                <ChevronDown className='!size-3 -ml-1' />
                                            </NavLink>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='start' className='min-w-56'>
                                            {item.items.map((subItem, index) => (
                                                <DropdownMenuItem key={index} asChild>
                                                    <NavLink
                                                        to={subItem.url}
                                                        className={cn(
                                                            'cursor-pointer',
                                                            subItem.url === location.pathname && 'bg-muted'
                                                        )}>
                                                        {subItem.title}
                                                    </NavLink>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <NavLink
                                        key={index}
                                        to={item.url}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-sm outline-none transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4",
                                            "h-8 text-sm hover:bg-accent hover:text-accent-foreground",
                                            isActive ? "text-foreground bg-accent" : "text-foreground/70"
                                        )}>
                                        {item.icon && <item.icon />}
                                        <span className='font-medium'>{item.title}</span>
                                    </NavLink>
                                )
                            ))}
                        </nav>
                    </div>
                    <nav className="flex gap-1">
                        <a
                            href={appConfig.github.url}
                            title={appConfig.github.title}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "size-8"
                            )}>
                            <GitHub />
                            <span className="sr-only">GitHub</span>
                        </a>
                    </nav>
                </div>
            </div>
        </header >
    )
}