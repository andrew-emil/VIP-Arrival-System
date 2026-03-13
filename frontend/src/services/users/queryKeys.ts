export const UsersQueryKeys = {
    all: () => ['users'] as const,

    findAll: () => ['users', 'findAll'] as const,
    findById: (id: string) => ['users', 'find', id] as const,

    create: () => ['users', 'create'] as const,
    update: (id: string) => ['users', 'update', id] as const,
    delete: (id: string) => ['users', 'delete', id] as const,

    assignPermissions: (id: string) => ['users', 'permissions', id] as const,
};
