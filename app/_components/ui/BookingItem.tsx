import { Card } from "./card";
import { CardContent } from "./card";
import { Badge } from "./badge";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { BookingStatus } from "@prisma/client";
import { formatBookingDay, formatBookingMonth, formatBookingTime } from "@/app/utils/date";

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
  FINALIZED: "Finalizado",
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-600",
  CONFIRMED: "bg-green-600",
  CANCELED: "bg-red-600",
  FINALIZED: "bg-gray-600",
};


export default function BookingItem ({ booking, user }: BookingItemProps){
  if (!booking) {
    return (
      <>
        <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="m-5 px-4 py-4 text-sm font-semibold text-zinc-400">
          Você ainda não tem agendamentos futuros.
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Próximos Agendamentos</h2>
      <Card className="mt-6 p-3 bg-primary shadow-[0_10px_20px_rgba(0,0,0,.55)]">
        <CardContent className="flex justify-between p-0 ">

          {/*Div esquerda */}
          <div className="flex flex-col gap-2 p-5 pl-5">
            <Badge  className={`w-fit text-xs font-semibold text-white ${STATUS_CLASSES[booking.status]}`}>
              {STATUS_LABELS[booking.status]}
            </Badge>
            <h3 className="font-semibold text-[var(--text-on-primary)]">{booking.serviceName}</h3>

            <div className="flex items-center gap-3">
              <Avatar className="w-6 h-6 rounded-full bg-gray-100">
                <AvatarImage src={user.image} alt="Avatar" className="rounded-3xl" />
              </Avatar>
              <p className="text-sm text-[var(--text-on-primary)]">{user.name}</p>
            </div>
          </div>
      
          {/*Div direita */}
          <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid border-zinc-400">
            <p className="text-sm font-semibold text-[var(--text-on-primary)]">{formatBookingMonth(booking.date)}</p>
            <p className="text-xl font-bold text-[var(--text-on-primary)]">{formatBookingDay(booking.date)}</p>
            <p className="text-sm text-[var(--text-on-primary)]">{formatBookingTime(booking.date)}</p>
            
          </div>


        </CardContent>


      </Card>

    </>
  );
}
