-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phase" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "group" TEXT,
    "playerA1" INTEGER NOT NULL,
    "playerA2" INTEGER NOT NULL,
    "playerB1" INTEGER NOT NULL,
    "playerB2" INTEGER NOT NULL,
    "sets" TEXT,
    "winner" TEXT,
    "court" TEXT,
    "date" TEXT,
    "live" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
