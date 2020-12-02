import './App.css';
import React from 'react';
// import classNames from "classNames";
var classNames = require('classnames');
function Square(props) {
  return (
    <button
      className={classNames("square", {
        'bold-it': props.boldIt,
      })}
      onClick={props.handleSquareClick}>
      {props.btnVal}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        btnVal = {this.props.boardData[i]}
        handleSquareClick={() => this.props.handleBoardClick(i)}/>
    )
  }

  loopSquares() {
    let rows = [];
    for(let i=0; i<3; i++) {
      let cols = [];
      for (let j= i*3 ; j<= i*3+2; j++) {
        let elm = <div>{this.renderSquare(j)}</div>;
        if(this.props.winSequence && this.props.winSequence.includes(j)) {
          elm = <div className='bold-it'>{this.renderSquare(j)}</div>
        }
        cols.push(elm);
      }
      rows.push(
        <div className='row'>{cols}</div>
      )
    }
    return (
      <div className='board'>
        {rows}
      </div>
    );
  }

  render() {
    return this.loopSquares()
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: Array(
        {
          squares: Array(9).fill(null)
        }
      ),
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    }
  }

  makeTheMove(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[history.length - 1].squares.slice();
    if (getWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    history = history.concat({
      squares: squares,
      latestMoveSquare: i
    });
    this.setState({
      history,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length - 1,
    });
  }

  getStatus() {
    let winnerRes = getWinner(this.state.history[this.state.history.length - 1].squares);
    if(winnerRes.winner) {
      let sequence = winnerRes.sequence;
      console.log(sequence);
    }
    return <div>{winnerRes.winner ? `Winner: ${winnerRes.winner}`: (`Next turn: ${this.state.xIsNext ? 'X' : 'O'}`)}</div>
  }

  goToMove(i) {
    let history = [...this.state.history];
    history = history.slice(0, i + 1);
    this.setState({
      history: history,
      stepNumber: i,
      xIsNext: i % 2 === 0
    })
  }

  getHistory() {
    const rowLen = this.state.history.length - 1;
    let moveHistory = this.state.history.map((board, idx) => {
      let col =  1 + board.latestMoveSquare % 3;
      let row =  1 + Math.floor(board.latestMoveSquare / 3);
      return <li
        key={idx}
        className={idx === rowLen ? 'bold-it': ''}
        onClick={() => this.goToMove(idx)}>{idx === 0 ? 'Start over': `Go to move ${idx} (${row}, ${col})`}</li>
    });
    return moveHistory;
  }

  toggleMoveHistory() {
    this.setState({
      asc: !this.state.asc
    })
  }

  render() {
    let boardData = this.state.history[this.state.stepNumber].squares;
    let moves = this.getHistory();
    let winnerRes = getWinner(boardData);
    return (
      <div className="App">
        <div>
          <div>{this.getStatus()}</div>
          <Board
            boardData={boardData}
            handleBoardClick={(i) => this.makeTheMove(i)}
            winSequence={winnerRes.sequence}/></div>
        <div className='history'>
          <div>
            <ol>
              <p>Past moves:</p>
              <button onClick={() => this.toggleMoveHistory()}>{this.state.asc ? 'dsc' : 'asc'}</button>
              {this.state.asc ? moves : moves.reverse()}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;


function getWinner(board) {
  let possibleWins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  let winner;
  let winSeq;
  for(let i=0; i<possibleWins.length; i++) {
    let [a,b,c] = possibleWins[i];
    if(board[a] && board[a] === board[b] && board[b] === board[c]) {
      winner = board[a];
      winSeq = possibleWins[i]
    }
  }
  return {
    winner,
    sequence: winSeq
  };
}
