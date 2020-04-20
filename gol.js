/**
 * Class Gol
 * 
 * Represents a class able to implement the game of life with costumizable settings
 * like size of the map and how fast it can generate the next generation of cells
 * 
 * 16 April 2020
 * 
 * @file gol.js
 * @author Sérgio Henriques
 */
class Gol {

    /**
     * creates a game of life map on the
     * HTMLelement with containerId with numRows 
     * rows and numCols columns
     * @constructor
     * 
     * @param {string} containerId 
     * @param {int} numRows 
     * @param {int} numCols 
     * @param {int} interval the time interval in miliseconds 
     */
    constructor(containerId,numRows,numCols,interval = 500){
        this.containerId = containerId;
        this.numRows = numRows;
        this.numCols = numCols;
        this.interval = interval;
        this.timeout = null; 
        console.log("init: " + this.numRows + ' ' + this.numRows + ' ' + this.interval);
    }
    
    /**
     * initialize
     * 
     * Initiates the cell generation sequence as the space key is pressed.
     * It can also be paused with the space key
     */
    initialize() {
        this.drawCellMap();
        let golObj = this;
        document.addEventListener("keydown", function(event) { 
            if(event.which == 32) { // number for space key
                if(!golObj.timeout) {
                    golObj.timeout = window.setInterval(function(){golObj.nextStateMap()},golObj.interval);
                } else {
                    window.clearInterval(golObj.timeout);
                    golObj.timeout = null;
                }
            }
        });
    }

    /**
     * virtual constant for depicting cells change to alive state on a cell map
     */
    static get mutateToAlive(){ return 2; }
    /**
     * virtual constant for depicting cells change to dead state on a cell map
     */
    static get mutateToDead(){ return 1; }
    /**
     * virtual constant for depicting cells change to empty state on a cell map
     */
    static get mutateToEmpty(){ return 0; }
    /**
     * virtual constant to represent no mutaiton on a cell map
     */
    static get noMutation(){ return -1; }


    /**
     * cellId
     * 
     * gets the id of a cell with in certain row and column
     * 
     * @param {int} row 
     * @param {int} col 
     * @returns {string} the cell id attribute
     */
    static cellId(row,col) {
        return "r" + row + "-c" + col;
    }

    /**
     * pushCell
     * 
     * creates a HTMLElement cell and appends it into the container
     * The cell will have attribute id as identifier, attribute cell-status
     * as cellStatus and will have attributes as key="value", if needed
     * 
     * @param {string} identifier 
     * @param {string} cellStatus 
     * @param {Array} attributes 
     */
    pushCell(identifier, cellStatus = "", attributes = {}) {
        let container = document.getElementById(this.containerId);
        let newCell = document.createElement("div");

        newCell.setAttribute("cell-status",cellStatus);
        newCell.setAttribute("id", identifier)
        newCell.setAttribute("class", "cell");
        newCell.setAttribute("onmouseenter", "Gol.toggleCellObj(this)");
        for(let attrKey in attributes){
            newCell.setAttribute(attrKey,attributes[attrKey]);
        };

        container.appendChild(newCell);
    }

    /**
     * clearContainer
     * 
     * clears the referenced container
     */
    clearContainer(){
        document.getElementById(this.containerId).innerHTML = ""; //clear container
    }

    /**
     * drawCellMap
     * 
     * Draws our cell map in our container
     * 
     * @param {*} map custom cell map with cell status 
     */
    drawCellMap(map = [[]]) {
        let container = document.getElementById(this.containerId);

        this.clearContainer();
        container.style.gridTemplateRows = "repeat(" + this.numRows + ",1fr)";
        container.style.gridTemplateColumns = "repeat(" + this.numCols + ",1fr)";

        for(let currentRow = 0; currentRow < this.numRows; currentRow++) {
            for(let currentColumn = 0; currentColumn < this.numCols; currentColumn++) {
                let cellClass = "empty";
                if(map[currentRow] && map[currentRow][currentColumn]) {
                    if(map[currentRow][currentColumn] === 1 ) {
                        cellClass = "alive";
                    } else if(map[currentRow][currentColumn] === 0) {
                        cellClass = "dead";
                    }
                }
                this.pushCell(Gol.cellId(currentRow,currentColumn),cellClass, { cellRow : currentRow, cellCol: currentColumn});
            }
        }
    }

