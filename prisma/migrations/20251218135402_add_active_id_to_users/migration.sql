/*
  Warnings:

  - A unique constraint covering the columns `[active_session_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `activeSessionId` VARCHAR(191) NULL,
    ADD COLUMN `active_session_id` VARCHAR(191) NULL,
    ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    MODIFY `contactNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_active_session_id_key` ON `User`(`active_session_id`);
