FROM node:22.13.0-alpine

RUN npm install -g next

COPY ./ /app
WORKDIR /app
RUN npm install

EXPOSE ${APP_PORT}

CMD ["npm", "run", "dev"]