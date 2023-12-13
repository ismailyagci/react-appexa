import length from "../length";

const password = (data) => {
    return length(data, {
        min: 4
    });
};
export default password;