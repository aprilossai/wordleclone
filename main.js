document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]]
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord () {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
            { 
	            method: 'GET',
	            headers: {
		            'X-RapidAPI-Key': 'd6dd83e208msh56590c8025f67f9p118d44jsn1537c4be18da',
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                }
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                word = res.word;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

     function updateGuessedWords(letter) {
        const CurrentWordArr = getCurrentWordArr()

        if (CurrentWordArr && CurrentWordArr.length < 5) {
            CurrentWordArr.push(letter)     //push() adds new items to the end of an array

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
     }

     function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)"; //turns gray if letter isnt in word
        }

        const letterInThatPosition = word.charAt(index); // letter in correct word & position
        const isCorrectPosition = (letter === letterInThatPosition);  // to see if user's letter is = word otd letter position

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)"; //turns green if letter is in right place
        }

        return "rgb(181, 159, 59)";  // else make it yellow(if letter is in word but not in right position)
     }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters!");
        }

        const currentWord = currentWordArr.join("")

        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            { 
	            method: 'GET',
	            headers: {
		            'X-RapidAPI-Key': 'd6dd83e208msh56590c8025f67f9p118d44jsn1537c4be18da',
		            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                },
            }
        ).then((res) => {
            if (!res.ok) {
                throw Error()
            }

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 300;  //milliseconds between each flip
            currentWordArr.forEach((letter, index) => {
                setTimeout(() => {
                    const tileColor = getTileColor(letter, index);

                    const letterId = firstLetterId + index;
                    const letterEl = document.getElementById(letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl .style = `background-color:${tileColor}; border-color:${tileColor}`;
                }, interval * index);
            });

         guessedWordCount +=1;

            if (currentWord === word) {
            window.alert ("Congratulations! you won.");
            }

            if (guessedWords.length === 6) {
            window.alert (`Sorry, you lost! The word is ${word }`)
            }

            guessedWords.push([])
       
        })
        .catch (() => {
            window.alert("Word is not recognised");
        });
    }
    
     function createSquares() {
        const gameBoard = document.getElementById("board")  //gets element from by id from html

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated")
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()  //removes letter 

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''  //makes deleted letter square empty
        availableSpace = availableSpace - 1
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter()
                return;
            }

            updateGuessedWords(letter)
        }
    }
})