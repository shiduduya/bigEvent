$(function () {
    var form = layui.form
    var layer = layui.layer
    // 昵称的校验规则
    form.verify({
        nickname: function (value) {
            if (value.length < 0 || value.length > 6) {
                return '昵称长度必须在1-6字符之间'
            }
        }
    })
    // 获取用户的基本信息
    initUserInfo()
    // 获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 重置基本信息
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()
        // 获取用户最新的数据，从新渲染到页面
        initUserInfo()
    })
    // 监听表单的提交事件 更新用户基本信息
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                // 当前页面为iframe页面，父页面为index页面
                window.parent.getUserInfo()
            }
        })
    })
})