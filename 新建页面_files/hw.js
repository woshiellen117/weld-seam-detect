/**
 *Created by muj!
 *IWebRevision常见BUG说明：
 *1。保存的时候：No GIF Data to write
 *   -- 页面中有高/宽都等于0PX的签章字段控件! 如果是因为修改表单一定要有的话，数据源中保留，INFOPATH中删除
 *
 * 
 * 
 */


/*
调用hw页面提供如下全局变量
webRoot  :web容器根路径
hwVer:手写控件版本号
htmOcxUserName:手写批注用户名称
*/
/**********
当页面上没有定义处理意见显示位置时候,所有手写到一个手写板上
***********/

//手写控件对象
var hwObjs=new Array();

var hwUpdateObj=null;//记录修改控件对象；取消修改时候，删除修改状态
var currentHwObjId; //获取当前的签批的控件id
var currentUserId;
var isAdvanceObj = true;
function getHwName(actorid)
{
	if(opinionSpans==null){initSpans();}	
	var hwName="";
	var objName="my:"+actorid;	
	if(opinionSpans.get(objName,null)!=null)
	{
		hwName="hw"+actorid;
	}
	else
	{//没有定义当前节点显示位置,所有手写签批到一个手写板
		hwName="hw"+"otherOpinion";
	}
	return hwName;
}
/*得到控件插入位置控件,意见显示控件*/
function getActorTextObj(actorid)
{	
	var objName="my:"+actorid;
	if(opinionSpans==null){initSpans();}
	if(opinionSpans.get(objName,null)==null)
	{//没有定义当前节点显示位置,所有手写签批到一个手写板
		objName="my:"+"otherOpinion";
	}
	return objName;
}
/*****************/
//公文一个权限提供一个手写板供批注盖章,actorID确定手写板
//手写板用"hw"+actorid,命名
//
/*******************/
function handWrite(recordId,actorid,isNewImg,affairId,userId)
{
	try{
	var newCreateOcx=false;
	var objName,hwObj;

	var isNewInterface = false;
	if(typeof actorid == "string"){
	  objName=getHwName(actorid);
	}else{
	  objName = actorid.value;
	  isNewInterface = true;
	}
	hwObj=document.getElementById(objName);
	var insertObj;
	if(isNewImg){
	   //是否重新生成新画布
		var noSinged=true;
		var hwObjsArr=document.getElementsByName(objName);
		var hwObjAffairIsNull = hwObjsArr.length==1
								&&(hwObjsArr[0].WebGetMsgByName("AFFAIRID")=="" 
									|| hwObjsArr[0].WebGetMsgByName("AFFAIRID")=="null" 
									|| hwObjsArr[0].WebGetMsgByName("AFFAIRID")==null);
		if(hwObjAffairIsNull){//老数据取当前的签批内容
			hwObj=hwObjsArr[0];
			noSinged=false;
		}else{
			for (var i = 0; i < hwObjsArr.length; i++) {
				var objTemp=hwObjsArr[i];
				var affairIdStr=objTemp.WebGetMsgByName("AFFAIRID");
				if(affairIdStr==affairId){
					hwObj=objTemp;
					noSinged=false;
				}
			}
		}
		
		if(noSinged||hwObj==null)
		{
			newCreateOcx=true;
			if(isNewInterface){
				insertObj=actorid;
			  	hwObj=createHandWrite(objName,htmOcxUserName,recordId,actorid,true,affairId);
			}else{
				insertObj=getActorTextObj(actorid);
			  	hwObj=createHandWrite(objName,htmOcxUserName,recordId,getActorTextObj(actorid),true,affairId);
			}
			if(hwObj==null){return;}
		}
	}else{//表单签批
		if(hwObj==null)
		{
			newCreateOcx=true;
			if(isNewInterface){
				insertObj=actorid;
			  	hwObj=createHandWrite(objName,htmOcxUserName,recordId,actorid,false);
			}else{
				insertObj=getActorTextObj(actorid);
			  	hwObj=createHandWrite(objName,htmOcxUserName,recordId,getActorTextObj(actorid),false);
			}
			if(hwObj==null){return;}
		}
	}
	
	if(checkModify(hwObj)==false){return false;}
	
	if(hwObj==null){hwObj=null;return;}	
	//兼容第一次打开签章关闭后，鼠标滚动窗口后再次打开签批控件画布大小为0的情况
	hwObj=resetWidthAndHeight(hwObj,insertObj,isNewInterface,actorid);
	
	hwObj.Enabled="1";
	hwObj.EnableMenu("加宽");
	//hwObj.EnableMenu("签名盖章...");
	//hwObj.EnableMenu("文字批注...");
	hwObj.EnableMenu("签章信息...");	
 	hwObj.EnableMenu("撤消签章...");
 	hwObj.SetFieldByName("RESIZEWIDTH","FALSE");// 来控制“手写签名”窗口不能够加宽。
 	hwObj.ResizeForm=true;
 	if(v3x.currentLanguage == 'zh-cn' || v3x.currentLanguage == 'zh-tw'){
 		hwObj.FontName = "宋体";
 		hwObj.FontSize = 11;
 	}
 	
 	if(isNewImg){//公文设置当前用户
 		hwObj.WebSetMsgByName("currentUserId",parent.currentUserId);
 	}else{//表单设置当前用户
 		if((userId==null || userId == "")){
 			userId = currentUserId;
 		}
 		if(userId == null ){
 			userId = "";
 		}
 		hwObj.WebSetMsgByName("currentUserId",userId);
 	}
 	currentHwObjId = hwObj.id;
 	try{
 		var _states = hwObj.GetVersionInfo();
		if(_states && _states.substring(1,2)=="0"){
			alert(v3x.getMessage("V3XOfficeLang.alert_NoAdvance_office"));
			return;
		}
 	}catch(ea){}
 	
 	if(v3x.isMSIE){
 		var ratio = detectZoom();
 		hwObj.IEZoom=ratio;
 		hwObj.OpenSignature();	
 	}else{
 		currentHwObjId = hwObj.id;
 		hwObj.ExecuteScript("OpenSignature","ActiveObject.OpenSignature()");
 	}
	//hwObj.Enabled="0";
	}catch(ea){
		alert(v3x.getMessage("V3XOfficeLang.alert_err_HandWrite_Disbaled"));
	}
}

