var proce;
var currentPage = "newColl";
var isCheckContentNull = true;
var tb;
var isSubmitOperation; // 直接离开窗口做出提示的标记位
var newColl_layout;// 动态布局layout对象
var calenderOnclickFun;
var _TimeFn;
var contentLoaded = false;
function parseIds4Panles(){
	var panlesValue = "";
    var ids = $("#supervisorIds").val().split(',');
    if(ids[0] != ""){
        for(var i = 0;i < ids.length;i++){
            if(i == ids.length -1){
            		panlesValue = panlesValue + 'Member|' + ids[i] ;
            }else {
            		panlesValue = panlesValue + 'Member|' + ids[i] +",";
            }
        }
    }
    return panlesValue;
 }


function _initLayout(){

    var layout = $("#newColl_layout").layout();
    if($("#hasPeoplesArea").length > 0 && $("#process_info").val() != ""){
        hideLayoutEast();
    }else{
        var eastInitWidth = 270;
        if(isSystemTemplete == 'true' || paramfrom == 'waitSend'){
            eastInitWidth = 350;
        }
        layout.setEast(eastInitWidth);
    }
    $(".shou").click(function(){
        var _wid = $(".layout_east").width();
        if(_wid>40){
            layout.setEast(40);
            if(isSystemTemplete == 'true'){
                $(".guanlian_info").hide();
                $(".hide_span").show();
            }else{
                $(".common_contact").hide();
                $(".common_contact_title").hide();
                $(".hide_span_people").show();
            }
            
            $(this).attr("src", _ctxPath + "/common/images/shou1.jpg");
        }else{
            if(isSystemTemplete == 'true'){
                $(".guanlian_info").show();
                $(".hide_span").hide();
                layout.setEast(350);
            }else{
                $(".common_contact").show();
                $(".common_contact_title").show();
                $(".hide_span_people").hide();
                layout.setEast(270);
            }
            
            $(this).attr("src",_ctxPath + "/common/images/shou.jpg");
        }
        setTimeout(function(){
        	if($("#replyContent_sender").size() > 0){
        		var newLeft = $("#replyContent_sender").offset().left;
    			$("#comment_deal").find('table').css({
    				"left":newLeft,
    				"margin-left":0
    			});
        	}
		},0)
    })
    $(".common_contact_li ul").css({"height":$(window).height()-150});
}

function resetZwIframeHeight(delay){
    if(delay){
        setTimeout(function(){
            __resetZwIframeHeight();
        },1);
    }else{
        __resetZwIframeHeight();
    }
}

function __resetZwIframeHeight(){
    
    var _height = $(".layout_center").height(),
        $zwifame = $("#zwIframe"),
        $north_area_h = $("#north_area_h"),
        $comment_deal = $("#comment_deal");
        $zwOfficeIframe = $("#zwOfficeIframe");
        $contentAndComment = $("#contentAndComment");
    
	var zwifameheight =  _height - $north_area_h.height() - $comment_deal.height();
    if($zwifame.attr("isshow")!="false"){
        if(waitsendflag || _subState=='1'){
        	$zwifame.height(zwifameheight);	
        	$zwOfficeIframe.height(zwifameheight - 32);
        	$("#comment_deal").find('table').css({
    			"left":"50%",
    			"margin-left":"-393px"
    		})
        }else{
        	//发起人重新编辑，能查看处理意见
        	$zwifame.height(zwifameheight - 52 - 16);
    		$zwOfficeIframe.height(zwifameheight - 52 - 16 - 32);
    		setTimeout(function(){
    			if($("#replyContent_sender").size()>0){
    				var newLeft = $("#replyContent_sender").offset().left;
    	    		$("#comment_deal").find('table').css({
    	    			"left":newLeft,
    	    			"margin-left":0
    	    		});
    			}
    		},0)
        }
		$contentAndComment.height(zwifameheight);
		
		if(window.OfficeObjExt){
		    OfficeObjExt["firstHeight"] = zwifameheight;
		}
    }
}

//新建页面初始化方法
$(document).ready(function(){
    
    _initLayout();
    
    //布局
    resetZwIframeHeight();
    $(window).resize(function(){
        resetZwIframeHeight(true);
    });
    
	try{
		if (!isformTemplate){
			$("#centerBar").css("overflow","hidden");
		}
	}catch(e){}

	// 从首页待办栏目 人员卡片中打开的新建协同页面
	if($.trim(getCtpTop().newCollDialog) != ""){
		try{
		  hideLocation();
		}catch(e){}
	}

    newColl_layout=$("#newColl_layout").layout();
    try{
      // 文档中心过来的时候需要打开快捷面板
      if(paramfrom != 'a8genius'){
    	  getCtpTop().showLeftNavigation();
      }
    }catch(e){}
    if(wfXmlInfo && wfXmlInfo.trim()!=''){
        $("#workflow_definition #process_xml")[0].value= wfXmlInfo;
    }
    new inputChange($("#subject"), $.i18n('common.default.subject.value2'));
	if($("#process_info").val() == ""){
	    $("#process_info").val($.i18n('collaboration.default.workflowInfo.value'));
	}

	tb = $("#toolbar").toolbar({
		isPager : false,
		borderLeft : false,
		borderRight : false,
		borderTop : false,
		toolbar : initAttItem()
	});
	disableSendButtions();
	if(!isOfficeSupport){
        disable4Office();
    }

	if(ishideconotentType){
    	tb.hideBtn("conotentType");
    }

	// 更多按钮操作
    var moreShow_st = 0;// 更多状态
    $("#show_more").click(function () {
        if (moreShow_st==0) {
            $(this).html(_collapse+'<span class="ico16 arrow_2_t"></span>');
            $(".newinfo_more").show();
            moreShow_st=1;
        }else {
            $(this).html(_expansion+'<span class="ico16 arrow_2_b"></span>');
            $(".newinfo_more").hide();
            moreShow_st=0;
        }
        resetZwIframeHeight();
    });
    // 附言按钮操作
    var adtional_ico_hide = true;
    $("#adtional").click(function () {
    	if (adtional_ico_hide) {
            $("#fuyan_area").show();
            $("#comment_deal").height(170);
        } else {
            $("#fuyan_area").hide();
	        $("#comment_deal").height(41);
        }
        $("#adtional_ico").toggleClass("arrow_2_t arrow_2_b");
        adtional_ico_hide = !adtional_ico_hide;

        resetZwIframeHeight();
    });
    // 附言默认值
    checkContentOut();


    $("#supervisors").attr('readonly','readonly');
   

    // lilong
    //特殊环境下， tokenInput 没有加载完成，下面报错
    if(wfProcessId == null || wfProcessId == ''){
    	setTimeout(function(){
            $("#process_info").tokenInput();// 快速选人组件
        },100);
    }else{
        $("#process_info").bind('click',function(){
            $("#workflow_btn").trigger("click");
        });
    }
     
    $("#canTrack").attr("checked","checked");
    trackOrnot();

     document.getElementById("radioall").checked=true;
     // 流程期限和提醒时间的校验
     var deadLine = $("#deadLine");
     /*OA-90601 ie8下新建协同和调用表单时流程期限显示有问题，同样操作chrome正常*/
     $("#deadLine option[value='0']").after("<option value='-1'>"+$.i18n('collaboration.deadline.custom')+"</option>");
     var mycal = $("#deadLineDateTime");
     var deadLineObj=$("#deadLine");
     if(deadl=="-1"){
    	 deadLineObj.val("-1");
     }
     if(deadLineObj.val()){
    	 deadLine.val(deadLineObj.val());// 从待发或者模板中打开回写流程期限
    	 /*OA-91353 新建协同后进入新建页面，流程期限默认是无，但是流程期限到时自动终止复选框可以勾选*/
//          if(!isSysTem){// 不是系统模板
//            $("#canAutostopflow")[0].disabled = false;// 把 流程期限到时自动终止 设置为可选
//         }
     }else{
    	 deadLine.val(0);// 从待发或者模板中打开回写流程期限
     }
     var isResetRemaind=false;// 是否重置提前提醒时间
     // 流程期限
     if (deadLine&&deadLine.length==1) {
        var deadLineTime = deadLine[0].value;
        if(deadLineTime&&deadLineTime!="-1"&&deadLineTime!="0"){
            // 日期计算
            var dateValueStr = getDateTimeValue(deadLineTime);
            if (mycal) {
                mycal.val(dateValueStr);
            }
            $("#deadLineCalender").css("display","block");
            $("#deadLineDateTime").attr("disabled",true);
            // 把日期控件按钮的点击事件去掉
            calenderOnclickFun=$("#deadLineCalender .calendar_icon")[0].onclick;
            $("#deadLineCalender .calendar_icon")[0].onclick=null;
        }else if(deadLineTime!="0"){
        	var deadLineStr=$("#deadLineDateTimeHidden").val();
            if(deadLineStr){
                mycal.val(deadLineStr);
                $("#deadLineCalender").css("display","block");
            }else{// 保存的时候设置了自定义，但是清空了时间内容
            	deadLine.val(0);
                $("#deadLineCalender").css("display","none");
                isResetRemaind=true;
            }
        }
     }

     setAutoEnd();
    
     // 不是新建的协应该加入 页面上 本应该存在的数据
     initFromData();
     
   // 是否做出提示 当调用模板的时候 不存在部门主管
     warnforSupervise();
     var newDialog= getCtpTop().newCollDialog;
     if(newDialog == null){// 页面离开是调用
          $.confirmClose();
     }
     trimNbsp();
     if(tracktypeeq2){// 重复发起的时候
 		document.getElementById("radiopart").checked= true;
 		$("#zdgzry").val(fgzids);
 	}
 	if(tracktypeeq0){
 	 	$("#canTrack").click();
 	 	document.getElementById("radioall").checked= false;
 	 	$("#radioall,#radiopart").disable();
 	}
 	try{
	 	if(canTrackWorkFlowValue == 0){
	 		$("#canTrackWorkFlow").val(0);
	 	}else if(canTrackWorkFlowValue == 1){
	 		$("#canTrackWorkFlow").val(1);
	 	}else if(canTrackWorkFlowValue == 2){
	 		$("#canTrackWorkFlow").val(2);
	 	}
 	}catch(e){
 		$("#canTrackWorkFlow").val(0);
 	}

 	// 表单正文需要判断一下是否有签章字段
 	if(bodyType == '20'){
 		// document.zwIframe.checkInstallHw(disable4Hw);
 	}
 	// 如果是PDF的不让修改正文
 	if (bodyType == '45') {
 	        $("#canEdit")[0].disabled = true;
 	        $("#canEdit")[0].checked = false;
 	}
	
 	
 	// 新建协同等选择关联项目时，增加查询功能
 	var projectProperties=new Object();
 	projectProperties["id"]="selectProjectId";
 	projectProperties["name"]="projectIdSelect";
 	projectProperties["class"]="input-100per";
 	//协同模板标记
 	projectProperties["isTemFlag"]=isTemFlag;
 	if(_isProjectDisabled){
 		projectProperties["disabled"] = "disabled";
 	}
 	
 	if(typeof(initProjectSelect)!='undefined'){
 		initProjectSelect(projectProperties,'selectRelatepro',projectId);
 	}else{
 		var proHtml="<select";
		for(var p in projectProperties){
			if(p!="disabled"){
				proHtml+=" "+p+"='"+projectProperties[p]+"' ";
			}
		}
		//第二步:第一列默认都显示无
		proHtml+="><option id='none' title='"+$.i18n('collaboration.project.nothing.label')+"' value='-1' selected>"+$.i18n('collaboration.project.nothing.label')+"</option>";//无
 		$("#selectRelatepro").html(proHtml);
 	}
 	
 	setTimeout(function(){
 		var jval = $.parseJSON(pTemp.jval);
 		if(!jval.hasProjectPlugin){
 			$("#selectProjectId").attr("disabled","disabled");
 		}
 		if(!jval.hasDocPlugin){
 			$("#colPigeonhole").attr("disabled","disabled");
 		}
 	},200);
 	
	setProcessId();
	if(isResetRemaind){
		var remind = $("#advanceRemind");
		if(remind[0]){
			remind[0].selectedIndex = 0;// 将提前提醒设置为 无
        }
	}
	if( paramfrom != 'waitSend' && !customSetTrackFlag){
		$("#canTrack").click();
		$("#radioall")[0].checked = false;
		$("#radiopart")[0].checked = false;
		$("#radioall,#radiopart").disable();
	}
	var _contentType = $("#contentType").val();
	
	if(!$.browser.msie && isOffice_Fun(_contentType)){
		$("#sendId")[0].disabled = true;
	}
	// if(_formTitleText){
		// $("#subject").val('${_formTitleText}');
	// }
	// OA-71692.新建协同 正文显示有问题 见图（暂时先这里处理 以后样式肯定要重新调下）
	if(bIsClearContentPadding){
		//$(".layout_center").css("height","auto");
	}
	if(!issystemtemflag){
		$("#unCancelledVisor").val("");
	}
});

