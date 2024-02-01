const phoneNumber = (data) => {
  const pattern = /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
  return data.match(pattern) !== null;
};

export default phoneNumber;
