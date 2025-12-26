"use client";

import { Clock8Icon, NotebookIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

type Props = {
  pendingCount: number;
};


export function PendingBookingsToast({ pendingCount }: Props) {
  useEffect(() => {
    if (pendingCount > 0) {
      toast(`Você tem ${pendingCount} agendamentos pendentes`, {
        duration: 5000,
        icon: <Clock8Icon size={30}/>,
        style: {
            fontSize: '15px',
            minWidth: '300px',
            minHeight: '50px',
            color: '#000000',

        },
      });
    }else if (pendingCount === 1){
      toast(`Você tem ${pendingCount} agendamento pendente`, {
        duration: 5000,
        icon: <NotebookIcon size={20}/>,
         style: {
            fontSize: '15px',
            minWidth: '300px',
            minHeight: '50px',
            color: '#000000',

        },
      });
    }
  }, [pendingCount]);

  return null; // não precisa renderizar nada na tela
}