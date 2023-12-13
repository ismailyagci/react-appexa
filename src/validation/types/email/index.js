const email = (data) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return data
        .match(pattern) !== null;
};
export default email;