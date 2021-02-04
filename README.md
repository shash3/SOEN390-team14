# SOEN390-Team14 ERP System
## Objective

## Description

## Technologies Used
* ReactJS
* NodeJs
* MongoDB

## Team Members
* Shashank Patel  - 40094236
* Sacha Elkaim - 29779698
* Derek Ruiz-Cigana - 40096268
* Michael Takenaka - 40095917
* Adam Richard - 27059329
* Jamil	Hirsh	21236962
* Ashraf Khalil	- 40066289
* James	El Tayar - 40097755

## Getting Started
* Download Node,js from https://nodejs.org/en/download/
* Clone/Download the project
* In the main folder and the client folder install all missing depencies by typing `npm install` 

In the Main Folder
* `npm run dev` will run server + front-end
* `npm run server` will run server only

In the Client Folder
* `npm start` will run front-end only

## Docker

* `docker pull soen390team14/backend1` will pull back-end image
* `docker pull soen390team14/front1` will pull front-end image
* `docker run -d --name api-server -it -p 5000:5000 soen390team14/backend1` will run front-end image
* `docker run -d --link api-server -it -p 3000:3000 soen390team14/front1` will run front-end image
