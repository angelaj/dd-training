var Web_ResourceList = function(options) {
	this.init(options);
};
Web_ResourceList.prototype = {
	init: function(options) {
		var that = this;
		//设置初始参数
		that.setOptions(options);

		//初始化资源树
		that.loadResourceTree(0);

		//初始化Button的点击事件
		var oButtonInit = that.buttonInit();
		oButtonInit.Init();

		//初始化查询参数
		that.initQueryParam();

		//初始化表格
		var resourceListTable = that.initResourceListTable();
		//加载表格
		resourceListTable.init();

		//初始化模块
		this.resourceDetail = new Web_resourceDetail({
			resourceTableRefresh: function() {
				that.tableRefresh();
			},
			resourceTreeRefresh: function() {
				that.loadResourceTree();
			}
		});
	},
	setOptions: function(options) {
		this.options = $.extend(this.options, options);
	},
	loadResourceTree: function() {
		var that = this;

		$.ajax({
			url: "/system/resource/getSysResourceTree",
			type: "get",
			dataType: "JSON",
			data: null,
			success: function(json) {
				if(json.rsCode == "A000000") {
					that.showSysResourceTree(json.data);
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "获取系统资源树异常！",
						time: 10000
					});
				}
			}
		});
	},
	showSysResourceTree: function(data) {
		var that = this;

		var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: function(event, treeId, treeNode) {
					$("#se_parentid").val(treeNode.id);
					$("#se_parentname").val(treeNode.name);
					that.tableRefresh();
				}
			}
		};

		var zTreeNodes = [];
		//添加根节点
		var zNode = {};
		zNode.id = 0;
		zNode.name = "根节点";
		zNode.pId = null;
		zNode.open = true;
		zTreeNodes.push(zNode);
		$(data).each(function() {
			var $resource = $(this);
			var zNode = {};
			zNode.id = $resource.attr("id");
			zNode.name = $resource.attr("resourceName");
			zNode.pId = $resource.attr("parentId");
			zNode.open = true;
			zTreeNodes.push(zNode);
		});

		$.fn.zTree.init($("#resource_tree"), setting, zTreeNodes);
	},
	buttonInit: function() {
		var that = this;
		var oInit = new Object();

		//初始化页面上面的按钮事件
		oInit.Init = function() {
			$('#resource_tree_title').click(function() {
				$("#se_parentid").val(null);
				$("#se_parentname").val("根目录");
				that.tableRefresh();
			});

			// 搜索
			$('#btn_search').click(function() {
				if(!$(this).hasClass("disabled")) {
					$('#btn_search').addClass("disabled");
					that.tableRefresh();
				}
			});

			// 添加
			$('#btn_add').off("click.ibcp").on("click.ibcp", function() {
				that.addResource(0, "根节点");
			});
		};

		return oInit;
	},
	initQueryParam: function() {
		var that = this;

		$('#form_search_resource input').val("");
		$('#form_search_resource select').val("");
	},
	getQueryParams: function(params) {
		var sort = "create_time";
		if(params.sort == "createTime") {
			sort = "create_time";
		} else if(params.sort == "updateTime") {
			sort = "update_time";
		}else if(params.sort == "resourceType") {
			sort = "resource_type";
		}else if(params.sort == "parentId") {
			sort = "parent_id";
		}else if(params.sort == "seq") {
			sort = "seq";
		}

		return [{
			name: "limit",
			value: params.limit //页面大小
		}, {
			name: "start",
			value: params.offset //页码
		}, {
			name: "order",
			value: params.order //排序方式
		}, {
			name: "sort",
			value: sort //排序字段
		}, {
			name: "resourceIds",
			value: $("#se_resourceids").val()
		}, {
			name: "resourceName",
			value: $("#se_resourcename").val()
		}, {
			name: "parentId",
			value: $("#se_parentid").val()
		}, {
			name: "resourceType",
			value: $("#se_resource_type").val()
		}];
	},
	initResourceListTable: function() {
		var that = this;
		var oTableInit = new Object();

		//初始化Table
		oTableInit.init = function() {
			$('#table_resourcelist').bootstrapTable({
				url: '/system/resource/getResourceList', //请求后台的URL（*）
				method: 'get', //请求方式（*）
				toolbar: '#toolbar_resourcelist', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				queryParams: function(params) {
					return that.getQueryParams(params);
				}, //传递参数（*）
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				pageNumber: 1, //初始化加载第一页，默认第一页
				pageSize: 10, //每页的记录行数（*）
				pageList: [10, 50, 100, 150], //可供选择的每页的行数（*）
				search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
				strictSearch: true,
				showColumns: true, //是否显示所有的列
				showRefresh: true, //是否显示刷新按钮
				minimumCountColumns: 2, //最少允许的列数
				clickToSelect: false, //是否启用点击选中行
				height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId: "ID", //每一行的唯一标识，一般为主键列
				showToggle: false, //是否显示详细视图和列表视图的切换按钮
				cardView: false, //是否显示详细视图
				detailView: false, //是否显示父子表
				destroy: true,
				silent: true,
				sortable: true, //是否启用排序
				order: "desc",
				sort: "createTime",
				uniqueId: "id", //每一行的唯一标识，一般为主键列
				buttonsAlign: "right", //按钮位置
				Icons: 'glyphicon-export',
				contentType: "resourcelication/x-www-form-urlencoded", //设置成form表单的形式，tomcat内部就会自动将requset payload中的数据部分解析放到request.getParameter()中，之后就可以直接通过@RequestParam映射参数获取
				columns: [{
					checkbox: true
				}, {
					field: 'id',
					title: '资源ID'
				}, {
					field: 'resourceName',
					title: '资源名'
				}, {
					field: 'resourceCode',
					title: '资源码'
				}, {
					field: 'resourceType',
					title: "资源类型",
					sortable: true,
					formatter: function(value, row, index) {
						if(row.resourceType == 0) {
							return '<span class="label label-primary">目录</span>';
						} else if(row.resourceType == 1) {
							return '<span class="label label-info">菜单</span>';
						} else if(row.resourceType == 2) {
							return '<span class="label label-warning">按钮</span>';
						} else {
							return "";
						}
					}
				}, {
					field: 'parentId',
					title: '父分类',
					sortable: true,
					formatter: function(value, row, index) {
						if(row.parentName == "") {
							row.parentName = "根目录";
						}
						return row.parentId + '/' + row.parentName;
					}
				}, {
					field: 'resourceUrl',
					title: '资源地址'
				}, {
					field: 'icon',
					title: '图标',
					formatter: function(value, row, index) {
						return '<i class="fa ' + row.icon + '"></i>';
					}
				}, {
					field: 'seq',
					title: '顺序号',
					sortable: true
				}, {
					field: 'createTime',
					title: '创建时间',
					sortable: true,
					formatter: function(value, row, index) {
						if(value != null) {
							return new Date(value).format("yyyy-MM-dd hh:mm:ss");
						} else {
							return "";
						}
					}
				}, {
					field: 'updateTime',
					title: '更新时间',
					sortable: true,
					formatter: function(value, row, index) {
						if(value != null) {
							return new Date(value).format("yyyy-MM-dd hh:mm:ss");
						} else {
							return "";
						}
					}
				}, {
					title: '操作',
					formatter: function(value, row, index) {
						return _.template($("#temp_resource_action").html())({
							id: row.id,
							resourceName: row.resourceName,
							parentId: row.parentId,
							actions: [{
								color: "btn-primary",
								name: "编辑",
								iconstyle: "fa-edit",
								value: "action_edit_resourcelist"
							}, {
								color: "btn-success",
								name: "添加子资源",
								iconstyle: "fa-plus",
								value: "action_addchild_resourcelist"
							}]
						});
					}
				}],
				onLoadSuccess: function() {
					$("#btn_search").removeClass("disabled");
					that.tableResourceFinish();
				},
				onColumnSwitch: function() {
					that.tableResourceFinish();
				},
				onToggle: function() {
					that.tableResourceFinish();
				}
			});
		};

		return oTableInit;
	},
	tableResourceFinish: function() {
		var that = this;

		// 修改
		$('a[data-action="action_edit_resourcelist"]').click(function() {
			var resourceId = $(this).parent("span").data("id");
			that.editResource(resourceId, );
		});

		// 添加子资源
		$('a[data-action="action_addchild_resourcelist"]').click(function() {
			var resourceId = $(this).parent("span").data("id");
			var resourceName = $(this).parent("span").data("resourcename");
			that.addResource(resourceId, resourceName);
		});
	},
	tableRefresh: function() {
		$("#table_resourcelist").bootstrapTable('refreshOptions', {
			pageNumber: 1
		});
	},
	addResource: function(parentId, parentName) {
		var that = this;
		that.resourceDetail.resetForm(function() {
			that.resourceDetail.setFormData({
				parentId: parentId,
				parentName: parentName
			});
			that.resourceDetail.show();
		});
	},
	editResource: function(resourceId) {
		this.resourceDetail.loadForm(resourceId);
	}
};

