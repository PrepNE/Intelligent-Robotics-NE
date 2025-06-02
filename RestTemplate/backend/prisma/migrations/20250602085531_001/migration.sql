-- CreateTable
CREATE TABLE "plates_log" (
    "id" SERIAL NOT NULL,
    "plate_number" TEXT NOT NULL,
    "payment_status" INTEGER NOT NULL,
    "entry_timestamp" TIMESTAMP(3) NOT NULL,
    "payment_timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plates_log_pkey" PRIMARY KEY ("id")
);
