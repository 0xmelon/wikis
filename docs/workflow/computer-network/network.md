## 应用层

网络应用的原理：网络应用协议的概念和实现方面

+ 传输层的服务模型
+ 客户-服务器模式
+ 对等模式(peer-to-peer)
+ 内容分发网络

网络应用的实例：互联网流行的应用层协议
+ HTTP
+ FTP
+ SMTP / POP3 / IMAP
+ DNS

编程：网络应用程序
+ Socket API

### **应用架构**

+ 客户-服务器模式（C/S:client/server）
+ 对等模式(P2P:Peer To Peer)
+ 混合体：客户-服务器和对等体系

**客户-服务器（C/S）体系结构**

+ 服务器:
  一直运行
  固定的IP地址和周知的端口号（约定）
  
  扩展性：服务器场
  +  数据中心进行扩展 
  + 扩展性差
+ 客户端:
   主动与服务器通信
   与互联网有间歇性的连接
   可能是动态IP 地址
   不直接与其它客户

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210212145666.png" alt="image-20221021214513597" style="zoom: 50%;" />

**对等体（P2P）体系结构**

+ （几乎）没有一直运行的服务器
+ 任意端系统之间可以进行通信
+ 每一个节点既是客户端又是服务器
	+ 自扩展性-新peer节点带来新的服务能力，当然也带来新的服务请求
+ 参与的主机间歇性连接且可以改变IP 地址 
	+  难以管理
	+ 例子: Gnutella，迅雷

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210212146714.png" alt="image-20221021214616664" style="zoom:50%;" />

**C/S和P2P体系结构的混合体**

Napster
文件搜索：集中 
+ 主机在中心服务器上注册其资源 
+ 主机向中心服务器查询资源位置
文件传输：P2P
+ 任意Peer节点之间
即时通信
在线检测：集中
+ 当用户上线时，向中心服务器注册其IP地址
+ 用户与中心服务器联系，以找到其在线好友的位置
两个用户之间聊天：P2P

**进程通信**

进程：在主机上运行的应用程序
+ 在同一个主机内，使用进程间通信机制通信（操作系统定义）
+ 不同主机，通过交换报文（Message）来通信
  + 使用OS提供的通信服务
  + 按照应用协议交换报文 
    + 借助传输层提供的服务 

| 客户端进程     | 服务端进程     |
| -------------- | -------------- |
| 发起通信的进程 | 等待连接的进程 |

**分布式进程通信需要解决的问题**

> 进程标示和寻址问题（服务用户）

+ 对进程进行编址（addressing）
+ 进程为了接收报文，必须有一个标识	即：SAP（发送也需要标示）
  + 主机：唯一的 32位IP地址 
    + 仅仅有IP地址不能够唯一标示一个进程；在一台端系统上有很多应用进程在运行
  + 所采用的传输层协议：TCP or UDP
  + 端口号（Port Numbers）
+ 一些知名端口号的例子：
  + HTTP: TCP 80 Mail: TCP25 ftp:TCP 2
+ 一个进程：用IP+port标示 端节点
+ 本质上，一对主机进程之间的通信由2个端节点构成

> 传输层提供的服务-需要穿过层间的信息

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221041373.png" alt="image-20221022104125324" style="zoom:50%;" />

层间接口必须要携带的信息 
+ 要传输的报文（对于本层来说：SDU） 
+ 谁传的：对方的应用进程的标示：IP+TCP(UDP) 端口 
+ 传给谁：对方的应用进程的标示：对方的IP+TCP(UDP)端口号
传输层实体（tcp或者udp实体）根据这些信息进行TCP报文段（UDP数据报）的封装
+ 源端口号，目标端口号，数据等 
+ 将IP地址往下交IP实体，用于封装IP数据报：源IP,目标IP

> 传输层提供的服务-层间信息的代表

如果Socket API 每次传输报文，都携带如此多的信息，太繁琐易错，不便于管理
+ 用个代号标示通信的双方或者单方：socket
+ 就像OS打开文件返回的句柄一样
  + 对句柄的操作，就是对文件的操作
+ TCP socket： 
  + TCP服务，两个进程之间的通信需要之前要建立连接 
    + 两个进程通信会持续一段时间，通信关系稳定
  + 可以用一个整数表示两个应用实体之间的通信关系，本地标示
  + 穿过层间接口的信息量最小
  + TCP socket：源IP,源端口，目标IP，目标IP,目标端口

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221051745.png" alt="image-20221022105129685" style="zoom:50%;" />

> 传输层提供的服务-层间信息代码

UDP socket： 
+ UDP服务，两个进程之间的通信需要之前无需建立连接 
  + 每个报文都是独立传输的 
  + 前后报文可能给不同的分布式进程
+ 因此，只能用一个整数表示本应用实体的标示 
  + 因为这个报文可能传给另外一个分布式进程 ·1
+ 穿过层间接口的信息大小最小
+ UDP socket：本IP,本端口
+ 但是传输 报文时：必须要提供对方IP，port 
  + 接收报文时： 传输层需要上传对方的IP，port

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221056915.png" alt="image-20221022105628862" style="zoom:50%;" />

*套接字（Socket）*

+ 进程向套接字发送报文或从套接字接收报文
+ 套接字 <-> 门户 
  + 发送进程将报文推出门户，发送进程依赖于传输层设施在另外一侧的门将报文交付给接受进程   
  + 接收进程从另外一端的门户收到报文（依赖于传输层设施)
  
  <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221058709.png" alt="image-20221022105821666" style="zoom:50%;" />

> 如何使用传输层提供的服务实现应用

+ 定义应用层协议：报文格式，解释，时序等
+ 编制程序，通过API调用网络基础设施提供通信服务传报文，解析报文，实现应用时序等

### 应用层协议

+ 定义了：运行在不同端系统上的应用进程如何相互交换报文
  +  交换的报文类型：请求和应答报文
  +  各种报文类型的语法：报文中的各个字段及其描述 
  +  字段的语义：即字段取值的含义 
  +  进程何时、如何发送报文及对报文进行响应的规则

+ 应用协议仅仅是应用的一个组成部分 
  + Web应用：HTTP协议，web客户端，web服务器，HTML

*公开协议：*由RFC文档定义允许互操作

+ 如HTTP, SMTP

*专用（私有）协议：*协议不公开

+ 如：Skype

**Internet 传输层提供的服务**

TCP 服务：
+ 可靠的传输服务
+ 流量控制：发送方不会淹没接受方
+ 拥塞控制：当网络出现拥塞时，能抑制发送方
+ 不能提供的服务：时间保证、最小吞吐保证和安全
+ 面向连接：要求在客户端进程和服务器进程之间建立连接

UDP 服务：
+ 不可靠数据传输
+ 不提供的服务：可靠，流量控制、拥塞控制、时间、带宽保证、建立连接

>  UDP存在的必要性

+ 能够区分不同的进程，而IP服务不能 
  + 在IP提供的主机到主机端到端功能的基础上，区分了主机的应用进程
+ 无需建立连接，省去了建立连接时间，适合事务性的应用
+ 不做可靠性的工作，例如检错重发，适合那些对实时性要求比较高而对正确性要求不高的应用 
  + 因为为了实现可靠性（准确性、保序等），必须付出时间代
  价（检错重发）
+ 没有拥塞控制和流量控制，应用能够按照设定的速度发送数据 
  + 而在TCP上面的应用，应用发送数据的速度和主机向网络发送的实际速度是不一致的，因为有流量控制和拥塞控制

**Internet应用及其应用层协议和传输协议**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221117829.png" alt="image-20221022111719774" style="zoom:50%;" />

**安全TCP**
TCP & UDP 
+ 都没有加密
+ 明文通过互联网传输，甚至密码
SSL
+ 在TCP上面实现，提供加密的TCP连接
+ 私密性
+ 数据完整性
+ 端到端的鉴

SSL在应用层
+ 应用采用SSL库，SSL库使用TCP通信
SSL socket API
+ 应用通过API将明文交给socket，SSL将其加密在互联网上传输

### Web 与 HTTP
术语
+ Web页：由一些对象组成
+ 对象可以是HTML文件、JPEG图像、Java小程序、声音剪辑文件等
+ Web页含有一个基本的HTML文件，该基本HTML文件又包含若干对象的引用（链接）
+ 通过URL对每个对象进行引用 
  + 访问协议，用户

URL格式:

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221125044.png" alt="image-20221022112518993" style="zoom:50%;" />

**响应时间模型**

往返时间RTT（round-trip time）：一个小的分组从客户端到服务器，在回到客户端的时间（传输时间忽略）
响应时间：
+ 一个RTT用来发起TCP连接
+ 一个 RTT用来HTTP请求并等待HTTP响应
+ 文件传输时间
共：2RTT+传输时间 

基础：([Http基础 | Drzone (dreamin.space)](https://dreamin.space/2022/09/12/Http/))

**用户-服务器状态：cookies**

大多数主要的门户网站使用 cookies
4个组成部分：
1) 在HTTP响应报文中有一个cookie的首部行
2) 在HTTP请求报文含有一个cookie的首部行
3) 在用户端系统中保留有一个cookie文件，由用户的浏览器管理
4) 在Web站点有一个后端数据库

**Cookies：维护状态**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221211939.png" alt="image-20221022121158868" style="zoom:50%;" />

Cookies能带来什么：
+ 用户验证

+ 购物车

+ 推荐

+ 用户状态 (Web e-mail)


Cookies与隐私：

+ Cookies允许站点知道许多关于用户的信息

+ 可能将它知道的东西卖给第三方

+ 使用重定向和cookie的搜索引擎还能知道用户更多的信息

+ 如通过某个用户在大量站点上的行为，了解其个人浏览方式的大致模式

+ 广告公司从站点获得信息

*如何维持状态：*

+ 协议端节点：在多个事务上，发送端和接收端维持状态

+ cookies: http报文携带状态信息

**Web缓存 (代理服务器)**

目标：不访问原始服务器，就满足客户的请求。

+  用户设置浏览器： 通过缓存访问Web

+ 浏览器将所有的HTTP请求发给缓存 
  + 在缓存中的对象：缓存直接返回对象 
  + 如对象不在缓存，缓存请求原始服务器，然后再将对象返回给客户端

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221610265.png" alt="image-20221022161046155" style="zoom: 33%;" />

+ 缓存既是客户端又是服务器
+ 通常缓存是由ISP安装 (大学、公司、居民区ISP)

> 为什么要使用Web缓存

+ 降低客户端的请求响应时间
+ 可以大大减少一个机构内部网络与Internet接入链路上的流量
+ 互联网大量采用了缓存：
可以使较弱的ICP也能够有效提供内容

>  Ps. 百分之八十的人访问了百分之二十的互联网内容，提高运输层带宽的成本远远高于部署Web本地缓存服务器

**条件GET方法**

①目标：如果缓存器中的对象拷贝是最新的，就不要发送对象
②缓存器: 在HTTP请求中指定缓存拷贝的日期
If-modified-since: 
<date>
③服务器: 如果缓存拷贝陈旧，则响应报文没包含对象: 
HTTP/1.0 304 Not 
Modified

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221618319.png" alt="image-20221022161851247" style="zoom:33%;" />

### **FTP与Email**

**FTP: 文件传输协议**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221632734.png" alt="image-20221022163203692" style="zoom:50%;" />

+ 向远程主机上传输文件或从远程主机接收文件
+ 客户/服务器模式 
  + 客户端：发起传输的一方
  + 服务器：远程主机
+ ftp: RFC 959
+ ftp服务器：端口号为21

**FTP: 控制连接与数据连接分开**

+ FTP客户端与FTP服务器通过端口21联系，并使用TCP为传输协议
+ 客户端通过控制连接获得身份确认
+ 客户端通过控制连接发送命令浏览远程目录
+ 收到一个文件传输命令时，服务器打开一个到客户端的数据连接
+ 一个文件传输完成后，服务器关闭连接

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210221634235.png" alt="image-20221022163410194" style="zoom: 50%;" />

+ 服务器打开第二个TCP数据连接用来传输另一个文件
+ 控制连接： 带外（ “out of band” ）传送
+ FTP服务器维护用户的状态信息：当前路径、用户帐户与控制连接对应

**FTP命令、响应**

*命令样例：*
+ 在控制连接上以ASCII文本方式传送
+ USER username 
+ PASS password
+ LIST：请服务器返回远程主机当前目录的文件列表
+ RETR filename：从远程主机的当前目录检索文件
(gets)
+ STOR filename：向远程主机的当前目录存放文件
(puts)

*返回码样例：*
+ 状态码和状态信息 (同HTTP)
+ 331 Username OK, password required
+ 125 data connection already open; transfer starting
+ 425 Can’t open data connection
+ 452 Error writing file

**电子邮件（Email）**

邮件服务器
+ 邮箱中管理和维护发送给用户的邮件
+ 输出报文队列保持待发送邮件报文
+ 邮件服务器之间的SMTP协议：发送email报文
  + 客户：发送方邮件服务器 
  + 服务器：接收端邮件服务器

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210270959381.png" alt="image-20221027095903421" style="zoom:50%;" />

**SMTP**

+ 使用TCP在客户端和服务器之间传送报文，端口号为25
+ 直接传输：从发送方服务器到接收方服务器
+ 传输的3个阶段
  + 握手
  + 传输报文
  + 关闭
+ 命令/响应交互
  + 命令：ASCII文本
  + 响应：状态码和状态信息
+ 报文必须为7位ASCII

> 特点

+ SMTP使用持久连接
+ SMTP要求报文（首部和主体）为7位ASCII编码
+ SMTP服务器使用CRLF.CRLF决定报文的尾部

与HTTP比较：
+ HTTP：拉（pull）
+ SMTP：推（push）
+ 二者都是ASCII形式的命令/响应交互、状态码
+ HTTP：每个对象封装在各自的响应报文中
+ SMTP：多个对象包含在一个报文中

**邮件报文格式**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271010009.png" alt="image-20221027101028919" style="zoom: 50%;" />

多媒体拓展

+ MIME：多媒体邮件扩展（multimedia mail extension）, RFC 2045, 2056
+ 在报文首部用额外的行申明MIME内容类

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271014185.png" alt="image-20221027101405139" style="zoom: 50%;" />

**POP3协议**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271017668.png" alt="image-20221027101712614" style="zoom:50%;" />

**POP3与IMAP**

POP3

(本地管理文件夹)
+ 先前的例子使用 “下载并删除”模式。
  + 如果改变客户机，Bob不能阅读邮件
+ “下载并保留”：不同客户机上为报文的拷贝
+ POP3在会话中是无状态的

IMAP

(远程管理文件夹)
+ IMAP服务器将每个报文与一个文件夹联系起来
+ 允许用户用目录来组织报文
+ 允许用户读取报文组件
+ IMAP在会话过程中保留
	用户状态： 
  + 目录名、报文ID与目录名之间映射

### DNS

**DNS（Domain Name System）的必要性**
+ IP地址标识主机、路由器
+ 但IP地址不好记忆，不便人类使用(没有意义)
+ 人类一般倾向于使用一些有意义的字符串来标识Internet上的设备
例如：qzheng@ustc.edu.cn 所在的邮件服务器
www.ustc.edu.cn 所在的web服务器
+ 存在着“字符串”—IP地址的转换的必要性
+ 人类用户提供要访问机器的“字符串”名称
+ 由DNS负责转换成为二进制的网络地址

> DNS系统需要解决的问题

+ 问题1：如何命名设备
  + 用有意义的字符串：好记，便于人类用使用
  + 解决一个平面命名的重名问题：层次化命名
+ 问题2：如何完成名字到IP地址的转换
  + 分布式的数据库维护和响应名字查询
+ 问题3：如何维护：增加或者删除一个域，需要在域名系统中做哪些工作

**DNS(Domain Name System)的历史**

+ ARPANET的名字解析解决方案
  + 主机名：没有层次的一个字符串（一个平面）
  + 存在着一个（集中）维护站：维护着一张 主机名-IP地址的映射文件：Hosts.txt
  + 每台主机定时从维护站取文件
+  ARPANET解决方案的问题
  + 当网络中主机数量很大时
  + 没有层次的主机名称很难分配
  + 文件的管理、发布、查找都很麻烦

**DNS(Domain Name System)总体思路和目标**

+ DNS的主要思路
  + 分层的、基于域的命名机制
  + 若干分布式的数据库完成名字到IP地址的转换
  + 运行在UDP之上端口号为53的应用服务
  + 核心的Internet功能，但以应用层协议实现  在网络边缘处理复杂性
+ DNS主要目的：
  + 实现主机名-IP地址的转换(name/IP translate)
  + 其它目的
    + 主机别名到规范名字的转换：Host aliasing
    + 邮件服务器别名到邮件服务器的正规名字的转换：Mail server aliasing
    + 负载均衡：Load Distribution

**DNS名字空间(The DNS Name Space)**

DNS域名结构
+ 一个层面命名设备会有很多重名
+ NDS采用层次树状结构的 命名方法
+ Internet 根被划为几百个顶级域(top lever domains)
  + 通用的(generic)
  .com; .edu ; .gov ; .int ; .mil ; .net ; .org ; .firm ; .hsop ; .web ; .arts ; .rec ; 
  +国家的(countries)
  .cn ; .us ; .nl ; .jp
+ 每个(子)域下面可划分为若干子域(subdomains)
+ 树叶是主

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271055314.png" alt="image-20221027105515254" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271100862.png" alt="image-20221027110023799" style="zoom:50%;" />

+ 域名的管理
  + 一个域管理其下的子域
   .jp 被划分为 ac.jp co.jp
  
   .cn 被划分为 edu.cn com.cn
  
  + 创建一个新的域，必须征得它所属域的同意
  
+ 域与物理网络无关
  + 域遵从组织界限，而不是物理网络
    + 一个域的主机可以不在一个网络 
    + 一个网络的主机不一定在一个域
  + 域的划分是逻辑的，而不是物理

**名字服务器(Name Server)**

+ 一个名字服务器的问题
  + 可靠性问题：单点故障
  + 扩展性问题：通信容量
  + 维护问题：远距离的集中式数据库
+ 区域(zone)
  + 区域的划分有区域管理者自己决定
  + 将DNS名字空间划分为互不相交的区域，每个区域都是树的一部分
  + 名字服务器： 
    + 每个区域都有一个名字服务器：维护着它所管辖区域的权威信息(authoritative record)
    + 名字服务器允许被放置在区域之外，以保障可靠

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271107892.png" alt="image-20221027110737818" style="zoom:50%;" />

权威DNS服务器：组织机构的DNS服务器，提供组织机构服务器（如Web和mail）可访问的主机和IP之间的映射，组织机构可以选择实现自己维护或由某个服务提供商来维护

**TLD服务器**

+ 顶级域(TLD)服务器：负责顶级域名（如com, org, net, edu和gov）和所有国家级的顶级域名（如cn, uk, fr, ca, jp ）
  + Network solutions 公司维护com TLD服务器
  + Educause公司维护edu TLD服务器

**区域名字服务器维护资源记录**

+ 资源记录(resource records)
  + 作用：维护 域名-IP地址(其它)的映射关系
  + 位置：Name Server的分布式数据库中
+ RR格式: (domain_name, ttl, type,class,Value)
  + Domain_name: 域名
  + Ttl: time to live : 生存时间(权威，缓冲记录)
  + Class 类别 ：对于Internet，值为IN
  + Value 值：可以是数字，域名或ASCII串
  + Type 类别：资源记录的类型—见下页

**DNS记录**

DNS ：保存资源记录(RR)的分布式数据库

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271115926.png" alt="image-20221027111542866" style="zoom:50%;" />

**资源记录**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271132989.png" alt="image-20221027113224909" style="zoom:50%;" />

DNS大致工作过程
+ 应用调用 解析器(resolver)
+ 解析器作为客户 向Name Server发出查询报文（封装在UDP段中）
+ Name Server返回响应报文(name/ip)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271139873.png" alt="image-20221027113954828" style="zoom:50%;" />

**本地名字服务器（Local Name Server）**

+ 并不严格属于层次结构
+ 每个ISP (居民区的ISP、公司、大学）都有一个本地DNS服务器
  + 也称为“默认名字服务器”
+ 当一个主机发起一个DNS查询时，查询被送到其本地DNS服务器
  +  起着代理的作用，将查询转发到层次结构中

**名字服务器(Name Server)**

+ 名字解析过程
  + 目标名字在Local Name Server中
    + 情况1：查询的名字在该区域内部
    + 情况2：缓存(cashing)

当与本地名字服务器不能解析名字时，联系根名字服务器顺着根-TLD一直找到权威名字服务器。

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271142467.png" alt="image-20221027114248425" style="zoom: 50%;" />

**递归查询**

+ 名字解析负担都放在当前联络的名字服务器上
+ 问题：根服务器的负担太重
+ 解决： 迭代查询(iterated queries)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271147623.png" alt="image-20221027114731574" style="zoom: 50%;" />

**迭代查询**

+ 主机cis.poly.edu 想知道主机 gaia.cs.umass.edu的IP地址
  + 根（及各级域名）服务器返回的不是查询结果，而是下一个NS的地址
  
  + 后由权威名字服务器给出解析结果
  
  + 当前联络的服务器给出可以联系的服务器的名字
  
    “我不知道这个名字，但可以向这个服务器请求”

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271156706.png" alt="image-20221027115618660" style="zoom: 50%;" />

*DNS协议：查询和响应报文的报文格式相同*

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271159768.png" alt="image-20221027115915717" style="zoom: 50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210271159759.png" alt="image-20221027115951702" style="zoom:50%;" />

**提高性能：缓存**

+ 一旦名字服务器学到了一个映射，就将该映射缓存起来
+ 根服务器通常都在本地服务器中缓存着
  + 根服务器不用经常被访问
+ 目的：提高效率
+  可能存在的问题：如果情况变化，缓存结果和权威资源记录不一致
+  解决方案：TTL（默认2天）

**维护问题：新增一个域**

+ 在上级域的名字服务器中增加两条记录，指向这个新增的子域的域名和域名服务器的地址
+ 在新增子域 的名字服务器上运行名字服务器，负责本域的名字解析： 名字->IP地址
例子：在com域中建立一个“Network Utopia”
+ 到注册登记机构注册域名networkutopia.com
  + 需要向该机构提供权威DNS服务器（基本的、和辅助的）的名字和IP地址
  + 登记机构在com TLD服务器中插入两条RR记录: (networkutopia.com,dns1.networkutopia.com, NS)
  (dns1.networkutopia.com, 212.212.212.1, A)
+ 在networkutopia.com的权威服务器中确保有
  + 用于Web服务器的 www.networkuptopia.com 的类型为A的记录
  + 用于邮件服务器mail.networkutopia.com的类型为MX的记

**攻击DNS**

DDoS 攻击
+ 对根服务器进行流量轰炸攻击：发送大量ping
  + 没有成功
  + 原因１：根目录服务器配置了流量过滤器，防火墙
  + 原因２：Local DNS 服务器缓存了TLD服务器的IP地址, 因此无需查询根服务器
+ 向TLD服务器流量轰炸攻击：发送大量查询
  + 可能更危险
  + 效果一般，大部分DNS缓存了TLD

重定向攻击
+ 中间人攻击
  + 截获查询，伪造回答，从而攻击某个（DNS回答指定的IP）站点
+ DNS中毒
  + 发送伪造的应答给DNS服务器，希望它能够缓存这个虚假的结果
+ 技术上较困难：分布式截获和伪造利用DNS基础设施进行DDoS
+ 伪造某个IP进行查询， 攻击这个目标IP
+ 查询放大，响应报文比查询报文大
+ 效果有限

### P2P应用

**纯P2P架构**

+ 没有（或极少）一直运行的服务器
+ 任意端系统都可以直接通信
+ 利用peer的服务能力
+ Peer节点间歇上网，每次IP地址都有可能变化

例子:
+ 文件分发 (BitTorrent)
+ 流媒体(KanKan)
+ VoIP (Skype)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210290949818.png" alt="image-20221029094951733" style="zoom:50%;" />

*文件分发: C/S vs P2P*

> 从一台服务器分发文件（大小F）到N个peer需要多少时间？

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291014883.png" alt="image-20221029101421842" style="zoom: 67%;" />


**文件分发时间: C/S模式**

服务器传输： 都是由服务器发送给peer，服务器必须顺序传输（上载）N个文件拷贝:

+ 发送一个copy: F/Us
+ 发送N个copy： NF/Us

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291011901.png" alt="image-20221029101124855" style="zoom: 50%;" />

+ 客户端: 每个客户端必须下载一个文件拷贝
+ d(min) = 客户端最小的下载速率
+ 下载带宽最小的客户端下载的时间：F/d(min)

文件下载耗时（随着N线性增长）
Dc-s > max{NF/us,,F/dmin

**文件分发时间: P2P模式**

+ 服务器传输：最少需要上载一份拷贝
  + 发送一个拷贝的时间：F/us 
+ 客户端: 每个客户端必须下载一个拷贝
  + 最小下载带宽客户单耗时：: F/dmin
+ 客户端: 所有客户端总体下载量NF
  + 最大上载带宽是：us+Sui
  + 除了服务器可以上载，其他所有的peer节点都可以上载

文件下载耗时（分子随着N线性变化，每个节点需要下载，整体下载量随着N增大，分母也是如此,随着peer节点的增多 每个peer也带了服务能力）
DP2P > max{F/us,,F/dmin,,NF/(us + Sui)}

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291048048.png" alt="image-20221029104814996" style="zoom:50%;" />

**P2P文件分发： BitTorrent**

+ 文件被分为一个个块256KB
+ 网络中的这些peers发送接收文件块，相互服务

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291059943.png" alt="image-20221029105916875" style="zoom:50%;" />

+ Peer加入torrent: 
  + 一开始没有块，但是将会通过其他节点处累积文件块
  + 向跟踪服务器注册，获得peer节点列表，和部分peer节点构成邻居关系 (“连接”)
+ 当peer下载时，该peer可以同时向其他节点提供上载服务
+ Peer可能会变换用于交换块的peer节点
+ 扰动churn: peer节点可能会上线或者下线
+ 一旦一个peer拥有整个文件，它会（自私的）离开或者保留（利他主义）在torrent中

**BitTorrent: 请求，发送文件块**

请求块：
+ 在任何给定时间，不同peer节点拥有一个文件块的子集
+ 周期性的，Alice节点向邻居询问他们拥有哪些块的信息
+ Alice向peer节点请求它希望的块，稀缺的块

发送块：一报还一报 tit-for-tat
+ Alice向4个peer发送块，这些块向它自己提供最大带宽的服务
  + 其他peer被Alice阻塞 (将不会从Alice处获得服务)
  + 每10秒重新评估一次：前4位
+ 每个30秒：随机选择其他peer节点，向这个节点发送块
  + “优化疏通” 这个节点
  + 新选择的节点可以加入这个top

> BitTorrent: tit-for-tat

(1) Alice “优化疏通” Bob
(2) Alice 变成了Bob的前4位提供者; Bob答谢Alice
(3) Bob 变成了Alice的前4提供者

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291104005.png" alt="image-20221029110439941" style="zoom:50%;" />

> 两大问题：

+ 如何定位所需资源
+ 如何处理对等方的加入与离开

> 可能的方案

+ 集中
+ 分散
+ 半分散

**P2P：集中式目录**
最初的“Napster”设计
1) 当对等方连接时，它告知中心服务器： 
+ IP地址
+ 内容
2) Alice查询 “双截棍.MP3”
3) Alice从Bob处请求文件

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291107182.png" alt="image-20221029110754130" style="zoom:50%;" />

