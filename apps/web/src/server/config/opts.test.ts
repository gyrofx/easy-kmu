import { initOptsInternal } from "@/server/config/opts";
import { writeFileSync } from "fs";
import { dirSync, type DirResult } from "tmp";

const defaultWebServerEnv = {
	EKMU_WEB_SESSION_SECRET:
		"UAbzjdfPoiIKMKRiragYQR6USOBTntfouQEOm1kmZzUqpjOK7ZSSeKKlLa7Ho29JRfwe1UJhy2z",
	EKMU_WEB_AUTH0_DOMAIN: "odimeter.example.com",
	EKMU_WEB_AUTH0_CLIENT_ID: "1234567890",
	EKMU_WEB_AUTH0_REDIRECT_URL: "http://localhost:3000",
	EKMU_WEB_RUN_AS: "webServer",
	EKMU_WEB_REDIS_URL: "redis://localhost:6379",
	NODE_ENV: "development",
};

describe("initOptsInternal", () => {
	it("works with the default environment", () => {
		const opts = initOptsInternal(defaultWebServerEnv);
		expect(opts).toMatchSnapshot();
	});

	describe("ensure safe environment", () => {
		describe("NODE_TLS_REJECT_UNAUTHORIZED", () => {
			describe("in production", () => {
				const env = {
					...defaultWebServerEnv,
					NODE_ENV: "production",
				};

				it("throws if value is an empty string", () => {
					expect(() =>
						initOptsInternal({ ...env, NODE_TLS_REJECT_UNAUTHORIZED: "" }),
					).toThrow();
				});

				it("throws if value if value is set", () => {
					expect(() =>
						initOptsInternal({ ...env, NODE_TLS_REJECT_UNAUTHORIZED: "0" }),
					).toThrow();
				});

				it("accepts safe environment", () => {
					expect(() => initOptsInternal({ ...env })).not.toThrow();
				});
			});

			describe("in non production", () => {
				const env = { ...defaultWebServerEnv, NODE_ENV: "development" };

				it("accepts empty value", () => {
					expect(() =>
						initOptsInternal({ ...env, NODE_TLS_REJECT_UNAUTHORIZED: "" }),
					).not.toThrow();
				});

				it("accepts string value", () => {
					expect(() =>
						initOptsInternal({ ...env, NODE_TLS_REJECT_UNAUTHORIZED: "0" }),
					).not.toThrow();
				});
			});
		});
	});

	describe("https opts", () => {
		let tempDirectory: DirResult;

		beforeEach(() => {
			tempDirectory = dirSync({ unsafeCleanup: true });
		});

		afterEach(() => tempDirectory.removeCallback());

		function createFiles(filenames: string[]): string[] {
			return filenames.map((filename) => {
				const path = `${tempDirectory.name}/${filename}`;
				writeFileSync(path, "");
				return path;
			});
		}

		it("parses the ssl certificate and key", () => {
			const [keyFile, certFile] = createFiles(["file.key", "/file.crt"]);

			const opts = initOptsInternal({
				...defaultWebServerEnv,
				HTTPS: "true",
				SSL_KEY_FILE: keyFile,
				SSL_CRT_FILE: certFile,
			});

			expect(opts.https).toEqual({
				enabled: true,
				sslKeyFile: keyFile,
				sslCertFile: certFile,
			});
		});

		it("throws an error with a missing key file", () => {
			const [certFile] = createFiles(["/file.crt"]);
			const keyFile = `${tempDirectory.name}/missing.key`;

			expect(() =>
				initOptsInternal({
					...defaultWebServerEnv,
					HTTPS: "true",
					SSL_KEY_FILE: keyFile,
					SSL_CRT_FILE: certFile,
				}),
			).toThrow();
		});

		it("throws an error with a missing ssl key", () => {
			expect(() =>
				initOptsInternal({
					...defaultWebServerEnv,
					HTTPS: "true",
					SSL_CRT_FILE: "file.crt",
				}),
			).toThrow();
		});
	});

	it("parses the host", () => {
		expect(
			initOptsInternal({ ...defaultWebServerEnv, HOST: "depart.localhost" })
				.host,
		).toBe("depart.localhost");
	});

	it("parses the port", () => {
		expect(
			initOptsInternal({ ...defaultWebServerEnv, EKMU_WEB_PORT: "5555" }).port,
		).toBe(5555);
	});

	describe("session opts", () => {
		it("parses the secret", () => {
			expect(
				initOptsInternal({
					...defaultWebServerEnv,
					EKMU_WEB_SESSION_SECRET:
						"dyMJ3JoaNdvsF4tMwqX33QaSJP7wGta6XwaCOeO00HyPUlnEuhOLg",
				}).session,
			).toMatchInlineSnapshot(`
        {
          "secret": "dyMJ3JoaNdvsF4tMwqX33QaSJP7wGta6XwaCOeO00HyPUlnEuhOLg",
        }
      `);
		});

		it("throws when session secret is missing", () => {
			expect(() =>
				initOptsInternal({
					NODE_ENV: "development",
				}),
			).toThrow();
		});
	});
});
