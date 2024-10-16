ALTER TABLE "workingDay" RENAME TO "workingTimeEntry";--> statement-breakpoint
ALTER TABLE "workingTimeEntry" DROP CONSTRAINT "workingDay_taskId_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "workingTimeEntry" DROP CONSTRAINT "workingDay_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingTimeEntry" ADD CONSTRAINT "workingTimeEntry_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workingTimeEntry" ADD CONSTRAINT "workingTimeEntry_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
