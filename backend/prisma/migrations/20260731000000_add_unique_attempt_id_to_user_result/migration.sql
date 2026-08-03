-- New results store the signed attempt identifier so one completed attempt
-- cannot be claimed by multiple accounts.
ALTER TABLE "UserResult" ADD COLUMN "attemptId" TEXT;

CREATE UNIQUE INDEX "UserResult_attemptId_key" ON "UserResult"("attemptId");
