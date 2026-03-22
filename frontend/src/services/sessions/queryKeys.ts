export const SessionsQueryKeys = {
    all: () => ['sessions'] as const,
    findAll: () => ['sessions', 'findAll'] as const,
    findArrived: () => ['sessions', 'arrived'] as const,
    findById: (id: string) => ['sessions', 'find', id] as const,
    findByCameraId: (cameraId: string) => ['sessions', 'camera', cameraId] as const,

    confirm: (id: string) => ['sessions', 'confirm', id] as const,
    complete: (id: string) => ['sessions', 'complete', id] as const,
    reject: (id: string) => ['sessions', 'reject', id] as const,
};
