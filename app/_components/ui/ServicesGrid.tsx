import { Services } from "@prisma/client";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { Button } from "./button";
import { Badge } from "./badge";
import { FlameIcon, StarIcon } from "lucide-react";



interface ServicesGridProps {
    services: Services;
}
const ServicesGrid = ({services}: ServicesGridProps) => {
    return ( 
        <Card className="min-w-[170px] p-0 rounded-2xl">
            <CardContent className="p-0 px-2 pt-2 pb-1">
                <div className="relative h-[156px] w-full">
                    <Image fill className="object-cover rounded-2xl" src={services.imageURL} alt={services.name} />
                    <Badge className="absolute left-2 top-2 space-x-1 bg-orange-600" variant="secondary">
                        <FlameIcon className="h-4 w-4" />
                        <p>Popular</p>
                        </Badge>
                </div>

                <div className=" py-3">
                    <h3 className="font-semibold ">{services.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{services.description}</p>
                    <Button variant="secondary" className="w-full mt-3 bg-white text-black">Agendar</Button>
                </div>
            </CardContent>
        </Card>


 


     );
}
 
export default ServicesGrid;