function barCode() {
	 var fnx_zwIframe = _getZWIframe();
	 fnx_zwIframe.openScanPort();
}


function _hiddenPartTrackNameInput(){
	var partText = document.getElementById("zdgzryName");
	partText.style.display="none";
}

var proce = null;
function startProcessBar() {
	try {
		proce = $.progressBar();
	} catch (e) {
	}
}
function endProcessBar(){
	if (proce != null) {
		try {
			proce.close();
		} catch (e) {
		}
	}
}
function send(){

	startProcessBar();

	var sendDevelop = $.ctp.trigger('beforSendColl');
	 if(sendDevelop){
		
		sendCollaboration();
		
	 }else{
		 endProcessBar();
	 }
}


/**
 * 常用联系人姓名点击事件
 * @param input
 */
function clickName(input){
	var item = {};
	var v = $(input).attr("v");
	var k = $(input).attr("k");
	var d = $(input).attr("d");
	var s = $(input).attr("s");
	item.v= v;
	item.k = k;
	item.d = d;
	item.s = s;
	var token = $("#process_info").data("tokenInputObject");
	if(token && typeof(token.add)!="undefined" ){
		token.add(item);
	}
}

function hideCommonContact(){
	if($("#hasPeoplesArea").length > 0){
		hideLayoutEast();
	}
}

/**
 * 隐藏右侧的区域
 */
function hideLayoutEast(){
		var layout = $("#newColl_layout").layout();
	   layout.setEast(0);
	   $(".layout_east").css("overflow","hidden");
	   layout.setEastSp(false);
	   $(".layout_center").css("width",$(".layout_center").width()+7);
}

//编辑流程
function workflowClick(){
    tidyDatas("process_info",defaultNodeName,defaultNodeLable);
}

//指定人单选按钮添加点击事件
function trackPart(){
	 $.selectPeople({
	        type:'selectPeople'
	        ,panels:'Department,Team,Post,Outworker,RelatePeople,JoinOrganization'
	        ,selectType:'Member'
	        ,text:$.i18n('common.default.selectPeople.value')
	        ,hiddenPostOfDepartment:true
	        ,hiddenRoleOfDepartment:true
	        ,showFlowTypeRadio:false
	        ,returnValueNeedType: false
	        ,params:{
	           value:zdgzid
	        }
	        ,targetWindow:getCtpTop()
	        ,callback : function(res){
	        	if(res && res.obj && res.obj.length>0){
	                $("#zdgzry").val(res.value);
	               // 定义获取指定人名称
					if(res.value.length > 0){
						var zgrArr = res.value.split(",");
						var zddr ="";
						if(zgrArr.length > 0){
							for(var co = 0 ; co<zgrArr.length ; co ++){
								zddr += "Member|" + zgrArr[co]+",";
							}
							if(zddr.length > 0){
								zdgzid = zddr.substring(0,zddr.length - 1);
							}
						}
						 //trackName(res);
						var partText = document.getElementById("zdgzryName");
						partText.style.display="";
						$("#zdgzryName").val(res.text).attr('title', res.text);
					}
	            } else {

	            }
	        }
	    });
}

//督办人员输入框添加点击事件
function superviseNamesClick(){
    var paramsValue =  parseIds4Panles();
  	 $.selectPeople({
	        type:'selectPeople'
	        ,panels:'Department,Team'
	        ,selectType:'Member'
	        ,minSize:0
	        ,text:$.i18n('common.default.selectPeople.value')
	        ,returnValueNeedType: false
	        ,showFlowTypeRadio: false
	        ,onlyLoginAccount:false
	        ,maxSize:10
	        ,params:{
	           value: paramsValue
	        }
	        ,targetWindow:getCtpTop()
	        ,callback : function(res){
	            // 加入一个逻辑 当存在不能删除的督办人员时候 进行检查
              var unCancel = $("#unCancelledVisor").val();
              if("" != unCancel){// 存在模板督办人员的时候
                  var unCancelArray = unCancel.split(",");
                  var flagGoon = true;
                  var cs = res.value.split(",");
                  for(var m = 0 ; m < unCancelArray.length;  m ++){
                      flagGoon =  in_array(unCancelArray[m],cs);
                      if(flagGoon == false){
                          // 模板自带督办人员不允许删除!
                          $.alert($.i18n('collaboration.newCollaboration.templatePersonnelNoDel'));
                          return;
                      }
                  }
              }
              $("#supervisorNames").val(res.text);
              $("#supervisorIds").val(res.value);
	        }
	    });
 }



// 正文组件打获取正文切换Toolbar定义实现
var _mt_toolbar_id = "", _lastMainbodyType, _mainbodyOcxObj, _clickMainbodyType;
function getContentTypeChooser(toolbarId, defaultType, callBack){
	if (!toolbarId)
		toolbarId = "toolbar";
	_mt_toolbar_id = toolbarId;
	var r = [];
	for ( var i = 0; i < mtCfg.length; i++) {
		var mt = mtCfg[i].mainbodyType;
		mtCfg[i].value = mt;
		mtCfg[i].id = "_mt_" + mt;
		if (defaultType != undefined && defaultType != "") {
			if (mt == defaultType) {
				mtCfg[i].disabled = true;
				_lastMainbodyType = mt;
			}
		} else if (i == 0) {
			mtCfg[i].disabled = true;
			_lastMainbodyType = mt;
		}
		mtCfg[i].click = function() {
			var cmt = $(this).attr("value");
			_clickMainbodyType = cmt;
			if (callBack) {
				switchContentTypeFun(cmt, function() {
					if (_lastMainbodyType)
						$("#" + _mt_toolbar_id).toolbarEnable(
								"_mt_" + _lastMainbodyType);
					$("#" + _mt_toolbar_id).toolbarDisable("_mt_" + cmt);
					_lastMainbodyType = cmt;
					
					callBack(cmt);
					isSwitchZW = true;
				});
			}
		};
		try {
			if ($.ctx.isOfficeEnabled(mt) ==true || $.ctx.isOfficeEnabled(mt) =="true")
				r.push(mtCfg[i]);
		} catch (e) {
		}
	}
	return r;

}


function switchContentTypeFun(mainbodyType, successCallback) {
	
    var fnx = _getZWIframe();
	
    var contentDiv = fnx.getMainBodyDataDiv$();
	var contentSwitchBeforeId = $("#id",contentDiv).val();
	$("#contentSwitchId").val(contentSwitchBeforeId);	
	var confirm = "";
	confirm = $.confirm({
		'msg' : $.i18n('content.switchtype.message'),
		ok_fn : function() {
			if(mainbodyType == 10 || mainbodyType == 20){
				if(clearOfficeFlag)clearOfficeFlag();
			}
			var contentDiv = fnx.getMainBodyDataDiv$();
			if ($("#contentType", contentDiv).val() == mainbodyType) {
				return;
			}
			var _src = "/seeyon/content/content.do?isFullPage=true&_isModalDialog=true&isNew=true";
				_src += "&moduleId=-1&moduleType=1&rightId=&contentType="+mainbodyType;
				fnx.location.href = _src;
			contentLoaded = false;
			if (successCallback)
				successCallback();
		}
	});
};


/**
 * 插入附件回调函数
 */
function insertAtt_AttCallback(){
    
    //插入附件， 页面渲染有延迟， 导致高度计算错误，出现滚动条
    setTimeout(function(){
        resetZwIframeHeight();
    }, 300);
}

/**
 * 这个方法可能没有用， 在h5页面有
 * 插入关联文档回调函数
 */
function quoteDoc_Doc1Callback(){
	resetZwIframeHeight();
}

// ------ready----//

function setProcessId(){
	if(ordinalTemplateIsSys == 'no'){
		$("#workflow_definition > #processId").val("");
	}
}

// 跟踪
function trackOrnot(){
    var obj = document.getElementById("canTrack");
    var all = document.getElementById("radioall");
    var part = document.getElementById("radiopart");
    var partText = document.getElementById("zdgzryName");
    var zdgzry = document.getElementById("zdgzry");
    $("label[for='radioall']").toggleClass("disabled_color");
    $("label[for='radiopart']").toggleClass("disabled_color");
    if(obj.checked){
        all.checked = true;
        all.disabled = false;
        part.disabled = false;
    }else{
        all.disabled = true;
        part.disabled = true;
        all.checked=false;
        part.checked=false;
        partText.value ='';
        zdgzry.value = "";
        _hiddenPartTrackNameInput();
    };
}
function  isOffice_Fun(bodyType){
	if($.trim(bodyType) == ""){
		return false;
	}else if(parseInt(bodyType) >= 41 && parseInt(bodyType) <=45){
		return true;
	}else{
		return false;
	}
}

function resetFileId4Clone(){
	var fnx = _getZWIframe();
	if(istranstocol || _callTemplateId!=''){
		 if(isOffice_Fun(fnx.$("#contentType").val())){
			 if(fnx.$("#contentType").val()==45){
//				 fnx.originalFileId = fnx.$("#contentDataId").val();
//				 fnx.originalCreateDate = fnx.createDate;
				 fnx.fileId = $.trim(uuidlong) == '' ? getUUID() : uuidlong ;
				 fnx.createDate = "";
				 fnx.$("#contentDataId").val(fnx.fileId);
			 }else{
//				 fnx.setOriginalFileId(fnx.$("#contentDataId").val());
//				 fnx.setOriginalCreateDate(fnx.createDate);
				 var fileId = $.trim(uuidlong) == '' ? getUUID() : uuidlong ;
				 fnx.setFileId(fileId);
				 fnx.setCreateDate("");
				 fnx.$("#contentDataId").val(fileId);
			 }
			 
		 }
	}
}
// 验证流程期限是小于当前系统时间
function sendCheckDeadlineDatetime(){
  var calDateTime = $("#deadLineDateTime");
  var nowDatetime=new Date();
  if(calDateTime[0]){
    if(calDateTime.val()!="" && (nowDatetime.getTime()+server2LocalTime) > new Date(calDateTime.val().replace(/-/g,"/")).getTime()){
    	$.alert($.i18n('collaboration.newcoll.processTimeEarlier'));
        return true;
     }
  }
  // 保存的时候，如果流程期限是空的，则把提前提醒设置为 无
  var mycal=$("#deadLineDateTime");
  var remind = $("#advanceRemind");
  if(mycal[0]&&remind[0]){
      if(mycal[0].value==""){
          remind[0].selectedIndex = 0;
      }
  }
  return false;
}

