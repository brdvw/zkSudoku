#!/bin/bash

mkdir -p contracts

bash scripts/compile-circuit.sh groth16 sudoku_naive
bash scripts/compile-circuit.sh plonk sudoku_naive
bash scripts/compile-circuit.sh groth16 sudoku_tricky
bash scripts/compile-circuit.sh plonk sudoku_tricky