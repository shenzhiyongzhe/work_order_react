
import axios from "axios";
import rawAxios from "axios";

import { BASE_URL } from "../constants";


// 创建实例
const http = axios.create({
    baseURL: BASE_URL, // 👉 替换成你自己的后端地址
    timeout: 12000,
});

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        const isThirdParty = config.url.startsWith('http'); // 判断是否为第三方接口

        if (!isThirdParty) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            if (!(config.data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
http.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 🔐 token 失效，清除并跳转
            localStorage.removeItem('token');
            window.location.href = '/login'; // 可根据你的项目路由修改
        }
        else if (error.response && error.response.status === 403) {
            console.log("axios reject")
            alert(error.response.data.message)
        }
        return Promise.reject(error);
    }
);
// 跳过拦截器的原始 axios

// 专用方法获取 blob
export const fetchBlob = (url) => {
    return rawAxios.get(url, {
        baseURL: BASE_URL,
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
};

// 导出通用方法
export default {
    get: (url, params = {}, config = {}) =>
        http.get(url, { params, ...config }),

    post: (url, data = {}, config = {}) =>
        http.post(url, data, config),
    delete: (url, data = {}, config = {}) =>
        http.delete(url, {
            data, // 对于 DELETE 请求，数据通常放在 data 字段中
            ...config
        }),
    upload: (url, formData, onProgress, config = {}) =>
        http.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(config.headers || {}),
            },
            onUploadProgress: (event) => {
                if (event.lengthComputable && typeof onProgress === 'function') {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    onProgress(percent);
                }
            },
            ...config,
        }),
};


