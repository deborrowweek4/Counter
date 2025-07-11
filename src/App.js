import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { encrypt32, decrypt32 } from '@zama.ai/fhevmjs';
import Counter from './components/Counter';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [count, setCount] = useState(null);
  const [account, setAccount] = useState(null);

  // 合约地址（部署后替换）
  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
  const CONTRACT_ABI = [
    // 从 FHECounter.sol 的 ABI 复制
    "function increment(externalEuint32,bytes) external",
    "function decrement(externalEuint32,bytes) external",
    "function getCount() external view returns (externalEuint32)"
  ];

  // 初始化 Web3 提供者
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        // 获取当前账户
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }
    };
    init();
  }, []);

  // 获取并解密计数器值
  const fetchCount = async () => {
    if (contract && signer) {
      const encryptedCount = await contract.getCount();
      const decryptedCount = await decrypt32(encryptedCount, signer);
      setCount(decryptedCount.toString());
    }
  };

  // 增加计数器
  const incrementCount = async (value) => {
    if (contract && signer) {
      const { ciphertext, proof } = await encrypt32(value, await signer.getAddress());
      await contract.increment(ciphertext, proof);
      await fetchCount();
    }
  };

  // 减少计数器
  const decrementCount = async (value) => {
    if (contract && signer) {
      const { ciphertext, proof } = await encrypt32(value, await signer.getAddress());
      await contract.decrement(ciphertext, proof);
      await fetchCount();
    }
  };

  return (
    <div className="App">
      <h1>FHE Counter dApp</h1>
      <p>Connected Account: {account || 'Not connected'}</p>
      <p>Current Count: {count !== null ? count : 'Loading...'}</p>
      <Counter increment={incrementCount} decrement={decrementCount} />
      <button onClick={fetchCount}>Refresh Count</button>
    </div>
  );
}

export default App;
