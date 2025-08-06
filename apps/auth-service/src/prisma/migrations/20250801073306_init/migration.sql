-- CreateTable
CREATE TABLE "users_auth" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_keys" (
    "id" TEXT NOT NULL,
    "user_auth_id" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_email_key" ON "users_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users_auth"("user_id");

-- CreateIndex
CREATE INDEX "users_auth_email_idx" ON "users_auth"("email");

-- CreateIndex
CREATE INDEX "users_auth_created_at_idx" ON "users_auth"("created_at");

-- CreateIndex
CREATE INDEX "token_keys_user_auth_id_idx" ON "token_keys"("user_auth_id");

-- CreateIndex
CREATE INDEX "token_keys_expires_at_idx" ON "token_keys"("expires_at");

-- AddForeignKey
ALTER TABLE "token_keys" ADD CONSTRAINT "token_keys_user_auth_id_fkey" FOREIGN KEY ("user_auth_id") REFERENCES "users_auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
