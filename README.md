# Reference guide: geo web-application using node, postgis, leaflet and d3.

## Getting started
####Intro
So you are interested in creating a web-application for viewing and working with maps. Awesome! In this complete-beginners guide we will be setting up a basic web-application. This tutorial is aimed to be as low-level as possible. Still, I would recommend at least a basic understanding about JavaScript, HTML/CSS and SQL queries.

- We will be using [NodeJS]() and [ExpressJS]() to create a simple web server.
- This server will be setup to access (spatial) data stored on (local) [PostgreSQL]() server, using the [PostGIS]() extension for spatial analysis. 
- To fetch the tiles and display the map we will be using [LeafletJS]().
- To visualize the data we will be using [D3JS](https://d3js.org/)

#### Run Linux
This tutorial is aimed at people running Linux. I might add a version for Mac OS and Windows later, but for now I would recommend installing Linux on a virtual machine. As I am personally quite used to windows, I prefer running Linux from a virtual machine. How to install: text text text text.

## Webdevelopment with node and express

#### Setup & Structure

To start developing application with node and express, we will need to install a couple of packages: [node.js](), [npm](), [express.js](). The package [npm]() is used to install and manage packages for [node.js](). [Express](), for example, is a package which will be used by node, therefore we will need npm to install it.  

To install nodejs and npm, simply open up the terminal and run execute the following commands:
```sh
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```
Now we are ready to install express. While you will want to install most packages locally, in the project folder you are working on, you will probably be using express a lot. Therefore it is recommended to install express globally, so it will be accessible everywhere. You can do this by providing the -g flag: 

```sh
$ sudo -g npm install express
$ sudo -g npm install express-generator
```
Notice we also installed the express-generator. [Here, why we installed the express-generator]/
Next, [navigate](http://linuxcommand.org/lts0020.php) the terminal to the folder where you'd like to store your app. Here you will want to generate a basic application with the express-generator. Do so by executing:
```sh
$ express appname
``` 
If this doesn't work, try install the nodejs-legacy package:
```sh
$ sudo apt-get install nodejs-legacy
``` 
Alright, this might be a good moment to take a look at the structure the express generator created. If we were to browser our project folder, we'd find the following structure:
```sh
.
├── app.js              application script
├── bin                 startup scripts
│   └── www
├── package.json        project info, dependencies 
├── public              front end files, media, styling etc.
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes              routing 
│   ├── index.js
│   └── users.js
└── views               templates to build our pages
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

The package.json file manages the different packages (extensions). To add more extensions, we could open the package.json file using a text editor and manually add the different dependencies. I would rather recommend installing them like we did with express. For example, if we would like to add the body-parser and pg packages which we will need later on, execute (from our project folder):

```sh
$ npm install body-parser --save
$ npm install pg --save
``` 
Notice how these commands are a little different from when we installed express. This time, we didn't use the -g flag, but added --save. The --save flag will download and save the package, as well as update the package.json file. The -g flag we used earlier installs a package globally.

While viewing the package.json file, you will now see the postgeo and pg extensions added. They are also installed in the node_modules folder. If you were to download someone else's project, you will most likely not download the project's modules as you could get them from somewhere else. Because the package.json file provided a list of these dependencies, they are easy to install. To read the package.json file, and install all dependencies, run the following command from the project folder:
```sh
$ npm install
``` 
You will also have to do this the first time after you used the express-generator to generate a new application.

#### Viewing 

Alright. So far for setting up the application. You can now start your application by executing:
```sh
$ npm start
``` 
Although it seems like nothing is happening, you can use your browser to open localhost:3000. You will see the express server up and running. Also, while opening the application, you might have noticed how the application prints the requests from your browser to the terminal. This is useful as you will want to see which requests will be sent to the server.  If you wish to quit the application, press ctrl+c on the command line. 

### Routing

You might wonder how your browser knows which website to render. Well, you could compare the index.js file to a switchboard. If you run the server and browse to your website, you basically request the application to give you a web page. There is logic in the index.js file to handle these requests. Now, try to browse to another page on your website, say, localhost:3000/map. This time, it will return an error: 404 ("not found"). We'll have to write some logic to handle the request 'map'. How would we do this?

```js
/* GET map page. */
router.get('/map', function(req, res) {
  res.send('Open our map page!');
});
```

The above function will be called once we browse to localhost:3000/map and will send 'Open our map page!' in plain text to the browser. By writing code like this, we can add switches to our switchboard, providing the logic needed to navigate our website. We could replace the text with HTML code to render new webpages to the user. But, there is an easier way to do this: templating.

#### Templating

Usually a website consists of many different pages. Almost all of these pages show the same header, navigation, footer, etc. Although possible, it might occur that it would be a waste of time to copy-paste these reusable elements for every page. This is where templating engines come into play. There are many templating engines and as Express uses 'jade' as default, we will do so as well. 

In the app/views folder, we find three files: error.jade, index.jade and layout.jade. As you could guess, layout.jade is where we will find the basic layout. Error and index.jade are custom pages which will be rendered 'inside' the layout page. 

In our previous example we 'told the router' [Xyz] to send text to our webpage. This is a little different from rendering a new page. Create a new file called map.jade with the following content:

```sh
extends layout

block content
  h1= title
  p Welcome to #{title}
```
The first line, extends layout, tells our templating engine to look for a file called 'layout'. In this file, there should be a line called 'block content'. This block should be replaced by the provided code, in our case a header and a paragraph line. Also, the 

Now, in our _routes/index.js file, edit our router function to look like this:
```js
/* GET map page. */
router.get('/map', function(req, res) {
  res.render('map', { title: 'Map page'});
});
```

Now we can start our server using npm start, and browse to localhost:3000/map. This time we will see our input rendered on our map page. So, what exactly happened?

[Xyz image on rendering]

Let's write another route:





## PostgreSQL database with PostGIS extension

#### Install
To store and order our data, we will need to install a database. We will be using the open-source PostgreSQL database with a PostGIS extension. PostGIS is a library for spatial analysis.

Open the terminal and install PostgreSQL and PostGIS via:

```sh 
$ sudo apt-get install postgresql-client-9.3
$ sudo apt-get install postgresql-9.3-postgis-2.1
```
Now, to setup the database I would recommend following [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04) tutorial made by DigitalOcean. Something I personally found quite hard to grasp, is the concept of users/roles. So in short: who has access to which database etc. [This](https://www.digitalocean.com/community/tutorials/how-to-use-roles-and-manage-grant-permissions-in-postgresql-on-a-vps--2) article, again by DigitalOcean, makes it easier to understand.  The following is a short recap of their tutorials.

#### Setup
PostgreSQL creates a default user account called 'postgres'. This user has access to our database. To login to the postgres user, run:

```sh
$ sudo -i -u postgres
```
Now, to access the database from the postgres user we will run psql:
```sh
$ psql
```
To add spatial analysis tools, we will need to add the PostGIS extension. While logged into psql from the postgres user, create the postgis extension(s).
```sh
# CREATE EXTENSION postgis
# CREATE EXTENSION postgis-topology
```
Now we created a database with a PostGIS extension. I would recommend saving the database info as we will need it in the future. To view the database info, type:
```sh
# \conninfo
``` 

To exit the database and exit the postgres user:
```sh
# \q        // exit the database
$ exit      // exit the postgres user
```
#### SQL 
Now we have our database setup and the PostGIS extension installed, it's time to create a table and store some data. F

#### Loading various data with GDAL/OGR
Manually adding our data to the database can be quite a problem. Loading a file directly into the database is possible as well, using the 'geospatial data abstraction library': gdal. 

To install the open source GDAL/OGR package. If you happen to have qGIS installed, you probably have the GDAL/OGR library as well. If not, install GDAL:
```sh
$ sudo apt-get install gdal-bin
```
Next, navigate to the folder in which you have your data stored, and execute the following command:

```sh
$ ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=postgres dbname=postgres password=5432" data.csv  
```
Make sure you edit the PG string to match your own database. Also, change the data.csv to the file you want to load. In this example we will be using two datasets: bees.csv and buurten_region.shp (ESRI ShapeFile). Load both datasets into your database.

You could check if the data was loaded into your database by logging into the database (sudo -i -u postgres), starting the psql program and typing \d. If the import was succesfull, you will see the layers added to the database.

Make sure the import was successful by logging into the database and listing the tables.  

## Node & PostgreSQL
So far we have generated a simple webserver using Node+Express. Also, we have our database installed and are able to get and store data using SQL queries. Now, to connect to our database, we will need two different modules: 'pg' to connect our application to the database, 'body-parser' to [Xyz].

```sh
$ npm install pg --save
$ npm install body-parser --save
``` 
To provide our app with information on how to access the database, we will have to write a little bit of code. Open the routes/index.js and edit it to look like this:

```js
var express = require('express');
var router = express.Router();

// Add these lines!
var pg = require("pg");
var conString = "postgres://username:password@ip:port/dbname";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
``` 
Most important is the conString variable in which you should specify your databases' variables. For example, if your username is called 'postgres', the password is '654321', you are running the database locally on port 5432, and the databasename is postgres, change the line to:
```js
var conString = "postgres://postgres:654321@localhost:5432/postgres";
```
#### Routing
Now, we have our connection parameters set, we want to be able to request our server for 

```js
var express = require('express');
var router = express.Router();

// Add these lines!
var pg = require("pg");
var conString = "postgres://username:password@ip:port/dbname";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
``` 

##Web-app with Leaflet and D3







