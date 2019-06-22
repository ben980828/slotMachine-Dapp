pragma solidity ^0.5.8;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/slotMachine.sol";
contract TestslotMachine {
    slotMachine sM = slotMachine(DeployedAddresses.slotMachine());
    function testInitialUsingDeployedContract() public {
        Assert.equal(sM.contractBalance(), address(this).balance, "contractBalance should be balance of this block");
        //Assert.equal(sM._ethLimit(), 1000 wei, "_ethLimit should be 1000 wei");
        //Assert.equal(sM._randNonce(), 1, "_randNonce should be 1");
        //Assert.equal(sM._userBalance(), 0, "_randNonce should be 0");
    }

}

