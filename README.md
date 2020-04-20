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

  <link rel="stylesheet" type="text/css" href="/web/css/gol.css"/>
  <script type="text/javascript" src="/web/js/gol.js"></script>
  
then initiate the object as following:
  let rows = 180;
  let cols = 320;
  let interval = 250; //ms
  let gol = new Gol("container",rows,cols,interval);
  gol.initialize();
