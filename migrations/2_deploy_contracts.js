var slotMachine = artifacts.require("./slotMachine.sol");
module.exports = function(deployer) {
  deployer.deploy(slotMachine);
};
