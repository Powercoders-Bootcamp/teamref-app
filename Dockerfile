FROM node:18-alpine

# Install PostgreSQL client libs
RUN apk add --no-cache postgresql-client postgresql-libs

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]

