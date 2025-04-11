aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 961889141255.dkr.ecr.us-east-1.amazonaws.com
docker build --build-arg REACT_APP_API_URL=<BACKEND-LOAD-BALANCER-DNS-NAME> -t student-chatbot/frontend .
docker tag student-chatbot/frontend:latest 961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/frontend:latest
docker push 961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/frontend:latest