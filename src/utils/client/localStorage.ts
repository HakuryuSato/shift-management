export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            return JSON.parse(storedValue) as T;
        }
    } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
    }
    return defaultValue;
}

export function setLocalStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
}
