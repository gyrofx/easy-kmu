ALTER TABLE "materials" RENAME COLUMN "pricePerMeter" TO "centsPerMeter";--> statement-breakpoint
ALTER TABLE "materials" RENAME COLUMN "pricePerKg" TO "centsPerKg";--> statement-breakpoint
ALTER TABLE "materials" RENAME COLUMN "length" TO "meterPerUnit";--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "kgPerMeter" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "kgPerMeter" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "centsPerMeter" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "centsPerKg" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "meterPerUnit" DROP NOT NULL;