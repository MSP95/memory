import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default function memory_init(root, channel) {
  ReactDOM.render(<Board channel={channel} />, root);
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.channel = props.channel;
    this.changeHandler = this.changeHandler.bind(this);
    this.state = {
      currentValues:[],
      flag: true,
      score: 0,
      previd: null,
      isPaused: false,
    };
    this.channel.join()
    .receive("ok", this.gotView.bind(this))
    .receive("error", resp => { console.log("Unable to join", resp); });
  }
  gotView(view) {
    console.log("New view", view);
    this.setState(view.game);
  }
  // /////////////////////////////////////////////////////////////////////////
  // Time out logic
  timeoutHandler(view) {
    this.setState(view.game);
    setTimeout(() => {
      this.channel.push("afterto", {
        currentValues: this.state.currentValues,
        previd: this.state.previd,
      }).receive("ok" ,this.gotView.bind(this));
    }, 1000);
  }
  // /////////////////////////////////////////////////////////////////////////
  changeHandler(id, current,flag, score, pauseStat){
    if(pauseStat == false && current==null){
      this.channel.push("update", {
        id:id,
        flag: flag,
        score: score,
        currentValues: this.state.currentValues,
        isPaused: this.state.isPaused,
      }).receive("ok",this.gotView.bind(this))
      .receive("dotimeout",this.timeoutHandler.bind(this));
    }
  }

  reset(){
    this.channel.push("reset", {}).receive("ok",this.gotView.bind(this));
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
        current={this.state.currentValues[props]}
        action = {this.changeHandler}
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
          onClick={()=>this.reset()}>Reset</button>
          </div>
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
function change(props){
  return props.action(props.id,props.current, props.flag,props.score,props.pause);
}
function Square(props){

  let btnClass = classnames({
    'square-tile': true,
    'square-selected': props.current != null,
  });
  return (
    <button id={props.id} className={btnClass} onClick={()=>change(props)}>
      {props.current}
    </button>
  );
}
