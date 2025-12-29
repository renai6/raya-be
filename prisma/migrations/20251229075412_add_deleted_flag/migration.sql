-- AlterTable
ALTER TABLE `employee` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
