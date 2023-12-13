const number = (data) => {
    return /^[-+]?\d*\.?\d+$/.test(data);
};
export default number;