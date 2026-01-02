"use client";
import { Link, Smartphone} from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { useState } from "react";


interface ContactsProps {
  phone: string;
  instagram?: string | null;

}

const Contacts = ({ phone, instagram }: ContactsProps) => {
  const instaUrl = `https://www.instagram.com/${instagram?.replace('@', '')}`;
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=Olá!%20Quero%20agendar%20um%20serviço.`;

  return (
    <div className=" gap-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-[var(--text-on-primary)] hover:text-zinc-400 gap-2">
            <Image alt="Phone icon" src="/whatsapp.svg" width={24} height={24} />
            Fale conosco 
          </a>
        </div>
        
      </div>

      <div className=" gap-2 mt-2">

        {instagram && (
          <div className="flex items-center gap-2" >
            <a href={instaUrl} className="flex items-center gap-2 text-[var(--text-on-primary)] hover:text-zinc-400" target="_blank" rel="noopener noreferrer">
              <Image alt="Instagram icon" src="/instaicon.svg" width={20} height={20} />{instagram}
            </a>


          </div>
        )}
      </div>
    </div>





  )
}

export default Contacts;

