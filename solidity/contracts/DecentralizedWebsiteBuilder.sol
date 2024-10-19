// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DecentralizedWebsiteBuilder {
    struct Website {
        string name;
        string[][] elements;
        address owner;
    }

    mapping(address => Website[]) private userWebsites;
    mapping(string => Website) private websitesByName;
    uint256 public totalWebsites;

    event WebsiteCreated(address indexed owner, string name);
    event WebsiteUpdated(address indexed owner, string name);

    function createWebsite(string memory _name, string[][] memory _elements) public {
        require(bytes(_name).length > 0, "Website name cannot be empty");
        require(websitesByName[_name].owner == address(0), "Website name already taken");

        Website memory newWebsite = Website({
            name: _name,
            elements: _elements,
            owner: msg.sender
        });

        userWebsites[msg.sender].push(newWebsite);
        websitesByName[_name] = newWebsite;
        totalWebsites++;

        emit WebsiteCreated(msg.sender, _name);
    }

    function updateWebsite(string memory _name, string[][] memory _newElements) public {
        require(websitesByName[_name].owner == msg.sender, "You don't own this website");

        for (uint i = 0; i < userWebsites[msg.sender].length; i++) {
            if (keccak256(bytes(userWebsites[msg.sender][i].name)) == keccak256(bytes(_name))) {
                userWebsites[msg.sender][i].elements = _newElements;
                break;
            }
        }

        websitesByName[_name].elements = _newElements;

        emit WebsiteUpdated(msg.sender, _name);
    }

    function getWebsiteElements(string memory _name) public view returns (string[][] memory) {
        return websitesByName[_name].elements;
    }

    function getWebsiteCount(address _user) public view returns (uint256) {
        return userWebsites[_user].length;
    }

    function getUserWebsites(address _user) public view returns (Website[] memory) {
        return userWebsites[_user];
    }

    function getWebsiteByName(string memory _name) public view returns (Website memory) {
        return websitesByName[_name];
    }

    function getAllWebsites() public view returns (Website[] memory) {
        Website[] memory allWebsites = new Website[](totalWebsites);
        uint256 index = 0;

        for (uint256 i = 0; i < userWebsites[msg.sender].length; i++) {
            for (uint256 j = 0; j < userWebsites[msg.sender][i].elements.length; j++) {
                allWebsites[index] = userWebsites[msg.sender][i];
                index++;
            }
        }

        return allWebsites;
    }
}