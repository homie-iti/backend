# Homie - NodeJS Backend

Node.js backend for [HOMIE](https://homie-iti.vercel.app/): an online rental accommodation platform for young professionals and international students who came to Egypt looking for apartment. We allow users to rent a unit as agents and they are also allowed to rent their units as landlords. A unit can be a whole apartment or just a room and you can filter the units to match what you want in a very specific way.  
**This repository is a part of our ITI graduation project. We are interns in the MEARN track and our project is built using Angular, MongoDB, Express and NodeJS. You can find all project repos [here](https://github.com/homie-iti).**

## Prerequisites

-   node v12 or higher.
-   npm v6 or higher.
-   MongoDB v6 or higher.

## Instructions

### Cloning and installing dependencies

Clone the project

```bash
  git clone https://github.com/homie-iti/backend
```

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

### Preparing Environment

To run this project, you will need to follow two steps:

1.  create an empty folder in your root and name it `db`, it will contain all your database files while working locally.
2.  create .env file in your root and use the .env.example file as a reference for you environment variables, add their values as follows:  
    `PORT`: add your preferred app port  
    `DB_HOST`: add your local db host (default 8080)  
    `DB_PORT`: add your local db port (default 'localhost')  
    `DB_NAME`: add your local db name (default 'HomieDB')  
    `TEST_DB_NAME`: add your local test db name (default 'TEST_DB_NAME="HomieTestDB"
    ')  
    `JWT_SECRET`: add secret key to be used while creating jwt tokens  
    `SALT_ROUNDS`: add number of salt rounds to be used while creating bcrypt hashes (default 10)  
    `PEXELS_KEY`: create an accoount on [pexels.com](https://www.pexels.com) and add you api key  
    `UNSPLASH_KEY`: create an accoount on [pexels.com](https://unsplash.com) and add you access key  
    `ATLAS_DB_HOST`: add your cloud db host  
    `ATLAS_DB_USER`: add your cloud db access username  
    `ATLAS_DB_PASSWORD`: add your cloud db access password  
    `ORG_EMAIL`: add your organization email  
    `ORG_EMAIL_PASSWORD`: add your organization email password

## App Scripts

1. running the app in the prod mode

```bash
  npm start
```

2. running the app in the dev mode

```bash
  npm run start:dev
```

3. running the local app db

```bash
  npm run start:db
```

4. running the local app db

```bash
  npm run start:db
```

5. adding data to the local db for testing purposes

```bash
  npm run seed-db:local
```

6. adding data to the cloud db for testing purposes

```bash
  npm run seed-db:atlas
```

7. testing the app using the local test db

```bash
  npm run test:local
```

8. testing the app using the cloud test db

```bash
  npm run test:atlas
```

9. formatting the code using prettier

```bash
  npm run format
```

10. fixing linting issues using eslint

```bash
  npm run lint:fix
```

11. removing old build files (choose `cmd` or `shell` based on the machine)

```bash
  npm run clean:cmd
  npm run clean:bash
```

12. creating new build of the app (choose `cmd` or `shell` based on the machine)

```bash
  npm run build:cmd
  npm run build:bash
```

## API Schema

We used [Swagger](https://swagger.io/) to show the full behavior of our api so you can find the full API endpoints in the docs [https://homie-iti.herokuapp.com/homie-docs](https://homie-iti.herokuapp.com/homie-docs).

#### Get all elements in a resource

```http
  GET https://homie-iti.herokuapp.com/${resource-name}
```

| Parameter       | Type     | Description                                                                    |
| :-------------- | :------- | :----------------------------------------------------------------------------- |
| `resource-name` | `string` | **Required**. Resource you want to consume (units, cities, users, reviews...). |

#### Get one item in the resource using its ID

```http
  GET https://homie-iti.herokuapp.com/${resource-name}/${id}
```

| Parameter       | Type     | Description                                                                    |
| :-------------- | :------- | :----------------------------------------------------------------------------- |
| `resource-name` | `string` | **Required**. Resource you want to consume (units, cities, users, reviews...). |
| `id`            | `string` | **Required**. Id of item to fetch                                              |

#### Add new element to the resource

```http
  POST https://homie-iti.herokuapp.com/${resource-name}
```

| Parameter       | Type     | Description                                                                    |
| :-------------- | :------- | :----------------------------------------------------------------------------- |
| `resource-name` | `string` | **Required**. Resource you want to consume (units, cities, users, reviews...). |

#### Update one item in the resource using its ID

```http
  GET https://homie-iti.herokuapp.com/${resource-name}/${id}
```

| Parameter       | Type     | Description                                                                    |
| :-------------- | :------- | :----------------------------------------------------------------------------- |
| `resource-name` | `string` | **Required**. Resource you want to consume (units, cities, users, reviews...). |
| `id`            | `string` | **Required**. Id of item to fetch                                              |

#### Delete one item in the resource using its ID

```http
  DELETE https://homie-iti.herokuapp.com/${resource-name}/${id}
```

| Parameter       | Type     | Description                                                                    |
| :-------------- | :------- | :----------------------------------------------------------------------------- |
| `resource-name` | `string` | **Required**. Resource you want to consume (units, cities, users, reviews...). |
| `id`            | `string` | **Required**. Id of item to fetch                                              |

## Pipeline

CircleCI pipeline is triggered when a new commit is pushed to "main" branch

The pipeline has 3 jobs to build, test and deploy the app.

1.  `build` job starts by installing Node then it cleans the older build files and create a new build

-   `circleci/node@5.0.0`
-   `npm run clean:bash`
-   `npm run build:bash`

2.  `test` job starts by installing Node and the needed dependencies then it runs the written tests

-   `circleci/node@5.0.0`
-   `npm i`
-   `npm run test:atlas`

3.  And Finally the `deploy` job deploys the app by uploading files to our heroku branch using the `HEROKU_APP_NAME` and `HEROKU_API_KEY` specified in circleci environment variables.

-   `circleci/heroku@1.2.6`
-   `git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git`

## Authors

-   Radwa Ahmed [https://github.com/Radkillua](https://github.com/Radkillua)
-   Mariam Ragab [https://github.com/MaryamRagab](https://github.com/MaryamRagab)
-   Mostafa hussien [https://github.com/EngMostafaHussien](https://github.com/EngMostafaHussien)
-   Safia Elnakhal [https://github.com/safia-elnakhal](https://github.com/safia-elnakhal)
-   Mahmoud Samy [https://github.com/ibnsamy96](https://github.com/ibnsamy96)
