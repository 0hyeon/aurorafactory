/*
  Warnings:

  - Made the column `plusdiscount` on table `productOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `productOption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN "orderstat" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_productOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "color" TEXT,
    "plusdiscount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "productOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_productOption" ("color", "created_at", "id", "plusdiscount", "productId", "quantity", "updated_at") SELECT "color", "created_at", "id", "plusdiscount", "productId", "quantity", "updated_at" FROM "productOption";
DROP TABLE "productOption";
ALTER TABLE "new_productOption" RENAME TO "productOption";
CREATE INDEX "productOption_productId_idx" ON "productOption"("productId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
