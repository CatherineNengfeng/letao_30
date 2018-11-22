$(function() {
  var currentPage = 1;
  var pageSize = 5;

  //   一进入页面就发送 ajax请求,获取数据，再通过模板引擎动态渲染页面

  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("firstTpl", info);
        $("tbody").html(htmlStr);
        // 根据后台返回的数据, 进行分页初始化
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size), //总页数
          onPageClicked: function(a, b, c, page) {
            console.log(page);
            // 根据 page 重新请求数据, 进行渲染页面
            currentPage = page; //更新当前页
            render(); //重新渲染页面
          }
        });
      }
    });
  }

  // 2. 点击添加按钮, 显示添加模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
  });

  // 3. 表单校验功能
  $("#form").bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok", // 校验成功
      invalid: "glyphicon glyphicon-remove", // 校验失败
      validating: "glyphicon glyphicon-refresh" // 校验中
    },
    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });

  // 4. 注册表单校验成功事件, 阻止默认的表单提交, 通过 ajax 提交
  $("#form").on("success.form.bv", function(e) {
    // 阻止默认的提交
    e.preventDefault();
    // 通过 ajax 提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      dataType: "json",
      success: function(info) {
        console.log(info);
        if (info.success) {
          // 添加成功
          //关闭模态框
          $("#addModal").modal("hide");
          // 重新渲染页面, 重新渲染第一页
          currentPage = 1;
          render();

          // 内容和状态都要重置
          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
        }
      }
    });
  });
});
