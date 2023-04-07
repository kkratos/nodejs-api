const messageDisplay = document.querySelector('.message-container')
const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')

let wordly;

const getWordly = () => {
    fetch('http://localhost:3000/word')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            wordly = json.toUpperCase()
        })
        .catch(err => console.log(err))
}

getWordly();

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<<'
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-'+guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-'+guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})

const handleClick = (letter) => {
    console.log('clicked', letter)
    if (letter === '<<'){
        deleteLetter()
        console.log('guessRows', guessRows)
        return
    }

    if (letter === 'ENTER'){
        checkRow()
        console.log('guessRows', guessRows)
        return
    }
    addLetter(letter)
}

keys.forEach(key => {
    const button = document.createElement('button')
    button.textContent = key
    button.setAttribute('id', key)
    button.addEventListener('click', () => handleClick(key))
    keyboard.append(button)
})

const addLetter = (letter) => {
    if(currentTile < 5 && currentRow < 6){
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
        console.log('guessRows', guessRows)
    }
}


const deleteLetter = () => {
    if(currentTile > 0){
        currentTile --
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent=''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    if(currentTile > 4){
        const guess = guessRows[currentRow].join('')
        console.log('guess is ' + guess, 'wordly is ' + wordly)
        flipTile()
        if(wordly === guess){
            showMessage('Magnificent')
            isGameOver = true

        }else{
            if(currentRow >=5){
                isGameOver = false
                showMessage('Game Over')

            }
            if (currentRow < 5){
                currentRow++
                currentTile = 0
            }
        }
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}


const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordly = wordly
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
        console.log(guess)
        guess.forEach((guess, index) => {
            if(guess.letter === wordly[index]){
                guess.color = 'green-overlay'
                checkWordly = checkWordly.replace(guess.letter, '')
            }
        })

        guess.forEach((guess) => {
            if(checkWordly.includes(guess.letter)){
                guess.color = 'yellow-overlay'
            }
        })
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}
