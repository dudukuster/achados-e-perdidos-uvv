-- CreateTable
CREATE TABLE "ItemImage" (
  "id" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemImage_itemId_idx" ON "ItemImage"("itemId");

-- CreateIndex
CREATE INDEX "ItemImage_position_idx" ON "ItemImage"("position");

-- Migrate old single photoUrl into ItemImage rows
INSERT INTO "ItemImage" ("id", "itemId", "url", "position", "createdAt")
SELECT md5(random()::text || clock_timestamp()::text || i."id"), i."id", i."photoUrl", 0, CURRENT_TIMESTAMP
FROM "Item" i
WHERE i."photoUrl" IS NOT NULL AND i."photoUrl" <> '';

-- Drop old column
ALTER TABLE "Item" DROP COLUMN "photoUrl";

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
