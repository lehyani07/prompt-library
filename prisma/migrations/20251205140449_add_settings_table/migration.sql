-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'site-settings',
    "siteName" TEXT NOT NULL DEFAULT 'Prompt Library',
    "siteDescription" TEXT NOT NULL DEFAULT 'A library of AI prompts',
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "requireEmailVerification" BOOLEAN NOT NULL DEFAULT false,
    "moderatePrompts" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