    /**
     * nextStateMap
     * 
     * maps the next generation of cells and prints them in the container
     * 
     */
    nextStateMap(){
        let mutationMap = [];
        for(let currentRow = 0; currentRow < this.numRows; currentRow++) {
            mutationMap.push([]);
            for(let currentColumn = 0; currentColumn < this.numCols; currentColumn++) { // cell
                let currentCell = Gol.getCell(currentRow,currentColumn);
                if(currentCell) {
                    let nextCellState = Gol.noMutation;
                    let neighboursAlive = Gol.countLivingNeighbours(currentRow, currentColumn);
                    if(Gol.isAlive(currentCell)) {
                        //nextCellState = 1; // keep alive if conditions aren't met.
                        if(neighboursAlive < 2 || neighboursAlive > 3) {
                            nextCellState = Gol.mutateToDead; // kill cell
                        } 
                    }
                    if(Gol.isDead(currentCell) || Gol.isEmpty(currentCell)){
                        if(neighboursAlive == 3) {
                            nextCellState = Gol.mutateToAlive; // cell is born
                        } else if(Gol.isDead(currentCell)) {
                            nextCellState = Gol.mutateToEmpty; // dead cell disappears 
                        }
                    }
                    mutationMap[currentRow].push(nextCellState);
                }
            }
        }
        //update with new map of instructions
        for(let nextMutationRow = 0; nextMutationRow < this.numRows; nextMutationRow++){
            for(let nextMutationCol = 0; nextMutationCol < this.numCols; nextMutationCol++){
                if(mutationMap[nextMutationRow][nextMutationCol] == Gol.mutateToAlive) {
                    Gol.giveBirthToCell(Gol.getCell(nextMutationRow,nextMutationCol));

                } else if(mutationMap[nextMutationRow][nextMutationCol] == Gol.mutateToDead) {
                    Gol.killCell(Gol.getCell(nextMutationRow,nextMutationCol));

                } else if(mutationMap[nextMutationRow][nextMutationCol] == Gol.mutateToEmpty) {
                    Gol.vanishRemains(Gol.getCell(nextMutationRow,nextMutationCol));
                }
            }
        } 
    }

    /**
     * countLivingNeighbours
     * 
     * counts all living neighbours from cell in index [row][col]
     * 
     * @param {int} row row index
     * @param {int} col column index
     * @returns {int} the number of living neighbours
     */
    static countLivingNeighbours(row, col) {
        let livingNeighboursCount = 0;
        let cell = Gol.getCell(row,col);
        if(cell) {
            for(let deltaRow = -1; deltaRow <= 1; deltaRow++) {
                for(let deltaCol = -1; deltaCol <= 1; deltaCol++) {
                    if(deltaRow != 0 || deltaCol != 0) {
                        let neighbourCell = Gol.getCell(1*row + deltaRow,1*col + deltaCol);
                        if(neighbourCell && Gol.isAlive(neighbourCell)){
                            livingNeighboursCount++;
                        }
                    }
                    
                }
            }
        }
        return livingNeighboursCount;
    }

    

    /**
     * getCell 
     * 
     * fetches the cell with index on coordinate from our cell map 
     * 
     * @param {int} row 
     * @param {int} col 
     * @returns {HTMLElement} cell 
     */
    static getCell(row,col){
        return document.getElementById(Gol.cellId(row,col));
    }

    /**
     * isDead
     * 
     * Checks if cell is marked as dead
     * 
     * @param {HTMLElement} cell 
     * @returns {boolean} true if dead, false otherwise
     */
    static isDead(cell){
        return cell.getAttribute("cell-status").includes("dead");
    }

    /**
     * isAlive
     * 
     * Check if cell is marked as alive
     * 
     * @param {HTMLElement} cell 
     * @returns {boolean} true if alive, false otherwise
     */
    static isAlive(cell){
        return cell.getAttribute("cell-status").includes("alive");
    }

    /**
     * isEmpty
     * 
     * Check if cell is marked as empty
     * 
     * @param {HTMLElement} cell 
     * @returns {boolean} true if empty, false otherwise
     */
    static isEmpty(cell){
        return cell.getAttribute("cell-status").includes("empty");
    }

    /**
     * killCell
     * 
     * Marks a living cell as dead
     * 
     * @param {HTMLElement} cell 
     */
    static killCell(cell){
        if(cell && Gol.isAlive(cell)) {
            cell.setAttribute('cell-status',"dead");
        }
    }

    /**
     * giveBirthToCell
     * 
     * Marks a dead or empty cell as alive
     * 
     * @param {HTMLElement} cell 
     */
    static giveBirthToCell(cell){
        if(cell && (Gol.isDead(cell) || Gol.isEmpty(cell) )) {
            cell.setAttribute('cell-status',"alive");
        }
    }

    /**
     * vanishRemains 
     * 
     * Marks a dead cell as empty
     * 
     * @param {HTMLElement} cell 
     * 
     */
    static vanishRemains(cell){
        if(cell) { cell.setAttribute('cell-status',"empty"); }
    }

    /**
     * toggleCell
     * 
     * @param {int} row 
     * @param {int} col 
     */
    static toggleCell(row,col){
        Gol.toggleCellObj(Gol.getCell(row,col));
    }

    /**
     * toggleCellObj
     * 
     * toggles Cell status between alive and empty
     * 
     * @param {HTMLElement} cellElement 
     */
    static toggleCellObj(cellElement){
        if(cellElement) {
            if(Gol.isEmpty(cellElement)){
                Gol.giveBirthToCell(cellElement);
            } else {
                Gol.vanishRemains(cellElement);
            }
        }
    }

    /** 
     * function getNumRows *deprecated*
     * 
     * gets the number of rows in our cell map
     * 
     * @returns {int} number of rows
     */
    static getNumRows() {
        let lastChild = document.getElementById(this.containerId).lastChild;
        let rows = 0;
        if(lastChild) {
            rows = lastChild.getAttribute("cellrow");
            if(rows) { rows++; }
        }
        return rows;
    }

    /**
     * function numColumns *deprecated*
     * 
     * gets the number of columns in our cell map
     * 
     * @returns {int} number of columns
     */
    static getNumColumns() {
        let lastChild = document.getElementById(this.containerId).lastChild;
        let columns = 0;
        if(lastChild) {
            columns = lastChild.getAttribute("cellcol");
            if(columns) { columns++; }
        }
        return columns;
    }

}