function resetWidthAndHeight(hwObj,insertObj,isNewInterface,actorid){
	if(hwObj.ImgWidth==0||hwObj.ImgHeight==0){
		var imgWidth="200";
		var imgHight="200";
		var inputObj;
		if(isNewInterface){
			insertObj=actorid;
		}else{
			insertObj=getActorTextObj(actorid);
		}
		
		//兼容老版本和5.0表单，老版本传递string，5.0传递对象
		if(typeof insertObj == "string"){
		  if(opinionSpans==null){initSpans();}
		  inputObj=opinionSpans.get(insertObj,null);
		}else{
		    inputObj = insertObj;
		}
		if(inputObj==null)
		{		  
			alert(v3x.getMessage("V3XOfficeLang.alert_noHandWriteLocation"));
			return;
		}
		imgHight=initImgHeight(inputObj, imgHight);
		imgWidth=initImgWidth(inputObj, imgWidth);
		hwObj.ImgWidth=imgWidth;
		hwObj.ImgHeight=imgHight;
	}
	return hwObj;
}

function getHtmlHandWriteDataObj(hwObj)
{
	var i;
	for(i=0;i<hwObjs.length;i++)
	{
		if(hwObjs[i].recordId==hwObj.RecordID && hwObjs[i].objName==hwObj.FieldName.substr(2))
		{
			return hwObjs[i];
		}
	}
	return null;
}

function getHtmlHandWriteId(hwObj)
{
	return hwObj.RecordID+"___"+hwObj.FieldName;
}
//检查手写批注控件是否有人修改,无人修改时返回"false",有人修改时返回修改人员的用户名称
function checkModify(hwObj)
{  
  //var objData=getHtmlHandWriteDataObj(hwObj);
  if(hwObj==null){return true;}
  if(hwObj.checkUpdate==false){return true;}
  
  var requestCaller = new XMLHttpRequestCaller(this, "ajaxHandWriteManager", "editObjectState",false);
  requestCaller.addParameter(1, "String", getHtmlHandWriteId(hwObj));  
  var ds = requestCaller.serviceRequest();
  if(ds.get("curEditState")=="true")
  {
  	//alert(getOfficeLanguage("用户")+ds.get("userName")+getOfficeLanguage("正在编辑此文件，不能修改！"));    
  	alert(v3x.getMessage("V3XOfficeLang.alert_NotHandwrite",ds.get("userName")));    	
    return false;
  }
  hwUpdateObj=hwObj;
  //alert("("+ds.get("lastUpdateTime")+")==("+hwObj.lastUpdateTime+")");
  if(ds.get("lastUpdateTime")==null){return true;}
  if(ds.get("lastUpdateTime")!=hwObj.lastUpdateTime)
  {
  	  	if(hwObj!=null)
		{
//			loadObjData(hwObj);
			hwObj.checkUpdate=false;
		}
  }  
  return true;
}


