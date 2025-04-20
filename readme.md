# TaskManager (To-Do list Web App)

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Setting up MongoDB Locally](#setting-up-mongodb-locally)

## Introduction
TaskManager is a Node.js application for managing tasks. This webapp built with Expressjs, Mongoose(MongoDB), Bootstrap 5. This README will guide you through the process of installing Node.js, setting up the Node.js server, configuring the environment variables, and setting up MongoDB locally, running the project in your browser.

> **⚠️ Disclaimer:**
>  
> This project is created solely for **Academic purposes** and is intended for **learning and demonstration** only.  
> It is **not designed or authorized for commercial use**.  

## Installation

### Prerequisites
- Node.js (v14.x or above)
- npm (v6.x or above)
- MongoDB (v4.x or above)

### Node.js Installation
1. Download the Node.js installer from the [official website](https://nodejs.org/).
2. Run the installer and follow the instructions.
3. Verify the installation by running the following commands in your terminal:
    ```bash
    node -v
    npm -v
    ```

## Setup

### Clone the Repository
1. Download and install GIT from [official website](https://git-scm.com/downloads/win).
2. Open your terminal.
3. Clone the repository using the following command:
    ```bash
    git clone https://github.com/Atanu-P/taskmanager.git
    ```
4. Navigate to the backend folder inside project directory to install required dependencies:
    ```bash
    cd taskmanager && cd backend
    ```

### Install Dependencies inside backend folder
1. Install the required Node.js dependencies, all the dependencies listed in `package.json` file within backend folder:
    ```bash
    npm install
    ```

### Environment Variables
1. Create a `.env` file in the root directory of the project.
2. Install and setup MongoDB using Compass or CLI. Follow the instruction below [Setting up MongoDB Locally](#setting-up-mongodb-locally).
3. Add the following environment variables to the `.env` file or use `.env.sample` as reference:
    ```bash
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/taskmanager
    ACCESS_TOKEN_SECRET=secretword
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=secretword
    REFRESH_TOKEN_EXPIRY=10d
    ```

## Running the Project

### Start the Server
1. Start the server using the following command:
    ```bash
    cd backend && npm start
    ```
2. The server should now be running on `http://localhost:3000`.

### Open in Browser
1. Open your browser and navigate to `http://localhost:3000`.

2. Test api url `http://localhost:3000/api`.

### If response shows `statusCode:200` output on browser, then Api server running successfully.

## Setting up MongoDB Locally

### Install MongoDB
1. Download the MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community).
2. Download the Compass (MongoDB GUI) from [official website](https://www.mongodb.com/try/download/compass).
3. You can use Compass GUI or CLI to setup database for this project.
4. Follow the below instructions using CLI.

### Start MongoDB (CLI)
1. Open a terminal and run the following command to start the MongoDB server:
    ```bash
    mongod
    ```
2. MongoDB should now be running on `mongodb://localhost:27017`.

### Create Database (CLI)
1. Open another terminal window.
2. Start the MongoDB shell using the following command:
    ```bash
    mongo
    ```
3. Create the `taskmanager` database:
    ```bash
    use taskmanager
    ```
4. You can now interact with the `taskmanager` database.

## Use API testing tools such as Postman or Insomnia for debugging and testing.
