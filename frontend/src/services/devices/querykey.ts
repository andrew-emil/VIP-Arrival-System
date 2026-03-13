export const DevicesQueryKeys = {
    all: () => ['devices'] as const,
    findAll: () => ['devices', 'findAll'] as const,
    findById: (id: string) => ['devices', 'find', id] as const,

    create: () => ['devices', 'create'] as const,
    update: (id: string) => ['devices', 'update', id] as const,
    delete: (id: string) => ['devices', 'delete', id] as const,

    deactivate: (id: string) => ['devices', 'deactivate', id] as const,
    regeneratePassword: (id: string) => ['devices', 'regeneratePassword', id] as const,
};
