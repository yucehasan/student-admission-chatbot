FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .

RUN npm run build

CMD ["npm", "start"]
