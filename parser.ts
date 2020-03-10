import { Token, Lexer, TokenType } from "./lexico";

export class Parser {
  pilha: Array<Token> = [];
  LL: {
    [key in keyof typeof TokenType]?: {
      [key in keyof typeof TokenType]?: number;
    };
  } = {
    TIPO: { ACABOU: 1 }
  };
  constructor(private lexer: Lexer) {
    this.pilha.push(new Token(TokenType.$), new Token(TokenType.PROGRAMA));
  }

  parse() {
    let token = this.lexer.nextToken();
    if (!token) {
      //acabou
    }
    while (this.pilha.length) {
      const topo = this.pilha[this.pilha.length - 1];
      if (token === topo) {
        console.log("Bateu pivt!", token);
        this.pilha.pop();
      } else {
        console.log("Regra: ");
        const linha = this.LL[topo.type];
        if (linha) {
          const producao = linha[token!.type];
          this.pilha.pop();
          switch (producao) {
            case 10: // exemplo
              this.pilha.push(
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.IGUAL),
                new Token(TokenType.IDENTIFICADOR)
              );
            default:
              throw Error("Produção invalida.");
          }
        }
      }
    }
  }
}
