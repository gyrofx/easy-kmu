DO $$ BEGIN
 CREATE TYPE "public"."workingType" AS ENUM('task', 'illnes', 'weeding', 'bereavement', 'changeResidence', 'doctorVisit', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "specialDays" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" date NOT NULL,
	"overridenWorkingTimeInMin" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "specialDays_day_unique" UNIQUE("day")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workingTime" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from" date NOT NULL,
	"to" date NOT NULL,
	"regularWorkingTimePerDayInMin" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "workingTime_from_unique" UNIQUE("from"),
	CONSTRAINT "workingTime_to_unique" UNIQUE("to")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workingTimeOfUsers" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day" date NOT NULL,
	"workingTimeInMin" integer NOT NULL,
	"workingType" "workingType" NOT NULL,
	"taskId" text,
	"comment" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingTimeOfUsers" ADD CONSTRAINT "workingTimeOfUsers_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
