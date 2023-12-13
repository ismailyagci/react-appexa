### `appexa` Paketinde Validation Modülünün Kullanımı

`appexa`'nın `validation` modülü, form verileri ve diğer girdilerin doğrulanması için çeşitli fonksiyonlar sunar. Bu modül, kullanıcı girdilerinin beklenen kriterlere uygun olup olmadığını kontrol etmeyi sağlar.

#### Temel Kullanım

`validation` modülü, belirli alanlar için doğrulama kurallarını tanımlamanıza ve bu kurallara göre girdileri doğrulamanıza olanak tanır.

Örnek kullanım:

```javascript
import { validation } from "react-appexa";

const validationResponse = validation({
  mail: {
    fieldTitle: "Mail",
    type: "email"
  },
  password: {
    fieldTitle: "Password",
    type: "password"
  }
}, { mail, password });
```

Bu örnekte, `mail` ve `password` alanları için doğrulama kuralları tanımlanmış ve bu kurallar kullanıcı girdilerine uygulanmıştır.

#### Password Doğrulama

Şifre alanlarının belirli kriterlere uygun olup olmadığını kontrol eder:

```javascript
password: {
  fieldTitle: "Password",
  type: "password",
  options: { minLength: 5 }
}
```

#### String Doğrulama

Metin alanlarının string tipinde olup olmadığını kontrol eder:

```javascript
string: {
  fieldTitle: "Username",
  type: "string"
}
```

#### Number Doğrulama

Sayısal alanların number tipinde olup olmadığını kontrol eder:

```javascript
number: {
  fieldTitle: "Age",
  type: "number"
}
```

#### Email Doğrulama

Email alanlarının geçerli bir email formatında olup olmadığını kontrol eder:

```javascript
email: {
  fieldTitle: "Email",
  type: "email"
}
```

#### Length Doğrulama

Metin veya diğer alanların belirli bir uzunluk aralığında olup olmadığını kontrol eder:

```javascript
length: {
  fieldTitle: "Username",
  type: "length",
  options: { min: 3, max: 10 }
}
```

#### Required Doğrulama

Bir alanın boş olup olmadığını kontrol eder:

```javascript
required: {
  fieldTitle: "Full Name",
  type: "required"
}
```

#### Array Doğrulama

Bir alanın dizi tipinde olup olmadığını ve belirli kriterleri karşılayıp karşılamadığını kontrol eder:

```javascript
array: {
  fieldTitle: "Tags",
  type: "array"
}
```

#### NestedSlug Doğrulama

Özelleştirilmiş slug formatının doğruluğunu kontrol eder:

```javascript
nestedSlug: {
  fieldTitle: "Category Slug",
  type: "nestedSlug"
}
```

#### OneOf Doğrulama

Bir alanın belirli değerlerden birine sahip olup olmadığını kontrol eder:

```javascript
oneOf: {
  fieldTitle: "Role",
  type: "oneOf",
  options: ["admin", "user", "guest"]
}
```

#### IsObject Doğrulama

Bir alanın obje tipinde olup olmadığını kontrol eder:

```javascript
isObject: {
  fieldTitle: "User Details",
  type: "isObject"
}
```