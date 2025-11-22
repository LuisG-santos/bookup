import {  MenuIcon, Sidebar } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import Image from "next/image";
import {Sheet, SheetTrigger,} from "./sheet";
import SidebarSheet from "../sidebar-sheet";

type HeaderProps = {
  subdomain: string;
};

const Header = ({ subdomain }: HeaderProps) => {
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
                   <SidebarSheet />
                </Sheet>



            </CardContent>


        </Card>


    );
}

export default Header;