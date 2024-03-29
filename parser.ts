import { Token, Lexer, TokenType } from "./lexico";

export class Parser {
  pilha: Array<Token> = [];
  LL: {
    [key in keyof typeof TokenType]?: {
      [key in keyof typeof TokenType]?: number;
    };
  } = {
    PROGRAMA: { IDENTIFICADOR: 2, SE: 2, ENQUANTO: 2, TIPO: 2 },
    PROGRAMAX: {
      IDENTIFICADOR: 3,
      SE: 3,
      SENAO: 4,
      ACABOU: 4,
      ENQUANTO: 3,
      TIPO: 3,
      PONTOVIRGULA: 4
    },
    COMANDO: {
      IDENTIFICADOR: 43,
      SE: 44,
      ENQUANTO: 45,
      TIPO: 43
    },
    STMT: { IDENTIFICADOR: 5, TIPO: 6 },
    I: { IDENTIFICADOR: 7 },
    T: { TIPO: 38 },
    X: { SE: 39, ACABOU: 41 },
    XX: { SENAO: 40 },
    E: { ENQUANTO: 42 },
    EXPRESSAO: { IDENTIFICADOR: 8, VALOR: 9, OPA: 9, AP: 10, NEGAÇÃO: 11 },
    ARITIMETICA_LOGICA: {
      PONTOVIRGULA: 12,
      OPA: 12,
      E_OU: 12,
      FP: 12,
      FACA: 12,
      ACABOU: 12
    },
    EXPRESSAO_ARITIMETICA: {
      PONTOVIRGULA: 13,
      OPA: 14,
      E_OU: 13,
      FP: 13,
      FACA: 13,
      ACABOU: 13
    },
    EXPRESSAO_LOGICA: {
      PONTOVIRGULA: 15,
      OPA: 15,
      E_OU: 16,
      FP: 15,
      FACA: 15,
      ACABOU: 15
    },
    VALOR: { PONTOVIRGULA: 20, OPA: 20, OPB: 20, AP: 20 },
    SINAL: { VALOR: 21, OPA: 22 },
    N: { VIRGULA: 24, PONTOVIRGULA: 25, OPA: 25, E_OU: 25, AP: 25 },
    CASA_DECIMAL: { VIRGULA: 27, PONTOVIRGULA: 26, OPA: 26, E_OU: 26, FP: 26 },
    LETRA_OU_NUMERO: {
      IDENTIFICADOR: 29,
      VALOR: 30,
      PONTOVIRGULA: 28,
      OPA: 28,
      E_OU: 28,
      FP: 28,
      IGUAL: 28
    }
  };

  // 2 = PROGRAMA ->[COMANDO][PROGRAMA’]
  // 3 = PROGRAMA' -> [PROGRAMA]
  // 4 = PROGRAMA' -> ε
  // 5 = STMT -> [I]
  // 6 = STMT -> [T]
  // 7 = I -> [IDENTIFICADOR] = [EXPRESSÃO];
  // 8 = EXPRESSÃO -> [IDENTIFICADOR][ARITMÉTICA_LÓGICA]
  // 9 = EXPRESSÃO -> [VALOR][ARITMÉTICA_LÓGICA]
  // 10 = EXPRESSÃ0 -> ([EXPRESSÃO])[ARITMÉTICA_LÓGICA]
  // 11 = EXPRESSÃO -> [NEGAÇÃO] [EXPRESSÃO][ARITMÉTICA_LÓGICA]
  // 12 = ARITMÉTICA_LÓGICA -> [EXPRESSÃO_ARITIMÉTICA'][EXPRESSÃO_LÓGICA']
  // 13 = EXPRESSÃO_ARITIMÉTICA' -> ε
  // 14 = EXPRESSÃO_ARITIMÉTICA' -> [OPA] [EXPRESSÃO][EXPRESSÃO_ARITIMÉTICA']
  // 15 = EXPRESSÃO_LÓGICA' -> ε
  // 16 = EXPRESSÃO_LÓGICA' -> [E_OU] [EXPRESSÃO][EXPRESSÃO_LÓGICA']
  // 38 = T -> [TIPO][IDENTIFICADOR];
  // 39 = X -> SE [EXPRESSÃO_LÓGICA] FACA [PROGRAMA] [X’]
  // 40 = X' -> SENÃO [PROGRAMA] ACABOU
  // 41 = X' -> ACABOU
  // 42 = E -> ENQUANTO [EXPRESSÃO_LÓGICA] FACA [PROGRAMA] ACABOU
  // 43 = COMANDO -> [STMT];
  // 44 = COMANDO -> [X]
  // 45 = COMANDO -> [TE]

  constructor(private lexer: Lexer) {
    this.pilha.push(new Token(TokenType.$), new Token(TokenType.PROGRAMA));
  }

  i = 0;

