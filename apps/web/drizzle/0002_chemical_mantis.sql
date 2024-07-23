ALTER TABLE "contact" ALTER COLUMN "salutation" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "gender" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "company" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "firstName" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "firstName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "lastName" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "lastName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "additional1" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "additional2" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "phone1" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "phone2" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "email" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "notes" SET DEFAULT '';