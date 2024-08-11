-- CreateEnum
CREATE TYPE "Process" AS ENUM ('Washed', 'Natural', 'Honey', 'Special', 'Other');

-- CreateEnum
CREATE TYPE "TastingNote" AS ENUM ('Fruity', 'Cocoa', 'Sweetness', 'Floral', 'Sour', 'Baking', 'Spice', 'Green', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "joinedSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "beanId" TEXT NOT NULL,
    "Rating" INTEGER NOT NULL,
    "photo" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "photo" TEXT,

    CONSTRAINT "Roaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bean" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "produceAt" TIMESTAMP(3) NOT NULL,
    "roasterId" TEXT NOT NULL,
    "tastingNote" "TastingNote" NOT NULL,
    "website" TEXT,
    "origin" TEXT NOT NULL,
    "process" "Process" NOT NULL,
    "description" TEXT,
    "photo" TEXT,

    CONSTRAINT "Bean_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bean" ADD CONSTRAINT "Bean_roasterId_fkey" FOREIGN KEY ("roasterId") REFERENCES "Roaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
