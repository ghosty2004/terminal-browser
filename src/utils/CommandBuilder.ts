type FuncHandler = ({
    print,
    args,
}: {
    print: (str: string) => void;
    args: any[];
}) => void;

export default class CommandBuilder {
    // static
    private static cache: CommandBuilder[] = [];
    private static printHandler: (str: string) => void;

    static registerPrintHandler(f: (str: string) => void) {
        CommandBuilder.printHandler = f;
    }

    static executeCommand(command: string, ...args: any[]) {
        const result = CommandBuilder.cache.find((c) => c._command === command);
        if (!result) return;
        if (!result._handler) return;
        const print = CommandBuilder.printHandler;
        result._handler({ print, args });
        return true;
    }

    // instance
    private _command: string;
    private _handler?: FuncHandler;

    constructor(command: string) {
        this._command = command;
        CommandBuilder.cache.push(this);
    }

    handle(handler: FuncHandler) {
        this._handler = handler;
        return this;
    }
}