function checkTemplate(templateId, formAppId, formParentId,isSystem) {
	//var colMan = new colManager();
	
	var params = new Object();
	params["templateId"] = templateId;
	params["formAppId"] = formAppId;
	params["formParentId"] = formParentId;
	params["isSystem"] = isSystem;

	//var strFlag = colMan.checkTemplate(params);
	var strFlag = callBackendMethod("colManager","checkTemplate",params);
	if (strFlag.flag == 'cannot') {
		return false;
	} else {
		return true;
	}
}
//ajax判断事项是否可用,并且是否是重复提交。
function isAffairValidAndIsLock(summaryId){
    //var cm = new colManager();
    //var msg = cm.checkAffairAndLock4NewCol(summaryId,"true");
	var isNeedCheckAffair = true;
	if ($("#newBusiness").val() == '1') {
		isNeedCheckAffair = false;
	}
    var msg = callBackendMethod("colManager","checkAffairAndLock4NewCol",summaryId,isNeedCheckAffair);
    if($.trim(msg) !=''){
        $.messageBox({
            'title' : $.i18n('collaboration.system.prompt.js'), //系统提示
            'type': 0,
            'imgType':2,
            'msg': msg,
            ok_fn:function(){
                sendCount = 0;
                releaseApplicationButtons();
                return;
            }
        });
        return false;
    }
    return true;
}
// 发送协同事件
var sendCount = 0;
var isSwitchZW = false;
function sendCollaboration(){
	if(!contentLoaded){
		return;
	}
	
	var fnx =  _getZWIframe();
	if(!fnx){
        alert($.i18n('collaboration.common.content.loading.js'));//正文未加载完成，请稍后重试
        return;
    }
	
	sendCount++;
	if(sendCount>1){
		alert($.i18n('collaboration.common.repeat.click.js'));//请不要重复点击！
		return;
	}
	
	if(!isAffairValidAndIsLock(summaryId)){
	    return
	}
	
	disableSendButtions();
	
    var project_Id=$("#selectProjectId").val();
	$("#projectId").val(project_Id);
    isCheckContentNull = true;
	// 检查流程期限是不是比当前日期早
	if (sendCheckDeadlineDatetime()) {
		sendCount = 0;
		releaseApplicationButtons();
		return;
	}
    // 判断当前窗口是否是window窗口,人员卡片也需要关闭窗口
    if (getCtpTop().isCtpTop == undefined || getCtpTop().isCtpTop == "undefined" || from == "peopleCard") {
        $("#isOpenWindow").val("true");
    }

	if($("#colPigeonhole").val() == "1"){
		$("#archiveId")[0].value="";
		$("#prevArchiveId")[0].value="";
	}
	//保存office
	if($("#zwOfficeIframe").attr("hasLoad")=="true"){
    $("#zwOfficeIframe")[0].contentWindow.saveOffice();
    var userAgent = navigator.userAgent.toLowerCase();
    var isOpera = userAgent.indexOf('opera') > -1;
    var isIE = userAgent.indexOf('msie') > -1 && !isOpera;

    var oldState = $("#zwOfficeIframe").css("display");
    if(isIE && getCtpTop().isOffice == false){
      //延迟重新渲染一下，避免诡异的残影  OA-104211  
      var newState = (oldState == "none"? "block":"none");
      $("#zwOfficeIframe").css("display",newState);//反转一下状态
      setTimeout(function(){
         $("#zwOfficeIframe").css("display",oldState);
      },1)
      }
    }
    isFormSubmit = false;

	resetFileId4Clone();

	if(!notSpecialCharX(document.getElementById("subject"))){
        releaseApplicationButtons();
        sendCount = 0;
 		return false;
	}
	var moduleId = $("#colMainData #id").val();
	if($("#curTemId").val() != ""){
		fnx.setSaveContentParam(moduleId,$("#subject").val(),$("#curTemId").val());
	}else{
		fnx.setSaveContentParam(moduleId,$("#subject").val());
	}
	
	if("true" == $("#resend").val() || (isSwitchZW && $("#newBusiness").val() == '1' )){
		var _cbody = fnx.getMainBodyDataDiv$();
		$("#id",_cbody).val("");
	}
	
    // lilong 快速选人组件整理发送流程前的数据
    tidyDatas("process_info",defaultNodeName,defaultNodeLable);
	if(validateAll()){
		releaseApplicationButtons();
		sendCount = 0;
		return;
	}
	// 自动触发的新流程 不校验 指定回退不校验
	if(isneedsendcheck){
	    var tempId = $.trim($("#colMainData #tId").val());
	    var formParentid = $.trim($("#colMainData #formParentid").val());
	    var formAppid = $.trim($("#colMainData #formAppid").val());
	    if(tempId !=""){// ajax校验 如果包含模板
	          if(!(checkTemplate(tempId,formAppid,formParentid,isSysTem))){
	              $.alert($.i18n('template.cannot.use'));
	              releaseApplicationButtons();
	              sendCount = 0;
	              return;
	          }
	    }
	}
	var moduleId = $("#colMainData #id").val();
	$("#comment_deal #moduleId").val(moduleId);
	$("#comment_deal #ctype").val(-1);

	//下面两个参数都是离开页面的标识， 不知道是为何
	isSubmitOperation = true;
    isFormSubmit = false;
	fnx.$.content.getContentDomains_newColl(function(domains,snMsg){
		
        if (domains) {
 
            $("#assDocDomain").html("");
            $("#attFileDomain").html("");

            saveAttachmentPart("assDocDomain");
            saveAttachmentPart("attFileDomain");

            domains.push('assDocDomain');
            domains.push('attFileDomain');
            domains.push('colMainData');
            domains.push('comment_deal');
            var __close = function(){
            	if(typeof(snMsg) != 'undefined' && snMsg != null && snMsg != ''){
            		alert(snMsg);
            	}
            	setTimeout(closeNewDialog,10);
            }
            var subData = {
                domains : domains,
                debug : false,
                callback: __close
            }
            //if(_bizConfig){
            	//subData.callback = function(){};
            //}
            
            $("#sendForm").jsonSubmit(subData);
            
          }
    }, 'send',null,mainbody_callBack_failed,templateId);
}

/**
 * 表单协同开发高级事件
 * 
 * @return
 */
function formAdvanceDevelop(){
    if($("#contentType").val() == '20'){
    	var params = new Object();
    	params["contentDataId" ] =  $("#contentDataId").val();
    	params["operationId" ] =  $("#rightId").val();

	    //var formBindEventListener = new collaborationFormBindEventListener();
		//var result = formBindEventListener.startFormDevelopmentOfAdvCheck(params);
	    var result = callBackendMethod("collaborationFormBindEventListener","startFormDevelopmentOfAdvCheck",
	    		params);
	    if(result != ""){
		$.messageBox({
		    'type' : 0,
		    'title':$.i18n('system.prompt.js'),
		    'msg' : result,
		    ok_fn : function() {
		    }
		  });
		releaseApplicationButtons();
		return false;
		}

    }
	return true;
}
function releaseApplicationButtons(){
	if(typeof(tb) =='undefined'){
		_TimeFn = setTimeout(function(){
			releaseApplicationButtons();
		},500);
		return;
	}else{
		clearTimeout(_TimeFn);
	}
	$("#sendId")[0].disabled = false;
	tb.enabled("saveDraft");// 保存待发
	tb.enabled("refresh2");// 调用模板
	tb.enabled("insert");// 保存待发
	if(!ishideconotentType){
		tb.enabled("conotentType");// 正文类型
	}
	tb.enabled("refresh1");// 存为模板
	tb.enabled("print");// 保存待发

	sendCount = 0;
	endProcessBar();
}

/**
 * 验证不通过返回false
 */
function validateAll(){
	// 如果选择了指定跟踪人员但是又没有选择具体人员的话
	var members=document.getElementById("zdgzry");
	if(members){
		var trackRangePart=document.getElementById("radiopart");
		if(trackRangePart!=null&&trackRangePart.checked&&members.value==""){
            // 指定跟踪人不能为空，请选择指定跟踪人！
			$.alert($.i18n('collaboration.newColl.alert.zdgzrNotNull'));
			return true;
		}
	}
	if(!notSpecialCharX(document.getElementById("subject"))){
        return false;
    }
	// 判断流程是否为空
	var process_lc = document.getElementById("process_info");
	var defaultPro = $("#process_info").attr("defaultValue");
	if (defaultPro==$.trim(process_lc.value)) {
	    $("#process_info").attr("value","");
    }
	if(process_lc && process_lc.value==""){
	    $.messageBox({
	        'type' : 0,
	        'title':$.i18n('system.prompt.js'),
	        'msg' : $.i18n('collaboration.forward.workFlowNotNull'), // 流程不能为空
	        'imgType':2,
	        ok_fn : function() {
                clickProcessInfoButton();// lilong 0327
	    		// $("#process_info").click();
	        }
	      });
		return true;
	}

	// 督办设置验证
	if(isV5Member && !checkSupervisor()){
		return true;
	}
	checkContent();
	// 附言不能超过500子
	if($("#content_coll").val().replace(/\r\n$/ig, "").replace(/\n$/ig, "").replace(/\r$/ig, "").length > 500){
		 var x =$.i18n('collaboration.fuyan.toolong');
		 var x2 = $('#content_coll').val().length;
		 x.replace("{0}",x2);
		 $.alert(x.replace("{0}",x2));  // 发起人附言不能超过500
		return true;
	}
	return false;
}

function notSpecialCharX(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	if($.trim(value) ==""  || $("#subject").val() === $("#subject").attr("defaultValue")){
		$.messageBox({
	        'type' : 0,
            'imgType':2,
            'title':$.i18n('system.prompt.js'), // 系统提示
	        'msg' : $.i18n('collaboration.common.titleNotNull'),// 标题不能为空
	        ok_fn : function() {
	    		element.focus();
	        }
	      });
		return false;
	} else if (!hasColSubject) {//无标题规则
	
		if(value.length > 300){ 
			$.alert($.i18n('collaboration.newColl.titleMaxSize300.js'));  // 标题最大长度为85!
			return false;
		}	
		
	}
	return true;
}

/**
 * 发起时，验证督办设置
 */
