import{_ as i,o as l,c as p,Q as e}from"./chunks/framework.86061f54.js";const P=JSON.parse('{"title":"计算机组成","description":"","frontmatter":{},"headers":[],"relativePath":"workflow/computer-focus/计算机组成.md","lastUpdated":1696749090000}'),a={name:"workflow/computer-focus/计算机组成.md"},t=e(`<h1 id="计算机组成" tabindex="-1">计算机组成 <a class="header-anchor" href="#计算机组成" aria-label="Permalink to &quot;计算机组成&quot;">​</a></h1><p>type: Post status: Published date: 2023/07/09 slug: computer-organization category: 基础Base</p><p><img src="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/12bc980053ea355a201e2b529048e2ff.jpg" alt="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/12bc980053ea355a201e2b529048e2ff.jpg"></p><ol><li>计算机的指令和计算（控制器和运算器）</li><li>CPU的设计</li><li>存储器的原理</li></ol><h3 id="cpu主频" tabindex="-1">CPU主频 <a class="header-anchor" href="#cpu主频" aria-label="Permalink to &quot;CPU主频&quot;">​</a></h3><p>程序的CPU执行时间 = CPU时钟周期数×时钟周期时间</p><p>优化这三者：</p><ol><li>时钟周期时间</li><li><strong>每条指令的平均时钟周期数</strong>（Cycles Per Instruction，简称 CPI）</li><li>指令数</li></ol><p>可以把自己想象成一个 CPU，坐在那里写程序。计算机主频就好像是你的打字速度，打字越快，你自然可以多写一点程序。CPI 相当于你在写程序的时候，熟悉各种快捷键，越是打同样的内容，需要敲击键盘的次数就越少。指令数相当于你的程序设计得够合理，同样的程序要写的代码行数就少。</p><h3 id="性能" tabindex="-1">性能 <a class="header-anchor" href="#性能" aria-label="Permalink to &quot;性能&quot;">​</a></h3><p>性能提升方法：</p><ol><li>加速大概率事件</li><li>通过流水线提高性能</li><li>通过预测提高性能</li></ol><h3 id="计算机指令" tabindex="-1">计算机指令 <a class="header-anchor" href="#计算机指令" aria-label="Permalink to &quot;计算机指令&quot;">​</a></h3><p><img src="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/ebfd3bfe5dba764cdcf871e23b29f197.jpeg" alt="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/ebfd3bfe5dba764cdcf871e23b29f197.jpeg"></p><h1 id="总知识点" tabindex="-1">总知识点 <a class="header-anchor" href="#总知识点" aria-label="Permalink to &quot;总知识点&quot;">​</a></h1><h2 id="选择题" tabindex="-1">选择题 <a class="header-anchor" href="#选择题" aria-label="Permalink to &quot;选择题&quot;">​</a></h2><ol><li><p>为了缩短指令中某个地址段的位数，有效的方法是采取间接寻址</p></li><li><p>某一RAM芯片其容量为512*8位,除电源和接地端外该芯片引线的最少数目是19</p><p>具体引线数量的计算如下：</p><ul><li>数据线：8根引线，用于传输每个存储单元的8位数据。</li><li>地址线：9根引线，用于编址512个存储单元。</li><li>控制信号引线：至少需要2根引线，用于传输读写控制信号、写使能信号、读使能信号等。</li></ul><p>因此，引线的最少数目为8（数据线）+ 9（地址线）+ 2（控制信号引线）= 19根引线。</p></li><li><p>寄存器间接寻址方式中，操作数处在贮存单元</p></li><li><p>CPU响应中断的时间是取指周期结束</p></li><li><p>浮点数的表示范围和精度取决于阶码和尾数的位数</p></li><li><p>中断向量可提供中断服务程序入口地址</p></li><li><p>加法器采用先行进位的目的是加速传递进位信号</p></li><li><p>Cache的地址映象中，若主存中的任一块均可映射到Cache内的任一块的位置上，称作全相联映像</p></li><li><p>直接寻址的无条件转移指令功能是将指令中的地址码送入PC(寄存器)</p></li><li><p>响应中断请求的条件是外设工作完成时和系统允许时</p></li><li><p>主机与设备传送设备时，采用程序查询方式</p></li><li><p>一个节拍信号的宽度是指时钟周期</p></li><li><p>零地址运算指令在指令格式中不给出操作数地址，它的操作数来自栈顶和次栈顶</p></li><li><p>控制器可区分存储单元中存放的是指令还是数据。</p></li><li><p>三总线结构的计算机是指I/O总线、主存总统和DMA总线三组传输线</p></li><li><p>某计算机字长是32位，它的存储容量是256KB，按字编址，它的寻址范围是64K</p><p>该计算机的字长为32位，表示每个存储单元（字）的大小为32位或4字节。</p><p>存储容量为256KB，其中KB表示千字节，即2的10次方字节。因此，存储容量可以表示为：</p><p>256KB = 256 * 2^10 字节 = 256 * 1024 字节 = 262144 字节</p><p>由于每个字的大小为4字节，我们可以将存储容量转换为字数：</p><p>262144 字节 ÷ 4 字节/字 = 65536 字</p></li><li><p>主机与设备传送数据时，采用程序查询方式，主机与设备是串行工作的</p></li><li><p>变址寻址方式中，操作数的有效地址是变址寄存器内容+形式地址。这样可以根据变址寄存器的值和形式地址的值，实现对不同位置的操作数的访问。通过调整变址寄存器的值和形式地址的值，可以在运行时确定不同的操作数地址</p></li><li><p>向量中断是由硬件形成向量地址，然后通过向量地址找到中断服务程序的入口地址，以进行相应的中断处理</p></li><li><p>将微程序存储在EPROM中的控制器是静态微程序控制器</p></li><li><p>隐指令是指指令系统中没有明确定义的指令，用于特定的应用或系统需求</p></li><li><p>MA方式可以提供高速的数据传输，但它并不能完全取代中断方式。在DMA方式下，外围设备可以直接访问主存储器进行数据传输，但在某些情况下，仍然需要中断方式来处理特定的事件或中断请求。</p></li><li><p>在中断周期中，由中断隐指令将允许中断触发器置“0”</p></li><li><p>在单总线结构的CPU中，连接在总线上的多个部件某一时刻只有一个可以向总线发送数据，但可以有多个同时从总线接收数据</p></li><li><p>对于电路故障最敏感的方式是链式查询方式。任何一个环节的故障或超时都可能导致整个查询过程中断或延迟。</p></li><li><p>在间址周期中，对于存储器间接寻址或寄存器间接寻址的指令，它们的操作是不同的。</p></li><li><p>EPROM是可改写的，但它通常不被用作随机存储器（RAM）。随机存储器用于存储和读取临时数据，允许随机访问存储单元。EPROM的擦除和编程操作相对较慢，因此不适合频繁的随机访问和写入操作。</p></li><li><p>只有在补码表示中，零的表示形式是唯一的。</p></li><li><p>减法运算在定点二进制运算器中一般通过补码运算的二进制加法器来实现。</p></li><li><p>在指令的地址字段中，直接指出操作数本身的寻址方式，称为立即寻址。 直接寻址则是给出。</p></li><li><p>隐含寻址方式是在单地址指令中为了完成两个数的算术运算时常用的方式。</p></li><li><p>用于对某个寄存器中操作数的寻址方式称为寄存器直接寻址</p></li><li><p>在CPU中，跟踪指令后继地址的寄存器通常被称为程序计数器</p></li><li><p>在集中式总线仲裁中，独立请求方式具有最快的响应时间</p></li><li><p>猝发式传输是PCI总线中常用的传输机制。它允许在一次总线事务中连续传输多个数据字，从而提高数据传输效率。</p></li><li><p>中断向量地址是指中断服务子程序（Interrupt Service Routine，ISR）的入口地址</p></li><li><p>在相联存储器中，存储单元不是通过具体的地址进行寻址，而是根据存储单元中存储的内容进行查找和匹配。</p></li><li><p>单总线的微型计算机系统中，外设可以和主存储器单元统一编址，因此可以不用I/O指令。</p></li><li></li></ol><pre><code>| 记录方式 | 描述 | 特点 |
| --- | --- | --- |
| NRZ0 | 非归零码（Non-Return to Zero） | 信号保持低电平表示0，保持高电平表示1 |
| NRZ1 | 非归零码（Non-Return to Zero） | 信号保持低电平表示1，保持高电平表示0 |
| PM | 相位调制（Phase Modulation） | 数据通过改变相位来表示，提供自同步能力 |
| MFM | 改进型频率调制（Modified Frequency Modulation） | 数据通过改变频率和相位来表示，提高数据密度和抗干扰能力 |
</code></pre><ol start="40"><li><p>一条指令执行结束不是发生中断请求的条件。</p></li><li><p>采用DMA方式传送数据时，每传送一个数据需要用一个存储周期。</p></li><li><p>在并行I/O标准接口SCSI中，一块主适配器可以连接7～15台具有SCSI接口的设备。</p></li><li><p>当采用统一编址法对设备进行编址时，不需要专门的I/O指令组</p></li><li><p>CPU在执行当前指令时并不会立即停止执行。中断请求的处理通常需要等到当前指令执行完毕后，CPU才能进行中断处理。</p></li><li><p>接口一定要与总线相连，并且不可与通道相替代。总线可以由多个设备共享控制和管理。</p></li><li><p>某机器字长16位，含一位数符，用补码表示，则定点小数所能表示的最小正数是2^-15</p><p>在补码表示法中，最高位被用作符号位。对于16位数字，有15位用于表示数值部分。在定点小数表示中，我们通常将小数点固定在某个位置，对于本题我们可以假设小数点在最右侧，也就是所有的位都用于表示小数部分。</p><p>在这种情况下，最小的正数将由最低有效位（也就是最右边的位）表示。因为这是二进制表示，所以最小的正数会是一个在最右位为1，其他位都为0的数。所以，最小的正数将是 1 * 2^-15。这是因为二进制小数中的每一位对应的值为其对应的位权，位权为2的负n次幂，n为其位数。因此，最小的正数为 2^-15。</p></li><li><p>双符号位补码的运算结果的符号位是&quot;00&quot;（正数）、&quot;01&quot;（零）或&quot;10&quot;（负数）</p></li><li><p>在用比较法进行补码一位乘法时，若相邻两位乘数yi*yi+1为01时，完成的操作是原部分积+[X]补，右移一位</p></li><li><p>堆栈指针SP的内容是栈顶地址</p></li><li><p>在寄存器间接寻址方式中，操作数实际上是从寄存器中读出</p></li><li><p>在微程序控制器中，一条机器指令的功能通常由一段微程序实现</p></li><li><p>在串行传输时，被传输的数据发送设备进行并行到串行的变换，在接受设备中都是进行串行到并行的变换</p></li><li><p>系统总线是指CPU、主存和外围设备之间的信息传送线</p></li><li><p>指令的地址码给出存储器地址的加法指令，在执行周期一定访存。</p></li><li><p>垂直型微指令的特点是采用微操作码</p></li><li><p>基址寻址方式中，操作数的有效地址是基址寄存器内容加上形式地址（位移量）</p></li><li><p>常用的虚拟存储器寻址系统由主存－辅存两级存储器组成</p></li><li><p>DMA访问主存时，让CPU处于等待状态，等DMA的一批数据访问结束后，CPU再恢复工作，这种情况称作停止CPU访问主存</p></li><li><p>在运算器中不包含地址寄存器</p></li><li><p>计算机操作的最小单位时间是时钟周期</p></li><li><p>用以指定待执行指令所在地址的是程序计数器</p></li><li><p>总线通信中的同步控制是由统一时序控制的方式</p></li><li><p>某计算机字长是16位，它的存储容量是1MB，按字编址，它的寻址范围是512K 1mb/2b=1024kb/2b=512k</p></li><li><p>采用微程序控制器的处理器通常被称为微控制器</p></li><li><p>在中断周期中，将允许中断触发器置为&quot;0&quot;的操作由中央处理器（CPU）的中断控制器或中断处理器完成。</p></li><li><p>对于一个8位补码的机器，它所能表示的范围是从-128到+127</p></li><li><p>总线的异步通信方式不采用时钟信号，只采用握手信号</p></li><li><p>在控制器的控制信号中，相容的信号是可以同时出现的信号</p></li><li><p>变址寻址便于处理数组的问题</p></li><li><p>设寄存器内容为10000000，若它等于0，则为移码</p></li><li><p>若一个8比特组成的字符至少需10个比特来传送，这是异步传送方式</p></li><li><p>相对寻址对于实现程序浮动提供了较好的支持</p></li><li><p>超标量技术是在每个时钟周期内同时并发多条指令</p></li><li><p>在控制器的控制方式中，机器周期内的时钟周期个数可以不相同，这属于同步控制</p></li><li><p>I/O与主机交换信息的方式中，中断方式的特点是CPU与设备并行工作,传送与主程序串行工作</p></li></ol><h2 id="判断题" tabindex="-1">判断题 <a class="header-anchor" href="#判断题" aria-label="Permalink to &quot;判断题&quot;">​</a></h2><ol><li>存储单元是存放多个二进制信息的存贮元。</li><li>主程序在运行过程中，对于外设的中断服务是根据中断请求的发生时机来决定的。</li><li>引入虚拟存储系统的目的是扩展有效的地址空间</li><li>DMA方式进行外设与主机交换信息时，通常是需要向主机（CPU）发出中断请求的，这是为了确保数据的正确传输，同时防止在DMA操作期间CPU对同一块内存进行访问，导致数据混乱</li><li>高优先级的中断请求可以打断低优先级的中断处理程序的执行。然而，具体的中断处理方式还取决于中断控制器和系统设计的实现。在某些情况下，系统可能会选择忽略低优先级的中断请求，而不进行打断。</li></ol><h1 id="名词解释题" tabindex="-1">名词解释题 <a class="header-anchor" href="#名词解释题" aria-label="Permalink to &quot;名词解释题&quot;">​</a></h1><ol><li>全相联映像：就是让主存中的任何一个块都可以映像装入到Cache中的任何一个块的位置上。</li><li>指令系统：指一台计算机的所有指令的集合。</li><li>指令周期：是指从取指令、分析取数到执行完该指令所需的全部时间。 CPU周期：也叫机器周期，通常把一个指令周期划分为多个机器周期，每个机器周期完成一个基本操作。</li><li>向量中断：是指那些中断服务程序的入口地址是由中断事件自己提供的中断。</li><li>微指令：是指控制存储器中的一个单元的内容，即控制字，是若干个微指令的集合。</li><li>微操作命令：是控制完成微操作的命令；微操作：是由微操作命令控制实现的最基本操作。</li><li>快速缓冲存储器：为了提高访存速度，在CPU和主存之间增设的高速存储器，它对用户是透明的。只要将CPU最近期需用的信息从主存调入缓存，这样CPU每次只须访问快速缓存就可达到访问主存的目的，从而提高了访存速度。</li><li>基址寻址：有效地址等于形式地址加上基址寄存器的内容。</li><li>流水线中的多发技术：为了提高流水线的性能，设法在一个时钟周期（机器主频的倒数）内产生更多条指令的结果，这就是流水线中的多发技术。</li><li>指令字长：指机器指令中二进制代码的总位数。</li></ol><h1 id="第一章" tabindex="-1">第一章 <a class="header-anchor" href="#第一章" aria-label="Permalink to &quot;第一章&quot;">​</a></h1><ol><li>冯诺依曼计算机的最主要特点是存储程序。</li><li>计算机的五大件是指运算器、控制器、存储器、输入设备、输出设备。</li><li>算数逻辑运算单元的英文缩写为ALU。运算器的核心是加法器，还有通用寄存器和累加寄存器。</li><li>控制器从存储器中逐条地取出指令进行分析转化为控制信号发送给各个部件，控制它们执行指令所规定的任务。控制器中还包括一些专用寄存器。</li><li>辅助寄存器不能直接被CPU访问。</li><li>存储速度快到慢：寄存器、Cache、主存储器、辅助存储器。 存储容量大到小：辅助存储器、主存储器、Cache、寄存器。</li><li>主存储器用来存放当前正在执行的程序和数据。</li><li>辅助存储器用来存放暂时不运行的程序和数据。</li><li>Cache用来存放当前最活跃的程序和数据。</li><li>通道是承担I/O操作管理的主要部件。</li><li>计算机的主要性能指标：机器字长、数据通路宽度、主存容量、运算速度。</li></ol><h1 id="第二章" tabindex="-1">第二章 <a class="header-anchor" href="#第二章" aria-label="Permalink to &quot;第二章&quot;">​</a></h1><h1 id="第三章" tabindex="-1">第三章 <a class="header-anchor" href="#第三章" aria-label="Permalink to &quot;第三章&quot;">​</a></h1><ol><li>操作系统是计算机的主要属性。</li><li>机器指令的基本格式将指令分为操作码字段和地址码字段。</li><li>指令系统的每一条指令都有一个唯一确定的操作码。</li><li>计算机中需要编址的设备主要有CPU中的通用寄存器、主存和输入输出设备。</li><li>目前最普遍采用的编址方式是字节编址。没有地址信息浪费的是字编址。地址信息浪费最严重的是位编址。</li><li>立即寻址的指令执行速度最快、操作数不能被修改、灵活性最差。</li><li>当前页寻址使得指令和其操作数处在同一个页面。</li><li>数据结构中的堆栈通常指软堆栈。</li><li>指令可分为数据传输类、运算类、程序控制类、输入输出类。</li><li>一般传送指令、堆栈操作指令、数据交换指令都属于数据传输类指令。</li><li>算数运算指令、逻辑运算指令、移位指令都属于运算类指令。</li><li>转移指令、子程序调用指令、返回指令都属于程序控制类指令。</li><li>独立编址和统一编址的I/O指令都属于输入输出指令。</li><li>CISC(Complex Instruction Set Computer)为复杂指令集计算机。 RISC(Reduced Instruction Set Computer)为精简指令集计算机。</li><li></li></ol><p><img src="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/sp20230709_182942_110.png" alt="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/sp20230709_182942_110.png"></p><p>（1）A 为直接主存单元地址： 在直接寻址模式下，A字段占据4位，可以表示的地址范围是0到2^4-1，即0到15。每个主存单元的字长为12位，因此能访问的最大主存区域为16个机器字。</p><p>（2）A 为间接地址（非多重间址）： 在间接寻址模式下，A字段占据8位，表示一个地址，该地址指向实际操作数的位置。每个主存单元的字长为12位，因此能访问的最大主存区域为2^8个机器字，即4096个机器字。</p><p>（3）A 为变址寻址的形式地址，假定变址寄存器为R1（字长为12位）： 变址寻址模式使用一个变址寄存器，此处为R1，将A字段的值与R1的内容相加，以得到最终的操作数地址。R1是12位寄存器，因此可以表示2^12个不同的地址。 每个主存单元的字长为12位，因此能访问的最大主存区域为2^12个机器字，即4096个机器字。</p><ol><li>内存按字节编址，从A5000H到DCFFFH的区域的存储容量为224KB，请问怎么得到？</li></ol><h1 id="第四章" tabindex="-1">第四章 <a class="header-anchor" href="#第四章" aria-label="Permalink to &quot;第四章&quot;">​</a></h1><ol><li><p>补码和变补是两个不同的概念。假设字长为8位，其中1位符号位，有X=-0.1001，则[X]补=1.1110111，[-X]补=[[X]补]变补=？</p><p>X的补码是 1.1110111，所以我们首先减1：</p><p>1.1110111 - 1 = 1.1110110</p><p>然后我们取反：</p><p>1.1110110 取反得到 0.0001001</p><p>所以，[-X]补=[[X]补]变补=0.0001001。</p></li><li><p>运算结果的双符号位为01表示运算结果发生正溢，双符号位为10表示发生负溢。</p></li><li><p>有字长为8位双符号位补码表示的数(X=-22) [X]补=11,101010，算数左移1位后的二进制结果为11,010100，十进制结果为-44；采用恒舍法算数右移2位后的二进制结果为11,111010，十进制结果为-6；采用恒置1法算数右移2位后的二进制结果为11,111011，十进制结果为-5；采用下舍上入法算数右移2位后的二进制结果为11,111011，十进制结果为-5。</p><p>(1) 算数左移1位：我们将数字左移一位，高位出现的0或1会被丢弃，然后在低位补0。所以，11,101010左移1位应该得到：</p><p>11,010100</p><p>(2) 对应的十进制结果是-44，因为在双符号位补码表示中，左移操作相当于原数乘以2。</p><p>(3) 算术右移2位，采用恒舍法：恒舍法就是无论最低位是0还是1，都直接丢弃。所以，11,101010右移2位后得到：</p><p>11,111010</p><p>(4) 对应的十进制数值应该是-6。</p><p>(5) 算术右移2位，采用恒置1法：在恒置1法中，无论原最低位是0还是1，都将新的最低位设置为1。所以，11,101010右移2位后得到：</p><p>11,111011</p><p>(6) 对应的十进制数值应该是-5。</p><p>(7) 算术右移2位，采用下舍上入法：在下舍上入法中，如果最低位为1，就将次低位加1；如果最低位为0，就直接丢弃。所以，11,101010右移2位后得到：</p><p>11,111011</p><p>(8) 对应的十进制数值应该是-5。</p></li><li><p>规格化浮点数进行加减运算时，运算结果的尾数运算溢出不一定表示运算结果溢出，规格化的结果的阶码溢出才表示运算结果溢出。</p></li><li><p>已知：X=-6.25，Y=9.625 （1）、将X、Y分别转换成二进制浮点数（阶码和尾数均用补码表示，其中阶码占4位，尾数占8位，各包含一位符号位）。 （2）、用变形补码，求X-Y=？（舍入采用恒舍法，结果用二进制和十进制两种方法表示。）</p></li></ol><p><img src="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/d29d3936d895efa3fd5ca865e1d3ee4d.png" alt="https://cdn.jsdelivr.net/gh/0uxmin/picgohub@master/imgs/d29d3936d895efa3fd5ca865e1d3ee4d.png"></p><h1 id="第五章" tabindex="-1">第五章 <a class="header-anchor" href="#第五章" aria-label="Permalink to &quot;第五章&quot;">​</a></h1><ol><li>主存通常是由</li><li>大端方案将高字节放在低地址，小端方案将高字节放在高地址。符合人类常规思维的数据存放方案是大端方案，利于计算机处理的数据存放方案是小端方案。</li><li>边界对齐的数据存放方式，既可以保证所有的数据在一个读写周期内完成，又能大大减少存储器资源的浪费。</li></ol>`,38),o=[t];function r(n,h,s,d,c,u){return l(),p("div",null,o)}const b=i(a,[["render",r]]);export{P as __pageData,b as default};
