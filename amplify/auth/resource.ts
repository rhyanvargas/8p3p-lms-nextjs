import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	// Login Methods Configuration
	loginWith: {
		// Email login method enabled
		email: true,

		// External Providers Configuration
		externalProviders: {
			// Google Authentication
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["email", "profile"],
			},
			// Callback and logout URLs must be inside externalProviders
			callbackUrls: [
				"http://localhost:3000/login",
				"http://localhost:3000/dashboard",
				"https://main.dk50b1ut1cu9u.amplifyapp.com/dashboard",
				"https://8p3p.io/dashboard",
			],
			logoutUrls: [
				"http://localhost:3000/login",
				"https://main.dk50b1ut1cu9u.amplifyapp.com/login",
				"https://8p3p.io/login",
			],
		},
	},

	// User Attributes Configuration - outside loginWith
	userAttributes: {
		// Standard attributes
		email: {
			mutable: true,
			required: true,
		},
		givenName: {
			mutable: true,
			required: true,
		},
		familyName: {
			mutable: true,
			required: false,
		},
		profilePicture: {
			mutable: true,
			required: false,
		},
		// Custom attributes with required dataType
		"custom:organization": {
			dataType: "String",
			mutable: true,
			minLen: 3,
			maxLen: 100,
		},
		"custom:role": {
			dataType: "String",
			mutable: true,
		},
	},

	// Multi-factor Authentication Configuration
	multifactor: {
		mode: "OPTIONAL", // Can be OPTIONAL or REQUIRED
		sms: true,
		totp: false,
	},

	// Account Recovery Configuration
	accountRecovery: "EMAIL_ONLY",

	// Email Sender Configuration
	senders: {
		email: {
			fromEmail: "support@8p3p.io",
		},
	},
});