function getHandWriteSize(objSize,defaultValue)
{
	var i;
	var retvalue="";
	if(objSize==null || objSize==""){return defaultValue;}
	if(objSize.lastIndexOf("%")!=-1){return defaultValue;}
	for(i=0;i<objSize.length;i++)
	{
		if(isNaN(objSize.charAt(i))==false)
		{
			retvalue+=objSize.charAt(i);
		}
		else
		{
			break;
		}
	}
	if(retvalue==""){retvalue=defaultValue;}
	return retvalue;
}
function initImgHeight(inputObj, imgHight)  {
	/*if (typeof (inputObj.clientHeight) != "undefined" && inputObj.clientHeight) {
		imgHight = inputObj.clientHeight;
	}*/
	if (typeof (inputObj.style) != "undefined"
		&& typeof (inputObj.style.pixelHeight) != "undefined"
		&& inputObj.style.pixelHeight) {
		if(imgHight<inputObj.style.pixelHeight){
			imgHight = inputObj.style.pixelHeight;
		}
	}
	if (typeof (inputObj.initHeight) != "undefined" && inputObj.initHeight) {
		imgHight = inputObj.initHeight.replace("px", "");
	}
	return imgHight;
}
function initImgWidth(inputObj, imgWidth) {
	
	/*if (typeof (inputObj.clientWidth) != "undefined" && inputObj.clientWidth) {
		imgWidth = inputObj.clientWidth;
	} */
    if (typeof (inputObj.style) != "undefined"
			&& typeof (inputObj.style.pixelWidth) != "undefined"
			&& inputObj.style.pixelWidth) {
		imgWidth=inputObj.style.pixelWidth;
	}
    if(typeof(inputObj.initWidth)!="undefined"&& inputObj.initWidth&&inputObj.initWidth.indexOf("%")==-1){
    	imgWidth = inputObj.initWidth.replace("px", "");
    }
	return imgWidth;
}

