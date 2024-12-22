export const convertQueryParamsToObject = (
    queryParams: string
): Record<string, string> => {
    const query = new URLSearchParams(queryParams);
    const object: Record<string, string> = {};
    for (const [key, value] of query) {
        object[key] = value;
    }
    return object;
}

export const convertObjectToQueryParams = (object?: Record<string, string | number | null | undefined>): string => {
    if (!object || typeof object !== 'object' || Array.isArray(object)) {
        return '';
    }

    const query = new URLSearchParams();
    Object.keys(object).forEach(key => {
        const value = object[key];
        if (typeof value === 'string' || typeof value === 'number') {
            query.append(key, value.toString());
        }
    });

    return query.toString();
}