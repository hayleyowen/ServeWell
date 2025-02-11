FROM node:22.13.0-alpine

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml 

RUN npm install -g pnpm

COPY ./app .

CMD ["pnpm", "dev"]