"use client";


import {
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet";


import Link from "next/link";
import { CalendarIcon, Home, HomeIcon, LogOutIcon, ChevronRightIcon, PencilIcon, Badge } from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
type SidebarSheetProps = {
    commerceName: string;
};

const SidebarSheet = ({ commerceName }: SidebarSheetProps) => {
    const params = useParams<{ subdomain: string }>();
    const subdomain = params?.subdomain;

    const base = subdomain ? `/${subdomain}` : '/';
    const loginPage = subdomain ? `/${subdomain}/login` : '/login';
    const { data, status } = useSession();
    const isAuthenticated = status === "authenticated" && !!data?.user;
    const [name, setName] = useState(data?.user?.name ?? "");
    const [avatarPreview, setAvatarPreview] = useState(data?.user?.image ?? "");

    return (

        <SheetContent>
            <SheetHeader>
                <SheetTitle className="font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="p-5 gap-3 border-b flex items-center border-solid  border-zinc-700">

                {isAuthenticated ? (
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
                ) : (
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold">Bem-vindo ao {commerceName}</p>
                        <p className="text-xs text-muted-foreground">
                            Entre ou crie uma conta para gerenciar seus agendamentos.
                        </p>
                    </div>
                )}

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

                <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400">
                    <CalendarIcon size={18} className="mr-2" />Agendamentos
                </Button>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:no-underline hover:bg-zinc-800">
                            <p className="flex ml-3 gap-3"><Image src="/avatar.svg" alt="Perfil Icon" width={20} height={20} className=" h-5 w-5 " />Perfil</p>


                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="justify-start gap-2">
                                        <ChevronRightIcon className="h-4 w-4" />
                                        Ver perfil
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you&apos;re
                                            done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <div className="relative flex flex-col items-center">
                                            <Avatar className="h-15 w-15 rounded-full ">
                                                <AvatarImage
                                                    className="h-15 w-15 rounded-full object-cover"
                                                    src={data?.user?.image ?? ""}
                                                    alt="User Avatar"
                                                />
                                                <Button variant="secondary" className="absolute top-2 space-x-1">
                                                    <PencilIcon size="icon" className="h-5 w-5 absolute top-2" />
                                                </Button>
                                            </Avatar>
                                            <p className="font-semibold">{data?.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{data?.user?.email}</p>

                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username-1">Username</Label>
                                            <Input id="username-1" name="username" defaultValue={data?.user?.name ?? ""} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Button variant="ghost" className="justify-start">
                                <ChevronRightIcon /> Sair da conta

                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

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

export default SidebarSheet;