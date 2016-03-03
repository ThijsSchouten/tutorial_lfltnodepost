### Beginners guide: geo-application using node, postgis and leaflet.

### Intro
So you are interested in creating a webapplication for viewing and working with maps. Awesome! In this complete-beginners guide we will be setting up a basic webapplication. This tutorial is aimed to be as low-level as possible. Still, I would recommend at least a basic understanding about Javascript, HTML/CSS and SQL queries.

- We will be using [NodeJS]() and [ExpressJS]() to create a simple webserver.
- This server will be setup to access (spatial) data stored on (local) [PostgreSQL]() server, using the [PostGIS]() extension for spatial analysis. 
- To fetch the tiles and display the map we will be using [LeafletJS]().

This tutorial is aimed at people running linux. I might add a version for MacOS and Windows later, but for now I would recommend installing linux on a virtual machine. This can be done quite easily: scroll down to see how. 

### Getting started part 1: node, npm, express
For this app we will need to install a couple of packages: [node.js](), [npm](), [express.js](), [postgreSQL](), [postGIS](). The package [npm]() is used to install and manage packages for [node.js](). [Express](), for example, is a package which will be used by node, therefore we will need npm to install it. The last two, postgreSQL and postGIS will be covered in the Getting started part 2. 

To install nodejs and npm, run the following commands from the terminal:

```sh
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

Now we are ready to install express. While you will want to install most packages locally (so they are only available for the app you are writing), you will probably be using express a lot. Therefore it is recommended to install express globally, so it will be accesible everywhere. 

```sh
$ sudo -g npm install express
$ sudo -g npm install express-generator
```
Next, [navigate](http://linuxcommand.org/lts0020.php) the terminal to the folder where you'd like to store your app. Here you will want to generate a basic application with the express-generator. Do so by executing:
```sh
$ express appname
``` 
If this doesn't work, try install the nodejs-legacy package:
```sh
$ sudo apt-get install nodejs-legacy
``` 
If you browse to the folder which express generated, you will see a file called package.json. This file manages the different packages (extensions) used by the app you created - like express. To add more extensions, you could open the file using notepad and manually add them by typing. I would rather recommend installing them like we did with express. For example, if we would like to the postgeo and pg packages, execute:

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

### More about node/express
Alright, so far we have installed all the packages we need and generated an express website. Now it might be usefull to get to know a little bit more about the structure we created. There are a couple of directories, namely:

    bin directory – manages the internal handling
    public directory – this is where you scripts and meda go
    routes directory – kind of like a switchboard, handles and directs requests
    views directory – where the HTML output is constructed (templates)

Although we already know what these two files are for, a small recap:

    app.js – application nerve center
    package.json – handles dependencies

### Getting started part 2: PostgreSQL / PostGIS

To connect our webapplication to our PostgreSQL database, we will need to install the database. To do so:

```sh 
$ sudo apt-get install postgresql-client-9.3
$ sudo apt-get install postgresql-9.3-postgis-2.1
```
Now, to setup the database I would recommend following [this](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04) tutorial made by DigitalOcean. This following is a short recap of their tutorial.

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
Create a new table
```
# CREATE TABLE geo_layers
(
  gid serial NOT NULL,
  lname character varying,
  the_geom geometry,
  CONSTRAINT geo_layers_pkey PRIMARY KEY (gid ),
  CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(the_geom) = 2),
  CONSTRAINT enforce_srid_the_geom CHECK (st_srid(the_geom) = 4326)
);
```
Load data into this table:
```sh
INSERT INTO geo_layers(lname, the_geom) values('polygons', '0106000020E610000002000000010300000001000000050000005A643BDF4F7D52C0917EFB3A70664440D712F241CF7E52C05F07CE19516244405F07CE19517E52C08BFD65F7E4614440696FF085C97C52C0F5B9DA8AFD6544405A643BDF4F7D52C0917EFB3A70664440010300000001000000040000005A643BDF4F7D52C0917EFB3A706644405F07CE19517E52C08BFD65F7E4614440696FF085C97C52C0F5B9DA8AFD6544405A643BDF4F7D52C0917EFB3A70664440');

INSERT INTO geo_layers(lname, the_geom) values('lines', '0105000020E610000004000000010200000002000000B97020240B7E52C0B8921D1B81644440EF552B137E7D52C0D5E76A2BF66344400102000000020000000F9C33A2B47D52C053793BC2696544409352D0ED257D52C03ECBF3E0EE644440010200000002000000EE08A7052F7E52C01CEBE2361A644440367689EAAD7D52C00F0BB5A679634440010200000002000000CA54C1A8A47E52C01092054CE06244402E56D4601A7E52C083DDB06D51624440');

INSERT INTO geo_layers(lname, the_geom) values('points', '0104000020E61000000400000001010000005A643BDF4F7D52C0917EFB3A706644400101000000696FF085C97C52C0F5B9DA8AFD65444001010000005F07CE19517E52C08BFD65F7E46144400101000000D712F241CF7E52C05F07CE1951624440');
```
Exit the database:
```sh
$ \q
```
Exit the postgres user:
```sh
$ exit
```

Another way to load shapefiles, csv, geojson, or any other (spatial) data into your Postgresql database is by using the open source GDAL/OGR package. If you happen to have qGIS installed, you probably have the GDAL/OGR library as well. If not, install GDAL ( using:
```sh
$ sudo apt-get install gdal-bin
```
Next, navigate to the folder in which you have your data stored, and execute the following command:
```sh
$ ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 user=postgres dbname=postgres password=5432" neighbourhoods.shp  
```


Something I personally found quite hard to grasp, is the concept of users/roles. So in short: who has access to which database etc. [This](https://www.digitalocean.com/community/tutorials/how-to-use-roles-and-manage-grant-permissions-in-postgresql-on-a-vps--2) article, again by DigitalOcean, makes it easier to understand.  

### Connect 
To connect our database to our application, we will have to write a little bit of code. Open the routes/index.js and edit it to look like this:

```
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
```
var conString = "postgres://postgres:654321@localhost:5432/postgres";
```
Finding out which variables you have to fill-in can be quite a hassle. One thing you could do is login to your database and check the connection info. You can do this like this:
```sh
$ sudo -i -u username
$ #psql
$ \conninfo
```