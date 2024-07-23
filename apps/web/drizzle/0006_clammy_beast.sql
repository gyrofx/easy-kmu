DROP TABLE "person";--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "salutation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "company" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "firstName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "lastName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "additional1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "additional2" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "country" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "pobox" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "pobox" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "notes" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "phone1" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "phone2" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "material" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "assembly" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "surface" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "fireProtection" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "en1090" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "clerkEmployeeId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "persons" jsonb DEFAULT '[]'::jsonb NOT NULL;