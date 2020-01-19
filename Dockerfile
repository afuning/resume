FROM nginx:latest

COPY public/ /usr/share/nginx/html/
COPY ./vhost.nginx.conf /etc/nginx/conf.d/resume.conf 