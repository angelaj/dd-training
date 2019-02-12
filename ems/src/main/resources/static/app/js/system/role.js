var Web_RoleList = function(options) {
	this.init(options);
};
Web_RoleList.prototype = {
	init: function(options) {
		var that = this;
		//设置初始参数
		that.setOptions(options);

		//初始化查询列表
		that.initQueryParam();

		//初始化Button的点击事件
		var oButtonInit = that.buttonInit();
		oButtonInit.Init();

		//初始化Table
		var roleListTable = that.initRoleListTable();
		//加载表格
		roleListTable.init();

		//初始化模块
		this.roleDetail = new Web_roleDetail({
			roleTableRefresh: function() {
				that.tableRefresh();
			}
		});
	},
	setOptions: function(options) {
		this.options = $.extend(this.options, options);
	},
	initQueryParam: function() {
		var that = this;

		$('#form_search_role input').val("");
		$('#form_search_role select').val("");
	},
	getQueryParams: function(params) {
		var sort = "create_time";
		if(params.sort == "createTime") {
			sort = "create_time";
		} else if(params.sort == "updateTime") {
			sort = "update_time";
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
			name: "roleIds",
			value: $("#se_roleids").val()
		}, {
			name: "roleName",
			value: $("#se_rolename").val()
		}, {
			name: "roleType",
			value: $("#se_roletype").val()
		}];
	},
	initRoleListTable: function() {
		var that = this;
		var oTableInit = new Object();

		//初始化Table
		oTableInit.init = function() {
			$('#table_rolelist').bootstrapTable({
				url: '/system/role/getRoleList', //请求后台的URL（*）
				method: 'get', //请求方式（*）
				toolbar: '#toolbar_rolelist', //工具按钮用哪个容器
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
				contentType: "rolelication/x-www-form-urlencoded", //设置成form表单的形式，tomcat内部就会自动将requset payload中的数据部分解析放到request.getParameter()中，之后就可以直接通过@RequestParam映射参数获取
				columns: [{
					checkbox: true
				}, {
					field: 'id',
					title: '角色ID'
				}, {
					field: 'roleName',
					title: '角色名'
				}, {
					field: 'roleKey',
					title: '角色键'
				}, {
					field: 'roleType',
					title: '角色类型',
					formatter: function(value, row, index) {
						if(row.roleType == 1) {
							return '<span class="label label-success">管理员</span>';
						} else if(row.roleType == 2) {
							return '<span class="label label-danger">操作员</span>';
						} else {
							return '<span class="label">--</span>';
						}
					}
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
						return _.template($("#temp_role_action").html())({
							id: row.id,
							roleName: row.roleName,
							roleType: row.roleType,
							actions: [{
								color: "btn-primary",
								name: "编辑",
								iconstyle: "fa-edit",
								value: "action_edit_rolelist"
							}]
						});
					}
				}],
				onLoadSuccess: function() {
					$("#btn_search").removeClass("disabled");
					that.tableRoleFinish();
				},
				onColumnSwitch: function() {
					that.tableRoleFinish();
				},
				onToggle: function() {
					that.tableRoleFinish();
				}
			});
		};

		return oTableInit;
	},
	buttonInit: function() {
		var that = this;
		var oInit = new Object();

		//初始化页面上面的按钮事件
		oInit.Init = function() {
			// 搜索
			$('#btn_search').click(function() {
				if(!$(this).hasClass("disabled")) {
					$('#btn_search').addClass("disabled");
					$("#table_rolelist").bootstrapTable('refreshOptions', {
						pageNumber: 1
					});
				}
			});

			// 添加
			$('#btn_add').off("click.ibcp").on("click.ibcp", function() {
				that.addRole();
			});
		};

		return oInit;
	},
	tableRoleFinish: function() {
		var that = this;

		// 修改
		$('a[data-action="action_edit_rolelist"]').click(function() {
			var roleId = $(this).parent("span").data("id");
			that.editRole(roleId);
		});
	},
	tableRefresh: function() {
		$("#table_rolelist").bootstrapTable('refreshOptions', {
			pageNumber: 1
		});
	},
	addRole: function() {
		var that = this;

		this.roleDetail.resetForm();
		this.roleDetail.resetSysResourceTree(function() {
			that.roleDetail.setFormData({});
			that.roleDetail.show();
		});
	},
	editRole: function(roleId) {
		this.roleDetail.loadForm(roleId);
	}
};

