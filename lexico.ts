export enum TokenType {
  TIPO = "TIPO",
  IDENTIFICADOR = "IDENTIFICADOR",
  IGUAL = "IGUAL",
  VALOR = "VALOR",
  EXCLAMACAO = "EXCLAMACAO",
  ECOMERCIAL = "ECOMERCIAL",
  ADD = "ADD",
  MUL = "MUL",
  SUB = "SUB",
  BARRA = "BARRA",
  BARRAVERTICAL = "BARRAVERTICAL",
  VIRGULA = "VIRGULA",
  PONTOVIRGULA = "PONTOVIRGULA",
  LETRA = "LETRA",
  NUMERO = "NUMERO",
  AP = "AP",
  FP = "FP",
  SE = "SE",
  NAO = "NAO",
  FACA = "FACA",
  ENQUANTO = "ENQUANTO",
  ACABOU = "ACABOU"
}

export class Token {
  constructor(public type: TokenType, public value?: string) {}

  toString() {
    if (this.value) {
      return `${this.type}(${this.value})`;
    } else {
      return `${this.type}`;
    }
  }
}

export class Lexer {
  pos = 0;
  constructor(private source: string) {}

  get currentChar() {
    return this.source[this.pos];
  }

  nextChar() {
    this.pos++;
  }

  nextToken(): Token | null {
    if (!this.currentChar) return null;

    switch (this.currentChar) {
      case " ":
      case "\n":
      case "\r":
      case "\t":
        this.nextChar();
        return this.nextToken();

      case "+":
        this.nextChar();
        return new Token(TokenType.ADD);
      case "-":
        this.nextChar();
        return new Token(TokenType.SUB);
      case "*":
        this.nextChar();
        return new Token(TokenType.MUL);
      case "/":
        this.nextChar();
        return new Token(TokenType.BARRA);
      case "=":
        this.nextChar();
        return new Token(TokenType.IGUAL);
      case "&":
        this.nextChar();
        return new Token(TokenType.ECOMERCIAL);
      case "|":
        this.nextChar();
        return new Token(TokenType.BARRAVERTICAL);
      case ",":
        this.nextChar();
        return new Token(TokenType.VIRGULA);
      case ";":
        this.nextChar();
        return new Token(TokenType.PONTOVIRGULA);
      case "(":
        this.nextChar();
        return new Token(TokenType.AP);
      case ")":
        this.nextChar();
        return new Token(TokenType.FP);
      case "!":
        this.nextChar();
        return new Token(TokenType.EXCLAMACAO);
      default: {
        const digits = "0123456789";

        if (digits.includes(this.currentChar)) {
          let num = this.currentChar;
          this.nextChar();

          while (digits.includes(this.currentChar)) {
            num += this.currentChar;
            this.nextChar();
          }

          return new Token(TokenType.NUMERO, num);
        }

        const letter = /[a-zA-Z_]/;
        if (letter.test(this.currentChar)) {
          let word = this.currentChar;
          this.nextChar();

          while (letter.test(this.currentChar)) {
            word += this.currentChar;
            this.nextChar();
          }

          if (word === "INTEIRO" || word === "QUEBRADO" || word === "LOGICO") {
            return new Token(TokenType.TIPO, word);
          }

          if (word === "SE") {
            return new Token(TokenType.SE);
          }

          if (word === "NAO") {
            return new Token(TokenType.NAO);
          }

          if (word === "ENQUANTO") {
            return new Token(TokenType.ENQUANTO);
          }

          if (word === "FACA") {
            return new Token(TokenType.FACA);
          }

          if (word === "ACABOU") {
            return new Token(TokenType.ACABOU);
          }

          return new Token(TokenType.IDENTIFICADOR, word);
        }
      }
    }

    throw new Error("character desconhecido");
  }
}
