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


export default async function Home() {
  const service= await db.services.findMany({});
  const popularServices = await db.services.findMany({
    orderBy: {
      name: "desc",
    },
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
          <Button className="gap-2" variant="secondary">
            <Image src="/scissors.svg" width={16} height={16} alt="cabelo" className=""/>
            Cabelo
          </Button>

           <Button className="gap-2" variant="secondary">
            <Image src="/mustache-svgrepo-com.svg" width={16} height={16} alt="cabelo" className=""/>
            Barba
          </Button>

           <Button className="gap-2" variant="secondary">
            <Image src="/razor-blade-svgrepo-com (1).svg" width={16} height={16} alt="cabelo" className=""/>
            Acabamento
          </Button>

          <Button className="gap-2" variant="secondary">
            <FootprintsIcon className="w-4 h-4"/>
            Pézinho
          </Button>
          
        </div>

        <ClientBanner className="mt-6"/>

        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Agendamentos</h2>

        <div>
          <Card className="mt-6 p-3">
            <CardContent className="flex justify-between p-0 "> 

              {/*Div esquerda */}
              <div className="flex flex-col gap-2 p-5 pl-5">
                <Badge variant="default" className="bg-zinc-50 text-black w-fit">Confirmado</Badge>
                <h3 className="font-semibold">Sistema Saas</h3>

                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 rounded-full bg-gray-100"> 
                    <AvatarImage src="/cc.png" alt="Avatar" className="rounded-3xl" />
                  </Avatar>
                  <p className="text-sm">Gustavo dev</p>
                </div>
              </div>

              {/*Div direita */}
              <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid border-zinc-400">
                <p className="text-sm font-semibold">Novembro</p>
                <p className="text-xl font-bold">14</p>
                <p className="text-sm">20:00</p>
              </div>
              

            </CardContent>


          </Card>
        </div>

        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Serviços Disponiveis</h2>

        <div className="grid grid-cols-2 gap-4 md:flex md:overflow-x-auto md:gap-6 overflow-auto [&::-webkit-scrollbar]:hidden">
          
          {popularServices.map((service) => <ServicesGrid services={service} key={service.id} />)}

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
