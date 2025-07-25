-- CreateTable
CREATE TABLE "token_keys" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "public_key" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "token_keys_user_id_idx" ON "token_keys"("user_id");

-- CreateIndex
CREATE INDEX "token_keys_expires_at_idx" ON "token_keys"("expires_at");

-- AddForeignKey
ALTER TABLE "token_keys" ADD CONSTRAINT "token_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
