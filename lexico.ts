export enum TokenType {
  IGUAL = "IGUAL",
  EXCLAMACAO = "EXCLAMACAO",
  OPB = "OPB",
  OPA = "OPA",
  VIRGULA = "VIRGULA",
  PONTOVIRGULA = "PONTOVIRGULA",
  LETRA = "LETRA",
  NUMERO = "NUMERO",
  AP = "AP",
  FP = "FP",
  SE = "SE",
  SENAO = "SENAO",
  FACA = "FACA",
  ENQUANTO = "ENQUANTO",
  ACABOU = "ACABOU",
  // NÃO TERMINAIS
  $ = "$",
  S = "PROGRAMA",
  PROGRAMA = "PROGRAMA",
  PROGRAMAX = "PROGRAMAX",
  COMANDO = "COMANDO",
  STMT = "STMT",
  I = "I",
  T = "T",
  X = "X",
  XX = "XX",
  E = "E",
  IDENTIFICADOR = "IDENTIFICADOR",
  EXPRESSAO = "EXPRESSAO",
  ARITIMETICA_LOGICA = "ARITIMETICA_LOGICA",
  EXPRESSAO_ARITIMETICA = "EXPRESSAO_ARITIMETICA",
  EXPRESSAO_LOGICA = "EXPRESSAO_LOGICA",
  TIPO = "TIPO",
  VALOR = "VALOR",
  SINAL = "SINAL",
  N = "N",
  CASA_DECIMAL = "CASA_DECIMAL",
  LETRA_OU_NUMERO = "LETRA_OU_NUMERO",
  E_OU = "E_OU",
  NEGAÇÃO = "NEGAÇÃO"
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

  //@ts-ignore
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
      case "*":
      case "/": {
        let opa = this.currentChar;
        this.nextChar();
        return new Token(TokenType.OPA, opa);
      }
      case "=":
        this.nextChar();
        return new Token(TokenType.IGUAL);
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

        //@ts-ignore
        if (digits.includes(this.currentChar)) {
          let num = this.currentChar;
          this.nextChar();

          //@ts-ignore
          while (digits.includes(this.currentChar)) {
            num += this.currentChar;
            this.nextChar();
          }

          return new Token(TokenType.VALOR, num);
        }

        const letter = /[a-zA-Z_]/;
        if (letter.test(this.currentChar)) {
          let word = this.currentChar;
          this.nextChar();

          while (this.currentChar && letter.test(this.currentChar)) {
            word += this.currentChar;
            this.nextChar();
          }

          if (word === "INTEIRO" || word === "QUEBRADO" || word === "LOGICO") {
            return new Token(TokenType.TIPO, word);
          }

          if (word === "SE") {
            return new Token(TokenType.SE);
          }

          if (word === "SENAO") {
            return new Token(TokenType.SENAO);
          }

          if (word === "ENQUANTO") {
            return new Token(TokenType.ENQUANTO);
          }

          if (word === "ACABOU") {
            return new Token(TokenType.ACABOU);
          }

          if (word === "FACA") {
            return new Token(TokenType.FACA);
          }

          return new Token(TokenType.IDENTIFICADOR, word);
        }

        if ("&" === this.currentChar || "|" === this.currentChar) {
          let opb = this.currentChar;
          this.nextChar();
          if (opb === this.currentChar) {
            opb += this.currentChar;

            return new Token(TokenType.OPB, opb);
          } else {
            throw Error("Character inesperado");
          }
        }

        if ("+" === this.currentChar || "-" === this.currentChar) {
          let vessel = this.currentChar;
          this.nextChar();

          //@ts-ignore
          if (digits.includes(this.currentChar)) {
            vessel += this.currentChar;
            this.nextChar();

            //@ts-ignore
            while (digits.includes(this.currentChar)) {
              vessel += this.currentChar;
              this.nextChar();
            }

            //@ts-ignore
            if ("," === this.currentChar) {
              vessel += this.currentChar;
              this.nextChar();
            }

            //@ts-ignore
            while (digits.includes(this.currentChar)) {
              vessel += this.currentChar;
              this.nextChar();
            }

            return new Token(TokenType.VALOR, vessel);
          }

          return new Token(TokenType.OPA, vessel);
        }
      }
    }

    throw new Error("character desconhecido");
  }
}
