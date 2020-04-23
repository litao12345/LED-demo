import axios from 'axios';
/*
* axios请求的五种方式
* 1.get(获取数据)
* 2.post(提交数据)
* 3.put(跟新数据)
* 4.patch(更新数据)
* 5.delete(删除数据)
* */
/*
* 并发请求
* axios.all()  axios.spresd()
* axio.all([aiosx.get(axios1),axios.get(axios2)]).then(axios.spresd(axios1,axios2)=>{})
* */
/*
* axios拦截器
* */
axios.interceptors.request.use(config=>{
    //在发送请求前做些什么
    return config
},err=>{
    //在请求错误的时候做些什么(未到达后端，接口错误或者后端服务器尚未开启)
    return Promise.reject(err)
});
axios.interceptors.response.use(res=>{
    //请求成功
    return res;
},err=>{
    //响应错误(返回状态非200)
    return Promise.reject(err)
})
