// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1) Commerce (tenant)
  const commerce = await prisma.commerce.create({
    data: {
      name: 'Gus teste',
      address: 'Rua Teste, 123',
      phones: ['+55 18 99999-9999', '+55 18 98888-8888'],
      instagram: '@gusbarber',
      description: 'Barbearia de teste para desenvolvimento Belivio.',
      imageURL: 'https://placehold.co/300x150?text=Belivio+Logo',

      primaryColor: '#ffffff',
      secondaryColor: '#000000',
      backgroundColor: '#0f172a',

      heroTitle: 'Corte na régua, todos os dias.',
      heroSubtitle: 'Agende seu horário em segundos.',
      subdomain: 'gusteste',
    },
  })

  console.log('✔ Commerce criado:', commerce.name)


  // 3) 6 serviços
  const servicesData = [
    {
      name: 'Chapinha',
      description: 'Corte completo com máquina e tesoura.',
      imageURL: 'https://placehold.co/150x150?text=Corte',
      price: 50.0,
      duration: 40,
      commerceId: commerce.id,
    },
    {
      name: 'Barba Completa',
      description: 'Aparar, alinhar e finalizar com toalha quente.',
      imageURL: 'https://placehold.co/150x150?text=Barba',
      price: 30.0,
      duration: 30,
      commerceId: commerce.id,
    },
    {
      name: 'Sobrancelha',
      description: 'Design simples ou na navalha.',
      imageURL: 'https://placehold.co/150x150?text=Sobrancelha',
      price: 20.0,
      duration: 15,
      commerceId: commerce.id,
    },
    {
      name: 'Corte + Barba',
      description: 'Pacote completo com desconto.',
      imageURL: 'https://placehold.co/150x150?text=Combo',
      price: 70.0,
      duration: 60,
      commerceId: commerce.id,
    },
    {
      name: 'Hidratação Capilar',
      description: 'Tratamento rápido e eficaz.',
      imageURL: 'https://placehold.co/150x150?text=Hidratacao',
      price: 25.0,
      duration: 20,
      commerceId: commerce.id,
    },
    {
      name: 'Relaxamento / Química',
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