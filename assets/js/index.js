$(function () {
    getUserInfo()

    var layer = layui.layer
    // 点击按钮，实现退出功能
    $('#btnLogOut').on('click', function () {
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地存储里面的token
            localStorage.removeItem('token')
            // 重新跳转到登录界面
            location.href = 'login.html'
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'GET',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取用户头像
            renderAvatar(res.data)
        }

    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 获取昵称或用户名
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 有头像时，将头像的src传送给文档
        $('.layui-nav-img').attr('src', user.user_pic).show()
        // 文字头像隐藏
        $('.text-avatar').hide()
    } else {
        // 没头像时，显示第一个字的大写字母
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}