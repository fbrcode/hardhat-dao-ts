// SPDX-License-Identifier: MIT

// 1: Pragma statements
pragma solidity ^0.8.7;

// 2: Import statements
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';

// 3: Interfaces

// 4: Libraries

// 5: Errors

// 6: Contracts

/// @title
/// @author Fabio Bressler
/// @notice
contract GovernanceToken is ERC20Votes {
    // 6.a: Type declarations
    // 6.b: State variables

    // define 1M tokens as available
    uint256 public s_maxSupply = 1000000000000000000000000;

    // 6.c: Events
    // 6.d: Modifiers
    // 6.e: Functions
    // 6.e.1: Constructor
    constructor() ERC20('GovernanceToken', 'GT') ERC20Permit('GovernanceToken') {
        // set the total supply to 1M tokens
        _mint(msg.sender, s_maxSupply);
    }

    // 6.e.2: Receive
    // 6.e.3: Fallback
    // 6.e.4: External
    // 6.e.5: Public
    // 6.e.6: Internal

    /// @notice Overide to make sure we are calling the function from...
    /// @notice ...ERC20Votes and checkpoint is recorded (updated)
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @notice Overide to make sure we are calling the function from...
    /// @notice ...ERC20Votes and checkpoint is recorded (updated)
    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    /// @notice Overide to make sure we are calling the function from...
    /// @notice ...ERC20Votes and checkpoint is recorded (updated)
    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }

    // 6.e.7: Private
    // 6.e.8: View / Pure
}
