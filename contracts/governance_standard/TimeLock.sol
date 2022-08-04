// We want to wait for a new vote to be "executed"
// i.e. Everyone who holds the governance token has to pay 5 tokens
// Give time to users to "get out" if they don't like a governance update

// SPDX-License-Identifier: MIT

// 1: Pragma statements
pragma solidity ^0.8.7;

// 2: Import statements
import '@openzeppelin/contracts/governance/TimelockController.sol';

// 3: Interfaces

// 4: Libraries

// 5: Errors

// 6: Contracts

/// @title Handle storage changes through voting power
/// @author Fabio Bressler
/// @notice Only the owner can change the value of the storage variable (DAO memebers are the owners)
contract TimeLock is TimelockController {
    // 6.a: Type declarations
    // 6.b: State variables
    // 6.c: Events
    // 6.d: Modifiers
    // 6.e: Functions
    // 6.e.1: Constructor
    constructor(
        uint256 minDelay, // how long you have to wait before executing a new vote
        address[] memory proposers, // list of addresess that can propose
        address[] memory executors // who can execute when a proposal passes
    ) TimelockController(minDelay, proposers, executors) {}
    // 6.e.2: Receive
    // 6.e.3: Fallback
    // 6.e.4: External
    // 6.e.5: Public
    // 6.e.6: Internal
    // 6.e.7: Private
    // 6.e.8: View / Pure
}
