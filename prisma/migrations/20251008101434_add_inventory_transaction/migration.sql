-- CreateTable
CREATE TABLE `InventoryTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PURCHASE', 'ADJUSTMENT', 'RETURN') NOT NULL DEFAULT 'PURCHASE',
    `productId` VARCHAR(191) NOT NULL,
    `oldQuantity` INTEGER NOT NULL,
    `newQuantity` INTEGER NOT NULL,
    `oldPrice` DOUBLE NOT NULL,
    `newPrice` DOUBLE NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventoryTransaction` ADD CONSTRAINT `InventoryTransaction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
