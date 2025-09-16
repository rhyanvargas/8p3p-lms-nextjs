# AWS Amplify Gen2 Backend Standards

## Authentication Configuration

### Core Authentication Rules
1. **ALWAYS** import `secret` for authentication-based configurations
2. **External Providers**: Only Google, Apple, Amazon, Facebook are supported
3. **Callback/Logout URLs**: Must be inside `externalProviders` object
4. **User Attributes**: Must be outside `loginWith` object
5. **Login Methods**: Only `email` and `phone` are supported (no `username`)

### Required Imports
```typescript
import { defineAuth, secret } from "@aws-amplify/backend";
```

### Authentication Structure
```typescript
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
      },
      signInWithApple: {
        clientId: secret("SIWA_CLIENT_ID"),
        keyId: secret("SIWA_KEY_ID"),
        privateKey: secret("SIWA_PRIVATE_KEY"),
        teamId: secret("SIWA_TEAM_ID"),
      },
      callbackUrls: ["http://localhost:3000/profile"],
      logoutUrls: ["http://localhost:3000/"],
    },
  },
  userAttributes: {
    email: { mutable: true, required: true },
    givenName: { mutable: true, required: true },
    "custom:organization": {
      dataType: "String",
      mutable: true,
      minLen: 3,
      maxLen: 100,
    },
  },
  multifactor: {
    mode: "OPTIONAL",
    sms: true,
    totp: false,
  },
  accountRecovery: "EMAIL_AND_PHONE_WITHOUT_MFA",
});
```

### Custom Attributes Rules
- **Standard Attributes**: `familyName`, `givenName`, `email`, `phoneNumber`, etc.
- **Custom Attributes**: Use `"custom:attributeName"` format
- **Required Field**: Always add `dataType` for custom attributes
- **No Required Field**: Custom attributes don't support `required: true`

## Data Schema Design

### Schema Design Rules (Source of Truth)
1. **Authorization**: Use `.guest()` instead of `.public()` (Gen2 only)
2. **Relationships**: `.belongsTo()` and `.hasMany()` always require related field ID
3. **Enums**: Don't use `.required()` or `.defaultValue()` with enums
4. **Permissions**: Use `.to()` for group permissions: `allow.guest().to(['read', 'write'])`

### Relationship Patterns

#### One-to-Many (hasMany/belongsTo)
```typescript
const schema = a.schema({
  Team: a.model({
    name: a.string().required(),
    members: a.hasMany("Member", "teamId"), // Reference field required
  }),
  Member: a.model({
    name: a.string().required(),
    teamId: a.id(), // Reference field
    team: a.belongsTo("Team", "teamId"), // Must match reference field
  }),
});
```

#### One-to-One (hasOne/belongsTo)
```typescript
const schema = a.schema({
  Customer: a.model({
    name: a.string(),
    activeCart: a.hasOne("Cart", "customerId"),
  }),
  Cart: a.model({
    items: a.string().array(),
    customerId: a.id(),
    customer: a.belongsTo("Customer", "customerId"),
  }),
});
```

#### Many-to-Many (Join Table)
```typescript
const schema = a.schema({
  PostTag: a.model({
    postId: a.id().required(),
    tagId: a.id().required(),
    post: a.belongsTo("Post", "postId"),
    tag: a.belongsTo("Tag", "tagId"),
  }),
  Post: a.model({
    title: a.string(),
    tags: a.hasMany("PostTag", "postId"),
  }),
  Tag: a.model({
    name: a.string(),
    posts: a.hasMany("PostTag", "tagId"),
  }),
});
```

### Authorization Patterns
```typescript
// Correct authorization syntax
.authorization((allow) => [
  allow.owner(),
  allow.guest().to(["read", "write", "delete"])
])

// INCORRECT - Don't use this format
.authorization([allow => allow.owner(), allow => allow.guest().to(['read'])])
```

### Data Operations

#### Creating Relationships
```typescript
// One-to-Many
const { data: team } = await client.models.Team.create({
  name: "Frontend Team",
});
const { data: member } = await client.models.Member.create({
  name: "John",
  teamId: team.id,
});
```

#### Lazy Loading
```typescript
const { data: team } = await client.models.Team.get({ id: "TEAM_ID" });
const { data: members } = await team.members();
```

#### Eager Loading
```typescript
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "TEAM_ID" },
  { selectionSet: ["id", "members.*"] }
);
```

### Schema Export Pattern
```typescript
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Models here
}).authorization((allow) => [allow.guest()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

## Deployment Configuration

### Amplify.yml Structure
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - nvm install 20
        - nvm use 20
        - npm ci --cache .npm --prefer-offline
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --format json
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 20
        - nvm use 20
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
      - node_modules/**/*
```

### Key Deployment Rules
- **Node.js Version**: Explicitly use Node.js 20+ in both backend and frontend
- **Backend Phase**: Required for Gen2 to generate `amplify_outputs.json`
- **Caching**: Include npm, Next.js, and node_modules for faster builds
- **Outputs Generation**: Use `ampx generate outputs` for proper config generation