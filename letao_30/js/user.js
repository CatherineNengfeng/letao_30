$(function() {
  var currentPage = 1; //当前页
  var pageSize = 5; //每页条数
  var currentId; // 当前编辑的用户 id
  var isDelete; //修改状态
  render();
  // 1.一进入页面，就要发送ajax请求，获取用户数据，通过模板引擎动态渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        // template( 模板id, 数据对象 )
        var htmlStr = template("userTpl", info);
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

  // 2. 点击启用禁用按钮, 显示模态框(事件委托)
  $("tbody").on("click", ".btn", function() {
    // 显示模态框
    $("#userModal").modal("show");
    // 获取用户 id
    currentId = $(this)
      .parent()
      .data("id");
    // 获取需要修改的状态, 根据按钮的类名来判断具体传什么
    // 禁用按钮 ? 0 : 1;
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });

  // 3. 点击模态框确认按钮, 完成用户的启用禁用

  $("#submitBtn").click(function() {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        if (info.success) {
          //关闭模态框
          $("#userModal").modal("hide");
          //重新渲染页面
          render();
        }
      }
    });
  });
});
