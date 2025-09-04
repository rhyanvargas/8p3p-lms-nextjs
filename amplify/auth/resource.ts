import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	loginWith: {
		email: true,
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
			},
			callbackUrls: [
				"http://localhost:3000/dashboard",
				"https://main.dk50b1ut1cu9u.amplifyapp.com/dashboard",
				"https://8p3p.io/dashboard",
			],
			logoutUrls: [
				"http://localhost:3000/",
				"https://main.dk50b1ut1cu9u.amplifyapp.com/",
				"https://8p3p.io",
			],
		},
	},
});
