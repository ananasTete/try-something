// 错误重试配置
const retryConfig = {
  maxRetries: 3, // 最大重试次数
  retryDelay: 1000, // 重试延迟(ms)
  // 判断是否需要重试的条件
  retryCondition: (error) => {
    // 网络错误、超时、服务器5xx错误时重试
    return (
      axios.isAxiosError(error) &&
      (!error.response ||
        error.response.status >= 500 ||
        error.code === "ECONNABORTED")
    );
  },
};

const instance = axios.create({
  baseurl: process.env.API_BASE_URL, // 从环境变量中获取
  timeout: 5000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 配置 signal
    config.signal = config.signal || new AbortController().signal;

    // 配置 token
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

    // 配置重试次数
    config.retryCount = config.retryCount || retryConfig.maxRetries;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => Promise.resolve(response),
  async (error) => {
    const config = error.config;
    let status = error.response.status;

    // 判断是否需要重试
    if (
        !config || !retryConfig.retryCondition(error) || config.retryCount === 0
    ) {
      if (status === 401) {
        // GoLogin();
      } else if (status === 404) {
        // 跳转到404页面
      } else if (status === 403) {
        // 跳转到无权限页面
      } else if (status === 500) {
        // 跳转到500异常页面
      }
      return Promise.reject(error);
    }

    // 增加重试计数
    config.retryCount--;

    // 创建延迟执行的 Promise
    const delayRetry = new Promise((resolve) => {
      setTimeout(resolve, retryConfig.retryDelay);
    });

    // 等待延迟后重试
    await delayRetry;
    return instance(config);
  }
);

export default instance;
