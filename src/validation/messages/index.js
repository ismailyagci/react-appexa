const typesMessages = {
  password: () => `Şifreniz minimum 5 uzunlukta olmalıdır.`,
  string: (fieldTitle, value) => `${fieldTitle} parametresi string olmalıdır. (${value})`,
  number: (fieldTitle, value) => `${fieldTitle} parametresi number olmalıdır. (${value})`,
  email: () => `Lütfen gerçek bir email girin.`,
  length: (fieldTitle, value, options) => {
    let lengthText = "";
    lengthText += `${options.min ? options.min : 0} ile `;
    lengthText += `${options.max ? options.max : "∞"} arasında olmalıdır.`;
    return `${fieldTitle} parametresinin uzunluğu ${lengthText}`;
  },
  required: (fieldTitle) => `${fieldTitle} alanı gereklidir.`,
  array: (fieldTitle) => `${fieldTitle} parametresi bir dizi olmalıdır.`,
  nestedSlug: (fieldTitle) => `${fieldTitle} parametresi slug formatında olmalıdır.`,
  oneOf: (fieldTitle, options) => `${fieldTitle} parametresi şunlardan biri olmalıdır: ${options.join(', ')}`,
  isObject: (fieldTitle) => `${fieldTitle} parametresi bir obje olmalıdır.`
};

export default typesMessages;