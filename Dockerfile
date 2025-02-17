FROM node:22.13.0-alpine

WORKDIR /

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE ${APP_PORT}

CMD ["pnpm", "run", "dev"]