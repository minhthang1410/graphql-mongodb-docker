FROM node:14

WORKDIR /back-end
COPY package.json .
RUN npm install
COPY . .
CMD npm start
