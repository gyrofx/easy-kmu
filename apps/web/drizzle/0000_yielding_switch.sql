CREATE TABLE IF NOT EXISTS "contact" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salutation" text,
	"gender" text,
	"company" text,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"additional1" text,
	"additional2" text,
	"address" text NOT NULL,
	"zipCode" text NOT NULL,
	"city" text NOT NULL,
	"country" text,
	"pobox" text,
	"notes" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "person" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"phone1" text,
	"phone2" text,
	"fax" text,
	"email" text,
	"website" text,
	"notes" text,
	"contactId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projectObject" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"zipCode" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"floor" text NOT NULL,
	"appartement" text NOT NULL,
	"workshopOrder" text NOT NULL,
	"notes" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"notes" text NOT NULL,
	"customerContactId" text NOT NULL,
	"objectId" text NOT NULL,
	"constructionManagementContactId" text NOT NULL,
	"architectContactId" text NOT NULL,
	"builderContactId" text NOT NULL,
	"material" text NOT NULL,
	"assembly" text NOT NULL,
	"surface" text NOT NULL,
	"fireProtection" text NOT NULL,
	"en1090" text NOT NULL,
	"deadline" timestamp (3) DEFAULT now() NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "person" ADD CONSTRAINT "person_contactId_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;
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
