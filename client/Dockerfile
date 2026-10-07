FROM node:24-alpine AS builder

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/client/dist /usr/share/nginx/html
