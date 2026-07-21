-- Add item metadata used by the daily photo reveal game.
ALTER TABLE "Item"
ADD COLUMN "slug" TEXT,
ADD COLUMN "description" TEXT;

UPDATE "Item"
SET "slug" = lower(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || "id"
WHERE "slug" IS NULL;

ALTER TABLE "Item" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");

ALTER TABLE "Item" DROP COLUMN "revealOrder";

-- Store the exact seed sent to clients so every player sees the same reveal order.
ALTER TABLE "DailyPuzzle" ADD COLUMN "revealSeed" TEXT;

UPDATE "DailyPuzzle"
SET "revealSeed" = to_char("date", 'YYYY-MM-DD') || ':' || "difficulty"::text || ':' || "itemId"
WHERE "revealSeed" IS NULL;

ALTER TABLE "DailyPuzzle" ALTER COLUMN "revealSeed" SET NOT NULL;
