# Bikerr
[![Travis-ci](https://travis-ci.com/shash3/SOEN390-team14.svg?token=yqePnie6vvPik5z1MhQa&branch=master)](https://travis-ci.com/shash3/SOEN390-team14)

## Purpose
This project is created to satisfy the requirements of SOEN390.

## Description
The project is a simplified ERP website for our client who is the owner of a Bike manufacturing company.

## Technologies Used
* ReactJS
* NodeJs (Express Framework)
* MongoDB (Cloud Database)

## Requirements
* NodeJS (12 or above) https://nodejs.org/en/download/
* MongoDB Account

## Installation
* Clone/Download the project
* cd into the back-end folder and install all the dependencies by typing `npm install`
* cd into the client folder and install all the dependencies by typing `npm install`

### In the Back-end Folder
* `npm run dev` will run server + front-end
* `npm run server` will run server only

### In the Client Folder
* `npm start` will run front-end only

### Docker
* docker pull soen390team14/backend
* docker pull soen390team14/frontend
* docker run -d --name api-server -it -p 5000:5000 soen390team14/backend
* docker run -d --link api-server -it -p 3000:3000 soen390team14/frontend

* https://hub.docker.com/repository/docker/soen390team14/backend
* https://hub.docker.com/repository/docker/soen390team14/frontend

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
* Ashraf Khalil	
* James	El Tayar
* Jamil	Hirsh	
