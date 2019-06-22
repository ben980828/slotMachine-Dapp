import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import slotMachine from "./contracts/slotMachine.json";
import getWeb3 from "./utils/getWeb3";
import button from './img/startBtn.jpg';
import payButton from './img/payBtn.JPG';
import disBtn from './img/disBtn.jpg';
import pray from './img/win.jpg';
import bg from './img/casino.jpg';
//import bp from './img/casino.png';
//import Web3 from 'web3';

import "./App.css";


var sectionStyle = {
  width: " 100% " ,
  height: " 1200px " ,
  backgroundImage: `url(${bg})`, 
  backgroundSize: 'cover',
  backgroundColor: "#1E90FF",
  color: "#FFFFFF", 
  overflow: 'hidden'
};

class App extends Component {
  state = { randomNumber1: 0, randomNumber2: 0, randomNumber3: 0, win : false, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        slotMachine.abi,
          '0x0706Aa034C79c993e4107b5dDe634A7D4B30BBf2',
          {transactionConfirmationBlocks: 1}
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
        //, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  
  payContract(){
    const { accounts, contract , web3} = this.state;
    contract.methods.payContract()
    .send({ from: accounts[0], value : web3.utils.toWei("0.0000000000001", "ether")});
  }
  checkWin(){
    const { accounts, contract , win} = this.state;
    contract.methods.checkWin(accounts[0]).call().then((result) => {
      console.log(result);
      this.setState({win : result});
    }).catch((error) => {
      console.log(error);
    })
    if(win == true){
      contract.methods.payForIt(win, accounts[0]).send({ from: accounts[0] })
      .on("receipt", function(receipt){
        console.log(receipt);
      });
      alert('Thats a win! Get paid, Winner!');
    }
    else{
      alert('You lose! I will be nice to your ether!');
    }
  }
  displayNumber(){
    const { accounts, contract } = this.state;
    contract.methods.displayNumber(accounts[0]).call().then((result) => {
      this.setState({randomNumber1 : result[0]._hex%10});
      this.setState({randomNumber2 : result[1]._hex%10});
      this.setState({randomNumber3 : result[2]._hex%10});
    }).catch((error) => {
      console.log(error);
    })
  }
  start(){
    const { accounts, contract} = this.state;
    contract.methods.start().send({ from: accounts[0] })
    .on("receipt", function(receipt){
      console.log(receipt);
    })
    .on("error", function(error){
      console.log(error);
      alert('Please pay the contract before playing!');
    });
  }
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    return (
      <div className="App" style={sectionStyle}>
        <marquee bgcolor="#1E90FF" behavior="alternate" scrollamount="20">Dapp for slotMachine!! Let's play an easy gamble!</marquee>
        <h1>Good to Go!</h1>
        <p>Your online slot machine is installed and ready.</p>
        <div className="App-payment">
          <h2>Test your luck, charge for a small amount of ether! &darr;</h2>
          <button onClick={() => this.payContract()}><img src={payButton} width="200" height="100" title="Pay to play!"/></button>
        </div>
        <div className="App-slotMachine">
          <h2>Time for playing &darr;</h2>
          <button onClick={() => this.start()}><img src={button} width="400" height="200" title="Let's start playing!"/></button>
        </div>
        <div className="App-winner">
          <h2>Ready for the result? &darr;</h2>
          <button onClick={() => this.displayNumber()}><img src={disBtn} width="200" height="100" title="Getting nervous...plz leave my ether alone!"/></button>
        </div>
        <div>The final result is: {this.state.randomNumber1}, {this.state.randomNumber2}, {this.state.randomNumber3}</div>
        <div className="App-checkandpay">
          <h2>Did you win? &darr;</h2>
          <button onClick={() => this.checkWin()}><img src={pray} width="200" height="100" title="That is the final result!!!"/></button>
        </div>
      </div>
    );
  }
}

export default App;
