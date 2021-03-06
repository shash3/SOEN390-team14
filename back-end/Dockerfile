FROM node:14-slim
COPY ./package.json ./
LABEL Name=soen390team14 Version=0.0.1
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]