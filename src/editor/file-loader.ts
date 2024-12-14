export async function loadFile(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = (loadEvent) => {
            resolve(loadEvent.target?.result as string);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsText(file);
    });
}