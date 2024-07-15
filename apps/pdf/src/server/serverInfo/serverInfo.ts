import type { ServerInfo } from "@/common/serverInfo/ServerInfo";
import { clientOpts } from "@/server/config/clientOpts";

export function serverInfo(): ServerInfo {
	return {
		opts: clientOpts(),
		version: "1.0.0",
		appShortVersion: "1.0.0",
		optsShortVersion: "1.0.0",
	};
}
