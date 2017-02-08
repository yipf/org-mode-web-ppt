
var imgresize=function(){
	var count=$(".figure:visible").length;
    if ($(".outline-text-2:visible p:first").text()){
	    count++;
	}
    $(".figure:visible").each(function(index){
	var browserwidth = $(window).width();
	var browserheight = $(window).height();
	var figwidth = $(this).width();
	var figheight = $(this).height();
	var figratio=figwidth/figheight;
	if (count){
	    $(this).css("right",(index)*(100/count)+"%")
	    $(this).css("width",100/count+"%");
	}
	$(this).find("img").each(function(){
	    var imgwidth=$(this).width();
	    var imgheight=$(this).height();
	    var imgratio=imgwidth/imgheight;

	    if (figratio >= imgratio) {
		$(this).css("height",(figheight-60));
		$(this).css("width",(figheight-60)*imgratio);

	    }else{
		$(this).css("width",(figwidth-60));
		$(this).css("height",(figwidth-60)/imgratio);
	    }
	}) })
}

var goto_slide_by_id;

var make_ready=function(document){
	var mySlides;
	// infrmation bar 
	var info;
	var update_info=function(active){
		if(info){
			info.innerHTML=active+" / "+(mySlides.length-1);
		}
	}
	// the goto slide core function
	var active=0;
	var iterate=function(seed,iter,func){		while(seed=iter(seed)){			func(seed);		}	}
	var get_parent=function(node){		return node.parentNode;	}
	var get_previous=function(node){ 	return node.previousSibling;	}
	var hide=function(node){ 	node=$(node); if(node.hasClass("slide")){node.hide()};	}
	var show=function(node){  node=$(node); if(node.hasClass("slide")){node.show()};	}
	var prepare_slide=function(slide,action,incremental){
		iterate(slide,get_parent,action);
		if(incremental){			iterate(slide,get_previous,action);		}
	}
	var is_inremental=function(node){
		return $(node).hasClass("outline-4");
	}
	var safe_number=function(n,N){ // function make sure n is in [0,N-1]
		while(n>=N){n-=N;}
		while(n<0){n+=N;}
		return n;
	}
	var goto_slide=function(step,relative){
		if(relative){			step+=active;		}
		step=safe_number(step,mySlides.length);
		if(step==active){ return step;}
		// hide previous slide
		var node=mySlides[active];
		prepare_slide(node,hide,is_inremental(node));
		hide(node);
		// show current slide
		active=step;
		node=mySlides[active];
		prepare_slide(node,show,is_inremental(node));
		$(node).show(); // can be modified to define animation
		// update info
		update_info(active);
		return step;
	}
	// helper functions for redefine links
	var container2slide=function(level){
		var classname="outline-"+level
		var slides=$("."+classname)
		if(slides.length<1){return false;}
		$(slides).addClass("slide");
		return true;
	}
	var leaded_by=function(str,header){
		return str.substring(0,header.length)==header;
	}
	return function(){
		// define slides
		$(".title").addClass("slide"); // make title page as single slide
		$("#table-of-contents").addClass("slide"); // make table-of-contents as single slide
		var i=2;
		while(container2slide(i)){i++;}
		// get slides
		mySlides= $(".slide");
		// process toc urls
		var map={};
		$("a[href^='#orgheadline']").each(function(index,element){
			element.href=element.href.replace(/^.*#([^#]*)$/,"javascript:goto_slide_by_id('outline-container-$1');")
		});	
		$(mySlides).each(function(index,element){
			var id=element.id;
			if((id=element.id)&&id.match(/^outline\-container\-/)){
				map[id]=index;
			}
		});
		goto_slide_by_id=function(id){
			if(id=map[id]){
				goto_slide(id);
			}
		}
		show(mySlides[0]);
		//~ $(mySlides[0]).show();
		// get info container
		info=$(".status")[0];
		// bindkeys
		document.onkeydown = function(event) {
			var keycode = (event) ? event.which : window.event.keyCode;
			switch(keycode){
				case 37: // left
				case 38: // up
				case 33: // pageup
				case 8:  // backspace
					goto_slide(-1,true);
					break;
				case 39: // right
				case 40: // down
				case 34: // pagedown
				case 32:  // space
					goto_slide(1,true);
					break;
				case 36: // home
					goto_slide(1,false);
					break;
				case 35: // end
					goto_slide(0,false);
					break; 
				case 68: // 'd'
					window.open('call-names.html');
					break;
				default:
					return true;
			}
			imgresize();
			return false;
		}
	}
}

$(document).ready(make_ready(document));
$(window).bind("resize", imgresize)