> 存在的问题：文件传输是分散的，而定位内容则是高度集中的

+ 单点故障
+ 性能瓶颈
+ 侵犯版权

**查询洪泛：Gnutella**

+ 全分布式
  + 没有中心服务器
+ 开放文件共享协议
+ 许多Gnutella客户端实现了Gnutella协议
  + 类似HTTP有许多的浏览器

覆盖网络：图
+ 如果X和Y之间有一个TCP连接，则二者之间存在一条边
+ 所有活动的对等方和边就是覆盖网络
+ 边并不是物理链路
+ 给定一个对等方，通常所连接的节点少于10个

**Gnutella：协议**
+ 在已有的TCP连接上发送查询报文
+ 对等方转发查询报文
+ 以反方向返回查询命中报文

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291114139.png" alt="image-20221029111411086" style="zoom:50%;" />

可扩展性：限制范围的洪泛查询

**Gnutella：对等方加入**

   1.对等方X必须首先发现某些已经在覆盖网络中的其他对等方：使用可用对等方列表
  + 自己维持一张对等方列表（经常开机的对等方的IP）联系维持列表的Gnutella站点

2. X接着试图与该列表上的对等方建立TCP连接，直到与某个对等方Y建立连接
3. X向Y发送一个Ping报文，Y转发该Ping报文
4. 所有收到Ping报文的对等方以Pong报文响应IP地址、共享文件的数量及总字节数
5. X收到许多Pong报文，然后它能建立其他TCP连接

**利用不匀称性：KaZaA**

+ 每个对等方要么是一个组长，要么隶属于一个组长
  + 对等方与其组长之间有TCP连接
  + 组长对之间有TCP连接
+ 组长跟踪其所有的孩子的内容
+ 组长与其他组长联系
  + 转发查询到其他组长
  + 获得其他组长的数据拷贝

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291134187.png" alt="image-20221029113407144" style="zoom:50%;" />

**KaZaA：查询**

+ 每个文件有一个散列标识码和一个描述符
+ 客户端向其组长发送关键字查询
+ 组长用匹配进行响应：
  + 对每个匹配：元数据、散列标识码和IP地址
+ 如果组长将查询转发给其他组长，其他组长也可以匹配进行响应
+ 客户端选择要下载的文件
  + 向拥有文件的对等方发送一个带散列标识码的HTTP请求

**Kazaa小技巧**

+ 请求排队
  + 限制并行上载的数量
  + 确保每个被传输的文件从上载节点接收一定量的带宽
+ 激励优先权
  + 鼓励用户上载文件
  + 加强系统的扩展性
+ 并行下载
  + 从多个对等方下载同一个文件的不同部分
    + HTTP的字节范围首部
    + 更快地检索

> Distributed Hash Table (DHT)

+ 哈希表
+ DHT方案
+ 环形DHT以及覆盖网络
+ Peer波

### CDN

**存储视频的流化服务**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291556188.png" alt="image-20221029155627137" style="zoom:50%;" />

**多媒体流化服务：DASH**

+ DASH: Dynamic, Adaptive Streaming over HTTP

+ 服务器:
  + 将视频文件分割成多个块
  + 每个块独立存储，编码于不同码率（8-10种）
  + 告示文件（manifest file）: 提供不同块的URL
+ 客户端:
  + 先获取告示文件
  + 周期性地测量服务器到客户端的带宽
  + 查询告示文件,在一个时刻请求一个块，HTTP头部指定字节范围
    + 如果带宽足够，选择最大码率的视频块
    + 会话中的不同时刻，可以切换请求不同的编码块 (取决于当时的可用带宽)

+ “智能”客户端: 客户端自适应决定
  + 什么时候去请求块 (不至于缓存挨饿，或者溢出)
  + 请求什么编码速率的视频块 (当带宽够用时，请求高质量的视频块)
  + 哪里去请求块 (可以向离自己近的服务器发送URL，或者向高可用带宽的服务器请求) 

**Content Distribution Networks**

> 服务器如何通过网络向上百万用户同时流化视频内容?

1.单个的、大的超级服务中心“mega-server”
+ 服务器到客户端路径上跳数较多，瓶颈链路的带宽小导致停顿
+ “二八规律”决定了网络同时充斥着同一个视频的多个拷贝，效率低（付费高、带宽浪费、效果差）
+ 单点故障点，性能瓶颈
+ 周边网络的拥塞

评述：相当简单，但是这个方法不可扩展

2.通过CDN，全网部署缓存节点，存储服务内容，就近为用户提供服务，提高用户体验
+ enter deep: 将CDN服务器深入到许多接入网
  + 更接近用户，数量多，离用户近，管理困难
  + Akamai, 1700个位置
+ bring home: 部署在少数(10个左右)关键位置，如将服务器簇安装于POP附近（离若干1stISP POP较近）
  + 采用租用线路将服务器簇连接起来
  + Limelight

+ CDN: 在CDN节点中存储内容的多个拷贝 
• e.g. Netflix stores copies of MadMen

+ 用户从CDN中请求内容
• 重定向到最近的拷贝，请求内容
• 如果网络路径拥塞，可能选择不同的拷贝

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291608197.png" alt="image-20221029160806137" style="zoom:67%;" />

OTT 挑战: 在拥塞的互联网上复制内容

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291609698.png" alt="image-20221029160951642" style="zoom: 50%;" />

+ 从哪个CDN节点中获取内容？--最近的
+ 用户在网络拥塞时的行为？
+ 在哪些CDN节点中存储什么内容？

案例   1.<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291720097.png" alt="image-20221029172037028" style="zoom:50%;" />

案例   2.<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291721404.png" alt="image-20221029172146337" style="zoom: 50%;" />

### 套接字编程

**Socket编程**

应用进程使用传输层提供的服务才能够交换报文，实现应用协议，实现应用
+ TCP/IP：应用进程使用Socket API访问传输服务
+ 地点：界面上的SAP(Socket） 方式：Socket API
+ 目标: 学习如何构建能借助sockets进行通信的C/S应用程序
+ socket: 分布式应用进程之间的门，传输层协议提供的端到端服务接口

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291729027.png" alt="image-20221029172912971" style="zoom:50%;" />

2种传输层服务的socket类型:
+ TCP: 可靠的、字节流的服务
+ UDP: 不可靠（数据UDP数据报）服务

#### TCP套接字

套接字：应用进程与端到端传输协议（TCP或UDP）之间的门户
TCP服务：从一个进程向另一个进程可靠地传输字节流

服务器首先运行，等待连接建立

1：服务器进程必须先处于运行状态
+ 创建欢迎socket
+ 和本地端口捆绑
+ 在欢迎socket上阻塞式等待接收用户的连接

客户端主动和服务器建立连接：

2：创建客户端本地套接字（隐式捆绑到本地port）
+ 指定服务器进程的IP地址和端口号，与服务器进程连接

3 ：当与客户端连接请求到来时
+ 服务器接受来自用户端的请求，解除阻塞式等待，返回一个新的socket（与欢迎socket不一样），与客户端通信
  + 允许服务器与多个客户端通信
  + 使用源IP和源端口来区分不同的客户端

4：连接API调用有效时，客户端P与服务器建立了TCP连接

从应用程序的角度
TCP在客户端和服务器进程之间提供了可靠的、字节流（管道）服务

C/S模式的应用样例:
1) 客户端从标准输入装置读取一行字符，发送给服务器
2) 服务器从socket读取字符
3) 服务器将字符转换成大写，然后返回给客户端
4) 客户端从socket中读取一行字符，然后打印出来

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210291741987.png" alt="image-20221029174116934" style="zoom: 50%;" />

**TCP Socket交互**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210292017493.png" alt="image-20221029201725425" style="zoom:50%;" />

#### UDP套接字

UDP: 在客户端和服务器之间没有连接

• 没有握手
• 发送端在每一个报文中明确地指定目标的IP地址和端口号
• 服务器必须从收到的分组中提取出发送端的IP地址和端口号

UDP: 传送的数据可能乱序，也可能丢失

进程视角看UDP服务
UDP 为客户端和服务器提供不可靠的字节组的传送服务

**UDP Socket交互**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210292018020.png" alt="image-20221029201810960" style="zoom:50%;" />

## 传输层

### 传输服务和协议

+ 为运行在不同主机上的应用进程提供逻辑通信
+ 传输协议运行在端系统
  + 发送方：将应用层的报文分成报文段，然后传递给网络层
  + 接收方：将报文段重组成报文，然后传递给应用层
+ 有多个传输层协议可供应用选择
  + Internet: TCP和UDP

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210310937690.png" alt="image-20221031093703610" style="zoom:50%;" />

**传输层 vs. 网络层**

+ 网络层服务：主机之间的逻辑通信
+ 传输层服务：进程间的逻辑通信
+ 依赖于网络层的服务
  +  延时、带宽
+ 并对网络层的服务进行增强
  +  数据丢失、顺序混乱、加密

有些服务是可以加强的：不可靠 -> 可靠；安全 但有些服务是不可以被加强的：带宽，延迟

**Internet传输层协议**

+ 可靠的、保序的传输： TCP 
  + 多路复用、解复用
  + 拥塞控制
  + 流量控制
  + 建立连接
+ 不可靠、不保序的传输：UDP 
  + 多路复用、解复用
  + 没有为尽力而为的IP服务添加更多的其它额外服务
+ 都不提供的服务： 
  + 延时保证
  + 带宽保证

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210310947300.png" alt="image-20221031094738240" style="zoom:50%;" />

### 多路复用/解复用

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210310950989.png" alt="image-20221031095058919" style="zoom:50%;" />

**多路解复用工作原理**

+ 解复用作用：TCP或者UDP实体采用哪些信息，将报文段的数据部分交给正确的socket，而交给正确的进程
+ 主机收到IP数据报
  + 每个数据报有源IP地址和目标地址
  + 每个数据报承载一个传输层报文段
  + 每个报文段有一个源端口号和目标端口号(特定应用有著名的端口号)
+ 主机联合使用IP地址和端口号将报文段发送给合适的套接字

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210310955625.png" alt="image-20221031095552570" style="zoom:50%;" />

**无连接(UDP)多路解复用**

+ 创建套接字：
  服务器端：
  serverSocket=socket(PF_INET, SOCK_DGRAM,0);
  bind(serverSocket, &sad, sizeof(sad));
  serverSocket和Sad指定的端口号捆绑

  客户端：
  ClientSocket=socket(PF_INET, SOCK_DGRAM,0);
  没有Bind,ClientSocket和OS为之分配的某个端口号捆绑（客户端使用什么端口号无所谓，客户端主动找服务器）

+ 在接收端，UDP套接字用二元组标识 (目标IP地址、目标端口号)

+ 当主机收到UDP报文段：
  + 检查报文段的目标端口号
  + 用该端口号将报文段定位给套接字
  
+ 如果两个不同源IP地址/源端口号的数据报，但是有相同的目标IP地址和端口号，则被定位到相同的套接字

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311021870.png" alt="image-20221031102117822" style="zoom:50%;" />

**无连接的多路解复用**

+ 当主机接收到UDP段时：
  + 检查UDP段中的目标端口号
  + 将UDP段交给具备那个端口号的套接字

→ 具备相同目标IP地址和目标端口号，即使是源IP地址 或/且源端口号的IP数据报，将会被传到相同的目标UDP套接字上

**无连接多路复用:例子**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311026377.png" alt="image-20221031102603306" style="zoom: 33%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311026146.png" alt="image-20221031102648079" style="zoom: 33%;" />

**面向连接(TCP)的多路复用**

+ TCP套接字:四元组本地标识：
  + 源IP地址
  + 源端口号
  + 目的IP地址
  + 目的端口号
+ 解复用：接收主机用这四个值来将数据报定位到合适的套接字

+ 服务器能够在一个TCP端口上同时支持多个TCP套接字：
  + 每个套接字由其四元组标识（有不同的源IP和源PORT）
+ Web服务器对每个连接客户端有不同的套接字
  + 非持久对每个请求有不同的套接字
  

例子

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311234702.png" alt="image-20221031123410630" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311235443.png" alt="image-20221031123514382" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311236021.png" alt="image-20221031123613959" style="zoom:50%;" />

**面向连接的多路复用：多线程Web Server**

+ 一个进程下面可能有多个线程：由多个线程分别为客户提供服务
+ 在这个场景下，还是根据4元组决定将报文段内容同一个进程下的不同线程
+ 解复用到不同线

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202210311237135.png" alt="image-20221031123759084" style="zoom:50%;" />

### 无连接传输：UDP

**UDP: User Datagram Protocol**

+ “no frills,” “bare bones”Internet传输协议
+ “尽力而为”的服务，报文段可能
  + 丢失
  + 送到应用进程的报文段乱序
+ 无连接：
  + UDP发送端和接收端之间没有握手
  + 每个UDP报文段都被独立地处理

+ UDP 被用于:
  + 流媒体（丢失不敏感，速率敏感、应用可控制传输速率
  + DNS
  + SNMP
+ 在UDP上可行可靠传输: 
  + 在应用层增加可靠性
  + 应用特定的差错恢复

**UDP：用户数据报协议**

为什么要有UDP?
+ 不建立连接 （会增加延时）
+ 简单：在发送端和接收端没有连接状态
+ 报文段的头部很小(开销小)
+ 无拥塞控制和流量控制：
  UDP可以尽可能快的发送报文段
  + 应用->传输的速率= 主机->网络的速率

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211020921235.png" alt="image-20221102092138167" style="zoom:50%;" />

**UDP校验和**
目标： 检测在被传输报文段中的差错 (如比特反转)

发送方：
+ 将报文段的内容视为16比特的整数
+ 校验和：报文段的加法和 （1的补运算）
+ 发送方将校验和放在UDP的校验和字段

接收方：
+ 计算接收到的报文段的校验和
+ 检查计算出的校验和与校验和字段的内容是否相等：
  + 不相等–--检测到差错
  + 相等–--没有检测到差错，但也许还是有差错
    + 残存错误

**Internet校验和的例子**
+ 注意：当数字相加时，在最高位的进位要回卷，再加到结果上
例子：两个16比特的整数相加

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211020924702.png" alt="image-20221102092426653" style="zoom:50%;" />

+ 目标端：校验范围+校验和=1111111111111111 通过校验
  + 否则没有通过校验
  注：求和时，必须将进位回卷到结果上

### 可靠数据传输（rdt）的原理

+ rdt在应用层、传输层和数据链路层都很重要
+ 是网络Top 10问题之一

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211020928265.png" alt="image-20221102092819204" style="zoom:50%;" />

+ 信道的不可靠特点决定了可靠数据传输协议（ rdt ）的复杂性

**可靠数据传输：问题描述**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211020928381.png" alt="image-20221102092857315" style="zoom:50%;" />

我们将：
+ 渐增式地开发可靠数据传输协议（ rdt ）的发送方和接收方
+ 只考虑单向数据传输
  + 但控制信息是双向流动的！
+ 双向的数据传输问题实际上是2个单向数据传输问题的综合
+ 使用有限状态机 (FSM) 来描述发送方和接收方

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021633795.png" alt="image-20221102163330725" style="zoom: 50%;" />

**Rdt1.0： 在可靠信道上的可靠数据传输**

+ 下层的信道是完全可靠的
  + 没有比特出错
  + 没有分组丢失
+ 发送方和接收方的FSM
  + 发送方将数据发送到下层信道
  + 接收方从下层信道接收数据

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021636939.png" alt="image-20221102163626882" style="zoom:50%;" />

**Rdt2.0：具有比特差错的信道**
+ 下层信道可能会出错：将分组中的比特翻转
  + 用校验和来检测比特差错
+ 问题：怎样从差错中恢复：
  + 确认(ACK)：接收方显式地告诉发送方分组已被正确接收
  + 否定确认( NAK): 接收方显式地告诉发送方分组发生了差错
    + 发送方收到NAK后，发送方重传分组
+ rdt2.0中的新机制：采用差错控制编码进行差错检测
  + 发送方差错控制编码、缓存
  + 接收方使用编码检错
  + 接收方的反馈：控制报文（ACK，NAK）：接收方->发送方
  + 发送方收到反馈相应的动作

**rdt2.0：FSM描述**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021643144.png" alt="image-20221102164349084" style="zoom: 50%;" />

**rdt2.0：没有差错时的操作**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021644882.png" alt="image-20221102164436821" style="zoom:50%;" />

**rdt2.0：有差错时**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021646390.png" alt="image-20221102164643326" style="zoom:50%;" />

**rdt2.0的致命缺陷！-> rdt2.1**

如果ACK/NAK出错？
+ 发送方不知道接收方发生了什么事情！
+ 发送方如何做？
  + 重传？可能重复
  + 不重传？可能死锁(或出错)
+ 需要引入新的机制
  + 序号

处理重复：
+ 发送方在每个分组中加入序号
+ 如果ACK/NAK出错，发送方重传当前分组
+ 接收方丢弃（不发给上层）重复分组

> 发送方发送一个分组，然后等待接收方的应答

**rdt2.1：发送方处理出错的ACK/NAK**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021650282.png" alt="image-20221102165023222" style="zoom:50%;" />

**rdt2.1：接收方处理出错的ACK/NAK**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021652810.png" alt="image-20221102165230749" style="zoom:50%;" />

**rdt2.1：讨论**

发送方：
+ 在分组中加入序列号
+ 两个序列号（0，1）就足够了
  + 一次只发送一个未经确认的分组
+ 必须检测ACK/NAK是否出错（需要EDC ）
+ 状态数变成了两倍
  + 必须记住当前分组的序列号为0还是1

接收方：
+ 必须检测接收到的分组是否是重复的
  + 状态会指示希望接收到的分组的序号为0还是1
+ 注意：接收方并不知道发送方是否正确收到了其ACK/NAK
  + 没有安排确认的确认
  + 具体解释见下页

**rdt2.1的运行**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021656390.png" alt="image-20221102165625325" style="zoom:50%;" />

接收方不知道它最后发送的ACK/NAK是否被正确地收到
+ 发送方不对收到的ack/nak给确认，没有所谓的确认的确认;
+ 接收方发送ack，如果后面接收方收到的是：
  + 老分组p0？则ack 错误
  + 下一个分组？P1，ack正确

**rdt2.2：无NAK的协议**

