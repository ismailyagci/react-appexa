const slug = (data) => {
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(data);
};
export default slug;
