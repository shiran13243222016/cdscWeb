import { Loading, Message } from 'element-ui'
import router from '../router'
import axios from 'axios'
import qs from 'qs'
import P from 'bluebird'
import _ from 'lodash'
import {BASE_URL} from '../config'

// let router = null
// const initRoute = (val) =>{
// 	router = val
// }

const getRequest = (url,data) => {
    let urlData = url;
    urlData += _.isEmpty(data) ? '' : `?${queryParameters(data)}`;
    return request({url: urlData,method:'GET'});
};

const request = (options) => {
    options.headers = options.headers || {};
    options.baseURL =  BASE_URL;
    options.headers['Authorization'] = sessionStorage.getItem("token");

    let isOk = true;
	let loads = Loading.service( { fullcreen: true } );
    return axios(options).then((response) => {
        if (response.status > 400) {
            isOk = false;
        }
        if(response.data.code == 200) {
            if(response.headers.authorization) {
                sessionStorage.setItem("token", response.headers.authorization)
            }
        }else if(response.data.code == 201 || response.data.code == 202) {
            Message({
                message: response.data.message,
                type: 'error'
            });
            router.push('/login')
        }else {
            Message({
                message: response.data.message,
                type: 'error'
            })
        }
        return response;
    }).then((res)=>{
        return isOk ? P.resolve(res) : P.reject(res);
    }).catch((error) => {
		if(error.response && error.response.data.code == 401 && router){
			localStorage.setItem("token","")
			router.push({ path: '/login' })
		}
        return P.reject(_.isString(error) ? new Error(error) : error);
    }).finally(()=>{
		loads.close()
	});
};

const postRequest  = (url, options={}) => {
    return request( {
		url:url,
        data: qs.stringify(options.body),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: options.method || 'POST',
    });
};

const queryParameters = data => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');

const query = (params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    return {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
        filter: JSON.stringify(params.filter),
    };
};

export {
    getRequest,
    postRequest
};
