/*
  Warnings:

  - Added the required column `name` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expense` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `supplier` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit` VARCHAR(191) NOT NULL,
    MODIFY `amount` INTEGER NOT NULL;
