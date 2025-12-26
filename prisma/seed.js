// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1) Commerce (tenant)
  const commerce = await prisma.commerce.create({
    data: {
      name: 'Belivio Barber Test',
      address: 'Rua Teste, 123',
      phones: ["+55 18 99179-0722"],
      instagram: '@guustavo.dev',
      description: 'Barbearia de teste para desenvolvimento Belivio.',
      imageURL: 'https://belivio.b-cdn.net/Bronks%20Barber/logo.svg',

      primaryColor: '#171616',
      secondaryColor: '#474343',
      backgroundColor: '#181818',

      heroSubtitle: 'Na Belivio Barber , a vibe é leve e o resultado é sério. Você chega normal e sai com autoestima batendo no topo. Barba, cabelo, ajustes finos...tudo no estilo que combina com você.A gente manda bem no clássico e no moderno sem frescura. Só vem, seu corte favorito te espera',
      heroTitle: 'Corte bom é aquele que te deixa com cara de "hoje eu to bonito"',
      subdomain: 'beliviobarber',
    },
  })

  console.log('✔ Commerce criado:', commerce.name)


  // 3) 6 serviços
  const servicesData = [
    {
      name: 'Degrade',
      category: 'Cabelo',
      description: 'Corte completo com máquina e tesoura.',
      imageURL: 'https://placehold.co/150x150?text=Corte',
      price: 50.0,
      duration: 40,
      commerceId: commerce.id,
    },
    {
      name: 'Barba Completa',
      description: 'Aparar, alinhar e finalizar com toalha quente.',
      category: 'Barba',
      imageURL: 'https://placehold.co/150x150?text=Barba',
      price: 30.0,
      duration: 30,
      commerceId: commerce.id,
    },
    {
      name: 'Sobrancelha',
      category: 'Design',
      description: 'Design simples ou na navalha.',
      imageURL: 'https://placehold.co/150x150?text=Sobrancelha',
      price: 20.0,
      duration: 15,
      commerceId: commerce.id,
    },
    {
      name: 'Corte + Barba',
      category: 'Combo',
      description: 'Pacote completo com desconto.',
      imageURL: 'https://placehold.co/150x150?text=Combo',
      price: 70.0,
      duration: 60,
      commerceId: commerce.id,
    },
    {
      name: 'Hidratação Capilar',
      category: 'Tratamento',
      description: 'Tratamento rápido e eficaz.',
      imageURL: 'https://placehold.co/150x150?text=Hidratacao',
      price: 25.0,
      duration: 20,
      commerceId: commerce.id,
    },
    {
      name: 'Relaxamento / Química',
      category: 'Tratamento',
      description: 'Aplicação de química para redução de volume.',
      imageURL: 'https://placehold.co/150x150?text=Quimica',
      price: 80.0,
      duration: 50,
      commerceId: commerce.id,
    },
  ]

  await prisma.services.createMany({
    data: servicesData,
  })

  console.log('✔ 6 serviços criados com sucesso')
  console.log('🌱 Seed finalizada!')
}

main()
  .catch((e) => {
    console.error('Erro na seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })