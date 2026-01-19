/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `number` INTEGER NOT NULL;

-- Update existing rows with sequential numbers
SET @row_number = 0;
UPDATE `transaction` SET number = (@row_number:=@row_number + 1) ORDER BY id;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_number_key` ON `Transaction`(`number`);
