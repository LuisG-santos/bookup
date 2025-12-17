import {  MenuIcon, Sidebar } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import {Sheet, SheetTrigger,} from "./sheet";
import SidebarSheet from "../sidebar-sheet";
import { db } from "@/app/_lib/prisma";

type HeaderProps = {
    subdomain: string;
    commerceName: string;
};


export default async function Header({ subdomain, commerceName }: HeaderProps) {

    const commerceLogo = await db.commerce.findUnique({
        where: { subdomain },
        select: {
            imageURL: true,
        },
    });
    const logo = commerceLogo?.imageURL || "/default-logo.png";

    return (
        <Card className="h-24 bg-[var(--primary)] rounded-none">
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-0">
                <div className="flex h-full items-center">
                    <img
						src={logo}
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain block md:hidden"
                       
                    />
                    <img
						src={logo}
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain hidden md:block"
                        
                    />



                </div>
                

                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <MenuIcon />
                        </Button>
                    </SheetTrigger>
                   <SidebarSheet commerceName={commerceName} />
                </Sheet>



            </CardContent>


        </Card>


    );
}

