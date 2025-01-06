/*
  Warnings:

  - You are about to drop the column `date` on the `sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sale` DROP COLUMN `date`,
    MODIFY `totalAmount` DOUBLE NULL;
