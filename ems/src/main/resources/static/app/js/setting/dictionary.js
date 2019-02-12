var Web_DictionaryList = function(options) {
	this.init(options);
};
Web_DictionaryList.prototype = {
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
		var dictionaryListTable = that.initDictionaryListTable();
		//加载表格
		dictionaryListTable.init();

		//初始化模块
		this.dictionaryDetail = new Web_dictionaryDetail({
			dictionaryTableRefresh: function() {
				that.tableRefresh();
			}
		});
	},
	setOptions: function(options) {
		this.options = $.extend(this.options, options);
	},
	initQueryParam: function() {
		var that = this;

		//加载字典码列表
		that.getDicCodeList();

		$('#form_search_dictionary input[type="text"]').val("");
		$('#form_search_dictionary select').val("");
	},
	getDicCodeList: function() {
		$.ajax({
			url: "/setting/dictionary/getDicCodeList",
			type: "get",
			dataType: "json",
			data: null,
			success: function(json) {
				if(json.rows) {
					$('#se_diccode').empty();
					$('#se_diccode').append("<option value=\"\">全部</option>");
					for(var i=0; i< json.rows.length; i++){
						var dicCode =  json.rows[i];
						$('#se_diccode').append("<option value=\"" + dicCode + "\">" + dicCode + "</option>");
					}
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "获取字典编码列表异常！",
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
		} else if(params.sort == "itemValue") {
			sort = "item_value";
		} else if(params.sort == "itemSeq") {
			sort = "item_seq";
		}else if(params.sort == "dicCode") {
			sort = "dic_code";
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
			name: "dictionaryIds",
			value: $("#se_dictionaryids").val()
		}, {
			name: "itemName",
			value: $("#se_itemname").val()
		}, {
			name: "dicCode",
			value: $("#se_diccode").val()
		}];
	},
	initDictionaryListTable: function() {
		var that = this;
		var oTableInit = new Object();

		//初始化Table
		oTableInit.init = function() {
			$('#table_dictionarylist').bootstrapTable({
				url: '/setting/dictionary/getDictionaryList', //请求后台的URL（*）
				method: 'get', //请求方式（*）
				toolbar: '#toolbar_dictionarylist', //工具按钮用哪个容器
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
				contentType: "dictionarylication/x-www-form-urlencoded", //设置成form表单的形式，tomcat内部就会自动将requset payload中的数据部分解析放到request.getParameter()中，之后就可以直接通过@RequestParam映射参数获取
				columns: [{
					checkbox: true
				}, {
					field: 'id',
					title: '数据字典ID'
				}, {
					field: 'dicCode',
					title: '字典编码',
					sortable: true
				}, {
					field: 'itemName',
					title: '字典名'
				}, {
					field: 'itemValue',
					title: '字典值',
					sortable: true
				}, {
					field: 'itemSeq',
					title: '顺序号',
					sortable: true
				}, {
					field: 'itemRemark',
					title: '备注'
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
						return _.template($("#temp_dictionary_action").html())({
							id: row.id,
							dicCode: row.dicCode,
							itemName: row.itemName,
							itemValue: row.itemValue,
							actions: [{
								color: "btn-primary",
								name: "编辑",
								iconstyle: "fa-edit",
								value: "action_edit_dictionarylist"
							}]
						});
					}
				}],
				onLoadSuccess: function() {
					$("#btn_search").removeClass("disabled");
					that.tableDictionaryFinish();
				},
				onColumnSwitch: function() {
					that.tableDictionaryFinish();
				},
				onToggle: function() {
					that.tableDictionaryFinish();
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
					$("#table_dictionarylist").bootstrapTable('refreshOptions', {
						pageNumber: 1
					});
				}
			});

			// 添加
			$('#btn_add').off("click.ibcp").on("click.ibcp", function() {
				that.addDictionary();
			});
		};

		return oInit;
	},
	tableDictionaryFinish: function() {
		var that = this;

		// 修改
		$('a[data-action="action_edit_dictionarylist"]').click(function() {
			var dictionaryId = $(this).parent("span").data("id");
			that.editDictionary(dictionaryId);
		});
	},
	tableRefresh: function() {
		$("#table_dictionarylist").bootstrapTable('refreshOptions', {
			pageNumber: 1
		});
	},
	addDictionary: function() {
		var that = this;

		this.dictionaryDetail.resetForm(function() {
			that.dictionaryDetail.setFormData({});
			that.dictionaryDetail.show();
		});
	},
	editDictionary: function(dictionaryId) {
		this.dictionaryDetail.loadForm(dictionaryId);
	}
};

var Web_dictionaryDetail = function(options) {
	this.init(options);
};
Web_dictionaryDetail.prototype = {
	init: function(options) {
		this.options = options;
		var that = this;

		//返回列表 取消
		$("#dictionarySaveBack").click(function() {
			that.hide();
		});

		// 保存
		$("#btn_dictionary_save").click(function() {
			that.saveDictionary();
		});
	},
	show: function() {
		$("#div_dictionary_list").addClass("hide");
		$("#div_dictionary_detail").removeClass("hide");
	},
	hide: function() {
		var that = this;
		that.options.dictionaryTableRefresh();
		$("#div_dictionary_list").removeClass("hide");
		$("#div_dictionary_detail").addClass("hide");
		$('#dictionarySaveBackModal').modal('hide');
	},
	resetForm: function(callBack) {
		$("#form_dictionary input").val("");
		$("#form_dictionary select").val("");
		$("#form_dictionary textarea").val("");
		$("#form_dictionary input[type='checkbox']").removeAttr("checked");

		if($.isFunction(callBack)) {
			callBack();
		}
	},
	loadForm: function(id) {
		var that = this;
		$.ajax({
			url: "/setting/dictionary/getDictionaryDetail",
			type: "get",
			data: {
				id: id
			},
			dataType: "json",
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
		$("#form_dictionary input").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_dictionary select").each(function(index) {
			data[this.name] = $(this).val();
		});
		$("#form_dictionary textarea").each(function(index) {
			data[this.name] = $(this).val();
		});

		return data;
	},
	setFormData: function(data) {
		var that = this;

		$.each(data, function(key, value) {
			$("#form_dictionary input[name=" + key + "]").val(value);
			$("#form_dictionary select[name=" + key + "]").val(value);
			$("#form_dictionary textarea[name=" + key + "]").val(value);
		});
	},
	checkFormData: function(data) {
		var result = [];

		if(_.isEmpty(data.dicCode)) {
			result.push("请输入数据字典编码！");
		}

		if(_.isEmpty(data.itemName)) {
			result.push("请输入数据字典名！");
		}

		if(_.isEmpty(data.itemValue)) {
			result.push("请输入数据字典值！");
		}

		return result;
	},
	saveDictionary: function() {
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

		$("#btn_dictionary_save").attr("disabled", true);
		$.ajax({
			url: "/setting/dictionary/saveDictionary",
			type: "post",
			data: data,
			dataType: "json",
			success: function(json) {
				if(json.rsCode == "A000000") {
					$.gritter.add({
						title: "提示信息：",
						text: "保存数据字典成功！",
						time: 2000
					});
					that.hide();
				} else {
					$.gritter.add({
						title: "提示信息：",
						text: "保存数据字典失败：" + json.rsMsg,
						time: 10000
					});
				}
			}
		});
		$("#btn_dictionary_save").attr("disabled", false);
	}
};