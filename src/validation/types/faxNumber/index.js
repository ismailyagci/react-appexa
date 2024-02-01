const faxNumber = (data) => {
  const pattern = /^\+?[0-9]+$/;
  return data.match(pattern) !== null;
};
export default faxNumber;
