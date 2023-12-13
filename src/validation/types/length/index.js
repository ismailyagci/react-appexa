const length = (data, options) => {
    if (
        options &&
        typeof options.min !== "undefined" &&
        typeof data !== "undefined" &&
        data.length < options.min
    ) return false;

    if (
        options &&
        typeof options.max !== "undefined" &&
        typeof data !== "undefined" &&
        data.length > options.max
    ) return false;

    return true;
}
export default length;