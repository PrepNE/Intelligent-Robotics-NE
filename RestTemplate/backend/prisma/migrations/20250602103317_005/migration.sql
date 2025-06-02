/*
  Warnings:

  - The primary key for the `plates_log` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "plates_log" DROP CONSTRAINT "plates_log_pkey",
ADD COLUMN     "exit_status" TEXT,
ADD COLUMN     "exit_timestamp" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "plates_log_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "plates_log_id_seq";
