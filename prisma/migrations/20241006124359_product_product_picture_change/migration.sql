/*
  Warnings:

  - You are about to drop the column `productId` on the `productPicture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "productPicture" DROP CONSTRAINT "productPicture_productId_fkey";

-- DropIndex
DROP INDEX "productPicture_productId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productPictureId" INTEGER;

-- AlterTable
ALTER TABLE "productPicture" DROP COLUMN "productId";

-- CreateIndex
CREATE INDEX "Product_productPictureId_idx" ON "Product"("productPictureId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productPictureId_fkey" FOREIGN KEY ("productPictureId") REFERENCES "productPicture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
