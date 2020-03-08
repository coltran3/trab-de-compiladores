import { Lexer } from "./lexico";

const source =
  ", INTEIRO x; INTEIRO y; x = 0; y = +2,2; ENQUANTO (x + 0) FACA y = y + 10; x = x - 1 ACABOU";

const lexico = new Lexer(source);

while (true) {
  console.log(lexico.nextToken());
}
