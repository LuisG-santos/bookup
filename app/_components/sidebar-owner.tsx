"use client";


import {
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet";


import Link from "next/link";
import { HomeIcon, CalendarClockIcon, ClipboardCheckIcon} from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import {useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import LogOutButton from "./ui/logOutButton";
;


export default function SidebarOwner() {
    const params = useParams<{ subdomain: string }>();
    const subdomain = params?.subdomain;
    const base = subdomain ? `/${subdomain}/OwnerPages` : "/OwnerPages";
    const loginPage = subdomain ? `/${subdomain}/login` : '/login';
    const { data, status } = useSession();
    const isAuthenticated = status === "authenticated" && !!data?.user;

    return (

        <SheetContent className="bg-primary">
            <SheetHeader>
                <SheetTitle className=" font-semibold text-[var(--text-secondary)]">Menu</SheetTitle>
            </SheetHeader>
            <div className="p-5 gap-3 border-b flex items-center border-solid  border-zinc-700">


                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            className="h-10 w-10 rounded-full object-cover"
                            src={data?.user?.image ?? ""}
                            alt="User Avatar"
                        />

                    </Avatar>
                    <div className="flex flex-col justify-center leading-tight  ">
                        <p className="font-semibold">{data?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{data?.user?.email}</p>
                    </div>

                </div>

            </div>
            <div className="flex flex-col gap-3 p-3 border-b border-solid border-zinc-700">
                <SheetClose asChild>
                    <Button
                        variant="ghost"
                        className="justify-start gap-1 hover:bg-zinc-400"
                        asChild
                    >
                        <Link href={base}>
                            <HomeIcon size={18} className="mr-2" />Início
                        </Link>
                    </Button>
                </SheetClose>

                <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400" asChild>
                    <Link href={`${base}/bookingPending`}>
                        <CalendarClockIcon size={18} className="mr-2" />Pendencias
                    </Link>
                </Button>

                <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400" asChild>
                    <Link href={`${base}/bookingsToday`}>
                        <ClipboardCheckIcon size={18} className="mr-2" />Agendamentos de hoje
                    </Link>
                </Button>

            </div>
            {isAuthenticated && (
                    <SheetFooter>
                        <LogOutButton className="w-full" />
                    </SheetFooter>
                )}

            {!isAuthenticated ? (
                <SheetFooter>

                    <SheetClose asChild>
                        <Link href={loginPage}>
                            <Button variant="outline" className="w-full">
                                Login
                            </Button>
                        </Link>
                    </SheetClose>
                </SheetFooter>
            ) : null
            }
        </SheetContent>
    );
}