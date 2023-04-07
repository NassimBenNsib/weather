FROM node as node

WORKDIR /application

COPY . .

RUN npm install --force

RUN npm run build --prod

EXPOSE 80

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=node /application/dist/weather /usr/share/nginx/html
