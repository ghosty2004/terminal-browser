import CommandBuilder from "../../utils/CommandBuilder";

new CommandBuilder("echo").handle(({ print, args }) => {
    print(args.join(" ").replace(/["']/g, ""));
});
