#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <groth16/plonk> <circuit name>"
    exit 1
fi

cd circuits
mkdir -p build



if [ -f ./powersOfTau28_hez_final_16.ptau ]; then
    echo "powersOfTau28_hez_final_16.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_16.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_16.ptau
fi

echo "Compiling: $2"

mkdir -p build/$2

# compile circuit

circom $2.circom --r1cs --wasm --sym -o build
snarkjs r1cs info build/$2.r1cs

mkdir -p build/$2/$1
# Start a new zkey and make a contribution

snarkjs $1 setup build/$2.r1cs powersOfTau28_hez_final_16.ptau build/$2/$1/circuit_final.zkey #circuit_0000.zkey
if [ $1 == "groth16" ]; then
    mv build/$2/$1/circuit_final.zkey build/$2/$1/circuit_0000.zkey
    snarkjs zkey contribute build/$2/$1/circuit_0000.zkey build/$2/$1/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
fi


snarkjs zkey export verificationkey build/$2/$1/circuit_final.zkey build/$2/$1/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier build/$2/$1/circuit_final.zkey ../contracts/$2_$1_verifier.sol