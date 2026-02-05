export function logInfo(payload: Record<string, any>) {
    console.log(JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        ...payload,
    }));
}
