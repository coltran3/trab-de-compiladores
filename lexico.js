"use strict";
exports.__esModule = true;
var TokenType;
(function (TokenType) {
    TokenType["TIPO"] = "TIPO";
    TokenType["IDENTIFICADOR"] = "IDENTIFICADOR";
    TokenType["IGUAL"] = "IGUAL";
    TokenType["VALOR"] = "VALOR";
    TokenType["EXCLAMACAO"] = "EXCLAMACAO";
    TokenType["OPB"] = "OPB";
    TokenType["OPA"] = "OPA";
    TokenType["VIRGULA"] = "VIRGULA";
    TokenType["PONTOVIRGULA"] = "PONTOVIRGULA";
    TokenType["LETRA"] = "LETRA";
    TokenType["NUMERO"] = "NUMERO";
    TokenType["AP"] = "AP";
    TokenType["FP"] = "FP";
    TokenType["SE"] = "SE";
    TokenType["NAO"] = "NAO";
    TokenType["FACA"] = "FACA";
    TokenType["ENQUANTO"] = "ENQUANTO";
    TokenType["ACABOU"] = "ACABOU";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var Token = /** @class */ (function () {
    function Token(type, value) {
        this.type = type;
        this.value = value;
    }
    Token.prototype.toString = function () {
        if (this.value) {
            return this.type + "(" + this.value + ")";
        }
        else {
            return "" + this.type;
        }
    };
    return Token;
}());
exports.Token = Token;
var Lexer = /** @class */ (function () {
    function Lexer(source) {
        this.source = source;
        this.pos = 0;
    }
    Object.defineProperty(Lexer.prototype, "currentChar", {
        get: function () {
            return this.source[this.pos];
        },
        enumerable: true,
        configurable: true
    });
    Lexer.prototype.nextChar = function () {
        this.pos++;
    };
    Lexer.prototype.nextToken = function () {
        if (!this.currentChar)
            return null;
        switch (this.currentChar) {
            case " ":
            case "\n":
            case "\r":
            case "\t":
                this.nextChar();
                return this.nextToken();
            case "*":
            case "/":
                this.nextChar();
                return new Token(TokenType.OPA);
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
                var digits = "0123456789";
                //@ts-ignore
                if (digits.includes(this.currentChar)) {
                    var num = this.currentChar;
                    this.nextChar();
                    while (digits.includes(this.currentChar)) {
                        num += this.currentChar;
                        this.nextChar();
                    }
                    return new Token(TokenType.NUMERO, num);
                }
                var letter = /[a-zA-Z_]/;
                if (letter.test(this.currentChar)) {
                    var word = this.currentChar;
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
                    if (word === "ACABOU") {
                        return new Token(TokenType.ACABOU);
                    }
                    if (word === "FACA") {
                        return new Token(TokenType.FACA);
                    }
                    return new Token(TokenType.IDENTIFICADOR, word);
                }
                if ("&" === this.currentChar || "|" === this.currentChar) {
                    var opb = this.currentChar;
                    this.nextChar();
                    if (opb === this.currentChar) {
                        opb += this.currentChar;
                        return new Token(TokenType.OPB, opb);
                    }
                }
                if ("+" === this.currentChar || "-" === this.currentChar) {
                    var vessel = this.currentChar;
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
    };
    return Lexer;
}());
exports.Lexer = Lexer;
