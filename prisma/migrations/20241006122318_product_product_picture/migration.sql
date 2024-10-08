/*
  Warnings:

  - You are about to drop the column `productId` on the `slideImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "slideImage" DROP CONSTRAINT "slideImage_productId_fkey";

-- DropIndex
DROP INDEX "slideImage_productId_idx";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SMSToken" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "productOption" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "slideImage" DROP COLUMN "productId",
ADD COLUMN     "productPictureId" INTEGER;

-- CreateTable
CREATE TABLE "productPicture" (
    "id" SERIAL NOT NULL,
    "photo" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productPicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "productPicture_productId_idx" ON "productPicture"("productId");

-- CreateIndex
CREATE INDEX "slideImage_productPictureId_idx" ON "slideImage"("productPictureId");

-- AddForeignKey
ALTER TABLE "productPicture" ADD CONSTRAINT "productPicture_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slideImage" ADD CONSTRAINT "slideImage_productPictureId_fkey" FOREIGN KEY ("productPictureId") REFERENCES "productPicture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
