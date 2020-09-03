// 发送请求之前执行
// options：请求参数对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一拼接情趣的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 统一为有权限的接口设置heades请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 设置访问权限 当请求结束后，判断用户的设置访问权限
    // ajax里面的complete不管成功还是失败都会执行该操作
    options.complete = function (res) {
        // 当用户认证失败后
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空本地token
            localStorage.removeItem('token')
            // 强制跳转到登录界面
            location.href = 'login.html'
        }
    }
})