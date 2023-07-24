import {Alchemy, Network, Utils} from 'alchemy-sdk';
import {useEffect, useState} from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function formatAddr(full_addr) {
    if (full_addr.length === 42) {
        const left = full_addr.slice(0,8);
        const right = full_addr.slice(36,42);
        return (`${left}...${right}`);
    } else {
        return full_addr || ''
    }
}

function Transactions({ transactions }) {
    return (
        <ul>
            {transactions &&
                transactions.map((tx, i) => {
                    return (
                        <li key={i}>
                            <h4>Hash: {tx.hash}</h4>
                            <div>From: <a title={tx.from}>{formatAddr(tx.from)}</a></div>
                            <div>To: <a title={tx.from}>{formatAddr(tx.to)}</a></div>
                            <div>Amount: {Utils.formatEther(tx.value)} Ether</div>
                        </li>
                    );
                })}
        </ul>
    )
}

function App() {
    const [blockNumber, setBlockNumber] = useState();
    const [transactions, setTransactions] = useState();
    const [gasPrice, setGasPrice] = useState(0);

    useEffect(() => {
        async function getBlockNumber() {
            setBlockNumber(await alchemy.core.getBlockNumber());
        }
        getBlockNumber();
    },[]);

    useEffect(() => {
        async function getBlockTransactions() {
            const block = await alchemy.core.getBlockWithTransactions(blockNumber);
            setTransactions(block.transactions);
        }
        getBlockTransactions()
    }, [blockNumber]);

    useEffect(() => {
        async function getGasPrice() {
            setGasPrice(await alchemy.core.getGasPrice())
        }
        getGasPrice();
    }, [])

    return (
        <div className="App">
            <h1>Ethereum Block Explorer</h1>
            <h2>Latest Block Number: {blockNumber}</h2>
            <h3>Current Estimated Gas Price: {Utils.formatEther(gasPrice)} Ether</h3>
            <h3>Block transactions ({transactions && transactions.length}):</h3>
            <Transactions transactions={transactions}/>
        </div>
    );
}

export default App;
