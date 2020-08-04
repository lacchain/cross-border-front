FROM nginx:1.15.5-alpine
RUN apk update && apk add --no-cache bash

ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

COPY ./build /var/www/frontend
COPY ./nginx/start.sh /etc/nginx/start.sh
RUN  chmod ug+x /etc/nginx/start.sh

COPY nginx/frontend.conf /etc/nginx/conf.d/frontend.conf

RUN rm -f /etc/nginx/conf.d/default.conf 2>/dev/null

EXPOSE 80

