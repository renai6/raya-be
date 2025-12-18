-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `employeeNumber` VARCHAR(191) NULL,
    ADD COLUMN `paymentType` ENUM('CASH', 'CREDIT') NOT NULL DEFAULT 'CASH';

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `employeeNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_employeeNumber_key`(`employeeNumber`),
    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
