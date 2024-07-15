import { createExpressEndpoints, initServer } from "@ts-rest/express";
import type { Express } from "express";
import { createInvoice } from "@/server/pdf/createInvoice";
import { createReadStream } from "node:fs";
import { api } from "@/common/api";

export function initApi(app: Express) {
	const server = initServer();
	const router = server.router(api, {
		// serverInfo: async () => ({ status: 200, body: serverInfo() }),

		createInvoice: async ({ body, res }) => {
			res.setHeader("Content-type", "application/pdf");
			console.log("CreateInvoice", { body });

			const filename = await createInvoice(body);
			console.log(filename);
			const stream = createReadStream(filename);
			return {
				status: 200,
				body: stream,
			};
		},
	});

	createExpressEndpoints(api, router, app);
}
