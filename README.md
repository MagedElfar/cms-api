## Description

It is a basic CMS system allow users to mange there system by create dynamic entities and custom attributes .

## Main Tools

- Node.js

- Express.js

- MySQL DB

- TypeScript

- Sequelize: ORM

- Nodemailer: Sending email services

## Installation

```bash
$ npm install
```

## Running the app

### development

```bash
$ npm run dev
```

### Build app

```bash
$ npm run build
```

### production mode

```bash
$ npm start
```

## Database Migration

### Migration

script to run database migration

```bash
$ npm run migration
```

## Environment Variables

PORT: require port for running app ex: 5000.

ENCRYPTION_KEY: key used for ENCRYPTION process in system "it depended on ENCRYPTION algorithm"

test ENCRYPTION_KEY ex: 0f4f6baad4efb4bb7b144e1bf5ca7066.

DB_DATABASE: Database name.

DB_USERNAME: Database username.

DB_PASSWORD: Database Password.

DB_HOST: Database host.

DB_PORT: Database port.

JWT_SECRET: jwt secret key.

JWT_EXPIRE: jwt expire.

GOOGLE_USER: gmail address "used for mail services configuration".

GOOGLE_PASSWORD: password for google services "not gmail password and used for mail services configuration"
