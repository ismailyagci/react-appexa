### Store Modules
`react-appexa` ile Redux Store süreçlerinizi yönetebilirsiniz. Bu noktada uygulamanızın `src` dosyası içerisine `storeModules` adında bir klasör oluşturun ve bu klasöre `index.jsx` ekleyin. Bu dosya, Redux store modüllerinizi bir araya getirecektir:

```jsx
import auth from './auth';

export default {
  auth,
};
```

`storeModules` süreçlerini örneklerle anlayacağız. İlk örneğimiz auth süreçleri olacak. `src/storeModules/auth/index.jsx` dosyanızı aşağıdaki gibi oluşturun:

```jsx
import { request } from 'react-appexa';

class Auth {
  // Auth sınıfı ve yöntemleri...
};

export default new Auth();
```

### Auth Sınıfı Detaylı Kullanımı

`Auth` sınıfı, `react-appexa` paketi ile entegre çalışarak kullanıcı kimlik doğrulama süreçlerini yönetir. Bu bölümde, sınıfın `actions`, `handleAction` metodları ve `state` yapısını adım adım inceleyeceğiz.

#### 1. Actions

`Auth` sınıfı içinde tanımlanan `actions`, Redux store'una gönderilecek actionları temsil eder. Bu actionlar, uygulamanın durumunu güncellemek için kullanılır.

```jsx
// Action Örnekleri
success = (data) => ({
  type: this.constants.LOGIN_SUCCESS,
  data
});

pending = () => ({
  type: this.constants.LOGIN_PENDING
});

error = (data) => ({
  type: this.constants.LOGIN_ERROR,
  data
});

logout = () => ({
  type: this.constants.LOGOUT
});
```

Elbette, `Auth` sınıfında kullanılan `constants` için de bir örnek ekleyerek README dökümanını tamamlayalım. Constants, Redux action tiplerini tanımlar ve bu tipler, uygulamanın farklı durumlarını temsil eder. İşte bu kısım için bir açıklama:

---

#### 2. Constants

`Auth` sınıfında tanımlanan `constants`, Redux action tiplerini belirler. Bu sabitler, uygulamanın farklı durumlarını temsil eder ve `actions` ile `handleAction` metodlarında kullanılır. Aşağıda, `Auth` sınıfı için tanımlanan temel `constants` örnekleri bulunmaktadır:

```jsx
// Constants Örnekleri
get constants() {
  return {
    VERIFY_TOKEN_SUCCESS: "VERIFY_TOKEN_SUCCESS",
    LOGIN_PENDING: "LOGIN_PENDING",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_ERROR: "LOGIN_ERROR",
    LOGOUT: "LOGOUT"
  };
}
```

Bu sabitler, aşağıdaki durumları ifade eder:

- **VERIFY_TOKEN_SUCCESS**: Token doğrulama işlemi başarılı olduğunda kullanılır.
- **LOGIN_PENDING**: Kullanıcı girişi sırasında bekleyen durum için kullanılır.
- **LOGIN_SUCCESS**: Kullanıcı girişi başarılı olduğunda kullanılır.
- **LOGIN_ERROR**: Kullanıcı girişi sırasında bir hata oluştuğunda kullanılır.
- **LOGOUT**: Kullanıcı çıkış işlemi için kullanılır.

Bu sabitler, uygulamanın Redux store'unun nasıl güncelleneceğini belirler ve `actions` ile `handleAction` metodlarında etkin bir şekilde kullanılır.

#### 3. handleAction

`handleAction` metodu, Redux reducer'ları için action handler'larını tanımlar. Bu handler'lar, gelen action türüne göre uygulamanın durumunu günceller.

```jsx
// handleAction Örneği
handleAction() {
  const loginPending = () => ({
    pending: true,
    isLogin: false,
  });

  const loginSuccess = () => ({
    pending: false,
    isLogin: true,
    error: null,
    verifyPending: false
  });

  // Diğer handler'lar...
}
```

Bu handler'lar, `Auth` sınıfındaki ilgili action'ların tetiklenmesiyle çalıştırılır ve store'un durumunu günceller.

#### 4. State

`Auth` sınıfının `state` özelliği, sınıfın başlangıç durumunu tanımlar. Bu durum, kullanıcının giriş yapmış olup olmadığı, işlemlerin bekleyip beklemediği ve varsa hataları içerir.

```jsx
// State Örneği
get state() {
  const tokenData = localStorage.getItem(this.localStorageLoginKey);
  // Token varsa API başlığını ayarla
  if (tokenData) {
    const { token } = JSON.parse(tokenData);
    request.setHeader("x-access-token", token);
  }
  
  return {
    pending: false,
    isLogin: !!tokenData,
    error: null,
    verifyPending: !!tokenData
  };
}
```

#### 5. Kullanım Senaryoları

##### Giriş Yapma

Kullanıcı giriş işlemi için `login` metodunu çağırabilirsiniz. Bu metot, `pending`, `success` veya `error` action'larını tetik

leyerek, kullanıcının giriş durumunu yönetir.

```jsx
// Giriş Yapma Örneği
login = (email, password) => async (dispatch) => {
  dispatch(this.pending());

  try {
    const response = await login(email, password);
    if (response.code === 200) {
      const token = response.data.accessToken;
      request.setHeader("x-access-token", token);
      localStorage.setItem(this.localStorageLoginKey, JSON.stringify({ token }));
      dispatch(this.success());
    } else {
      dispatch(this.error(response.message));
    }
  } catch (error) {
    dispatch(this.error(error.message));
  }
};
```

##### Token Doğrulama

Kullanıcı giriş yaptıktan sonra, uygulamanın her başlatılışında veya belirli aralıklarla `verifyToken` metodunu kullanarak saklanan token'ın geçerliliğini kontrol edebilirsiniz.

```jsx
// Token Doğrulama Örneği
verifyToken = () => (dispatch) => {
  const tokenData = JSON.parse(localStorage.getItem(this.localStorageLoginKey));
  if (!tokenData || !tokenData.token) {
    dispatch(this.logout());
    return;
  }

  verifyToken(tokenData.token).then((response) => {
    if (response.code !== 200) {
      localStorage.removeItem(this.localStorageLoginKey);
      dispatch(this.logout());
    } else {
      dispatch(this.verifyTokenSuccess());
    }
  });
};
```

##### Çıkış Yapma

Kullanıcı çıkış işlemi için `logoutUser` metodunu kullanabilirsiniz. Bu metot, kullanıcı bilgilerini yerel depolamadan kaldırır ve ilgili `logout` action'ını tetikler.

```jsx
// Çıkış Yapma Örneği
logoutUser = () => (dispatch) => {
  localStorage.removeItem(this.localStorageLoginKey);
  request.setHeader("x-access-token", "");
  dispatch(this.logout());
};
```

### Sonuç

Bu adım adım rehber, `Auth` sınıfının `react-appexa` ile entegrasyonunu ve kullanımını açıklar. Giriş yapma, token doğrulama ve çıkış yapma işlemleri için gerekli metodlar ve bu metodların Redux action'larıyla nasıl etkileşime girdiğini detaylıca gösterir. Bu rehberi takip ederek, uygulamanızda güvenli ve etkili bir kullanıcı kimlik doğrulama süreci oluşturabilirsiniz.