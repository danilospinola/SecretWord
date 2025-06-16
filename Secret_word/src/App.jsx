//CSS
import "./App.css";

//REACT
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/words";

//components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //Pega uma categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //Pega uma palavra aleatória da categoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //Começa o jogo
  const startGame = useCallback(() => {
    const { word, category } = pickWordAndCategory();

    //criando um array de letras
    console.log(word, category);
    let wordLetters = word.split("").map((l) => l.toLowerCase());
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //Processa a letra inserida
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, //Todos os elementos Corretos
        normalizedLetter, //Adiciona a letra correta
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, //Todos os elementos errados
        normalizedLetter, //Adiciona a letra errada
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  function clearStates() {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(
    () => {
      if (guesses <= 0) {
        //Finaliza o jogo
        clearStates();
        setGameStage(stages[2].name);
      }
    },
    [guesses] // Monitorando mudanças em guesses
  );

  //Verifica se o jogo acabou e se o jogador ganhou
  useEffect(
    () => {
      const uniqueLetters = [
        ...new Set(letters), //Array com letras únicas
      ];
      //Verifica se o jogo acabou
      if (
        guessedLetters.length === uniqueLetters.length &&
        gameStage === "game"
      ) {
        //Adiciona a pontuação
        setScore((actualScore) => (actualScore += 100));
        clearStates();
        startGame();
      }
    },
    [guessedLetters, letters, gameStage] // Monitorando mudanças em guessedLetters, letters e gameStage
  );

  //Reinicia o jogo
  const resetGame = useCallback(() => {
    setGuesses(3);
    setScore(0);
    setGameStage(stages[0].name);
  }, []);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver resetGame={resetGame} score={score} />}
    </div>
  );
}

export default App;
