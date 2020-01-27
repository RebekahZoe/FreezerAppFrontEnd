pipeline {
  agent any
  stages {
   stage('----Stop Previous----'){
      steps{
       sh "docker stop frontend -f"
        sh "docker rm frontend -f"
        sh "docker rmi freezer-fe -f"
        }
      }
   // stage('----Change Nginx Conf----'){
     // steps{
       // sh "echo 'events {}
         //         http {
           //       server {
             //       listen 80 default_server;
               //     root /opt/FreezerAppFrontEnd;
                 //   index index.html;
                   // include /etc/nginx/mime.types;
                    //location / {
                     // try_files $uri $uri/ =404;
                    //}
	              //    location /FreezerApplication {
		        //          proxy_pass http://freezerapp:8082;
	                  //}
	                //}   
                  //}' >nginx.conf"
        //}
      //}
    
   stage('----Build Image For Front End----'){
    steps{
      sh "docker build -t freezer-fe ."
    }
   }
   stage('----Run Container For Front End----'){
    steps{
      sh "docker run --name frontend --network freezer-network -d -p 80:80 freezer-fe"
    }
  }
 }
}