var Web_roleDetail = function(options) {
	this.init(options);
};
Web_roleDetail.prototype = {
	init: function(options) {
		this.options = options;
		var that = this;

		//返回列表 取消
		$("#roleSaveBack").click(function() {
			that.hide();
		});

		// 保存
		$("#btn_role_save").click(function() {
			that.saveRole();
		});
	},
	show: function() {
		$("#div_role_list").addClass("hide");
		$("#div_role_detail").removeClass("hide");
	},
	hide: function() {
		var that = this;
		that.options.roleTableRefresh();
		$("#div_role_list").removeClass("hide");
		$("#div_role_detail").addClass("hide");
		$('#roleSaveBackModal').modal('hide');
	},
	initSelOptions: function(callBack) {
		if($.isFunction(callBack)) {
			callBack();
		}
	},
	resetForm: function() {
		var that = this;
		$("#form_role input").val("");
		$("#form_role select").val("");
		$("#form_role textarea").val("");
	},
	resetSysResourceTree: function(callBack) {
		var that = this;

		$.ajax({
			url: "/system/resource/getSysResourceTree",
			type: "get",
			dataType: "JSON",
			data: null,
			success: function(json) {
				if(json.rsCode == "A000000") {
					_moduleTree = json.data;
					that.showSysResourceTree();
					if($.isFunction(callBack)) {
						callBack();
					}
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
	showSysResourceTree: function() {
		var that = this;

		var setting = {
			check: {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: {
					"Y": "ps",
					"N": "s"
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};

		var zTreeNodes = [];
		$(_moduleTree).each(function() {
			var $resource = $(this);
			var zNode = {};
			zNode.id = $resource.attr("id");
			zNode.name = $resource.attr("resourceName");
			zNode.pId = $resource.attr("parentId");
			zNode.open = true;
			zTreeNodes.push(zNode);
		});

		treeObj = $.fn.zTree.init($("#module_tree"), setting, zTreeNodes);
	},
	loadForm: function(id) {
		var that = this;
		$.ajax({
			url: "/system/role/getRoleDetail",
			type: "get",
			data: {
				id: id
			},
			dataType: "json",
			asyn: false,
			success: function(json) {
				if(json.rsCode == "A000000") {
					that.resetForm();
					that.resetSysResourceTree(function() {
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
		$("#form_role input").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_role select").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_role textarea").each(function(index) {
			data[this.name] = $(this).val();
		});

		var roleResources = [];
		var chkNodes = treeObj.getCheckedNodes(true);
		if(chkNodes.length == 0) {
			alert("请选择权限！");
			return;
		}
		$(chkNodes).each(function() {
			var $chkNode = $(this);
			roleResources.push($chkNode.attr("id"));
		});
		data["roleResources"] = roleResources.join(",");

		return data;
	},
	setFormData: function(data) {
		var that = this;

		$.each(data, function(key, value) {
			$("#form_role input[name=" + key + "]").val(value);
			$("#form_role select[name=" + key + "]").val(value);
			$("#form_role textarea[name=" + key + "]").val(value);
		});

		var roleResourceList = data.roleResourceList;
		that.setSysModuleTree(roleResourceList);
	},
	setSysModuleTree: function(roleResourceList) {
		var that = $(this);
		$(roleResourceList).each(function() {
			var $resource = $(this);
			var resourceId = $resource.attr("id");
			var mNode = treeObj.getNodeByParam("id", resourceId, null);
			treeObj.checkNode(mNode, true, false);
			treeObj.updateNode(mNode);
		});
	},
	checkFormData: function(data) {
		var result = [];

		if(_.isEmpty(data.roleName)) {
			result.push("请输入角色名！");
		}

		return result;
	},
	saveRole: function() {
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

		$("#btn_role_save").attr("disabled", true);
		$.ajax({
			url: "/system/role/saveRole",
			type: "post",
			data: data,
			dataType: "json",
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "保存角色成功！",
						time: 2000
					});
					that.hide();
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "保存角色失败：" + json.rsMsg,
						time: 10000
					});
				}
			}
		});
		$("#btn_role_save").attr("disabled", false);
	},
	showConfirm: function(info, callback) {
		$("#modal_confirm_info").html(info);
		$("#modal_confirm").modal("show");
		$("#btn_modal_confirm_ok").off("click.ibcp").on("click.ibcp", function() {
			if($.isFunction(callback)) {
				callback();
			}
		});
	}
};