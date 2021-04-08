# Bikerr
[![Travis-ci](https://travis-ci.com/shash3/SOEN390-team14.svg?token=yqePnie6vvPik5z1MhQa&branch=master)](https://travis-ci.com/shash3/SOEN390-team14)

## Purpose
This project is created to satisfy the requirements of SOEN390.

## Description
The project is a simplified ERP website for our client who is the owner of a Bike manufacturing company.

***

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
* Ensure you have Docker installed
* Open terminal
* execute `docker pull soen390team14/backend`
* execute `docker pull soen390team14/frontend`
* execute `docker run -d --name api-server -it -p 5000:5000 soen390team14/backend && docker run -d --link api-server -it -p 3000:3000 soen390team14/frontend`
* You can now navigate the application through http://localhost:3000/
* https://hub.docker.com/repository/docker/soen390team14/backend
* https://hub.docker.com/repository/docker/soen390team14/frontend

***
## Deployment
The website is deployed and hosted on heroku. You can access the website through the following link:
  * https://bikerr.herokuapp.com/

***

## Login Information
- MongoDB:
  - Email: soen390shop@gmail.com
  - Password: Soen390project
- Bikerr
  - Email: admin@gmail.com
  - Password: 12345678
 
 ***

## Name Convention
* As a reference style guide for JavaScript, we are refering to the Google JavaScript Style Guide. To enforce the coding covention, we have implemented Prettier and Eslint on the whole project. 
  * Prettier will automatically format the code on save according to the set of rules that we have given it. 
  * Eslint will ensure that our code quality remains high.

  #### Enforcing Convention
  * Eslint has been installed.
  * `npm -g i eslint-cli` if you have never used eslint-cli before
  * navigate into the client folder and run `eslint src` 
  * navigate into the back-end folder and run `eslint name`, where `name` is the name of folder you want check.

***

## Generate Complexity Report
* `npm install -g plato`
* download the project and unzip it
* navigate to the root of where you unzipped the project
* `plato -r -d report -t "code-analysis report" soen390-team14-master`
*  The generated report can be found under the folder named `code-analysis report` and the `index.html` contains the code analysis for the entirety of the project.  
 ![analysis](https://i.imgur.com/7JkdETw.png)
 
 ***

## Contributor
* Adam Richard (Project Manager)
* Sacha Elkaim (Programming Manager)
* Shashank Patel
* Derek Ruiz-Cigana
* Michael Takenaka 
* Ashraf Khalil	
* James	El Tayar
