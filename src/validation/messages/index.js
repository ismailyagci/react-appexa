const typesMessages = {
  password: () => `Şifreniz minimum 5 uzunlukta olmalıdır.`,
  string: (fieldTitle, value) => `${fieldTitle} parametresi string olmalıdır. (${value})`,
  number: (fieldTitle, value) => `${fieldTitle} parametresi number olmalıdır. (${value})`,
  email: () => `Lütfen gerçek bir email girin.`,
  length: (fieldTitle, value, options) => {
    let lengthText = "";
    lengthText = `${lengthText} ${options.min ? options.min : 0} ile `;
    lengthText = `${lengthText} ${options.max ? options.max : "∞"} arasında olmalıdır.`;
    return `${fieldTitle} parametresinin uzunluğu ${lengthText}`;
  },
  required: (fieldTitle, value, options) => {
    return `${fieldTitle} ${options?.isSelection ? "seçilmelidir." : "girilmelidir."}`;
  },
  array: (fieldTitle, value) => `${fieldTitle} parametresi array formatında olmalıdır (${value})`,
  nestedSlug: (fieldTitle, value) => `${fieldTitle} parametresi slug formatında olmalıdır (${value})`,
};

export default typesMessages;