+ 功能同rdt2.1，但只使用ACK(ack 要编号）
+ 接收方对最后正确接收的分组发ACK，以替代NAK
  + 接收方必须显式地包含被正确接收分组的序号
+ 当收到重复的ACK（如：再次收到ack0）时，发送方与收到NAK采取相同的动作：重传当前分组
+ 为后面的一次发送多个数据单位做一个准备
  + 一次能够发送多个
  + 每一个的应答都有：ACK，NACK；麻烦
  + 使用对前一个数据单位的ACK，代替本数据单位的nak
  + 确认信息减少一半，协议处理简单

**NAK free**
<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021722635.png" alt="image-20221102172247583" style="zoom: 50%;" />

**rat2.2的运行**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021723801.png" alt="image-20221102172335742" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021724803.png" alt="image-20221102172401750" style="zoom:50%;" />

**rdt2.2：发送方和接收方片断**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021725004.png" alt="image-20221102172508937" style="zoom:50%;" />

**rdt3.0：具有比特差错和分组丢失的信道**

新的假设：下层信道可能会丢失分组（数据或ACK）
+ 会死锁
+ 机制还不够处理这种状况：
  + 检验和
  + 序列
  + ACK
  + 重传

方法：发送方等待ACK一段合理的时间
+ 发送端超时重传：如果到时没有收到ACK->重传
+ 问题：如果分组（或ACK ）只是被延迟了：
  + 重传将会导致数据重复，但利用序列号已经可以处理这个问题
  + 接收方必须指明被正确接收的序列号
+ 需要一个倒计数定时器

**rdt3.0 发送方**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021837972.png" alt="image-20221102183736909" style="zoom:50%;" />

**rdt3.0的运行**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021838486.png" alt="image-20221102183813423" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021839516.png" alt="image-20221102183932446" style="zoom:50%;" />

+ 过早超时（延迟的ACK）也能够正常工作；但是效率较低，一半的分组和确认是重复的；
+ 设置一个合理的超时时间也是比较重要的

**rdt3.0的性能**

+ rdt3.0可以工作，但链路容量比较大的情况下，性能很差
  + 链路容量比较大，一次发一个PDU 的不能够充分利用链路的传输能力
+ 例：1 Gbps的链路，15 ms端-端传播延时，分组大小为1kB

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021845822.png" alt="image-20221102184532769" style="zoom:50%;" />

+ U sender：利用率 – 忙于发送的时间比例
+ 每30ms发送1KB的分组 -> 270kbps=33.75kB/s 的吞吐量（在1 Gbps 链路上）
+ 瓶颈在于：网络协议限制了物理资源

**rdt3.0：停-等操作**

![image-20221102185328621](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021853688.png)

**流水线：提高链路利用率**

![image-20221102185401828](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021854892.png)

+ 增加n,能提高链路利用率
+ 但当达到某个n,其u=100%时,无法再通过增加n，提高利用率
+ 瓶颈转移了->链路带宽

**流水线协议**
流水线：允许发送方在未得到对方确认的情况下一次发送多个分组
+ 必须增加序号的范围:用多个bit表示分组的序号
+ 在发送方/接收方要有缓冲区
  + 发送方缓冲：未得到确认，可能需要重传;
  + 接收方缓存：上层用户取用数据的速率≠接收到的数据速率；接收到的数据可能乱序，排序交付（可靠）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211021855594.png" alt="image-20221102185534537" style="zoom:50%;" />

+ 两种通用的流水线协议：回退

**通用：滑动窗口(slide window)协议**

+ 发送缓冲区
  + 形式：内存中的一个区域，落入缓冲区的分组可以发送
  + 功能：用于存放已发送，但是没有得到确认的分组
  + 必要性：需要重发时可用
+ 发送缓冲区的大小：一次最多可以发送多少个未经确认的分组
  + 停止等待协议=1
  + 流水线协议>1，合理的值，不能很大，链路利用率不能够超100%
+ 发送缓冲区中的分组
  + 未发送的：落入发送缓冲区的分组，可以连续发送出去;
  + 已经发送出去的、等待对方确认的分组：发送缓冲区的分组只有得到确认才能删除

**发送窗口滑动过程-相对表示方法**
+ 采用相对移动方式表示，分组不动
+ 可缓冲范围移动，代表一段可以发送的权力

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022153563.png" alt="image-20221102215314499" style="zoom:50%;" />

**滑动窗口(slide window)协议**

+ 发送窗口：发送缓冲区内容的一个范围
  + 那些已发送但是未经确认分组的序号构成的空间
+ 发送窗口的最大值<=发送缓冲区的值
+ 一开始：没有发送任何一个分组
  + 后沿=前沿
  + 之间为发送窗口的尺寸=0
+ 每发送一个分组，前沿前移一个单位

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022154459.png" alt="image-20221102215432413" style="zoom:50%;" />

**发送窗口的移动->前沿移动**

+ 发送窗口前沿移动的极限：不能够超过发送缓冲区

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022155232.png" alt="image-20221102215529182" style="zoom:50%;" />

+ 发送窗口前沿移动的极限：不能够超过发送缓冲区

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022156198.png" alt="image-20221102215602152" style="zoom: 50%;" />

**发送窗口的移动->后沿移动**

+ 发送窗口后沿移动
  + 条件：收到老分组的确认
  + 结果：发送缓冲区罩住新的分组，来了分组可以发送
  + 移动的极限：不能够超过前沿

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022157232.png" alt="image-20221102215715182" style="zoom:50%;" />

+ 发送窗口后沿移动
  + 条件：收到老分组(后沿)的确认
  + 结果：发送缓冲区罩住新的分组，来了分组可以发送
  + 移动的极限：不能超过前沿

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022158214.png" alt="image-20221102215819158" style="zoom:50%;" />

+ 滑动窗口技术
  + 发送窗口 (sending window)

![image-20221102221827058](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022218133.png)

**滑动窗口(slide window)协议-接收窗口**

+ 接收窗口 (receiving window)=接收缓冲区
+ 接收窗口用于控制哪些分组可以接收；
  + 只有收到的分组序号落入接收窗口内才允许接收
  + 若序号在接收窗口之外，则丢弃；
+ 接收窗口尺寸Wr=1，则只能顺序接收；
+ 接收窗口尺寸Wr>1 ，则可以乱序接收
  + 但提交给上层的分组，要按序
+ 例子：Wr＝1，在0的位置；只有0号分组可以接收；向前滑动一个，罩在1的位置，如果来了第2号分组，则丢弃

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022221492.png" alt="image-20221102222119437" style="zoom:50%;" />

+ 接收窗口的滑动和发送确认
  + 滑动：
    + 低序号的分组到来，接收窗口移动
    + 高序号分组乱序到，缓存但不交付（因为要实现rdt，不允许失序），不滑动
  + 发送确认：
    + 接收窗口尺寸=1：发送连续收到的最大的分组确认（累计确认）
    + 接收窗口尺寸>1：到分组，发送那个分组的确认（非累计确认）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022225870.png" alt="image-20221102222555812" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022226669.png" alt="image-20221102222657613" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022227196.png" alt="image-20221102222736124" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022228899.png" alt="image-20221102222851814" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211022229763.png" alt="image-20221102222935693" style="zoom:50%;" />

 

**GBN协议和SR协议的异同**

+ 相同之处
  + 发送窗口>1
  + 一次能够可发送多个未经确认的分组
+ 不同之处
  + GBN :接收窗口尺寸=1
    + 接收端：只能顺序接收
    + 发送端：从表现来看，一旦一个分组没有发成功，如：0,1,2,3,4,1未成功，234都发送出去了，要返回1再发送；GB1
+ SR: 接收窗口尺寸>1
  + 接收端：可以乱序接收
  + 发送端：发送0,1,2,3,4，一旦1未成功，2,3,4,已发送，无需重发，选择性发送1

**流水线协议：总结**

Go-back-N:
+ 发送端最多在流水线中有N个未确认的分组
+ 接收端只是发送累计型确认cumulative ack
  + 接收端如果发现gap，不确认新到来的分组
+ 发送端拥有对最老的未确认分组的定时器
  + 只需设置一个定时器
  + 当定时器到时时，重传所有未确认分组

**GBN：发送方扩展的FSM**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031101379.png" alt="image-20221103110139283" style="zoom:50%;" />

**GBN：接收方扩展的FSM**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031103693.png" alt="image-20221103110354638" style="zoom:50%;" />
+ 只发送ACK：对顺序接收的最高序号的分组
  + 可能会产生重复的ACK
  + 只需记住expectedseqnum；接收窗口=1
    + 只一个变量就可表示接收窗口
+ 对乱序的分组：
  + 丢弃（不缓存） -> 在接收方不被缓存！
  + 对顺序接收的最高序号的分组进行确认-累计确认

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031112757.png" alt="image-20221103111216709" style="zoom:50%;" />

**运行中的GBN**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031113486.png" alt="image-20221103111319392" style="zoom: 50%;" />

**选择重传SR**

+ 接收方对每个正确接收的分组，分别发送ACKn（非累积确认）
  + 接收窗口>1
    + 可以缓存乱序的分组
  + 终将分组按顺序交付给上层
+ 发送方只对那些没有收到ACK的分组进行重发-选择性重发
  + 发送方为每个未确认的分组设定一个定时器
+ 发送窗口的最大值（发送缓冲区）限制发送未确认分组的个数

**选择重传**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031116042.png" alt="image-20221103111658976" style="zoom:50%;" />

**选择重传SR的运行**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031117198.png" alt="image-20221103111749132" style="zoom:50%;" />

**对比GBN和SR**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031118708.png" alt="image-20221103111826652" style="zoom:50%;" />
+ 适用范围
  + 出错率低：比较适合GBN，出错非常罕见，没有必要用复杂的SR，为罕见的事件做日常的准备和复杂处理
+ 链路容量大（延迟大、带宽大）：比较适合SR而不是GBN，一点出错代价太大

**窗口的最大尺寸**
+ GBN: 2^n-1
+ SR:2^(n-1)
  例如：n=2; 序列号：0,1,2,3
  + GBN=3
  + SR=2 <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031122834.png" alt="image-20221103112228760" style="zoom:50%;" />


SR的例子：
+ 接收方看不到二者的区别！
+ 将重复数据误认为新数据 (a)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031123646.png" alt="image-20221103112305589" style="zoom:50%;" />

### 面向连接的传输： TCP

**TCP：概述**

+ 点对点：
  + 一个发送方，一个接收方
+ 可靠的、按顺序的字节流：
  + 没有报文边界
+ 管道化（流水线）：
  + TCP拥塞控制和流量控制设置窗口大小
+ 发送和接收缓存

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031125622.png" alt="image-20221103112547571" style="zoom:50%;" />

+ 全双工数据：
  + 在同一连接中数据流双向流动
  + MSS：最大报文段大小
+ 面向连接：
  + 在数据交换之前，通过握手（交换控制报文） 初始化发送方、接收方的状态变量
+ 有流量控制：
  + 发送方不会淹没接收方

**TCP报文段结构**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031127913.png" alt="image-20221103112749842" style="zoom:50%;" />

**TCP 序号, 确认号**

序号：
+ 报文段首字节的在字节流的编号
  确认号:

+ 期望从另一方收到的下一个字节的序号

+ 累积确认

Q:接收方如何处理乱序的报文段-没有规定

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031130498.png" alt="image-20221103113009442" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031130222.png" alt="image-20221103113053163" style="zoom:50%;" />

**TCP往返延时（RTT）和超时**
Q： 怎样设置TCP超时？
+ 比RTT要长
  + 但RTT是变化的
+ 太短：太早超时
  + 不必要的重传
+ 太长：对报文段丢失反应太慢，消极

Q：怎样估计RTT？
+ SampleRTT：测量从报文段发出到收到确认的时间
  + 如果有重传，忽略此次测量
+ SampleRTT会变化，因此估计的RTT应该比较平滑
  + 对几个最近的测量值求平均，而不是仅用当前的SampleRTT

+ 指数加权移动平均
+ 过去样本的影响呈指数衰减
+ 推荐值：α = 0.125

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211031137200.png" alt="image-20221103113726141" style="zoom:50%;" />

设置置超时
+ EstimtedRTT + 安全边界时间
  + EstimatedRTT变化大 (方差大) 较大的安全边界时间
+ SampleRTT会偏离EstimatedRTT多远

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042151755.png" alt="image-20221104215119677" style="zoom:50%;" />

**TCP：可靠数据传输**

+ TCP在IP不可靠服务的基础上建立了rdt
  + 管道化的报文段
    + GBN or SR
  + 累积确认（像GBN）
  + 单个重传定时器（像GBN）
  + 是否可以接受乱序的，没有规范
+ 通过以下事件触发重传
  + 超时（只重发那个最早的未确认段：SR）
  + 重复的确认
    + 例子：收到了ACK50,之后又收到3个ACK50

+ 首先考虑简化的TCP发送方：
  + 忽略重复的确认
  + 忽略流量控制和拥塞控制

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042158687.png" alt="image-20221104215850584" style="zoom:50%;" />

**TCP发送方事件**

从应用层接收数据：
+ 用nextseq创建报文段
+ 序号nextseq为报文段首字节的字节流编号
+ 如果还没有运行，启动定时器
  + 定时器与最早未确认的报文段关联
  + 过期间隔：TimeOutInterval

超时：
+ 重传后沿最老的报文段
+ 重新启动定时

收到确认：
+ 如果是对尚未确认的报文段确认
  + 更新已被确认的报文序号
  + 如果当前还有未被确认的报文段，重新启动定时器

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042218435.png" alt="image-20221104221826359" style="zoom: 50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042220153.png" alt="image-20221104222009049" style="zoom: 50%;" />

**TCP:重传**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042220945.png" alt="image-20221104222054850" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042224698.png" alt="image-20221104222436621" style="zoom: 50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042225399.png" alt="image-20221104222518297" style="zoom:50%;" />

**快速重传**

+ 超时周期往往太长：
  + 在重传丢失报文段之前的延时太长
+ 通过重复的ACK来检测报文段丢失
  + 发送方通常连续发送大量报文段
  + 如果报文段丢失，通常会引起多个重复的ACK

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042226060.png" alt="image-20221104222651998" style="zoom: 50%;" />

+ 如果发送方收到同一数据的3个冗余ACK，重传最小序号的段：
  + 快速重传：在定时器过时之前重发报文段
  + 它假设跟在被确认的数据后面的数据丢失了
    + 第一个ACK是正常的
    + 收到第二个该段的ACK，表示接收方收到一个该段后的乱序段
    收到第3，4个该段的ack，表示接收方收到该段之后的2个，3个乱序段，可能性非常大段丢失了

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042228508.png" alt="image-20221104222826437" style="zoom:33%;" />

**快速重传算法**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042228660.png" alt="image-20221104222856582" style="zoom:50%;" />

**TCP 流量控制**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042230429.png" alt="image-20221104223000333" style="zoom:50%;" />

+ 接收方在其向发送方的TCP段头部的rwnd字段“通告”其空闲buffer大小
  + RcvBuffer大小通过socket选项设置 (典型默认大小为4096 字节)
  + 很多操作系统自动调整RcvBuffer
+ 发送方限制未确认(“in-flight”)字节的个数≤接收方发送过来的 rwnd 值
+ 保证接收方不会被淹没

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042231423.png" alt="image-20221104223124358" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211042231282.png" alt="image-20221104223157199" style="zoom: 33%;" />

**TCP连接管理**

在正式交换数据之前，发送方和接收方握手建立通信关系:
+ 同意建立连接（每一方都知道对方愿意建立连接）
+ 同意连接参数

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051157248.png" alt="image-20221105115749166" style="zoom:50%;" />

**同意建立连接**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051201640.png" alt="image-20221105120102569" style="zoom:50%;" />

Q:在网络中，2次握手建立连接总是可行吗？
+ 变化的延迟（连接请求的段没有丢，但可能超时）
+ 由于丢失造成的重传 (e.g. req_conn(x))
+ 报文乱序
+ 相互看不到对方

**同意建立连接**
2次握手的失败场景：

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051202859.png" alt="image-20221105120239765" style="zoom: 33%;" />

**TCP 3次握手**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051208663.png" alt="image-20221105120828580" style="zoom:50%;" />

**3次握手解决：半连接和接收老数据问题**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051211619.png" alt="image-20221105121121523" style="zoom:50%;" />

**TCP 3次握手: FSM**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051212495.png" alt="image-20221105121219414" style="zoom:50%;" />

**TCP: 关闭连接**

+ 客户端，服务器分别关闭它自己这一侧的连接
  + 发送FIN bit = 1的TCP段
+ 一旦接收到FIN，用ACK回应
  + 接到FIN段，ACK可以和它自己发出的FIN段一起发送
+ 可以处理同时的FIN交

**TCP: 关闭连接**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051228725.png" alt="image-20221105122845642" style="zoom:50%;" />

**经典例子：红军和白军**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051237946.png" alt="image-20221105123707847" style="zoom: 33%;" />

### 拥塞控制原理拥塞控制原理

**拥塞:**

+ 非正式的定义: “太多的数据需要网络传输，超过了网络的处理能力”
+ 与流量控制不同
+ 拥塞的表现:
  + 分组丢失 (路由器缓冲区溢出)
  + 分组经历比较长的延迟(在路由器的队列中排队)

+ 网络中前10位的问题!

**拥塞的原因/代价: 场景1**

+ 2个发送端，2个接收端
+ 一个路由器，具备无限大的缓冲
+ 输出链路带宽：R 
+ 没有重传

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051613230.png" alt="image-20221105161321155" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051614870.png" alt="image-20221105161409809" style="zoom:50%;" />

**拥塞的原因/代价: 场景2**

+ 一个路由器，有限的缓冲
+ 分组丢失时，发送端重传
  + 应用层的输入=应用层输出:λlin = λout
  + 传输层的输入包括重传: λin>=λin

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051617530.png" alt="image-20221105161744466" style="zoom:50%;" />

理想化: 发送端有完美的信息
发送端知道什么时候路由器的缓冲是可用的<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051635545.png" alt="image-20221105163407611" style="zoom: 33%;" />

+ 只在缓冲可用时发送
+ 不会丢失:λ'in=λin

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051635753.png" alt="image-20221105163515689" style="zoom:50%;" />

理想化: 掌握丢失信息分组可以丢失，在路由器由于缓冲器满而被丢弃
+ 如果知道分组丢失了，发送方重传分组

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051639605.png" alt="image-20221105163957545" style="zoom:50%;" />

理想化: 掌握丢失信息分组可以丢失，在路由器由于缓冲器满而被丢弃<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051641941.png" alt="image-20221105164155891" style="zoom: 33%;" />
+ 如果发送端知道分组丢失了，发送方重传分组

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051643127.png" alt="image-20221105164316066" style="zoom:50%;" />

现实情况: 重复
+ 分组可能丢失，由于缓冲器满而被丢弃<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051648732.png" alt="image-20221105164808682" style="zoom:33%;" />
+ 发送端最终超时，发送第2个拷贝，2个分组都被传出

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051648179.png" alt="image-20221105164832116" style="zoom:50%;" />

现实情况: 重复
+ 分组可能丢失，由于缓冲器满而被丢弃
+ 发送端最终超时，发送第2个拷贝，2个分组都传到<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051651101.png" alt="image-20221105165101048" style="zoom:33%;" />

拥塞的“代价”:
+ 为了达到一个有效输出，网络需要做更多的工作（重传）
+ 没有必要的重传，链路中包括了多个分组的拷贝
  + 是那些没有丢失，经历的时间比较长（拥塞状态）但是超时的分组
  + 降低了的“goodput”

**拥塞的原因/代价: 场景3**

+ 4个发送端
+ 多重路径
+ 超时/重传

Q:当λin - λ'in增加时，会发生什么?
A:当红色的λ'in增加时，所有到来的蓝色分组都在最上方的队列中丢弃了，蓝色吞吐->0

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051654402.png" alt="image-20221105165412338" style="zoom:50%;" />

又一个拥塞的代价:  

+ 当分组丢失时，任何“关于这个分组的上游传输能力” 都被浪费了

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051655350.png" alt="image-20221105165508292" style="zoom:50%;" />

**2种常用的拥塞控制方法:**

端到端拥塞控制:
+ 没有来自网络的显式反馈
+ 端系统根据延迟和丢失事件推断是否有拥塞
+ TCP采用的方法

网络辅助的拥塞控制:
+ 路由器提供给端系统以反馈信息
+ 单个bit置位，显示有拥塞 (SNA, DECbit, TCP/IP ECN, ATM)
+ 显式提供发送端可以采用的速率

**ATM ABR 拥塞控制**

ABR: available bit rate:
+ “弹性服务” 
+ 如果发送端的路径“轻载”
  + 发送方使用可用带宽
+ 如果发送方的路径拥塞了
  + 发送方限制其发送的速度到一个最小保障速率上

RM (资源管理) 信元:
+ 由发送端发送,在数据信元中间隔插入
+ RM信元中的比特被交换机设置 (“网络辅助”) 
  + NI bit: no increase in rate (轻微拥塞)速率不要增加了
  + CI bit: congestion indication 拥塞指示
+ 发送端发送的RM 信元被接收端返回, 接收端不做任何改变

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051714633.png" alt="image-20221105171424574" style="zoom:50%;" />

+ 在RM信元中的2个字节 ER (explicit rate)字段
  + 拥塞的交换机可能会降低信元中ER的值
  + 发送端发送速度因此是最低的可支持速率
+ 数据信元中的EFCI bit: 被拥塞的交换机设置成1
  + 如果在管理信元RM前面的数据信元EFC被设置成了1, 接收端在返回的RM信元中设置CI bit


### TCP 拥塞控制：机制
+ 端到端的拥塞控制机制
+ 路由器不向主机有关拥塞的反馈信息
  + 路由器的负担较轻
  + 符合网络核心简单的TCP/IP架构原则
+ 端系统根据自身得到的信息，判断是否发生拥塞，从而采取动作

拥塞控制的几个问题
+ 如何检测拥塞
  + 轻微拥塞
  + 拥塞
+ 控制策略
  + 在拥塞发送时如何动作，降低速率
    + 轻微拥塞，如何降低
    + 拥塞时，如何降低
+ 在拥塞缓解时如何动作，增加速率

**TCP 拥塞控制：拥塞感知**

​	发送端如何探测到拥塞?

+ 某个段超时了（丢失事件 ）：拥塞
  + 超时时间到，某个段的确认没有来
  + 原因1：网络拥塞（某个路由器缓冲区没空间了，被丢弃）概率大
  + 原因2：出错被丢弃了（各级错误，没有通过校验，被丢弃）概率小
  + 一旦超时，就认为拥塞了，有一定误判，但是总体控制方向是对的
+ 有关某个段的3次重复ACK：轻微拥塞
  + 段的第1个ack，正常，确认绿段，期待红段
  + 段的第2个重复ack，意味着红段的后一段收到了，蓝段乱序到达
  + 段的第2、3、4个ack重复，意味着红段的后第2、3、4个段收到了，橙段乱序到达，同时红段丢失的可能性很大（后面3个段都到了，红段都没到）
  + 网络这时还能够进行一定程度的传输，拥塞但情况要比第一种好

**TCP拥塞控制：速率控制方法**
如何控制发送端发送的速率
+ 维持一个拥塞窗口的值：CongWin
+ 发送端限制已发送但是未确认的数据量（的上限）:
  LastByteSent-LastByteAcked <= CongWin
+ 从而粗略地控制发送方的往网络中注入的速率

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051809425.png" alt="image-20221105180955367" style="zoom:33%;" />

+ CongWin是动态的，是感知到的网络拥塞程度的函数
  + 超时或者3个重复ack，CongWin↓
    + 超时时：CongWin降为1MSS,进入SS阶段然后再倍增到CongWin/2（每个RTT），从而进入CA阶段
    + 3个重复ack ：CongWin降为CongWin/2,CA阶段
  + 否则（正常收到Ack，没有发送以上情况）：CongWin跃跃欲试↑
    + SS阶段：加倍增加(每个RTT)
    + CA阶段：线性增加(每个RTT)

**TCP拥塞控制和流量控制的联合动作**
联合控制的方法:

+ 发送端控制发送但是未确认的量同时也不能够超过接收窗口，满足流量控制要求
  + SendWin=min{CongWin, RecvWin}
  + 同时满足 拥塞控制和流量控

**TCP 拥塞控制：策略概述**
拥塞控制策略:

+ 慢启动
+ AIMD：线性增、乘性减少
+ 超时事件后的保守策略

**TCP 慢启动**

+ 连接刚建立, CongWin = 1 MSS
  + 如: MSS = 1460bytes & RTT = 200 msec
  + 初始速率 = 58.4kbps
+ 可用带宽可能>> MSS/RTT
  + 应该尽快加速，到达希望的速率
+ 当连接开始时，指数性增加发送速率，直到发生丢失的事件
  + 启动初值很低
  + 但是速度很快
+ 当连接开始时，指数性增加（每个RTT）发送速率直到发生丢失事件
  + 每一个RTT， CongWin加倍
  + 每收到一个ACK时，CongWin加1（why）
  + 慢启动阶段：只要不超时或3个重复ack，一个RTT， CongWin加倍
+ 总结: 初始速率很慢，但是加速却是指数性的
  + 指数增加，SS时间很短，长期来看可以忽略

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051939966.png" alt="image-20221105193920904" style="zoom: 50%;" />

**TCP 拥塞控制：AIMD**

乘性减:
丢失事件后将CongWin降为1，将CongWin/2作为阈值，进入慢启动阶段（倍增直到CongWin/2）
加性增：
当CongWin>阈值时，一个RTT如没有发生丢失事件 ,将CongWin加1MSS: 探测

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051950220.png" alt="image-20221105195041151" style="zoom:50%;" />

+ 当收到3个重复的ACKs:
  + CongWin 减半
  + 窗口（缓冲区大小）之后线性增长
+ 当超时事件发生时:
+ CongWin被设置成 1 MSS，进入SS阶段
+ 之后窗口指数增长
+ 增长到一个阈值（上次发生拥塞的窗口的一半）时，再线性增加

  思路
+ 3个重复的ACK表示网络还有一定的段传输能力
+ 超时之前的3个重复的ACK表示“警报”

**改进**

> Q:什么时候应该将指数性增长变成线性？

A:在超时之前，当CongWin变成上次发生超时的窗口的一半

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211051956349.png" alt="image-20221105195642281" style="zoom:50%;" />

实现:
+ 变量：Threshold 
+ 出现丢失，Threshold设置成 CongWin的1/2

**总结: TCP拥塞控制**

+ 当CongWin＜Threshold, 发送端处于慢启动阶段（slow-start）, 窗口指数性增长.
+ 当CongWin〉Threshold, 发送端处于拥塞避免阶段（congestion-avoidance）, 窗口线性增长.
+ 当收到三个重复的ACKs (triple duplicate ACK),Threshold设置成 CongWin/2， CongWin=Threshold+3.
+ 当超时事件发生时timeout, Threshold=CongWin/2CongWin=1 MSS，进入SS阶段

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052035667.png" alt="image-20221105203533573" style="zoom: 33%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052000929.png" alt="image-20221105200035853" style="zoom:50%;" />

**TCP 吞吐量**

+ TCP的平均吞吐量是多少，使用窗口window尺寸W和RTT来描述?
  + 忽略慢启动阶段，假设发送端总有数据传输
+ W：发生丢失事件时的窗口尺寸（单位：字节）
  + 平均窗口尺寸（#in-flight字节）：3/4W
  + 平均吞吐量：RTT时间吞吐3/4

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052001118.png" alt="image-20221105200146060" style="zoom:50%;" />

**TCP 未来: TCP over “long, fat pipes”**

  例如: 1500字节／段, 100ms RTT, 如果需要10 Gbps吞吐量
+ T=0.75W/R -> W=TR/0.75=12.5M字节=83333段
+ 需要窗口大小 W = 83,333 in-flight 段
  吞吐量用丢失率表示:

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052003282.png" alt="image-20221105200355235" style="zoom: 33%;" />

   -> L = 2·10-10 （为了达到10Gbps的吞吐，平均50亿段丢失一个） 非常非常小的丢失率！可能远远低于链路的物理丢失率，达不到的

+ 网络带宽增加，需要更新的TCP版本!

**TCP 公平性**

公平性目标: 如果 K个TCP会话分享一个链路带宽为R的瓶颈，每一个会话的有效带宽为 R/K

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052004819.png" alt="image-20221105200440760" style="zoom: 33%;" />

**为什么TCP是公平的?**
2个竞争的TCP会话:
+ 加性增加，斜率为1, 吞吐量增加
+ 乘性减，吞吐量比例减少

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052005731.png" alt="image-20221105200529670" style="zoom: 50%;" />

公平性和UDP
+ 多媒体应用通常不是用TCP
  + 应用发送的数据速率希望不受拥塞控制的节制
+ 使用UDP:
  + 音视频应用泵出数据的速率是恒定的, 忽略数据的丢失
+ 研究领域: TCP 友好性

公平性和并行TCP连接
+ 2个主机间可以打开多个并行的TCP连接
+ Web浏览器
+ 例如: 带宽为R的链路支持了9个连接;
  + 如果新的应用要求建1个TCP连接,获得带宽R/10
  + 如果新的应用要求建11个TCP连接,获得带宽R/2

**Explicit Congestion Notification (ECN)**
网络辅助拥塞控制:
+ TOS字段中2个bit被网络路由器标记，用于指示是否发生拥塞
+ 拥塞指示被传送到接收主机
+ 在接收方-到发送方的ACK中，接收方(在IP数据报中看到了拥塞指示）设置ECE bit，指示发送方发生了拥塞

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211052011546.png" alt="image-20221105201118472" style="zoom:50%;" />

## 网络层

### 数据平面与控制平面

**网络层服务**

+ 在发送主机和接收主机对之间传送段（segment）
+ 在发送端将段封装到数据报中
+ 在接收端，将段上交给传输层实体
+ 网络层协议存在于每一个主机和路由器
+ 路由器检查每一个经过它的IP数据报的头部

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081555085.png" alt="image-20221108155500972" style="zoom:67%;" />

**网络层的关键功能**

网络层功能：
+ 转发: 将分组从路由器的输入接口转发到合适的输出接口
+ 路由: 使用路由算法来决定分组从发送主机到目标接收主机的路径
  + 路由选择算法
  + 路由选择协议

旅行的类比：
+ 转发: 通过单个路口的过程
+ 路由: 从源到目的的路由路径规划过程

**网络层：数据平面、控制平面**

*数据平面* 
+ 本地，每个路由器功能

+ 决定从路由器输入端口到达的分组如何转发到输出端口

+ 转发功能：
  + 传统方式：基于目标地址+转发表
  + SDN方式：基于多个字段+流表
  *控制平面*
  
+ 网络范围内的逻辑

+ 决定数据报如何在路由器之间路由，决定数据报从源到目标主机之间的端到端路径

+ 2个控制平面方法: 

      • 传统的路由算法: 在路由器中被实现 
      • **software-defined networking (SDN):** 在远程的服务器中实现

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081600117.png" alt="image-20221108160044046" style="zoom:50%;" />

**传统方式：每一路由器(Per-router)控制平面**

在每一个路由器中的单独路由器算法元件，在控制平面进行交互

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081603537.png" alt="image-20221108160328433" style="zoom:50%;" />

**传统方式：路由和转发的相互作用**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081605776.png" alt="image-20221108160505690" style="zoom:50%;" />

**SDN方式：逻辑集中的控制平面**

一个不同的（通常是远程的）控制器与本地控制代理（CAs）交互

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081606570.png" alt="image-20221108160623463" style="zoom:50%;" />

**网络服务模型**

Q: 从发送方主机到接收方主机传输数据报的“通道”，网络提供什么样的服务模型？
对于单个数据报的服务:
+ 可靠传送
+ 延迟保证，如：少于40ms的延迟
对于数据报流的服务:
+ 保序数据报传送
+ 保证流的最小带宽
+ 分组之间的延迟

**连接建立**
+ 在某些网络架构中是第三个重要的功能
  + ATM, frame relay, X.25
+ 在分组传输之前，在两个主机之间，在通过一些路由器所构成的路径上建立一个网络层连接
  + 涉及到路由器
+ 网络层和传输层连接服务区别:
  + 网络层: 在2个主机之间，涉及到路径上的一些路由器
  + 传输层: 在2个进程之间，很可能只体现在端系统上(TCP连接)

**网络层服务模型:**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081617770.png" alt="image-20221108161726692" style="zoom:50%;" />

### 路由器组成

**路由器结构概况**

高层面(非常简化的)通用路由器体系架构
+ 路由：运行路由选择算法／协议 (RIP, OSPF, BGP)-生成路由表
+ 转发：从输入到输出链路交换数据报-根据路由表进行分组的转发

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081621564.png" alt="image-20221108162124491" style="zoom:50%;" />

**输入端口功能**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081624040.png" alt="image-20221108162413941" style="zoom:50%;" />

+ 根据数据报头部的信息如：目的地址，在输入端口内存中的转发表中查找合适的输出端口（匹配+行动）
+ 基于目标的转发：仅仅依赖于IP数据报的目标IP地址（传统方法）
+ 通用转发：基于头部字段的任意集合进行转发

**基于目标的转发**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081625043.png" alt="image-20221108162519962" style="zoom:50%;" />

> Q: 但是如果地址范围如果没有划分的特别规整，会发生什么？





**最长前缀匹配(longest prefix matching)**

当给定目标地址查找转发表时，采用最长地址前缀匹配的目标地址表项

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081803953.png" alt="image-20221108180306863" style="zoom:50%;" />

+ 最长前缀匹配：在路由器中经常采用TCAMs( ternary content addressable memories)硬件来完成
  + 内容可寻址：将地址交给TCAM，它可以在一个时钟周期内检索出地址，不管表空间有多大
  + Cisco Catalyst系列路由器: 在TCAM中可以存储多达约为1百万条路由表项

**输入端口缓存**
+ 当交换机构的速率小于输入端口的汇聚速率时,在输入端口可能要排队
  + 排队延迟以及由于输入缓存溢出造成丢失!
+ Head-of-the-Line (HOL) blocking: 排在队头的数据报阻止了队列中其他数据报向前移动

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081806376.png" alt="image-20221108180646316" style="zoom:50%;" />

**交换结构**

+ 将分组从输入缓冲区传输到合适的输出端口
+ 交换速率：分组可以按照该速率从输入传输到输出
  + 运行速度经常是输入/输出链路速率的若干倍
  + N个输入端口：交换机构的交换速度是输入线路速度的N倍比较理想，才不会成为瓶颈
+ 3种典型的交换机构

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081809481.png" alt="image-20221108180903422" style="zoom:50%;" /> 

**通过内存交换**

第一代路由器:
+ 在CPU直接控制下的交换，采用传统的计算机
+ 分组被拷贝到系统内存，CPU从分组的头部提取出目标地址，查找转发表，找到对应的输出端口，拷贝到输出端口
+ 转发速率被内存的带宽限制 (数据报通过BUS两遍)
+ 一次只能转发一个分组

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081810617.png" alt="image-20221108181055553" style="zoom:50%;" />

**通过总线交换**
+ 数据报通过共享总线，从输入端口转发到输出端口
+ 总线竞争: 交换速度受限于总线带宽<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081812640.png" alt="image-20221108181224586" style="zoom:33%;" />
+ 1次处理一个分组
+ 1 Gbps bus, Cisco 1900;32 Gbps bus, Cisco 5600;对于接入或企业级路由器，速度足够（但不适合区域或骨干网络）

**通过互联网络(crossbar等)的交换**
+ 同时并发转发多个分组，克服总线带宽限制
+ Banyan（榕树）网络，crossbar(纵横)和其它的互联网络被开发，将多个处理器连接成多处理器
+ 当分组从端口A到达，转给端口Y；控制器短接相应的两个总线<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081850864.png" alt="image-20221108184956431" style="zoom:50%;" />
+ 高级设计：将数据报分片为固定长度的信元，通过交换网络交换
+ Cisco12000：以60Gbps的交换速率通过互联网络

**输出端口**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081859298.png" alt="image-20221108185909231" style="zoom:33%;" />

+ 当数据报从交换机构的到达速度比传输速率快就需要输出端口缓存
+ 由调度规则选择排队的数据报进行传输

**输出端口排队**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081859605.png" alt="image-20221108185959541" style="zoom:50%;" />

+ 假设交换速率Rswitch是Rline的N倍（N：输入端口的数量）
+ 当多个输入端口同时向输出端口发送时，缓冲该分组（当通过交换网络到达的速率超过输出速率则缓存）
+ 排队带来延迟，由于输出端口缓存溢出则丢弃数据报

**调度机制**
+ 调度: 选择下一个要通过链路传输的分组

+ FIFO (first in first out) scheduling: 按照
  分组到来的次序发送
  + 现实例子?
  
  + 丢弃策略: 如果分组到达一个满的队列，哪个分组将会被抛弃?
    + tail drop: 丢弃刚到达的分组
    
    + priority: 根据优先权丢失/移除分组
    
    + random: 随机地丢弃/移除
    

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081905837.png" alt="image-20221108190552779" style="zoom:50%;" />

**调度策略：优先权**

优先权调度：发送最高优先权的分组
+ 多类，不同类别有不同的优先权
  + 类别可能依赖于标记或者其他的头部字段, e.g. IP source/dest, port numbers, ds，etc.
  + 先传高优先级的队列中的分组，除非没有
  + 高（低）优先权中的分组传输次序：FIFO

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081911766.png" alt="image-20221108191143692" style="zoom:50%;" />

**Round Robin (RR) scheduling:**

+ 多类
+ 循环扫描不同类型的队列, 发送完一类的一个分组，再发送下一个类的一个分组，循环所有类

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081920877.png" alt="image-20221108192057818" style="zoom:50%;" />

**Weighted Fair Queuing (WFQ):**

+ 一般化的Round Robin
+ 在一段时间内，每个队列得到的服务时间是：
Wi/(XIGMA(Wi)) *t，和权重成正比
+ 每个类在每一个循环中获得不同权重的服务量

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211081922626.png" alt="image-20221108192220569" style="zoom:50%;" />

### IP:Internet Protocol

**互联网的网络层**

主机,路由器中的网络层功能:

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100912728.png" alt="image-20221110091244629" style="zoom:50%;" />

**IP 数据报格式**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100914365.png" alt="image-20221110091417264" style="zoom:50%;" />

**IP 分片和重组(Fragmentation & Reassembly)**

+ 网络链路有MTU (最大传输单元) –链路层帧所携带的最大数据长度
  + 不同的链路类型
  + 不同的MTU 
+ 大的IP数据报在网络上被分片(“fragmented”)
  + 一个数据报被分割成若干个小的数据报
    + 相同的ID
    + 不同的偏移量
    + 最后一个分片标记为0
  + “重组”只在最终的目标主机进行
  + IP头部的信息被用于标识，排序相关分片

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100917997.png" alt="image-20221110091718907" style="zoom:67%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100930963.png" alt="image-20221110093039882" style="zoom:50%;" />

**IP 编址: 引论**

+ IP 地址: 32位标示，对主机或者路由器的接口编址
+ 接口: 主机/路由器和物理链路的连接处
  + 路由器通常拥有多个接口
  + 主机也有可能有多个接口
  + IP地址和每一个接口关联
+ 一个IP地址和一个接口相关联

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100933203.png" alt="image-20221110093341132" style="zoom:67%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100937982.png" alt="image-20221110093704893" style="zoom:50%;" />

+ IP地址:
  + 子网部分(高位bits)
  + 主机部分(地位bits) 
+ 什么是子网(subnet) ?
  + 一个子网内的节点（主机或者路由器）它们的IP地址的高位部分相同，这些节点构成的网络的一部分叫做子网
  + 无需路由器介入，子网内各主机可以在物理上相互直接到达

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100952697.png" alt="image-20221110095243600" style="zoom:50%;" />

方法：
+ 要判断一个子网, 将每一个接口从主机或者路由器上分开,构成了一个个网络的孤岛
+ 每一个孤岛（网络）都是一个都可以被称之为subnet.

子网掩码：11111111 11111111 11111111 00000000
Subnet mask: /24

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211100954846.png" alt="image-20221110095440752" style="zoom:50%;" />

+ Class A：126 networks ，16 million hosts
+ Class B：16382networks ，64 K hosts
+ Class C：2 million networks ，254 host 
+ Class D：multicast
+ Class E：reserved for future

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101000432.png" alt="image-20221110100035328" style="zoom: 50%;" />

**特殊IP地址**
+ 一些约定：
  + 子网部分: 全为 0---本网络
  + 主机部分: 全为0---本主机
  + 主机部分: 全为1--广播地址，这个网络的所有主机
+ 特殊IP地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101014236.png" alt="image-20221110101436139" style="zoom:67%;" />

**内网(专用)IP地址**

+ 专用地址：地址空间的一部份供专用地址使用
+ 永远不会被当做公用地址来分配, 不会与公用地址重复
  + 只在局部网络中有意义区分不同的设备
+ 路由器不对目标地址是专用地址的分组进行转发
+ 专用地址范围
  + Class A 10.0.0.0-10.255.255.255 MASK 255.0.0.0
  + Class B 172.16.0.0-172.31.255.255 MASK 255.255.0.0
  + Class C 192.168.0.0-192.168.255.255 MASK 255.255.255. 0

**IP 编址: CIDR**

CIDR: Classless InterDomain Routing（无类域间路由）
+ 子网部分可以在任意的位置
+ 地址格式: a.b.c.d/x, 其中 x 是 地址中子网号的长度

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101016829.png" alt="image-20221110101622727" style="zoom:50%;" />

**子网掩码(subnet mask)**

+ 32bits , 0 or 1 in each bit
  + 1: bit位置表示子网部分
  + 0:bit位置表示主机部分
+ 原始的A、B、C类网络的子网掩码分别是
  + A：255.0.0.0 ：11111111 00000000 0000000 00000000
  + B：255.255.0.0：11111111 11111111 0000000 00000000
  + C：255.255.255.0：11111111 11111111 11111111 00000000
+ CIDR下的子网掩码例子：
  + 11111111 11111111 11111100 00000000
+ 另外的一种表示子网掩码的表达方式
  + /#
  + 例：/22：表示前面22个bit为子网部分

**转发表和转发算法**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101030928.png" alt="image-20221110103043837" style="zoom: 50%;" />

+ 获得IP数据报的目标地址
+ 对于转发表中的每一个表项
  √  如 (IP Des addr) & (mask)== destination, 则按照表项对应的接口转发该数据报
  √  如果都没有找到,则使用默认表项转发数据报

**如何获得一个IP地址**

Q: 主机如何获得一个IP地址?
+ 系统管理员将地址配置在一个文件中
  + Wintel: control-panel->network->configuration->tcp/ip->properties
  + UNIX: /etc/rc.config
+ DHCP: Dynamic Host Configuration Protocol: 从服务器中动态获得一个IP地址
  + “plug-and-play”

**DHCP: Dynamic Host Configuration Protocol**
目标: 允许主机在加入网络的时候，动态地从服务器那里获得IP地址：
+ 可以更新对主机在用IP地址的租用期-租期快到了
+ 重新启动时，允许重新使用以前用过的IP地址
+ 支持移动用户加入到该网络（短期在网）
DHCP工作概况:
+ 主机广播“DHCP discover” 报文[可选]
+ DHCP 服务器用 “DHCP offer”提供报文响应[可选]
+ 主机请求IP地址：发送 “DHCP request” 报文
+ DHCP服务器发送地址：“DHCP ack” 报文

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101036018.png" alt="image-20221110103606899" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101036537.png" alt="image-20221110103633435" style="zoom:50%;" />

**DHCP: 不仅仅是IP addresses**

DHCP 返回:
+ IP 地址
+ 第一跳路由器的IP地址（默认网关）
+ DNS服务器的域名和IP地址
+ 子网掩码 (指示地址部分的网络号和主机号)

> Q: 如何获得一个网络的子网部分? 

A: 从ISP获得地址块中分配一个小地址块

>  Q: 一个ISP如何获得一个地址块? 

A: ICANN: Internet Corporation for Assigned  Names and Numbers
+ 分配地址
+ 管理DNS
+ 分配域名，解决冲突

**NAT: Network Address Translation**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101043213.png" alt="image-20221110104341106" style="zoom: 50%;" />

+ 动机: 本地网络只有一个有效IP地址:
  + 不需要从ISP分配一块地址，可用一个IP地址用于所有的（局域网）设备--省钱
  + 可以在局域网改变设备的地址情况下而无须通知外界
  + 可以改变ISP（地址变化）而不需要改变内部的设备地址
  + 局域网内部的设备没有明确的地址，对外是不可见的--安全

实现: NAT 路由器必须:
+ 外出数据包：替换源地址和端口号为NAT IP地址和新的端口号，目标IP和端口不变 …远端的C/S将会用NAP IP地址，新端口号作为目标地址
+ 记住每个转换替换对（在NAT转换表中） .. 源IP，端口 vs NAP IP ，新端口
+ 进入数据包：替换目标IP地址和端口号，采用存储在NAT表中的mapping表项，用（源IP，端口）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101058953.png" alt="image-20221110105859829" style="zoom: 33%;" />

+ 16-bit端口字段:
  + 6万多个同时连接，一个局域网!
+ 对NAT是有争议的:
  + 路由器只应该对第3层做信息处理，而这里对端口号（4层）作了处理
  + 违反了end-to-end 原则
    + 端到端原则：复杂性放到网络边缘
      + 无需借助中转和变换，就可以直接传送到目标主机
    + NAT可能要被一些应用设计者考虑, eg, P2P applications
    + 外网的机器无法主动连接到内网的机器上
  + 地址短缺问题可以被IPv6解决
  + NAT穿越：如果客户端需要连接在NAT后面的服务器，如何操作

**NAT 穿越问题**

+ 客户端需要连接地址为10.0.0.1的服务器
  + 服务器地址10.0.0.1 LAN本地地址 (客户端不能够使用其作为目标地址)
  + 整网只有一个外部可见地址: 138.76.29.7
+ 方案1: 静态配置NAT：转发进来的对服务器特定端口连接请求
  + e.g., (123.76.29.7, port 2500) 总是转发到10.0.0.1 port 25000

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101613082.png" alt="image-20221110161315995" style="zoom:50%;" />

+ 方案2: Universal Plug and Play (UPnP) Internet Gateway Device (IGD) 协议. 允许NATted主机可以:
  + 获知网络的公共 IP地址(138.76.29.7)
  + 列举存在的端口映射
  + 增/删端口映射 (在租用时间内)
  i.e., 自动化静态NAT端口映射配置

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101614155.png" alt="image-20221110161426090" style="zoom:50%;" />

+ 方案 3: 中继 (used in Skype)
  + NAT后面的服务器建立和中继的连接
  + 外部的客户端链接到中继
  + 中继在2个连接之间桥接

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101615857.png" alt="image-20221110161523775" style="zoom:50%;" />

**IPv6：动机**

+ 初始动机: 32-bit地址空间将会被很快用完
+ 另外的动机:
+ 头部格式改变帮助加速处理和转发
  + TTL-1
  + 头部checksum
  + 分片
+ 头部格式改变帮助QoS 

IPv6 数据报格式: 
+ 固定的40 字节头部
+ 数据报传输过程中，不允许分片

**IPv6 头部 (Cont)**
Priority: 标示流中数据报的优先级
Flow Label: 标示数据报在一个“flow.” ( “flow”的概念没有被严格的定义)
Next header: 标示上层协议

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101632539.png" alt="image-20221110163226476" style="zoom: 33%;" />

**和IPv4的其它变化**

+ Checksum: 被移除掉，降低在每一段中的处理速度
+ Options: 允许，但是在头部之外, 被 “Next Header” 字段标示
+ ICMPv6: ICMP的新版本
  + 附加了报文类型, e.g. “Packet Too Big”
  + 多播组管理功能

**从IPv4到IPv6的平移**
+ 不是所有的路由器都能够同时升级的
  + 没有一个标记日 “flag days”
  + 在IPv4和IPv6路由器混合时，网络如何运转? 
+ 隧道: 在IPv4路由器之间传输的IPv4数据报中携带IPv6数据报

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101636951.png" alt="image-20221110163629884" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211101637205.png" alt="image-20221110163750114" style="zoom: 33%;" />

IPv6: 应用
+ Google: 8% 的客户通过IPv6访问谷歌服务
+ NIST: 全美国1/3的政府域支持IPv6
+ 估计还需要很长时间进行部署
  + 20年以上!
  + 看看过去20年来应用层面的变化: WWW, Facebook, streaming media, Skype, …
> 为什么?

部署应用好比刷墙漆，而更换IPv6则是重新盖房子，无法很快的执行

### 路由选择算法

**路由(route)的概念**
+ 路由:按照某种指标(传输延迟,所经过的站点数目等)找到一条从源节点到目标节点的较好路径
  + 较好路径: 按照某种指标较小的路径
  + 指标:站数, 延迟,费用,队列长度等, 或者是一些单纯指标的加权平均
  + 采用什么样的指标,表示网络使用者希望网络在什么方面表现突出,什么指标网络使用者比较重视
+ 以网络为单位进行路由（路由信息通告+路由计算）
  + 网络为单位进行路由，路由信息传输、计算和匹配的代价低
  + 前提条件是：一个网络所有节点地址前缀相同，且物理上聚集
  + 路由就是：计算网络到其他网络如何走的问题
+ 网络到网络的路由= 路由器-路由器之间路由
  + 网络对应的路由器到其他网络对应的路由器的路由
  + 在一个网络中：路由器-主机之间的通信，链路层解决
  + 到了这个路由器就是到了这个网络
+ 路由选择算法(routing algorithm):网络层软件的一部分,完成路由功能

**网络的图抽象**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211140924184.png" alt="image-20221114092408085" style="zoom:50%;" />

G = (N,E)
N = 路由器集合 = { u, v, w, x, y, z }
E = 链路集合 ={ (u,v), (u,x), (v,x), (v,w), (x,w), (x,y), (w,y), (w,z), (y,z) }边有代价

**边和路径的代价**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211140927566.png" alt="image-20221114092737478" style="zoom:50%;" />

+ c(x,x’) = 链路的代价 (x,x’) - e.g., c(w,z) = 5
+ 代价可能总为1
+ 或是链路带宽的倒数
+ 或是拥塞情况的倒数

路由的输入：拓扑、边的代价、源节点
输出的输出：源节点的汇集树

**最优化原则(optimality principle)**

+ 汇集树(sink tree)
  + 此节点到所有其它节点的最优路径形成的树
  + 路由选择算法就是为所有路由器找到并使用汇集树

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211140928894.png" alt="image-20221114092831798" style="zoom:50%;" />

**路由的原则**

+ 路由选择算法的原则
  + 正确性(correctness):算法必须是正确的和完整的,使分组一站一站接力，正确发向目标站；完整：目标所有的站地址，在路由表中都能找到相应的表项；没有处理不了的目标站地址；
  + 简单性(simplicity):算法在计算机上应简单：最优但复杂的算法，时间上延迟很大，不实用，不应为了获取路由信息增加很多的通信量；
  + 健壮性(robustness):算法应能适应通信量和网络拓扑的变化：通信量变化，网络拓扑的变化算法能很快适应；不向很拥挤的链路发数据，不向断了的链路发送数据；
  + 稳定性(stability)：产生的路由不应该摇摆
  + 公平性(fairness)：对每一个站点都公平
  + 最优性(optimality)：某一个指标的最优，时间上，费用上，等指标，或综合指标；实际上，获取最优的结果代价较高，可以是次优的

**路由算法分类**
全局或者局部路由信息?
全局:
+ 的路由器拥有完整的拓扑和边的代价的信息
+ “link state” 算法
分布式:
+ 路由器只知道与它有物理连接关系的邻居路由器，和到相应邻居路由器的代价值
+ 叠代地与邻居交换路由信息、计算路由信息
+ “distance vector” 算法
静态或者动态的?
静态:
+ 路由随时间变化缓慢
动态:
+ 路由变化很快
  + 周期性更新
  + 根据链路代价的变化而变化

+ 非自适应算法(non-adaptive algorithm):不能适应网络拓扑和通信量的变化,路由表是事先计算好的
+ 自适应路由选择(adaptive algorithm):能适应网络拓扑和通信量的变化

**LS路由的工作过程**
+ 配置LS路由选择算法的路由工作过程
  + 各点通过各种渠道获得整个网络拓扑, 网络中所有链路代价等信息（这部分和算法没关系，属于协议和实现）
  + 使用LS路由算法,计算本站点到其它站点的最优路径(汇集树),得到路由表
  + 按照此路由表转发分组(datagram方式)
    + 严格意义上说不是路由的一个步骤
    + 分发到输入端口的网络层

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211140938969.png" alt="image-20221114093856895" style="zoom: 50%;" />

**链路状态路由选择(link state routing)**

LS路由的基本工作过程
1. 发现相邻节点,获知对方网络地址
2. 测量到相邻节点的代价(延迟,开销)
3. 组装一个LS分组,描述它到相邻节点的代价情况
4. 将分组通过扩散的方法发到所有其它路由器以上4步让每个路由器获得拓扑和边代价
5. 通过Dijkstra算法找出最短路径（这才是路由算法）
	1. 每个节点独立算出来到其他节点（路由器=网络）的最短路径
	2. 迭代算法：第k步能够知道本节点到k个其他节点的最短路径

**详细过程**

1. 发现相邻节点,获知对方网络地址
+ 一个路由器上电之后,向所有线路发送HELLO分组
+ 其它路由器收到HELLO分组,回送应答,在应答分组中,告知自己的名字(全局唯一)
+ 在LAN中,通过广播HELLO分组,获得其它路由器的信息,可以认为引入一个人工节点

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141003088.png" alt="image-20221114100348007" style="zoom: 50%;" />

2. 测量到相邻节点的代价(延迟,开销)
+ 实测法,发送一个分组要求对方立即响应
+ 回送一个ECHO分组
+ 通过测量时间可以估算出延迟情况
3. 组装一个分组,描述相邻节点的情况
+ 发送者名称
+ 序号,年龄
+ 列表: 给出它相邻节点,和它到相邻节点的延迟

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141005721.png" alt="image-20221114100515646" style="zoom: 50%;" />

4. 将分组通过扩散的方法发到所有其它路由器
+ 顺序号:用于控制无穷的扩散,每个路由器都记录(源路由器,顺序号),发现重复的或老的就不扩散
  + 具体问题1: 循环使用问题
  + 具体问题2: 路由器崩溃之后序号从0开始
  + 具体问题3:序号出现错误
+ 解决问题的办法:年龄字段(age)
  + 生成一个分组时,年龄字段不为0
  + 每个一个时间段,AGE字段减1
  + AGE字段为0的分组将被抛弃

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141007840.png" alt="image-20221114100740764" style="zoom:50%;" />

5. 通过Dijkstra算法找出最短路径
+ 路由器获得各站点LS分组和整个网络的拓扑
+ 通过Dijkstra算法计算出到其它各路由器的最短路径(汇集树)
+ 将计算结果安装到路由表中
+ LS的应用情况
  + OSPF协议是一种LS协议,被用于Internet上
  + IS-IS(intermediate system- intermediate system): 被用于Internet主干中, Netware 
+ 符号标记:
c(i,j): 从节点i 到j链路代价(初始状态下非相邻节点之间的链路代价为∞)
D(v): 从源节点到节点V的当前路径代价(节点的代价)
p(v): 从源到节点V的路径前序节点
N’: 当前已经知道最优路径的的节点集合(永久节点的集合)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141022763.png" alt="image-20221114102214694" style="zoom:50%;" />

+ LS路由选择算法的工作原理
  + 节点标记: 每一个节点使用(D(v),p(v)) 如：(3,B)标记
    + D(v)从源节点由已知最优路径到达本节点的距离
    + P(v)前序节点来标注
  + 2类节点
    + 临时节点(tentative node) :还没有找到从源节点到此节点的最优路径的节点
    + 永久节点(permanent node) N’:已经找到了从源节点到此节点的最优路径的节点

+ 初始化
  + 除了源节点外,所有节点都为临时节点
  + 节点代价除了与源节点代价相邻的节点外,都为∞
+ 从所有临时节点中找到一个节点代价最小的临时节点,将之变成永久节点(当前节点)W
+ 对此节点的所有在临时节点集合中的邻节点(V)
  + 如 D(v)>D(w) + c(w,v), 则重新标注此点, (D(W)+C(W,V), W)
  + 否则，不重新标注
+ 开始一个新的循环

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141029372.png" alt="image-20221114102958295" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141030408.png" alt="image-20221114103025305" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211141033798.png" alt="image-20221114103328693" style="zoom:50%;" />

**Dijkstra算法的讨论**

算法复杂度: n节点
+ 每一次迭代: 需要检查所有不在永久集合N中节点
+ n(n+1)/2 次比较: O(n2)
+ 有很有效的实现: O(nlogn)

可能的震荡：
+ e.g.,链路代价=链路承载的流量

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211142159537.png" alt="image-20221114215928431" style="zoom:50%;" />

**距离矢量路由选择(distance vector routing)**

+ 代价及相邻节点间代价的获得
  + 跳数(hops), 延迟(delay),队列长度
  + 相邻节点间代价的获得：通过实测
+ 路由信息的更新
  + 根据实测 得到本节点A到相邻站点的代价（如:延迟）
  + 根据各相邻站点声称它们到目标站点B的代价
  + 计算出本站点A经过各相邻站点到目标站点B的代价
  + 找到一个最小的代价，和相应的下一个节点Z，到达节点B经过此节点Z，并且代价为A-Z-B的代价
  + 其它所有的目标节点一个计算
  
  <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211142213616.png" alt="image-20221114221341539" style="zoom: 50%;" />

**例子**

+ 以当前节点J为例,相邻节点A,I,H,K
+ J测得到A,I,H,K的延迟为8ms,10ms,12ms,6ms
+ 通过交换DV, 从A,I,H,K获得到它们到G的延迟为18ms,31ms,6ms,31ms
+ 因此从J经过A,I,H,K到G的延迟为26ms,41ms,18ms,37ms
+ 将到G的路由表项更新为18ms, 下一跳为：H
+ 其它目标一样，除了本节点

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151551801.png" alt="image-20221115155151694" style="zoom: 50%;" />

**距离矢量算法**

Bellman-Ford 方程(动态规划)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151553820.png" alt="image-20221115155332748" style="zoom: 50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151554445.png" alt="image-20221115155421369" style="zoom:50%;" />

那个能够达到目标z最小代价的节点x，就在到目标节点的下一条路径上, 在转发表中使用

**距离矢量算法**

+ Dx(y) = 节点x到y代价最小值的估计
  + x 节点维护距离矢量Dx = [Dx(y): y є N ]
+ 节点x:
  + 知道到所有邻居v的代价: c(x,v)
  + 收到并维护一个它邻居的距离矢量集
  + 对于每个邻居, x 维护Dv = [Dv(y): y є N ]

核心思路:
+ 每个节点都将自己的距离矢量估计值传送给邻居，定时或者DV有变化时，让对方去算
+ 当x从邻居收到DV时，自己运算，更新它自己的距离矢量
  + 采用B-F equation:

  <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151557436.png" alt="image-20221115155732377" style="zoom:50%;" />
  
+ Dx(y)估计值最终收敛于实际的最小代价值dx(y)
  + 分布式、迭代算法

异步式,迭代: 每次本地迭代被以下事件触发: 
+ 本地链路代价变化了
+ 从邻居来了DV的更新消息
分布式:
+ 每个节点只是在自己的DV改变之后向邻居通告
  + 然后邻居们在有必要的时候通知他们的邻居

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151559957.png" alt="image-20221115155908890" style="zoom:50%;" />

**距离矢量路由选择(distance vector routing)**

+ DV的无穷计算问题
  + DV的特点
    + 好消息传的快 坏消息传的慢
  + 好消息的传播以每一个交换周期前进一个路由器的速度进行
    + 好消息:某个路由器接入或有更短的路径

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151601216.png" alt="image-20221115160145148" style="zoom:50%;" />

+ 坏消息的传播速度非常慢(无穷计算问题)
+ 例子:
  + 第一次交换之后, B从C处获得信息,C可以到达A(C-A,要经过B本身),但是路径是2,因此B变成3,从C处走
  + 第二次交换,C从B处获得消息, B可以到达A,路径为3, 因此,C到A从B走,代价为3
  + 无限此之后, 到A的距离变成INF,不可达

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151607113.png" alt="image-20221115160707037" style="zoom:50%;" />

**水平分裂(split horizon)算法**
+ 一种对无穷计算问题的解决办法
  + C知道要经过B才能到达A，所以C向B报告它到A的距离为INF；C 告诉D它到A的真实距离
  + D告诉E,它到A的距离,但D告诉C它通向A的距离为INF
  + 第一次交换: B通过测试发现到A的路径为INF,而C也告诉B到A的距离为INF,因此,B到A的距离为INF
  + 第二次交换: C从B和D那里获知,到A的距离为INF,因此将它到A的距离为INF
  + ……坏消息以一次交换一个节点的速度传播
   *不告诉下属到自己的真实路程，只问下属到下一个的真实距离*

+ 水平分裂的问题:在某些拓扑形式下会失败（存在环路）
+ 例子:
  + A,B到D的距离为2, C到D的距离为1、
  + 如果C-D路径失败，C获知到D为INF,从A,B获知到D的距离为INF,因此C认为D不可达
  + A从C获知D的距离为INF,但从B处获知它到D的距离为2,因此A到B的距离为3,从B走
  + B也有类似的问题
  + 经过无限次之后,A和B都知道到D的距离为INF

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151629325.png" alt="image-20221115162942246" style="zoom:50%;" />

**LS 和 DV 算法的比较**

消息复杂度（DV胜出）
+ LS: 有 n 节点, E 条链路,发送报文O(nE)个
  + 局部的路由信息；全局传播
+ DV: 只和邻居交换信息
  + 全局的路由信息，局部传播

收敛时间（LS胜出）
+ LS: O(n2) 算法
  + 有可能震荡
+ DV: 收敛较慢
  + 可能存在路由环路
  + count-to-infinity 问题

健壮性: 路由器故障会发生什么（LS胜出）
LS: 

+ 节点会通告不正确的链路代价
+ 每个节点只计算自己的路由表
+ 错误信息影响较小，局部，路由较健壮
DV:
+ DV节点可能通告对全网所有节点的不正确路径代价
  + 距离矢量
+ 每一个节点的路由表可能被其它节点使用
  + 错误可以扩散到全网

2种路由选择算法都有其优缺点，而且在互联网上都有应用

### 自治系统内部的路由选择

**RIP ( Routing Information Protocol)**
+ 在 1982年发布的BSD-UNIX 中实现
+ Distance vector 算法
  + 距离矢量:每条链路cost=1，# of hops (max = 15 hops) 跳数
  + DV每隔30秒和邻居交换DV，通告
  + 每个通告包括：最多25个目标子网

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151643291.png" alt="image-20221115164318220" style="zoom:50%;" />

**RIP 通告（advertisements）**

+ DV: 在邻居之间每30秒交换通告报文
  + 定期，而且在改变路由的时候发送通告报文
  + 在对方的请求下可以发送通告报文
+ 每一个通告: 至多AS内部的25个目标网络的DV
  + 目标网络+跳数（一次公告最多25个子网，最大跳数为16）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151705528.png" alt="image-20221115170500453" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151705233.png" alt="image-20221115170533153" style="zoom:50%;" />

**RIP: 链路失效和恢复**

如果180秒没有收到通告信息  -->  邻居或者链路失效
+ 发现经过这个邻居的路由已失效
+ 新的通告报文会传递给邻居
+ 邻居因此发出新的通告 (如果路由变化的话)
+ 链路失效快速(?)地在整网中传输
+ 使用毒性逆转（poison reverse）阻止ping-pong回路 (不可达的距离：跳数无限 = 16 段)

**RIP 进程处理**

+ RIP 以应用进程的方式实现：route-d (daemon)

+ 通告报文通过UDP报文传送，周期性重复

+ 网络层的协议使用了传输层的服务，以应用层实体的方式实现

  <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151707156.png" alt="image-20221115170713086" style="zoom:50%;" />

**OSPF (Open Shortest Path First)**

+ “open”: 标准可公开获得
+ 使用LS算法
  + LS 分组在网络中（一个AS内部）分发
  + 全局网络拓扑、代价在每一个节点中都保持
  + 路由计算采用Dijkstra算法
+ OSPF通告信息中携带：每一个邻居路由器一个表项
+ 通告信息会传遍AS全部（通过泛洪）
  + 在IP数据报上直接传送OSPF报文 (而不是通过UDP和TCP)
+ IS-IS路由协议：几乎和OSPF一样

**OSPF “高级” 特性(在RIP中的没有的)**
+ 安全: 所有的OSPF报文都是经过认证的 (防止恶意的攻击) 
+ 允许有多个代价相同的路径存在 (在RIP协议中只有一个)
+ 对于每一个链路，对于不同的TOS有多重代价矩阵
  + 例如：卫星链路代价对于尽力而为的服务代价设置比较低，对实时服务代价设置的比较高
  + 支持按照不同的代价计算最优路径，如：按照时间和延迟分别计算最优路径
+ 对单播和多播的集成支持: 
  + Multicast OSPF (MOSPF) 使用相同的拓扑数据库，就像在OSPF中一样
+ 在大型网络中支持层次性OSP

**层次化的OSPF路由**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211151722904.png" alt="image-20221115172201809" style="zoom: 50%;" />

+ 2个级别的层次性: 本地, 骨干
  + 链路状态通告仅仅在本地区域Area范围内进行
  + 每一个节点拥有本地区域的拓扑信息；
    + 关于其他区域，知道去它的方向，通过区域边界路由器（最短路径）
+ 区域边界路由器: “汇总（聚集）”到自己区域内网络的距离, 向其它区域边界路由器通告.
+ 骨干路由器: 仅仅在骨干区域内，运行OSPF路由
+ 边界路由器: 连接其它的AS’s.

### ISP之间的路由选择:  BGP

层次路由
+ 一个平面的路由
  + 一个网络中的所有路由器的地位一样
  + 通过LS, DV，或者其他路由算法，所有路由器都要知道其他所有路由器（子网）如何走
  + 所有路由器在一个平面

+ 平面路由的问题
  + 规模巨大的网络中，路由信息的存储、传输和计算代价巨大
    + DV: 距离矢量很大，且不能够收敛 
    + LS：几百万个节点的LS分组的泛洪传输，存储以及最短路径算法的计算
  + 管理问题：
    + 不同的网络所有者希望按照自己的方式管理网络
    + 希望对外隐藏自己网络的细节
    + 当然，还希望和其它网络互联

+ 层次路由：将互联网分成一个个AS(路由器区域)
  + 某个区域内的路由器集合，自治系统“autonomous systems” (AS)
  + 一个AS用AS Number（ASN)唯一标示
  + 一个ISP可能包括1个或者多个AS

+ 路由变成了: 2个层次路由
  + AS内部路由：在同一个AS内路由器运行相同的路由协议
    + “intra-AS” routing protocol：内部网关协议
    + 不同的AS可能运行着不同的内部网关协议
    + 能够解决规模和管理问题
    + 如：RIP,OSPF,IGRP
    + 网关路由器：AS边缘路由器，可以连接到其他AS
  + AS间运行AS间路由协议
    + “inter-AS” routing protocol：外部网关协议
    + 解决AS之间的路由问题，完成AS之间的互联互通

**层次路由的优点**

+ 解决了规模问题
  + 内部网关协议解决：AS内部数量有限的路由器相互到达的问题, AS内部规模可控
    + 如AS节点太多，可分割AS，使得AS内部的节点数量有限
  + AS之间的路由的规模问题
    + 增加一个AS，对于AS之间的路由从总体上来说，只是增加了一个节点=子网（每个AS可以用一个点来表示）
    + 对于其他AS来说只是增加了一个表项，就是这个新增的AS如何走的问题
    + 扩展性强：规模增大，性能不会减得太多

**互联网AS间路由：BGP**
+ BGP (Border Gateway Protocol): 自治区域间路由协议“事实上的”标准
  + “将互联网各个AS粘在一起的胶水”
+ BGP 提供给每个AS以以下方法：
  + eBGP: 从相邻的ASes那里获得子网可达信息
  + iBGP: 将获得的子网可达信息传遍到AS内部的所有路由器
  + 根据子网可达信息和策略来决定到达子网的“好”路径
+ 允许子网向互联网其他网络通告“我在这里”
+ 基于距离矢量算法（路径矢量）
  + 不仅仅是距离矢量，还包括到达各个目标网络的详细路径（AS 序号的列表）能够避免简单DV算法的路由环路问题

**eBGP, iBGP 连接**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170902692.png" alt="image-20221117090208536" style="zoom: 50%;" />

**BGP基础**

+ BGP 会话: 2个BGP路由器(“peers”)在一个半永久的TCP连接上交换BGP报文:
  + 通告向不同目标子网前缀的“路径”（BGP是一个“路径矢量”协议）

+ 当AS3网关路由器3a向AS2的网关路由器2c通告路径： AS3,X
  + 3a参与AS内由运算，知道本AS所有子网X信息
  + 语义上：AS3向AS2承诺，它可以向子网X转数据报
  + 3a是2c关于X的下一跳（next hop）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170905434.png" alt="image-20221117090502341" style="zoom:50%;" />

**路径的属性& BGP 路由**

+ 当通告一个子网前缀时，通告包括 BGP 属性
  + prefix + attributes = “route”
+ 2个重要的属性:
  + AS-PATH: 前缀的通告所经过的AS列表: AS 67 AS 17
    + 检测环路；多路径选择
    + 在向其它AS转发时，需要将自己的AS号加在路径上
  + NEXT-HOP: 从当前AS到下一跳AS有多个链路，在NETX-HOP属性中，告诉对方通过那个 I 转发.
  + 其它属性：路由偏好指标，如何被插入的属性
+ 基于策略的路由：
  + 当一个网关路由器接收到了一个路由通告, 使用输入策略来接受或过滤（accept/decline.）
    + 过滤原因例1：不想经过某个AS，转发某些前缀的分组
    + 过滤原因例2：已经有了一条往某前缀的偏好路径
  + 策略也决定了是向它别的邻居通告收到的这个路

**BGP 路径通告**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170913019.png" alt="image-20221117091328930" style="zoom: 50%;" />

+ 路由器AS2.2c从AS3.3a接收到的AS3,X路由通告 (通过 eBGP)
+ 基于AS2的输入策略，AS2.2c决定接收AS3,X的通告，而且通过iBGP）向AS2的所有路由器进行通告
+ 基于AS2的策略，AS2路由器2a通过eBGP向AS1.1c路由器通告AS2,AS3,X 路由信息
  + 路径上加上了 AS2自己作为AS序列的一跳

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170914841.png" alt="image-20221117091402737" style="zoom: 50%;" />

网关路由器可能获取有关一个子网X的多条路径，从多个eBGP会话上：

+ AS1 网关路由器1c从2a学习到路径：AS2,AS3,X
+ AS1网关路由器1c从3a处学习到路径AS3,X
+ 基于策略，AS1路由器1c选择了路径：AS3,X，而且通过iBGP告诉所有AS1内部的路由器

**BGP报文**

+ 使用TCP协议交换BGP报文.
+ BGP 报文:
  + OPEN: 打开TCP连接，认证发送方
  + UPDATE: 通告新路径 (或者撤销原路径)
  + KEEPALIVE：在没有更新时保持连接，也用于对OPEN 请求确认
  + NOTIFICATION: 报告以前消息的错误，也用来关闭连接

**BGP, OSPF, 转发表表项**

> Q:路由器是如何设置到这些远程子网前缀的转发表表项的？

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170922400.png" alt="image-20221117092208290" style="zoom: 50%;" />

> Q:路由器是如何设置到这些远程子网前缀的转发表表项的？

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170923844.png" alt="image-20221117092330731" style="zoom:50%;" />

**BGP 路径选择**

+ 路由器可能获得一个网络前缀的多个路径，路由器必须进行路径的选择，路由选择可以基于：
1. 本地偏好值属性: 偏好策略决定
2. 最短AS-PATH ：AS的跳数
3. 最近的NEXT-HOP路由器:热土豆路由
4. 附加的判据：使用BGP标示
+ 一个前缀对应着多种路径，采用消除规则直到留下一条路径

**热土豆路由**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170926711.png" alt="image-20221117092610603" style="zoom:50%;" />

+ 2d通过iBGP获知，它可以通过2a或者2c到达X
+ 热土豆策略：选择具备最小内部区域代价的网关作为往X的出口（如：2d选择2a，即使往X可能有比较多的AS跳数）：不要操心域间的代价！

**BGP: 通过路径通告执行策略**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170927887.png" alt="image-20221117092741791" style="zoom:50%;" />

+ A向B和C通告路径Aw
+ B选择不向C通告BAw：
  + B从CBAw的路由上无法获得收益，因为C,A,w都不是B的客户
  + C从而无法获知 CBAw路径的存在：每个ISP感知到的网络和真实不一致
+ C可能会通过 CAw (而不是使用B)最终路由到w

![image-20221117093344314](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170933408.png)

+ A,B,C 是 提供商网络：
+ X,W,Y 是桩网络（stub networks）或者叫端网络
+ X 是双重接入的，多宿桩网络，接入了2个网络
+ 策略强制让X:
  +  X不想路由从B通过X到C的分组
  +  因而X就不通告给B，它实际上可以路由到C

> 为什么内部网关协议和外部网关协议如此不同?

策略:
+ Inter-AS: 管理员需要控制通信路径，谁在使用它的网络进行数据传输；
+ Intra-AS: 一个管理者，所以无需策略;
  + AS内部的各子网的主机尽可能地利用资源进行快速路由
  规模:
+ AS间路由必须考虑规模问题，以便支持全网的数据转发
+ AS内部路由规模不是一个大的问题
  + 如果AS 太大，可将此AS分成小的AS；规模可控
  + AS之间只不过多了一个点而已
  + 或者AS内部路由支持层次性，层次性路由节约了表空间, 降低了更新的数据流量
  性能:
+ Intra-AS: 关注性能
+ Inter-AS: 策略可能比

### SDN控制平面

**传统方式：每-路由器(Per-router)控制平面**

在每一个路由器中的单独路由器算法元件，在控制平面进行交互

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170935569.png" alt="image-20221117093536442" style="zoom:50%;" />

**SDN方式：逻辑上集中的控制平面**

一个不同的（通常是远程的）控制器与本地控制代理（CAs）交互

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211170937232.png" alt="image-20221117093716104" style="zoom:67%;" />

**Software defined networking (SDN)**

为什么需要一个逻辑上集中的控制平面?
+ 网络管理更加容易：避免路由器的错误配置，对于通信流的弹性更好
+ 基于流表的转发（回顾一下OpenFlow API)，允许“可编程”的路由器
  + 集中式“编程”更加容易：集中计算流表然后分发
  + 传统方式分布式“编程”困难：在每个单独的路由器上分别运行分布式的算法，得转发表（部署和升级代价低）
    + 而且要求各分布式计算出的转发表都得基本正确
