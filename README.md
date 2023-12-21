# term-project-acueva-asing220-mgyee-sgoel17-jnaik2

Welcome to [Our term project](https://github.com/cs0320-f23/maps-kganesh-sgoel17/tree). Authored by @kylashg1 & @Spandan14. Estimated time of completion: 17 hours.
https://github.com/cs0320-f23/maps-kganesh-sgoel17

---

## Project Overview

Maps is a React application that allows users to access [GeoJSON](https://geojson.org/) data via a map and a command line-like interface. It allows for a variety of commands to be entered. It runs on a Spark Server that exposes seven GET endpoints:

- two for GeoJSON viewing - `loadJson`, `viewJson`,
- three for GeoJSON searching - `searchByDescription`, `searchAtPoint`, `searchByBoundingBox`
- and two as API middleware, `broadbandAtPoint`, `stateCountyAtPoint`.

## Website Functionality

When a user clicks a point of the map, data regarding the region where they clicked is shown, and broadband data is fetched using `broadbandAtPoint` from the server. While the server does expose a `searchAtPoint` endpoint, the calculation to determine which region the click was made in, is done entirely on the client-side.

`loadJson`, `viewJson`, and `searchByDescription` are available via the command line in the application, and can be accessed with the following commands.

### `load <filename>`

`load` allows users to load a GeoJSON from the backend into memory and perform operations on it. Once a file is loaded, nothing immediately happens, but `view` is avilable. `load` will fail if an invalid file name is provided.

### `view`

`view` allows users to see all the data in the currently loaded GeoJSON by resetting the base layer and updating it with the features in the file currently loaded. The filtered features layer will be reset. `view` will fail if no GeoJSON file is loaded.

### `search <query>`

`search` allows users to search for features with `<query>` in their description. The output of this will be shown in a blue hue, and will overlay every region on the map that satisfies the constraint.

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

Playwright was used to test multiple facets of the application across various states, including robust testing of back-to-back CSV file loads and views, and other stateful interactions. The application was tested to work on Chromium, Firefox, and Webkit-based browsers. Tests can be found in `frontend/tests`. Use `npx playwright test` to run tests (run `npx playwright install` to install Playwright).

### JUnit

Every backend endpoint is heavily unit tested. Both API middleware endpoints are mocked and have robust integration tests. The GeoJSON search endpoints are fuzz tested to test against small precision errors and variability.

Run `mvn site` from `/backend` to run the server test suite.

## Reflection

### Whose Labor?

We rely on a lot of other people's work when we run any of the code in this repository. Here are some of the packages we used in this project (not an exhaustive list)

- Spark
- Gson
- Moshi
- JUnit
- Playwright
- React

and more. On top of this, we use other technologies such as

- TypeScript
- Java
- IntelliJ
- VSCode
- WebStorm
- the entire network stack (TCP/IP/HTTP)

## Getting Started

You can get started by cloning this repository and running `npm install` to install the dependencies. Run the applicatiaon with `npm start`, which should start the application at `localhost:8000`.

You can run the server from `/backend`, and call `mvn package` to build.
