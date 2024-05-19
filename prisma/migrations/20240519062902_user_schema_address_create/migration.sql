/*
  Warnings:

  - You are about to drop the column `github_id` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "address" TEXT,
    "postaddress" TEXT,
    "detailaddress" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "created_at", "email", "id", "password", "phone", "updated_at", "username") SELECT "avatar", "created_at", "email", "id", "password", "phone", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
