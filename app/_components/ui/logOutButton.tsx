
import { LogOutIcon} from "lucide-react";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { cn } from "@/app/_lib/utils";

type Props = {
    className?: string;
}

export default function LogOutButton({ className }: Props) {

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "https://belivio.com.br/login" });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-28 px-2 py-2 text-xs rounded-xl sm:px-4 sm:py-3 sm:text-base",
                        className
                    )}
                >
                    <LogOutIcon className="mr-2" />
                    Sair da conta
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-white">Sair da conta</DialogTitle>
                    <DialogDescription className="text-white">
                        Tem certeza que deseja sair da sua conta?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="text-white w-20"
                        >
                            Voltar
                        </Button>

                        <Button
                            size="sm"
                            className="w-28 px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-base bg-red-900 hover:bg-red-800"
                            onClick={handleLogout}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saindo..." : "Sair da conta"}
                        </Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}
