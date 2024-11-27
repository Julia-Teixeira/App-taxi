
FROM node:22-alpine

WORKDIR /api

COPY . .

VOLUME [ "../.env" ]

RUN rm -rf node_modules

RUN npm i

RUN npx prisma generate

RUN npx prisma migrate dev

EXPOSE 8080

CMD [ "npm", "run", "dev"]
