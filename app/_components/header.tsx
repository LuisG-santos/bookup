import { Icon, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const Header = () => {
    return ( 
        <Card className="h-24 ">
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-0">
                <div className="flex h-full items-center">
                    <Image src="/canva.png" alt="Logo" width={150} height={80} className="h-25 w-auto object-contain" />
                </div>
                <Button size="icon" variant="outline">
                    <MenuIcon />
                </Button>

            
            </CardContent>


        </Card>


     );
}
 
export default Header;