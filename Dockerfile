FROM node:22.13.0-alpine

WORKDIR /

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE ${APP_PORT}

CMD ["pnpm", "run", "dev"]