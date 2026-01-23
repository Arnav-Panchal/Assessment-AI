-- CreateTable
CREATE TABLE "AdminPrompt" (
    "id" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminPrompt_program_key" ON "AdminPrompt"("program");