/*生成控件*/
function createHandWrite(objName,userName,recordId,insertObj,isNewImg,affairId)
{
	  var imgWidth="200";
	  var imgHight="200";
	  var inputObj;
	  //兼容老版本和5.0表单，老版本传递string，5.0传递对象
	  if(typeof insertObj == "string"){
	    if(opinionSpans==null){initSpans();}
	    inputObj=opinionSpans.get(insertObj,null);
	  }else{
	    inputObj = insertObj;
	  }
	  if(inputObj==null)
	  {		  
		  alert(v3x.getMessage("V3XOfficeLang.alert_noHandWriteLocation"));
		  return;
	  }
	  imgHight=initImgHeight(inputObj,imgHight);
	  imgWidth=initImgWidth(inputObj, imgWidth);
	  var d=new Date();
	  var sdate=d.getYear()+"-"+(d.getMonth() + 1) + "-"+d.getDate();                
	  var hwObj;
	   if(v3x.isMSIE){
		hwObj = document.createElement("OBJECT");  
		hwObj.name = objName;
		hwObj.id = objName;
		hwObj.classid = "clsid:2294689C-9EDF-40BC-86AE-0438112CA439";
		hwObj.codebase=webRoot+"/common/office/iWebSignature.ocx";
		try {
			if(___OfficeLicese && ___OfficeLicese != ""){
				hwObj.Copyright = ___OfficeLicese;
			}
		}
		catch (e) {
		}
		if(isNewImg){//文单签批
 	  		var affairIdStr=document.getElementById("affairId");
 	  		var draftChooseObj=document.getElementById("draftChoose");//从待发中打开标记
 	  		
			var divObj=document.getElementById(affairId);//获取意见div对象
			if(divObj){
				divObj.insertAdjacentElement("beforeBegin",hwObj);
			}else if(affairIdStr){
				if(affairId=="null"||affairId==""||affairId==affairIdStr.value||draftChooseObj){//兼容升级数据和暂存待办状态
					inputObj.insertAdjacentElement("beforeBegin",hwObj);
				}
			}else{//兼容公文从待发中编辑被回退的公文签批显示
				inputObj.insertAdjacentElement("beforeBegin",hwObj);
			}
			//文单签批的时候绑定签批区域
			var notPrintDiv=document.getElementById("notPrint");
			if(notPrintDiv){
				notPrintDiv.insertAdjacentElement("beforeBegin",hwObj);
			}
 	  	}else{//表单签批
 	  		inputObj.insertAdjacentElement("beforeBegin",hwObj);
 	  	}
		//点确定设置签章图片的高度和宽度
		if(typeof(hwObj.attachEvent) != 'undefined'){
	  			hwObj.attachEvent("OnWindowResize", OnWindowResize);
	  		}else{
	  			hwObj.addEventListener("OnWindowResize", OnWindowResize);
	  	}
		var ratio = detectZoom();
		hwObj.IEZoom=ratio;
	  }else{
		var str = '';
		//iwebplugin授权码
		var copyright = '致远软件[专用];FSzlGZqS0ZU0vFTcG/ULsG3mP3leFSzlSGOFLSlBaidmB3tDwLgZwLoZwLVZwLSZwLeZwigZwiomlQgDORWZdASmlSwDORWZdASmlL=DORWZdASmSC3DORWZdASmLlVDORWZdASmVlwDORWZdASmBC3DORWZdASmOCwDziZ6';
		var nowDate = new Date().getTime();
		var objId = "";
		if(isNewImg){
			objId = objName+nowDate;
		}else{
			objId = objName;
		}
		var onMenuClickStr = "OnMenuClick"+objName;
		str += '<object id="'+objId+'" name="'+objName+'"';
		str += ' progid="DBstep.WebSignature"';
		str += ' type="application/iwebplugin"';
		str += ' OnMenuClick="'+onMenuClickStr+'"';
		str += ' OnWindowResize="OnWindowResize"';
		str += ' OnExecuteScripted="OnExecuteScripted" ';
		str += ' Copyright="' +  copyright + ' " >';
		 str += '</object>';
		var div1 = document.createElement("span");
		div1.id = nowDate;
        div1.innerHTML = str;
		if(isNewImg){//文单签批
 	  		var affairIdStr=document.getElementById("affairId");
 	  		var draftChooseObj=document.getElementById("draftChoose");//从待发中打开标记
 	  		
			var divObj=document.getElementById(affairId);//获取意见div对象
			if(divObj){
				divObj.insertAdjacentElement("beforeBegin",div1);
			}else if(affairIdStr){
				if(affairId=="null"||affairId==""||affairId==affairIdStr.value||draftChooseObj){//兼容升级数据和暂存待办状态
					inputObj.insertAdjacentElement("beforeBegin",div1);
				}
			}else{//兼容公文从待发中编辑被回退的公文签批显示
				inputObj.insertAdjacentElement("beforeBegin",div1);
			}
			//文单签批的时候绑定签批区域
			var notPrintDiv=document.getElementById("notPrint");
			if(notPrintDiv){
				notPrintDiv.insertAdjacentElement("beforeBegin",div1);
			}
 	  	}else{//表单签批
// 	  		inputObj.insertAdjacentElement("beforeBegin",div1);
 	  		inputObj.parentNode.insertBefore(div1,inputObj);
 	  	}
		hwObj =  document.getElementById(objId);
		//解决chrome浏览器下控件遮挡问题machj
	    if(setOfficeFlag){
	        setOfficeFlag(true,hwObj);
	    }
	  }	
	  hwObj.EditType="0";
	  hwObj.ShowPage="0";
	  hwObj.ShowMenu="1";
	  hwObj.SignatureType="0";
	  hwObj.ImgWidth=imgWidth;
	  hwObj.ImgHeight=imgHight;
	  hwObj.RecordID=recordId;
	  hwObj.FieldName=objName;
	  hwObj.BorderStyle="0"; 
	  hwObj.WebUrl=webRoot+"/htmlofficeservlet";
	  hwObj.InputList="同意\r\n不同意\r\n请上级批示\r\n请速办理";
	  hwObj.Enabled="0";
	  
	  
	  hwObj.AppendMenu("9","-");
	  hwObj.AppendMenu("10","加宽");
	  hwObj.DisableMenu("加宽");
	  hwObj.DisableMenu("签名盖章...");
	  hwObj.DisableMenu("文字批注...");
	  hwObj.DisableMenu("签章信息...");	
 	  hwObj.DisableMenu("撤消签章...");
 	  hwObj.WebSetMsgByName("isNewImg",isNewImg+"");
 	  if(isNewImg){
 	  	hwObj.WebSetMsgByName("AFFAIRID",affairId);
 	  }
 	  var affairMemberName=getAffairMemberName();
 	  //代理人处理的时候要显示成：代理人（代理XX）
 	  if(affairMemberName!=""&&userName!=affairMemberName){
 		  userName=userName+"(代理"+affairMemberName+")";
 	  }
 	  hwObj.UserName=userName;
 	  
 	  //设置当前处理人信息
 	  var affairMemberId = getAffairMemberId();
 	  if(affairMemberId){
 		  hwObj.WebSetMsgByName("affairMemberId",affairMemberId);
 	  }	
 	  if(affairMemberName){
 		  hwObj.WebSetMsgByName("affairMemberName",affairMemberName);
 	  }
 	 hwObj.SetFieldByName('MaxRateWindowScale','true');
	  hwObj.LoadLanguage(v3x.baseURL + "/common/office/js/i18n/iWebRevsion/" + v3x.currentLanguage + "_txt");
	  //alert(v3x.baseURL + "/apps_res/form/js/i18n/iWebRevsion/" + v3x.currentLanguage + ".txt");
	  try{inputObj.style.height="auto"||"100%";}catch(e){}
	  try{
		  var _states = hwObj.GetVersionInfo();
		  if(_states && _states.substring(1,2)=="0"){
			  isAdvanceObj = false;
		  }
	  }catch(e){}
	  return hwObj;
}
//获取待办所属人的ID
function getAffairMemberId(){
	var affairMemberId=0;
	if(typeof(parent._affairMemberId)!="undefined"){//公文签批
		affairMemberId=parent._affairMemberId;
	}else if(typeof(parent.parent._affairMemberId)!="undefined"){//单击打开，上下结构的时候
		affairMemberId=parent.parent._affairMemberId;
	}else if(typeof(parent.parent.parent._affairMemberId)!="undefined"){//双击打开，弹出窗口的时候
		affairMemberId=parent.parent.parent._affairMemberId;
	}
	return affairMemberId;
}
//获取待办所属人的Name
function getAffairMemberName(){
	var affairMemberName="";
	if(typeof(parent.affairMemberName)!="undefined"){//公文签批
		affairMemberName=parent.affairMemberName;
	}else if(typeof(parent.parent.affairMemberName)!="undefined"){//单击打开，上下结构的时候
		affairMemberName=parent.parent.affairMemberName;
	}else if(typeof(parent.parent.parent.affairMemberName)!="undefined"){//双击打开，弹出窗口的时候
		affairMemberName=parent.parent.parent.affairMemberName;
	}
	return affairMemberName;
}
/*生成控件*/
function createEmptyHandWrite(objName,userName,recordId,insertObj)
{
	  var imgWidth="200";
	  var imgHight="200";
	  if(opinionSpans==null){initSpans();}
	  var inputObj=opinionSpans.get(insertObj,null);
	  if(inputObj==null)
	  {		  
		  alert(v3x.getMessage("V3XOfficeLang.alert_noHandWriteLocation"));
		  return null;
	  }
	  imgWidth=getHandWriteSize(inputObj.initWidth,"200");
	  imgHight=getHandWriteSize(inputObj.initHeight,"200");
	  var d=new Date();
	  var sdate=d.getYear()+"-"+(d.getMonth() + 1) + "-"+d.getDate();                
	  var hwObj;
	  hwObj=document.createElement("OBJECT");	  
	  hwObj.name=objName;
	  hwObj.id=objName;
	  hwObj.classid="clsid:2294689C-9EDF-40BC-86AE-0438112CA439";
 	  hwObj.codebase=webRoot+"/common/office/iWebSignature.ocx";
	  hwObj.WebUrl=webRoot+"/htmlofficeservlet";
	  //hwObj.codebase="/seeyon/common/office/iWebSignature.ocx#version="+hwVer; 	  
	  //hwObj.WebUrl="/seeyon/htmlofficeservlet";
	  hwObj.RecordID=recordId;
	  hwObj.FieldName=objName;
	  hwObj.EditType="0";
	  hwObj.ShowPage="0";
	  hwObj.ShowMenu="1";
	  hwObj.SignatureType="0";
	  hwObj.InputList="同意\r\n不同意\r\n请上级批示\r\n请速办理";
	  hwObj.UserName=userName;
	  //hwObj.InputText=userName+" "+sdate;
	  hwObj.Enabled="0";
	  hwObj.ImgWidth=imgWidth;
	  hwObj.ImgHeight=imgHight;
	  hwObj.BorderStyle="0";
	  hwObj.AppendMenu("9","-");
	  hwObj.AppendMenu("10","加宽");
	  hwObj.DisableMenu("加宽");
	  hwObj.DisableMenu("签名盖章...");
	  hwObj.DisableMenu("文字批注...");
	  hwObj.DisableMenu("签章信息...");	
 	  hwObj.DisableMenu("撤消签章...");
	  //inputObj.insertAdjacentHTML("beforeBegin","<br>");
	  //inputObj.insertAdjacentElement("beforeBegin",hwObj);
	  hwObj.LoadLanguage(v3x.baseURL + "/common/office/js/i18n/iWebRevsion/" + v3x.currentLanguage + "_txt");
	  //alert(v3x.baseURL + "/apps_res/form/js/i18n/iWebRevsion/" + v3x.currentLanguage + ".txt");
	  try{inputObj.style.height="100%";}catch(e){}
	  return hwObj;
}
/*调入控件数据*/
function loadData(objName)
{
	var hwObj=document.getElementById(objName);
	loadObjData(hwObj);
}
function loadObjData(obj)
{
	var ret=false;
	if(obj!=null)
	{
		obj.LoadSignature();
		try{
			obj.width=obj.ImgWidth;
			obj.height=obj.ImgHeight;
		}catch(e){}
		ret = true;
	}
	return ret;
}
/*控件菜单相应函数*/
function  OnMenuHdClick(obj,vIndex,vCaption)
{
  //alert('编号:'+vIndex+'\n\r'+'标题:'+vCaption+'\n\r'+'请根据这些信息编写具体功能'); 
  if(vIndex==10)
  {
    obj.ImgWidth=new Number(obj.ImgWidth)+100;
	obj.width=obj.ImgWidth;
  }
}
/***根据控件名称得到处理意见显示控件名称,得到控件放置位置**/
function getActorNameByObjName(objName)
{
	var actorId=objName.substr(2);
	return getActorTextObj(actorId);
}
function save(obj)
{
	var ret=false;
	obj.WebSetMsgByName("Version",obj.Version());//保存时校验控件版本	
	ret=obj.SaveSignature();	
	if(ret==false && obj.Status=="ver err")
	{
		ocxObj.alert(v3x.getMessage("V3XOfficeLang.alert_err_OcxVer"));
	}
	return ret;
}
//检查页面中的手写批注控件是否进行了修改
function checkUpdateHw()
{
  var i;
  var objs=document.getElementsByTagName("OBJECT");
  var webUrl=webRoot+"/htmlofficeservlet";
  for(i=0;i<objs.length;i++)
  {
 if(typeof(objs[i].WebUrl)!="undefined" &&  objs[i].WebUrl.indexOf("htmlofficeservlet")>-1)//手写批注控件(判断object对象是不是手写批注控件而不是其他的object对象)
    {
		if(objs[i].Modify)
		{
	  		return true;
		}
    }
  }
  return false;
}
//保存手写控件的数据
function saveHwData()
{
  //查找所有的Ｏｂｊｅｃｔ，坚持是否修改，如果修改，就保存
  var i;
  var objs=document.getElementsByTagName("OBJECT");
  var webUrl=webRoot+"/htmlofficeservlet";
  for(i=0;i<objs.length;i++)
  {
    if(typeof(objs[i].WebUrl)!="undefined" &&  objs[i].WebUrl.indexOf("htmlofficeservlet")>-1)//手写批注控件(根据webUrl判断是否为手写批注控件)
    {
		if(objs[i].Modify)
		{
	  		if(save(objs[i])==false){return false;};
		}
    }
  }
  return true;
}

