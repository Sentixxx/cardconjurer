# Card Conjurer

Card Conjurer 是由一位热衷于《万智牌》的玩家创建的，并逐渐成为该游戏中最受欢迎的在线卡片生成器之一。
在 2022 年 11 月，Wizards of the Coast 向该网站的原始创作者和网络主机发出了停止和撤销令的文件，迫使该网站下线。
此存储库的目的是使该应用程序可以在您的本地计算机上使用，并永久维护模板。

## Setup

- 在您的系统中的某个位置克隆此存储库。 (或使用 download the Zip with CODE > Download Zip above)
- 运行 launcher.exe (对于 MacOS，请运行 launcher-macos，对于 Linux，请运行 launcher-linux)
- 完成！你也可以使用 WAMP、Docker、XAMPP 等更传统的方法设置 Card Conjurer。

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?longCache=true&style=popout)](https://www.paypal.me/kyleburtondonate) ← 捐赠 Card Conjurer 的原作者 Kyle。

## 使用 Docker 启动（http://localhost:4242/）

<details>
    <summary>在Ubuntu上安装Make</summary>

```bash
$ sudo apt update
```

检查是否安装了 Make

```bash
$ make -version
```

运行上述命令后，是否得到以下错误？

- **bash: /usr/bin/make: No such file or directory**

然后继续执行下一步，如果没有错误，请跳过下一组命令

```bash
$ sudo apt install make
```

遇到问题？
参考以下指南 https://linuxhint.com/install-make-ubuntu/

</details>
<details>
    <summary>在Mac上安装Make</summary>
检查是否安装了Make

```bash
$ make -version
```

运行上述命令后，是否得到以下错误？

- **zsh: command not found: make**

然后继续执行下一步，如果没有错误，请跳过下一组命令

```bash
$ (sudo) brew install make
```

</details>
<details>
    <summary>在Windows上安装Make</summary>
请参考以下指南
https://sp21.datastructur.es/materials/guides/make-install.html#windows-installation
</details>
- 打开终端/ PowerShell（Windows）并转到下载/克隆的文件夹，然后运行以下命令

```bash
$ make start
```

使用以下网址在浏览器中打开

http://localhost:4242/

### 注意

在运行 make 命令之前，请确保您正在 Windows 或 Mac 下运行 Docker Desktop。

## 使用本地图片

如果您保存了大量自定义图片的卡片，可能会达到上传图片的数据限制（约 2MB）。
您可以通过将图片文件放在该存储库的`local_art`目录中来避免这个问题。然后，在卡片创建器的"Art"选项卡中选择图片时，不要上传图片，而是在"Via URL"字段中输入文件名。这将直接使用`local_art`目录中的图片而不需要将整个图片存储在保存文件中。
例如，如果您添加了文件：
`cardconjurer/local_art/my_art.jpg`
您可以通过输入以下内容在"Via URL"框中加载它：
`my_art.jpg`，然后按回车键。