+ 控制平面的开放实现（非私有）
  + 新的竞争生态

**主框架到PC的演变**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211171027946.png" alt="image-20221117102718800" style="zoom:50%;" />

**流量工程: 传统路由比较困难**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211171027124.png" alt="image-20221117102753025" style="zoom:50%;" />

>  Q: 网管如果需要u到z的流量走uvwz,x到z的流量走xwyz，怎么办？

A: 需要定义链路的代价，流量路由算法以此运算（ IP路由面向目标，无法操作） (或者需要新的路由算法）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211171030850.png" alt="image-20221117103020751" style="zoom:50%;" />

> Q: 如果网管需要将u到z的流量分成2路：uvwz 和uxyz (负载均衡)，怎么办?（ IP路由面向目标）

A: 无法完成(在原有体系下只有使用新的路由选择算法，而在全网部署新的路由算法是个大的事情

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211171032993.png" alt="image-20221117103207886" style="zoom:50%;" />

> Q:如果需要w对蓝色的和红色的流量采用不同的路由，怎么办？

A: 无法操作 (基于目标的转发，采用LS, DV 路由)

**SDN特点**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211171033243.png" alt="image-20221117103346125" style="zoom: 50%;" />

**SDN 架构: 数据平面交换机**

+ 快速，简单，商业化交换设备采用硬件实现通用转发功能
+ 流表被控制器计算和安装
+ 基于南向API（例如OpenFlow），SDN控制器访问基于流的交换机
  + 定义了哪些可以被控制哪些不能
+ 也定义了和控制器的协议(eg.OpenFlow)

**SDN 控制器(网络OS):**
+ 维护网络状态信息
+ 通过上面的北向API和网络控制应用交互
+ 通过下面的南向API和网络交换机交互
+ 逻辑上集中，但是在实现上通常由于性能、可扩展性、容错性以及鲁棒性采用分布式方法实现

**网络控制应用: **
+ 控制的大脑： 采用下层提供的服务（SDN控制器提供的API)，实现网络功能
• 路由器 交换机
• 接入控制 防火墙
• 负载均衡
• 其他功能
+ 非绑定：可以被第三方提供，与控制器厂商以通常上不同，与分组交换机厂商也可以不同

**SDN控制器里的元件**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172223136.png" alt="image-20221117222319913" style="zoom:50%;" />

**OpenFlow 协议**

+ 控制器和SDN交换机交互的协议
+ 采用TCP来交换报文
  + 加密可选
+ 3种OpenFlow报文类型
  + 控制器>交换机
  + 异步（交换机>控制器）
  + 对称 (misc)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172225828.png" alt="image-20221117222504726" style="zoom:50%;" />

**OpenFlow: 控制器-交换机报文**

一些关键的控制器到交换机的报文
+ 特性：控制器查询交换机特性，交换机应答
+ 配置：交换机查询/设置交换机的配置参数
+ 修改状态：增加删除修改OpenFlow表中的流表
+ packet-out：控制器可以将分组通过特定的端口发出

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172227171.png" alt="image-20221117222718069" style="zoom:50%;" />

+ 分组进入: 将分组（和它的控制）传给控制器，见来自控制器的packet-out报文
+ 流移除: 在交换机上删除流表项
+ 端口状态: 通告控制器端口的变化

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172227118.png" alt="image-20221117222755006" style="zoom:50%;" />

**SDN: 控制/数据平面交互的例子**

1.S1, 经历了链路失效，采用OpenFlow报文通告控制器:端口状态报文
2.SDN 控制器接收OpenFlow报文，更新链路状态信息
3.Dijkstra路由算法应用被调用（前面注册过这个状态变化消息）
4.Dijkstra路由算法访问控制器中的网络拓扑信息，链路状态信息计算新路由
5.链路状态路由app和SDN控制器中流表计算元件交互，计算出新的所需流表
6.控制器采用OpenFlow在交换机上安装新的需要更新的流表

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172230331.png" alt="image-20221117223020214" style="zoom:50%;" />

**OpenDaylight (ODL) 控制器**

+ ODL Lithium 控制器
+ 网络应用可以在SDN 控制 内 或者 外面
+ 服务抽象层SAL：和内部以及外部的应用以及服务进行交互

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172231278.png" alt="image-20221117223144158" style="zoom:50%;" />

**ONOS 控制器**

+ 控制应用和控制器分离（应用app在控制器外部）
+ 意图框架：服务的高级规范：描述什么而不是如何
+ 相当多的重点聚焦在分布式核心上，以提高服务的可靠性，性能的可扩展性

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211172232568.png" alt="image-20221117223233430" style="zoom:50%;" />

**SDN: 面临的挑战**
+ 强化控制平面：可信、可靠、性能可扩展性、安全的分布式系统
  + 对于失效的鲁棒性： 利用为控制平面可靠分布式系统的强大理论
  + 可信任，安全：从开始就进行铸造
+ 网络、协议满足特殊任务的需求
  + e.g., 实时性，超高可靠性、超高安全性
+ 互联网络范围内的扩展性
  + 而不是仅仅在一个AS的内部部署，全网部署

## 链路层和局域网

**网络节点的连接方式**

+ 点到点连接
+ 多点连接：
  + 共享型介质
  + 通过网络交换机

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221146986.png" alt="image-20221122114604763" style="zoom:50%;" />

+ WAN:网络形式采用点到点链路
  + 带宽大、距离远（延迟大） >带宽延迟积大
  + 如果采用多点连接方式
    + 竞争方式：一旦冲突代价大
    + 令牌等协调方式：在其中协调节点的发送代价大
+ 点到点链路的链路层服务实现非常简单，封装和解封装

+ LAN一般采用多点连接方式
  + 连接节点非常方便
  + 接到共享型介质上（或网络交换机），就可以连接所有其他节点
+ 多点连接方式网络的链路层功能实现相当复杂
  + 多点接入：协调各节点对共享性介质的访问和使用
  + 竞争方式：冲突之后的协调
  + 令牌方式：令牌产生，占有和释放等

**链路层**

*术语*
+ 主机和路由器是节点（网桥和交换机也是）：nodes
+ 沿着通信路径,连接个相邻节点通信信道的是链路：links
  + 有线链路
  + 无线链路
  + 局域网，共享性链路
+ 第二层协议数据单元帧frame，封装数据报

数据链路层负责从一个节点通过链路将（帧中的）数据报发送到相邻的物理节点（一个子网内部的2节点）

**链路层：上下文**
+ 数据报（分组）在不同的链路上以不同的链路协议传送：
  + 第一跳链路：以太网
  + 中间链路：帧中继链路
  + 最后一跳802.11 :
+ 不同的链路协议提供不同的服务
+ e.g.比如在链路层上提供（或没有）可靠数据传送

传输类比
+ 从Princeton到Lausanne
  + 轿车: Princeton to JFK
  + 飞机: JFK to Geneva
  + 火车: Geneva to Lausanne
+ 旅行者=数据报datagram
+ 交通段=通信链路communication link
+ 交通模式=链路层协议 : 数据链路层和局域网protocol
+ 票务代理=路由算法routing algorith

**链路层服务**
+ 成帧，链路接入：
  + 将数据报封装在帧中，加上帧头、帧尾部
  + 如果采用的是共享性介质，信道接入获得信道访问权
  + 在帧头部使用“MAC”（物理）地址来标示源和目的
    + 不同于IP地址
+ 在（一个网络内）相邻两个节点完成可靠数据传递
  + 已经学过了（第三章）
  + 在低出错率的链路上（光纤和双绞线电缆）很少使用
  + 在无线链路经常使用：出错率高
> Q: 为什么在链路层和传输层都实现了可靠性

一般化的链路层服务，不是所有的链路层都提供这些服务一个特定的链路层只是提供其中一部分的服务

+ 在相邻节点间（一个子网内）进行可靠的转发
  + 在低差错链路上很少使用 (光纤,一些双绞线)
    + 出错率低，没有必要在每一个帧中做差错控制的工作，协议复杂
      + 发送端对每一帧进行差错控制编码，根据反馈做相应的动作
      + 接收端进行差错控制解码，反馈给发送端（ACK，NAK）
    + 在本层放弃可靠控制的工作，在网络层或者是传输层做可靠控制的工作，或者根本就不做可靠控制的工作
  + 在高差错链路上需要进行可靠的数据传送
     + 高差错链路：无线链路：

> Q：为什么要在采用无线链路的网络上，链路层做可靠数据传输工作；还要在传输层做端到端的可靠性工作？

原因：出错率高，如果在链路层不做差错控制工作，漏出去的错误比较高；到了上层如果需要可靠控制的数据传输代价会很大

如不做local recovery 工作，总体代价大

+ 流量控制：
  + 使得相邻的发送和接收方节点的速度匹配
+ 错误检测：
  + 差错由信号衰减和噪声引起
  + 接收方检测出的错误: 
    + 通知发送端进行重传或丢弃帧
+ 差错纠正: 
  + 接收端检查和纠正bit错误，不通过重传来纠正错误
+ 半双工和全双工:
  + 半双工：链路可以双向传输，但一次只有一个方向

**链路层在哪里实现**
+ 在每一个主机上
  + 也在每个路由器上
  + 交换机的每个端口上
+ 链路层功能在“适配器”上实现 (aka network interface card NIC) 或者在一个芯片组上
  + 以太网卡，802.11 网卡：以太网芯片组
  + 实现链路层和相应的物理层功能
+ 接到主机的系统总线上
+ 硬件、软件和固件的综合体

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221221156.png" alt="image-20221122122159051" style="zoom: 50%;" />

**适配器通信**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221224847.png" alt="image-20221122122415765" style="zoom:50%;" />

+ 发送方:
  + 在帧中封装数据报
  + 加上差错控制编码，实现RDT和流量控制功能等

+ 接收方：
  + 检查有无出错，执行rdt和流量控制功能等
  + 解封装数据报，将至交给上层

### 差错检测和纠正

**错误检测**

EDC=差错检测和纠正位（冗余位）
D =数据由差错检测保护，可以包含头部字段
错误检测不是100%可靠的

+ 协议会漏检一些错误，但是很少
+ 更长的EDC字段可以得到更好的检测和纠正效果

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221544216.png" alt="image-20221122154449074" style="zoom: 33%;" />

**奇偶校验**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221545684.png" alt="image-20221122154524565" style="zoom: 33%;" />

**Internet校验和**

目标: 检测在传输报文段时的错误（如位翻转），（注：仅仅用在传输层）

发送方:
+ 将报文段看成16-bit整数
+ 报文段的校验和: 和 (1’的补码和)
+ 发送方将checksum的值放在‘UDP校验和’字段

接收方:
+ 计算接收到的报文段的校验和
+ 检查是否与携带校验和字段值一致:
  + 不一致：检出错误
  + 一致：没有检出错误，但可能还是有错误

**检验和：CRC（循环冗余校验）**
+ 强大的差错检测码
+ 将数据比特 D, 看成是二进制的数据
+ 生成多项式G：双方协商r+1位模式（r次方）
  + 生成和检查所使用的位模式
+ 目标:选择r位 CRC附加位R，使得
  + <D,R> 正好被 G整除 (modulo 2)
  + 接收方知道 G, 将 <D,R>除以 G. 如果非0余数: 检查出错误!
  + 能检出所有少于r+1位的突发错误
+ 实际中广泛使用（以太网、802.11 WiFi、ATM）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221613826.png" alt="image-20221122161350735" style="zoom: 33%;" />

**CRC 例子**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221614032.png" alt="image-20221122161442891" style="zoom: 33%;" />

**CRC性能分析**

+ 突发错误和突发长度
+ CRC检错性能描述

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221615437.png" alt="image-20221122161544342" style="zoom: 33%;" />

### 多路访问协议

**多路访问链路和协议**

两种类型的链路（一个子网内部链路连接形式）：
+ 点对点
  + 拨号访问的PPP
  + 以太网交换机和主机之间的点对点链路
+ 广播 (共享线路或媒体)
  + 传统以太网
  + HFC上行链路
  + 802.11无线局域网

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221629001.png" alt="image-20221122162912914" style="zoom:50%;" />

**多点访问协议**
+ 单个共享的广播型链路
+ 2个或更多站点同时传送: 冲突（collision）
  + 多个节点在同一个时刻发送，则会收到2个或多个信号叠加

*多路访问协议（介质访问控制协议：MAC）*
+ 分布式算法-决定节点如何使用共享信道，即：决定节点什么时候可以发送？
+ 关于共享控制的通信必须用借助信道本身传输！
  + 没有带外的信道，各节点使用其协调信道使用
  + 用于传输控制信息

**理想的多路访问协议**

给定：Rbps的广播信道
必要条件：
1.当一个节点要发送时，可以R速率发送.
2.当M个节点要发送，每个可以以R/M的平均速率发送
3.完全分布的:

+ 没有特殊节点协调发送
+ 没有时钟和时隙的同步

4.简单

**MAC（媒体访问控制）协议：分类**
3大类:

+ 信道划分
  + 把信道划分成小片（时间、频率、编码）
  + 分配片给每个节点专用
+ 随机访问
  + 信道不划分，允许冲突
  + 冲突后恢复
+ 依次轮流
  + 节点依次轮流
  + 但是有很多数据传输的节点可以获得较长的信道使用权

**a.信道划分MAC协议：TDMA**

TDMA:time division multiple acces

+ 轮流使用信道，信道的时间分为周期
+ 每个站点使用每周期中固定的时隙(长度=帧传输时间)传输帧
+ 如果站点无帧传输，时隙空闲->浪费
+ 如：6站LAN，1、3、4有数据报，时隙2、5、6空闲

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221638519.png" alt="image-20221122163802447" style="zoom:50%;" />

FDMA: frequency division multiple access
+ 信道的有效频率范围被分成一个个小的频段
+ 每个站点被分配一个固定的频段
+ 分配给站点的频段如果没有被使用，则空闲
+ 例如：6站LAN，1、3、4有数据报，频段2、5、 6空闲

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211221639358.png" alt="image-20221122163919276" style="zoom:50%;" />

**a.码分多路访问（CDMA）**

+ CDMA (code division multiple access) : 
  + 所有站点在整个频段上同时进行传输,采用编码原理加以区分
  + 完全无冲突
  + 假定:信号同步很好,线性叠加
+ 比方
  + TDM：不同的人在不同的时刻讲话
  + FDM：不同的组在不同的小房间里通信
  + CDMA：不同的人使用不同的语言讲话

**b.随机存取协议**

+ 当节点有帧要发送时
  + 以信道带宽的全部 R bps发送
  + 没有节点间的预先协调
+ 两个或更多节点同时传输，会发生➜冲突“collision”
+ 随机存取协议规定: 
  + 如何检测冲突
  + 如何从冲突中恢复（如：通过稍后的重传）
+ 随机MAC协议:
  + 时隙ALOHA
  + ALOHA
  + CSMA, CSMA/CD, CSMA/CA

**b.1 时隙ALOHA**
假设
+ 所有帧是等长的
+ 时间被划分成相等的时隙，每个时隙可发送一帧
+ 节点只在时隙开始时发送帧
+ 节点在时钟上是同步的
+ 如果两个或多个节点在一个时隙传输，所有的站点都能检测到冲突

运行
+ 当节点获取新的帧，在下一个时隙传输
+ 传输时没有检测到冲突，成功
  + 节点能够在下一时隙发送新帧
+ 检测时如果检测到冲突，失败
  + 节点在每一个随后的时隙以概率p重传帧直到成功

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211231927424.png" alt="image-20221123192758312" style="zoom:50%;" />

优点
+ 节点可以以信道带宽全速连续传输
+ 高度分布：仅需要节点之间在时隙上的同步
+ 简单

缺点
+ 存在冲突，浪费时隙
+ 即使有帧要发送，仍然有可能存在空闲的时隙
+ 节点检测冲突的时间<帧传输的时间 
  + 必须传完
+ 需要时钟上同步

**时隙ALOHA的效率( Efficiency )**

效率：当有很多节点，每个节点有很多帧要发送时，x%的时隙是成功传输帧的时隙
+ 假设N个节点，每个节点都有很多帧要发送，在每个时隙中的传输概率是p
+ 一个节点成功传输概率是p(1-p)^N-1
+ 任何一个节点的成功概率是= Np(1-p)^N-1

+ N个节点的最大效率：求出使f(P)=Np(1-p)N-1最大的p*
+ 代入P*得到最大f(p*)=Np*(1-p*)N-1 
+ N为无穷大时的极限为1/e=0.37

最好情况：信道利用率37%

**b.2 纯ALOHA(非时隙)**
+ 无时隙ALOHA：简单、无须节点间在时间上同步
+ 当有帧需要传输：马上传输
+ 冲突的概率增加:
  + 帧在to发送，和其它在[to-1, to+1]区间内开始发送的帧冲突
  + 和当前帧冲突的区间（其他帧在此区间开始传输）增大

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232156904.png" alt="image-20221123215626805" style="zoom:50%;" />

**b.3 CSMA(载波侦听多路访问)**

Aloha: 如何提高ALOHA的效率发之前不管有无其他节点在传输
CSMA: 在传输前先侦听信道:
+ 如果侦听到信道空闲，传送整个帧
+ 如果侦听到信道忙，推迟传送
+ 人类类比：不要打断别人正在进行的说话

**b.4 CSMA/CD(冲突检测)**
CSMA/CD: 
+ 载波侦听CSMA：和在CSMA中一样发送前侦听信道
+ 没有传完一个帧就可以在短时间内检测到冲突
+ 冲突发生时则传输终止，减少对信道的浪费
+ 冲突检测CD技术，有线局域网中容易实现：
  + 检测信号强度，比较传输与接收到的信号是否相同
  + 通过周期的过零点检测
+ 人类类比：礼貌的对话人

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232202527.png" alt="image-20221123220202432" style="zoom:50%;" />

Ps：对信道的浪费减少了

**以太网CSMA/CD算法**

1. 适配器获取数据报，创建帧
2. 发送前：侦听信道CS
    1)闲：开始传送帧
    2)忙：一直等到闲再发送
    3.发送过程中，冲突检测CD
    1)没有冲突:成功
    2)检测到冲突:放弃,之后尝试重发

