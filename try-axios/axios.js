const axios = require('axios');

// axios 封装

// 创建一个 axios 实例，用于配置公共 options
const api = axios.create({
    baseURL: process.env.API_BASE_URL,  // 从环境变量中获取
    timeout: 10000,
});

// 在请求拦截器中为每个请求添加 token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 在响应拦截器中为每个请求判断特殊的错误码进行处理
api.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // 处理未授权
                break;
            case 404:
                // 处理未找到
                break;
            case 500:
                // 处理服务器错误
                break;
        }
    }
    return Promise.reject(error.response);
});


// 业务 API 封装
const userApi = {
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data)
};

// 错误处理封装
const useRequest = async (apiCallback) => {
    try {
        const data = await apiCallback();
        return [data, null]
    } catch (error) {
        console.error(error);
        return [null, error];
    }
}

/**
 * 1. 错误处理
 * 2. 自动重试
 * 3. 请求合并，想同请求合并
 * 4. 请求取消
 */