  parse() {
    let token = this.lexer.nextToken();
    while (this.pilha.length) {
      const topo = this.pilha[this.pilha.length - 1];
      //compara o topo da pilha com o token que chegou
      //caso sejam iguais eu vou para o proximo token, e dou pop na pilha.
      if (token?.type === topo.type) {
        console.log("Símbolos correspondentes", token);
        token = this.lexer.nextToken();
        this.pilha.pop();
        console.log("Pilha", this.pilha);
        //caso não sejam iguais, dou pop na pilha, verifico qual a regra com a ajuda da parser table e vou dando pusho nos tokens q estao
        //naquela produção
      } else {
        const linha = this.LL[topo!.type];
        //verificação se eu possuo uma linha na minha parser table com o tipo do token q esta no topo da pilha.
        if (linha) {
          const producao = token ? linha[token.type] : 4;
          this.pilha.pop();

          switch (producao) {
            // casos nulos
            case 13:
            case 15:
            case 4:
              break;
            case 2: {
              this.pilha.push(new Token(TokenType.PROGRAMAX));
              this.pilha.push(new Token(TokenType.COMANDO));
              break;
            }
            case 3: {
              this.pilha.push(new Token(TokenType.PROGRAMA));
              break;
            }
            case 5: {
              this.pilha.push(new Token(TokenType.I));
              break;
            }
            case 6: {
              this.pilha.push(new Token(TokenType.T));
              break;
            }
            case 7: {
              this.pilha.push(new Token(TokenType.EXPRESSAO));
              this.pilha.push(new Token(TokenType.IGUAL));
              this.pilha.push(new Token(TokenType.IDENTIFICADOR));
              break;
            }
            case 8: {
              this.pilha.push(new Token(TokenType.ARITIMETICA_LOGICA));
              this.pilha.push(new Token(TokenType.IDENTIFICADOR));
              break;
            }
            case 9: {
              this.pilha.push(new Token(TokenType.ARITIMETICA_LOGICA));
              this.pilha.push(new Token(TokenType.VALOR));
              break;
            }
            case 10: {
              // exemplo
              this.pilha.push(
                new Token(TokenType.ARITIMETICA_LOGICA),
                new Token(TokenType.FP),
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.AP)
              );
              break;
            }
            case 11: {
              this.pilha.push(
                new Token(TokenType.ARITIMETICA_LOGICA),
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.NEGAÇÃO)
              );
              break;
            }
            case 12: {
              this.pilha.push(
                new Token(TokenType.EXPRESSAO_LOGICA),
                new Token(TokenType.EXPRESSAO_ARITIMETICA)
              );
              break;
            }
            case 14: {
              this.pilha.push(
                new Token(TokenType.EXPRESSAO_ARITIMETICA),
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.OPA)
              );
              break;
            }

            case 16: {
              this.pilha.push(
                new Token(TokenType.EXPRESSAO_LOGICA),
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.E_OU)
              );
              break;
            }
            case 38: {
              this.pilha.push(
                new Token(TokenType.IDENTIFICADOR),
                new Token(TokenType.TIPO)
              );
              break;
            }
            case 39: {
              this.pilha.push(
                new Token(TokenType.XX),
                new Token(TokenType.PROGRAMA),
                new Token(TokenType.FACA),
                new Token(TokenType.EXPRESSAO_LOGICA),
                new Token(TokenType.SE)
              );
              break;
            }
            case 40: {
              this.pilha.push(
                new Token(TokenType.ACABOU),
                new Token(TokenType.PROGRAMA),
                new Token(TokenType.SENAO)
              );
              break;
            }
            case 41: {
              this.pilha.push(new Token(TokenType.ACABOU));
              break;
            }
            case 42: {
              this.pilha.push(
                new Token(TokenType.ACABOU),
                new Token(TokenType.PROGRAMA),
                new Token(TokenType.FACA),
                new Token(TokenType.EXPRESSAO),
                new Token(TokenType.ENQUANTO)
              );
              break;
            }
            case 43: {
              this.pilha.push(new Token(TokenType.PONTOVIRGULA));
              this.pilha.push(new Token(TokenType.STMT));
              break;
            }
            case 44: {
              this.pilha.push(new Token(TokenType.X));
              break;
            }
            case 45: {
              this.pilha.push(new Token(TokenType.E));
              break;
            }

            default:
              //caso eu não encontre o source é invalido.
              throw Error("Source invalido!");
          }
          //else da verifação do if(linha) lá em cima, se não houver linha na minha parser table, pode ser q meu token no topo seja $
          //então verifico se ele é realmente $, também verifico se o meu token q chegou é do tipo null, pois nesse caso a string acaba
          //e meu programa foi parseado com sucesso.
        } else if (topo.type === TokenType.$ && token === null) {
          console.log("pilha", this.pilha);
          console.log("token", token);
          console.log("Acabou!");
          return;
          //caso contrario a string que recebi é invalida
        } else {
          console.log("pilha", this.pilha);
          console.log("token", token);
          throw Error("Source invalido!");
        }
      }
    }
  }
}
