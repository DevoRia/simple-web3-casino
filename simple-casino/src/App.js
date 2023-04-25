import React, { useEffect, useState } from "react";
import Web3 from "web3";
import SimpleCasino from "./contracts/SimpleCasino.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";

export function App() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [betAmount, setBetAmount] = useState("");
    const [houseBalance, setHouseBalance] = useState("");
    const [message, setMessage] = useState("");

    const [depositAmount, setDepositAmount] = useState("");
    const [showHouseBalance, setShowHouseBalance] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                const networkId = await web3Instance.eth.net.getId();
                const deployedNetwork = SimpleCasino.networks[networkId];
                const instance = new web3Instance.eth.Contract(SimpleCasino.abi, deployedNetwork.address);

                setWeb3(web3Instance);
                setAccount(accounts[0]);
                setContract(instance);
            } else {
                alert("Please install MetaMask to use this dApp!");
            }
        };

        init();
    }, []);

    const deposit = async () => {
        if (web3 && contract && account) {
            const weiValue = web3.utils.toWei(depositAmount, "ether");
            try {
                await contract.methods.deposit().send({ from: account, value: weiValue });
                setMessage(`Deposited ${depositAmount} ETH to the house balance.`);
                updateHouseBalance();
            } catch (error) {
                console.error("Error:", error);
                setMessage("Error: " + error.message);
            }
        }
    };

    const play = async () => {
        if (web3 && contract && account) {
            const weiValue = web3.utils.toWei(betAmount, "ether");
            try {
                const result = await contract.methods.play().send({ from: account, value: weiValue });
                const win = result.events.Played.returnValues.win;
                setMessage(win ? "You won!" : "You lost.");
                updateHouseBalance();
            } catch (error) {
                console.error("Error:", error);
                setMessage("Error: " + error.message);
            }
        }
    };

    const updateHouseBalance = async () => {
        if (web3 && contract) {
            const balance = await contract.methods.getHouseBalance().call();
            setHouseBalance(web3.utils.fromWei(balance, "ether"));
        }
    };

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col>
                        <h1>Simple Casino</h1>
                        <Card className="neumorphic-card">
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="betAmount">
                                        <Form.Label>Bet Amount (ETH)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={betAmount}
                                            onChange={(e) => setBetAmount(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" onClick={play}>
                                        Play
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        {message && (
                            <Card className="neumorphic-card mt-4">
                                <Card.Body>
                                    <p>{message}</p>
                                </Card.Body>
                            </Card>
                        )}

                        <Card className="neumorphic-card mt-4">
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="depositAmount">
                                        <Form.Label>Donate to Casino🥺 (ETH)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" onClick={deposit}>
                                        Deposit
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="neumorphic-card mt-4">
                            <Card.Body>
                                <p>House Balance: {houseBalance} ETH</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
