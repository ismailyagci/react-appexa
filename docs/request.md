### Request

`react-appexa` paketinde, `request` katmanı `appexa.json` dosyası ile yapılandırılır. Bu yapılandırma, API isteklerini merkezi ve düzenli bir şekilde yönetmeyi sağlar.

#### `appexa.json` Yapılandırması

`appexa.json` dosyası, API isteklerinin yapılandırma detaylarını içerir. Bu dosya, API'nin temel URL'sini, her bir API endpoint'i için istek türünü (GET, POST vb.), URL'yi ve gerekirse ek başlıkları belirtir.

Örnek `appexa.json` yapılandırması:

```json
{
  "request": {
    "baseUrl": "https://api.example.com/",
    "createCategory": {
      "type": "post",
      "url": "category/createCategory"
    },
    // Diğer API endpoint yapılandırmaları...
  }
}
```

#### API İsteklerinin Yapılması

`request` katmanı, `appexa.json` içinde tanımlanan endpoint'ler için kolay ve düzenli API istekleri yapılmasını sağlar. `store` modüllerinde, `request` metodları doğrudan bu yapılandırmayı kullanarak API isteklerini gerçekleştirir.

Örnek kullanım:

```javascript
import { request } from 'react-appexa';

class SomeModule {
  fetchData = () => {
    request.getCategories()
      .then(response => {
        // İşlem başarılı
      })
      .catch(error => {
        // Hata yönetimi
      });
  };
}
```

Bu örnekte, `getCategories` metodu `appexa.json` içinde tanımlanan `getCategories` yapılandırmasını kullanır.

#### IntelliSense Entegrasyonu

`react-appexa`'nın Visual Studio Code eklentisi, `appexa.json` yapılandırması için IntelliSense özelliklerini sunar. Bu, geliştirme sürecinde hız ve verimlilik sağlar. Eklenti, `request` metodlarının `appexa.json` içindeki yapılandırmalarla otomatik olarak eşleşmesini sağlar, böylece geliştiriciler doğrudan bu metodları IntelliSense aracılığıyla bulup kullanabilirler.