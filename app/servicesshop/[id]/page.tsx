import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
type PageProps = {
    params: Promise<{ id: string }>
}

const ServiceshopPage = async ({ params }: PageProps) => {
    const { id } = await params
    
    const service = await db.services.findUnique({
        where: {
            id: id
        },
        
    });

    if (!service) { 
        return notFound();
    }
    
    return (
        <div className="relative h-[250px] w-full">
            <Button size="icon" variant="secondary" className="absolute top-4 left-4" asChild>
                <Link href="/">
                    <ChevronLeftIcon />
                </Link>
            </Button>
            
        </div>
    )
}

export default ServiceshopPage