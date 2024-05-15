FROM node:22.1

ENV PORT=3000

WORKDIR /frontend-react-js

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
EXPOSE ${PORT}
CMD ["npm", "start"]