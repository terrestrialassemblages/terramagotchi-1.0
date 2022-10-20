# Terramagotchi
Terramagotchi is a web app which aims to educate people about the nature cycles and the processes which underlie them. 
This includes a simulation of nutrient and water transfer between soil, plants and organisms, as well as water evaporation and weather.
It is separated into 3 parts: The main application where the environment is simulated, the remote which sends signals to the main application to spawn in particles by anyone, and the Firebase database which acts as the conduit to allow communication between the main application and any connected remotes.

## Project Management Tool

https://imateapot.atlassian.net/jira/software/projects/TPT/boards/2/roadmap?shared=&atlOrigin=eyJpIjoiZjY3OGU1NWM5OGM5NDJkZWJhNzcwYjM0MjFmNGQ0NWIiLCJwIjoiaiJ9

## Technologies

### Languages

[![node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) 
[![javascript](https://img.shields.io/badge/JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en/JavaScript) 
[![css](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en/CSS) [![postcss](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)
[![html](https://img.shields.io/badge/HTML-e34c26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en/HTML)

### Libraries

| Name                | version | description | terramagotchi | terramagotchi development | remote | remote development | firebase | firebase development |
|---------------------|---------|-------------|---------------|---------------------------|--------|--------------------|----------|----------------------|
| p5                  | 1.4.2   |             | &#x2611;      |                           |        |                    |          |                      |
| simplex-noise       | 4.0.0   |             | &#x2611;      |                           |        |                    |          |                      |
| html-webpack-plugin | 5.5.0   |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack             | 5.74.0  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack-cli         | 4.10.0  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack-dev-server  | 4.10.1  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| crypto-random-string| 5.0.0   |             | &#x2611;      |                           |        |                    |          |                      |
| firebase            | 9.12.1  |             | &#x2611;      |                           |&#x2611;|                    |&#x2611;  |                      |
| qrcode              | 1.5.1   |             | &#x2611;      |                           |        |                    |          |                      |
| css-loader          | 6.7.1   |             |               |                           |        | &#x2611;           |          |                      |
| postcss             | 8.4.17  |             |               |                           |        | &#x2611;           |          |                      |
| postcss-loader      | 7.0.1   |             |               |                           |        | &#x2611;           |          |                      |
| postcss-preset-env  | 7.8.2   |             |               |                           |        | &#x2611;           |          |                      |
| style-loader        | 3.3.1   |             |               |                           |        | &#x2611;           |          |                      |
| tailwindcss         | 3.1.8   |             |               |                           |        | &#x2611;           |          |                      |
| tw-elements         | 1.0.0-alpha12  |      |               |                           |&#x2611;|                    |          |                      |
| firebase-admin      | 10.0.2  |             |               |                           |        |                    |&#x2611;  |                      |
| firebase-functions  | 3.18.0  |             |               |                           |        |                    |&#x2611;  |                      |
| firebase-functions-test | 0.2.0  |          |               |                           |        |                    |          |&#x2611;              |


## Usage - Instructions on How to Install and Setup the Project.

All dependencies have been listed above. See [Libraries](#libraries)

Prior to using these applications, you must have Node.js (with npm) installed on your machine.

As there are three sub-packages, each one must be installed/used separately.

### Terramagotchi (Main Application)

Navigate to `./terramagotchi/` From here run the following commands:

#### Install

```
npm install
```

#### Development Server

```
npm run dev
```

You can now access the application by navigating to `http://localhost:9000/` in your browser.

#### Build

```
npm run build
```

This will build the application. It can then be accessed in the `dist` folder. To run the application, open the `index.html` file (found in said `dist` folder) in your browser.

### Terramagotchi-Firebase (Cloud functions)
To deploy this code, a new Firebase project must be created prior to deployment. This can be done by following [Firebase Docs](https://firebase.google.com/docs/web/setup).

Firebase tools is required to be installed globally using npm before deploying to the Firebase project.
```
npm install -g firebase-tools
firebase login
```
Once logged in to an authorised Google account, you can install dependencies and deploy to the Firebase.
```
cd terramagotchi-firebase/functions
npm install
cd ..
npm install
firebase deploy
```

### Terramagotchi-Remote (User Remote)

Navigate to `./terramagotchi-remote/` From here run the following commands:

#### Install

```
npm install
```

#### Development Server

```
npm run dev
```

You can now access the application by navigating to `http://localhost:9001/` in your browser.

#### Build

```
npm run build
```

This will build the application. It can then be accessed in the `dist` folder. To run the application, open the `index.html` file (found in said `dist` folder) in your browser.

## Usage Examples (if available).

This project is an application which is made to be shown in an art gallery setting.

## URL of the Website Where the Project Has Been Deployed

https://terramagotchi.web.app  
https://terramagotchi.web.app/remote

## Future Plan (Ideas for Future releases)

- Temperature and oxygen levels which affect the water and nutrient cycles. A high temperature would result in more transpiration. Oxygen levels would imply an additional carbon cycle system.
- Larger diversity of plants and organisms. Currently we have 3 plants, (lavendar, dandelion and kauri tree,) and one organism, (a worm).

## Acknowledgements (if any) - You Can List Tutorials Used, Projects Referred To, People Consulted Etc.

- [The Coding Train on YouTube](https://www.youtube.com/c/TheCodingTrain)