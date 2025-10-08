/*
  Warnings:

  - You are about to drop the column `newPrice` on the `inventorytransaction` table. All the data in the column will be lost.
  - You are about to drop the column `oldPrice` on the `inventorytransaction` table. All the data in the column will be lost.
  - Added the required column `newRetailPrice` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newWholesalePrice` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldRetailPrice` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldWholesalePrice` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventorytransaction` DROP COLUMN `newPrice`,
    DROP COLUMN `oldPrice`,
    ADD COLUMN `newRetailPrice` DOUBLE NOT NULL,
    ADD COLUMN `newWholesalePrice` DOUBLE NOT NULL,
    ADD COLUMN `oldRetailPrice` DOUBLE NOT NULL,
    ADD COLUMN `oldWholesalePrice` DOUBLE NOT NULL;
