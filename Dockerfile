FROM node

WORKDIR /usr/app

COPY . /usr/src/app
COPY package*.json .

RUN npm install .

EXPOSE 8000

COPY . .

CMD ["npm", "start"]
# CMD ["nodemon"]