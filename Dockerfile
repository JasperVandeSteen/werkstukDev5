FROM node

WORKDIR /usr/app

COPY . /usr/src/app
COPY package*.json .

RUN npm install .
RUN npm install -g nodemon

EXPOSE 8000

COPY . .

CMD ["npm", "start"]