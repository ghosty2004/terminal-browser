import CommandBuilder from "../../utils/CommandBuilder";
import { DEFAULT_CWD, DEFAULT_HOSTNAME, DEFAULT_USERNAME } from "../defaults";

new CommandBuilder("echo").handle(({ print, args }) => {
    print(args.join(" ").replace(/["']/g, ""));
});

new CommandBuilder("whoami").handle(({ print }) => {
    print(DEFAULT_USERNAME);
});

new CommandBuilder("pwd").handle(({ print }) => {
    print(DEFAULT_CWD);
});

new CommandBuilder("hostname").handle(({ print }) => {
    print(DEFAULT_HOSTNAME);
});
