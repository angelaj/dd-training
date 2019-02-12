var WEB_Index = function (options) {
    this.init(options);
};
WEB_Index.prototype = {
    init: function (options) {
        this.options = options;
        var that = this;

        //初始化左侧菜单项

        //初始化通知列表

        //初始化任务列表

    },
    menuInit: function(){
        var that = this;
        //先获取系统全部菜单项
        var menuList = that.getMenuList();

        //获取账号

    },
    tableInit: function () {
        var that = this;
        var oTableInit = new Object();
        //初始化Table
        oTableInit.Init = function () {
            $('#tb_funcList').bootstrapTable({
                url: '/csFunc/getCsFuncList',         //请求后台的URL（*）
                method: 'get',                      //请求方式（*）
                toolbar: '#toolbar',                //工具按钮用哪个容器
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,                   //是否显示分页（*）
                sortable: false,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                queryParams: oTableInit.queryParams,//传递参数（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                pageNumber:1,                       //初始化加载第一页，默认第一页
                pageSize: 10,                       //每页的记录行数（*）
                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
                search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                showColumns: true,                  //是否显示所有的列
                showRefresh: true,                  //是否显示刷新按钮
                minimumCountColumns: 2,             //最少允许的列数
                clickToSelect: false,                //是否启用点击选中行
                height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
                showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
                cardView: false,                    //是否显示详细视图
                detailView: true,                   //是否显示父子表
                detailFormatter: function (index, row) {
                    return row.detail;
                },
                rowStyle: function (row, index) {
                    if (row.isEffective == 1) {
                        return {classes: 'success'};
                    } else if (row.isEffective == 0) {
                        return {classes: 'danger'};
                    } else {
                        return {};
                    }
                },
                contentType: "application/x-www-form-urlencoded", //设置成form表单的形式，tomcat内部就会自动将requset payload中的数据部分解析放到request.getParameter()中，之后就可以直接通过@RequestParam映射参数获取
                columns: [{
                    checkbox: true
                }, {
                    field: 'id',
                    title: 'ID'
                }, {
                    field: 'funcName',
                    title: '模块名称'
                    // }, {
                    //     field: 'isEffective',
                    //     title: '是否有效',
                    //     formatter: function (value,row,index) {
                    //         if (value === 1) {
                    //             return "有效";
                    //         } else {
                    //             return "无效";
                    //         }
                    //     }
                }, {
                    field: 'createTime',
                    title: '创建时间',
                    formatter: function (value,row,index) {
                        if (value != null) {

                            return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }
                }, {
                    field: 'updateTime',
                    title: '更新时间',
                    formatter: function (value,row,index) {
                        if (value != null) {
                            return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return "";
                        }
                    }
                }, {
                    title: '操作',
                    formatter: function (value,row,index) {
                        return _.template($("#temp_func_action").html())({
                            id: row.id,
                            funcName: row.funcName,
                            actions: [
                                {color: "btn-primary", name: "修改", value: "page_edit"},
                                {color: "btn-danger", name: "删除", value: "page_delete"}
                            ]
                        });
                    }
                }],
                onLoadSuccess: function (data) {
                    $("#btn_query").removeClass("disabled");

                    that.tableFuncFinish(data);
                },
                onColumnSwitch: function() {
                    that.tableFuncFinish();
                },
                onToggle: function() {
                    that.tableFuncFinish();
                }
            });
        };

        //得到查询的参数
        oTableInit.queryParams = function (params) {
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.limit,   //页面大小
                offset: params.offset,  //页码
                id: $("#search_funcId").val(),
                funcName: $("#search_funcName").val()
            };
            return temp;
        };
        return oTableInit;
    },
    buttonInit: function () {
        var that = this;
        var oInit = new Object();

        oInit.Init = function () {
            //初始化页面上面的按钮事件
            // 搜索
            $("#btn_query").click(function () {
                if (!$(this).hasClass("disabled")) {
                    $("#btn_query").addClass("disabled");
                    $("#tb_funcList").bootstrapTable('refresh');
                }
            });

            // 添加
            $("#btn_add").click(function () {
                that.funcNew();
            });

            // 修改
            $("#btn_edit").click(function () {
                that.funcUpdate();
            });

            // 删除
            $("#delBack").click(function () {
                that.delFunc();
            });
        };

        return oInit;
    },
    tableFuncFinish: function (data) {
        var that = this;

        // 修改
        $("a[data-action=page_edit]").click(function () {
            var funcId = $(this).parent("span").data("id");
            that.funcUpdate(funcId);
        });

        // 删除
        $("a[data-action=page_delete]").click(function () {
            $("#tb_funcList .selected").each(function () {
                $(this).find(".bs-checkbox input").click();
                $(this).find(".bs-checkbox input[type=checkbox]").attr("checked", false);
            });
            $(this).closest("span[data-sign=action_func]").parents("tr").addClass("selected");
            $("#delModal").modal("show");
        });
    },
    tableRefresh: function () {
        $("#tb_funcList").bootstrapTable('refresh');
    },
    funcNew: function () {
        var that = this;
        that.funcDetail.resetForm();

        that.funcDetail.initSelOptions(function () {
            that.funcDetail.setFormData({});
            that.funcDetail.show();
        });
    },
    funcUpdate: function (pageId) {
        this.funcDetail.loadForm(pageId);
    },
    delFunc: function (funcId) {
        var that = this;

        var data = [];

        if (_.isUndefined(funcId)) {
            $("#tb_funcList .selected").each(function () {
                var id = $(this).find("td:eq(2)").html();
                console.log("=========delScreen id is:"+id);
                data.push(id);
            });
        } else {
            data.push(funcId);
        }

        if (data.length === 0) {
            $('#delModal').modal('hide');
            return;
        }

        $.ajax({
            url: "/csFunc/delFunc",
            type: "post",
            data: {"ids": data.join(",")},
            success: function (json) {
                if (json.rsCode === "A00000") {
                    $.gritter.add({
                        title: "提示信息：",
                        text: "删除成功！",
                        time: 2000
                    });
                    that.tableRefresh();
                } else {
                    $.gritter.add({
                        title: "提示信息：",
                        text: "删除失败：" + json.rsMsg,
                        time: 2000
                    });
                }
                $('#delModal').modal('hide');
            }
        });
    }
};