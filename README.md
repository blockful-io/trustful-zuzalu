# Trustful Zuzalu Villages

## It's time to break the reputation silos. Trustful is coming!

Trustful is a cross-community reputation aggregator based on the concepts of Valocracy and Trust Networks. It’s an open-source software that enables users to import reputation badges from other systems or create new ones, allowing those to be used in multiple communities with little to no need for structural adaptation.

[ZuVillage Georgia](https://zuvillage-georgia.framer.website/wiki) will be the first to test the MVP of Trustful, an advanced reputation aggregator. Trustful aims to foster real connections and deep dialogues, facilitating check-in processes and enabling attestations of the quality of interactions and the convergence of ideas. By integrating Trustful into ZuVillage Georgia, we aim to create an environment where reputation is defined and recognized based on the community's unique values, ensuring that members' contributions and interactions are duly valued.

This first OP version for ZuVillage Georgia will focus on creating new Statement Badges and it will allow organizers and attendants of a Zuzalu pop-up village event to give badges to each other in recognition of their contributions and knowledge. This mobile-first version aims to enable the community to create its first badges, which members will later use to generate Reputation Scores.

![alt text](./docs/Hypercube.png)

## Pre-Requisites

- node.js installed (developed on LTS v18)
- typescript installed (developed on v5.3.3)
- bun or pnpm or yarn or npm installed
- Web3 Wallet installed in your browser

## Installation

### Forkin the repository

Fork this repository by:

1. Clicking in the arrow aside from the `fork`
2. Unmark the option `Copy the main branch only`
3. Click `Create fork`

### Cloning the repository

Open the VsCode or other IDE editor, and enteder the following command in the cmd:

`git clone https://github.com/YourUserName/trustful-zuzalu.git`

### Instaling dependencies

Install all package dependencies by running:

`bun install`
or
`pnpm install`
or
`yarn install`
or
`npm install`

### Configure the `.env.example` file

1. Remove the `.example` from the `.env.example` file name
2. Add your API keys in the `.env` file
3. In case you do not have it, just create one by following the steps on the [WalletConnect dashboard](WalletConnect dashboard)

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = "Project ID needed for WalletConnect v2 here";

### Running the application

First, run the development server:

`bun dev`
or
`pnpm dev`
or
`yarn dev`
or
`npm run dev`

Open http://localhost:3000 with your browser.

<a href="https://twitter.com/@blockful_io" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="@blockful_io" height="30" width="40" /></a>
