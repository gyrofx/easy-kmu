DO $$ BEGIN
 CREATE TYPE "public"."invoiceState" AS ENUM('draft', 'sent', 'rejected', 'canceled', 'payed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."projectState" AS ENUM('draft', 'offerd', 'rejected', 'accepted', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."quoteState" AS ENUM('draft', 'offerd', 'rejected', 'accepted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salutation" text DEFAULT '' NOT NULL,
	"gender" text DEFAULT '' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"firstName" text DEFAULT '' NOT NULL,
	"lastName" text DEFAULT '' NOT NULL,
	"additional1" text DEFAULT '' NOT NULL,
	"additional2" text DEFAULT '' NOT NULL,
	"address" text NOT NULL,
	"zipCode" text NOT NULL,
	"city" text NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"pobox" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"persons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phone1" text DEFAULT '' NOT NULL,
	"phone2" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoiceNumber" text NOT NULL,
	"projectId" text NOT NULL,
	"state" "invoiceState" DEFAULT 'draft' NOT NULL,
	"data" jsonb NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projectObject" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"zipCode" text NOT NULL,
	"city" text NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"floor" text DEFAULT '' NOT NULL,
	"type" text DEFAULT '' NOT NULL,
	"appartement" text DEFAULT '' NOT NULL,
	"workshopOrder" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectNumber" integer GENERATED ALWAYS AS IDENTITY (sequence name "project_projectNumber_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"state" "projectState" DEFAULT 'draft' NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"customerContactId" text,
	"objectId" text,
	"constructionManagementContactId" text,
	"architectContactId" text,
	"builderContactId" text,
	"material" text DEFAULT '' NOT NULL,
	"assembly" text DEFAULT '' NOT NULL,
	"surface" text DEFAULT '' NOT NULL,
	"fireProtection" text DEFAULT '' NOT NULL,
	"en1090" text DEFAULT '' NOT NULL,
	"deadline" timestamp (3) DEFAULT now(),
	"clerkEmployeeId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quoteNumber" integer NOT NULL,
	"projectId" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"state" "quoteState" DEFAULT 'draft' NOT NULL,
	"data" jsonb NOT NULL,
	"filePath" text,
	"notes" text DEFAULT '' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_customerContactId_contact_id_fk" FOREIGN KEY ("customerContactId") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_objectId_projectObject_id_fk" FOREIGN KEY ("objectId") REFERENCES "public"."projectObject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_constructionManagementContactId_contact_id_fk" FOREIGN KEY ("constructionManagementContactId") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_architectContactId_contact_id_fk" FOREIGN KEY ("architectContactId") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_builderContactId_contact_id_fk" FOREIGN KEY ("builderContactId") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_clerkEmployeeId_employee_id_fk" FOREIGN KEY ("clerkEmployeeId") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quotes" ADD CONSTRAINT "quotes_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
