import React, { Component } from 'react';
import './App.css';

function Square(props) {
  let color={color: '', background:''};
  color.color = props.value==='X'?'#00BFFF':'#FF0000';
  color.background = props.win ? '#FFFF00':props.selected ? '#FFFFFF': 'inherit';
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
              value={this.props.squares[j+20*i]}
              onClick={()=> this.props.onClick(i,j)} 
              win={this.props.win[j+20*i]}
              selected= {this.props.selected[j+20*i]}
            />
    );
  }
  
  render() {  
    let board=[];
    for(let i=0; i<20; i++){ //hang
      let row=[];
      for(let j=0; j<20; j++){ //cot
        row = row.concat(this.renderSquare(i,j));
      }
      board = board.concat(<div className='p-2 column' key={i}>{row}</div>);
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className='d-flex'>
          {board}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(400).fill(null),
        squaresOn:{
          row: null,
          col: null
        },
        win: Array(400).fill(false),
        selected: Array(400).fill(0)
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
    const selected = Array(400).fill(0);
    if((calculateWinner(squares, current.squaresOn.row, current.squaresOn.col) || squares[j+20*i])){
      return;
    }
    squares[j+20*i] = this.state.xIsNext?'X':'O';
    selected[j+20*i] = 1;
    if(calculateWinner(squares, i, j)){
      let index = calculateWinner(squares, i,j);
      for(let i of index){
        win[i] = true;
      }
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        squaresOn: {
          row: i,
          col: j,
        },
        win: win,
        selected: selected
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    step--;
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
    let k=this.state.stepNumber;
    let status;
    let animation='';
    if(winner){
      status = 'Winner: '+ winner;
      animation='won';
    }else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
    }

    return (
      <div>
        <div className='main'></div>
      <div className="container-fluid">
        <div className='row game'>
        <div className='col-lg-7'>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)}
            win={current.win}
            selected = {current.selected}
          />
        </div>
        </div>
        <div className='col-lg-3'>
        <div className="game-info">
          <p className={animation}>{status}</p>
          <div className='selected-cell'> Cell: [{current.squaresOn.col},{current.squaresOn.row}]</div>
          <div className='d-flex flex-column button-block'>
            <div className='p-2' key ='0'><button className='button' onClick={() => this.jumpTo(1)}>Start</button></div>
            <div className='p-2'  key ='1'><button className='button' onClick={() => this.jumpTo(k)}>Undo</button></div>
          </div>
        </div>
        </div>
        </div>
      </div>
      </div>
    );
  }
}

function calculateWinner(squares,i,j){
  let index = j+20*i;
    if(squares[index] && (squares[index]===squares[index+20] || squares[index]===squares[index-20])){ // hang doc
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+20] && j<380){
        j +=20;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-20] && k>=20){
        k -= 20;
        arr=[...arr, k];
        count ++;
      }
      if(count >= 5) return arr;
    }else if(squares[index] && (squares[index]===squares[index-1] || squares[index]===squares[index+1])){ // hang ngang
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+1] && j<400){
        j++;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-1] && k>=1){
        k--;
        arr = [...arr, k];
        count ++;
      }
      if(count >= 5) return arr;
    } else if(squares[index] && (squares[index]===squares[index+21] || squares[index]===squares[index-21])){ // hang cheo 1
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+21] && j<379){
        j += 21;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-21] && k>=21){
        k -= 21;
        arr = [...arr, k];
        count ++;
      }
      if(count >= 5) return arr;
    } else if(squares[index] && (squares[index]===squares[index+19] || squares[index]===squares[index-19])){ // hang cheo 2
      let j = index, k=index;
      let arr=[index];
      let count = 1;
      while(squares[j] && squares[j] === squares[j+19] && j<381){
        j += 19;
        arr = [...arr, j];
        count ++;
      }
      while(squares[k] && squares[k] === squares[k-19] && k>=19){
        k -= 19;
        arr = [...arr, k];
        count ++;
      }
      if(count >= 5) return arr;
    } 
    return 0;
  }

export default Game;
