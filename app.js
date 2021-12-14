function randomWord(arr) {
  const luckyWord = arr[Math.floor(Math.random() * arr.length)];
  // console.log(luckyWord);
  localStorage.setItem("luckyWord", JSON.stringify(luckyWord));
  hideWord();
}

window.addEventListener("load", () => {
  retrieveWords();
});

let playAgain = document.querySelector("#play-button");
playAgain.addEventListener("click", () => {
  window.setTimeout(() => {
    window.location.reload(true);
  }, 200);
});

async function retrieveWords() {
  const response = await fetch("data.txt");
  const text = await response.text();
  const arranged = text
    .split("\n")
    .map((word) => word.replace("\r", "").replace("[", "").replace("]", ""))
    .filter((word) => word.length <= 10);

  randomWord(arranged);
}

function lettersToBeOpened(num) {
  let lenOfRandoms = { 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 3 };
  let arrOfIds = [];
  while (num) {
    if (arrOfIds.length < lenOfRandoms[num]) {
      let rand = Math.floor(Math.random() * num);
      if (!arrOfIds.includes(rand)) {
        arrOfIds.push(rand);
      }
    } else {
      break;
    }
  }
  return arrOfIds;
}

function hideWord() {
  const getWord = JSON.parse(localStorage.getItem("luckyWord"));
  const getLetters = getWord.split("");
  let word = document.querySelector("#word");
  const iDs = lettersToBeOpened(getWord.length);
  getLetters.forEach((letter, index) => {
    let letterBox = document.createElement("div");
    if (iDs.includes(index)) {
      letterBox.innerHTML = `<div id=${index} style="width: 50px; background: none; border: none; color: white; text-align:center; margin-right:10px; font-size:1.5em"> ${letter.toUpperCase()} </div>`;
    } else {
      letterBox.innerHTML = `<input id=${index} type="text" autocomplete="off" maxlength="1" size="1" style="background: none; border: none; border-bottom: 1px solid white; color: white; text-align:center; margin-right:10px; font-size:1.5em" />`;
    }
    word.appendChild(letterBox);
  });

  playGame(getWord.toUpperCase());
}

function playGame(word) {
  let letterNodes = document.querySelectorAll("input");
  let figureNodes = document.querySelectorAll(".figure-part");
  let popUp = document.querySelector(".popup-container");
  let upperMessage = document.getElementById("final-message");
  let lowerMessage = document.getElementById("final-message-reveal-word");
  let wrongLetters = document.getElementById("wrong-letters");
  wrongLetters.innerText = "Wrong entered letters with indices are: ";

  let errorCount = 0;
  let openedLetter = 0;

  letterNodes.forEach((node, index) => {
    node.addEventListener("change", (e) => {
      if (e.target.value.toUpperCase() == word[e.target.id]) {
        e.target.setAttribute("disabled", true);
        e.target.style.border = "none";
        openedLetter += 1;
      } else {
        figureNodes[errorCount].style.display = "block";
        errorCount += 1;
        wrongLetters.innerHTML += `${e.target.value.toUpperCase()}(${index}), `;
        e.target.value = "";
        if (errorCount == 10) {
          popUp.style.display = "flex";
          upperMessage.innerText = "You lost :(";
          lowerMessage.innerText = `${word}`;
        }
      }
      if (errorCount < 10 && openedLetter == letterNodes.length) {
        popUp.style.display = "flex";
        upperMessage.innerText = "YOU WIN!!!";
        lowerMessage.innerText = `${word}`;
      }
    });
  });
}
