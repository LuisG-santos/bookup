import { BookAIcon, Calendar1Icon, CalendarIcon, Home, HomeIcon, Icon, MenuIcon } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import Image from "next/image";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet";

import { Input } from "./input"
import { Label } from "./label"
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./avatar";
import Link from "next/link";

const Header = () => {
    return (
        <Card className="h-24 bg-[var(--primary)] rounded-none">
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-0">
                <div className="flex h-full items-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain block md:hidden"
                        priority
                    />
                    <Image
                        src="/Logodesktop.svg"
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain hidden md:block"
                        priority
                    />



                </div>


                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="font-semibold">Menu</SheetTitle>

                        </SheetHeader>
                        <div className="p-5 gap-3 border-b flex items-center border-solid  border-zinc-700">
                            <Avatar>
                                <AvatarImage
                                    className="h-10 w-10 rounded-full"
                                    src="/gus.jpg"
                                    alt="User Avatar"
                                />

                            </Avatar>
                            <div>
                                <p className="font-semibold">Luis Gustavo</p>
                                <p className="text-xs">luisgustavo@gmail.com</p>
                            </div>

                        </div>
                        <div className="flex flex-col p-3 gap-4 border-b border-solid border-zinc-700 mb-4">
                            <SheetClose asChild>
                                <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400" asChild>
                                    <Link href="/">
                                        <HomeIcon size={18} className="mr-2" />Início
                                    </Link>
                                </Button>
                            </SheetClose>
                            <Button variant="ghost" className="justify-start gap-1 hover:bg-zinc-400">
                                <CalendarIcon size={18} className="mr-2" />Agendamentos
                            </Button>
                        </div>
                        <SheetFooter>
                            <Button type="submit">Entrar</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Criar conta</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>



            </CardContent>


        </Card>


    );
}

export default Header;