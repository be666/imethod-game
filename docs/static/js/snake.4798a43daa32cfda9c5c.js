webpackJsonp([3,0],[function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}var i=t(33),r=o(i),a=t(31),d=o(a),l=function(e){var n={};return n.code=e,n.isDown=!1,n.isUp=!0,n.press=void 0,n.release=void 0,n.downHandler=function(e){e.keyCode===n.code&&(n.isUp&&n.press&&n.press(),n.isDown=!0,n.isUp=!1),e.preventDefault()},n.upHandler=function(e){e.keyCode===n.code&&(n.isDown&&n.release&&n.release(),n.isDown=!1,n.isUp=!0),e.preventDefault()},window.addEventListener("keydown",n.downHandler.bind(n),!1),window.addEventListener("keyup",n.upHandler.bind(n),!1),n},s=PIXI.Container,u=PIXI.autoDetectRenderer,c=(PIXI.loader,PIXI.loader.resources,PIXI.utils.TextureCache,PIXI.Graphics),f=PIXI.Text,h=(PIXI.Texture,PIXI.Sprite,window.innerWidth),v=window.innerHeight,p=new s,w=u(h,v,{antialias:!0,transparent:!1,resolution:1});document.body.appendChild(w.view);var g=20,I=Math.floor(h/g),S=Math.floor(v/g),m=10,C=void 0,k=!0,x=void 0,D=0,y=0,M=[],T=[],b=[],P=void 0,X=void 0,L=void 0,E=void 0,F=void 0,H=4,U=0,z=10,J=void 0,O=function(){T=(0,d["default"])({length:m},function(e,n){return[Math.floor((I-m)/2+n)*g,Math.floor(S/2)*g]})},R=function(){var e=[];e.push([0,0]),e.push([0,S*g]),e.push([I*g,S*g]),e.push([I*g,0]),M.push([e[0],e[1]]),M.push([e[1],e[2]]),M.push([e[2],e[3]]),M.push([e[3],e[0]])},N=function(e,n){return n?{start:e[0],end:e[1]}:{start:e[e.length-1],end:e[e.length-2]}},_=function(e,n){var t=[],o=void 0,i=void 0,r=0,a={start:[],end:[]};for(a.start=e[r],r++,a.end=e[r],r++,o=a.end[1]-a.start[1],i=a.end[0]-a.start[0],r++;r<e.length;)e[r][0]-a.end[0]!=i||e[r][1]-a.end[1]!=o?(t.push(a),a={start:a.end,end:e[r]},o=a.end[1]-a.start[1],i=a.end[0]-a.start[0]):a.end=e[r],r++;return t.push(a),{lines:t,header:N(e,n)}},q=function(e,n){n.lines.forEach(function(n){var t=new c;t.lineStyle(g,13434777,1),t.moveTo(n.start[0],n.start[1]),t.lineTo(n.end[0],n.end[1]),e.addChild(t)})},A=function(e,n){var t=new c;t.lineStyle(g,267386880,1),t.moveTo(n.header.start[0],n.header.start[1]),t.lineTo(n.header.end[0],n.header.end[1]),e.addChild(t)},G=function(){x&&(p.removeChild(x),x=null),x=new s;var e=_(T,k);q(x,e),A(x,e),p.addChild(x)},W=function(){P=new s,M.forEach(function(e){var n=new c;n.lineStyle(10,13434777,1),n.moveTo(e[0][0],e[0][1]),n.lineTo(e[1][0],e[1][1]),P.addChild(n)}),p.addChild(P)},j=function(){L&&(p.removeChild(L),L=null),L=new s,J=new f("Score : "+U,{fontSize:"32px",fill:"white"}),J.anchor.set(.5,.5),J.position.set(I/2*g,g+20),L.addChild(J),p.addChild(L)},B=function(){X&&(p.removeChild(X),X=null),X=new s,b.forEach(function(e){var n=new c;n.lineStyle(1,13434777,1),n.beginFill(16750899),n.drawRect(e[0]-g/2,e[1]-g/2,g,g),n.endFill(),X.addChild(n)}),p.addChild(X)},K=function(){for(;b.length<H;){var e=!1,n=function(){var n=Math.floor((.8*Math.random()+.1)*I),t=Math.floor((.8*Math.random()+.1)*S),o=[n*g,t*g];!b.findIndex(function(e){return e[0]==o[0]&&e[1]==o[1]})>-1&&!T.findIndex(function(e){return e[0]==o[0]&&e[1]==o[1]})>-1&&(b.push(o),e=!0)};do n();while(!e)}},Q=function(e){var n=b.findIndex(function(n){return n[0]==e[0]&&n[1]==e[1]});b.splice(n,1)},V=function(){ie(),0==T.length&&O(),R(),W(),j(),G(),K(),B(),$();var e=l(37),n=l(38),t=l(39),o=l(40);e.press=function(){D=-g,y=0},e.release=function(){!t.isDown&&0===y},n.press=function(){y=-g,D=0},n.release=function(){!o.isDown&&0===D},t.press=function(){D=g,y=0},t.release=function(){!e.isDown&&0===y},o.press=function(){y=g,D=0},o.release=function(){!n.isDown&&0===D},C=ne,se()},Y=function(e){return 0==e[0]||e[0]==I*g||(0==e[1]||e[1]==S*g||T.findIndex(function(n){return n[0]==e[0]&&n[1]==e[1]})>-1)},Z=function(e){if(b.findIndex(function(n){return n[0]==e[0]&&n[1]==e[1]})>-1)return e;for(var n=b.length,t=null;n>0;)if(n--,T.findIndex(function(e){return e[0]==b[n][0]&&e[1]==b[n][1]})>-1){t=b[n];break}return t},$=function(){F&&(p.removeChild(F),F=null),F=new s;var e=new f("按上、下、左、右键开始",{fontSize:"32px",fill:"white"});e.anchor.set(.5,.5),e.position.set(I*g/2,S*g/4),F.addChild(e),p.addChild(F)},ee=function(){F&&(p.removeChild(F),F=null)},ne=function(){if(D||y){var e=N(T,k),n=e.start[0]-e.end[0],t=e.start[1]-e.end[1];if(n==D==0&&t==-y||t==y==0&&n==-D)return void $();ee();var o=[e.start[0]+D,e.start[1]+y];if(Y(o))return de();var i=Z(o);i?(m++,k?T.splice(0,0,o):T.push(i),U+=z,Q(i),K()):k?(T.splice(0,0,o),T.splice(m,1)):(T.splice(0,1),T.push(o)),G(),B(),j()}},te=function(){E&&(p.removeChild(E),E=null)},oe=function(){te(),D=0,y=0,m=10,U=0,b.splice(0,z.length),T.splice(0,T.length),O(),j(),G(),K(),B(),C=ne},ie=function(){try{var e=void 0,n=void 0,t=void 0,o=void 0;console.log(localStorage.getItem("snakeStore")),localStorage.getItem("sumScore")&&(e=parseInt(localStorage.getItem("sumScore"))),localStorage.getItem("snakeLength")&&(o=parseInt(localStorage.getItem("snakeLength"))),localStorage.getItem("eatStore")&&(n=JSON.parse(localStorage.getItem("eatStore"))),localStorage.getItem("snakeStore")&&(t=JSON.parse(localStorage.getItem("snakeStore"))),o&&(U=e,m=o,b=n,T=t)}catch(i){localStorage.clear()}},re=function(){localStorage.setItem("sumScore",U),localStorage.setItem("snakeLength",m),localStorage.setItem("eatStore",(0,r["default"])(b)),localStorage.setItem("snakeStore",(0,r["default"])(T))},ae=function(){E&&(p.removeChild(E),E=null),E=new s;var e=new f("LOST !",{fontSize:"64px",fill:"white"});e.anchor.set(.5,.5),e.position.set(I/2*g,S/2*g),E.addChild(e);var n=new c;n.beginFill(65280),n.drawRect(I/2*g-60,S/2*g+64,120,40),n.endFill(),n.interactive=!0,n.buttonMode=!0,n.accessible=!0,n.mousedown=n.click=function(){oe()},E.addChild(n),e=new f("重新开始"),e.anchor.set(.5,.5),e.position.set(I/2*g,S/2*g+64+20),E.addChild(e),p.addChild(E)},de=function(){C=function(){},ae(),$()},le=0,se=function ue(){requestAnimationFrame(ue),le++,le%5==0&&C(),re(),w.render(p)};V()}]);