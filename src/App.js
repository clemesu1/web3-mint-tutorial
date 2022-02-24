import './App.css';
import mintExampleAbi from './mintExampleAbi.json';
import { ethers, BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
const mintExampleAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // CONNECTING APP TO BLOCKCHAIN
  const [accounts, setAccounts] = useState([]);

  async function connectAccounts() {
    // Call Metamask, wait for the accounts, and set the accounts in state.
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }

  // When the page loads, call the connect accounts method.
  useEffect(() => {
    connectAccounts();
  }, [])

  // MINTING
  const [mintAmount, setMintAmount] = useState(1);

  async function handleMint() {
    if (window.ethereum) {
      // use provider (way to connect to blockchain) 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // any time a call requires any exchange of tokens, the transaction must be signed.
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mintExampleAddress,
        mintExampleAbi.abi,
        signer
      );

      try {
        const response = await contract.mint(BigNumber.from(mintAmount));
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  return (
    <div className="App">
      <Box p={3}>

        <Typography>
          This is how you create a mint button
        </Typography>
        {accounts.length && (
          <Box p>
            <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
              <IconButton onClick={() => setMintAmount(mintAmount - 1)}><RemoveCircleIcon /></IconButton>
              <Typography>{mintAmount}</Typography>
              <IconButton onClick={() => setMintAmount(mintAmount + 1)}><AddCircleIcon /></IconButton>
            </Stack>
            <Button variant="contained" onClick={handleMint} sx={{ mt: 2 }}>Mint</Button>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default App;
