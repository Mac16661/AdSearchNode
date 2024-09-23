FROM node:20

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

EXPOSE 80
EXPOSE 8080

COPY --chown=node:node . .

CMD ["node", "index.js"]