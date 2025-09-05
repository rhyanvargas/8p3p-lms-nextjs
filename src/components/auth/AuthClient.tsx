"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function AuthClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Authenticator>{children}</Authenticator>;
}
