-- CreateTable
CREATE TABLE "slideImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "src" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "slideImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "slideImage_src_key" ON "slideImage"("src");
