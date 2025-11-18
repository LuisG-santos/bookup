import Image from "next/image";
import { Button } from "./_components/ui/button";
import Header from "./_components/header";
import { Input } from "./_components/ui/input";
import { FootprintsIcon, SearchIcon } from "lucide-react";
import { Badge } from "./_components/ui/badge";
import { Card, CardContent } from "./_components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ClientBanner } from "@/app/_components/ui/banner";
import { db } from "./_lib/prisma";
import ServiesGrid from "./_components/ui/ServicesGrid";
import ServicesGrid from "./_components/ui/ServicesGrid";
import { quicksearchOptions } from "./_constants/search";
import BookingItem from "./_components/ui/BookingItem";


export default async function Home() {
  const popularServices = await db.services.findMany({
    orderBy: {
      name: "desc",
    },
  });

  const UniqueCommerce = await db.services.findMany({
    where: { commerceId: "195bea09-39c2-459e-a6c3-cab8db468d2c"},
    orderBy: {name: "desc",},
  });

  
  return ( 
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Luis !</h2>
        <p>Quinta-Feira, 13 de novembro</p>

        <div className="flex items-center gap-2 mt-6">
          <Input placeholder="O que você está procurando?" className="bg-zinc-800"/>
          <Button className="bg-zinc-100 hover:bg-zinc-300 focus:ring-2 focus:ring-slate-400 border-black" >
            <SearchIcon className="text-black" />

          </Button>
        </div>
        
        <div className=" flex gap-2 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">

          {quicksearchOptions.map((option) => (
            <Button className="gap-2" variant="secondary" key={option.title}>
              <Image src={option.ImgUrl} alt={option.title} width={16} height={16} />
              {option.title}
            </Button>
         ))}


          
          
        </div>

        <ClientBanner className="mt-6"/>
        <BookingItem />
        
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Serviços Disponiveis</h2>

        <div className="grid grid-cols-2 gap-4 md:flex md:overflow-x-auto md:gap-6 overflow-auto [&::-webkit-scrollbar]:hidden">
          
          {UniqueCommerce.map((service) => <ServicesGrid services={service} key={service.id} />)}

        </div>
        
      </div>

      <footer>
        <Card className="py-1 px-2">
          <CardContent className="px-5 py-6">

            <p className="text-sm text-gray-400">
              © 2025 <span className="font-bold">Belivio</span>. Todos os direitos reservados.
            </p>
           
          </CardContent>
        </Card>
      </footer>
        
    </div>
  );
}
