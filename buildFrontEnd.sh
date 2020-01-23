#!/bin/bash

rm -rf FreezerAppFrontEnd

git clone https://github.com/RebekahZoe/FreezerAppFrontEnd

cd FreezerAppFrontEnd

touch Dockerfile 

echo 'FROM nginx
COPY . /opt/FreezerAppFrontEnd
COPY nginx.conf /etc/nginx/nginx.conf' > Dockerfile

docker stop frontend

docker rm frontend

docker rmi freezer-fe

echo 'events {}
http {
server {
        listen 80 default_server;
        root /opt/FreezerAppFrontEnd;
        index index.html;
        include /etc/nginx/mime.types;
        location / {
                try_files $uri $uri/ =404;
        }
	location /FreezerApplication {
		proxy_pass http://freezerapp:8082;
	}
	}
}' >nginx.conf

docker build -t freezer-fe .

docker run --name frontend --network freezer-network -d -p 80:80 freezer-fe


