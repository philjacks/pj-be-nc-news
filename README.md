# Northcoders News API - PhilJacks Edition

**Visit the live version of this project**<br>
https://ncnews-philjacks-edition.herokuapp.com/api/

## Summary
A server side project providing a variety of endpoints for a news article application. Clients can retrieve users, articles and comments. Several query requests available to filter articles by topic, sort by date, title, order or votes. Functionality is also in place to update votes on articles & delete comments by id.

## Clone Project & Install Dependencies
**Prerequisite - NodeJS & PostgreSQL are required to run this project on your machine**
1. At the top of this repo click **code** & copy the link to your clipboard.
2. Open your terminal & git clone the link (this will create a copy of the repo on your local machine.)
3. Open up the project & load up the terminal in the root directory.
4. Run **npm install** to install all the required the dependencies.
5. Follow **Database Connection Instructions** below.
6. Once installed, run **npm run setup-dbs** in the terminal to create the .
7. Run **npm run seed** to populate the development database.
8. Run **npm start** to start the server on PORT 9090.
9. For the test suite (Jest) run **npm test**. 

## Database Connection Instructions
1. Create 2 new files in the route directory **.env.development** & **.env.test**
2. The names of the databases can be found in db/setup.sql
3. In **.env.development** write PGDATABASE=database_name
4. In **.env.test** write PGDATABASE=database_name_test

The Project is now ready to connect.

**Node version 16.0.0 & above required**<br>
**Postgres (psql) 12.9 & above required**







