FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

# Do not run as root. The mounted storage must be writable by uid 1000
USER node

EXPOSE 5000

CMD ["node", "src/index.js"]
