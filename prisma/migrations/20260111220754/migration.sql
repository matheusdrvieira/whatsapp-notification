/*
  Warnings:

  - You are about to drop the column `to` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `messageId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "to",
ADD COLUMN     "messageId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;
