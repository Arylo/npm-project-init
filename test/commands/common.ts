export const diffObject = (t, o1: object, o2: object, msg?: string) => {
    const keys1 = Object.keys(o1).sort();
    const keys2 = Object.keys(o2).sort();
    t.is(keys1.length, keys2.length, msg);
    for (const key of keys1) {
        if (typeof o1[key] === "object") {
            diffObject(t, o1[key], o2[key]);
            continue;
        }
        t.is(o1[key], o2[key], msg);
    }
};
