
<!--标签切换-->
function setTab(name,cursel,n){
 for(i=1;i<=n;i++){
  var menu=document.getElementById(name+i);
  var con=document.getElementById("con_"+name+"_"+i);
  menu.className=i==cursel?"hover":"";
  con.style.display=i==cursel?"block":"none";
 }
}
<!--标签切2换-->
function setTabb(name,cursel,n){
 for(i=1;i<=n;i++){
  var menu=document.getElementById(name+i);
  var con=document.getElementById("conb_"+name+"_"+i);
  menu.className=i==cursel?"hover2":"";
  con.style.display=i==cursel?"block":"none";
 }
}
<!--article标签切3换-->
function setTabbb(name,cursel,n){
 for(i=1;i<=n;i++){
  var menu=document.getElementById(name+i);
  var con=document.getElementById("conbb_"+name+"_"+i);
  menu.className=i==cursel?"hover3":"";
  con.style.display=i==cursel?"block":"none";
 }
}
























