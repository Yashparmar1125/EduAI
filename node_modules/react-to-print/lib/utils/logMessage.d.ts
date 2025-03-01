interface LogMessagesArgs {
    level?: 'error' | 'warning' | 'debug';
    messages: unknown[];
    suppressErrors?: boolean;
}
export declare function logMessages({ level, messages, suppressErrors }: LogMessagesArgs): void;
export {};
