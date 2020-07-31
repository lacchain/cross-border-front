FROM nginx:1.15.5-alpine
RUN apk update && apk add --no-cache bash

ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

COPY ./build-pre /var/www/pre
COPY ./nginx/start.sh /etc/nginx/start.sh
RUN  chmod ug+x /etc/nginx/start.sh

COPY nginx/frontend.conf /etc/nginx/conf.d/frontend.pre.conf
COPY nginx/api-frontend.conf /etc/nginx/conf.d/api-frontend.pre.conf
RUN  /bin/sed -i "s/##WORKSPACE##/pre/g" /etc/nginx/conf.d/api-frontend.pre.conf
RUN  /bin/sed -i "s/##WORKSPACE##/pre/g" /etc/nginx/conf.d/frontend.pre.conf

RUN rm -f /etc/nginx/conf.d/default.conf 2>/dev/null

EXPOSE 80

