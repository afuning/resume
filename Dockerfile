FROM node:alpine as builder
MAINTAINER afncn@icloud.com

ENV PROJECT_ENV production
ENV NODE_ENV production

WORKDIR /resume

ADD package.json package-lock.json /resume/
RUN npm install --production

ADD . /resume
RUN npm run pub

FROM nginx:latest

COPY public/ /usr/share/nginx/html/   