---
name: clerk-agent-testing
description: Test a Clerk app running locally or on a Vercel preview as a test user. Sign in through an Agent Task, and find or create agent-owned users with specific roles or organizations. Use when checking UI behind sign-in, when the app shows its sign-in screen, or when a test depends on a user's role or organization.
---

An **Agent Task** is a one-time Clerk URL that signs the browser in as a user and redirects to the app. It is the sign-in route for agents: OAuth providers such as Google block embedded browsers, and test users have no passwords.

Everything here needs the project's development `CLERK_SECRET_KEY` (an `sk_test_` key), kept in a gitignored env file such as `.env.local`. Below, `<env file>` is that file's path.

## Sign in

The sign-in script sits in `scripts/` beside this file and needs Node 22.18 or newer. It reads the key from the env file, and it refuses a non-development key and a redirect to anything but a local app or an `https` `*.vercel.app` preview. If it refuses, stop and tell the human: a secret key can sign in as any user.

1. Create the task. `--description` is what you are checking; it is the audit trail in Clerk. `--redirect-url` is the running app or any page under it. Done when it prints a URL.

   ```sh
   node <this skill>/scripts/agent-login.mts --env-file <env file> \
     --identifier <user email> --redirect-url <app URL> \
     --description "<what you are checking>"
   ```

2. Open the URL in a fresh browser tab, one tab per user. It lands on the app.

3. Confirm the session in the page. Done when `email` is the user you chose and `actor.type` is `"agent"`. If it shows anyone else, the tab kept an older session: repeat from step 1 in a new tab.

   ```js
   (async () => {
   	while (!window.Clerk?.loaded) await new Promise((r) => setTimeout(r, 200));
   	const s = window.Clerk.session;
   	return { email: s?.user.primaryEmailAddress?.emailAddress, actor: s?.actor ?? null };
   })();
   ```

A native app keeps its own session, which an Agent Task cannot reach. Sign it in through the app's email-code flow instead, with the user's `+clerk_test` address and `424242`.

## Users

Agents own the users whose `private_metadata.agent_created` is `true`, and may change their data freely. Every other user belongs to a human, even one with a `+clerk_test` address; a human's account holds real data, so treat it as read-only unless they asked for a change.

Give every `clerk` command the env file's key in the same command, since each command runs in a fresh shell. Without it, the CLI falls back to the human's Clerk login, which can reach production. Below, `clerk-dev` stands for this prefix:

```sh
CLERK_SECRET_KEY="$(sed -n 's/^CLERK_SECRET_KEY=//p' <env file>)" clerk
```

### Find agent-owned users

Agent-owned users persist between runs, and each email names the scenario it sets up. The API cannot filter on metadata, so filter locally; if the output has `hasMore: true`, repeat with `--offset 250`:

```sh
clerk-dev users list --json --limit 250 | jq -c '.data[] | select(.private_metadata.agent_created == true) | {id, email: .email_addresses[0].email_address, public_metadata}'
```

Earlier runs may have changed a user's data since its scenario was named; its state shows once signed in.

### Create agent-owned users

Name each user `agent-<scenario>+clerk_test@example.com`, with a scenario name that says what it sets up, such as `agent-org-b-member`, so later runs can find it. Clerk sends no mail to `+clerk_test` addresses and accepts `424242` as their verification code.

`private_metadata.agent_created` marks the user as agent-owned. `skip_password_requirement` is needed on instances that require a password.

```sh
clerk-dev users create --yes -d '{"email_address":["agent-<scenario>+clerk_test@example.com"],"first_name":"Agent","last_name":"<scenario>","private_metadata":{"agent_created":true},"skip_password_requirement":true}'
```

Set up organizations, memberships, and metadata roles through `clerk-dev api` with the Backend API. Give each organization you create the same `private_metadata.agent_created` flag, so cleanup can find it once its users are gone. An organization's `created_by` user becomes its `org:admin`.

### Clean up

When testing is done, list the users and organizations you created this run in the handoff and offer to delete them; the human decides. Delete only agent-owned ones:

```sh
clerk-dev api -X DELETE /users/<user_id> --yes
clerk-dev api -X DELETE /organizations/<org_id> --yes
```

## Limits

- The URL is single-use and valid for 1 hour; the session lasts 30 minutes. When either runs out, create a new task.
- Agent Tasks are in beta. If the endpoint or a field changes, the script prints Clerk's error, which names it.
- Use Agent Tasks rather than `clerk impersonate`: impersonation needs the human's Clerk login, is capped at 5 per month, and stops on Clerk's hosted page instead of the app.