function unLoadHtmlHandWrite(){
	var handWriteKeys = getUnLoadHtmlHandWriteKeys();
	if(handWriteKeys==""){
		return;
	}
	var requestCaller = new XMLHttpRequestCaller(this, "ajaxHandWriteManager", "deleteUpdateObjs",false);
  	requestCaller.addParameter(1, "String", handWriteKeys);  
  	var ds = requestCaller.serviceRequest();
    return true;	
}

function getUnLoadHtmlHandWriteKeys(){
	  var i;
	  var handWriteKeys="";
	  var objs=document.getElementsByTagName("OBJECT");
	  var webUrl=webRoot+"/htmlofficeservlet";
	  for(i=0;i<objs.length;i++){
	    if(typeof(objs[i].WebUrl)!="undefined" &&  objs[i].WebUrl.indexOf("htmlofficeservlet")>-1){//手写批注控件(判断object对象是不是手写批注控件而不是其他的object对象)
	    	if(handWriteKeys==""){
	    		handWriteKeys = getHtmlHandWriteId(objs[i]);
	    	}else{
	    		handWriteKeys += ","+getHtmlHandWriteId(objs[i]);
	    	}
	    }
	  }
	  return handWriteKeys;	
}
//文单签批回显是用的js对象；

function hwObj(recordId,objName,userName,lastUpdateTime,affairId)
{
	this.recordId=recordId;
	this.objName=objName;
	this.userName=userName;
	this.lastUpdateTime=lastUpdateTime;
	this.affairId=affairId;
}


