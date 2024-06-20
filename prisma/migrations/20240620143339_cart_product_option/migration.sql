/*
  Warnings:

  - Added the required column `productOptionId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productOptionId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cart_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "productOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("createdAt", "id", "productId", "quantity", "updatedAt", "userId") SELECT "createdAt", "id", "productId", "quantity", "updatedAt", "userId" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE INDEX "Cart_productId_idx" ON "Cart"("productId");
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");
CREATE INDEX "Cart_productOptionId_idx" ON "Cart"("productOptionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
