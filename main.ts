import { Lexer } from "./lexico";
import { Parser } from "./parser";

const source =
  "y = +2,2; INTEIRO x; INTEIRO y; x = 0; y = +2,2; ENQUANTO s (1+0) FACA y = y + 10; x = x - 1 ACABOU";

const lexico = new Lexer(source);
// let token = lexico.nextToken();

// while (token) {
//   console.log(token);
//   token = lexico.nextToken();
// }

const sintatico = new Parser(lexico);
sintatico.parse();
