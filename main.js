"use strict";
exports.__esModule = true;
var opa_1 = require("./opa");
var source = ", INTEIRO x; INTEIRO y; x = 0; y = +2,2; ENQUANTO (x + 0) FACA y = y + 10; x = x - 1 ACABOU";
var lexico = new opa_1.Lexer(source);
while (true) {
    console.log(lexico.nextToken());
}
