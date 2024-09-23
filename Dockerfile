FROM node:18

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

RUN ls -la /app

EXPOSE 8080

CMD ["node", "index.js"]