pragma solidity ^0.5.8;

contract slotMachine {


    // private _player;
 
    uint256 public contractBalance;
    uint256 private _userBalance;
    uint256 private _ethLimit = 100000 wei;
    uint256 private _randNonce;
    mapping(address=>bool) players;
    mapping(address=>uint256) number1;
    mapping(address=>uint256) number2;
    mapping(address=>uint256) number3;




    ///-----------event logging-------------///
    event PlayerDeposit(address Contract, address Player, uint256 Amount);


    ///***********Modifiers***********///

    
    //make sure address is Player
    modifier isPlayer() {
        require(players[msg.sender] == true);
        _;
    }

    ///******constructor********///
    constructor() payable public  {
        _randNonce = 1;
        _userBalance = 0;
        contractBalance = address(this).balance;
    }   
    function payContract() public payable returns (uint){//
        
        
        //make sure contract cannot accept more than ether limit
        require((msg.value) <= _ethLimit, "Too much Ether!");
        
        _userBalance += msg.value;
        contractBalance += msg.value;
        //Register player's address
        players[msg.sender] = true;
        
        //log event    
        emit PlayerDeposit(address(this), msg.sender, msg.value);
        return contractBalance;
    }

    
    ///******Start up machine********///
    function start() isPlayer external {//
        //Check whether user bet any ether
        if (_randNonce > 179){
            _randNonce = 0;
        }
        require(_userBalance > 0);

        //generate three output of slot machine
        number1[msg.sender] = uint(keccak256(abi.encodePacked(block.timestamp - 1 , _randNonce)))%10;
        
        _randNonce += 1;
        number2[msg.sender] = uint(keccak256(abi.encodePacked(block.timestamp - 1 , _randNonce)))%10;
        
        _randNonce += 1;
        number3[msg.sender] = uint(keccak256(abi.encodePacked(block.timestamp - 1 , _randNonce)))%10;
        
        _randNonce += 1;
        players[msg.sender] = false;
        _userBalance = 0;
    }
    function checkWin(address payable _tempWinner) public returns (bool){//
        bool win = false;
        if (number1[_tempWinner] == number2[_tempWinner] && number2[_tempWinner] == number3[_tempWinner]){
            win = true;
            uint256 winBalance = 1 ether;
            _tempWinner.transfer(winBalance); 
        }
        else{
            win = false;
            
        }
        return win;
    }
    function payForIt(bool _winStatus, address payable _winner) external {
        if (_winStatus) {
            uint256 winBalance = 1 ether;
            _winner.transfer(winBalance); 
            contractBalance = address(this).balance;
        }
    }
    function displayNumber(address _player) external view returns(uint256, uint256, uint256) {//
        return (number1[_player], number2[_player], number3[_player]);
    }
}