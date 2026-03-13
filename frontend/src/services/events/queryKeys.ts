export const EventsQueryKeys = {
    all: () => ['events'] as const,
    findAll: () => ['events', 'findAll'] as const,
    findActive: () => ['events', 'findActive'] as const,
    findById: (id: string) => ['events', 'find', id] as const,

    create: () => ['events', 'create'] as const,
    update: (id: string) => ['events', 'update', id] as const,
    delete: (id: string) => ['events', 'delete', id] as const,
};
