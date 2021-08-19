//配置具体的修改规则
const { override, fixBabelImports,addLessLoader} = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
	}),
	addLessLoader({
		lessOptions:{
			javascriptEnabled: true,
			modifyVars: { 
				'@primary-color': '#40605F',
				'@text-color': 'rgba(217, 131, 114, 0.9)', // 主文本色 },
				'@text-color-secondary': 'rgba(184, 135, 128, 0.9)',
				'@heading-color': 'rgba(232, 143, 135, 0.85)', // 标题色
				'@link-color': '#E88F87', // 链接色
				'@success-color': '#46507B', // 成功色
				'@warning-color': '#D55E5F', // 警告色
				'@error-color': '#9D1420', // 错误色
			}
		}
	}),
);