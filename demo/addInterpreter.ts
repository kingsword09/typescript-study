import readline from "node:readline";

enum eTokens {
    NUMBER = 'NUMBER',
    PLUS = 'PLUS',
    EOF = 'EOF'
}

class Token {
    constructor(public type: eTokens, public value: number | string) {
        if(type === "NUMBER") {
            this.value = +value;
        }
    }

    public toString(): string {
        return `Token(${this.type}, ${this.value})`;
    }
}

class Interpreter {
    pos: number = 0;
    current_token: any = null;

    constructor(public text: string) {}

    error(): void {
        throw 'error parsing input';
    }

    get_next_token(): any {
        let text = this.text;

        if (this.pos > text?.length - 1) {
            return new Token(eTokens.EOF, '');
        }

        let current_char = text[this.pos];

        try {
            if (typeof current_char === 'string' && (parseInt(current_char) as unknown as string) == current_char) {
                let token = new Token(eTokens.NUMBER, current_char);
                this.pos++;
                return token;
            }

            if (current_char === '+') {
                let token = new Token(eTokens.PLUS, current_char);
                this.pos++;
                return token;
            }

            this.error();
        } catch(e) {
            this.error();
        }
    }

    eat(tokenType: eTokens): void {
        if (this.current_token?.type === tokenType) {
            this.current_token = this.get_next_token();
        } else {
            this.error();
        }
    }

    expr(): number {
        this.current_token = this.get_next_token();

        let left: Token = this.current_token;
        this.eat(eTokens.NUMBER);

        let op: Token = this.current_token;
        this.eat(eTokens.PLUS);

        let right: Token = this.current_token;
        this.eat(eTokens.NUMBER);

        const result: number = (left?.value as number) + (right?.value as number);

        return result;
    }
}

function calc(rl: readline.Interface) {
    return new Promise((resolve, reject) => {
        try {
            rl.question("calc> ", (text: string) => {
                if(text === "") {
                    return resolve && resolve(true);
                }

                let interpreter: Interpreter = new Interpreter(text);
                let result: number = interpreter.expr();

                console.log(result);
                return resolve && resolve(true);
            });
        } catch(e) {
            return reject && reject();
        }
    });
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while(true) {
        await calc(rl).catch();
    }
}

main();