ALTER TABLE "workingTimeOfUsers" RENAME TO "workingDay";--> statement-breakpoint
ALTER TABLE "workingDay" DROP CONSTRAINT "workingTimeOfUsers_taskId_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "workingDay" DROP CONSTRAINT "workingTimeOfUsers_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingDay" ADD CONSTRAINT "workingDay_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingDay" ADD CONSTRAINT "workingDay_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