var Web_resourceDetail = function(options) {
	this.init(options);
};
Web_resourceDetail.prototype = {
	init: function(options) {
		this.options = options;
		var that = this;

		//返回列表 取消
		$("#resourceSaveBack").click(function() {
			that.hide();
		});

		// 保存
		$("#btn_resource_save").click(function() {
			that.saveResource();
		});
	},
	show: function() {
		$("#div_resource_list").addClass("hide");
		$("#div_resource_detail").removeClass("hide");
	},
	hide: function() {
		var that = this;
		that.options.resourceTableRefresh();
		that.options.resourceTreeRefresh();
		$("#div_resource_list").removeClass("hide");
		$("#div_resource_detail").addClass("hide");
		$('#resourceSaveBackModal').modal('hide');
	},
	resetForm: function(callBack) {
		var that = this;
		$("#form_resource input").val("");
		$("#form_resource select").val("");
		$("#form_resource textarea").val("");

		if($.isFunction(callBack)) {
			callBack();
		}
	},
	loadForm: function(id) {
		var that = this;
		$.ajax({
			url: "/system/resource/getResourceDetail",
			type: "get",
			data: {
				id: id
			},
			dataType: "json",
			asyn: false,
			success: function(json) {
				if(json.rsCode == "A000000") {
					that.resetForm(function() {
						that.setFormData(json.data);
						that.show();
					});

				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "获取详情失败：" + json.rsMsg,
						time: 10000
					});
				}
			}
		});
	},
	getFormData: function() {
		var that = this;
		var data = {};
		$("#form_resource input").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_resource select").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_resource textarea").each(function(index) {
			data[this.name] = $(this).val();
		});

		return data;
	},
	setFormData: function(data) {
		var that = this;
		if(data.parentName == "") {
			data.parentName = "根目录";
		}

		$.each(data, function(key, value) {
			$("#form_resource input[name=" + key + "]").val(value);
			$("#form_resource select[name=" + key + "]").val(value);
			$("#form_resource textarea[name=" + key + "]").val(value);
		});
	},
	checkFormData: function(data) {
		var result = [];

		if(_.isEmpty(data.resourceName)) {
			result.push("请输入资源名！");
		}

		return result;
	},
	saveResource: function() {
		var that = this;
		var data = that.getFormData();
		var checkResult = that.checkFormData(data);
		if(checkResult.length > 0) {
			$.gritter.add({
				title: "提示信息：",
				text: checkResult.join("</br>"),
				time: 2000
			});
			return;
		}

		$("#btn_resource_save").attr("disabled", true);
		$.ajax({
			url: "/system/resource/saveResource",
			type: "post",
			data: data,
			dataType: "json",
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "保存资源成功！",
						time: 2000
					});
					that.hide();
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "保存资源失败：" + json.rsMsg,
						time: 10000
					});
				}
			}
		});
		$("#btn_resource_save").attr("disabled", false);
	}
};