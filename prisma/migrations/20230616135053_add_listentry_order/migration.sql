/*
  Warnings:

  - Added the required column `order` to the `ListEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListEntry" ADD COLUMN     "order" INTEGER NOT NULL;
