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