4.发送方适配器检测到冲突，除放弃外，还发送一个Jam信号，所有听到冲突的适配器也是如此。 强化冲突：让所有站点都知道冲突

5.如果放弃，适配器进入指数退避状态在第m次失败后，适配器随机选择一个{0，1，2， ， 2^m-1}中K，等待K*512位时，然后转到步骤2
exponential backoff二进制指数退避算法

指数退避: 
+ 目标：适配器试图适应当前负载，在一个变化的碰撞窗口中随机选择时间点尝试重发
  + 高负载：重传窗口时间大，减少冲突，但等待时间长
  + 低负载：使得各站点等待时间少，但冲突概率大
+ 首次碰撞：在{0，1}选择K；延迟K*512位时
+ 第2次碰撞：在{0，1，2，3}选择K
+ 第10次碰撞：在{0，1，2，3，……，1023}选择K

**CSMA/CD效率**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232212271.png" alt="image-20221123221214189" style="zoom:50%;" />

**b.5 无线局域网 CSMA/CA**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232213893.png" alt="image-20221123221302796" style="zoom:50%;" />

+ 冲突: 2+ 站点（AP或者站点）在同一个时刻发送
+ 802.11: CSMA – 发送前侦听信道
  + 不会和其它节点正在进行的传输发生冲突
