# gameoflifejs
Game of Life implemented in vanilla javascript

Description: 

This is the first iteration of a game of life done by 
mapping and changing HTMLelements. 

The map is done dynamically as you initiate the object, you 
define the number of rows and columns the map will have and 
you'll also define how frequently the map with refresh its 
cells' state. 

Problems:
* Cells are represented with divs. It will scale up in 
  processing as you increase the number of rows and 
  columns. 
* To set up an initial map, you'll have to "paint" it by 
  hovering your mouse of the cells to toggle their state. 
  It's not optimal. 

Instructions:
For now, the script requires a div element with a certain id. 
Then you'll initiate the Game of Life object with parameters.
Use the space bar to initiate the game then use the spacebar 
again to pause it/unpause it. 

include the following on your page head:
```
  <link rel="stylesheet" type="text/css" href="gol.css"/>
  <script type="text/javascript" src="gol.js"></script>
```

in page body include the following:
```
  <div id="someId"></div>
```
  
then initiate the object as following:
```
  let rows = 90; // number of rows your map will have
  let cols = 160; // number of columns your map will have
  let interval = 500; //interval in miliseconds to refresh your map
  let divId = "container"; //the id of the div element to contain your map. It must be empty
  let gol = new Gol(divId,rows,cols,interval);
  gol.initialize();
```
