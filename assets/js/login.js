$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 获取要操作的layUI模块
    const form = layui.form
    // 添加弹出层模块
    const layer = layui.layer
    // 添加表单的自定义校验规则
    form.verify({
        // 添加了一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        // value代表表单的值
        repwd: function (value) {
            // [name=password]属性选择器  选中name为password的表单
            const pwd = $('.reg-box [name="password"]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    // 注册用户
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        var data = {
            username: $('#form_reg [name="username"]').val(),
            password: $('#form_reg [name="password"]').val()
        }
        // 发起ajax的post请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击行为
                $('#link_login').click()
            }
        })
    })
    // 表单登录事件
    $('#form_login').submit(function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = 'index.html'
            }
        })
    })
})