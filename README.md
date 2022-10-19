# Terramagotchi
Terramagotchi is a web app which aims to educate people about the nature cycles and the processes which underlie them. 
This includes a simulation of nutrient and water transfer between soil, plants and organisms, as well as water evaporation and weather.
It is separated into 3 parts: The main application where the environment is simulated, the remote which sends signals to the main application to spawn in particles by anyone, and the Firebase database which acts as the conduit to allow communication between the main application and any connected remotes.

## Project Management Tool.

https://imateapot.atlassian.net/jira/software/projects/TPT/boards/2/roadmap?shared=&atlOrigin=eyJpIjoiZjY3OGU1NWM5OGM5NDJkZWJhNzcwYjM0MjFmNGQ0NWIiLCJwIjoiaiJ9

## Technologies

### Languages

- Node
- JavaScript
- CSS
- HTML

### Libraries

| Name                | version | description | terramagotchi | terramagotchi development | remote | remote development | firebase | firebase development |
|---------------------|---------|-------------|---------------|---------------------------|--------|--------------------|----------|----------------------|
| p5                  | 1.4.2   |             | &#x2611;      |                           |        |                    |          |                      |
| simplex-noise       | 4.0.0   |             | &#x2611;      |                           |        |                    |          |                      |
| html-webpack-plugin | 5.5.0   |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack             | 5.74.0  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack-cli         | 4.10.0  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |
| webpack-dev-server  | 4.10.1  |             |               | &#x2611;                  |        | &#x2611;           |          |                      |

## Usage - Instructions on How to Install and Setup the Project.

All dependencies have been listed above. See [Libraries](###Libraries)

Prior to using these applications, you must have Node installed on your machine.

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

### Terramagotchi-Firebase (Backend Database)

```
cd terramagotchi-firebase
npm install
firebase deploy --only functions
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

## Future Plan (Ideas for Future releases)

- Temperature and Oxygen levels.
- Larger diversity of plants and organisms.

## Acknowledgements (if any) - You Can List Tutorials Used, Projects Referred To, People Consulted Etc.

- CodingTrain