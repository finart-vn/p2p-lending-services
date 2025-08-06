FROM node:20-alpine

WORKDIR /apps/api-gateway

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]