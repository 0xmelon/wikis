import { resolve } from 'path';
import dirTree from 'directory-tree';
import path from 'node:path';

function toSidebarOption(tree = []) {
  if (!Array.isArray(tree)) return [];

  return tree.map((v) => {
    if (v.children !== undefined && Array.isArray(v.children) && v.children.length > 0) {
      // console.log('林佳敏')
      return {
        text: v.name,
        collapsible: true,
        collapsed: true,
        items: toSidebarOption(v.children),
      };
    } else {
      return {
        text: v.name.replace(".md", ""),
        link: v.path.split("docs")[1].replace(".md", ""),
      };
    }
  });
}

// 如果第一段列表具有items属性，将不推入itemsWithData
function findItemsWithData(items) {
  const itemsWithData = [];

  function traverse(items) {
    for (const item of items) {
      if (!item.items) {
        itemsWithData.push(item);
      }
    }
  }

  traverse(items);

  return itemsWithData;
}


function sidebarAuto(srcPath, title) {
  const srcDir = dirTree(srcPath, {
    extensions: /\.md$/,
    normalizePath: true,
  });

  let sidebarItems
  if(srcDir.children&&srcDir.children!=undefined){
    // console.log('linjiam')
    sidebarItems = toSidebarOption(srcDir.children);  
    // console.log(sidebarItems)
  }
   

  const itemsWithData = findItemsWithData(sidebarItems);
  // console.log(itemsWithData);

  return [
    {
      // 判断title有没有值，有就使用传入的title值
      text: title == undefined ? srcDir.name : title,
      collapsible: true,
      collapsed: true,
      items: itemsWithData,
    },
  ];

}


let a = sidebarAuto(path.resolve(__dirname, "../workflow/css"),
  "JavaScript"
)
console.log(a.forEach((value) => {
  console.log(value)
}))

export default sidebarAuto;