# Brawl Stars Team Optimizer
[Project Repository](
https://github.com/cs0320-f23/term-project-acueva-asing220-mgyee-sgoel17-jnaik2)

### Developers
Alex Cueva ([@kerumeto](https://github.com/kerumeto))

Aryan Singh ([@singh-aryan-1977](https://github.com/singh-aryan-1977))

Matthias Yee ([@mgyee](https://github.com/mgyee))

Spandan Goel ([@Spandan14](https://github.com/Spandan14))

Jaideep Naik ([@jnaik2](https://github.com/jnaik2))

---

## Project Overview

Our Brawl Stars Optimizer is a web application that players can use in order to find optimal team compositions for the mobile game Brawl Stars. The project is built with a backend (Python/Flask) server and a frontend (TypeScript/React/Next.js) website.

## Website Functionality

A user first selects preferred brawlers that they or their teammates would like to play, or they can input player tags to customize the preferred brawlers to only the ones that are owned. Next, users can either optimize over all modes and maps, or specifiy and mode and then a map. Finally, clicking the find best brawlers button will output a list of teams with scores that indicate how strong the team is.

### `3v3-optimizer`

The file `page.tsx` in this directory contains the main logic for the optimizer page. It uses components from the `components/` directory such as `BrawlerCard.tsx` and `ReactTable.tsx` in order to visualize those pieces of the websites. This file is also where calls to the backend server are made to get things such as brawler names and ids as well as images.

### `firebase`
We use Firebase to store user data and Firebase Authentication to authenticate users/manage our sign-up and login system. 
Users are able to log into our application and store the teams that they have generated so they can look at them in the future,
and we store this information for them in Cloud Firestore, powered by Firebase. 

## Server Functionality

The server on the backend is built with Flask and exposes a variety of endpoints for getting brawler data and brawler ratings.
It also runs a chronological job every 4 hours in order to get data from players and update the internal ratings for the brawlers, which are
stored in a locally hosted PostgreSQL database.

### PostgresSQL Ratings Database
The ratings database stores three tables which represent brawler ratings globally (across all maps and modes), brawler ratings on given modes,
and brawler ratings on given maps. The ratings are stored and processed according to the TrueSkill algorithm, which is a Bayesian inference system for 
rating players in team-based games.

### TrueSkill
The [TrueSkill](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/) rating system takes into account brawlers, other brawlers on the same team, and match results.
It uses this to generate a normal distribution representing the brawler's skill (rating in our case). We use an algorithm to calculate the exposure of a given brawler's distribution compared to all the other brawlers in order to get a 
deterministic ranking and score for each brawler, which is displayed on the frontend. This score also allows us to judge how good a particular team is compared to another.

### Rating Updates
We calculate rating updates through a chronological job that runs every 4 hours. 
This job gets the latest matches of pro players from the Brawl Stars API and updates the ratings of the brawlers in the database accordingly.
We use the TrueSkill algorithm to calculate the rating updates for each brawler. We also have a complex "battle-hashing" system that allows us to prevent 
overcounting battles, by storing a unique hash for each battle on the local server's disk and querying it in an efficient manner, allowing us to prevent against hash/battle collisions in an efficient manner.
## Testing

### Playwright

Playwright was used to test multiple facets of the application across various states, including robust testing of brawler data views, and other stateful interactions. The application was tested to work on Chromium, Firefox, and Webkit-based browsers. Tests can be found in `frontend/brawlstars-team-optimizer-tests`. Use `npx playwright test` to run tests (run `npx playwright install` to install Playwright).

### unittest (Python)

All internal backend components are heavily tested, including the TrueSkill algorithm, the battle hashing system, and the database. These tests can be found in `backend/server/*_tests.py`. Use `python3 -m unittest discover` to run tests.

## Getting Started

You can get started by cloning this repository and running `npm install` to install the dependencies. Run the applicatiaon with `npm run dev`, which should start the application at `localhost:3000`.

The server can be run with `python3 api.py` when the local PostgreSQL database is running. The server can be reached at `localhost:8000`.
