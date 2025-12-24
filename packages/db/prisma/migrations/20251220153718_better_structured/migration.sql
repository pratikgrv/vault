/*
  Warnings:

  - You are about to drop the column `links` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "links",
DROP COLUMN "socials",
DROP COLUMN "theme";

-- CreateTable
CREATE TABLE "interest" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interest_profileId_idx" ON "interest"("profileId");

-- CreateIndex
CREATE INDEX "interest_category_idx" ON "interest"("category");

-- CreateIndex
CREATE INDEX "link_profileId_idx" ON "link"("profileId");

-- CreateIndex
CREATE INDEX "link_type_idx" ON "link"("type");

-- AddForeignKey
ALTER TABLE "interest" ADD CONSTRAINT "interest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link" ADD CONSTRAINT "link_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
