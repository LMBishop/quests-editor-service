FROM node:20 AS build

WORKDIR /srv

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:20 AS run

WORKDIR /srv

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=build /srv/dist dist/

CMD [ "node", "dist/main.js" ]
