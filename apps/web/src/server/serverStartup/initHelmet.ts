import { opts } from "@/server/config/opts";
import type { Express } from "express";
import helmet from "helmet";

export function initHelmet(app: Express) {
	app.disable("x-powered-by");
	app.use(helmet(helmetConfiguration()));
}

function helmetConfiguration() {
	const { auth } = opts();

	return {
		contentSecurityPolicy: {
			directives: {
				connectSrc: ["'self'", auth.auth0.domain],
				scriptSrc: ["'self'", "unsafe-inline"],
			},
		},
	};
}
