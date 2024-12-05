# zkSudoku

A simple ZKP sudoku verifier is built in this repo, which confirms the player with a correct proof to the zk verifier(finally contracts) should know one right answerto the sudoku exposed(public) with very high probability. 
### Circuits 
Two circuits are introduced in the project: sudoku_naive(genuine with mutual unequality constraints) and sudoku_tricky(with less constraints). There exists more tricky circuit for the sudoku game, but we could already view the difference made by more expressive constraints(less number of constraints but with almost the same security).

View the scripts inside package.json to get more details of the project, or run the command below to view all the tests. 

```shell
//git clone this repo and run the following commands in the directory

yarn install
yarn setup:circom // or install circom yourself
npm run test:Progress
```