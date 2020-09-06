$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())



        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器 
    var q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cate_id: '',//文章匪类的id
        state: ''//文章的发布状态
    }
    initTable()
    initCate()
    // 获取文章列表数据，并打印
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 调用模板引擎分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 渲染到页面
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
        // 为查询残杀对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total //数据总数，从服务端得到
            , limit: q.pagesize//每页显示的条数
            , curr: q.pagenum//起始页
            , limits: [2, 3, 5, 7, 10]
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 点击页码的时候，触发jump函数
            jump: function (obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据    
                q.pagesize = obj.limit
                //首次不执行
                // first为undefined 表示手动触发
                // first为true时，表示系统触发
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 删除
    $('body').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1 && q.pagenum !== 1) {
                        q.pagenum -= 1;
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
    $('body').on('click', '.btn-edit', function () {
        location.href = '/bigEvent/article/art_pub.html'
    })

})