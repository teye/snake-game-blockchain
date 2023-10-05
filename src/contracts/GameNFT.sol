// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {IAutomataVRFCoordinator} from "@automata-network/contracts/vrf/IAutomataVRFCoordinator.sol";


contract GameNFT is ERC721, ERC721URIStorage, Ownable {
    // for random number generation during minting
    IAutomataVRFCoordinator vrfCoordinator;

    mapping(address => uint256) private _tokenOwners;

    string[] private uriList = [
        "https://lavender-eligible-mosquito-391.mypinata.cloud/ipfs/QmdE4FfLUhXsZd6yUh7HyEDFNQbkzjpY5MgAC7PYTFfvm3/1.json", 
        "https://lavender-eligible-mosquito-391.mypinata.cloud/ipfs/QmdE4FfLUhXsZd6yUh7HyEDFNQbkzjpY5MgAC7PYTFfvm3/2.json", 
        "https://lavender-eligible-mosquito-391.mypinata.cloud/ipfs/QmdE4FfLUhXsZd6yUh7HyEDFNQbkzjpY5MgAC7PYTFfvm3/3.json"
    ];

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(address _vrfCoordinator) ERC721("SnakeGameToken", "SNK") {
        vrfCoordinator = IAutomataVRFCoordinator(_vrfCoordinator);
    }

    // during mint generate a number between 1 to 100
    // to be used with fetching a pre-determined uri list
    // 85% chance to get a common
    // 10% chance to get a uncommon
    // 5% chance to get a rare
    function safeMint() public {
        require(IERC721(this).balanceOf(msg.sender) == 0, "Reached max limit per wallet");
        uint256[] memory randomSeed = vrfCoordinator.getLatestRandomWords(uint32(1));
        uint256 magic = uint (keccak256(abi.encodePacked(msg.sender, block.timestamp, randomSeed[0]))) % 100;

        string memory uri;

        if (magic >= 95) {
            // rare
            uri = uriList[2];
        } else if (magic >= 85 || magic < 95) {
            // uncommon
            uri = uriList[1];
        } else {
            // common
            uri = uriList[0];
        }

        if (bytes(uri).length > 0) {
            // only mint if uri is present
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uri);
            _tokenOwners[msg.sender] = tokenId; 
        }
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getTokenID(address owner) public view returns (uint256) {
        return _tokenOwners[owner];
    }
}