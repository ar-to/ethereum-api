pragma solidity ^0.4.23;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @dev token definition and initial supply to token given to sender address
 * @dev name of token
 * @dev symbol of token
 * @dev decimal is degree this token can be subdivided
 * @dev INITIAL_SUPPLY is initial balance of tokens given to owner address
 */
contract Token is StandardToken, Ownable, MintableToken {
    string public name = "TutorialToken";
    string public symbol = "TT";
    uint public decimals = 2;
    uint public INITIAL_SUPPLY = 120 * (10 ** decimals);
    address public owner;

    constructor() public {
    // function Token() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        owner = msg.sender;
    }

    function addTokenToTotalSupply(uint _value) public onlyOwner returns(bool) {
        require(_value > 0, "Value over 0 required");
        require(msg.sender == owner, "Owner of this contract is required");
        balances[msg.sender] = balances[msg.sender] + _value;
        INITIAL_SUPPLY = INITIAL_SUPPLY + _value;
        return true;
    }

    // enables contract address to accept ether
    function pay() public payable {
    }

    // destroy contract and return ether to owner
    function kill() public onlyOwner {
        if(msg.sender == owner) 
            selfdestruct(owner);
        else
            revert("This address cannot destroy contract");
    }
}