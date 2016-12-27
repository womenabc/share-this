export function camelize(string) {
    return string.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase());
};

export function findByName(array, name) {
    // I would have used
    //    for (const item of array) {
    // but transpilers generate A LOT of code in this specific case.
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (item.name === name) {
            return item;
        }
    }
};

const extend = Object.assign || function(dest, source) {
    if (source && typeof source === "object") {
        for (const prop in source) {
            dest[prop] = source[prop];
        }
    }

    return dest;
};
export { extend };