+ 802.11: 没有冲突检测!
  + 无法检测冲突：自身信号远远大于其他节点信号
  + 即使能CD：冲突!=成功
  + 目标: avoid collisions: CSMA/C(ollision)A(voidance)
    + 无法CD，一旦发送一脑全部发送完毕，不CD
    + 为了避免无CD带来的信道利用率低的问题，事前进行冲突避免

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232214802.png" alt="image-20221123221439722" style="zoom:50%;" />

发送方
1 如果站点侦测到信道空闲持续DIFS长，则传输整个帧 (no CD)
2 如果侦测到信道忙碌，那么 选择一个随机回退值，并在信道空闲时递减该值；如果信道忙碌，回退值不会变化到数到0时（只生在信道闲时）发送整个帧如果没有收到ACK, 增加回退值，重复2
802.11 接收方 

- 如果帧正确，则在SIFS后发送ACK

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211232217374.png" alt="image-20221123221732295" style="zoom:50%;" />

**IEEE 802.11 MAC 协议: CSMA/CA**

+ 在count down时，侦听到了信道空闲为什么不发送，而要等到0时在发送
  + 2个站点有数据帧需要发送，第三个节点正在发送
  + LAN CD：让2者听完第三个节点发完，立即发送
    + 冲突：放弃当前的发送，避免了信道的浪费于无用冲突帧的发送
    + 代价不昂贵
+ WLAN : CA
  + 无法CD，一旦发送就必须发完，如冲突信道浪费严重，代价高昂
  + 思想：尽量事先避免冲突，而不是在发生冲突时放弃然后重发
    + 听到发送的站点，分别选择随机值，回退到0发送
      + 不同的随机值，一个站点会胜利
      + 失败站点会冻结计数器，当胜利节点发完再发

      <img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211251944856.png" alt="image-20221125194429770" style="zoom:33%;" />


+ 无法完全避免冲突
  + 两个站点相互隐藏：
  • A,B 相互隐藏，C在传输
  • A,B选择了随机回退值 
  • 一个节点如A胜利了，发送
  • 而B节点收不到，顺利count down到0 发送
  • A,B的发送在C附近形成了干扰 
  + 选择了非常靠近的随机回退值：
  • A,B选择的值非常近
  • A到0后发送
  • 但是这个信号还没达到B时
  • B也到0了，发送冲突

**冲突避免**
思想：允许发送方“预约”信道，而不是随机访问该信道: 避免长数据帧的冲突（可选项）

+ 发送方首先使用CSMA向BS发送一个小的RTS分组
  + RTS可能会冲突（但是由于比较短，浪费信道较少）
+ BS广播 clear-to-send CTS，作为RTS的响应
+ CTS能够被所有涉及到的节点听到
  + 发送方发送数据帧
  + 其它节点抑制发
> 采用小的预约分组，可以完全避免数据帧的冲突

**冲突避免：RTS-CTS交换**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211251946535.png" alt="image-20221125194629422" style="zoom:50%;" />

**b.5 线缆接入网络**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211251947136.png" alt="image-20221125194741021" style="zoom: 50%;" />
+ 多个40Mbps 下行(广播)信道,FDM
  + 下行：通过FDM分成若干信道，互联网、数字电视等 
  + 互联网信道：只有1个CMTS在其上传输
