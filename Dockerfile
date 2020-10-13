FROM nginx as openolitor-client-admin
COPY ./client-admin-dist/ /usr/share/nginx/html
EXPOSE 80
