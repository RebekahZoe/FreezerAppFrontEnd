FROM nginx
COPY . /opt/FreezerAppFrontEnd
COPY nginx.conf /etc/nginx/nginx.conf
