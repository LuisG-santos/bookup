import { Card } from "./card";
import { CardContent } from "./card";
import { Badge } from "./badge";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
const BookingItem = () => {
    return ( 
        <>
            <h2 className="mt-6 mb-3 text-xs font-bold uppercase text-gray-400">Agendamentos</h2>
          <Card className="mt-6 p-3">
            <CardContent className="flex justify-between p-0 "> 

              {/*Div esquerda */}
              <div className="flex flex-col gap-2 p-5 pl-5">
                <Badge className="bg-zinc-50 text-black w-fit">Confirmado</Badge>
                <h3 className="font-semibold">Sistema Saas</h3>

                <div className="flex items-center gap-3">
                  <Avatar className="w-6 h-6 rounded-full bg-gray-100"> 
                    <AvatarImage src="/gus.jpg" alt="Avatar" className="rounded-3xl" />
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
        
        </>
     );
}
 
export default BookingItem;