const createTree = (array, parentId = "") => {
    const newArray = [];

    for (const item of array) {
        if (item.parent_id === parentId) {
            const children = createTree(array, item.id);
            const newItem = { ...item._doc, children };
            newArray.push(newItem);
        }
    }
    return newArray;
}

module.exports = createTree;