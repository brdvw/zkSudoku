#!/bin/bash

bash scripts/generate-proof.sh groth16 sudoku_naive
bash scripts/generate-proof.sh plonk sudoku_naive
bash scripts/generate-proof.sh groth16 sudoku_tricky
bash scripts/generate-proof.sh plonk sudoku_tricky