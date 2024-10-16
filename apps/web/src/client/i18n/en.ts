import type { I18n } from "@/client/i18n/t";

export const en: I18n = {
	app: {
		title: "Worklogs",
	},
	routes: {
		home: "Übericht",
		about: "About",
		invoice: "Invoices",
		settings: "Settings",
		signIn: "Anmelden",
	},
	errors: {
		restart: "Restart",
		reloadPage: "Reload page",
		unexpectedError: "Unexpected error ocurred, please try to reload the page",
		componentStack: "Developer info (please forward this to the developers)",
		errorName: "Error name",
		errorMessage: "Message",
		unknownError: "Unknown error",

		unexpectedErrorDialog:
			"Unfortunately, an unexpected error has occurred. Please wait a moment and then restart the application. If the problem occurs repeatedly, please contact technical service",
	},
	about: {
		buildTime: "Build Datum",
		gitRef: "Git Ref",
		gitBranch: "Git Branch",
	},
};
