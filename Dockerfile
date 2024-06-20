FROM node:18

WORKDIR /src

COPY . /src

RUN npm install -g npm@latest

COPY . /src

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--port", "3000", "--host"]