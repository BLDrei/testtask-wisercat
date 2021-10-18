This is an SPA, with help of which you can take articles from a database and filter them using a modal window.

In order to use it, you have to create a new db or connect to an existing one.

1) Install MySQL. https://www.mysql.com/downloads/ (skip this step if already installed)
2) Install a local server environment. In this walkthrough, I'll be using MAMP (version 6), but you can install another one. https://www.mamp.info/en/downloads/ (skip this step if already installed)
3) Run MAMP, press "Start" button in the top-right corner.
4) Press the "WebStart button". Scroll down, choose "MySQL". In the first line, there will be a link to phpMyAdmin. Open it in the new tab.
5) Create a new database for this project, unless you already have it created. If you have pre-created even the table of articles, make sure it's in the relevant database and its name is "article". In this case skip step 12.
6) Go back to MAMP -> WebStart, find "Port", "Username" and "Password" fields and remember their value.
7) In the project folder, go to /src/main/resources/application.properties
8) In the 1, 2 and 3 line, change values "8889", "root" and "root" to the corresponding values from step 6, if they differ.
9) In the 1 line, change "test_task_wisercat" to the name of the database you are going to use.
10) To run the application, go to the project folder, src/main/java/eu/wisercat/testtask/TestTaskApplication.java and run method "main".
11) Go back to phpMyAdmin and in the project database, find table "article".
12) In case it's empty, you can either insert your own set of data or use the author's one. Appropriate MySQL code can be found in src/main/resources/data.sql
13) Since the applicarion is already running, just open a browser and go to localhost:8080/
14) If port 8080 is occupied, go to application.properties and, on a new line, write "server.port = 8081" or any other port of your choice. Use this port in step 13.
15) Enjoy! And don't forget to pick up some German beforehand!