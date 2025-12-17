import { Card } from "./card";
import { CardContent } from "./card";
import { Badge } from "./badge";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { BookingStatus } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type NextBookingDTO = {
  id: string;
  date: string;
  status: BookingStatus;
  serviceName: string;
} 

type BookingItemProps = {
  booking: NextBookingDTO | null;
  user: {
    name: string;
    image: string;
  };
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-600",
  CONFIRMED: "bg-green-600",
  CANCELED: "bg-red-600",
};


export default function BookingItem ({ booking, user }: BookingItemProps){
  if (!booking) {
    return (
      <>
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="m-5 px-5 py-4 text-sm font-semibold text-zinc-400">
          Você ainda não tem agendamentos futuros.
        </div>
      </>
    );
  }

  const bookingDate = new Date(booking.date);
  const month = format(bookingDate, "MMMM", { locale: ptBR });
  const day = format(bookingDate, "dd", { locale: ptBR });
  const time = format(bookingDate, "HH:mm", { locale: ptBR });

  return (
    <>
      <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Próximos Agendamentos</h2>
      <Card className="mt-6 p-3 bg-[var(--primary)] shadow-[0_10px_20px_rgba(0,0,0,.55)]">
        <CardContent className="flex justify-between p-0 ">

          {/*Div esquerda */}
          <div className="flex flex-col gap-2 p-5 pl-5">
            <Badge  className={`w-fit text-xs font-semibold text-white ${STATUS_CLASSES[booking.status]}`}>
              {STATUS_LABELS[booking.status]}
            </Badge>
            <h3 className="font-semibold">{booking.serviceName}</h3>

            <div className="flex items-center gap-3">
              <Avatar className="w-6 h-6 rounded-full bg-gray-100">
                <AvatarImage src={user.image} alt="Avatar" className="rounded-3xl" />
              </Avatar>
              <p className="text-sm">{user.name}</p>
            </div>
          </div>

          {/*Div direita */}
          <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid border-zinc-400">
            <p className="text-sm font-semibold">{month.charAt(0).toUpperCase() + month.slice(1)}</p>
            <p className="text-xl font-bold">{day}</p>
            <p className="text-sm">{time}</p>
            
          </div>


        </CardContent>


      </Card>

    </>
  );
}
