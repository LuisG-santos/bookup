import { Card, CardContent } from "./card";
import Contacts from "./contacts";
import { db } from "@/app/_lib/prisma";

type FooterPageProps = {
  commerceId: string;
}

const FooterPage = async ({ commerceId }: FooterPageProps) => {
    const CommerceContacts = await db.commerce.findUnique({
      where: { id: commerceId },
      select: {
        phones: true,
        instagram: true,
        name: true,
      },
    });

    return ( 
       <footer className="justify-end">
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
     );
}
 
export default FooterPage;