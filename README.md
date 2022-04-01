# Le tme skip speak script
## 必要条件
安装 node https://nodejs.org/zh-cn/

## 安装脚本
```
# 在终端执行如下命令

npm install lmsp_scripts -g
# 或者
npm install lmsp_scripts -g git+https://github.com/HeHuiqi/lmsp_scripts.git


```

## 配置账号信息

创建 HqConfig.json 文件注意后缀名
填写自己的账号信息如下示例：
```
{
    "note": "write your account info",
    "acccounts": [
        {
            "email": "12345678@qq.com",
            "password": "12345678",
            "deviceToken": "your device token"
        },
        {
            "email": "65432189@qq.com",
            "password": "87654321",
            "deviceToken": "your device token"
        },
    ]
}

```

## 运行脚本
打开一个终端输入命令
```
# 根据提示输入相应信息
lmsp_scripts 

```
