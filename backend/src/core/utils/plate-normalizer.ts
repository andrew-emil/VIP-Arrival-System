export function normalizePlate(plateRaw: string): string {
    if (!plateRaw) return '';

    return plateRaw.trim()
        .toUpperCase()
        .replace(/[\s-]/g, '');
}