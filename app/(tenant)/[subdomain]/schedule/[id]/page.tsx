
import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import { Card, CardContent } from "@/app/_components/ui/card"
import Contacts from "@/app/_components/ui/contacts"
type PageProps = {
    params: Promise<{ subdomain: string; id: string }>
}

const SchedulePage = async ({ params }: PageProps) => {
    const { subdomain, id } = await params
    const service = await db.services.findUnique({
        where: {
            id: id
        }
    });

    const CommerceContacts = await db.commerce.findUnique({
        where: { id: service?.commerceId },
        select: {
            phones: true,
            instagram: true,
        },
    });

    if (!service) {
        return notFound();
    }

    return (
        <div className="relative h-[250px] w-full">
            <Button size="icon"  variant="outline" className="absolute top-4 left-4" asChild>
                <Link href={`/${subdomain}`} className="">
                    <ChevronLeftIcon />
                </Link>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="absolute top-4 right-4">
                        <MenuIcon />
                    </Button>
                </SheetTrigger>
                <SidebarSheet />
            </Sheet>

            <div>
                <h1>{service?.name}</h1>
            </div>

            <footer>
                <Card className="py-1 px-2 ">
                    <CardContent className="px-5 py-6 rounded-none ">

                        <div className="pt-3 space-y-3">
                            {CommerceContacts?.phones.map((phone, index) => (
                                <Contacts phone={phone} instagram={CommerceContacts?.instagram} key={index} />
                            ))}

                            <p className="text-sm text-gray-400 pt-3 justify-end">
                                © 2025 <span className="font-bold">Belivio</span>. Todos os direitos reservados.
                            </p>

                        </div>

                    </CardContent>
                </Card>
            </footer>

        </div>
    )
}

export default SchedulePage