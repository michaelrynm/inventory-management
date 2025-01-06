/*
  Warnings:

  - You are about to drop the column `customerId` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `saledetail` table. All the data in the column will be lost.
  - Added the required column `customer` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_customerId_fkey`;

-- DropIndex
DROP INDEX `Sale_customerId_fkey` ON `sale`;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `customerId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customer` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `saledetail` DROP COLUMN `price`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `totalPrice` DOUBLE NOT NULL;
