import { inspect } from 'node:util';
import { EventDisconnectedInput, EventSystemErrorInput } from 'src/modules/notifications/domain/types/webhook/disconnected.types';

export const formatEventDisconnected = (input: EventDisconnectedInput) => {
    return {
        embeds: [
            {
                title: '🚨 WhatsApp Instance Disconnected',
                color: 0xff3b3b,
                fields: [
                    {
                        name: '🆔 Instance ID',
                        value: `\`${input.instanceId}\``,
                        inline: false,
                    },
                    {
                        name: '📌 Tipo do Evento',
                        value: `\`${input.type}\``,
                        inline: false,
                    },
                    {
                        name: '🔌 Status',
                        value: `\`${String(input.disconnected)}\``,
                        inline: false,
                    },
                    {
                        name: '⏱️ Momento',
                        value: `\`${new Date(Number(input.momment) * 1000).toLocaleString(
                            'pt-BR',
                            {
                                timeZone: 'America/Sao_Paulo',
                            },
                        )}\``,
                        inline: false,
                    },
                    {
                        name: '❌ Erro',
                        value: `\`\`\`${input.error}\`\`\``,
                        inline: false,
                    },
                ],
                footer: {
                    text: 'whatsapp-notification • system alert',
                },
                timestamp: new Date().toISOString(),
            },
        ],
    };
};

export const formatSystemError = (input: EventSystemErrorInput) => {
    return {
        embeds: [
            {
                title: '❌ Erro no Sistema',
                color: 0xff3b3b,
                fields: [
                    {
                        name: '🧾 Mensagem',
                        value: `\`${input.message}\``,
                        inline: false,
                    },
                    input.context && {
                        name: '📍 Contexto',
                        value: `\`${input.context}\``,
                        inline: false,
                    },
                    input.details && {
                        name: '📦 Detalhes',
                        value: `\`\`\`${inspect(input.details, { depth: 3 })}\`\`\``,
                        inline: false,
                    },
                    input.stack && {
                        name: '🧨 Stack',
                        value: `\`\`\`${input.stack.slice(0, 2500)}\`\`\``,
                        inline: false,
                    },
                ].filter(Boolean),
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'system • error',
                },
            },
        ],
    };
};

