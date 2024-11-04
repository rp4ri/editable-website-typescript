# editable-website-typescript

Adaptation of the [editable-website](https://github.com/michael/editable-website) repository to a familiar tech stack. This version has been refactored to use Svelte v5, TypeScript, Shadcn-Svelte, PNPM, and Drizzle. Turso was used for local development for ease of use, with plans to migrate components to Svelte with runes where applicable.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
