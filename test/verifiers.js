const { expect } = require("chai");
const { ethers } = require("hardhat");
const snarkjs = require("snarkjs");

const puzzle = [
                    ["1", "0", "0", "0", "0", "0", "0", "0", "0"],
                    ["0", "8", "0", "0", "0", "0", "0", "0", "0"],
                    ["0", "0", "6", "0", "0", "0", "0", "0", "0"],
                    ["0", "0", "0", "5", "0", "0", "0", "0", "0"],
                    ["0", "0", "0", "0", "3", "0", "0", "0", "0"],
                    ["0", "0", "0", "0", "0", "1", "0", "0", "0"],
                    ["0", "0", "0", "0", "0", "0", "9", "0", "0"],
                    ["0", "0", "0", "0", "0", "0", "0", "7", "0"],
                    ["0", "0", "0", "0", "0", "0", "0", "0", "5"]
                ];
const correct_solution = [
                    ["0", "7", "4", "2", "8", "5", "3", "9", "6"],
                    ["2", "0", "5", "3", "9", "6", "4", "1", "7"],
                    ["3", "9", "0", "4", "1", "7", "5", "2", "8"],
                    ["4", "1", "7", "0", "2", "8", "6", "3", "9"],
                    ["5", "2", "8", "6", "0", "9", "7", "4", "1"],
                    ["6", "3", "9", "7", "4", "0", "8", "5", "2"],
                    ["7", "4", "1", "8", "5", "2", "0", "6", "3"],
                    ["8", "5", "2", "9", "6", "3", "1", "0", "4"],
                    ["9", "6", "3", "1", "7", "4", "2", "8", "0"]
                ];

async function verifyGroth16(circuit) {

    let Verifier;
    let verifier;

    let wasm = `circuits/build/${circuit}_js/${circuit}.wasm`;
    let zkey = `circuits/build/${circuit}/groth16/circuit_final.zkey`;

    beforeEach(async function () {
        let contractName = "Verifier";
        Verifier = await ethers.getContractFactory(`contracts/${circuit}_groth16_verifier.sol:${contractName}`);
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it(`${circuit} groth16 verification: Should return true for correct proofs`, async function () {
        let proving_time;
        let start = Date.now();
        const { proof, publicSignals } = await snarkjs.groth16.fullProve({puzzle: puzzle, solution: correct_solution}, wasm, zkey);
        proving_time = Date.now() - start;
        console.log(`proving time (circuit: ${circuit}, scheme: groth16): ${proving_time}`);

        const proofA = [proof.pi_a[0], proof.pi_a[1]];
        const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
        const proofC = [proof.pi_c[0], proof.pi_c[1]];
        let estimatedGas = await verifier.estimateGas.verifyProof(proofA,proofB,proofC, publicSignals);
        console.log(`gas used in verification(circuit:${circuit}, scheme:groth16):`, estimatedGas); 
        
        expect(await verifier.verifyProof(proofA,proofB,proofC, publicSignals)).to.be.true;
    });

    it(`${circuit} groth16 verification: Should return false for invalid proof`, async function () {
        const proofA = [0x00, 0x00];
        const proofB = [[0x00,0x00], [0x00,0x00]];
        const proofC = [0x00, 0x00];
        const pi = Array(82).fill(0);
        
        expect(await verifier.verifyProof(proofA,proofB,proofC, pi)).to.be.false;
    });
}
async function verifyPlonk(circuit) {

    let Verifier;
    let verifier;

    let wasm = `circuits/build/${circuit}_js/${circuit}.wasm`;
    let zkey = `circuits/build/${circuit}/plonk/circuit_final.zkey`;

    beforeEach(async function () {
        let contractName = "PlonkVerifier";
        Verifier = await ethers.getContractFactory(`contracts/${circuit}_plonk_verifier.sol:${contractName}`);
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it(`${circuit} plonk verification: Should return true for correct proofs`, async function () {
        let proving_time;
        let start = Date.now();
        const { proof, publicSignals } = await snarkjs.plonk.fullProve({puzzle: puzzle, solution: correct_solution}, wasm, zkey);
        proving_time = Date.now() - start;
        console.log(`proving time (circuit: ${circuit}, scheme: groth16): ${proving_time}`);
        const calldata = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

        const argv = calldata.replace(/["[\]\s]/g, "").split(',');

        const proofInput = argv[0];
        const publicInput = argv.slice(1);
        
        let estimatedGas = await verifier.estimateGas.verifyProof(proofInput, publicInput);
        console.log(`gas used in verification(circuit:${circuit}, scheme:plonk):`, estimatedGas); 
        
        expect(await verifier.verifyProof(proofInput, publicInput)).to.be.true;
    });

    it(`${circuit} groth16 verification: Should return false for invalid proof`, async function () {
        let proof = '0x00';
        let pi = ['0'];
        expect(await verifier.verifyProof(proof, pi)).to.be.false;
    });
}


describe("Verifier Contracts", function () {
    verifyGroth16("sudoku_tricky");
    verifyGroth16("sudoku_naive");
    verifyPlonk("sudoku_tricky");
    verifyPlonk("sudoku_naive");
});