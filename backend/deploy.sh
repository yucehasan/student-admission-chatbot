aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 961889141255.dkr.ecr.us-east-1.amazonaws.com
docker build \
  --build-arg API_URL=<API URL> \
  --build-arg API_KEY=<API_KEY> \
-t student-chatbot/backend .
docker tag student-chatbot/backend:latest 961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/backend:latest
docker push 961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/backend:latest