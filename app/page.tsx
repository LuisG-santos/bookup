import Image from "next/image";
import { Button } from "./_components/ui/button";
import Header from "./_components/header";
import { Input } from "./_components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Home() {
  return ( 
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Luis !</h2>
        <p>Quinta-Feira, 13 de novembro</p>

        <div className="flex items-center gap-2 mt-6">
          <Input placeholder="Busca"/>
          <Button className="bg-zinc-100 hover:bg-zinc-300 focus:ring-2 focus:ring-slate-400 border-black" >
            <SearchIcon className="text-black" />

          </Button>
        </div>

        <div className="relative h-[200px] w-full mt-6 rounded-xl">
          <Image alt="banner" src="/banner1.png" fill className="object-fill"/>
           

        </div>
        
      </div>
      
    </div>
  );
}
