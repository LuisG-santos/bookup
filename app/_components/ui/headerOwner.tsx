import { MenuIcon, Sidebar } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { Sheet, SheetTrigger, } from "./sheet";
import SidebarSheet from "../sidebar-sheet";
import SidebarOwner from "../sidebar-owner";
import { db } from "@/app/_lib/prisma";

type HeaderProps = {
   commerceId: string;
};

export default async function HeaderOwner ({ commerceId }: HeaderProps) {

    const commerce = await db.commerce.findUnique({
        where: { id: commerceId },
        select: {
            imageURL: true,
         }
    });

    if (!commerce) {
        return null;
    }
   
    return (
        <Card className="h-24 bg-[var(--primary)] rounded-none">
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-0">
                <div className="flex h-full items-center">
                    <Image
                        src={commerce.imageURL}
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain block md:hidden"
                        priority
                    />
                    <Image
                        src={commerce.imageURL}
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
                    <SidebarOwner commerce={commerceId} />
                </Sheet>



            </CardContent>


        </Card>


    );
}