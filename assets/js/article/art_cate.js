$(function () {
    const form = layui.form
    const layer = layui.layer
    initArtCaseList()

    // 获取文章分类列表
    function initArtCaseList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // 弹出一个添加文章类别的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 通过代理形式为form表单注册事件
    // 因为表单是放在script里面 不能直接注册  body直接在html里面
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                // 获取文章分类列表
                initArtCaseList()
                layer.msg('新增文章分类成功')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)

            }
        })
    })
    // 通过代理方式给修改表单注册点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章类别的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取被点击编辑按钮的data-id属性值
        var id = $(this).attr('data-id')
        // 发起请求，获取对应分类的数据
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function (res) {
                // 快速给表格进行赋值 lay-filter="form-edit"
                form.val('form-edit', res.data)
            }
        })
    })
    // 给编辑表单注册事件
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCaseList()
            }
        })
    })
    // 通过代理形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCaseList()
                }
            })


        });
    })
})