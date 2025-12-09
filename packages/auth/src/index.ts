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

					if (authIntent === "login" || !pendingUsername) {
						return false;
					}

					console.log("pending  username", pendingUsername);
					return {
						data: {
							...user,
							username: pendingUsername,
						},
					};
				},
				after: async (user, ctx) => {
					console.log({ user });
					console.log("Path", ctx?.path);
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
