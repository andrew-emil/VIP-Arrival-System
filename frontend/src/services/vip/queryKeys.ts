export const VipQueryKeys = {
    all: () => ['vip'] as const,

    findAll: () => ['vip', 'findAll'] as const,
    findByPlate: (plate: string) => ['vip', 'findByPlate', plate] as const,

    create: () => ['vip', 'create'] as const,
};
