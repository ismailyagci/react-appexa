import axios from "axios";
import container from "../container";

class RequestManager {
  constructor() {
    this.axios = axios.create({});
    this.headers = {};
    this.config = {};
    this.request = {
      setHeader: this.setHeader,
      getHeader: this.getHeader,
      getRequestConfig: this.getRequestConfig,
    };
    this.createListeners();
    this.createInterceptors();
  }

  getHeader = () => {
    return this.headers;
  };

  getRequestConfig = () => {
    return this.config;
  };

  createInterceptors = () => {
    this.axios.interceptors.request.use(
      (config) => {
        config.baseURL = this.config.baseUrl;
        Object.entries(this.headers).forEach(([key, value]) => {
          config.headers[key] = value;
        });
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  setHeader = (key, value) => {
    this.headers[key] = value;
  };

  isSuccessRequest(response) {
    return response.data.code === 200;
  }

  getMethod = async (requestConfig, params) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .get(
          requestConfig.url,
          { params },
          {
            headers: requestConfig?.headers || {},
          }
        )
        .then((res) => {
          if (this.isSuccessRequest(res)) return resolve(res.data);
          else reject(res);
        })
        .catch(reject);
    });
  };

  postMethod = async (requestConfig, params) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .post(requestConfig.url, params, {
          headers: requestConfig?.headers || {},
        })
        .then((res) => {
          if (this.isSuccessRequest(res)) return resolve(res.data);
          else reject(res);
        })
        .catch(reject);
    });
  };

  generateRequestMethods() {
    const requestKeys = Object.keys(this?.config || {}).filter(
      (key) => key !== "baseUrl"
    );
    const methods = {
      get: this.getMethod,
      post: this.postMethod,
    };
    requestKeys.forEach((requestKey) => {
      const request = this.config[requestKey];
      this.request[requestKey] = (params) =>
        methods[request.type](request, params);
    });
    container.set("requestMethodsCreated", true);
  }

  createListeners = () => {
    container.onChange((key, value) => {
      if (key === "config") {
        this.config = value.request;
        this.generateRequestMethods();
      }
    });
  };
}

export default new RequestManager().request;
