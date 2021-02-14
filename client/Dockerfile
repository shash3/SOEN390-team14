FROM node:14-slim
WORKDIR /app
COPY ./package.json ./
LABEL Name=soen390team14 Version=0.0.1
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
