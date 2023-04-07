FROM python:3.9-slim-buster

WORKDIR /application

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir flask[async]

COPY . .

EXPOSE 5000

CMD python ./main.py
