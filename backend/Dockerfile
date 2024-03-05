FROM node:20.11

WORKDIR /app/backend

COPY package*.json ./

RUN git clone https://github.com/vishnubob/wait-for-it.git

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev-docker"]
