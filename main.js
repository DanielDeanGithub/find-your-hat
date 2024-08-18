const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
    }

    get field() {
        return this._field;
    }
    set field(newField) {
        this._field = newField;
    }

    print() {
        this.field.forEach(row => console.log(row.join('')));
    }

    static generateField(x = 3, y = 3, percent = 10) {
        const newField = [];
        let temp = [];
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++ ) {
                temp.push(fieldCharacter);
            }
            newField.push(temp);
            temp = [];
        }

        const generateCoordinates = (x, y) => {
            let randX = Math.floor(Math.random() * x);
            let randY = Math.floor(Math.random() * y);

            while(newField[randY][randX] != fieldCharacter) {
                randX = Math.floor(Math.random() * x);
                randY = Math.floor(Math.random() * y);
            }

            return [randX,randY];
        }

        const hatLocation = generateCoordinates(x,y);
        newField[hatLocation[1]][hatLocation[0]] = hat;

        const startLocation = generateCoordinates(x,y);
        newField[startLocation[1]][startLocation[0]] = pathCharacter;

        const holeTotal = Math.round(((x * y)) * (percent / 100));

        for (let i = 0; i < holeTotal; i++) {
            let holeLocation = generateCoordinates(x,y);
            newField[holeLocation[1]][holeLocation[0]] = hole;
        }

        return newField;
    }
};
class Game {
    constructor(field) {
        this._map = field;
        this._preview = new Field(JSON.parse(JSON.stringify(field.field)));
        this._gameRun = false;
        this._player = [0,0];
    }
    
    get map() { return this._map; }
    get gameRun() { return this._gameRun; }
    set gameRun(gameRun) { this._gameRun = gameRun; }
    get player() { return this._player; }
    set player(player) { this._player = player; }
    get preview() { return this._preview; }
    set preview(preview) { this._preview = preview; }

    resetPreview() {
        return this.preview.field.forEach((row, i) => {       
            row.forEach((e,j) => {                    
                e === pathCharacter ? this._player = [j,i] : this.preview.field[i][j] = fieldCharacter;
            });    
        }); 
    }

    playGame() {
        this.resetPreview();
        console.log(`Time to find your hat!\nTo begin please enter a direction (type 'W' for up, 'A' for left, 'S' for down or 'D' for right)`); 

        // this.map.print();
        this.preview.print();
        const mapArr = this.map.field;
        const previewArr = this.preview.field;
        this.gameRun = true;

        while(this.gameRun) {
            let userInput = prompt('Please enter a direction to explore:').toUpperCase();
            
            while (userInput !== 'W' && userInput !== 'A' && userInput !== 'S' && userInput !== 'D' && userInput !== '?') {
                console.log(`Error. Please enter a valid direction ('W','A','S', or 'D')`);
                userInput = prompt('Please enter a direction to explore:').toUpperCase();
            }

            if (userInput === '?') {
                console.log(`Cheater!!!`);
                this.map.print();
                userInput = prompt('Please enter a direction to explore:').toUpperCase();
            }

            let x = this.player[0];
            let y = this.player[1];

            switch (userInput) {
                case 'W':
                    y--;   
                    break;
                case 'A':
                    x--;
                    break;
                case 'S':
                    y++
                    break;
                case 'D':
                    x++;
                    break;
                default:
                    break;
            }

            const endGame = (message) => {
                previewArr[y][x] = mapArr[y][x];
                this.preview.print();
                console.log(message);
                this.gameRun = false;
            };

            // error checking to make sure movement is within bounds
            if (y >= 0 && y < mapArr.length && x >= 0 && x < mapArr[y].length) {
                this.player = [x,y];
                previewArr[y][x] = pathCharacter;                

                if (mapArr[y][x] === hole) {
                    endGame('You fell down a hole. Game over =[');
                    break;
                }
                if (mapArr[y][x] === hat) {
                    endGame('You found your hat, Congratulations!!!');
                    break;
                }

                this.preview.print();
                console.log('The search continues...');
            } else {
                console.log('Ouch! You just walked into a walk.');
            }          
        }

        let replayGame = prompt(`Would you like to play again? (Enter 'Y' to play again or 'N' to exit)`).toUpperCase();

        while (replayGame !== 'Y' && replayGame !== 'N') {
            console.log(`Error. Please enter a valid answer ('Y' or 'N')`);
            replayGame = prompt(`Would you like to play again? (Enter 'Y' to play again or 'N' to exit)`).toUpperCase();
        }
        if (replayGame === 'Y') {
            this._preview = new Field(JSON.parse(JSON.stringify(mapArr)));
            return this.playGame();
        }
    }
};

const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
]);

//const myField = new Field(Field.generateField(4,4,25));


const isFieldValid = ({field}) => {
    const start = [];
    const end = [];
    const visted = [];
    const correctPath = [];

    for (let i = 0; i < field.length; i++)
    {
        visted.push([]);
        correctPath.push([]);

        for (let j = 0; j < field[i].length; j++)
        {
            visted[i].push(false);
            correctPath[i].push(false);
            if (field[i][j] === pathCharacter) {
                start.push(i,j);
            } 
            if (field[i][j] === hat) {
                end.push(i,j);
            }
        }
    }

    if (!start.length > 0 && !end.length > 0) {
        return false;
    }

    console.log(visted);
    console.log(correctPath);

    return true;
}



isFieldValid(myField);





const hatGame = new Game(myField);
// hatGame.playGame();