//停止事件冒泡
function _officeStopPropagation(event) {
    var e = event || window.event;
    if (e.stopPropagation){
        e.stopPropagation();
    }
    e.cancelBubble = true;
}

//停止默认事件
function _officePreventDefault(event) {
    var e = event || window.event;
    if (e.preventDefault){
        e.preventDefault();
    }
    e.returnValue = false;
}

function initHandWrite()
{
	for(var i=0;i<hwObjs.length;i++)
	{	
			//	hwObjs[i].objName:"hwotherOpinion"
			//	hwObjs[i].userName:t2
			//  hwObjs[i].recordId:8138373849786699339
			//	getActorNameByObjName(hwObjs[i].objName):"my:otherOpinion"
		//debugger;
		var affairIdNotNull = hwObjs[i].affairId != null && hwObjs[i].affairId != "";
		var hwAffairEqParentAffair = hwObjs[i].affairId != parent.affair_id;
		var isHasDealDiv = typeof(parent.isHasDealDiv) != "undefined" && !parent.isHasDealDiv;
		if(affairIdNotNull && (hwAffairEqParentAffair || isHasDealDiv)){//可编辑状态
		//if(false){
			hwObj=document.createElement("IMG");
			  var src = webRoot+"/signatPicController.do?method=writeGIF&RECORDID="+hwObjs[i].recordId+"&FIELDNAME="+ encodeURIComponent(hwObjs[i].objName || "")
			  +"&isNewImg=true&affairId="+hwObjs[i].affairId+"&r="+Math.random();
			  hwObj.src =  src;
			  hwObj.onmousedown = function(e){//鼠标事件
                  _officeStopPropagation(e);
                  _officePreventDefault(e);
                  return false;
              };
		      hwObj.oncontextmenu = function(e){//鼠标事件
		          _officeStopPropagation(e);
		          _officePreventDefault(e);
                  return false;
              };
			  var insertObj =  getActorNameByObjName(hwObjs[i].objName);
			  if(typeof insertObj == "string"){
				    if(opinionSpans==null){
				    	initSpans();
				    }
				    inputObj=opinionSpans.get(insertObj,null);
			  }
			  
			  if(inputObj==null){		  
				  alert(v3x.getMessage("V3XOfficeLang.alert_noHandWriteLocation"));
				  return;
			  }
			  try{
				  var divObj=document.getElementById(hwObjs[i].affairId);//获取意见div对象
				  if(divObj){
					  divObj.insertAdjacentElement("beforeBegin",hwObj);
					  divObj.style.height="auto"||"100%";
				  }
			  }catch(e){}
		}else{
			var hwObj=createHandWrite(hwObjs[i].objName,hwObjs[i].userName,hwObjs[i].recordId,getActorNameByObjName(hwObjs[i].objName),true,hwObjs[i].affairId);
			hwObj.lastUpdateTime=hwObjs[i].lastUpdateTime;
			if(loadObjData(hwObj)==false){alert("调入手写批注失败");};
		}
	}
}

