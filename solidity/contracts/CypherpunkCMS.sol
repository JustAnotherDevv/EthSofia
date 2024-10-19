// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CypherpunkCMS {
    struct Website {
        uint256 id;
        string title;
        string author;
        string slug;
    }

    Website[] public websites;
    uint256 public nextId = 1;

    event WebsiteCreated(uint256 id, string title, string author, string slug);

    function createWebsite(string memory _title, string memory _author, string memory _slug) public {
        Website memory newWebsite = Website(nextId, _title, _author, _slug);
        websites.push(newWebsite);
        emit WebsiteCreated(nextId, _title, _author, _slug);
        nextId++;
    }

    function getWebsites() public view returns (Website[] memory) {
        return websites;
    }

    function getWebsite(uint256 _id) public view returns (Website memory) {
        require(_id > 0 && _id < nextId, "Invalid website ID");
        return websites[_id - 1];
    }
}