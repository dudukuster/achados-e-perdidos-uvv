import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Eletrônicos', slug: 'eletronicos' },
    { name: 'Documentos', slug: 'documentos' },
    { name: 'Acessórios', slug: 'acessorios' },
    { name: 'Materiais Escolares', slug: 'materiais-escolares' },
    { name: 'Outros', slug: 'outros' },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const locations = [
    { name: 'Biblioteca', slug: 'biblioteca' },
    { name: 'Laboratórios', slug: 'laboratorios' },
    { name: 'Cantina', slug: 'cantina' },
    { name: 'Salas de Aula', slug: 'salas-de-aula' },
    { name: 'Áreas Comuns', slug: 'areas-comuns' },
  ];
  for (const loc of locations) {
    await prisma.location.upsert({ where: { slug: loc.slug }, update: {}, create: loc });
  }

  const adminEmail = 'admin@uvv.br';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(process.env['ADMIN_PASSWORD'] ?? 'Admin@123', 12);
    await prisma.user.create({
      data: { name: 'Administrador', email: adminEmail, password: hashedPassword, role: 'ADMIN' },
    });
    console.log(`Admin criado: ${adminEmail}`);
  }
  console.log('Seed concluído!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
