// SPDX-License-Identifier: MIT

// 1: Pragma statements
pragma solidity ^0.8.7;

// 2: Import statements
import '@openzeppelin/contracts/access/Ownable.sol';

// 3: Interfaces

// 4: Libraries

// 5: Errors

// 6: Contracts

/// @title Handle storage changes through voting power
/// @author Fabio Bressler
/// @notice Only the owner can change the value of the storage variable (DAO memebers are the owners)
contract Box is Ownable {
    // 6.a: Type declarations
    // 6.b: State variables

    uint256 private value;

    // 6.c: Events

    /// @notice emmited when the value is modified
    event ValueChanged(uint256 indexed newValue);

    // 6.d: Modifiers
    // 6.e: Functions
    // 6.e.1: Constructor
    // 6.e.2: Receive
    // 6.e.3: Fallback
    // 6.e.4: External
    // 6.e.5: Public

    /// @notice Implements a setValue function
    /// @dev Simple example to store a value in the state variable
    /// @param newValue Sets a new value to the storage variable
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // 6.e.6: Internal
    // 6.e.7: Private
    // 6.e.8: View / Pure

    /// @notice Gets the value from the storage variable
    /// @return Returns the value from the storage variable
    function retrieve() public view returns (uint256) {
        return value;
    }
}
