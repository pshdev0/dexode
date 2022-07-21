# Dexode
EVM Compatible Blockchain Transaction Decoder

Welcome to Dexode's update repo, where I'll be reporting on project progress and uploading the main Dexode SDK files.

# Background

As a user of many EVM compatible blockchains and DeFi web apps I understand how disorganised and confusing wallet transactions can seem. Ideally users should be able to track and understand transactions, and make sure balances are up to date and accurate. Knowledge of coin and token prices at the transaction timestamp ("pricestamps") is also required. Ultimately we may need to calculate profit, loss, and report capital gains and income taxes.

Dexode drives to build such a tool to achieve this.

# Core Features

Dexode's key features and drivers include:

* All blockchain related data is obtained from the clients IP and crunched locally, respecting rate limits. The server acts simply to deliver the web app.
* Your data, like your keys and crypto, is yours and is stored only in your local Dexode app instances memory and on your local hard disk if you decided to export it. Curate your transactions with Dexode and export your data locally. Keep it safe to avoid resyncing later. Load back in at any time.
* Connect, sync, and curate. Connects via your web3 wallet to obtain wallet and chain details.
* Automatically obtain all "pricestamps".
* Automatically compute cumulative balances based on transaction history.
* Automatically download archive node balances, when connected to an archive node.
* Allow to examine and curate transactions where necessary, including updating/correcting for spurious cumulative balances (archive node balances render this unnecessary)
* Visualise pricestamps over time.
* Compute profit and loss, and produce capital gains and income tax reports.
* Apply demographic tax reporting rules, e.g. "Bed and Breakfast" tax rules and so forth.
* Learn about DeFi and what appears on the blockchain as you curate your transactions.
* Data analytics, trend analysis.

A video demonstrating current progress of the web app client for the Dexode SDK can be viewed [here].

See the GitHub repo Issues for work completed and in progress.

You can find Dexode on Gitcoin.co: https://gitcoin.co/grants/6874/dexode
