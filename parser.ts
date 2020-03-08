import { Token, Lexer, TokenType } from "./lexico";

export class Parser {
  currentToken: Token | null;
  constructor(private lexer: Lexer) {
    this.currentToken = lexer.nextToken();
  }

  isNextTokenType(type: TokenType) {
    return this.currentToken !== null && this.currentToken.type === type;
  }

  expectType(type: TokenType) {
    if (this.isNextTokenType(type)) {
      throw new Error(
        "Esperando tipo " + type + ", mas escontrou " + this.currentToken
      );
    }
  }
}
