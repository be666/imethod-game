let enter = require('../config/enter.json');
let html = [];
html.push('<div>')
for (var moduleName of Object.keys(enter)) {
  let mdoules=enter[moduleName];
  for(let _module of mdoules){
    html.push(`<div><a href="./${Object.keys(_module)[0]}.html">${Object.keys(_module)[0]}</a></div>`)
  }
}

html.push('</div>')
document.querySelector('body').innerHTML=html.join('');
