const phoneNumber = (data) => {
  const pattern = /^\+?([0-9]{1,3})?([ .-]?)(\(?[0-9]{1,4}\)?)([ .-]?)([0-9]{1,4})([ .-]?)([0-9]{1,4})$/;
  return data.match(pattern) !== null;
};
export default phoneNumber;
