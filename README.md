

###### Part 0:
- Introduction spatial, why postgresql, leaflet, node
- Linux install

###### Part 1:
- Installing PostgreSQL/postgis database
- Setting up a database
- Create database
- Load data manually
- Load data from file (csv, shp)
- How to write queries
- Learn more..

###### Part 2:
- Installing nodejs, expressjs
- Structure
- Using Jade template engine
- Adding routes

##### Part 3:
- Basic leaflet page

##### Part 4:
- Get/post from database request with PG
- Request as JSON, GeoJSON, TopoJSON

##### Part 5:
- Loading the data with D3

# Reference guide: geo webapplication using node, postgis and leaflet.

## Getting started
###Intro
So you are interested in creating a webapplication for viewing and working with maps. Awesome! In this complete-beginners guide we will be setting up a basic webapplication. This tutorial is aimed to be as low-level as possible. Still, I would recommend at least a basic understanding about Javascript, HTML/CSS and SQL queries.

- We will be using [NodeJS]() and [ExpressJS]() to create a simple webserver.
- This server will be setup to access (spatial) data stored on (local) [PostgreSQL]() server, using the [PostGIS]() extension for spatial analysis. 
- To fetch the tiles and display the map we will be using [LeafletJS]().
- To visualize the data we will be using D3

### Run Linux
This tutorial is aimed at people running linux. I might add a version for MacOS and Windows later, but for now I would recommend installing linux on a virtual machine. As I am personally quite used to windows, I prefer running linux from a virtual machine. How to install: text text text text.

## Webdevelopment with node and express

### Installation

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
Alright, this might be a good moment to take a look at the structure the express generator created
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
└── views               templates to build your pages
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

Although we already know what these two files are for, a small recap:

    app.js – application nerve center
    package.json – handles dependencies

If you browse to the folder which express generated, you will find a file called package.json. This file manages the different packages (extensions) used by the app you created - like express. To add more extensions, you could open the file using notepad and manually add them by typing. I would rather recommend installing them like we did with express. For example, if we would like to the postgeo and pg packages, execute:

```sh
$ npm install postgeo --save 
$ npm install pg --save
``` 
Notice how these commands are a little different from when we install express. This time, we didn't use the -g flag, but added --save. The --save flag will download and save the package, as well as update the package.json file. The -g flag we used earlier installs a package globally.

While viewing the package.json file, you will now see the postgeo and pg extensions added. They are also installed in the node_modules folder. The other packages which express relies on, are not. To read the package.json file, and install all dependencies, run the following command from the project folder:
```sh
$ npm install
``` 
Alright. So far for setting up the application. You can now view your appliation by executing:
```sh
$ npm start
``` 
Although it seems like nothing is happening, you can now use your browser to localhost:3000. You will see the express server up and running. Also, while opening the application, you might have noticed how the application prints the requests from your browser to the terminal. If you wish to quit, press ctrl+c on the command line. 

### Getting started part 2: PostgreSQL / PostGIS

To connect our webapplication to our PostgreSQL database, we will need to install the database. To do so:

```sh 
$ sudo apt-get install postgresql-client-9.3
$ sudo apt-get install postgresql-9.3-postgis-2.1
```
Now, to setup the database I would recommend following [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04) tutorial made by DigitalOcean. Something I personally found quite hard to grasp, is the concept of users/roles. So in short: who has access to which database etc. [This](https://www.digitalocean.com/community/tutorials/how-to-use-roles-and-manage-grant-permissions-in-postgresql-on-a-vps--2) article, again by DigitalOcean, makes it easier to understand.  

This following is a short recap of their tutorials.

Use your terminal to access the default postgres useraccount:
```sh
$ sudo -i -u postgres
```
Access the database from the postgres user
```sh
$ psql
```
From the database, create the postgis extension(s).
```sh
# CREATE EXTENSION postgis
# CREATE EXTENSION postgis-topology
```
Great! You created a database with postgis extension. I would recommend writing down the database info as we will need it in our next step. To view the database info, type:

```sh
# \conninfo
``` 

Next, you could manually create a new table and insert the different records into it. As most data we have is already downloaded and somewhere on our machine, loading them directly from file sounds like a better plan. How to do this? First, exit the database, next exit the postgres user. 

Exit the database, exit the postgres user:
```sh
# \q
$ exit
```
Install the open source GDAL/OGR package. If you happen to have qGIS installed, you probably have the GDAL/OGR library as well. If not, install GDAL ( using:
```sh
$ sudo apt-get install gdal-bin
```
Next, navigate to the folder in which you have your data stored, and execute the following command:

```sh
$ ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=postgres dbname=postgres password=5432" data.csv  
```
Make sure you edit the PG string to match your own database. Also, change the data.csv to the file you want to load. In this example we will be using two datasets: bees.csv and buurten_region.shp (ESRI ShapeFile). Load both datasets into your database.

You could check if the data was loaded into your database by logging into the database (sudo -i -u postgres), starting the psql program and typing \d. If the import was succesfull, you will see the layers added to the database.

Now we have our application running and our database filled, we will want to connect our server to the application.

### Connect 
To connect our database to our application, we will have to write a little bit of code. Open the routes/index.js and edit it to look like this:

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
The most important part is the conString variable in which you should specify your databases' variables. For example, if your username is called 'postgres', the password is '654321', you are running the database locally on port 5432, and the databasename is postgres, change the line to:
```js
var conString = "postgres://postgres:654321@localhost:5432/postgres";
```

### Handle HTTP requests

You might wonder what is actually happening once you browse to your website (localhost:3000). Well, you could compare the index.js file to a switchboard. If you run the server and browse to your website, you basically request the application to give you a webpage. There is logic in the index.js file to handle these requests. Now, try to browse to another page on your website, say, localhost:3000/map. This time, it will return an error: 404 (which means "not found"). We'll have to write some logic to handle the request 'map'. How would we do this?

```js
/* GET map page. */
router.get('/map', function(req, res) {
  res.render('map'); 
});
```

The above function will trigger once we browse to localhost:3000/map and will serve the 'map' file to the browser. By writing code like this, we can add switches to our switchboard, providing the logic needed to navigate our website. But: what if we do not want to request our server for a webpage, but rather for some data we stored in our postgresql database? This is also possible.

```js
/* */
router.post('/data', function(req, res) {
res.render();
});





