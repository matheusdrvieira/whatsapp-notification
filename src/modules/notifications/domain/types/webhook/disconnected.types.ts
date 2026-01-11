export type EventDisconnectedInput = {
    momment: number;
    error: string;
    disconnected: boolean;
    type: string;
    instanceId: string;
};

export type EventSystemErrorInput = {
    message: string;
    stack?: string;
    context?: string;
    details?: unknown;
};
