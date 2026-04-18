-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELETRONICOS', 'DOCUMENTOS', 'ACESSORIOS', 'MATERIAIS_ESCOLARES', 'OUTROS');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('BIBLIOTECA', 'LABORATORIOS', 'CANTINA', 'SALAS_DE_AULA', 'AREAS_COMUNS');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PERDIDO', 'ENCONTRADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "location" "Location" NOT NULL,
    "lostDate" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PERDIDO',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");

-- CreateIndex
CREATE INDEX "Item_location_idx" ON "Item"("location");

-- CreateIndex
CREATE INDEX "Item_status_idx" ON "Item"("status");

-- CreateIndex
CREATE INDEX "Item_userId_idx" ON "Item"("userId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
