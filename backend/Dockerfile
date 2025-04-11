FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ARG API_URL
ENV API_URL=$API_URL
ARG API_KEY
ENV API_KEY=$API_KEY

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3004", "--reload"]
