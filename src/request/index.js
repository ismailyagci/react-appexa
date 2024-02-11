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

  getMethod = async (requestConfig, params, urlParams) => {
    return await new Promise((resolve, reject) => {
      const url = urlParams
        ? this.templateReplacer(requestConfig.url, urlParams)
        : requestConfig.url;
      this.axios
        .get(
          url,
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
      const url = urlParams
        ? this.templateReplacer(requestConfig.url, urlParams)
        : requestConfig.url;

      this.axios
        .post(url, params, {
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
