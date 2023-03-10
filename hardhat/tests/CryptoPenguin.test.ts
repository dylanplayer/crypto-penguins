import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { CryptoPenguin__factory, CryptoPenguin } from "../typechain-types";

describe("CryptoPenguin", function () {
  let admin: Signer;
  let user: Signer;
  let cryptoPenguin: CryptoPenguin;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    const cryptoPenguinFactory = (await ethers.getContractFactory(
      "CryptoPenguin",
      admin
    )) as CryptoPenguin__factory;
    cryptoPenguin = await cryptoPenguinFactory.deploy("https://crypto-penguins.dylanplayer.xyz/assets/penguins/");
    await cryptoPenguin.deployed();
  });

  it("should allow the admin to set the base URI", async function () {
    const newBaseURI = "https://crypto-penguins.dylanplayer.xyz/penguins/";
    await cryptoPenguin.connect(admin).setBaseURI(newBaseURI);

    expect(await cryptoPenguin.getBaseURI()).to.equal(newBaseURI);
  });

  it("should allow a user to mint a token", async function () {
    await cryptoPenguin.connect(user).mint(await user.getAddress());

    const [tokenId] = await cryptoPenguin.getTokensByOwner(await user.getAddress());
    expect(tokenId).to.equal(1);
  });

  it('should set the token URI correctly when minting a new CryptoPenguin', async function () {
    await cryptoPenguin.connect(user).mint(await user.getAddress());

    const [tokenId] = await cryptoPenguin.getTokensByOwner(await user.getAddress());

    const tokenURI = await cryptoPenguin.tokenURI(tokenId);

    expect(tokenURI).to.equal('https://crypto-penguins.dylanplayer.xyz/assets/penguins/1/metadata.json');
  });

  it("should prevent minting more than the maximum number of tokens", async function () {
    for (let i = 0; i < 1000; i++) {
      await cryptoPenguin.connect(user).mint(await user.getAddress());
    }

    await expect(cryptoPenguin.connect(user).mint(await user.getAddress())).to.be.revertedWith(
      "CryptoPenguin: maximum number of penguins reached"
    );
  });
});
