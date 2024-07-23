-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productOptionId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderstat" TEXT,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cart_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "productOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cart" ("createdAt", "id", "orderId", "orderstat", "productId", "productOptionId", "quantity", "updatedAt", "userId") SELECT "createdAt", "id", "orderId", "orderstat", "productId", "productOptionId", "quantity", "updatedAt", "userId" FROM "Cart";
DROP TABLE "Cart";
ALTER TABLE "new_Cart" RENAME TO "Cart";
CREATE INDEX "Cart_productId_idx" ON "Cart"("productId");
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");
CREATE INDEX "Cart_productOptionId_idx" ON "Cart"("productOptionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
