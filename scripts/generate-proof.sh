#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <groth16/plonk> <circuit name>"
    exit 1
fi

cd circuits
mkdir -p build

mkdir -p build/$1

# generate witness
node "build/$2_js/generate_witness.js" build/$2_js/$2.wasm input.json build/$2/witness.wtns
        
# generate proof
echo "generating proof [$1 $2]"
start=$SECONDS
snarkjs $1 prove build/$2/$1/circuit_final.zkey build/$2/witness.wtns build/$2/$1/proof.json build/$2/$1/public.json
duration=$(( SECONDS - start))
echo "it takes $duration seconds"

# verify proof
snarkjs $1 verify build/$2/$1/verification_key.json build/$2/$1/public.json build/$2/$1/proof.json

# generate call
snarkjs zkey export soliditycalldata build/$2/$1/public.json build/$2/$1/proof.json > build/$2/$1/call.txt