/**
 * 通过json数据加载hw对象
 * @param json  htmldocumentsignature对应数据
 *              recordId：moduleId应用id
 *              objName：需要显示签批的控件id
 *              userName：文单签批人
 *              lastUpdateTime：最后一次更新时间
 *              signObj：需要显示签批的控件
 *              enabled: 0不允许签名，1允许签名,默认0
 *  *              
 */
function initHandWriteData(json,options){
  try{
     //控件不可编辑是生成图片
	if(json.enabled == 0){
		  hwObj=document.createElement("IMG");
		  var src = webRoot+"/signatPicController.do?method=writeGIF&RECORDID="+json.recordId+"&FIELDNAME="+encodeURIComponent(json.objName || "")+"&r="+Math.random();
		  hwObj.src =  src;
		  hwObj.removeAttribute("width");
		  hwObj.removeAttribute("height");
		  //控件不可编辑，有印章按钮时设置默认高度和边框,无流程表单设计态的时候时候
		  if(typeof(json.showButton) !="undefined"){
			  hwObj.id =  json.objName;
			  hwObj.height = initImgHeight(json.signObj,"200");
			  hwObj.width  = initImgWidth(json.signObj, "200");
			  hwObj.style.cssText = "border:1px solid #000";
		  }
		  hwObj.onmousedown = function(e){//鼠标事件
              _officeStopPropagation(e);
              _officePreventDefault(e);
              return false;
          };
          hwObj.oncontextmenu = function(e){//鼠标事件
              _officeStopPropagation(e);
              _officePreventDefault(e);
              return false;
          };
          if(v3x.isMSIE){
  			json.signObj.insertAdjacentElement("beforeBegin",hwObj);
  		  }else{
  			 json.signObj.parentNode.insertBefore(hwObj,json.signObj); 
  		  }
		  return hwObj;
	}else{
	    var hwObj = createHandWrite(json.objName,json.userName,json.recordId,json.signObj,false);
	    hwObj.lastUpdateTime = json.lastUpdateTime;
	    if(json.enabled == "1"){
	      hwObj.Enabled = json.enabled;
	    }
	    if(!isAdvanceObj){
	    	hwObj.Enabled = "0";
	    }
	    if(loadObjData(hwObj)==false){alert("调入手写批注失败");};
	    currentUserId = json.currentUserId;
	    attchDelIWebRevision(hwObj,json.userName);
	    return hwObj;
	} 
  }catch(e){
    //alert("没有安装手写签批控件。。。")
    //TODO 有点恶心了，这样主要是防护没有安装的时候报异常
  }
}
//增加删除当前登录人的签批内容按钮
function attchDelIWebRevision(hwObj,userName){
	var affairMemberName=getAffairMemberName();//当前待办所属人
	//分析userList里是否有当前用户被代理的时候，代理人签批的内容，如果有，应该也能被删除
	var userList=hwObj.UserList;
	var indexLength=0;//签名的总个数
	var memuIndex=50;//删除签名按钮的index从50起，预留40个签批按钮显示空间，因为当大于90的，金格都定义成复选菜单了
	if(userList!=""){
		var userArr=userList.split(",");
		indexLength=userArr.length;
		for(var i=0;i<userArr.length;i++){
			var signInfo=userArr[i];
			if(signInfo!=""){
				var isAddDel=false;
				if(signInfo.lastIndexOf("(代理")!=-1){//代理人处理的
					var signTemp=signInfo.substring(signInfo.lastIndexOf("(代理")+3);//分两次切割字符串，是为了避免 人名中带括号的情况 比如：张三(开发部)
					var signName=signTemp.substring(0,signTemp.lastIndexOf(")"));
					if(signName==affairMemberName){//被代理人的name等于待办所属人的name
						isAddDel=true;//增加 代理人签批删除按钮
					}
				}else if(signInfo==affairMemberName){
					isAddDel=true;//增加 代理人签批删除按钮
				}else if(signInfo==userName&&userName==affairMemberName){//代理人处理代理的待办的时候，不能删除自己的待办增加的签批
					isAddDel=true;//增加 代理人签批删除按钮
				}
				if(isAddDel&&(hwObj.Enabled || hwObj.Enabled =='1')){//浏览状态不显示删除按钮
					hwObj.AppendMenu(memuIndex+i,"删除["+signInfo+"]签批");//增加 签批删除按钮
				}
			}
		}
	}
	if(v3x.isMSIE){
		//绑定点击监听事件
		hwObj.attachEvent("OnMenuClick", function(vIndex,vCaption){
			onMenuClickFunction(hwObj,indexLength,memuIndex,vIndex,vCaption);
		});
	}else{
		this["OnMenuClick"+hwObj.name]=function(vIndex,vCaption){
			onMenuClickFunction(hwObj,indexLength,memuIndex,vIndex,vCaption);
		}
	}
}

