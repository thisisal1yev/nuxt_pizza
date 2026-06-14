/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CartItemToIngredient" ADD CONSTRAINT "_CartItemToIngredient_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CartItemToIngredient_AB_unique";

-- AlterTable
ALTER TABLE "_IngredientToProduct" ADD CONSTRAINT "_IngredientToProduct_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_IngredientToProduct_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_token_key" ON "Cart"("token");
