# react-appexa

`react-appexa`, Vite ile oluşturulan React projeleri için temel altyapıları ve araçları sağlayan bir npm paketidir. Bu paketi kullanarak, React projenizin kurulum sürecini hızlandırabilir ve geliştirme sürecinizi daha verimli hale getirebilirsiniz.

## Özellikler

- **Hızlı Kurulum**: Vite tabanlı React projeleriniz için hızlı ve kolay kurulum.
- **Özelleştirilebilir Yapı**: Projelerinizin ihtiyaçlarına göre kolayca özelleştirilebilir yapı.
- **Performans Optimizasyonları**: Projelerinizin performansını artırmaya yönelik çeşitli optimizasyonlar.
- **API Yapılandırması**: `appexa.json` ile kolay API yönetimi ve yapılandırması.
- **VSCode IntelliSense Entegrasyonu**: `appexa` VSCode eklentisi ile geliştirilmiş kod tamamlama ve hata ayıklama özellikleri.

## Kurulum

### npm
`react-appexa` paketini npm ile projenize eklemek için aşağıdaki komutu kullanabilirsiniz:

```bash
npm install react-appexa
```

### appexa.json
Kurulumun ardından projenizin root klasöründe `appexa.json` adında bir dosya oluşturun. Bu dosya, API isteklerinin yönetimi için kullanılır ve şu özelliklere sahiptir:

- **API Endpoint Yapılandırması**: Her API işlemi için tür (get, post vb.), URL ve gerekirse ek başlıklar belirlenebilir.
- **Merkezi Yönetim**: Tüm API istekleri tek bir dosyadan yönetilerek, projenin bakımı ve güncellemesi kolaylaşır.
- **Esneklik**: İhtiyaca göre `appexa.json` dosyasında değişiklik yaparak API yapılandırmasını özelleştirebilirsiniz.

Örnek `appexa.json` yapılandırması:

```json
{
  "request": {
    "baseUrl": "https://api.example.com/",
    "createItem": {
      "type": "post",
      "url": "item/createItem"
    },
    // Diğer API endpoint yapılandırmaları...
  }
}
```

### vscode plugin
VSCode IDE'nize [appexa](https://marketplace.visualstudio.com/items?itemName=371digital.appexa) eklentisini kurarak IntelliSense özelliklerini etkinleştirebilirsiniz. Bu eklenti, `appexa.json` dosyasınızla uyumlu şekilde çalışarak, kod yazımınızı ve hata ayıklama süreçlerinizi kolaylaştırır.

## Kullanım

### Provider
`Appexa` provider'ı React uygulamanıza eklemeniz gerekmektedir. Bunun için "src/main.jsx" dosyanıza gidip, aşağıdaki şekilde kurulumunuzu başlatabilirsiniz:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import Appexa from 'react-appexa';
import storeModules from './storeModules';
import appexaConfig from '../appexa.json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Appexa storeModules={storeModules} config={appexaConfig}>
      <Router />
    </Appexa>
  </React.StrictMode>
);
```

### Store Modules
`react-appexa` ile Redux Store süreçlerinizi yönetebilirsiniz. Bu noktada uygulamanızın `src` dosyası içerisine `storeModules` adında bir klasör oluşturun ve bu klasöre `index.jsx` ekleyin. Bu dosya, Redux store modüllerinizi bir araya getirecektir:

```jsx

export default {
};
```

`storeModules` süreçlerini örneklerle anlayacağız. İlk örneğimiz auth süreçleri olacak. Detaylar için [bu](docs/storeModules.md) dökümana bakabilirsiniz. CRUD işlemleri için [bu](docs/storeModulesCrud.md) dökümana bakabilirisinz.


### Request 

Request süreçlerinin yönetimini kolaylaştırmak için oluşturulmuşdur. Detaylar için [bu](docs/request.md) dökümana bakabilirsiniz.

## Lisans

`react-appexa` [MIT Lisansı](LICENSE) altında lisanslanmıştır.