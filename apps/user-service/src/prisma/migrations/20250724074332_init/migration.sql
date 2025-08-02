-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "date_of_birth" DATE,
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
