-- AlterTable
ALTER TABLE `sale` MODIFY `totalAmount` INTEGER NULL;

-- AlterTable
ALTER TABLE `saledetail` MODIFY `totalPrice` INTEGER NOT NULL;
