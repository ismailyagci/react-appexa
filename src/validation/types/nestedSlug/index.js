const nestedSlug = (data) => {
    const regex = /^\/([a-z0-9\-_]+(\/[a-z0-9\-_]+)*)?\/?$/;
    return regex.test(data);
};
export default nestedSlug;