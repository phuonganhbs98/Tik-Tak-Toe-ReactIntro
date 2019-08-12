import React, { Component } from 'react';
import './App.css';

function Square(props) {
  let color={color: '', background:''};
  color.color = props.value==='x'?'blue':'red';
  color.background = props.win ? '#FFFF99':'white';
    return (
      <button 
        className="square" style={color}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
}
class Board extends Component {

  renderSquare(i,j) {
    return (<Square key={i*100 + j}
              value={this.props.squares[j+30*i]}
              onClick={()=> this.props.onClick(i,j)} 
              win={this.props.win[j+30*i]}
            />
    );
  }
  
  render() {  
    let board=[];
    for(let i=0; i<30; i++){ //hang
      let row=[];
      for(let j=0; j<30; j++){ //cot
        row = row.concat(this.renderSquare(i,j));
      }
      board = board.concat(<div key={i}>{row}</div>);
    }
    return (
      <div>
        <div className="status">{status}</div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(900).fill(null),
        squaresOn:{
          row: null,
          col: null
        },
        win: Array(900).fill(false)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }
  handleClick(i,j){
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1]; //square hien tai
    const squares = current.squares.slice(); // ban coppy cua square hien tai.
    const win = current.win.slice();
    // const check = i;
    if((calculateWinner(squares, current.squaresOn.row, current.squaresOn.col) || squares[j+30*i])){
      return;
    }
    squares[j+30*i] = this.state.xIsNext?'x':'o';
    if(calculateWinner(squares, i, j)){
      let index = calculateWinner(squares, i,j);
      for(let i of index){
        win[i] = true;
      }
    }
    this.setState({ //??
      history: history.concat([{
        squares: squares,
        squaresOn: {
          row: i,
          col: j,
        },
        win: win
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }


  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const index = calculateWinner(current.squares, current.squaresOn.row, current.squaresOn.col);
    const winner = current.squares[index[0]];
    const moves = history.map((step, move) => {
      const selected = history[move];
      const desc = move?
      'Go to move #' + move + `[${selected.squaresOn.row},${selected.squaresOn.col}]`:
      'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: '+ winner;
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'x':'o');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)}
            win={current.win}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares,i,j){
  let index = j+30*i;
    if(squares[index] && (squares[index]===squares[index+30] || squares[index]===squares[index-30])){ // hang doc
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+30] && j<870){
        j +=30;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-30] && k>=30){
        k -= 30;
        arr=[...arr, k];
        count ++;
      }
      if(count === 5) return arr;
    }else if(squares[index] && (squares[index]===squares[index-1] || squares[index]===squares[index+1])){ // hang ngang
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+1] && j<899){
        j++;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-1] && k>=1){
        k--;
        arr = [...arr, k];
        count ++;
      }
      if(count === 5) return arr;
    } else if(squares[index] && (squares[index]===squares[index+31] || squares[index]===squares[index-31])){ // hang cheo 1
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+31] && j<869){
        j += 31;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-31] && k>=31){
        k -= 31;
        arr = [...arr, k];
        count ++;
      }
      if(count === 5) return arr;
    } else if(squares[index] && (squares[index]===squares[index+29] || squares[index]===squares[index-29])){ // hang cheo 2
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+29] && j<871){
        j += 29;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-29] && k>=29){
        k -= 29;
        arr = [...arr, k];
        count ++;
      }
      if(count === 5) return arr;
    } 
    return 0;
  }

export default Game;
