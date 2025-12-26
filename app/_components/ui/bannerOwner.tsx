import Image from "next/image"
import { comma } from "postcss/lib/list"
import { Card, CardContent, CardFooter, CardHeader } from "./card"
import { CalendarCheck, FileWarningIcon, TriangleAlertIcon } from "lucide-react"

type BannerProps = {
    imageUrl?: string
    bookingsPending?: number
    bookingsToday?: number
    commerceName?: string
}



export function BannerOwner({imageUrl, bookingsPending, bookingsToday, commerceName }: BannerProps) {
    return (
        <Card className="flex  bg-[var(--primary)] shadow-[0_20px_30px_rgba(0,0,0,.55)] m-4">

            <CardContent className="flex flex-col justify-around">
                <div className="p-5">
                    <h2 className="text-3xl text-[var(--text-on-primary)] font-semibold leading-tight tracking-tight text-balance md:text-4xl">
                        {commerceName}
                    </h2>
                    <p className="text-base text-[var(--text-on-primary)] md:text-lg pt-4">
                        Você tem <span className="font-bold">{bookingsPending}</span> agendamento{bookingsPending === 1 ? "" : "s"} pendente{bookingsPending === 1 ? "" : "s"} e <span className="font-bold">{bookingsToday}</span> agendamento{bookingsToday === 1 ? "" : "s"} para hoje.
                    </p>
                </div>

                <div className="relative h-56 w-full">
                    <Image
                        src={imageUrl ?? "/cartoonH.png"}
                        alt="Profissional organizando agenda em um notebook"
                        fill
                        sizes="(max-width: 767px) 300px, 400px"
                        className="object-contain"
                        priority
                    />

                </div>
            </CardContent>

            <CardFooter className="flex">
                <CalendarCheck/>
                <p className="text-sm text-[var(--text-on-primary)] pl-2 font-semibold line-clamp-2">
                    
                    Revise seus agendamentos e mantenha sua agenda organizada.
                </p>
            </CardFooter>
        </Card>
    )
}
