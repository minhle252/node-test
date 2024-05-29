exports.getPlaceholderStringForArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid input');
    }

    // if is array, we'll clone the arr 
    // and fill the new array with placeholders
    const placeholders = [...arr];
    return placeholders.fill('?').join(', ').trim();
}


exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key} = ?`).join(', ');

    return {
        columnSet,
        values
    }
}
exports.multipleColumnSearchSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    const keys = Object.keys(object);
    let values = Object.values(object);
    values = values.map((item)=> `%${values}%`)

    columnSet = keys.map(key => `${key} like ?`).join(', ');

    return {
        columnSet,
        values
    }
}
exports.multipleColumnGet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key}`).join(', ');
    countKeys = keys.map(key => `?`).join(', ');

    return {
        columnSet, keys, countKeys, values
    }
}