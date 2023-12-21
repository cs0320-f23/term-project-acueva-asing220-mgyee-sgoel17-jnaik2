# term-project-acueva-asing220-mgyee-sgoel17-jnaik2

https://github.com/cs0320-f23/term-project-acueva-asing220-mgyee-sgoel17-jnaik2

Alex Cueva
Aryan Singh
Matthias Yee
Spandan Goel
Jaideep Naik

---

## Project Overview

Our Brawl Stars Optimizer is a web application that players can use in order to find optimal team compositions for the mobile game Brawl Stars. The project is built with a backend (python) server and a frontend (TypeScript/React/Next.js) website.

## Website Functionality

A user first selects preferred brawlers that they or their teammates would like to play, or they can input player tags to customize the preferred brawlers to only the ones that are owned. Next, users can either optimize over all modes and maps, or specifiy and mode and then a map. Finally, clicking the find best brawlers button will output a list of teams with scores that indicate how strong the team is.

### `3v3-optimizer`

The file `page.tsx` in this directory contains the main logic for the optimizer page. It uses components from the `components/` directory such as `BrawlerCard.tsx` and `ReactTable.tsx` in order to visualize those pieces of the websites. This file is also where calls to the backend server are made to get things such as brawler names and ids as well as images.

### `firebase`

## Server Functionality

### GeoJSON

The server allows for all the commands on the frontend to be accessed as GET endpoints. In addition, it allows for users to search in two new ways.

- `searchAtPoint` - when provided with a `latitude` and `longitude`, this endpoint returns all features that contain the given coordinate.
  - This is implemented using the [point-in-polygon ray casting algorithm](https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm). The implementation follows GeoJSON specfication and accounts for multiple regions in `MultiPolygons` and holes in `Polygons`.
- `searchByBoundingBox` - when provided with a `min_latitude`, a `max_latitude`, a `min_longitude`, and a `max_longitude`, this endpoint returns all features completely encompassed within the coordinate bounding box defined by the four numbers.
  - This is internally implemented by checking against a pre-computed axis-aligned bounding-box for each region, in order to speed up computation.

All GeoJSON data returned by the server adheres to GeoJSON specification, as defined by [RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.6).

### Middleware

The server, in addition to `broadbandAtPoint`, also exposes `stateCountyAtPoint`. The former endpoint internally uses the latter endpoint's logic, as both endpoints take in a `latitude` and `longitude`.

The `broadbandAtPoint` endpoint utilizes the [US Census ACS API](https://www.census.gov/data/developers.html) in order to make its queries. The `stateCountyAtPoint` endpoint uses the [FCC API](https://geo.fcc.gov/api/census/#!/area/get_area) to determine the state and county at a given coordinate.

## Bugs

No current known bugs exist. Please file an issue or open a pull request if you find any.

## Testing

### Playwright

Playwright was used to test multiple facets of the application across various states, including robust testing of back-to-back CSV file loads and views, and other stateful interactions. The application was tested to work on Chromium, Firefox, and Webkit-based browsers. Tests can be found in `frontend/brawlstars-team-optimizer-tests`. Use `npx playwright test` to run tests (run `npx playwright install` to install Playwright).

### JUnit

Every backend endpoint is heavily unit tested. Both API middleware endpoints are mocked and have robust integration tests. The GeoJSON search endpoints are fuzz tested to test against small precision errors and variability.

Run `mvn site` from `/backend` to run the server test suite.

## Getting Started

You can get started by cloning this repository and running `npm install` to install the dependencies. Run the applicatiaon with `npm run dev`, which should start the application at `localhost:3000`.

The server can be run with `python3 api.py` when the local postgres database is running. The server can be reached at `localhost:8000`.