/**
 * 右键菜单监听事件
 * @param hwObj 当前控件
 * @param indexLength：签名的总个数
 * @param vIndex：按钮编号
 * @param vCaption：按钮显示内容
 */
function onMenuClickFunction(hwObj,indexLength,memuIndex,vIndex,vCaption){
	if (vIndex>=50&&vIndex<(memuIndex+indexLength)){//删除待办所属人的 签批
		var delUserName="";
		if(vCaption!=""){
			delUserName=vCaption.substring(3,vCaption.indexOf("]签批"));
		}
		hwObj.DeleteUserSignature(delUserName);
		hwObj.Modify=true;
		hwObj.checkUpdate=false;
	}
	if(vIndex==-2 && !v3x.isMSIE){
		hwObj.WebSetMsgByName("currentUserId",currentUserId);
	}
	
}
//多浏览器下签批点击确定回调函数
function OnWindowResize(Width, Height){
		try{
			var hwObj=document.getElementById(currentHwObjId);
			hwObj.height =Height;
			hwObj.width =Width;
			hwObj.imgHeight =Height;
			hwObj.imgWidth =Width;
			//chrome下隐藏后再显示，style中会设置高度。导致签章未自动撑开，重新设置下签章style的高度
			if(!v3x.isMSIE){
				hwObj.style.height = Height+"px";
			}
		}catch(e){}
	//网页签批点击确定后调用的回调函数
	if(typeof(hwOkClickCallBack) != "undefined"){
		hwOkClickCallBack();
	}

}

function detectZoom (){ 
	  var ratio = 0,
	    screen = window.screen,
	    ua = navigator.userAgent.toLowerCase();
	 
	   if (window.devicePixelRatio !== undefined) {
	      ratio = window.devicePixelRatio;
	  }
	  else if (~ua.indexOf('msie')) {  
	    if (screen.deviceXDPI && screen.logicalXDPI) {
	      ratio = screen.deviceXDPI / screen.logicalXDPI;
	    }
	  }
	  else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
	    ratio = window.outerWidth / window.innerWidth;
	  }
	   
	   if (ratio){
	    ratio = Math.round(ratio * 100);
	  }
	   
	   return ratio;
}
