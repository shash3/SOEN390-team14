# Bikerr
[![Travis-ci](https://travis-ci.com/shash3/SOEN390-team14.svg?token=yqePnie6vvPik5z1MhQa&branch=master)](https://travis-ci.com/shash3/SOEN390-team14)

## Purpose
This project is created to satisfy the requirements of SOEN390.

## Description
The project is a simplified ERP website for our client who is the owner of a Bike manufacturing company.

## Technologies Used
* ReactJS
* NodeJs (Express Framework)
* MongoDB

## Requirements
* NodeJS (12 or above) https://nodejs.org/en/download/
* MongoDB Account

## Installation
* Clone/Download the project
* In the back-end folder and the client folder install all missing depencies by typing `npm install` 

### In the Main Folder
* `npm run dev` will run server + front-end
* `npm run server` will run server only

### In the Client Folder
* `npm start` will run front-end only

### Docker
* `docker pull soen390team14/backend1` will pull back-end image
* `docker pull soen390team14/front1` will pull front-end image
* `docker run -d --name api-server -it -p 5000:5000 soen390team14/backend1` will run front-end image
* `docker run -d --link api-server -it -p 3000:3000 soen390team14/front1` will run front-end image

### Login Information
- MongoDB:
  - Email: soen390shop@gmail.com
  - Password: Soen390project

## Contributor
* Adam Richard (Project Manager)
* Sacha Elkaim (Programming Manager)
* Shashank Patel
* Derek Ruiz-Cigana
* Michael Takenaka 
* Jamil	Hirsh	
* Ashraf Khalil	
* James	El Tayar
