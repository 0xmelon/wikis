import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.86061f54.js";const u=JSON.parse('{"title":"Vue 实用技巧","description":"","frontmatter":{},"headers":[],"relativePath":"workflow/vue/index.md","lastUpdated":1695991067000}'),e={name:"workflow/vue/index.md"},p=l(`<h1 id="vue-实用技巧" tabindex="-1"><code>Vue</code> 实用技巧 <a class="header-anchor" href="#vue-实用技巧" aria-label="Permalink to &quot;\`Vue\` 实用技巧&quot;">​</a></h1><h2 id="vue2-在父组件中监听子组件的生命周期钩子" tabindex="-1"><code>Vue2</code> 在父组件中监听子组件的生命周期钩子 <a class="header-anchor" href="#vue2-在父组件中监听子组件的生命周期钩子" aria-label="Permalink to &quot;\`Vue2\` 在父组件中监听子组件的生命周期钩子&quot;">​</a></h2><div class="language-vue line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">child</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">@hook:mounted</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">onChildMounted</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">child</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">methods</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#F07178;">onChildMounted</span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{}</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p><a href="https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L347" target="_blank" rel="noreferrer">相关源码</a></p><h2 id="在-methods-中使用-debounce-throttle" tabindex="-1">在 <code>methods</code> 中使用 <code>debounce</code> / <code>throttle</code> <a class="header-anchor" href="#在-methods-中使用-debounce-throttle" aria-label="Permalink to &quot;在 \`methods\` 中使用 \`debounce\` / \`throttle\`&quot;">​</a></h2><div class="language-vue line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">container</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">@click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">handleClick</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">debounce</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">lodash-es</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">methods</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">    </span><span style="color:#F07178;">handleClick</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">debounce</span><span style="color:#BABED8;">(</span><span style="color:#C792EA;">function</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{},</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">500</span><span style="color:#BABED8;">)</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p><a href="https://cn.vuejs.org/v2/guide/migration.html#%E5%B8%A6%E6%9C%89-debounce-%E7%9A%84-v-model%E7%A7%BB%E9%99%A4" target="_blank" rel="noreferrer">官网例子</a></p>`,7),o=[p];function t(c,r,D,F,i,y){return n(),a("div",null,o)}const b=s(e,[["render",t]]);export{u as __pageData,b as default};
