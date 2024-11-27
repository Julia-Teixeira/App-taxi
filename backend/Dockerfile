
FROM node:22-alpine

WORKDIR /api

COPY package*.json ./

RUN npm i

COPY . . 

RUN npx prisma generate

RUN npx prisma migrate dev

EXPOSE 8080

CMD [ "npm", "run", "dev"]