function checkSupervisor(){
	// 设置了督办人员，就必须设置督办时间
	var supervisorId = $("#supervisorIds").val();
	var unCancelledVisor = $("#unCancelledVisor").val();

	var superviseTitle = $("#title")[0].value;
	var rule = /^[^\|\\"'<>]*$/;
	if(!(rule.test(superviseTitle))) {
        // 督办主题包含特殊字符(\|\"<>')请重新录入!
		$.alert(superviseTip);
		return false;
	}

	if(supervisorId){
		var supervisorIdsT = supervisorId.split(",");
		var supervisorIds = new Array();
		for (var i = 0 ; i < supervisorIdsT.length ; i ++) {
			if (supervisorIdsT[i] != null && supervisorIdsT[i].trim() != "")
				supervisorIds.push(supervisorIdsT[i]);
		}

		if(supervisorIds.length > 10){
            // 最多只允许10个人督办,请重新选择督办人!
		    $.alert($.i18n('collaboration.newColl.alert.select10Supervision'));
			return false;
		}

		if(!$("#awakeDate").val()){
            // 请选择督办期限
		    $.alert($.i18n('collaboration.newColl.alert.selectSupervisionPeriod'));
			return false;
		}
		var sVisorsFromTemplate = $("#sVisorsFromTemplate").val();
		if(unCancelledVisor != null && unCancelledVisor != ""){
			var uArray = unCancelledVisor.split(",");
			for(var i=0;i<uArray.length;i++){
				var have = supervisorId.search(uArray[i]);
				if(have == -1){
				    // 模板自带督办人员不允许删除!
                    $.alert($.i18n('collaboration.newCollaboration.templatePersonnelNoDel'));
					return false;
				}
			}
		}
	}else{
		if(unCancelledVisor){
		    // 模板自带督办人员不允许删除!
            $.alert($.i18n('collaboration.newCollaboration.templatePersonnelNoDel'));
			return false;
		}
	}

	var title = $("#title").val();
	if(title && title.length>85){
        // 督办主题长度不能超过200字
	    $.alert($.i18n('collaboration.newColl.alert.supervisionLong85'));
		return false;

	}

	// 设置了督办主题或者督办时间，但没有设置督办人，给出提示
	if(($("#awakeDate").val() || $("#title").val()) && !supervisorId){
        // 请选择督办人员!
	    $.alert($.i18n('collaboration.newColl.alert.selectSupervision'));
		return false;
	}

	return true;
}

function mainbody_callBack_failed(e){
	 // alert("error:"+e);
	  releaseApplicationButtons();
	  hideMask();
	  return;
}
/**
 * 获取指定分钟数后的日期 sc 单位分钟
 */
function getDateTimeValue(sc) {
    // 参数表示在当前日期下要增加的天数
    var now = new Date();
    if(sc){
        switch(sc){
	        case '5':
	        case '10':
	        case '15':
	        case '30':
            case '60':
            case '120':
            case '180':
            case '240':
            case '300':
            case '360':
            case '420':
            case '480':
            case '720':
            case '1440':
            case '2880':
            case '4320':
            case '5760':
            case '7200':
            case '8640':
            case '10080':
            case '14400':
            case '20160':
            case '21600':
            case '30240':
            case '43200':
            case '86400':
            case '129600':
            	return ajaxCalcuteWorkDatetime(sc);
                break;
            default:
            	return new Date(now).format("yyyy-MM-dd HH:mm");
        }
    }

    // 2014-03-20 01:10 返回值格式

}
function ajaxCalcuteWorkDatetime(minutes) {
	//var colMan = new colManager();
	var ajaxBean = new Object();
	ajaxBean["minutes"] = minutes;
	//var workDatetime = colMan.calculateWorkDatetime(ajaxBean);
	var workDatetime = callBackendMethod("colManager","calculateWorkDatetime",ajaxBean);
	
	return new Date(parseInt(workDatetime)).format("yyyy-MM-dd HH:mm");
	
}
function ajaxCalcuteNatureDatetime(datetime,minutes) {
	//var colMan = new colManager();
	var ajaxBean = new Object();
	ajaxBean["datetime"] = datetime;
	ajaxBean["minutes"] = minutes;
	//var workDatetime = colMan.calculateWorkDatetime(ajaxBean);
	var workDatetime = callBackendMethod("colManager","calculateWorkDatetime",ajaxBean);
	return workDatetime;
}
function valiDeadAndLcqx(obj){
	var dl = $("#deadLine");
	var remind = $("#advanceRemind");
    var mycal=$("#deadLineDateTime");
	// 流程期限
	if(obj.id=='deadLine'){
		$("#deadLine").val(dl.val());// 设置流程期限时间段的值
        var deadLineTime=dl[0].value;
        // 日期计算
        var dateValueStr=getDateTimeValue(deadLineTime);
        if(mycal){
            mycal.val(dateValueStr);
        }
		if(getDateTimeValue(remind[0].value) >= getDateTimeValue(dl[0].value) && parseInt(remind[0].value) != 0){
            // 未设置流程期限或流程期限小于,等于提前提醒时间
		    $.alert($.i18n('collaboration.newColl.alert.lcqx'));
			remind[0].selectedIndex = 0;
			dl[0].selectedIndex = 0;
		}
        if(dl[0].selectedIndex==1){// 选中“自定义”
            $("#deadLineCalender").css("display","block");
            $("#deadLineDateTime").attr("disabled",false);
            $("#deadLineDateTime").attr("readonly",true);
            if(typeof(calenderOnclickFun)!="undefined"){
                $("#deadLineCalender .calendar_icon")[0].onclick=calenderOnclickFun;
            }
        }else if(dl[0].selectedIndex==0){// 选中 “无”
            $("#deadLineCalender").css("display","none");
            $("#deadLineDateTime").attr("value","");
            /*OA-90704 新建协同页面，设置流程期限后，下拉框变长了，应该始终和提前提醒等长,去掉dl.removeAttr("style")*/
            // dl.removeAttr("style");
        }else{
            $("#deadLineCalender").css("display","block");
            // 把日期控件按钮的点击事件去掉
            if($("#deadLineCalender .calendar_icon")[0].onclick!=null){
                calenderOnclickFun=$("#deadLineCalender .calendar_icon")[0].onclick;
            }
            $("#deadLineCalender .calendar_icon")[0].onclick=null;
            $("#deadLineDateTime").attr("disabled",true);
        }
		setAutoEnd();
		// 没有设置流程期限或者是调用的模板的时候，流程自动终止应该置灰
        if((dl.val()!="-1"&&dl.val()<=0) || (isTemFlag =='true' && isSysTem)){
            $("#canAutostopflow")[0].checked = false;
            $("#canAutostopflow")[0].disabled = true;
        }else{
            $("#canAutostopflow")[0].disabled = false;
        }
	}
	// 提醒
	if(obj.id=='advanceRemind'){
        var deadlineDateTimeR="";
        if(dl[0].value=="-1"){// 自定义的时候直接取控件上的日期值
            if(mycal){
                deadlineDateTimeR=mycal.val();
                if(deadlineDateTimeR == ""){
                    // 未设置流程期限或流程期限小于,等于提前提醒时间
                    $.alert($.i18n('collaboration.newColl.alert.lcqx'));
                    remind[0].selectedIndex = 0;
                }
                if(parseInt(remind[0].value) != 0){
                	var remaindDatetime=ajaxCalcuteNatureDatetime(deadlineDateTimeR,remind[0].value);
                	var nowDatetime=new Date();
                	if(remaindDatetime<nowDatetime.getTime()+server2LocalTime){
                		$.alert($.i18n('collaboration.newColl.alert.lcqx'));
                		remind[0].selectedIndex = 0;
                	}
                }
            }
        }else{
            if(parseInt(remind[0].value) >= parseInt(dl[0].value) && parseInt(remind[0].value) != 0){
            	// 未设置流程期限或流程期限小于,等于提前提醒时间
            	$.alert($.i18n('collaboration.newColl.alert.lcqx'));
            	remind[0].selectedIndex = 0;
            }
        }
	}
}

function setAutoEnd(){
	if(parseInt($("#deadLine").val()) == 0 || isSysTem){// 系统模板的话也不能设置
		$("#canAutostopflow").removeAttr("checked");
		$("#canAutostopflow")[0].disabled = true;
	}else{
		$("#canAutostopflow").removeAttr("disabled");
	}
}

// 初始化加载表单数据
function initFromData(){
	// 三个下拉列表 重要程度 流程期限 提前提醒
	selectWriteBack('importantLevel',importantL);
	selectWriteBack('deadLine',deadl);
	selectWriteBack('advanceRemind',advanceR);
	// 如果有自定跟踪人反写指定跟踪人
	zdggrWriteBack();
	// 督办相关信息数据回填
	superviseWriteBack();
	// 设置 转发 改变流程 修改正文 修改附件 归档 流程期限到时自动终止 选择与否
	setCheckbox();
	// 重复发起的时候不能修改协同标题
	setCanEditSubject();
	// 重复发起设置summaryI为空
	setResetInfo();
	// 当为流程模板的时候设置一下显示
	setDetaiwhenisworkflowtemplate();
	// 设置更多里面的细节按钮
	setDetailwhenTemplate();
	// 设置基准时长显示
	setStandardDuration();
	// 设置一下xml信息
	setwfXMLInfo();
	 if(_callTemplateId && _callTemplateId != '' ){
		 setPageMenu();
	 }	
};

function selectWriteBack(selectId,selValue){
	if(selValue){
		var obj = $("#"+selectId)[0];
		for(var count = 0 ; count < obj.length; count ++){
			if(obj[count].value == selValue){
				obj.selectedIndex = count;
				break;
			}
		}
	}
}

function zdggrWriteBack(){
	if(vobjtrackids){
		// 设置为自定跟踪人
		$("#canTrack").attr('checked','checked');
		trackOrnot();
		$("#radiopart").attr('checked','checked');
		$('#zdgzry').val(vobjtrackids);
		$("label[for='radioall']").toggleClass("disabled_color");
	    $("label[for='radiopart']").toggleClass("disabled_color");
	}
	if(''!=fgzids){
		//var colTrack = new trackManager();
    	var params = new Object();
        params["userId"] = fgzids;
        //var strName=colTrack.getTrackNames(params);
        var strName= callBackendMethod("trackManager","getTrackNames",params);
        $("#zdgzryName").val(strName);
        $("#zdgzryName").attr("title",strName);
        var partText = document.getElementById("zdgzryName");
        partText.style.display="";

	}
}

function superviseWriteBack(){
	// 督办人员名称
	if(vobjcolsupnames){
		$('#supervisors').val(vobjcolsupnames);
	}
	// 督办人员IDS
	if(vobjcolSupors){
		$("#supervisorIds").val(vobjcolSupors);
	}
	// 督办日期
	if(vobjcolsupDate){
		$("#awakeDate").val(vobjcolsupDate);
	}
}

function setCheckbox(){
	if(sumcanforward){
		$("#canForward").removeAttr("checked");
	}
	if(sumcanmodify){
		$("#canModify").removeAttr("checked");
	}
	if(sumcanEdit){
		$("#canEdit").removeAttr("checked");
	}
	if(sumcanEditAtt){
		$("#canEditAttachment").removeAttr("checked");
	}
	if(sumcanArchive && "true"==hasDoc){
		$("#canArchive").removeAttr("checked");
	}
	if(sumcanautostop){
		$("#canAutostopflow").attr("checked","checked");
	}
}

function setCanEditSubject(){
	if(vobjreadonly){
		$("#subject").attr("readOnly","true");
	}
}

function setResetInfo(){
	  if($("#colMainData #resend").val() =='true'){
  	    var contentDiv = $("#mainbodyDataDiv_"+$("#_currentDiv").val());
          $("#id",contentDiv).val(-1);
          $("#workflow_definition #processId").val("");
          $("#workflow_definition #caseId").val("");
          $("#colMainData #caseId").val("");
	  }
}

function setDetaiwhenisworkflowtemplate(){
	if(isneedsetDetailwhenwftem){// 自由协同建立的模板不受这个方法控制
		$("#canForward")[0].disabled= false;
		$("#canModify")[0].disabled= true;
		$("#canEdit")[0].disabled= false;
		if("true"==hasDoc){
			$("#canArchive")[0].disabled= false;
		}
		$("#canEditAttachment")[0].disabled= false;
		$("#canAutostopflow")[0].disabled= true;
	}
}

function setDetailwhenTemplate(){
	var deadLine = $("#deadLine")[1];// 流程期限
	var colPigeonhole = $("#colPigeonhole")[0];// 归档信息
	var advanceRemind = $("#advanceRemind")[1];// 提前提醒
	var canForward = $("#canForward")[0];
	var canModify = $("#canModify")[0];
	var canEdit = $("#canEdit")[0];
	var canEditAttachment = $("#canEditAttachment")[0];
	if("true"==hasDoc){
		var canArchive = $("#canArchive")[0];
	}
	var canAutostopflow = $("#canAutostopflow")[0];
	if(vobjparentColTem){// 本身或者父是系统协同模板
		canForward.disabled = true;
		canModify.disabled = true;
		canEdit.disabled = true;
		canEditAttachment.disabled = true;
		if("true"==hasDoc){
			canArchive.disabled = true;
		}
		canAutostopflow.disabled = true;
	}
	if(vobjparenttexttype){
		canForward.disabled = false;
		canModify.disabled = false;
		canEdit.disabled = false;
		canEditAttachment.disabled = false;
		if("true"==hasDoc){
			canArchive.disabled = false;
		}
		canAutostopflow.disabled = true;
	}
	if(vobjparentwftem){// 本身或者父是系统流程模板
		canForward.disabled = false;
		canModify.disabled = true;
		canEdit.disabled = false;
		canEditAttachment.disabled = false;
		if("true"==hasDoc){
			canArchive.disabled = false;
		}
	}
}

function setStandardDuration(){
		var sc = vobjstanddur;
		var standdc = document.getElementById("standdc");
		if(sc){
			switch(sc){
			 	case '0':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.no'); // 无
			 		break;
			 	case '60':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.one.hour'); // 1小时
			 		break;
			 	case '120':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.two.hour'); // 2小时
			 		break;
			 	case '180':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.three.hour'); // 3小时
			 		break;
			 	case '240':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.four.hour'); // 4小时
			 		break;
			 	case '300':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.five.hour'); // 5小时
			 		break;
			 	case '360':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.six.hour'); // 6小时
			 		break;
			 	case '420':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.seven.hour'); // 7小时
			 		break;
			 	case '1440':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.one.day'); // 1天
			 		break;
			 	case '2880':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.two.day'); // 2天
			 		break;
			 	case '4320':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.three.day'); // 3天
			 		break;
			 	case '5760':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.four.day'); // 4天
			 		break;
			 	case '7200':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.five.day'); // 5天
			 		break;
			 	case '8640':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.six.day'); // 6天
			 		break;
			 	case '14400':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.ten.day'); // 10天
			 		break;
			 	case '10080':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.one.week'); // 1周
			 		break;
			 	case '20160':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.two.week'); // 2周
			 		break;
			 	case '21600':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.half.month'); // 半个月
			 		break;
			 	case '30240':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.three.week'); // 3周
			 		break;
			 	case '43200':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.one.month'); // 1个月
			 		break;
			 	case '86400':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.two.month'); // 2个月
			 		break;
			 	case '129600':
			 		standdc.innerHTML=$.i18n('collaboration.deadline.three.month'); // 3个月
			 		break;
			}
		}
}

function setwfXMLInfo(){
	// Javascript中可以用$.ctx.CurrentUser.xxx(目前javascript中只开放id，name、loginAccount和loginAccountName)
	if(frompeoplecardflag){// 人员卡片调用过来的时候设置流程信息
		var aPeople = {
			id : peoplecardinfoID,
			name : peoplecardinfoname,
			type : "Member" ,
			excludeChildDepartment : false,
			accountId : peoplecardinfoaccountid
			// accountShortname:'${accountObj.shortName}'
		}

		var personArrays =[];
		var obj = [personArrays,1,false];
		// obj[2] = false;// 该参数没用了已经
		aPeople.accountShortname='';// 不显示
		if(issameaccountflag){
			obj[2] = true;// 该参数没用了已经
			aPeople.accountShortname=accountobjsn;
		}
         personArrays.push(aPeople);
		var res = {
				'obj':obj
				}
		createProcessXmlCallBack(window,res,'collaboration',window,
				$.ctx.CurrentUser.id,$.ctx.CurrentUser.name,$.ctx.CurrentUser.loginAccountName,
				defaultNodeName,$.ctx.CurrentUser.loginAccount,defaultNodeLable);
	}
}


function warnforSupervise(){
	if(warnforsupervise){
        // 模板设置了部门主管为督办人员，但该部门没有指定主管！
		$.alert($.i18n('collaboration.newColl.alert.warnforSupervise'));
	}
}

function trimNbsp(){
	try{var trimObj = $("div[id=fuyan]").find("textarea")[0];
    trimObj.innerHTML = $.trim(trimObj.innerHTML);}catch(e){}
}

/*
 * 判断在数组中是否含有给定的一个变量值 参数： needle：需要查询的值 haystack：被查询的数组
 * 在haystack中查询needle是否存在，如果找到返回true，否则返回false。 此函数只能对字符和数字有效
 */
 function in_array(needle,haystack){
		for(var i in haystack){
			if(haystack[i] == needle){
				return true;
			}
		}
		return false;
 }

 function setSummaryId(){
		var cfrom = paramfrom;
		if(cfrom && 'resend' == cfrom){
			// 设置重复发起的标记
			var isResend = document.createElement('input');
			isResend.type ='hidden';
			isResend.id="resend";
			isResend.name="resend";
			isResend.value="1";
			document.getElementById('colMainData').appendChild(isResend);
		}
}

 var isOfficeSupport = true;
 function officeNotSupportCallback(){
 	isOfficeSupport = false;
 }
 function disable4Office(){
 	$("#sendId")[0].disabled = true;// 发送
 	tb.disabled("saveDraft");// 保存待发
 	tb.disabled("refresh1");// 存为模板
 }
 function disable4Hw(){
	$("#sendId")[0].disabled = true;// 发送
 }
 function endProgressBar(){
	  // if(typeof(proce)!='undefined'){
	   // proce.close();
	 // }
		 hideMask();
}

 function disableSendButtions(){
	  $("#sendId")[0].disabled = true;
	  tb.disabled("saveDraft");// 保存待发
	  tb.disabled("refresh2");// 调用模板
	  tb.disabled("insert");// 保存待发
	  tb.disabled("conotentType");// 正文类型
	  tb.disabled("refresh1");// 存为模板
	  tb.disabled("print");// 保存待发
}
 
function __weixinClose(){
	try{
		//关闭微信当前窗口
		WeixinJSBridge.invoke('closeWindow',{},function(res){
		});
	 }catch(e){
	 }
}

function closeNewDialog(){
     // 判断当前页面是否是主窗口页面
     try{
         if (getCtpTop().isCtpTop) {
             var  _win = getCtpTop().$("#main")[0].contentWindow;
             var url = _win.location.href;
             try{
                 _win.location = _ctxPath +"/collaboration/collaboration.do?method=listSent";
             }catch(e){
                 _win.location =  _win.location;
             }
         } else {
        	 
        	 __weixinClose();
        	 try{
        		 var _win = getCtpTop().opener.getCtpTop().$("#main")[0].contentWindow;
        	 }catch(e){
        		 //OA-121694
        		 window.parent.close();
        	 }
             if (_win != undefined) {
                 // 判断当前是否是首页栏目
                 if (_win.sectionHandler != undefined) {
                     getCtpTop().opener.getCtpTop().removeAllWindow();
                     // 首页栏目（当点击了统计图条件后处理）
                     if (_win.params != undefined && _win.params.selectChartId != "") {
                         _win._collCloseAndFresh(_win.params.iframeSectionId,_win.params.selectChartId,_win.params.dataNameTemp);
                     } else {
                         // 进入首页待办栏目直接处理
                         _win.sectionHandler.reload("pendingSection",true);
                         _win.sectionHandler.reload("sentSection",true);
                         _win.sectionHandler.reload("waitSendSection",true);
                         _win.sectionHandler.reload("agentSection",true);
                     }
                 } else {
                     // 刷新列表
                     var url = _win.location.href;
                     
                   // 项目栏目协同刷新
                  	try{
                  		getCtpTop().opener.getA8Top().$("#main")[0].contentWindow.$("#body")[0].contentWindow.sectionHandler.reload("projectCollaboration",true);
                 	 }catch(e){}
                     
                     
                     if (url.indexOf("collaboration") != -1 && (url.indexOf("listSent") != -1 || url.indexOf("listWaitSend") != -1 || url.indexOf("moreWaitSend") != -1 )) {
                         _win.location =  _win.location;
                     } else {
                         // 业务生成器、生成的列表嵌入到了iframe下。也要刷新待发列表
                         try{
                             var _win2 = _win.$.find('iframe');
                             if (_win2 != undefined && _win2[0] != undefined) {
                                 var url = _win2[0].src;
                                 if (url.indexOf("collaboration") != -1 && url.indexOf("listWaitSend") != -1) {
                                     _win.location =  _win.location;
                                 }
                             }
                         }catch(e){}
                     }

                 }
             }else{
            	window.location.href = 'about:blank';
     			window.close();
             }
             removeCtpWindow(affairId,2);
         }
     }catch(e){
     }
     window.close();
}

 /**
	 * 提交前把disabled的属性去掉，数据才能正常提交到后台
	 */
 function enableAdvanceOper(){
 	var canForward = document.getElementById("canForward");
 	var canModify = document.getElementById("canModify");
 	var canEdit = document.getElementById("canEdit");
 	var canEditAttachment = document.getElementById("canEditAttachment");
 	if("true"==hasDoc){
 		var canArchive = document.getElementById("canArchive");
 		canArchive.disabled = false;
 	}
 	canForward.disabled = false;
 	canModify.disabled = false;
 	canEdit.disabled = false;
 	canEditAttachment.disabled = false;
 }

 function saveDraft(){
	 	if(!contentLoaded){
			return;
		}
		
		var fnx =  _getZWIframe();
        
        if(!fnx){
            alert($.i18n('collaboration.common.content.loading.js'));//正文未加载完成，请稍后重试
            return;
        }
		
	 	sendCount++;
		if(sendCount>1){
			alert($.i18n('collaboration.common.repeat.click.js'));//请不要重复点击！
	    	releaseApplicationButtons();
			return;
		}
		
	 	startProcessBar();
	 
	 	if(!isAffairValidAndIsLock(summaryId)){
	 	    return
	 	}
	 	
	 	disableSendButtions();
		
        isCheckContentNull = true;
	    var sendDevelop = $.ctp.trigger('beforeSaveDraftColl');
	    if(!sendDevelop){
	    	releaseApplicationButtons();
	    	return;
	    }
	 	resetFileId4Clone();
	 	if(_checkTrack()){
	 		releaseApplicationButtons();
	 		return;
	 	}
		if(istranstocol){
		       fileId = $("#contentDataId").val();
		}
		$("#saveAsFlag").val('saveAsDraft');
		if(!notSpecialCharX(document.getElementById("subject"))){
			releaseApplicationButtons();
	        return false;
	    }
		checkContent();
		// 附言不能超过500子
		if($("#content_coll").val().length > 500){
			 var x =$.i18n('collaboration.fuyan.toolong');
			 var x2 = $("#content_coll").val().length;
			 x.replace("{0}",x2);
			 $.alert(x.replace("{0}",x2));  // 发起人附言不能超过500
			 releaseApplicationButtons();
			return;
		}
		//保存表单正文的office
		if($("#zwOfficeIframe").attr("hasLoad")=="true"){
			 $("#zwOfficeIframe")[0].contentWindow.saveOffice();
		}
		var moduleId = $("#colMainData #id").val();
		if($("#curTemId").val() != ""){
			fnx.setSaveContentParam(moduleId,$("#subject").val(),$("#curTemId").val());
		}else{
			fnx.setSaveContentParam(moduleId,$("#subject").val());
		}
		// 提交时，督办填写验证
		if(isV5Member && !checkSupervisor()){
			releaseApplicationButtons();
			return;
		}
		var tempId = $.trim($("#colMainData #tId").val());
	    if(tempId !=""  && savedrafttemVal){// ajax校验 如果包含模板
	        if(!(checkTemplateCanUse(tempId))){
	            $.alert($.i18n('template.cannot.use'));
	            releaseApplicationButtons();
	            return;
	        }
	    }
		// 设置comment表的ctype 字段为-1
		var moduleId = $("#colMainData #id").val();
		$("#comment_deal #moduleId").val(moduleId);
		$("#comment_deal #ctype").val(-1);
		// 快速选人
		tidyDatas("process_info",defaultNodeName,defaultNodeLable);
		// 保存待发的时候如果是系统模板 置空 processID
		var proId ="";
		var flagS= false;
		if(issystemtemflag){
			flagS = true;
			proId = $("#workflow_definition #processId").val();
			$("#workflow_definition #processId").val("");
		}
		// proce = $.progressBar();
		//showMask();
		if(isSwitchZW && $("#newBusiness").val() == '1' ){
			var _cbody = fnx.getMainBodyDataDiv$();
			$("#id",_cbody).val("");
		}
	    fnx.$.content.getContentDomains_newColl(function(domains){
	        if (domains) {

	            $("#assDocDomain").html("");
	            $("#attFileDomain").html("");

	            saveAttachmentPart("assDocDomain");
	            saveAttachmentPart("attFileDomain");

	            domains.push('assDocDomain');
	            domains.push('attFileDomain');
	            domains.push('colMainData');
	            domains.push('comment_deal');

	            $("#sendForm").jsonSubmit({
	              action:_ctxPath+"/collaboration/collaboration.do?method=saveDraft",
	              domains : domains,
	              validate:false,
	              debug : false,
	              callback:function(data){
	            	endProcessBar();
	            	sendCount = 0;
	                if(flagS){
		                $("#workflow_definition #processId").val(proId);
	                }
	              }
	            });
	          }
	    },'saveAs',null,mainbody_callBack_failed_whenSaveAs);
}

 function _checkTrack(){
	 	// 如果选择了指定跟踪人员但是又没有选择具体人员的话
		var members=document.getElementById("zdgzry");
		if(members){
			var trackRangePart=document.getElementById("radiopart");
			if(trackRangePart!=null&&trackRangePart.checked&&members.value==""){
	            // 指定跟踪人不能为空，请选择指定跟踪人！
				$.alert($.i18n('collaboration.newColl.alert.zdgzrNotNull'));
				return true;
			}else{
				return false;
			}
		}
 }

 function mainbody_callBack_failed_whenSaveAs(){
		// proce.close();
	    releaseApplicationButtons();
}
 /**
	 * ctp_conetnt_all的Id
	 * 
	 * @param contentId
	 * @return
	 */
 function setContentIdForDel(contentId){
	 document.getElementById("contentIdUseDelete").value=contentId;
 }
 
 
// 存草稿后 ,将summayId的值反写到页面
 function endSaveDraft(summaryId,contentId,affairId,newSubject){
	 if(newSubject){
		 if(newSubject != $("#subject").val()){
			 $("#subject").val(newSubject);
		 }
	 }
	 var fnx =  _getZWIframe();
    var url = window.location.href.split("/seeyon")[1];
    url = "/seeyon" +url;
    try{
        addAnotherKey(url,affairId,2,"method=newColl",window);
    }catch(e){}
 	document.getElementById('id').value = summaryId;
 	// 必须回写moduleId(一个是正文组件,一个是评论组件)
 	var obj;
 	obj = document.getElementsByName('moduleId');
 	for(var i = 0 ; i< obj.length; i ++){
 		obj[i].value=summaryId;
 	}
 	var contentDiv = fnx.getMainBodyDataDiv$();
   	$("#id",contentDiv).val(contentId);
 	// 保存一次草稿后就应该将是否新建业务的数据控制为0
 	$("#colMainData #newBusiness").val("0");
 	tb.enabled("saveDraft");// 保存待发
 	disableSendButtions();
    try{
        saveWaitSendSuccessTip($.i18n('collaboration.newColl.savePendingOk'),summaryId,affairId);
    } catch (e){}
 }


// 检查督办时间设置
 function checkAwakeDate(){
 	var now = new Date();// 当前系统时间
 	var awakeDateStr=document.getElementById("awakeDate").value;
 	if(awakeDateStr!= ""){
 		var days = awakeDateStr.substring(0,awakeDateStr.indexOf(" "));
 		var hours = awakeDateStr.substring(awakeDateStr.indexOf(" "));
 		var temp = days.split("-");
 		var temp2 = hours.split(":");
 		var d1 = new Date(parseInt(temp[0],10),parseInt(temp[1],10)-1,parseInt(temp[2],10),parseInt(temp2[0],10),parseInt(temp2[1],10));
 		if(d1.getTime()<now.getTime()){
 		    var confirm = "";
 	        confirm = $.confirm({
 	            'msg': $.i18n('collaboration.newColl.thisTimeGrSupTime2'),// 督办时间比当前时间早，是否继续？
 	            ok_fn: function () {
 	            	return true;
 	            },
 	            cancel_fn:function(){
 	                document.getElementById("awakeDate").value = "";
 	                return false;
 	            }
 	        });
 		}
 	}
 }

// 流程期限时间比当前时间早，是否继续
 function checkDeadLineDateTime(){
 	var now = new Date();// 当前系统时间
 	var awakeDateStr=document.getElementById("deadLineDateTime").value;
 	if(awakeDateStr!= ""){
 		var days = awakeDateStr.substring(0,awakeDateStr.indexOf(" "));
 		var hours = awakeDateStr.substring(awakeDateStr.indexOf(" "));
 		var temp = days.split("-");
 		var temp2 = hours.split(":");
 		var d1 = new Date(parseInt(temp[0],10),parseInt(temp[1],10)-1,parseInt(temp[2],10),parseInt(temp2[0],10),parseInt(temp2[1],10));
        var remind = $("#advanceRemind");
        var remaindDatetime=ajaxCalcuteNatureDatetime(awakeDateStr,remind[0].value);
 		if(d1.getTime()<now.getTime()+server2LocalTime){
          $.alert($.i18n('collaboration.newcoll.processTimeEarlier'));
 		}else if(remaindDatetime<now.getTime()+server2LocalTime){
            $.alert($.i18n('collaboration.newColl.alert.lcqx'));
            remind[0].selectedIndex = 0;
        }
 	}
 }

function handleTemplate(){
		callTemplate('1,2',"",getTemplateId);
		$("#zwIframe").css("visibility","visible");
}

function getTemplateId(templateId){
	var  oldUrl=curlocationPath +"/collaboration/collaboration.do?method=newColl&rescode=F01_newColl&_resourceCode=F01_newColl";
	if(templateId && templateId != ''){
		isSubmitOperation = true;
		isFormSubmit = false;
		window.location =curlocationPath +"/collaboration/collaboration.do?method=newColl&templateId="+templateId+"&from=templateNewColl";
	}
}
function setPageMenu(){
	var  oldUrl=curlocationPath +"/collaboration/collaboration.do?method=newColl&rescode=F01_newColl";
	try{
        addAnotherKey(oldUrl,oldUrl,2,"method=newColl",window);
    }catch(e){}
}
// 超期提醒与提前提醒时间设置的比较
function compareTime() {
	var newCollForm = document.getElementsByName("sendForm")[0];
	var advanceRemindTime = document.getElementById("advanceRemind").value;
	var deadLineTime = document.getElementById("deadLine").value;
	if (deadLineTime == 0) {
		var allow_auto_stop_flow = document.getElementById('canAutostopflow');
		if (allow_auto_stop_flow) {
			allow_auto_stop_flow.disabled = true;
		}
	}
	var advanceRemindNumber = new Number(advanceRemindTime);
	var deadLineNumber = new Number(deadLineTime);
	if (deadLineNumber <= advanceRemindNumber
			&& !(advanceRemindNumber == 0 && deadLineNumber == 0)) {
		var mycal = $("#deadLineDateTime");
		// 发送的时候需要重新验证流程期限
		if (mycal) {
			if (mycal.val() != "" && advanceRemindNumber != 0
					&& getDateTimeValue(advanceRemindNumber) >= mycal.val()) {
				// 未设置流程期限或流程期限小于,等于提前提醒时间
				$.alert($.i18n('collaboration.newColl.alert.lcqx'));
				return false;
			}else{
				return true;
			}
		} else {
			// 未设置流程期限或流程期限小于,等于提前提醒时间
			$.alert($.i18n('collaboration.newColl.alert.lcqx'));
			newCollForm.advanceRemind.selectedIndex = 0;
			// newCollForm.deadline.selectedIndex = 0;
			return false;
		}
	} else {
		return true;
	}
}

function checkSpecialChar(element){
	var value = element.value;
	var inputName = element.getAttribute("inputName");
	// 修改[]之间的内容，其它部分不许修改
	if(/^[^\|\\"'<>]*$/.test(value)){
		return true;
	}else{
		writeErrorInfo(element,inputName + $.i18n('collaboration.newColl.tszf')); // 不能包含特殊字符（|\"'\<>），请重新输入！
		return false;
	}
}

function writeErrorInfo(element, message){
	$.alert(message);
	try{
		element.focus();
		element.select();
   }catch(e){}
}


function saveAsTemplete() {
	if(!contentLoaded){
		return;
	}
	var fnx = _getZWIframe();
	isCheckContentNull=false;// 不验证pdf是否为空
    isCleckContent = false;
	tidyDatas("process_info",defaultNodeName,defaultNodeLable);// OA-55329
	resetFileId4Clone();
	var tIdCheck = $("#colMainData #tId").val();
	if(tIdCheck){
		if(!(checkTemplateCanUse(tIdCheck))){
              $.alert($.i18n('template.cannot.use'));
              return;
        }
	}
	$("#saveAsFlag").val('saveAsPersonal');
	var theForm = document.getElementsByName("sendForm")[0];
	var titleValue = theForm.subject.value;
    var defaultSubject = $.i18n('common.default.subject.value2');
	if( null == titleValue || ""==titleValue || defaultSubject == titleValue){
	    $.alert($.i18n('collaboration.common.titleNotNull'));  // 标题不能为空
		return;
	} else if (titleValue.length > 300) {
	    $.alert($.i18n('collaboration.newColl.titleMaxSize300.js'));  // 标题最大长度为85!
        return false;
    }
	if($("#content_coll").val().length > 500){
		 var x =$.i18n('collaboration.fuyan.toolong');
		 var x2 = $('#content_coll').val().length;
		 x.replace("{0}",x2);
		 $.alert(x.replace("{0}",x2));  // 发起人附言不能超过500
		return true;
	}
	var subject =  document.getElementById("subject").value;
	var defaultValue = $("#subject").attr("defaultValue");
	if(defaultSubject == defaultValue){
		defaultValue ="";
	}
	var tembodyType =document.getElementById("tembodyType").value;
	var formtitle = document.getElementById("formtitle").value;
	var hasWorkflow= false;
	if($("#process_info").val() && !("" == $("#process_info").val()
             || $.i18n('collaboration.default.workflowInfo.value') == $("#process_info").val())){
		hasWorkflow = true;
	}
	var _cbody = fnx.getMainBodyDataDiv$();
	var _ctype = $("#contentType",_cbody).val();
	if(useforsavetemsubjectflag){
		subject = useforsavetemsubject;
	}
	var _temType = 'hasnotTemplate';
	if(saveastemtype){
		_temType = saveastemtype;
	}
	var clickCount = 0;
	var dialog = $.dialog({
		 targetWindow:getCtpTop(),
	     id: 'saveAsTemplate',
	     url: curlocationPath +"/collaboration/collaboration.do?method=saveAsTemplate&hasWorkflow="+hasWorkflow+"&subject="+escapeStringToHTML(encodeURIComponent(subject))+"&tembodyType="+tembodyType+"&formtitle="+escapeStringToHTML(encodeURIComponent(formtitle))+"&defaultValue="+defaultValue+"&ctype="+_ctype+"&temType="+_temType,
	     width: 350,
	     height: 220,
	     title: $.i18n('collaboration.newcoll.saveAsTemplate'),  // 另存为个人模板
	     buttons: [{
	         text: $.i18n('collaboration.pushMessageToMembers.confirm'), // 确定
	         handler: function () {
	        	//防止重复点击
	        	clickCount++;
				if (clickCount > 1) {
					alert($.i18n('collaboration.common.repeat.click.js'));//请不要重复点击！
	        		return;
	        	}
                var rv = dialog.getReturnValue();
                // activeOcx(); //TODO office等加office控件
        		if (!rv) {
        	        return;
        	    }
        		startProcessBar();
        		var over = rv[0];
        	    var overId = rv[1];
        	    var type = rv[2];
        	    var subject = rv[3];
                if(over == 5){
                  var confirm = "";
                  confirm = $.confirm({
                      'msg': $.i18n('collaboration.saveAsTemplate.isHaveTemplate',escapeStringToHTML(subject)),  // 模板
																													// '+subject+'已经存在，是否将原模板覆盖?
                      ok_fn: function () {
                          confirm.close();
                          endProcessBar();
                          doSaveTemplate(1,subject,overId,type,dialog);
                      },
                      cancel_fn:function(){
                     	clickCount=0;
                     	endProcessBar();
                        confirm.close();
                      }
                   });
                }else{
                   doSaveTemplate(over,subject,overId,type,dialog);
                   endProcessBar();
                }
            }
	     }, {
	         text: $.i18n('collaboration.pushMessageToMembers.cancel'), // 取消
	         handler: function () {
	             dialog.close();
	         }
	     }]
	 });
	$("#zwIframe").css("visibility","visible");
}

function doSaveTemplate(over,subject,overId,type,dialog){
    var fnx =  _getZWIframe();
	checkPDFIsNull=true;// 模板pdf正文允许为空
    // 校验超期提醒，提前提醒时间
    if(isV5Member && (!compareTime() || !checkSupervisor())){
        return;
    }
    if(over == 2){
        return ;
    }
    var theForm = document.getElementsByName("sendForm")[0];

    theForm.saveAsTempleteSubject.value = subject;
    theForm.target = "personalTempleteIframe"; // 自定义名字:出现于框架结构，将会在该名称的框架内打开链接
   
    var moduleId = getUUID();
    if( null != overId && !("" == overId)){
       // moduleId = overId;// 覆盖
        $("#moduleId",$("#comment_deal")).val(moduleId);// 覆盖附言区域的moduleID
        var oldId = fnx.getContentIdByModuleIdAndType(1,moduleId);
        setContentIdForDel(oldId);
    }
    var contentDiv = fnx.getMainBodyDataDiv$();
    // 协同V5.0 OA-34229
	  // 新建事项调用一个系统流程模板后，存为模板后，点击保存待发；
	  // 然后进入待发事项编辑该协同存为模板，再次保存待发；依次重复上诉操作，就会报JS错误
    // 保存上次的ID 以免产生新的正文 出现多正文的情况
    var oldZWId = $("#id",contentDiv).val();
    $("#id",contentDiv).val(-1);
    var oldZWModuleId = $("#moduleId",contentDiv).val();
    $("#moduleId",contentDiv).val(moduleId);
    var oldZWModuleTemplateID =  $("#moduleTemplateId",contentDiv).val();
    $("#moduleTemplateId",contentDiv).val(-1);// 存为个人模板
												// 正文的moduleTemplateId要存成-1
    
  //做一次校验 
    if($("#id",contentDiv).val() != "-1"
        || $("#moduleId",contentDiv).val() != moduleId
        || $("#moduleTemplateId",contentDiv).val() != "-1"){
            alert($.i18n('collaboration.error.save.template.js'));//保存个人模板失败，数据没有被正确设置，请联系开发人员处理。
        return;
    }
    
    var oldcommentId = $("#comment_deal #id").val();
    $("#comment_deal #id").val("");
    $("#comment_deal #moduleId").val("");
    // var curTid = document.getElementById('tId').value;
    // document.getElementById('tId').value= -1;
    document.getElementById('useForSaveTemplate').value='yes';
    var template_dom = document.createElement("input");
    template_dom.id="personTid";
    template_dom.name="personTid";
    template_dom.type="hidden";
    template_dom.value = moduleId;
    if($("#colMainData #personTid").size() > 0){// 多次存为个人模板的时候，要先判断是否已经存在该数据域
												// 不然会按分组提交
        $("#colMainData #personTid").val(moduleId);
    }else{
        $("#colMainData").append(template_dom);
    }
    var type_dom= document.createElement("input");
    type_dom.id="type";
    type_dom.name="type";
    type_dom.type="hidden";
    type_dom.value=type;
    if($("#colMainData #type").size() > 0){// 多次存为个人模板的时候，要先判断是否已经存在该数据域
											// 不然会按分组提交
        $("#colMainData #type").val(type);
    }else{
        $("#colMainData").append(type_dom);
    }
    var overId_dom= document.createElement("input");
    overId_dom.id="overId";
    overId_dom.name="overId";
    overId_dom.type="hidden";
    overId_dom.value=overId;
    if($("#colMainData #overId").size() > 0){
        $("#colMainData #overId").val(overId);
    }else{
        $("#colMainData").append(overId_dom);
    }
    var pobj = $("#workflow_definition #processId")[0];
    var alreayPid =pobj.value;// 现在遵循的原理 即使存个人模板全生成新的流程 （insert
								// wf_process_templete）
    pobj.value='-1';
    theForm.method = "POST";
    $("#projectId").val($("#selectProjectId").val());
    if(type != 'workflow'){
    	fnx.$.content.getContentDomains_newColl(function(domains){
            if (domains) {

                $("#assDocDomain").html("");
                $("#attFileDomain").html("");

          	  saveAttachmentPart("assDocDomain");
                saveAttachmentPart("attFileDomain");

                domains.push('assDocDomain');
                domains.push('attFileDomain');
                domains.push('colMainData');
                domains.push('comment_deal');
                theForm.action = curlocationPath + "/collTemplate/collTemplate.do?method=saveTemplate";
                $("#sendForm").jsonSubmit({
                  domains : domains,
                  validate:false,
                  debug : false,
                  callback:function(){// 加入回调函数，可以让页面不跳转，实现异步
                      $.infor($.i18n('collaboration.newColl.susscessSaveTemplate'));  // 成功保存个人模板
                      theForm.action= curlocationPath +"/collaboration/collaboration.do?method=send";
                      
                      // document.getElementById('tId').value = curTid;
                      document.getElementById('useForSaveTemplate').value='no';
                      pobj.value = alreayPid;
                      $("#comment_deal #id").val(oldcommentId);
                      $("#id",contentDiv).val(oldZWId);// 回填上次的正文ID 和 业务ID
                      $("#moduleId",contentDiv).val(oldZWModuleId);
                      $("#moduleTemplateId",contentDiv).val(oldZWModuleTemplateID);// 存为个人模板
                                                                                      // 正文的moduleTemplateId要存成-1
                      checkPDFIsNull=false;// 保存成功之后设置回来模板标记
                      try{uuidlong = "";}catch(e){}
                      
                    //做一次校验   
                      if($("#id",contentDiv).val() != oldZWId
                          || $("#moduleId",contentDiv).val() != oldZWModuleId
                          || $("#moduleTemplateId",contentDiv).val() != oldZWModuleTemplateID){
                              alert("workflow:" + $.i18n('collaboration.error.save.template.js'));//保存个人模板后，数据没有被正确设置，请联系开发人员处理。
                      }
                      
                      dialog.close();
                  }
                });
              }
        },'saveAsTemplate',null,mainbody_callBack_failed);
    }else{
        var domains = [];
        var contentDiv = fnx.getMainBodyDataDiv$();
        $.content.getWorkflowDomains($("#moduleType", contentDiv).val(), domains);
        if (domains) {

      	  $("#assDocDomain").html("");
            $("#attFileDomain").html("");

            domains.push('colMainData');
            domains.push('comment_deal');
            theForm.action = curlocationPath + "/collTemplate/collTemplate.do?method=saveTemplate";
            $("#sendForm").jsonSubmit({
              domains : domains,
              debug : false,
              validate:false,
              callback:function(){
                  $.infor($.i18n('collaboration.newColl.susscessSaveTemplate'));  // 成功保存个人模板
                  theForm.action= curlocationPath +"/collaboration/collaboration.do?method=send";
                  
               // document.getElementById('tId').value = curTid;
                  document.getElementById('useForSaveTemplate').value='no';
                  pobj.value = alreayPid;
                  $("#comment_deal #id").val(oldcommentId);
                  $("#id",contentDiv).val(oldZWId);// 回填上次的正文ID 和 业务ID
                  $("#moduleId",contentDiv).val(oldZWModuleId);
                  $("#moduleTemplateId",contentDiv).val(oldZWModuleTemplateID);// 存为个人模板
                                                                                  // 正文的moduleTemplateId要存成-1
                  checkPDFIsNull=false;// 保存成功之后设置回来模板标记
                  try{uuidlong = "";}catch(e){}
                  
                //做一次校验   
                  if($("#id",contentDiv).val() != oldZWId
                      || $("#moduleId",contentDiv).val() != oldZWModuleId
                      || $("#moduleTemplateId",contentDiv).val() != oldZWModuleTemplateID){
                          alert("workflow保存个人模板后，数据没有被正确设置，请联系开发人员处理。");
                  }
                  
                  dialog.close();
              }
            });
         }
    }
}

function doPigeonholeWindow(flag, appName, from,obj) {
	doPigeonhole(flag, appName, from);
}

// 预归档
function doPigeonhole(flag, appName, from) {
    if (flag == "no") {
        // TODO 清空信息
    } else if (flag == "new") {
        var result;
        if (from == "templete") {
            result = pigeonhole(appName, null, false, false, "", "doPigeonholeCallback");
        } else {
            result = pigeonhole(appName, null, "", "", "", "doPigeonholeCallback");
        }
    }
}

/**
 * doPigeonhole归档回调
 */
function doPigeonholeCallback(result) {
    var theForm = document.getElementsByName("sendForm")[0];
    if (result == "cancel") {
        var oldPigeonholeId = theForm.archiveId.value;
        var selectObj = theForm.colPigeonhole;
        if (oldPigeonholeId != "" && selectObj.options.length >= 3) {
            selectObj.options[2].selected = true;
        } else {
            var oldOption = document.getElementById("defaultOption");
            oldOption.selected = true;
        }
        return;
    }
    var pigeonholeData = result.split(",");
    pigeonholeId = pigeonholeData[0];
    pigeonholeName = pigeonholeData[1];
    if (pigeonholeId == "" || pigeonholeId == "failure") {
        theForm.archiveName.value = "";
        $.alert(pipeinfo1);
    } else {
        var oldPigeonholeId = theForm.archiveId.value;
        theForm.archiveId.value = pigeonholeId;
        if (document.getElementById("prevArchiveId")) {
            document.getElementById("prevArchiveId").value = pigeonholeId;
        }
        var selectObj = document.getElementById("colPigeonhole");
        var option = document.createElement("OPTION");
        option.id = pigeonholeId;
        option.text = pigeonholeName;
        option.value = pigeonholeId;
        option.selected = true;
        if (oldPigeonholeId == "" && selectObj.options.length <= 2) {
            selectObj.options.add(option, selectObj.options.length);
        } else {
            selectObj.options[selectObj.options.length - 1] = option;
        }
    }
}


// 预归档
function doPigeonholeIpad(flag, appName,from,obj) {

    if (flag == "no") {
        // TODO 清空信息
    }else if (flag == "new") {
        var result;
    	// newIdes=null;
    	var atts = undefined;
    	var type = "";
    	var validAcl = undefined;
    	if(from == "templete"){
        	result = pigeonhole(appName, null, false, false);
    	}else{

    		result = v3x.openDialog({
    	    	id:"pigeonholeIpad",
    	    	title:pipeinfo2,
    	    	url : pigeonholeURL + "?method=listRoots&isrightworkspace=pigeonhole&appName=" + appName + "&atts=" + atts + "&validAcl=" + validAcl+"&pigeonholeType="+type,
    	    	width: 350,
    	        height: 400,
    	        // isDrag:false,
    	        // targetWindow:getA8Top(),
    	        // fromWindow:window,
    	        type:'panel',
    	        relativeElement:obj,
    	        buttons:[{
    				id:'btn1',
    	            text: pipeinfo3,
    	            handler: function(){
    	        		var returnValues = result.getReturnValue();
	    	        	var theForm = document.getElementsByName("sendForm")[0];
	    	            var pigeonholeData = returnValues.split(",");
	    	            pigeonholeId = pigeonholeData[0];
	    	            pigeonholeName = pigeonholeData[1];
	    	            if(pigeonholeId == "" || pigeonholeId == "failure"){
	    	            	theForm.archiveName.value = "";
	    	            	$.alert(pipeinfo4);
	    	            }
	    	            else{
	    	            	var oldPigeonholeId = theForm.archiveId.value;
	    	            	theForm.archiveId.value = pigeonholeId;
	    	            	if(document.getElementById("prevArchiveId")){
	    	            		document.getElementById("prevArchiveId").value = pigeonholeId;
	    	            	}
	    	            	var selectObj = document.getElementById("colPigeonhole");
	    	            	var option = document.createElement("OPTION");
	    	            	option.id = pigeonholeId;
	    	            	option.text = pigeonholeName;
	    	            	option.value = pigeonholeId;
	    	            	option.selected = true;
	    	            	if(oldPigeonholeId == "" && selectObj.options.length<=2){
	    	            		selectObj.options.add(option, selectObj.options.length);
	    	            	}
	    	            	else{
	    	            		selectObj.options[selectObj.options.length-1] = option;
	    	            	}
	    	            }
		        		result.close();
	            }

    	        }, {
    				id:'btn2',
    	            text: pipeinfo5,
    	            handler: function(){
    	        		result.close();
    	            }
    	        }]
    	    });
    	}
    }
}

function pigeonholeEvent(obj){
	var theForm = document.getElementsByName("sendForm")[0];
	switch(obj.selectedIndex){
		case 0 :
			var oldArchiveId = theForm.archiveId.value;
			if(oldArchiveId != ""){
				theForm.archiveId.value = "";
			}
			theForm.archiveId.value = "";
			break;
		case 1 :
			doPigeonholeWindow('new', '1', 'newColl',obj);
			break;
		default :
			theForm.archiveId.value = document.getElementById("prevArchiveId").value;
			return;
	}
}



// 附件上传后回调方法
function testCallBack(field){
    // 处理文件逻辑的action
    location.href="/t1/fileController.do?field="+field;
}

function saveWaitSendSuccessTip(content,summaryId,affairId){
    var htmlContent="<div id='saveTip' class='align_center over_auto padding_5' style='color:#ffffff; z-index:900; background-color:#85c93a;font-size: 12px;'>"+content+"</div>";
    var _left=($("#toolbar").width()-130)/2;
    var _top=$("#toolbar").offset().top;
    var panel = $.dialog({
        id:'saveTip',
        width: 150,
        height: 26,
        type: 'panel',
        html: htmlContent,
        left:_left,
        top:_top,
        shadow:false,
        panelParam:{
            show:false,
            margins:false
        }
    });
  //将正文内容置空，解决了页面刷新两遍(OA-81094)
    document.getElementById("zwIframe").style.display="none";//直接影藏就可以了
    setTimeout(function(){
        panel.close();//这里面有setTimeout
        setTimeout(function(){
            try {
                var url = _ctxPath+"/collaboration/collaboration.do?method=newColl&summaryId="+summaryId+"&affairId="+affairId+"&from=waitSend"+"&formTitleText="+encodeURIComponent($("#subject").val());
                if(window.location.href.indexOf("from=bizconfig") != -1 || window.location.href.indexOf("reqFrom=bizconfig") != -1){
                    url += "&reqFrom=bizconfig";
                    if($("#bzmenuId").val() != ""){
                        url += "&menuId="+$("#bzmenuId").val();
                    }
                }
                if(_subState != "1"){
                	url += "&oldSubState="+_subState;
                }
                
                isFormSubmit = false;
                
                if (getCtpTop().isCtpTop) {
                    getCtpTop().$("#main")[0].contentWindow.location = url;
                } else {
                    window.location = url;
                }
            }catch(e) {}
        }, 10);
        
    },2000);
}

function checkContent(){
    var content = $("#content_coll").val();
    var defaultValue = $.i18n("collaboration.newcoll.fywbzyl");
    if (content == defaultValue) {
        $("#content_coll").val("");
        $("#content_coll").css("color","");
    }
}

function checkContentOut(){
    var content = $("#content_coll").val();
    var defaultValue = $.i18n("collaboration.newcoll.fywbzyl");
    if (content == "") {
        $("#content_coll").val(defaultValue);
        $("#content_coll").css("color","#a3a3a3");
    }
}

function onclickTrack(){
	$("#radiopart").click();
}
// 截取跟踪指定人长度
function trackName(res){
	var userName="";
	var nameSprit="";
	if(res.obj.length>0){
  	for(var co = 0 ; co<res.obj.length ; co ++){
	   userName+=res.obj[co].name+",";
	}
  	userName=userName.substring(0,userName.length-1);
  	// 只显示前三个名字
// nameSprit=userName.split(",");
// if(nameSprit.length>3){
// nameSprit=userName.split(",", 3);
// nameSprit+="...";
// }
  	$("#zdgzryName").attr("title",userName);
	var partText = document.getElementById("zdgzryName");
	 partText.style.display="";
	 // $("#zdgzryName").val(nameSprit);
	 $("#zdgzryName").val(userName);
 }
}

function _contentSetText(){
    var fnx=  _getZWIframe();
    
    
	if(istranstocol && !transOfficeId){
		// if(false){
		var _formC = $("#formTextId").text();
		
		if(_formC){
			// try{fnx.$("#mainbodyHtmlDiv_0")[0].innerHTML=_formC}catch(e){};
			try{fnx.setContent(_formC);}catch(e){}
		}
	}
	if($("#contentSwitchId").val() != ""){
		setTimeout(function(){
			var contentDiv = fnx.getMainBodyDataDiv$();
			$("#id",contentDiv).val($("#contentSwitchId").val());
			contentLoaded = true;
		},1000);
	}else{
	    contentLoaded = true;
	}
	if(_isResendFlag){
		var contentDiv = fnx.getMainBodyDataDiv$();
		$("#id",contentDiv).val("");
	}
	
	releaseApplicationButtons();
	
	// 转发到表单撤销到待发编辑，这个时候表单是只读的，并且屏蔽存为模板按钮
 	if(contentViewState == '2'){ // 只读状态
 		  // 存为模板
 		  tb.disabled("refresh1");
 		  // 当前协同是转发后的表单,不能修改正文
 		  $("#canEdit")[0].disabled = true;
 	}
 	
 	
	if(fnx && fnx.setContentModuleId){
	    fnx.setContentModuleId($("#id",$("#colMainData")).val());
	}
	
	//新建表单协同， 数据关联数据加载
	if(window._onFormLoaded){
	    _onFormLoaded();
	}
	
}


function contentBack(bodyType) {
    // 如果是PDF正文，不能修改正文
    var canEdit = "";
    var $canEdit = $("#canEdit");
    if($canEdit.size > 0 ){
        canEdit = $canEdit[0];
    }
    else{
        parent.$("#canEdit")[0]
    }
    if (bodyType == 45) {
        canEdit.disabled = true;
        canEdit.checked = false;
    } else {
        canEdit.disabled = false;
        canEdit.checked = true;
    }
}

/**
 * 待发表单打开不保存，移除Session中当前表单数据缓存对象
 */
function removeSessionMasterData(dataId){
	var params = new Object();
    if (dataId) {
    	params["masterDataId"] = dataId;
    }
    if(bodyType == 20){
    	//清空签章锁
        var zwIframe = _getZWIframe();
        zwIframe.releaseISignatureHtmlObj();
    	var handWriteKeys = zwIframe.getUnLoadHtmlHandWriteKeys();
    	params["handWriteKeys"] = handWriteKeys;
    }
    
    if(params["masterDataId"] != null || params["handWriteKeys"] != null){
    	//var cm = new colManager();
    	//cm.unlock4NewCol(params);
    	callBackendMethod("colManager","unlock4NewCol",params);
    }
}

/**
 * 获取正文iframe
 * 
 * @returns
 */
function _getZWIframe(){
    
    var fnx;
    if($.browser.mozilla){
       fnx = window.document.getElementById("zwIframe").contentWindow;
    }else{
       fnx = window.document.zwIframe;
    }
    
    return fnx;
}

//新建页面解决chrome下隐藏后显示控件未的问题
function newColOfficeObjExtshowExt(){
	var iframe = $("#zwIframe", document)[0];
	OfficeObjExt.showIfame({ //处理 zwIframe iframe中的Office 对象的显示
		firstAttr:"firstHeight",
		iframe:iframe,
		callback:function(){
			var arr = [];
			var _tpWin = getCtpTop();
			//显示的时候如果有遮罩就不显示office插件
			var hasMask = (_tpWin.$('.mask').size()>0 && _tpWin.$('.mask').css('display') != 'none') 
			|| (_tpWin.$('.shield').size()>0 && _tpWin.$('.shield').css('display') != 'none');
			if(_tpWin.isOffice && _tpWin.officeObj && _tpWin.officeObj.length>0  && !hasMask){ //处理所有签章对象的显示
				for(var i = 0; i<_tpWin.officeObj.length;i++){
					var _temp = _tpWin.officeObj[i];
					if(_temp && _temp.style){
						_temp.style.visibility = 'visible';
						arr.push({ //将多个Office对象安装队列顺序执行，进行效果显示
							obj:_temp, //当前的office对象
							idx:arr.length, //当前office对象在队列中的唯一标示
							run:function(){
								OfficeObjExt.showIfame({ //执行当前office对象的显示
									firstAttr:"firstHeight_"+this.idx, //当前对象 对应的对应到队列中的唯一标示
									iframe:this.obj,//当前的Office 对象
									callback:function(){ //当前office对象在队列中执行完毕的函数
										if(typeof arr[this.idx+1] !=='undefined'){
											arr[this.idx+1].run(); //当前队列执行完毕后，执行下一个队列
										}
										if(typeof arr[this.idx+1] ==='undefined'){ //当队列执行完毕后，清空数组对象
											arr =[];
										}
									}
								});
							}
						});
					}
				}
			}
			window.setTimeout(function(){
				if(arr.length>0){ //执行队列中第一个元素 的显示
					arr[0].run();
					if(arr.length ==1){
						arr.length=0;
						arr =[];
					}
				} 
			},20); 
		}
	}); //default :firstHeight 

}


function errorHandle(e){
	disableSendButtions();
}

/**
 * 根据节点权限控制按钮的初始化
 */
function initAttItem(){
	var toolItems = [{
    id: "saveDraft",
    name: $.i18n('collaboration.newcoll.save'),
    className: "ico16 save_traft_16",
    click:saveDraft
	},{ id : "refresh2", name : $.i18n('collaboration.newcoll.callTemplate'), className : "ico16 call_template_16", click : function(){
			handleTemplate();
		}
	},{
    id: "conotentType",
    name: $.i18n('collaboration.newcoll.conotentType'),
    className: "ico16 text_type_16",
    subMenu: getContentTypeChooser("toolbar",bodyType,contentBack)
	},{
    id: "refresh1",
    name: $.i18n('collaboration.newcoll.saveAsTemplate'),
    className: "ico16 save_template_16",
    click:function(){
    	saveAsTemplete();
    }
	}];
	
	var print = {
		id : "print", name : $.i18n('collaboration.newcoll.print'), className : "ico16 print_16", click : function(){
			newDoPrint("newCol");
		}
	};

	
	//打印控制
	if(officecanPrint == 'true'){
		toolItems.push(print);
	}
	
	return toolItems;
}

//新建套红回调
function changeViewCallBack(currentIndex,toindex,cb){
	try{
	if(toindex != 0){
		var fnx_zwIframe = _getZWIframe();
		if(fnx_zwIframe.isHasISignFlag() && nowNodeIsSignatureHtml=="true"){
			var confirm = "";
	        confirm = $.confirm({
	            'msg': $.i18n('collaboration.summary.isign.title'),  //模板 '+subject+'已经存在，是否将原模板覆盖?
	            ok_fn: function () {
	               confirm.close();
	        	   fnx_zwIframe.preSubmitData(function(){
                   cb($("#zwOfficeIframe"),$("#zwIframe"),openFrom);
	        	   }, function(){}, false,false);
	            },
	            cancel_fn:function(){
	              confirm.close();
	            }
	         });
			
		}else{
			fnx_zwIframe.preSubmitData(function(){
			    cb($("#zwOfficeIframe"),$("#zwIframe"),openFrom);
			}, function(){}, false,false);
		}
	}else if(toindex == 0){
		if(typeof(cb) =='function'){
			cb($("#zwOfficeIframe"),$("#zwIframe"),openFrom);
    	}
	}}catch(e){}
}

//表单正文切换回调函数， changeViewCallBack 这个函数有时候不执行
function onSwitchFormContent(type){
    if(type=="word"){
        $("#GoTo_Top_scan").hide();
    }else{
        $("#GoTo_Top_scan").show();
    }
}


function showRelativePeoples(){
	//var ajaxColManager = new colManager();

	//var members = ajaxColManager.getRelativeMembers();
	var members = callBackendMethod("colManager","getRelativeMembers");
	
	if(members != null){
		if(members != null){
			var shows = "";
			for(var i = 0;i<members.length;i++){
				var _m = members[i];
				shows += '<li v="'+_m.v+'" k="'+_m.k+'" d="'+_m.d+'" s="'+_m.s+'" title="'+_m.v+'" onclick="clickName(this);">'+_m.sn+'</li>';
			}
			$("#relativePeopleArea").html(shows);
			$("#relativePeopleNum").html("（"+members.length+"）");
			if(members.length==0){
				$("#relativePeopleArea").css("height","");
			}else{
				$("#relativePeopleArea").css("height", members.length*20.5);
			}
		}
	}
	
}
var __hasLoadRp = false;
function showOrHiddenCommonPeoples(_this,_type){
	var $span = $(_this).children("span");
	if($span.hasClass("arrow_toggle_zk_16")){
		$span.attr("class","ico16 arrow_toggle_ss_16 margin_b_5");
	}else{
		$span.attr("class","ico16 arrow_toggle_zk_16 margin_b_5");
	}
	if(_type == 'rp' && !__hasLoadRp){
		showRelativePeoples();
		__hasLoadRp = true;
	}
	if($(_this).siblings("ul") && $(_this).siblings("ul").css("display")=="none"){
		$(_this).siblings("ul").show();
	}else{
		$(_this).siblings("ul").hide();
	}
}

function fix_zwIframeHeight(){
	var zwIframea= $("#zwIframe");
  var oldHeight = zwIframea.height();
  var zwIframec = $("#zwIframe").contents();
  var newHeight = zwIframec.find("#mainbodyDiv").height();
  if(newHeight>oldHeight){
    zwIframea.height(newHeight + 20);  //20是滚动条的高度
  }
}