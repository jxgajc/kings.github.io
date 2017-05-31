$(document).ready(function() {

		if(document.getElementById("vms_player")){
			var ios_url = $('#ios_url').attr('value');
			ios_url = ios_url.replace('http://video.chinadaily.com.cn', '');
			var ios_width = $('#ios_width').attr('value');
			var ios_height = $('#ios_height').attr('value');
			var status = is_ipad(ios_url, ios_width, ios_height); 
		}
	});
function is_ipad(url, width, height){
   var url_r = url;
       var arr = new Array(); 
        arr = url_r.split("output").reverse();
      var url_ok=arr[0];
      url_ok = url_ok.replace('_800k.flv', '_500k.mp4');
var ipadUrl= "http://videostream.chinadaily.com.cn:1935/app_1/_definst_/mp4:ugc"+url_ok+"/playlist.m3u8";
var androidUrl = "rtsp://videostream.chinadaily.com.cn:1935/app_1/_definst_/mp4:ugc"+url_ok;

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i))) {
$("#play-logo").hide();
$("#openclose").hide();
$("#vms_player").html('<video width="'+width+'" height="'+height+'" controls="controls"><source src="'+ipadUrl+'" type="video/mp4"></video>');
return false; 
}
return true; 
}