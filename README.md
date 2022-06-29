# Dexode
EVM Compatible Blockchain Transaction Decoder

Welcome to Dexode's update repo, where I'll be reporting on project progress and uploading the main repo files.

# Background

As a user of many EVM compatible blockchains and DeFi web apps I understand how disorganised and confusing wallet transactions can seem. Users should be able to track and understand transactions, and make sure balances are up to date and accurate. Knowledge of coin and token prices at the time of each transaction ("pricestamps") is also required, and ultimately we may need to calculate profit, loss, and report capital gains and income taxes.

Dexode was built as a tool to help achieve this.

# Core Features

Dexode's key driving factors and features include:

* All blockchain related data is obtained from the clients IP and crunched locally, respecting rate limits. The server acts simply to deliver the web app.
* Your data, like your keys and crypto, is yours and is stored only in your local Dexode app instances memory and on your local hard disk if you decided to export it. Curate your transactions with Dexode and export your data locally. Keep it safe to avoid resyncing later. Load back in at any time.
* Connect via web3 wallet to obtain wallet and chain details.
* Automatically obtain all "pricestamps".
* Automatically compute cumulative balances based on transaction history.
* Automatically download to archive nodes for exact archive node balances.
* Allow to examine and curate transactions where necessary, including updating/correcting for spurious balances (archive node balances render this unnecessary)
* Visualise pricestamps over time.
* Compute profit and loss, and produce capital gains and income tax reports.
* Apply demographic tax reporting rules, e.g. here in the UK we have "Bed and Breakfast" tax rules and so forth.
* Learn about DeFi and what appears on the blockchain as you curate your transactions.
* Data analytics. The world is our oyster here.

You can check out a live video demo [here]. If you would like to help me continue working on Dexode you can:

* Contribute to the Dexode gitcoin.co page here.
* Send donations directly to 0x6556b412c9E8b473E4F26b9F7cC0215e02ABcE4A via BNB Chain, Ethereum, Oasis Emerald, Polygon, Avalanche, Fantom, Moonriver, Heco, Cronos, or Fuse.

Thank you.

# 🚧 Current Work In Progress 🚧

* Debug cumulative balances - make sure user can edit "corrections" cell & debug.
* Start analysing how to compute profit and loss from the list of transactions.
* Automate & debug profit & loss; design UI to display this (probably via a different "view" of the existing table)
* Implement demographic tax calculation rules, e.g. Bed & Breakfast rules, etc, separate for capital gains, income tax.
* Test and debug on many other blockchains.
* Review & improve data visualisation; this may be particularly useful for profit & loss / tax reporting.

[here]:https://www.pshdev.net:3000/56a580ad3befc663da709977ba17447ffa133c85/demo?pw=96142ddf59dd612692f995ce8f483480825148a4

# Completed Work

* UI revamp & File System Access API used for import/export of blockchain curation data and blockchain details.
* Apache eCharts for pricestamp calculation.
* Pricestamp API access and calculation function implemented.
* Settings page created, with blockchain sync details and synchronisation options page.
* Web3 connectivity and connection with SDK.
* Read web app created and preliminary UI in place using Material UI Pro version.
* Core Dexode SDK created, more functionality is added as and when needed.
