import { Icon, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const Header = () => {
    return ( 
        <Card>
            <CardContent className="flex flex-row justify-between items-center p-3">
                <Image src="/gustavo_dev.png" alt="Logo" className="h-18" width={150} height={18} />
                <Button size="icon" variant="outline">
                    <MenuIcon />
                </Button>

            
            </CardContent>


        </Card>


     );
}
 
export default Header;