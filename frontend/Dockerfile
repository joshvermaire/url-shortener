FROM node:latest AS builder

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
