var Web_UserList = function(options) {
	this.init(options);
};
Web_UserList.prototype = {
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
		var userListTable = that.initUserListTable();
		//加载表格
		userListTable.init();

		//初始化模块
		this.userDetail = new Web_userDetail({
			userTableRefresh: function() {
				that.tableRefresh();
			}
		});
	},
	setOptions: function(options) {
		this.options = $.extend(this.options, options);
	},
	initQueryParam: function() {
		var that = this;

		//加载角色列表
		that.getRoleList();

		$('#form_search_user input[type="text"]').val("");
		$('#form_search_user select').val("");
	},
	getRoleList: function() {
		$.ajax({
			url: "/system/role/getRoleList",
			type: "get",
			dataType: "json",
			data: null,
			success: function(json) {
				if(json.rows) {
					$('#se_roleid').empty();
					$('#se_roleid').append("<option value=\"\">全部</option>");
					$(json.rows).each(function() {
						var $role = $(this);
						var name = $role.attr("roleName");
						var id = $role.attr("id");
						$('#se_roleid').append("<option value=\"" + id + "\">" + name + "</option>");
					});
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "获取角色列表异常！",
						time: 10000
					});
				}
			}
		});
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
			name: "userIds",
			value: $("#se_userids").val()
		}, {
			name: "loginName",
			value: $("#se_loginname").val()
		}, {
			name: "userName",
			value: $("#se_username").val()
		}, {
			name: "roleId",
			value: $("#se_roleid").val()
		}, {
			name: "state",
			value: $("#se_state").val()
		}];
	},
	initUserListTable: function() {
		var that = this;
		var oTableInit = new Object();

		//初始化Table
		oTableInit.init = function() {
			$('#table_userlist').bootstrapTable({
				url: '/system/user/getUserList', //请求后台的URL（*）
				method: 'get', //请求方式（*）
				toolbar: '#toolbar_userlist', //工具按钮用哪个容器
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
				contentType: "userlication/x-www-form-urlencoded", //设置成form表单的形式，tomcat内部就会自动将requset payload中的数据部分解析放到request.getParameter()中，之后就可以直接通过@RequestParam映射参数获取
				columns: [{
					checkbox: true
				}, {
					field: 'id',
					title: '用户ID'
				}, {
					field: 'loginName',
					title: '账号'
				}, {
					field: 'userName',
					title: '用户名'
				}, {
					field: 'state',
					title: '用户状态',
					formatter: function(value, row, index) {
						if(row.state == 1) {
							return '<span class="label label-success">启用</span>';
						} else if(row.state == 0) {
							return '<span class="label label-danger">禁用</span>';
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
						var dis_enable = "";
						var dis_disable = "";
						if(row.state == 1) {
							dis_enable = "hide";
						} else {
							dis_disable = "hide";
						}

						return _.template($("#temp_user_action").html())({
							id: row.id,
							loginName: row.loginName,
							userName: row.userName,
							state: row.state,
							actions: [{
								color: "btn-danger",
								name: "启用",
								iconstyle: "fa-toggle-on",
								value: "action_enable_userlist",
								dis: dis_enable
							}, {
								color: "btn-success",
								name: "禁用",
								iconstyle: "fa-toggle-off",
								value: "action_disable_userlist",
								dis: dis_disable
							}, {
								color: "btn-primary",
								name: "编辑",
								iconstyle: "fa-edit",
								value: "action_edit_userlist"
							}]
						});
					}
				}],
				onLoadSuccess: function() {
					$("#btn_search").removeClass("disabled");
					that.tableUserFinish();
				},
				onColumnSwitch: function() {
					that.tableUserFinish();
				},
				onToggle: function() {
					that.tableUserFinish();
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
					$("#table_userlist").bootstrapTable('refreshOptions', {
						pageNumber: 1
					});
				}
			});

			// 添加
			$('#btn_add').off("click.ibcp").on("click.ibcp", function() {
				that.addUser();
			});

			//批量启用
			$('#btn_enable_batch').off("click.ibcp").on("click.ibcp", function() {
				var userIdAry = [];
				var rows = $('#table_userlist').bootstrapTable('getSelections');
				for(var i = 0; i < rows.length; i++) {
					userIdAry.push(rows[i].id);
				}

				that.enableUserBatch({
					userIdAry: userIdAry.join(","),
					state: 1
				});

			});

			//批量禁用
			$('#btn_disable_batch').off("click.ibcp").on("click.ibcp", function() {
				var userIdAry = [];
				var rows = $('#table_userlist').bootstrapTable('getSelections');
				for(var i = 0; i < rows.length; i++) {
					userIdAry.push(rows[i].id);
				}

				that.disableUserBatch({
					userIdAry: userIdAry.join(","),
					state: 0
				});
			});
		};

		return oInit;
	},
	tableUserFinish: function() {
		var that = this;

		// 修改
		$('a[data-action="action_edit_userlist"]').click(function() {
			var userId = $(this).parent("span").data("id");
			that.editUser(userId);
		});

		// 启用
		$('a[data-action="action_enable_userlist"]').click(function() {
			var userId = $(this).parent("span").data("id");
			that.enableUserBatch({
				userIdAry: userId,
				state: 1
			});
		});

		//禁用
		$('a[data-action="action_disable_userlist"]').click(function() {
			var userId = $(this).parent("span").data("id");
			that.disableUserBatch({
				userIdAry: userId,
				state: 0
			});
		});
	},
	tableRefresh: function() {
		$("#table_userlist").bootstrapTable('refreshOptions', {
			pageNumber: 1
		});
	},
	addUser: function() {
		var that = this;

		this.userDetail.resetForm();
		this.userDetail.resetRoleList(function() {
			that.userDetail.setFormData({});
			that.userDetail.show();
		});
	},
	editUser: function(userId) {
		this.userDetail.loadForm(userId);
	},
	disableUserBatch: function(data) {
		var that = this;
		$.ajax({
			url: "/system/user/updateUserStatusBatch",
			type: "get",
			dataType: "JSON",
			data: {
				userIdAry: data.userIdAry,
				state: data.state
			},
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "禁用用户成功！",
						time: 2000
					});
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "禁用用户失败：" + json.rsMsg,
						time: 2000
					});
				}

				that.tableRefresh();
			}
		});
	},
	enableUserBatch: function(data) {
		var that = this;
		$.ajax({
			url: "/system/user/updateUserStatusBatch",
			type: "get",
			dataType: "JSON",
			data: {
				userIdAry: data.userIdAry,
				state: data.state
			},
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "启用用户成功！",
						time: 2000
					});
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "启用用户失败：" + json.rsMsg,
						time: 2000
					});
				}

				that.tableRefresh();
			}
		});
	}
};

