import { baseURL } from "../../dev";
import Axios from "axios";

export function initAxios(store) {
    Axios.defaults.baseURL = baseURL;
    //Axios携带cookie
    Axios.defaults.withCredentials = true;
    //post设定，自动序列化表单的json数据
    Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //如果要把表单数据转化为url格式就去掉注释
    // Axios.defaults.transformRequest = [function (data){
    //     data = qs.stringify(data);
    //     return data;
    // }]
    Axios.interceptors.request.use(
        config => {
            config.params = {
                ...config.params,
                timestamp: Date.now()
            };
            config.headers.Authorization = store.state.token || '';
            return config
        },
        error => Promise.reject(error)
    );
}