import { createInvoiceSchema } from "@easy-kmu/common";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const contract = initContract();

export const serverInfoSchema = z.object({
	opts: z.object({
		isDevelopment: z.boolean(),
	}),
});

export const api = contract.router({
	createInvoice: {
		method: "POST",
		path: "/api/pdf/invoice",
		// headers: z.object({
		//   'Content-Type': z.string().optional(),
		//   'Content-disposition': z.string().optional(),
		// }),
		responses: {
			200: z.unknown(),
		},
		body: createInvoiceSchema,
	},
});
