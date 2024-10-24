FROM node:18

WORKDIR /app

COPY package*.json .


RUN npm install

ENV NODE_PATH=/app/node_modules

COPY . .

EXPOSE 80

CMD ["npm", "start"]