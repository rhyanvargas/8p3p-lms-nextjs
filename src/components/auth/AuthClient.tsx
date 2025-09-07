"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

// Configure Amplify only if outputs are available
if (typeof window !== 'undefined') {
  try {
    const outputs = require('@/amplify_outputs.json');
    Amplify.configure(outputs);
  } catch (error) {
    console.warn('Amplify outputs not found during build');
  }
}

export default function AuthClient({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Authenticator>{children}</Authenticator>;
}
