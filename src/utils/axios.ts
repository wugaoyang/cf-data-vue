import axios from 'axios'

/**
 * 根据运行环境获取基础请求URL
 */
export const getUrl = (): string => {
    const value: string = import.meta.env.VITE_AXIOS_BASE_URL as string
    const domain: string = import.meta.env.VITE_AXIOS_CONTEXT_PATH as string
    let url = value == 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : value;
    if(domain){
        url +=  domain
    }
    console.log(url)
    return url
}

/**
 * 根据运行环境获取基础请求URL的端口
 */
export const getUrlPort = (): string => {
    const url = getUrl()
    return new URL(url).port
}

const apiClient = axios.create({
    baseURL: getUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(function (config) {
    // 在发送请求之前处理
    // 加入loading等操作
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

apiClient.interceptors.response.use(function (response) {
    // 对响应数据做些什么
    return response;
}, function (error) {
    // 对响应错误做些什么
    // 统一处理错误
    if (error.response.status === 401) {
        // 用户未登录，跳转到登录页
    } else if (error.response.status === 403) {
        // 用户无权限访问该资源
    } else {
        // 其他错误
    }
    return Promise.reject(error);
});

export default apiClient;