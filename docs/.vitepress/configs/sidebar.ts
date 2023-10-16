import type { DefaultTheme } from 'vitepress'
import sidebarAuto from '../sidebarAuto.js'
import path from 'node:path';

export const sidebar: DefaultTheme.Config['sidebar'] = {
  "weekly": sidebarAuto(
    path.resolve(__dirname,"../../weekly/2023"),"2023年周报"
  ),

  "/workflow/":sidebarAuto(
    path.resolve(__dirname, "../../workflow/computer-network"),"计算机网络"
    
  ).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/computer-principles"),"计算机组成原理s"
    
  )).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/git"),"Git"
    
  )).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/soft-exam"),"软考网络知识"
    
  )),
  "/analysis/": sidebarAuto(
    path.resolve(__dirname,"../../analysis/utils"),"分析"
  )


}

