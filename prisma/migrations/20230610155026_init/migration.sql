/*
  Warnings:

  - Added the required column `completed` to the `ListItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "completed" BOOLEAN NOT NULL;
