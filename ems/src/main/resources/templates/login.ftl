<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<title>EMS系统 - 登录</title>
		<meta name="keywords" content="">
		<meta name="description" content="">

		<link rel="shortcut icon" href="${ctx!}/assets/favicon.ico">
		<link href="${ctx!}/assets/css/bootstrap.min14ed.css?v=3.3.6" rel="stylesheet">
		<link href="${ctx!}/assets/css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">
		<link href="${ctx!}/assets/css/animate.min.css" rel="stylesheet">
		<link href="${ctx!}/assets/css/style.min862f.css?v=4.1.0" rel="stylesheet">
		<!--[if lt IE 9]><meta http-equiv="refresh" content="0;ie.html" /><![endif]-->
		
		<script type="text/javascript" src="${ctx!}/assets/js/jquery.min.js?v=2.1.4"></script>
		<script type="text/javascript" src="${ctx!}/assets/js/bootstrap.min.js?v=3.3.6"></script>
		<script type="text/javascript" src="${ctx!}/assets/js/plugins/validate/jquery.validate.min.js"></script>
    	<script type="text/javascript" src="${ctx!}/assets/js/plugins/validate/messages_zh.min.js"></script>
    	<script type="text/javascript" src="${ctx!}/app/js/login.js"></script>
		<script>
			 $(document).ready(function() {
		        Login.init();
		    });
		</script>
	</head>

	<body class="gray-bg">
		<div class="middle-box text-center loginscreen  animated fadeInDown">
			<div>
				<div>
					<h1 class="logo-name">EMS</h1>
				</div>
				<h3>欢迎使用 EMS</h3>
				<form id="loginForm" class="m-t" role="form" action="${ctx!}/login" method="post">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="登录名" required="" id="loginName" name="loginName">
					</div>
					<div class="form-group">
						<input type="password" class="form-control" placeholder="密码" required="" id="password" name="password">
					</div>
					<button type="submit" class="btn btn-primary block full-width m-b">登 录</button>
				</form>
			</div>
		</div>
	</body>

</html>