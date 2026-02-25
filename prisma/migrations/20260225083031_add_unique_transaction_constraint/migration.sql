/*
  Warnings:

  - A unique constraint covering the columns `[account_origin_id,account_destination_id,amount,date]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transactions_account_origin_id_account_destination_id_amoun_key" ON "transactions"("account_origin_id", "account_destination_id", "amount", "date");