var Web_userDetail = function(options) {
	this.init(options);
};
Web_userDetail.prototype = {
	init: function(options) {
		this.options = options;
		var that = this;

		//返回列表 取消
		$("#userSaveBack").click(function() {
			that.hide();
		});

		// 保存
		$("#btn_user_save").click(function() {
			that.saveUser();
		});
	},
	show: function() {
		$("#div_user_list").addClass("hide");
		$("#div_user_detail").removeClass("hide");
	},
	hide: function() {
		var that = this;
		that.options.userTableRefresh();
		$("#div_user_list").removeClass("hide");
		$("#div_user_detail").addClass("hide");
		$('#userSaveBackModal').modal('hide');
	},
	initSelOptions: function(callBack) {
		if($.isFunction(callBack)) {
			callBack();
		}
	},
	resetForm: function() {
		var that = this;
		$("#form_user input").val("");
		$("#form_user select").val("");
		$("#form_user textarea").val("");
		$("#form_user input[type='checkbox']").removeAttr("checked");
	},
	resetRoleList: function(callBack) {
		$.ajax({
			url: "/system/role/getRoleList",
			type: "get",
			dataType: "json",
			data: null,
			success: function(json) {
				if(json.rows) {
					$('#roleDiv').empty();
					$(json.rows).each(function() {
						var $role = $(this);
						var name = $role.attr("roleName");
						var id = $role.attr("id");
						$('#roleDiv').append('<input type="checkbox" name="role" value="' + id + '" />' + name);
					});
					if($.isFunction(callBack)) {
						callBack();
					}
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "获取角色列表异常！",
						time: 2000
					});
				}
			}
		});
	},
	loadForm: function(id) {
		var that = this;
		$.ajax({
			url: "/system/user/getUserDetail",
			type: "get",
			data: {
				id: id
			},
			dataType: "json",
			success: function(json) {
				if(json.rsCode == "A000000") {
					that.resetForm();
					that.resetRoleList(function() {
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
		$("#form_user input[type='email']").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_user input[type='text']").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_user input[type='hidden']").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_user select").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_user textarea").each(function(index) {
			data[this.name] = $(this).val();
		});

		var userRoles = [];
		$("#form_user input[type='checkbox'][name='role']").each(function() {
			if(this.checked) {
				userRoles.push($(this).val());
			}
		});

		data["userRoles"] = userRoles.join(",");
		return data;
	},
	setFormData: function(data) {
		var that = this;

		$.each(data, function(key, value) {
			$("#form_user input[name=" + key + "]").val(value);
			$("#form_user select[name=" + key + "]").val(value);
			$("#form_user textarea[name=" + key + "]").val(value);
		});

		//设置用户拥有的角色列表
		var chkedRoleList = data.userRoleList;
		that.setUserRoleList(chkedRoleList);
	},
	setUserRoleList: function(chkedRoleList) {
		$(chkedRoleList).each(function() {
			var $chkedRole = $(this);
			var roleId = $chkedRole.attr("id");
			$("#form_user input[type=checkbox][name=role]").each(function() {
				var $role = $(this);
				if($role.val() == roleId) {
					$role.prop("checked", true);
				}
			});
		});
	},
	checkFormData: function(data) {
		var result = [];

		if(_.isEmpty(data.loginName)) {
			result.push("请输入用户登录名！");
		}

		if(_.isEmpty(data.userName)) {
			result.push("请输入用户名！");
		}

		if(_.isEmpty(data.userRoles)) {
			result.push("请至少选择一种角色！");
		}

		return result;
	},
	saveUser: function() {
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

		$("#btn_user_save").attr("disabled", true);
		$.ajax({
			url: "/system/user/saveUser",
			type: "post",
			data: data,
			dataType: "json",
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "保存用户成功！",
						time: 2000
					});
					that.hide();
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "保存用户失败：" + json.rsMsg,
						time: 10000
					});
				}
			}
		});
		$("#btn_user_save").attr("disabled", false);
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