import { Button } from "./button";
import Header from "./header";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import ServicesGrid from "./ServicesGrid";
import BookingItem from "./BookingItem";
import Contacts from "./contacts";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { ClientBanner } from "@/app/_components/ui/banner";
import { quicksearchOptions } from "@/app/_constants/search";
import { db } from "@/app/_lib/prisma";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group"

type HomeContentProps = {
  commerceId: string;
  basePath: string;
  commerceName: string;
};

export default async function HomeContent({ commerceId, basePath, commerceName }: HomeContentProps) {

  const UniqueCommerce = await db.services.findMany({
    where: { commerceId: commerceId },
    orderBy: { name: "desc", }
  });

  const CommerceContacts = await db.commerce.findUnique({
    where: { id: commerceId },
    select: {
      phones: true,
      instagram: true,
      name: true,
    },
  });




  return (
    <div className="bg-[var(--background)] min-h-screen">
      <Header subdomain={basePath} commerceName={commerceName} />
      
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Luis !</h2>
        <p>Quinta-Feira, 13 de novembro</p>
        

         <div className="grid w-full max-w-sm gap-6 pt-3">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      </div>


        {/* <div className="flex items-center gap-2 mt-6">
          <Input placeholder="O que você está procurando?" className="" />
          <Button className="bg-zinc-100 hover:bg-zinc-300 focus:ring-2 focus:ring-slate-400 border-black" >
            <SearchIcon className="text-black" />

          </Button>
        </div> */}

        <div className=" flex gap-2 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">

          {quicksearchOptions.map((option) => (
            <Button className="gap-2" variant="secondary" key={option.title}>
              <Image src={option.ImgUrl} alt={option.title} width={16} height={16} />
              {option.title}
            </Button>
          ))}
        </div>

        <ClientBanner className="mt-6" />
        <BookingItem />

        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Serviços Disponiveis</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:overflow-x-auto md:gap-6 overflow-auto [&::-webkit-scrollbar]:hidden">

          {UniqueCommerce.map((service) => <ServicesGrid services={service} key={service.id} basePath={basePath} />)}

        </div>
      </div>
      <footer>
        <Card className="py-1 px-2 rounded-none">
          <CardContent className="px-5 py-6 ">



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
  );
}
