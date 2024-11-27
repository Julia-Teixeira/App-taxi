
FROM node:22-alpine

WORKDIR /spa

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 80 

CMD [ "npm", "run", "dev"]