+ 多个30 Mbps上行的信道,FDM
  + 多路访问：所有用户使用；接着TDM分成微时隙
  + 部分时隙：分配；部分时隙：竞争

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211251951154.png" alt="image-20221125195114062" style="zoom: 50%;" />

DOCSIS: data over cable service interface spec 
+ 采用FDM进行信道的划分：若干上行、下行信道
+ 下行信道:
  + 在下行MAP帧中：CMTS告诉各节点微时隙分配方案，分配给各站点的上行微时隙
  + 另外：头端传输下行数据（给各个用户）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211251955187.png" alt="image-20221125195507101" style="zoom:50%;" />

DOCSIS: TDM上行信道
+ 采用TDM的方式将上行信道分成若干微时隙：MAP指定
+ 站点采用分配给它的微时隙上行数据传输：分配
+ 在特殊的上行微时隙中，各站点请求上行微时隙：竞争
  + 各站点对于该时隙的使用是随机访问的
  + 一旦碰撞（请求不成功，结果是：在下行的MAP中没有为它分配，则二进制退避）选择时隙上传输

**c.轮流(Taking Turns)MAC协议**

信道划分MAC协议:
+ 共享信道在高负载时是有效和公平的
+ 在低负载时效率低下
  + 只能等到自己的时隙开始发送或者利用1/N的信道频率发送
  + 当只有一个节点有帧传时，也只能够得到1/N个带宽分配
  随机访问MAC协议：
+ 在低负载时效率高：单个节点可以完全利用信道全部带宽
+ 高负载时：冲突开销较大，效率极低，时间很多浪费在冲突中
轮流协议
有2者的优点!

**轮询**<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211252007476.png" alt="image-20221125200704394" style="zoom:50%;" />


+ 主节点邀请从节点依次传送
+ 从节点一般比较“dumb”
+ 缺点:
  + 轮询开销：轮询本身消耗信道带宽
  + 等待时间：每个节点需等到主节点轮询后开始传输，即使只有一个节点，也需要等到轮询一周后才能够发送
  + 单点故障：主节点失效时造成整个系统无法工作

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211252007970.png" alt="image-20221125200759875" style="zoom: 50%;" />

令牌传递:
+ 控制令牌( token)循环从一个节点到下一个节点传递
+ 令牌报文：特殊的帧
+ 缺点:
  + 令牌开销：本身消耗带宽
  + 延迟：只有等到抓住令牌，才可传输
  + 单点故障 (token)：
    + 令牌丢失系统级故障，整个系统无法传输
    + 复杂机制重新生成令牌

**MAC 协议总结**

+ 多点接入问题：对于一个共享型介质，各个节点如何协调对它的访问和使用?
  + 信道划分：按时间、频率或者编码
    + TDMA、FDMA、CDMA
+ 随机访问 (动态)
• ALOHA, S-ALOHA, CSMA, CSMA/CD
• 载波侦听: 在有些介质上很容易 (wire：有线介质), 但在有些介质上比较困难 (wireless：无线)
• CSMA/CD ：802.3 Ethernet网中使用
• CSMA/CA ：802.11WLAN中使用
+ 依次轮流协议
  + 集中：由一个中心节点轮询；分布：通过令牌控制
  + 蓝牙、FDDI、令牌环

### LANs

**MAC 地址和ARP**

+ 32bitIP地址: 
  + 网络层地址
  + 前n-1跳：用于使数据报到达目的IP子网
  + 最后一跳：到达子网中的目标节点
+ LAN（MAC/物理/以太网）地址:
  + 用于使帧从一个网卡传递到与其物理连接的另一个网卡(在同一个物理网络中)
  + 48bit MAC地址固化在适配器的ROM，有时也可以通过软件设定
  + 理论上全球任何2个网卡的MAC地址都不相同

**网络地址和mac地址分离**

1. 分离好处
a) 网卡坏了，ip不变，可以捆绑到另外一个网卡的mac上
b) 物理网络还可以除IP之外支持其他网络层协议，链路协议为任意 上层网络协议， 如IPX等
2. 捆绑的问题
a) 如果仅仅使用IP地址，不用mac地址，那么它仅支持IP协议
b) 每次上电都要重新写入网卡 IP地址；
c) 另外一个选择就是不使用任何地址；不用MAC地址，则每到来一个帧都要上传到IP层次，由它判断是不是需要接受，干扰一次

**LAN 地址和ARP**

局域网上每个适配器都有一个唯一的LAN地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211282212521.png" alt="image-20221128221255400" style="zoom: 33%;" />

+ MAC地址由IEEE管理和分配
+ 制造商购入MAC地址空间（保证唯一性）
+ 类比:
(a)MAC地址：社会安全号
(b)IP地址：通讯地址
+ MAC平面地址 ➜ 支持移动
  + 可以将网卡到接到其它网络
+ IP地址有层次-不能移动
  + 依赖于节点连接的IP子网，与子网的网络号相同（有与其相连的子网相同的网络前缀）

**ARP: Address Resolution Protocol**

> 问题:已知B的IP地址，如何确定B的MAC地址?

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202211282218076.png" alt="image-20221128221800956" style="zoom: 33%;" />

+ 在LAN上的每个IP节点都有一个ARP表
+ ARP表：包括一些LAN节点IP/MAC地址的映射


< IP address; MAC address; TTL> 
+ TTL时间是指地址映射失效的时间
+ 典型是20min

**ARP协议：在同一个LAN (网络)**

+ A要发送帧给B(B的IP地址已知)， 但B的MAC地址不在A的ARP表中
+ A广播包含B的IP地址的ARP查询包
  + Dest MAC address = FF-FF-FF-FF-FF-FF
  + LAN上的所有节点都会收到该查询包
+ B接收到ARP包，回复A自己的MAC地址
  + 帧发送给A
  + 用A的MAC地址（单播）
+ A在自己的ARP表中，缓存IP-to-MAC地址映射关系，直到信息超时
  + 软状态: 靠定期刷新维持的系统状态
  + 定期刷新周期之间维护的状态信息可能和原有系统不一致
+ ARP是即插即用的
  + 节点自己创建ARP的表项
  + 无需网络管理员的干预

**路由到其他LAN**
Walkthrough :发送数据报：由A通过R到B，假设A知道B的IP地址
+ 在R上有两个ARP表，分别对应两个LAN
+ 在源主机的路由表中，发现到目标主机的下一跳时111.111.111.110
+ 在源主机的ARP表中，发现其MAC地址是E6-E9-00-17-BB-4B, etc

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021833202.png" alt="image-20221202183348052" style="zoom: 67%;" />

**编址：路由到其他LAN**

+ A创建数据报，源IP地址：A；目标IP地址：B 
+ A创建一个链路层的帧，目标MAC地址是R，该帧包含A到B的IP数据报

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021835229.png" alt="image-20221202183537128" style="zoom:67%;" />


+ 帧从A发送到R
+ 帧被R接收到，从中提取出IP分组，交给上层IP协议实体

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021838477.png" alt="image-20221202183811360" style="zoom: 67%;" />


+ R转发数据报，数据报源IP地址为A，目标IP地址为B
+ R创建一个链路层的帧，目标MAC地址为B，帧中包含A到B的IP数据报

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021840499.png" alt="image-20221202184002402" style="zoom: 67%;" />


![image-20221202184108306](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021841410.png)


**以太网**

+ 目前最主流的LAN技术：98%占有率
+ 廉价：30元RMB 100Mbps！
+ 最早广泛应用的LAN技术
+ 比令牌网和ATM网络简单、廉价
+ 带宽不断提升：10M, 100M, 1G, 10G

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212012132949.png" alt="image-20221201213207726" style="zoom: 50%;" />

**以太网：物理拓扑**

+ 总线：在上个世纪90年代中期很流行
  + 所有节点在一个碰撞域内，一次只允许一个节点发送
  + 可靠性差，如果介质破损，截面形成信号的反射，发送节点误认为是冲突，总是冲突
+ 星型：目前最主流
+ 连接选择: hub 或者 switch
+ 现在一般是交换机在中心
+ 每个节点以及相连的交换机端口使用（独立的）以太网协议（不会和其他节点的发送产生碰撞）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212012135126.png" alt="image-20221201213517999" style="zoom:50%;" />

**以太帧结构**

发送方适配器在以太网帧中封装IP数据报， 或其他网络层协议数据单元

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212012137769.png" alt="image-20221201213705659" style="zoom:50%;" />

前导码: 
+ 7B 10101010 + 1B 10101011
+ 用来同步接收方和发送方的时钟速率
  + 使得接收方将自己的时钟调到发送端的时钟
  + 从而可以按照发送端的时钟来接收所发送的
+ 地址：6字节源MAC地址，目标MAC地址
  + 如：帧目标地址=本站MAC地址，或是广播地址，接收，递交帧中的数据到网络层
  + 否则，适配器忽略该帧
+ 类型：指出高层协(大多情况下是IP，但也支持其它网络层协议Novell IPX和AppleTalk)
+ CRC：在接收方校验
  + 如果没有通过校验，丢弃错误帧

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212012138696.png" alt="image-20221201213851562" style="zoom:50%;" />

**以太网：无连接、不可靠的服务**

+ 无连接：帧传输前，发送方和接收方之间没有握手
+ 不可靠：接收方适配器不发送ACKs或NAKs给发送方
  + 递交给网络层的数据报流可能有gap
  + 如上层使用像传输层TCP协议这样的rdt，gap会被补上(源主机，TCP实体)
  + 否则，应用层就会看到gap
+ 以太网的MAC协议：采用二进制退避的CSMA/CD介质访问控制形式

**802.3 以太网标准：链路和物理层**
+ 很多不同的以太网标准
  + 相同的MAC协议（介质访问控制）和帧结构
  + 不同的速率：2 Mbps、10 Mbps 、100 Mbps 、 1Gbps、 10G bps
  + 不同的物理层标准
  + 不同的物理层媒介：光纤，同轴电缆和双绞线

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021847874.png" alt="image-20221202184724742" style="zoom:50%;" />

**以太网使用CSMA/CD**

+没有时隙
+ NIC如果侦听到其它NIC在发送就不发送：载波侦听carrier sense
+ 发送时，适配器当侦听到其它适配器在发送就放弃对当前帧的发送，冲突检测collision detection
+ 冲突后尝试重传，重传前适配器等待一个随机时间，随机访问random access

**以太网CSMA/CD算法**
1. 适配器获取数据报，创建帧
2. 发送前：侦听信道CS
1)闲：开始传送帧
2)忙：一直等到闲再发送

3.发送过程中，冲突检测CD
1)没有冲突:成功
2)检测到冲突:放弃,之后尝试重发

4.发送方适配器检测到冲突，除放弃外，还发送一个Jam信号，所有听到冲突的适配器也是如此
强化冲突：让所有站点都知道冲突

5.如果放弃，适配器进入指数退避状态在第m次失败后，适配器随机选择一个{0，1，2， ， 2^m-1}中K，等待K*512位时，然后转到步骤2 exponential backoff二进制指数退避算法

Jam Signal: 使其它发送方明确知道发生碰撞，48bits
Bit time: 10Mbps以太网1/10M=0.1us
对于K= 1023，大约等50ms：最坏情况
1023*512*0.1us=50ms
指数退避: 
+ 目标：适配器试图适应当前负载，在一个变化的碰撞窗口中随机选择时间点尝试重发
  + 高负载：重传窗口时间大，减少冲突，但等待时间长
  + 低负载：使得各站点等待时间少，但冲突概率大
+ 首次碰撞：在{0，1}选择K；延迟K*512位时
+ 第2次碰撞：在{0，1，2， 3}选择K
+ 第10次碰撞：在{0，1，2，3，……，1023}选择K

**10BaseT and 100BaseT**
+ 100 Mbps 速率 也被称之为 “fast ethernet”
+ T代表双绞线
+ 节点连接到HUB上: “star topology”物理上星型
  + 逻辑上总线型，盒中总线
+ 节点和HUB间的最大距离是100 m

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021854364.png" alt="image-20221202185420214" style="zoom:50%;" />

**Hubs**

Hubs 本质上是物理层的中继器:
+ 从一个端口收，转发到所有其他端口
+ 速率一致
+ 没有帧的缓存
+ 在hub端口上没有CSMA/CD机制:适配器检测冲突
+ 提供网络管理功能

**Manchester 编码**

![image-20221202185603425](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021856536.png)


+ 在 10BaseT中使用
+ 每一个bit的位时中间有一个信号跳变
+ 允许在接收方和发送方节点之间进行时钟同步
  + 节点间不需要集中的和全局的时钟
+ 10Mbps，使用20M带宽，效率50%
+ Hey, this is physical-layer stuff!

**100BaseT中的4b5b编码**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212021856752.png" alt="image-20221202185643622" style="zoom:50%;" />

**千兆以太网**

+ 采用标准的以太帧格式
+ 允许点对点链路和共享广播信道
+ 物理编码：8b10b编码
+ 在共享模式，继续使用CSMA/CD MAC技术，节点间需要较短距离以提高利用率
+ 交换模式：全双工千兆可用于点对点链路
  + 站点使用专用信道，基本不会冲突，效率高
  + 除非发往同一个目标

**IEEE 802.11 Wireless LAN**

+ 802.11b
  + 使用无需许可的2.4-5 GHz 频谱
    + 无绳电话和微波炉
  + 最高11 Mbps
  + 在物理层采用直接序列扩频
  direct sequence spread 
  spectrum (DSSS)
    +所有的主机采用同样的序列码
  不同：速率，物理层
  相同：MAC, 帧格式    
+ 802.11a
  + 更高频率5-6 GHz
  + 最高54 Mbps
  + 距离相对短，受多路径影响大
+ 802.11g
  + 频率2.4-5 GHz
  + 最大54 Mbps
  + 与802.11b向后兼容
+ 802.11n: 多天线MIMO
  + 频率2.4-5 GHz
  + 最高200 Mbps
+ 所有的802.11标准都是用CSMA/CA进行多路访问
+ 所有的802.11标准都有基站模式和自组织网络模式

**802.11 LAN 体系结构**
+ 无线主机与基站通信
  + 基站base station = 接入点access point (AP)
+ 基础设施模式下的基本服务集Basic Service Set (BSS) (aka“cell”) 包括以下构件:
  + 无线主机
  + 接入点(AP): 基站
  + 自组织模式下：只有无线主机

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031627860.png" alt="image-20221203162705693" style="zoom:50%;" />

**802.11: 信道与关联**

+ 802.11b: 2.4GHz-2.485GHz 频谱被分为11个相互不同的但是部分重叠的频段
  + AP管理员为AP选择一个频率
  + 可能的干扰: 邻居AP可能选择同样一个信道!
+ 主机: 必须在通信之前和AP建立associate
  + 扫描所有的信道，侦听包含AP SSID和MAC地址的信标帧
    + 主动扫描：主机发送探测，接受AP的响应
    + 被动扫描
  + 选择希望关联的AP
  + 可能需要执行鉴别（认证）[Chapter 8]
    + 基于MAC、用户名口令
    + 通过AP的中继，使用RADIUS鉴别服务器进行身份鉴别
  + 将会执行DHCP获得IP地址和AP所在子网前缀

**802.11: 被动/主动扫描**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031629367.png" alt="image-20221203162910214" style="zoom:50%;" />

被动扫描
(1) AP发送信标帧
(2) 关联请求帧的发送：H1向拟关联的AP
(3) 关联响应帧的发送: AP向H1
主动扫描
(1) H1广播探测请求帧
(2) 自AP发送探测响应
(3) H1向选择的AP发送关联请求帧
(4) 选择的AP向H1发送关联的响应帧

**802.11 帧：地址**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031633574.png" alt="image-20221203163348442" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031634569.png" alt="image-20221203163415418" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031635050.png" alt="image-20221203163508897" style="zoom:50%;" />

**Hub：集线器**

+ 网段(LAN segments) ：可以允许一个站点发送的网络范围
  + 在一个碰撞域，同时只允许一个站点在发送
  + 如果有2个节点同时发送，则会碰撞
  + 通常拥有相同的前缀，比IP子网更详细的前缀
+ 所有以hub连到一起的站点处在一个网段，处在一个碰撞域
  + 骨干hub将所有网段连到了一起
+ 通过hub可扩展节点之间的最大距离
+ 通过HUB,不能将10BaseT和100BaseT的网络连

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031637861.png" alt="image-20221203163726714" style="zoom:50%;" />

**交换机**
+ 链路层设备：扮演主动角色（端口执行以太网协议）
  + 对帧进行存储和转发
  + 对于到来的帧，检查帧头，根据目标MAC地址进行选择性转发
  + 当帧需要向某个（些）网段进行转发，需要使用CSMA/CD进行接入控制
  + 通常一个交换机端口一个独立网段
+ 透明：主机对交换机的存在可以不关心
  + 通过交换机相联的各节点好像这些站点是直接相联的一样
  + 有MAC地址；无IP地址
+ 即插即用，自学习：
  + 交换机无需配置

**交换机：多路同时传输**
+ 主机有一个专用和直接到交换机的连接
+ 交换机缓存到来的帧
+ 对每个帧进入的链路使用以太网协议，没有碰撞；全双工
  + 每条链路都是一个独立的碰撞域
  + MAC协议在其中的作用弱化了
+ 交换：A-to-A’ 和 B-to-B’ 可以同时传输，没有碰撞

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031640163.png" alt="image-20221203164044002" style="zoom:50%;" />

**交换机转发表**

> Q: 交换机如何知道通过接口1到达A，通过接口5到达 B’?

+ A: 每个交换机都有一个交6换表 switch table, 每个表项:
  + (主机的MAC地址,到达该MAC经过的接口，时戳)
  + 比较像路由表!
> Q: 每个表项是如何创建的？如何维护的?

 有点像路由协议?

**交换机：自学习**
+ 交换机通过学习得到哪些主机（mac地址）可以通过哪些端口到达
  + 当接收到帧，交换机学习到发送站点所在的端口（网段）
  + 记录发送方MAC地址/进入端口映射关系，在交换表中

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031647058.png" alt="image-20221203164748916" style="zoom:50%;" />

**交换机：过滤／转发**
当交换机收到一个帧:
1.记录进入链路，发送主机的MAC地址
2.使用目标MAC地址对交换表进行索引

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031650979.png" alt="image-20221203165003821" style="zoom:50%;" />

**自学习，转发的例子**
+ 帧的目标： A’, 不知道其位置在哪：泛洪
+ 知道目标A对应的链路：选择性发送到哪个端口 

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031653024.png" alt="image-20221203165318889" style="zoom:50%;" />

**交换机级联**

+ 交换机可被级联到一起

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031654342.png" alt="image-20221203165409189" style="zoom:50%;" />

Q: A to G的发送 – 交换机S1如何知道经过从S4和S3最终达到F?
A: 自学习! (和在一个交换机联接所有站点一样!)

**VLANs: 动机**
考虑场景：
+ CS用户搬到EE大楼办公室，但是希望连接到CS的交换机?
  + 接到多个交换机上
  + 麻烦和浪费：96端口/10个有用
+ 如果都接到一个交换机上，在一个广播域
  + 所有的层2广播流量(ARP, DHCP,不知道MAC地址对应端口的帧)都必须穿过整个LAN
  + 安全性/私密性的

**VLANs**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031743000.png" alt="image-20221203174341869" style="zoom:50%;" />

基于端口的VLAN: 交换机端口成组( 通过交换机管理软件)，以至于单个的交换机可以分成若干虚拟LANs

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031744166.png" alt="image-20221203174450006" style="zoom:50%;" />

**基于端口的VLAN**

+ 流量隔离: 从/到1-8端口的流量只会涉及到1-8
  + 也可以基于MAC地址进行VLAN定义
+ 动态成员: 成员可以在VLANs之间动态分配router
+ 在VLANs间转发:通过路由器进行转发 (就像他们通过各自的交换机相联一样)
  + 实际操作中，设备生产商可以提供：交换机和路由器的单一设备

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212031746858.png" alt="image-20221203174623704" style="zoom: 67%;" />

**VLANs 互联多个交换机**

+ 如果有多个交换机，希望它们相连并且共享VLANs信息
+ 方法1：各交换机每个VLAN一个端口和另外交换机相应VLAN端口相连->扩展性问题
+ trunk port干线端口: 多个交换机共享定义的VLAN，在它们之间传输帧
  + 帧在不同交换机上的一个VLAN上转发，不能够再使用vanilla 802.1帧 (必须要携带VLAN ID信息)
  + 802.1q协议增加/移除附加的头部字段，用于在trun端口上进行帧的转发

**802.1Q VLAN 帧格式**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212032031174.png" alt="image-20221203203103998" style="zoom:50%;" />



### 链路虚拟化

**MPLS概述**
+ 从IP网络来看，将一组支持MPLS的网络虚拟成链路的技术
+ 纯IP网络是按照IP地址对分组进行转发的
  + 前缀匹配，转发的方法固定
  + 无法控制IP分组的路径，无法支持流连工程
  + 也无法对一个IP分组流进行资源分配，性能无法保证
+ MPLS网络按照标签label进行分组的转发
  + 类似于VC
  + 有基于标签的转发表
  + 基于虚电路表，IP vs 线路交换
+ 标签交换的过程：
  + 入口路由器:LER对进入的分组按照EFC的定义打上标签在MPLS网络中（虚拟成了链路）对分组按照标签进行交换
  + 到了出口路由器，再将标签摘除
  + 支持MPLS的路由器组构成的网络，从IP网络的角度来看虚拟成了链路
+ 标签封装：一些列标准定义了在ATM,FR和以太网中如何封装，利用原有网络中的机制VCI，或者定义新的标签

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212041123275.png" alt="image-20221204112340139" style="zoom:50%;" />

+ 建立基于标签的转发表-信令协议：支持逐跳和显式路由：路由信息传播，路由计算(基于Qos，=基于策略的)，标签分发
  + LDP CR-LDP
  + RSVP扩展 BGP扩展
+ MPLS优点
  + 路由弹性：基于Qos，基于策略的
  + 充分利用已有的硬件ATM，快速转发
  + 支持流连工程，VPN
  + 支持带宽等资源的分配

**标签分发**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212041125956.png" alt="image-20221204112511818" style="zoom:50%;" />

**Label Switched Path (LSP)**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212041126375.png" alt="image-20221204112612242" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212041126015.png" alt="image-20221204112642851" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212041127702.png" alt="image-20221204112749564" style="zoom: 50%;" />

**Multiprotocol label switching (MPLS)**

+ 初始目的：使用固定长度的标签label进行高速率IP转发 (而不是使用IP address,采用最长前缀匹配)
  + 一开始采用固定长度ID进行查表 (而不是采用前缀匹配)
  + 借鉴了虚电路的思想 (VC)
  + 但是IP数据报仍然保留IP地址!
  + 在帧和其封装的分组之间加入一个垫层，标签交换使能的路由器使用垫层信息进行分组转发，不解析分组目标地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052142967.png" alt="image-20221205214253867" style="zoom:50%;" />

**具有MPLS能力的路由器**

+ a.k.a. 标签交换路由器
+ 基于标签的值进行分组的转发 (而非检查IP地址)
  + MPLS转发表和IP转发表相互独立
+ 弹性: MPLS转发决策可以和IP不同
  + 采用源地址和目标地址来路由到达同一个目标的流，不同路径（支持流量工程）
  + 如果链路失效，能够快速重新路由: 预先计算好的备份链路 (对于VoIP有效)

**MPLS vs IP 路径**

![image-20221205214453976](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052144072.png)

+ IP 路由: 到达目标的路径仅仅取决 目标地址

![image-20221205214540448](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052145544.png)

+ IP路由:到达目标的路径仅仅取决于目标地址
+ MPLS路由：到达目标的路由，可以基于源和目标地址
  + 快速重新路由：在链路失效时，采用预先计算好的路径

**MPLS 信令**
+ 修改OSPF, IS-IS链路状态泛洪协议来携带MPLS路由信息
  + e.g., 链路带宽，链路带宽的倒数?
