export function sleep(seconds: number = 5) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
