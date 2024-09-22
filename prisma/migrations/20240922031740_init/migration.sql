-- CreateEnum
CREATE TYPE "Process" AS ENUM ('Washed', 'Natural', 'Honey', 'Special', 'Other');

-- CreateEnum
CREATE TYPE "TastingNote" AS ENUM ('Fruity', 'Cocoa', 'Sweetness', 'Floral', 'Sour', 'Baking', 'Spice', 'Green', 'Other');

-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('Brazil', 'Colombia', 'Ethiopia', 'Kenya', 'Guatemala', 'Honduras', 'CostaRica', 'Indonesia', 'Vietnam', 'Mexico', 'Peru', 'Nicaragua', 'Tanzania', 'Rwanda', 'Uganda', 'India', 'Yemen', 'Panama', 'ElSalvador', 'PapuaNewGuinea', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
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
    "rating" DOUBLE PRECISION NOT NULL,
    "photo" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roaster" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "website" TEXT,
    "image" TEXT,

    CONSTRAINT "Roaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bean" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roasterId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "tastingNotes" "TastingNote"[],
    "website" TEXT,
    "origin" "Origin" NOT NULL,
    "process" "Process" NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "submitterId" TEXT NOT NULL,

    CONSTRAINT "Bean_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReviewedBeans" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ReviewedBeans_AB_unique" ON "_ReviewedBeans"("A", "B");

-- CreateIndex
CREATE INDEX "_ReviewedBeans_B_index" ON "_ReviewedBeans"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bean" ADD CONSTRAINT "Bean_roasterId_fkey" FOREIGN KEY ("roasterId") REFERENCES "Roaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bean" ADD CONSTRAINT "Bean_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewedBeans" ADD CONSTRAINT "_ReviewedBeans_A_fkey" FOREIGN KEY ("A") REFERENCES "Bean"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReviewedBeans" ADD CONSTRAINT "_ReviewedBeans_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