+ MPLS使能的路由器采用RSVP-TE信令协议在下游路由器上来建立MPLS转发表

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052147840.png" alt="image-20221205214739750" style="zoom:50%;" />

**MPLS 转发表**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052148912.png" alt="image-20221205214820816" style="zoom:50%;" />

**数据中心网络**

+ 数万-数十万台主机构成DC网络，密集耦合、距离
  临近:
  + 电子商务(e.g. Amazon)
  + 内容服务器(e.g., YouTube, Akamai, Apple, Microsoft)
  + 搜索引擎，数据挖掘 (e.g., Google)
+ 挑战:
  + 多种应用，每一种都服务海量的客户端
  + 管理/负载均衡，避免处理、网络和数据的瓶颈

负载均衡器: 应用层路由
+ 接受外部的客户端请求
+ 将请求导入到数据中心内部
+ 返回结果给外部客户端 (对于客户端隐藏数据中心的内部结构)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052151732.png" alt="image-20221205215146641" style="zoom:50%;" />

+ 在交换机之间，机器阵列之间有丰富的互连措施:
  + 在阵列之间增加吞吐 (多个可能的路由路径)
  + 通过冗余度增加可靠

<img src="C:/Users/mua/AppData/Roaming/Typora/typora-user-images/image-20221205215504807.png" alt="image-20221205215504807" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052156626.png" alt="image-20221205215650522" style="zoom:67%;" />

+ 笔记本需要一个IP地址，第一跳路由器的IP地址，DNS的地址: 采用DHCP
+ DHCP 请求被封装在UDP中，封装在IP, 封装在 802.3 以太网帧中
+ 以太网的帧在LAN上广播(dest: FFFFFFFFFFFF), 被运行中的DHCP服务器接收到
+ 以太网帧中解封装IP分组，解封装UDP，解封装DHCP

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052157739.png" alt="image-20221205215743644" style="zoom: 67%;" />

+ DHCP 服务器生成DHCP ACK 包括客户端IP地址，第一跳路由器IP地址和DNS名字服务器地址
+ 在DHCP服务器封装, 帧通过LAN转发 (交换机学习) 在客户端段解封装
+ 客户端接收DHCP ACK应答
客户端段解封装客户端有了IP地址，知道了DNS域名服务器的名字和IP地址第一跳路由器的IP地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052203616.png" alt="image-20221205220344524" style="zoom:67%;" />

**ARP (DNS之前, HTTP之前)**

+ 在发送HTTP request请求之前, 需要知道 www.google.com 的IP: DNS
+ DNS查询被创建，封装在UDP段中，封装在IP数据报中，封装在以太网的帧中. 将帧传递给路由器，但是需要知道路由器的接口：
MAC地址：ARP
+ ARP查询广播，被路由器接收，路由器用ARP应答，给出其IP地址某个端口的MAC地址
+ 客户端现在知道第一跳路由器MAC地址，所以可以发送DNS查询帧了

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052204827.png" alt="image-20221205220425731" style="zoom:67%;" />

**使用DNS**

+ 包含了DNS查询的IP数据报通过LAN交换机转发，从客户端到第一跳路由器

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052205861.png" alt="image-20221205220557772" style="zoom:50%;" />


+ IP 数据报被转发，从校园到达comcast网络，路由（路由表被RIP，OSPF，IS-IS 和/或BGP协议创建）到DNS服务器
+ 被DNS服务器解封装
+ DNS服务器回复给客户端：www.google.com 的IP地址

**TCP连接携带HTTP报文**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052207544.png" alt="image-20221205220753436" style="zoom:67%;" />

**HTTP请求和应答**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212052208350.png" alt="image-20221205220828239" style="zoom:67%;" />

## 网络安全

+ 网络安全原理:
  + 加密，不仅仅用于机密性
  + 认证
  + 报文完整性
  + 密钥分发
+ 安全实践
  + 防火墙
  + 各个层次的安全性：应用层，传输层，网络层和链路层

**网络安全**
机密性: 只有发送方和预订的接收方能否理解传输的报文内容
+ 发送方加密报文
+ 接收方解密报文
认证: 发送方和接收方需要确认对方的身份
报文完整性: 发送方、接受方需要确认报文在传输的过程中或者事后没有被改变
访问控制和服务的可用性: 服务可以接入以及对用户而言是可用的

**朋友和敌人: Alice, Bob, Trudy**
+ 网络安全世界比较著名的模型
+ Bob, Alice (lovers!) 需要安全的通信
+ Trudy (intruder) 可以截获，删除和增加报文

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061651932.png" alt="image-20221206165114643" style="zoom:50%;" />

+ 窃听: 截获报文
+ 插入：在连接上插入报文
+ 伪装: 可以在分组的源地址写上伪装的地址
+ 劫持: 将发送方或者接收方踢出，接管连接
+ 拒绝服务: 阻止服务被其他正常用户使用 (e.g.,通过对资源的过载使用)

### 加密原理
**加密语言**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061709942.png" alt="image-20221206170909751" style="zoom:50%;" />

对称密钥密码学: 发送方和接收方的密钥相同
公开密钥密码学: 发送方使用接收方的公钥进行加密，接收方使用自己的私钥进行解密

**对称密钥加密**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061714317.png" alt="image-20221206171440166" style="zoom:50%;" />

对称密钥密码: Bob和Alice共享一个对称式的密钥: Ka-b

+ e.g., 密钥在单码替换加密方法中是替换模式
+ Q: 但是Bob和Alice如何就这个密钥达成一致呢

替换密码: 将一个事情换成另外一个事情
+ 单码替换密码: 将一个字母替换成另外一个字母

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061717456.png" alt="image-20221206171704233" style="zoom:50%;" />

**对称密钥加密学: DES**

DES: Data Encryption Standard
+ US 加密标准[NIST 1993]
+ 56-bit 对称密钥, 64-bit明文输入
+ DES有多安全?
  + DES挑战: 56-bit密钥加密的短语 (“Strong cryptography makes the world a safer place”) 被解密，用了4个月的时间
  + 可能有后门
+ 使DES更安全:
  + 使用3个key， 3重DES 运算
  + 密文分组成串技术

+ 初始替换
  16 轮一样的函数应用，每一轮使用的不同的48bit密钥最终替换

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061843091.png" alt="image-20221206184335945" style="zoom:50%;" />

**块密码**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061845061.png" alt="image-20221206184548946" style="zoom:50%;" />

+ 一个循环：一个输入bit影响8个输出bit
+ 多重循环: 每个输入比特影响所有的输出bit
+ 块密码：DES, 3DES, AE

**AES: Advanced Encryption Standard**

+ 新的对称 密钥NIST标准(Nov. 2001) 用于替换DES
+ 数据128bit成组加密
+ 128, 192, or 256 bit keys
+ 穷尽法解密如果使用1秒钟破解 DES, 需要花149万亿年破解AES

**密码块链**
+ 密码块：如果输入块重复，将会得到相同的密文块
+ 密码块链： 异或第i轮输入 m(i), 与前一轮的密文, c(i-1) 
  + c(0) 明文传输到接收端
  + what happens in “HTTP/1.1” scenario from above?

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061848697.png" alt="image-20221206184840567" style="zoom:50%;" />

**公开密钥密码学**

对称密钥密码学
+ 需要发送方和接收方对共享式对称密钥达成一致
+ Q: 但是他们如何第一次达成一致 (特别是他们永远不可能见面的情况下)?

公开密钥密码学
+ 完全不同的方法
[Diffie-Hellman76, RSA78]
+ 发送方和接收方无需共享密钥
+ 一个实体的公钥公诸于众
+ 私钥只有他自己知道

**公开密钥加密算法**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061901146.png" alt="image-20221206190131008" style="zoom:50%;" />

**RSA: Rivest, Shamir, Adelson algorithm**

**公开密钥密码学**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061902290.png" alt="image-20221206190219161" style="zoom:50%;" />

**解密的几种类型**

+ 加密算法已知，求密钥
+ 加密算法和密钥均不知道
+ 唯密文攻击
+ 已知明文攻击
  + 已经知道部分密文和明文的对应关系
+ 选择明文攻击
  + 攻击者能够选择一段明文，并得到密

### **认证**
目标: Bob需要Alice证明她的身份
Protocol ap1.0: Alice说“I am Alice"

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061905115.png" alt="image-20221206190501970" style="zoom:50%;" />

在网络上Bob看不到 Alice, 因此Trudy可以简单地声称她是 Alice

**认证：重新产生**

Protocol ap2.0: Alice 说 “I am Alice” ，在她发送的IP数据包中包括了她的IP地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061906383.png" alt="image-20221206190638244" style="zoom:50%;" />

Protocol ap3.0: Alice 说 “I am Alice” ，而且传送她的密码来证明

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061907737.png" alt="image-20221206190714562" style="zoom:50%;" />

Protocol ap2.0: Alice 说 “I am Alice” ，在她发送的IP数据包中包括了她的IP地址

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061909141.png" alt="image-20221206190931987" style="zoom:50%;" />

Protocol ap3.0: Alice 说 “I am Alice” ，而且传送她的密码来证明

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061910762.png" alt="image-20221206191008638" style="zoom:50%;" />

Protocol ap3.1: Alice 说 “I am Alice” ，而且传送她的加密之后的密码来证明

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061912785.png" alt="image-20221206191204621" style="zoom:50%;" />

目标: 避免重放攻击会失败吗，有问题吗?
Nonce: 一生只用一次的整数 (R)
ap4.0: 为了证明Alice的活跃性, Bob发送给Alice一个nonce, R. Alice 必须返回加密之后的R，使用双方约定好的key

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061916067.png" alt="image-20221206191647946" style="zoom:50%;" />

Protocol ap3.1: Alice 说 “I am Alice” ，而且传送她的加密之后的密码来证明.

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061917190.png" alt="image-20221206191743061" style="zoom: 50%;" />

**认证: ap5.0**

ap4.0 需要双方共享一个对称式的密钥
+ 是否可以通过公开密钥技术进行认证呢?
ap5.0: 使用nonce,公开密钥加密技术

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061919271.png" alt="image-20221206191956154" style="zoom:50%;" />

**ap5.0: 安全漏洞**

中间攻击: Trudy 在 Alice (to Bob)和 Bob之间 (to Alice)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061921484.png" alt="image-20221206192115330" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061922877.png" alt="image-20221206192245767" style="zoom:67%;" />

难以检测:
+ Bob收到了Alice发送的所有报文, 反之亦然. (e.g., so Bob, Alice一个星期以后相见，回忆起以前的会话)
+ 问题时Trudy也接收到了所有的报文!

### 报文完整性

**数字签名**

数字签名类比于手写签名
+ 发送方 (Bob) 数字签署了文件, 前提是他(她)是文件的拥有者/创建者.
+ 可验证性，不可伪造性，不可抵赖性
  + 谁签署：接收方 (Alice)可以向他人证明是 Bob, 而不是其他人签署了这个文件 (包括Alice)
  + 签署了什么：这份文件，而不是其它

简单的对ｍ的数字签名：
+ Bob使用他自己的私钥对m进行了签署 ，创建数字签名 KB(m)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061926454.png" alt="image-20221206192657313" style="zoom:50%;" />

对长报文进行公开密钥加密算法的实施需要耗费大量的时间

Goal: 固定长度，容易计算的“fingerprint”

+ 对m使用散列函数H，获得固定长度的 报文摘要H(m).

散列函数的特性：
+ 多对1
+ 结果固定长度
+ 给定一个报文摘要x, 反向计算出原报文在计算上是不可行的x = H(m)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061928684.png" alt="image-20221206192852530" style="zoom:50%;" />

**Internet校验和: 弱的散列函数**
Internet 校验和拥有一些散列函数的特性:
+ 产生报文m的固定长度的摘要 (16-bit sum) 
+ 多对1的

但是给定一个散列值，很容易计算出另外一个报文具有同样的散列值: 

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061931304.png" alt="image-20221206193126172" style="zoom:50%;" />

**数字签名 = 对报文摘要进行数字签署**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212061932109.png" alt="image-20221206193200949" style="zoom:50%;" />

### 密钥分发和证书

**散列函数算法**
+ MD5散列函数(RFC 1321)被广泛地应用
  + 4个步骤计算出128-bit的报文摘要
  + 给定一个任意的128-bit串x, 很难构造出一个报文m具有相同的摘要x.
+ SHA-1也被使用.
  + US标准 [NIST, FIPS PUB 180-1]
  + 160-bit报文摘

**可信赖中介**
对称密钥问题
+ 相互通信的实体如何分享对称式的密钥?
解决办法:
+ trusted key distribution center (KDC) 在实体之间扮演可信赖中介的角色。

公共密钥问题
+ 当Alice获得Bob的公钥(from web site, e-mail, diskette), 她如何知道就是Bob的public key, 而不是Trudy的?
解决办法:
+ 可信赖的certification authority (CA)

**Key Distribution Center (KDC)**
+ Alice, Bob 需要分享对称式密钥
+ KDC: 服务器和每一个注册用户都分享一个对称式的密钥(many users)
+ Alice, Bob在和KDC通信的时候，知道他们自己的对称式密钥 KA-KDC KB-KDC

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072033505.png" alt="image-20221207203325357" style="zoom:50%;" />

**Certification Authorities**

+ Certification authority (CA): 将每一个注册实体E和他的公钥捆绑.
+ E(person, router)到CA那里注册他的公钥
  + E 提供给CA，自己身份的证据 “proof of identity”
  + CA创建一个证书，捆绑了实体信息和他的公钥
  + Certificate包括了E的公钥，而且是被CA签署的（被CA用自己的私钥加了密的）

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072040126.png" alt="image-20221207204025007" style="zoom:50%;" />

> Q: KDC如何使得 Bob和Alice在和对方通信前，就对称式会话密钥达成一致? 

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072041582.png" alt="image-20221207204120431" style="zoom: 50%;" />

+ 当Alice需要拿到Bob公钥
  + 获得Bob的证书certificate (从Bob或者其他地方).
  + 对Bob的证书，使用CA的公钥

![image-20221207204206667](https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072042776.png)

**证书包括:**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072044187.png" alt="image-20221207204420059" style="zoom:67%;" />

**信任树**
+ 根证书：根证书是未被签名的公钥证书或自签名的证书
  + 拿到一些CA的公钥
  + 渠道：安装OS自带的数字证书；从网上下载，你信任的数字证书
+ 信任树：
  + 信任根证书CA颁发的证书，拿到了根CA的公钥(信任了根)
  + 由根CA签署的给一些机构的数字证书，包含了这些机构的数字证书
  + 由于你信任了根，从而能够可靠地拿到根CA签发的证书，可靠地拿到这些机构的公钥

**安全电子邮件**

+ Alice 需要发送机密的报文m给Bob

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072210245.png" alt="image-20221207221027147" style="zoom: 50%;" />


Alice
+ 产生随机的对称密钥, KS
+ 使用KS对报文加密(为了效率)
+ 对KS使用 Bob的公钥进行加密
+ 发送KS(m) 和KB(KS) 给Bob

Bob
+ 使用自己的私钥解密 KS
+ 使用 KS解密 KS(m) 得到报文

+ Alice 需要提供机密性，源端可认证性和报文的完整性

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072212224.png" alt="image-20221207221242114" style="zoom:67%;" />

Alice 使用了3个keys: 自己的私钥，Bob的公钥, 新产生出的对称式密钥

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072213621.png" alt="image-20221207221329514" style="zoom:50%;" />

+ Alice 数字签署文件
+ 发送报文（明文）

**Pretty good privacy (PGP)**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212072214614.png" alt="image-20221207221438490" style="zoom: 50%;" />

**Secure sockets layer (SSL)**

+ 为使用SSL服务的、基于TCP的应用提供传输层次的安全性
  + eg. 在WEB的浏览器和服务器之间进行电子商务的交易 (shttp)
+ 所提供的安全服务:
  + 服务器的可认证性，数据加密，客户端的可认证性 

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111453453.png" alt="image-20221211145308311" style="zoom:50%;" />

**SSL: 3阶段**
1. 握手:
+ Bob 和Alice 建立TCP连接
+ 通过CA签署的证书认证 Alice的身份
+ 创建，加密 (采用Alice的公钥 ), 传输主密钥给Alice
  + 不重数交换没有显示

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111456126.png" alt="image-20221211145642035" style="zoom:50%;" />

2.密钥导出:

+ Alice, Bob采用共享的MS产生4个keys:
  + EB: Bob->Alice 数据加密key
  + EA: Alice->Bob数据加密key
  + MB: Bob->Alice MAC（报文鉴别编码）key
  + MA: Alice->Bob MAC key
+ 加密和MAC算法在Bob, Alice之间协商
+ 为什么要4个keys?
  + 更安全

3.数据传输

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111457837.png" alt="image-20221211145734726" style="zoom:50%;" />

**IPsec: 网络层次的安全性**

+ 网络层次的机密性:
  + 发送端主机对IP数据报中的数据进行加密
  + 数据：TCP或者UDP的段; ICMP和SNMP 报文.
  
+ 网络层次的可认证性
  + 目标主机可以认证源主机的IP地址
  
+ 2个主要协议:
  + 认证头部 (AH)协议
  + 封装安全载荷encapsulation security payload (ESP) 协议
  
+ 不管AH 还是ESP, 源和目标在通信之前要握手:
  + 创建一个网络层次的逻辑通道：安全关联security association (SA)
  
+ 每一个SA 都是单向

+ 由以下元组唯一确定:
  + 安全协议 (AH or ESP)
  
  + 源 IP地址

  + 32-bit连接ID
  

**ESP 协议**

+ 提供机密性，主机的可认证性，数据的完整性

+ 数据和ESP尾部部分被加密

+ next header字段在ESP尾部

+ ESP 认证的头部与AH类似

+ 协议号 = 50

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111502825.png" alt="image-20221211150220725" style="zoom:50%;" />

**Authentication Header (AH) 协议**

+ 提供源端的可认证性，数据完整性，但是不提供机密性
+ 在IP头部和数据字段之间插入AH的头部
+ 协议字段: 51
+ 中间的路由器按照常规处理这个数据报

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111532430.png" alt="image-20221211153241329" style="zoom:50%;" />

### 访问控制：防火墙

**firewall**

将组织内部网络和互联网络隔离开来，按照规则允许某些分组通过（进出），或者阻塞掉某些分组

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111535290.png" alt="image-20221211153534192" style="zoom:50%;" />

**分组过滤**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111536045.png" alt="image-20221211153623945" style="zoom:50%;" />

+ 内部网络通过配置防火墙的路由器连接到互联网上
+ 路由器对分组逐个过滤，根据以下规则来决定转发
  还是丢弃:
  + 源IP地址,目标IP地址
  + TCP/UDP源和目标端口
  + ICMP报文类别
  + TCP SYN 和ACK bits

**防火墙: 为什么需要**
+ 阻止拒绝服务攻击：
  + SYN flooding: 攻击者建立很多伪造TCP链接，对于真正用户而言已经没有资源留下了
+ 阻止非法的修改/对非授权内容的访问
  + e.g., 攻击者替换掉CIA的主页
+ 只允许认证的用户能否访问内部网络资源 (经过认证的用户/主机集合)
+ 2种类型的防火墙:
  + 网络级别：分组过滤器
    + 有状态，无状态
  + 应用级别：应用程序网关

**分组过滤-无状态**
+ 例1:阻塞进出的数据报：只要拥有IP协议字段 = 17，而且源/目标端口号 = 23.
  + 所有的进出UDP流 以及telnet 连接的数据报都被阻塞掉
+ 例2: 阻塞进入内网的TCP段：它的ACK=0
  + 阻止外部客户端和内部网络的主机建立TCP连接
  + 但允许内部网络的客户端和外部服务器建立TCP连接

**无状态分组过滤器: 例子**

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111542658.png" alt="image-20221211154257550" style="zoom:50%;" />

**有状态分组过滤**
+ 无状态分组过滤根据每个分组独立地检查和行动
+ 有状态的分组过滤联合分组状态表检查和行动
+ ACL增强：在允许分组之前需要检查连接状态表

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111551586.png" alt="image-20221211155132465" style="zoom:50%;" />

**Access Control Lists** 

+ ACL: 规则的表格，top-bottom应用到输入的分组:(action, condition) 对

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111553302.png" alt="image-20221211155333177" style="zoom:50%;" />

**应用程序网关**

+ 根据应用数据的内容来过滤进出的数据报，就像根据IP/TCP/UDP字段来过滤一样
  + 检查的级别：应用层数据
+ Example: 允许内部用户登录到外部服务器，但不是直接登录
1. 需要所有的telnet用户通过网关来telnet
2. 对于认证的用户而言，网关建立和目标主机的telnet connection ，网关在2个连接上进行中继
3. 路由器过滤器对所有不是来自网关的telnet的分组全部过滤掉

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111555140.png" alt="image-20221211155542005" style="zoom:50%;" />

**防火墙和应用程序网关的局限性**

+ IP spoofing: 路由器不知道数据报是否真的来自于声称的源地址
+ 如果有多个应用需要控制，就需要有多个应用程序网关
+ 客户端软件需要知道如何连接到这个应用程序
  + e.g., 必须在Web browser中配置网络代理的Ip地址
+ 过滤器对UDP段所在的报文，或者全过或者全都不过
+ 折中: 与外部通信的自由度，安全的级别
+ 很多高度保护的站点仍然受到攻击的困扰

**IDS：入侵检测系统**

+ multiple IDSs: 在不同的地点进行不同类型的检查

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111601892.png" alt="image-20221211160145765" style="zoom:50%;" />

+ 分组过滤:
  + 对TCP/IP头部进行检查
  + 不检查会话间的相关性
+ IDS: intrusion detection system
  + 深入分组检查: 检查分组的内容 (e.g., 检查分组中的特征串已知攻击数据库的病毒和攻击串
  + 检查分组间的相关性，判断是否是有害的分组
    + 端口扫描
    + 网络映射
    + Dos攻击

**Internet 安全威胁**
**映射:**

+ 在攻击之前： “踩点” – 发现在网络上实现了哪些服务
+ 使用ping来判断哪些主机在网络上有地址
+ 端口扫描：试图顺序地在每一个端口上建立TCP连接 (看看发生了什么)

**映射: 对策**

+ 记录进入到网络中的通信流量
+ 发现可疑的行为 (IP addresses, 端口被依次扫描)

**分组嗅探: 对策**

+ 机构中的所有主机都运行能够监测软件，周期性地检查是否有网卡运行于混杂模式
+ 每一个主机一个独立的网段 (交换式以太网而不是使用集线器)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212111613001.png" alt="image-20221211161352871" style="zoom:50%;" />

**IP Spoofing欺骗:**

+ 可以有应用进程直接产生 “raw” IP分组, 而且可以在IP源地址部分直接放置任何地址
+ 接收端无法判断源地址是不是具有欺骗性的
+ eg. C伪装成B

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212120920692.png" alt="image-20221212092027563" style="zoom: 67%;" />

**IP Spoofing：入口过滤**

+ 路由器对那些具有非法源地址的分组不进行转发(e.g., 数据报的源地址不是路由器所在的网络地址) 
+ 很好，但是入口过滤不能够在全网范围内安装

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212120924934.png" alt="image-20221212092407833" style="zoom: 67%;" />

**Denial of service (DOS): 对策**

+ 在到达主机之前过滤掉这些泛洪的分组 (e.g., SYN) : throw out good with bad
+ 回溯到源主机(most likely an innocent, compromised machine)

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212120924115.png" alt="image-20221212092451988" style="zoom:67%;" />

**Denial of service (DOS):**

+ 产生的大量分组淹没了接收端
+ Distributed DOS (DDOS): 多个相互协作的源站淹没了接收端
+ e.g. C以及远程的主机SYN-attack A

<img src="https://cdn.jsdelivr.net/gh/0xmelon/picgohub@master/imgs/202212120925452.png" alt="image-20221212092534347" style="zoom:67%;" />