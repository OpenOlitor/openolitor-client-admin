FROM nginx as openolitor-client-kundenportal
COPY ./dist/ /usr/share/nginx/html
EXPOSE 80
