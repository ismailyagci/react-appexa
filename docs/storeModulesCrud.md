### CRUD Sınıfı ile Verimli CRUD İşlemleri

`react-appexa`'nın `CRUD` sınıfı, CRUD işlemleri için gerekli sabitleri, eylemleri ve durum yöneticilerini otomatik olarak oluşturarak, geliştirme sürecini basitleştirir ve hızlandırır.

#### Example Class Declarartion

`Products` classı, `store.CRUD`'dan türetilmiş ve CRUD işlemleri için özelleştirilmiş bir class örneğidir:

```jsx
import { request, store } from "react-appexa";

class Products extends store.CRUD {
  constructor() {
    super({
      items: ["CREATE_PRODUCT"],
    });
  }

  // CRUD işlemlerinin tanımları...
};

export default new Products();
```

Bu sınıf, `items` içinde belirtilen her bir CRUD işlemi için gerekli constantsları, actionları ve reducerların ihtiyaç duyduğu handleAction methodlarını otomatik olarak oluşturur.

#### CRUD İşlemleri ve Otomatikleştirme

##### Constants

Her CRUD işlemi için, örneğin `CREATE_PRODUCT` için, `CRUD` sınıfı aşağıdaki sabitleri otomatik olarak oluşturur:

- `CREATE_PRODUCT_PENDING`
- `CREATE_PRODUCT_SUCCESS`
- `CREATE_PRODUCT_ERROR`
- `CREATE_PRODUCT_RESET`

##### Actions

Her CRUD işlemi için, `CRUD` sınıfı ilgili eylemleri oluşturur. Örneğin `createProduct` için:

- `createProductPending()`
- `createProductSuccess(data)`
- `createProductError(error)`

Bu eylemler, işlemin durumuna göre Redux store'unu güncellemek için kullanılır.

##### handleAction (Reducers)

`CRUD` sınıfı, tanımlanan her işlem için gerekli durum yöneticilerini (reducers) otomatik olarak oluşturur. Bu, her bir CRUD işlemi için ayrı ayrı reducer tanımlama ihtiyacını ortadan kaldırır.

#### Kullanım Örnekleri

`Products` sınıfı içinde tanımlanan metodlar, otomatikleştirilmiş eylemleri ve sabitleri kullanarak CRUD işlemlerini gerçekleştirir. Örneğin, bir ürün oluşturmak için:

```jsx
createProduct = (data) => async (dispatch) => {
  dispatch(this.createProductPending());
  return await request.createProduct(data)
    .then((res) => {
      dispatch(this.createProductSuccess(res));
      return res;
    }).catch((err) => {
      dispatch(this.createProductError(err));
      return err;
    });
};
```

### Sonuç

`CRUD` sınıfı, `react-appexa` paketi içinde CRUD işlemlerini kolaylaştırarak, geliştirme sürecini hızlandırır ve kod tekrarını azaltır. Bu yaklaşım, CRUD işlemleri için gereken constansların, actinoların ve handleActinların tanımlanmasını ve kullanılmasını otomatikleştirir, böylece geliştiricilerin iş yükünü hafifletir.