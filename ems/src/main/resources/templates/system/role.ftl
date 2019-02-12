<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>角色管理</title>
		<meta name="keywords" content="H+后台主题,后台bootstrap框架,会员中心主题,后台HTML,响应式后台">
		<meta name="description" content="H+是一个完全响应式，基于Bootstrap3最新版本开发的扁平化主题，她采用了主流的左右两栏式布局，使用了Html5+CSS3等现代技术">
		<link rel="shortcut icon" href="${ctx!}/assets/favicon.ico">
		<link type="text/css" href="${ctx!}/assets/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/css/animate.min.css" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/css/style.min862f.css?v=4.1.0" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/plugins/gritter/css/jquery.gritter.css" rel="stylesheet">
		<link type="text/css" href="${ctx!}/assets/plugins/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet">

		<script type="text/javascript" src="${ctx!}/assets/js/jquery.min.js?v=2.1.4"></script>
		<script type="text/javascript" src="${ctx!}/assets/js/bootstrap.min.js?v=3.3.6"></script>
		<script type="text/javascript" src="${ctx!}/assets/js/content.min.js?v=1.0.0"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/bootstrap-table/bootstrap-table.min.js"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/underscore/js/underscore-min.js"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/gritter/js/jquery.gritter.min.js"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/zTree/js/jquery.ztree.core.js"></script>
		<script type="text/javascript" src="${ctx!}/assets/plugins/zTree/js/jquery.ztree.excheck.js"></script>

		<script type="text/javascript" src="${ctx!}/app/js/common/date.js"></script>
		<script type="text/javascript" src="${ctx!}/app/js/system/role.js"></script>
		<script type="text/javascript">
			var _moduleTree;
			var treeObj;
	
			$(document).ready(function() {
				// 设置underscore的template，将模板匹配字符改为{{}}
				_.templateSettings = {
					evaluate: /\{\{([\s\S]+?)\}\}/g,
					interpolate: /\{\{=([\s\S]+?)\}\}/g,
					escape: /\{\{-([\s\S]+?)\}\}/g
				};

				var roleList = new Web_RoleList({

				});
			});
		</script>
		<script id="temp_role_action" type="text/template">
			<span data-sign="action_role" data-id="{{=id}}" data-roletype="{{=roleType}}" data-rolename="{{=roleName}}">
	            {{ _.each(actions, function(action){ }}
	            	<a class="btn btn-sm {{=action.color}} {{=action.dis}}" title="{{=action.name}}" data-action="{{=action.value}}">
	            		<i class="fa {{=action.iconstyle}}"></i>
	            	</a>
	            {{ }); }}
	        </span>
		</script>
	</head>

	<body class="gray-bg">
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row-fluid">
				<h3 class="page-title">
                	角色管理页面<small>主要新建、修改角色信息</small>
            	</h3>
			</div>

			<div id="div_role_list" class="row-fluid">
				<div class="col-sm-12">
					<div class="panel-body">
						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">查询条件</h3>
							</div>
							<div class="panel-body">
								<form id="form_search_role" class="form-horizontal">
									<div class="form-group" style="margin-top:15px">

									</div>
									<div class="form-group" style="margin-top:15px">
										<label class="control-label col-sm-2" for="se_roletype">角色类型：</label>
										<div class="col-sm-2">
											<select id="se_roletype" name="se_roletype" class="form-control m-b">
												<option value="">全部</option>
												<option value="1">管理员</option>
												<option value="2">操作员</option>
											</select>
										</div>
										<label class="control-label col-sm-1" for="se_roleids">角色ID</label>
										<div class="col-sm-2">
											<input type="text" class="form-control" id="se_roleids" placeholder="输入角色ID，多个之间用,分隔" />
										</div>
										<label class="control-label col-sm-1" for="se_rolename">角色名称</label>
										<div class="col-sm-2">
											<input type="text" class="form-control" id="se_rolename" placeholder="输入角色名称，进行模糊查询" />
										</div>
										<div class="col-sm-2">
											<button type="button" id="btn_search" class="btn btn-primary">查询</button>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div id="toolbar_rolelist">
							<div class="btn-group btn-group-sm">
								<button id="btn_add" type="button" class="btn btn-primary">
                            		<span class="glyphicon">添加</span>
                        		</button>
							</div>
						</div>
						<table id="table_rolelist"></table>
					</div>
				</div>
			</div>

			<div id="div_role_detail" class="row-fluid hide">
				<h3 class="form-section">
                <button id="action_role_back" class="btn btn-success" data-toggle="modal" data-target="#roleSaveBackModal">返回列表</button>
            </h3>
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">角色设置</h3>
					</div>
					<div class="portlet-body form">
						<!-- BEGIN FORM-->
						<form id="form_role" class="form-horizontal" role="form">
							<input type="hidden" name="id" value="" />
							<div class="form-group">
								<label class="col-sm-2 control-label"></label>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><span class="required">*</span>角色名：</label>
								<div class="col-sm-10">
									<input type="text" id="roleName" name="roleName" placeholder="请输入角色名" class="form-control">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><span class="required">*</span>角色键：</label>
								<div class="col-sm-10">
									<input type="text" id="roleKey" name="roleKey" placeholder="请输入角色键" class="form-control">
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><span class="required">*</span>角色类型：</label>
								<div class="col-sm-10">
									<select id="roleType" name="roleType" class="form-control m-b">
										<option value="">全部</option>
										<option value="1">管理员</option>
										<option value="2">操作员</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label">描述：</label>
								<div class="col-sm-10">
									<textarea id="description" name="description" class="form-control" required="" aria-required="true" placeholder="请输入描述信息"></textarea>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label" for="role"><span class="required">*</span>权限配置：</label>
								<div class="col-sm-10">
									<ul id="module_tree" class="ztree" style="overflow:auto;"></ul>
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-4 col-sm-offset-2">
									<button id="btn_role_save" class="btn btn-primary" type="button">保存</button>
									<button id="btn_role_cancle" class="btn btn-default" type="button" data-toggle="modal" data-target="#roleSaveBackModal">取消</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 模态框（返回） -->
		<div class="modal fade" id="roleSaveBackModal" tabindex="-1" role="dialog" aria-labelledby="roleSaveBackModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title" id="roleSaveBackModalLabel">提示</h4>
					</div>
					<div class="modal-body">确定放弃保存吗？</div>
					<div class="modal-footer">
						<button id="roleSaveCancle" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
						<button id="roleSaveBack" type="button" class="btn btn-primary">确认</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 模态框（删除） -->
		<div class="modal fade" id="delModal" tabindex="-1" role="dialog" aria-labelledby="delModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
		                    </button>
						<h4 class="modal-title" id="dleModalLabel">
		                        提示
		                    </h4>
					</div>
					<div class="modal-body">
						确定要删除吗？
					</div>
					<div class="modal-footer">
						<button id="delCancle" type="button" class="btn btn-default" data-dismiss="modal">
		                        取消
		                    </button>
						<button id="delBack" type="button" class="btn btn-primary">
		                        确认
		                    </button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->

		<div id="modal_confirm" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal_confirm_header" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
		                    </button>
						<h3 id="modal_confirm_header">确认信息</h3>
					</div>
					<div class="modal-body">
						<p id="modal_confirm_info"></p>
					</div>
					<div class="modal-footer">
						<button id="btn_modal_confirm_ok" class="btn btn-danger" data-dismiss="modal">确定</button>
						<button class="btn btn-success" data-dismiss="modal" aria-hidden="true">取消</button>
					</div>
				</div>
			</div>
		</div>

	</body>

</html>