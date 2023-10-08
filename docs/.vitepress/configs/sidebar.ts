import type { DefaultTheme } from 'vitepress'
import sidebarAuto from '../sidebarAuto.js'
import path from 'node:path';

export const sidebar: DefaultTheme.Config['sidebar'] = {
  "weekly": sidebarAuto(
    path.resolve(__dirname,"../../weekly/2023"),"2023年周报"
  ),

  "/workflow/": sidebarAuto(
    path.resolve(__dirname, "../../workflow/css"),

  ).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/git"),

  )).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/computer-network"),"计算机网络"
    
  )).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/computer-focus"),"计算机组成原理"
    
  )).concat(sidebarAuto(
    path.resolve(__dirname, "../../workflow/git"),"Git"
    
  )),
  "/analysis/": sidebarAuto(
    path.resolve(__dirname,"../../analysis/utils"),"分析"
  )


}

