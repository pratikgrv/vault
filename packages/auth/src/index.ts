import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@vault/db";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			console.log("Before route", ctx?.path);

			//console.log("Path",ctx)
			//console.log("Path before",ctx?.path)
			// if(ctx?.path.startsWith("/sign-in/social")){
			//     const newSession = ctx.context.newSession;
			//     console.log({newSession})
			// 	console.log(ctx)
			// }
		}),
		after: createAuthMiddleware(async (ctx) => {
			//console.log("Path",ctx)
			console.log("After route path", ctx?.path);
			if (ctx?.path.startsWith("/callback/google")) {
				const newSession = ctx.context.newSession;
				console.log({ newSession });
			}
		}),
	},
	databaseHooks: {
		//console log session,account and user before and after
		session: {
			create: {
				before: async (session, ctx) => {
					console.log({ session });
					console.log("Path", ctx?.path);
					return true;
				},
				after: async (session, ctx) => {
					console.log({ session });
					console.log("Path", ctx?.path);
				},
			},
		},
		account: {
			create: {
				before: async (account, ctx) => {
					console.log({ account });
					console.log("Path", ctx?.path);
					return true;
				},
				after: async (account, ctx) => {
					console.log({ account });
					console.log("Path", ctx?.path);
				},
			},
		},
		user: {
			create: {
				before: async (user, ctx) => {
					console.log({ user });
					console.log("Path", ctx?.path);
					const pendingUsername = ctx?.getCookie("pending_username");
					const authIntent = ctx?.getCookie("auth_intent");

					console.log("Auth Intent:", authIntent);
					console.log("Pending Username:", pendingUsername);

					// If auth_intent is "login", block account creation (existing user should exist)
					if (authIntent === "login") {
						console.log(
							"Blocking user creation: auth_intent is 'login', user should use existing account"
						);
						throw new Error(
							"ACCOUNT_NOT_FOUND: No account found. Please sign up first."
						);
					}

					// If auth_intent is "signup" and username exists, use it
					if (authIntent === "signup" && pendingUsername) {
						console.log("Signup with username from cookie:", pendingUsername);
						return {
							data: {
								...user,
								username: pendingUsername,
							},
						};
					}

					// Otherwise (no auth_intent or no username), create without username
					// User will be redirected to onboarding
					console.log(
						"Creating user without username - will redirect to onboarding"
					);
					return {
						data: {
							...user,
							username: null, // No username yet - needs onboarding
						},
					};
				},
				after: async (user, ctx) => {
					console.log("User created successfully:", { user });
					console.log("Path", ctx?.path);

					// Clean up cookies after successful user creation
					ctx?.setCookie("pending_username", "", { maxAge: 0 });
					ctx?.setCookie("auth_intent", "", { maxAge: 0 });
				},
			},
		},
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
			},
		},
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			//  accessType: "offline",
			// prompt: "select_account consent",
		},
	},

	plugins: [nextCookies()],
});
