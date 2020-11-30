import './App.css';
import React from 'react';

function Square(props) {
  return (
    <button
      className='square'
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
        cols.push(<div>{this.renderSquare(j)}</div>);
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
      moveHistory: {
        asc: true,
        history: null
      }
    }
  }

  makeTheMove(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[history.length - 1].squares.slice();
    if (getWinner(squares) || squares[i]) {
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
    let winner = getWinner(this.state.history[this.state.history.length - 1].squares);
    return <div>{winner ? `Winner: ${winner}`: (`Next turn: ${this.state.xIsNext ? 'X' : 'O'}`)}</div>
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
    // this.setState({
    //   moveHistory: {
    //     history: moveHistory
    //   }
    // });
  }

  toggleMoveHistory() {
    this.setState({
      moveHistory: {
        asc: !this.state.moveHistory.asc
      }
    })
  }

  render() {
    let boardData = this.state.history[this.state.stepNumber].squares;
    let moves = this.getHistory();
    return (
      <div className="App">
        <div>
          <div>{this.getStatus()}</div>
          <Board
            boardData={boardData}
            handleBoardClick={(i) => this.makeTheMove(i)}/></div>
        <div className='history'>
          <div>
            <ol>
              <p>Past moves:</p>
              <p onClick={() => this.toggleMoveHistory()}>{this.state.moveHistory.asc ? 'dsc' : 'asc'}</p>
              {this.state.moveHistory.asc ? moves : moves.reverse()}
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
  for(let i=0; i<possibleWins.length; i++) {
    let [a,b,c] = possibleWins[i];
    if(board[a] && board[a] === board[b] && board[b] === board[c]) {
      winner = board[a];
    }
  }
  return winner;
}
