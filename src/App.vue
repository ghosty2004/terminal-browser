<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from "vue";
import CommandBuilder from "./utils/CommandBuilder";
import loadCommands from "./definitions/commands";
import {
    DEFAULT_USERNAME,
    DEFAULT_HOSTNAME,
    DEFAULT_CWD,
} from "./definitions/defaults";

const inputFields = ref<HTMLInputElement[]>([]);

type SystemLog = { type: "system"; message: string };
type UserLog = { type: "user"; cwd: string; input: string };
type Log = SystemLog | UserLog;

const logs = reactive<Log[]>([
    {
        type: "user",
        cwd: DEFAULT_CWD,
        input: "",
    },
]);

const printToSystem = (msg: string) => {
    logs.push({
        type: "system",
        message: msg,
    });

    nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
};

const forceFocusToLastInput = (clickedTarget: any = null) => {
    const isParagraph = clickedTarget?.tagName?.toLowerCase?.() === "p";
    if (isParagraph) return;

    nextTick(() => {
        const lastInputField = inputFields.value[inputFields.value.length - 1];
        if (!lastInputField) return;
        lastInputField.focus();
    });
};

// this will ensure that all commands are loaded
loadCommands();

// register print handler
CommandBuilder.registerPrintHandler(printToSystem);

const handleCommandProcess = (input: string) => {
    const lastUserLog = logs[logs.length - 1] as UserLog;
    if (lastUserLog) {
        lastUserLog.cwd = DEFAULT_CWD;
        lastUserLog.input = input;

        const [commandName, ...args] = input.split(" ");
        const executed = CommandBuilder.executeCommand(commandName, ...args);
        if (!executed && commandName?.length !== 0)
            printToSystem(`${commandName}: command not found!`);
    }

    logs.push({
        cwd: DEFAULT_CWD,
        type: "user",
        input: "",
    }) - 1;

    forceFocusToLastInput();
};

document.body.addEventListener("click", ({ target }) =>
    forceFocusToLastInput(target)
);

onMounted(forceFocusToLastInput);
</script>

<template>
    <template v-for="(log, index) in logs" :key="index">
        <div class="user-log" v-if="log.type === 'user'">
            <p>
                {{ DEFAULT_USERNAME }}@{{ DEFAULT_HOSTNAME }}:{{ DEFAULT_CWD }}
            </p>
            <input
                type="text"
                ref="inputFields"
                v-model="(logs[index] as UserLog).input"
                :disabled="index !== logs.length - 1"
                spellcheck="false"
                @keydown.enter="
                    handleCommandProcess(
                        ($event.target as HTMLInputElement).value
                    )
                "
            />
        </div>
        <div class="system-log" v-else>
            <p>{{ log.message }}</p>
        </div>
    </template>
</template>

<style>
body {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    background-color: #300b25;
    color: white;
    font-weight: 600;
    overflow: hidden;
}

body,
input {
    font-size: 18px;
    font-family: monospace;
}

.user-log {
    display: flex;
    align-items: center;
    gap: 3px;
    color: green;
}

p {
    padding: 2px;
    margin: 0;
}

.user-log input {
    background-color: transparent;
    color: white;
    border: none;
    outline: none;
}
</style>
