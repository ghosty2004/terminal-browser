<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import CommandBuilder from "./utils/CommandBuilder";
import loadCommands from "./definitions/commands";

const defaultUsername = "root";
const defaultHostname = "localhost";
const defaultCwd = "~";

const cwd = ref(defaultCwd);
const inputFields = ref<HTMLInputElement[]>([]);

type SystemLog = { type: "system"; message: string };
type UserLog = { type: "user"; cwd: string; input: string };
type Log = SystemLog | UserLog;

const logs = reactive<Log[]>([
    {
        type: "user",
        cwd: cwd.value,
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

// this will ensure that all commands are loaded
loadCommands();

// register print handler
CommandBuilder.registerPrintHandler(printToSystem);

const handleCommandProcess = (input: string) => {
    const lastUserLog = logs[logs.length - 1] as UserLog;
    if (lastUserLog) {
        lastUserLog.cwd = cwd.value;
        lastUserLog.input = input;

        const [commandName, ...args] = input.split(" ");
        const executed = CommandBuilder.executeCommand(commandName, ...args);
        if (!executed) printToSystem(`${commandName}: command not found!`);
    }

    logs.push({
        cwd: cwd.value,
        type: "user",
        input: "",
    }) - 1;

    nextTick(() => {
        const lastInputField = inputFields.value[inputFields.value.length - 1];
        if (!lastInputField) return;
        lastInputField.focus();
    });
};
</script>

<template>
    <div v-for="(log, index) in logs" :key="index">
        <!-- User -->
        <div class="user-log" v-if="log.type === 'user'">
            <p>{{ defaultUsername }}@{{ defaultHostname }}:{{ cwd }}</p>
            <input
                type="text"
                ref="inputFields"
                v-model="(logs[index] as UserLog).input"
                :disabled="index !== logs.length - 1"
                @keydown.enter="
                    handleCommandProcess(
                        ($event.target as HTMLInputElement).value
                    )
                "
            />
        </div>

        <!-- System -->
        <div class="system-log" v-else>
            <p>{{ log.message }}</p>
        </div>
    </div>
</template>

<style scoped>
.user-log {
    display: flex;
    align-items: center;
    gap: 10px;
    color: green;
}

.user-log input {
    background-color: rgb(144, 144, 144);
}

.system-log {
}
</style>
