"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function AuthClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Authenticator socialProviders={["google"]}>{children}</Authenticator>;
}
