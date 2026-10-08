/**
 * Creates a Clerk Agent Task and prints its one-time sign-in URL. The URL
 * signs in as the user without a password, so this refuses redirects other
 * than local or Vercel preview apps, and any key but a development one. The
 * key comes from the env file, never the shell, so a production key exported
 * elsewhere is ignored.
 */
import { readFileSync } from "node:fs";
import { parseArgs, parseEnv } from "node:util";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function isAllowedRedirect(url: URL) {
	if (LOCAL_HOSTS.has(url.hostname)) return true;
	return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
}

function fail(message: string): never {
	console.error(message);
	process.exit(1);
}

const { values } = parseArgs({
	options: {
		"env-file": { type: "string" },
		identifier: { type: "string" },
		"redirect-url": { type: "string" },
		description: { type: "string" },
	},
});

if (!values.identifier) fail("Pass --identifier with the user's email.");
if (!values.description) {
	fail("Pass --description with what you are checking; Clerk records it.");
}
const redirectUrl = URL.parse(values["redirect-url"] ?? "");
if (!redirectUrl || !isAllowedRedirect(redirectUrl)) {
	fail(
		`--redirect-url must be a localhost or https *.vercel.app URL, got ${values["redirect-url"]}`,
	);
}
const envFile = values["env-file"];
if (!envFile) fail("Pass --env-file with the project's Clerk env file.");
const secretKey = parseEnv(readFileSync(envFile, "utf8")).CLERK_SECRET_KEY;
if (!secretKey?.startsWith("sk_test_")) {
	fail(`CLERK_SECRET_KEY in ${envFile} is missing or not a development key.`);
}

const response = await fetch("https://api.clerk.com/v1/agents/tasks", {
	method: "POST",
	headers: {
		Authorization: `Bearer ${secretKey}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		on_behalf_of: { identifier: values.identifier },
		permissions: "*",
		agent_name: "local-dev-agent",
		task_description: values.description,
		redirect_url: redirectUrl.href,
	}),
});

const body = await response.json();
if (!response.ok) {
	const errors: { code: string; long_message?: string; message: string }[] =
		body.errors ?? [];
	fail(
		`Clerk returned ${response.status}:\n` +
			errors
				.map((e) => `- ${e.code}: ${e.long_message ?? e.message}`)
				.join("\n"),
	);
}

console.log(body.url);
