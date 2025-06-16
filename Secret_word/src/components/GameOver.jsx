import './GameOver.css'

function GameOver({resetGame, score}) {
  return (
  <div>
    <h1>Fim de Jogo</h1>
    <h2>Você perdeu o jogo! Sua pontuação foi: <span>{score}</span> </h2>
    <button onClick={resetGame}>Reiniciar Jogo</button>
  </div>
  )
}

export default GameOver