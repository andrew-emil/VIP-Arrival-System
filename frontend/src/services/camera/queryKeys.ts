export const CameraQueryKeys = {
    all: () => ['camera'] as const,

    findAll: () => ['camera', 'findAll'] as const,
    findById: (id: string) => ['camera', 'find', id] as const,
    health: () => ['camera', 'health'] as const,

    create: () => ['camera', 'create'] as const,
    update: (id: string) => ['camera', 'update', id] as const,
    delete: (id: string) => ['camera', 'delete', id] as const,
};