ALTER TABLE "project" RENAME COLUMN "fireProtection" TO "fireProtectionOption";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "en1090" TO "en1090Option";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "customerReference" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "surfaceColor" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "projectManagerEmployeeId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_projectManagerEmployeeId_employee_id_fk" FOREIGN KEY ("projectManagerEmployeeId") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "deadline";