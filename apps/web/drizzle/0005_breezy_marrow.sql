ALTER TABLE "project" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "notes" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "notes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "customerContactId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "objectId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "constructionManagementContactId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "architectContactId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "builderContactId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "material" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "material" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "assembly" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "assembly" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "surface" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "surface" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "fireProtection" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "fireProtection" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "en1090" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "en1090" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "deadline" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "clerkEmployeeId" DROP NOT NULL;