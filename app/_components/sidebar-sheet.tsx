"use client";


import {
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet";


import Link from "next/link";
import { CalendarIcon, Home, HomeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";


const SidebarSheet = () => {
    const params = useParams<{ subdomain: string }>();
    const subdomain = params?.subdomain;

    const base = subdomain ? `/${subdomain}` : '/';
    const loginPage = subdomain ? `/${subdomain}/login` : '/login';

    return (
                    
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="font-semibold">Menu</SheetTitle>
                            

                        </SheetHeader>
                        <div className="p-5 gap-3 border-b flex items-center border-solid  border-zinc-700">
                            {/* <Avatar>
                                <AvatarImage
                                    className="h-10 w-10 rounded-full"
                                    src="/gus.jpg"
                                    alt="User Avatar"
                                />

                            </Avatar>
                            <div>
                                <p className="font-semibold">Luis Gustavo</p>
                                <p className="text-xs">luisgustavo@gmail.com</p>
                            </div> */}

                        </div>
                        <div className="flex flex-col p-3 gap-4 border-b border-solid border-zinc-700 mb-4">
                            <SheetClose asChild>
                                <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400" asChild>
                                    <Link href={base}>
                                        <HomeIcon size={18} className="mr-2" />Início 
                                    </Link>
                                </Button>
                            </SheetClose>
                            <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400">
                                <CalendarIcon size={18} className="mr-2" />Agendamentos
                            </Button>
                        </div>
                        <SheetFooter>
                            <Button  type="submit" className="bg-[var(--secondary)] text-[var(--text-primary)] hover:bg-zinc-300" >Entrar</Button>
                            <SheetClose asChild>
                                <Link href={loginPage}>
                                    <Button variant="outline" className="w-full">Criar conta</Button>
                                </Link>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
     );
}
 
export default SidebarSheet;