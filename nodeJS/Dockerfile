FROM node:14.16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["bash", "-c","npm install & npm run docker:start"]