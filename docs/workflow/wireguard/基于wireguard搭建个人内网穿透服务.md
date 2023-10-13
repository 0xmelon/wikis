## Docker运行
### 服务端
首先是服务器先运行下面的脚本
```shell
docker run -d \
  --name=wg-easy \
  -e WG_HOST=123.123.123.123 (🚨这里输入服务器的公网IP) \
  -e PASSWORD=passwd123 (🚨这里输入你的密码) \
  -e WG_DEFAULT_ADDRESS=10.0.8.x （🚨默认IP地址）\
  -e WG_DEFAULT_DNS=114.114.114.114 （🚨默认DNS）\
  -e WG_ALLOWED_IPS=10.0.8.0/24 （🚨允许连接的IP段）\
  -e WG_PERSISTENT_KEEPALIVE=25 （🚨重连间隔）\
  -v ~/.wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \
  --sysctl="net.ipv4.ip_forward=1" \
  --restart unless-stopped \
  weejewel/wg-easy
```
再在浏览器打开`服务器的公网IP：51821`即可配置
![[Pasted image 20231013221939.png]]
### 客户端
进入下面这个地址下载客户端
[https://www.wireguard.com/install/]()
