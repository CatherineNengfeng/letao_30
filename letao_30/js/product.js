// 1.一进入页面发送ajax请求，通过模板引擎
$(function() {
  var currentPage = 1;
  var pageSize = 3;

  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);
        // 分页插件初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function(a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 渲染页面
            render();
          }
        });
      }
    });
  }

  // 2. 点击添加商品按钮, 显示添加模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");
    //发送ajax，请求二级分类的数据，进行渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  // 3. 给下拉框的 a 添加点击事件 (通过事件委托)
  $(".dropdown-menu").on("click", "a", function() {
    //获取文本，设置给按钮
    var txt = $(this).text();
    $("#dropdownText").text(txt);
    // 获取id, 设置给隐藏域
  });
});
