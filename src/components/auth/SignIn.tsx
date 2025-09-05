"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export const SignIn = () => {
	return (
		<div className="w-full max-w-md">
			<Authenticator socialProviders={['google']} />
		</div>
	);
};
