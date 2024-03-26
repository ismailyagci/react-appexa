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
        config.baseURL = container.get("isDevelopment")
          ? this.config.devBaseUrl
          : this.config.baseUrl;
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

  replaceParams = (template = "", params = {}) => {
    let replacedTemplate = template;
    const paramsKeys = Object.keys(params);

    for (const index in paramsKeys) {
      const key = paramsKeys[index];
      const regex = new RegExp(`{{${key}}}`, "g"); // Daha spesifik bir regex kullanıldı.
      replacedTemplate = replacedTemplate.replace(regex, params[key]);
    }

    return replacedTemplate;
  };

  templateReplacer = (template, params) => {
    let replacedTemplate = "";

    const splitedTemplate = template.split("}}");
    splitedTemplate.forEach((templatePart, index) => {
      const isLastPart = index + 1 === splitedTemplate.length;

      replacedTemplate += this.replaceParams(
        `${templatePart}${!isLastPart ? "}}" : ""}`,
        params
      );
    });

    return replacedTemplate.trim();
  };

  getUrl = (url, urlParams) => {
    return urlParams ? this.templateReplacer(url, urlParams) : url;
  };

  getMethod = async (requestConfig, params, urlParams) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .get(
          this.getUrl(requestConfig.url, urlParams),
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

  postMethod = async (requestConfig, params, urlParams) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .post(this.getUrl(requestConfig.url, urlParams), params, {
          headers: requestConfig?.headers || {},
        })
        .then((res) => {
          if (this.isSuccessRequest(res)) return resolve(res.data);
          else reject(res);
        })
        .catch(reject);
    });
  };

  patchMethod = async (requestConfig, params, urlParams) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .patch(this.getUrl(requestConfig.url, urlParams), params, {
          headers: requestConfig?.headers || {},
        })
        .then((res) => {
          if (this.isSuccessRequest(res)) return resolve(res.data);
          else reject(res);
        })
        .catch(reject);
    });
  };

  deleteMethod = async (requestConfig, params, urlParams) => {
    return await new Promise((resolve, reject) => {
      this.axios
        .delete(
          this.getUrl(requestConfig.url, urlParams),
          { data: params },
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

  generateRequestMethods() {
    const requestKeys = Object.keys(this?.config || {}).filter(
      (key) => key !== "baseUrl" && key !== "devBaseUrl"
    );
    const methods = {
      get: this.getMethod,
      post: this.postMethod,
      patch: this.patchMethod,
      delete: this.deleteMethod,
    };
    requestKeys.forEach((requestKey) => {
      const request = this.config[requestKey];

      if (!methods[request.type])
        throw new Error(
          `${request.type} does not exist in methods. Only supported get, post, patch, delete`
        );

      this.request[requestKey] = (params, urlParams) =>
        methods[request.type](request, params, urlParams);
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
