FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

RUN yarn install --legacy-peer-deps

COPY prisma ./prisma/

RUN yarn prisma generate


COPY . .

EXPOSE 8080        

USER root

CMD ["yarn","start"]
# CMD ["node","start"]
