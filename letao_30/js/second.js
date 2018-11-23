$(function() {
  var currentPage = 1;
  var pageSize = 5;

  render();
  //   1.一进入页面就发送ajax请求，通过模板引擎动态渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $("tbody").html(htmlStr);

        // 进行分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, // 版本号
          currentPage: info.page, // 当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          // 给每个页码添加点击事件
          onPageClicked: function(a, c, d, page) {
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  
});
