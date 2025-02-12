FROM node:22.13.0-alpine

WORKDIR /

COPY package.json ./ 
COPY pnpm-lock.yaml ./
COPY /app /app
COPY .env ./

RUN npm install -g pnpm
RUN npm install 

EXPOSE ${APP_PORT}

CMD ["pnpm", "run", "dev"]