import { Icon, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const Header = () => {
    return ( 
        <Card className="h-24 ">
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-0">
                <div className="flex h-full items-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={120}
                        height={32}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </div>
                <Button size="icon" variant="outline">
                    <MenuIcon />
                </Button>

            
            </CardContent>


        </Card>


     );
}
 
export default Header;