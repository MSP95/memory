import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default function memory_init(root) {
  ReactDOM.render(<Board />, root);
}

class Square extends React.Component {

  change(){
    let score = this.props.score;
    if (this.props.pause == false){
      this.props.action(this.props.id, this.props.value, this.props.flag,score);
    }
  }

  render() {
    let btnClass = classnames({
      'square-tile': true,
      'square-selected': this.props.current != null,
    });
    return (
      <button id={this.props.id} className={btnClass} onClick={()=>this.change()}>
        {this.props.current}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    let squareval = ["A", "B", "C","D","E","F","G","H","A", "B",
    "C","D","E","F","G","H"];
    this.state = {
      squares: this.shuffleArray(squareval),
      currentValues:Array(16).fill(null),
      previous: [],
      flag: true,
      score: 0,
      isPaused: false,
    };
  }
  changeState(id,curr, val,flag, score){
    let prev = {id: id,value: val};
    this.setState({
      previous: prev,
      flag: flag,
      score: score,
      currentValues: curr,
    });
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  reset(){
    let squareval = ["A", "B", "C","D","E","F","G","H","A", "B",
    "C","D","E","F","G","H"];

    this.setState({
      squares: this.shuffleArray(squareval),
      currentValues:Array(16).fill(null),
      previous: [],
      flag: true,
      score: 0,
      isPaused: false,

    });
  }
  pauseInput(pause){
    this.setState({
      isPaused: pause,
    });
  }
  changeHandler(id, val,flagy, score){
    let flag = flagy;
    let previousId = this.state.previous.id;
    let previousVal = this.state.previous.value;
    let currentValues=this.state.currentValues.slice();
    //Empty tile clicked
    if(currentValues[id] == null){
      score+=1;
      currentValues[id]=val;
      flag = !flagy;
      // Its second tile
      if(flag == true){
        // elements match <div>&#10003;</div>;
        if(previousVal == val){
          this.pauseInput(true);
          this.pauseInput(true);
          setTimeout(() => {
            currentValues[id] = <div>&#10003;</div>;
            currentValues[previousId]=<div>&#10003;</div>;
            this.changeState(id, currentValues,val,flag, score);
            this.pauseInput(false);}, 200);
        }
          //elements dont match
        else{
          this.pauseInput(true);
          setTimeout(() => {
            currentValues[id] = null;
            currentValues[previousId]=null;
            this.changeState(id, currentValues,val,flag, score);
            this.pauseInput(false);}, 1000);
        }
      }
        // its first tile
      else {
        currentValues[id] = val;
      }
      this.changeState(id, currentValues,val,flag, score);
    }
  }
  calculateWinner(){
    if(_.every(this.state.currentValues,function(num){return num != null})){
      return <div><h1> Congrats! You are a winner!</h1>
      <h4><i>Click Reset button to play again.</i></h4></div>
    }
  }
  renderSquare(props) {
    return (
      <Square
        id = {props}
        value={this.state.squares[props]}
        current={this.state.currentValues[props]}
        action = {this.changeHandler}
        previous = {this.state.previous}
        flag={this.state.flag}
        score={this.state.score}
        pause={this.state.isPaused}
        />
    );
  }
  render(){
    return (
      <div className="main-game">
        <div className="status"><h2>Score: {this.state.score}</h2>
        <div className="winner">{this.calculateWinner()}</div>
        <button
          type = "button"
          className="reset-button"
          onClick={()=>this.reset()}>Reset</button></div>
        <div className="tile-grid">
          <table className="table-grid">
            <tbody>
              <tr>
                <td>{this.renderSquare(0)}</td>
                <td>{this.renderSquare(1)}</td>
                <td>{this.renderSquare(2)}</td>
                <td>{this.renderSquare(3)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(4)}</td>
                <td>{this.renderSquare(5)}</td>
                <td>{this.renderSquare(6)}</td>
                <td>{this.renderSquare(7)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(8)}</td>
                <td>{this.renderSquare(9)}</td>
                <td>{this.renderSquare(10)}</td>
                <td>{this.renderSquare(11)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(12)}</td>
                <td>{this.renderSquare(13)}</td>
                <td>{this.renderSquare(14)}</td>
                <td>{this.renderSquare(15)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
