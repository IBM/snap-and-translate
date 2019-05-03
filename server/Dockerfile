FROM node:8

RUN apt-get update && apt-get -q -y install libleptonica-dev
RUN apt-get update && apt-get -q -y install libtesseract3 libtesseract-dev
RUN apt-get update && apt-get -q -y install tesseract-ocr
RUN apt-get update && apt-get -q -y install tesseract-ocr-hin tesseract-ocr-ara tesseract-ocr-fra tesseract-ocr-fin tesseract-ocr-jpn tesseract-ocr-pol tesseract-ocr-spa tesseract-ocr-rus tesseract-ocr-ita tesseract-ocr-por tesseract-ocr-kor tesseract-ocr-ces tesseract-ocr-dan tesseract-ocr-deu tesseract-ocr-nld tesseract-ocr-swe tesseract-ocr-tur

RUN apt-get -q -y install git
RUN apt-get -q -y install gcc

COPY app.js .
COPY package.json .
COPY .env .
RUN npm install
EXPOSE 3000
CMD node app.js