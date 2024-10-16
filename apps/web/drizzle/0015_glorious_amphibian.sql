DO $$ BEGIN
 CREATE TYPE "public"."taskState" AS ENUM('todo', 'inProgress', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "state" "taskState" DEFAULT 'todo' NOT NULL;