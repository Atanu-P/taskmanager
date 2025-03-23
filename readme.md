# Task Manager

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Setting up MongoDB Locally](#setting-up-mongodb-locally)

## Introduction
TaskManager is a Node.js application for managing tasks. This README will guide you through the process of installing Node.js, setting up the server, configuring the environment variables, running the project in your browser, and setting up MongoDB locally.

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
1. Open your terminal.
2. Clone the repository using the following command:
    ```bash
    git clone https://github.com/Atanu-P/taskmanager.git
    ```
3. Navigate to the project directory:
    ```bash
    cd taskmanager
    ```

### Install Dependencies
1. Install the required Node.js dependencies:
    ```bash
    npm install
    ```

### Environment Variables
1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:
    ```bash
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/taskmanager
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

## Setting up MongoDB Locally

### Install MongoDB
1. Download the MongoDB Community Server from the [official website](https://www.mongodb.com/try/download/community).
2. Follow the installation instructions for your operating system.

### Start MongoDB
1. Open a terminal and run the following command to start the MongoDB server:
    ```bash
    mongod
    ```
2. MongoDB should now be running on `mongodb://localhost:27017`.

### Create Database
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

