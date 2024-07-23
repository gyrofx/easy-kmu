CREATE TABLE IF NOT EXISTS "employee" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phone1" text,
	"phone2" text,
	"email" text,
	"notes" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "clerkEmployeeId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_clerkEmployeeId_employee_id_fk" FOREIGN KEY ("clerkEmployeeId") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
