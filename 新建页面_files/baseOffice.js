window.baseOffice=null;
var ___iwebPlgin = "致远软件[专用];FSzlGZqS0ZU0vFTcG/ULsG3mP3leFSzlSGOFLSlBaidmB3tDwLgZwLoZwLVZwLSZwLeZwigZwiomlQgDORWZdASmlSwDORWZdASmlL=DORWZdASmSC3DORWZdASmLlVDORWZdASmVlwDORWZdASmBC3DORWZdASmOCwDziZ6";

/**
*获取BaseOffice对象
*params中initOfficeSucessCallback为正常加载控件和正文的回调函数
*	    initOfficeFailCallback  为控件和正文未正常加载的回调函数
*/

function initBaseOffice(params){
	
	if(typeof(params.isLoadOfficeImmediate) == "undefined" || params.isLoadOfficeImmediate==null){
		  params.isLoadOfficeImmediate = true;
	}  
	if(typeof(params.handWriteCurrentUserId) == "undefined" || params.handWriteCurrentUserId==null){
		  params.handWriteCurrentUserId = params.userId;
	}
	if(typeof(params.canEditContent) == 'undefined' || params.canEditContent == null){
		params.canEditContent=getCanEditContent();
	}
	if(typeof(params.currentUserName) == 'undefined' || params.currentUserName == null){
			params.currentUserName=getCurrentUserName();
	}
	this.baseOffice = new BaseOffice(params);
	document.getElementById("officeFrameDiv").style.display = "block";
	if(v3x.isMSIE9 && document.getElementById("editerDiv")){
		document.getElementById("editerDiv").style.height ="76%";		
	}
	var v = new Date().getTime();
	officeEditorFrame.location.href = params.webRoot+"/common/office/office.html?v="+v;
	window.setTimeout(function(){
		lazyLoad();
	}, 1000);
	
}

function getMarksInfo(formData,str,taoHongCallBack){
	taoHongCallBack(formData,str);
}

function lazyLoad(){
	if(!officeEditorFrame || officeEditorFrame.document.readyState != 'complete' || typeof(officeEditorFrame.getOfficeObj)=='undefined' ){
		window.setTimeout("lazyLoad()", 1000);
	}else{
		this.baseOffice.officeObj = officeEditorFrame.getOfficeObj(this.baseOffice.params);//new HandWrite(param);
		loadOffice();//调用页面使用
	}
}

/**
*加载office
*/
function loadOffice(){
	this.baseOffice.loadOffice();
	
}

/**
*保存office
*/
function saveOffice(stdOffice){
	var flag = this.baseOffice.saveOffice(stdOffice);
	return flag;
}
/**
*office正文套红
*/
function officetaohong(dataForm,templateUrl,templateType,dataList){
	this.baseOffice.officetaohong(dataForm,templateUrl,templateType,dataList);
}
/**
 * 文单套红
 */
function taohongForm(dataForm,templateUrl,templateType,dataList){
  this.baseOffice.taohongForm(dataForm,templateUrl,templateType,dataList);  
}

/**
*word转pdf
*/
function transformWordToPdf(newPdfIdFirst){
	return this.baseOffice.transformWordToPdf(newPdfIdFirst);
}
/**
*office 签章
*/
function WebOpenSignature(){
	this.baseOffice.WebOpenSignature();
}
/**
*全屏
*/
function fullSize(){
	this.baseOffice.fullSize();
}

/**
 * 修改正文
 */
function modifyContent(hasSign,canWrite){
	return this.baseOffice.modifyContent(hasSign,canWrite);
}
function taoHong4Form(taoHongCallBack){
	this.baseOffice.taoHong4Form(taoHongCallBack);
}

function taoHongHt(formdata){
	this.baseOffice.taoHongHt(formdata);
}
/**
 * 修改office正文状态
 */
function updateOfficeState(state){
       return this.baseOffice.updateOfficeState(state);
}


function isHandWriteRef(){
	return this.baseOffice.isHandWriteRef();
}

/**
 * 判断是否装载正文完成
 */
function hasLoadOfficeFrameComplete(){ 
    return this.baseOffice.hasLoadOfficeFrameComplete();
}

/**
 * 获取书签数量
 */
function getBookmarksCount(){
	return this.baseOffice.getBookmarksCount();
}
/**
 * 激活office控件
 */
function activeOfficeOcx(){
	return this.baseOffice.activeOcx();
}
/**
 * 删除书签
 */
function delBookMarks(){
	return this.baseOffice.delBookMarks();
}
/**
 * 刷新office
 */
function refreshOfficeLable(sendForm){
	this.baseOffice.refreshOfficeLable(sendForm);
}
/**
 * 是否读取office正文
 */
function isLoadOffice(){
	return this.baseOffice.isLoadOffice();
}
/**
 * 读取office正文是否成功
 */
function loadOfficeSuccess(){
	return this.baseOffice.loadOfficeSuccess();
}
/**
 * 检查控件状态，如果没有调入文件，调入
 */
function checkOpenState(){
	this.baseOffice.checkOpenState();
}
/**
 * 设置office正文Id
 */
function setOfficeOcxRecordID(recordId){
	this.baseOffice.setOfficeOcxRecordID(recordId);
}
/**
 * 获取office正文id
 */
function getOfficeOcxRecordID(){
	return this.baseOffice.getOfficeOcxRecordID();
}
/**
 * 正文是否被修改
 */
function contentIsModify(){
	return this.baseOffice.contentIsModify();
}
/**
 * 正文是否存在签章
 */
function getSignatureCount(){
	return this.baseOffice.getSignatureCount();
}
function getOfficeOcxCurVerRecordID(){
	return this.baseOffice.getOfficeOcxCurVerRecordID();
}
function setSubjectValue(){
	//有标题的时候直接取
	var subjectObj=document.getElementById("subject");
	//协同正文多引入了一个iframe导致层级变了，增加一个parent
	if(subjectObj==null){
		subjectObj=parent.parent.document.getElementById("subject");
	}
	
	if(subjectObj==null){
		subjectObj=parent.document.getElementById("subject");
	}
	//公文模板去模板的标题
	if(subjectObj==null){
		subjectObj=document.getElementsByName("templatename")[0];
	}
	if(subjectObj==null){
		subjectObj=parent.document.getElementsByName("templatename")[0];
	}
	//公文取文单上的标题
	if(subjectObj==null){
		subjectObj=document.getElementById("my:subject");
	}
	if(subjectObj==null){
		subjectObj=parent.document.getElementById("my:subject");
	}
	if(subjectObj!=null && subjectObj.value!=""){
		return subjectObj.value;
	}else{
		return "";
	}
	
}
function setEditType(editType){
	this.baseOffice.setEditType(editType);
}
/**
 * 获取office控件状态
 */
function getOcxState(){
	return this.baseOffice.getOcxState();
}


/**
 * 打印正文
 */
function officePrint(){
		this.baseOffice.officePrint();
}

//删除office正文中的痕迹,并且保存office正文
function removeTrail(){
  return this.baseOffice.removeTrail();
}
/**
 * 是否有专业签章
 */
function HasSpecialSignature(){
	return this.baseOffice.HasSpecialSignature();
}
/**
 * 获取当前office文件大小
 */
function getFileSize(){
	return this.baseOffice.getFileSize();
}
/**
 * 删除office
 */
function removeOfficeDiv(isRevertContent){
	document.getElementById("officeFrameDiv").style.display = "none";
	/*
	 * 还原正文内容
	 */
	if(isRevertContent){
//		var contentObj = document.getElementById("content");
//		if(contentObj){	
//			contentObj.value = originContent;
//		}
	}
}


function BaseOffice(params){
	this.params = params;
	this.officeObj;//控件对象
	if(v3x.currentLanguage)
		this.params.currentLanguage=v3x.currentLanguage;
}

function setAffairMemberId(affairMemberId){
	  this.baseOffice.setAffairMemberId(affairMemberId);
}

function setAffairMemberName(affairMemberName){
	this.baseOffice.setAffairMemberName(affairMemberName);
}

function setFileId(fileId){
	this.baseOffice.setFileId(fileId);
}
function setFormDataId(formDataId){
	this.baseOffice.setFormDataId(formDataId);
}
function setOriginalFileId(originalFileId){
	this.baseOffice.setOriginalFileId(originalFileId);
}
function setOriginalCreateDate(originalCreateDate){
	this.baseOffice.setOriginalCreateDate(originalCreateDate);
}
function setCreateDate(createDate){
	this.baseOffice.setCreateDate(createDate);
}

function setOfficecanSaveLocal(officecanSaveLocal){
	this.baseOffice.setOfficecanSaveLocal(officecanSaveLocal);
}
function setOfficecanPrint(officecanPrint){
	this.baseOffice.setOfficecanPrint(officecanPrint);
}
function getContentUpdate(){
	return this.baseOffice.getContentUpdate();
}
function getCanEditContent(){
	try{
		if(typeof(getCanEdit)!=="undefined"){
			return getCanEdit();
		}
		return parent.getCanEdit();
	}catch(e){
	}
	return false;
}

//判断是否盖章
function getIsSignOperation(createDate){
	return this.baseOffice.getIsSignOperation();
}

/**
*加载office
*/
BaseOffice.prototype.loadOffice=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.loadOffice();
}
//删除office正文中的痕迹,并且保存office正文
BaseOffice.prototype.removeTrail=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
  return this.officeObj.removeTrail();
}
//拟文的时候：删除office正文中的痕迹,并且保存office正文
BaseOffice.prototype.removeTrailAndSaveWhenDraft=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
  return this.officeObj.removeTrailAndSaveWhenDraft();
}
//新建公文模板时候：删除office正文中的痕迹,并且保存office正文
BaseOffice.prototype.removeTrailAndSaveWhenTemplate=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
  return this.officeObj.removeTrailAndSaveWhenTemplate();
}

/**
*保存office
*/
BaseOffice.prototype.saveOffice = function(stdOffice){
	// this.officeObj.saveOffice();

//	var bodyType = document.getElementById("bodyType");
//	if(bodyType){
//	bodyType = bodyType.value;
//		if(bodyType != 'OfficeWord' && bodyType != 'OfficeExcel' && bodyType != 'WpsWord' && bodyType != 'WpsExcel'){
//		  return true;
//		}
//	}
	
//	try{
//	  document.getElementById("content").value = this.officeObj.params.fileId;
//	}catch(e){}
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	var flag = this.officeObj.saveOffice(stdOffice);
	
	return flag;
}
/**
*office正文套红
*/
BaseOffice.prototype.officetaohong = function(dataForm,templateUrl,templateType,dataList){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.taohong(dataForm,templateUrl,templateType,dataList);
}
/**
 * 文单套红
 */
BaseOffice.prototype.taohongForm=function(dataForm,templateUrl,templateType,dataList){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
  this.officeObj.taohongForm(dataForm,templateUrl,templateType,dataList);  
}
/**
 * 签章
 */
//BaseOffice.prototype.sign = function(){
//	this.officeObj.sign();
//}

/**
*word转pdf
*/
BaseOffice.prototype.transformWordToPdf = function(newPdfIdFirst){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.transformWordToPdf(newPdfIdFirst);
}
/**
*office 签章
*/
BaseOffice.prototype.WebOpenSignature = function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.WebOpenSignature();
}
/**
*全屏
*/
BaseOffice.prototype.fullSize = function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.FullSize();
}

/**
 * 修改正文
 */
BaseOffice.prototype.modifyContent=function(hasSign,canWrite){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.ModifyContent(hasSign,canWrite);
}
/**
 * 修改office正文状态
 */
BaseOffice.prototype.updateOfficeState=function(state){
   try{
        return this.officeObj.updateOfficeState(state);
   }catch(e){}
}


BaseOffice.prototype.isHandWriteRef = function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.isHandWriteRef();
}

/**
 * 判断是否装载正文完成
 */
BaseOffice.prototype.hasLoadOfficeFrameComplete=function(){ 
    if(!this.officeObj){
        return false;
    }else{
        return true;
    }
}

/**
 * 获取书签数量
 */
BaseOffice.prototype.getBookmarksCount=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.getBookmarksCount();
}
/**
 * 激活office控件
 */
BaseOffice.prototype.activeOfficeOcx=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.activeOcx();
}
/**
 * 删除书签
 */
BaseOffice.prototype.delBookMarks=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.delBookMarks();
}
/**
 * 刷新office
 */
BaseOffice.prototype.refreshOfficeLable=function(sendForm){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.refreshOfficeLable(sendForm);
}
/**
 * 是否读取office正文
 */
BaseOffice.prototype.isLoadOffice=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.isLoadOffice();
}
/**
 * 是否读取office正文是否成功
 */
BaseOffice.prototype.loadOfficeSuccess=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.isLoadOfficeSuccess();
}
/**
 * 检查控件状态，如果没有调入文件，调入
 */
BaseOffice.prototype.checkOpenState=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.checkOpenState();
}
/**
 * 设置office正文Id
 */
BaseOffice.prototype.setOfficeOcxRecordID=function(recordId){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setOfficeOcxRecordID(recordId);
	try{
		fileId=recordId;
	}catch(e){}
}
/**
 * 获取office正文id
 */
BaseOffice.prototype.getOfficeOcxRecordID=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.getOfficeOcxRecordID();
}
/**
 * 正文是否被修改
 */
BaseOffice.prototype.contentIsModify=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.contentIsModify();
}
/**
 * 正文是否存在签章
 */
BaseOffice.prototype.getSignatureCount=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.getSignatureCount();
}
BaseOffice.prototype.getOfficeOcxCurVerRecordID=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.getOfficeOcxCurVerRecordID();
}
BaseOffice.prototype.setSubjectValue = function(subjectValue){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setSubjectValue(subjectValue);
}
BaseOffice.prototype.setEditType = function(editType){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setEditType(editType);
}
BaseOffice.prototype.setOfficecanSaveLocal=function(officecanSaveLocal){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setOfficecanSaveLocal(officecanSaveLocal);
}
BaseOffice.prototype.setOfficecanPrint=function(officecanPrint){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setOfficecanPrint(officecanPrint);
}

BaseOffice.prototype.getContentUpdate = function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	return this.officeObj.getContentUpdate();
}

/**
 * 获取office控件状态
 */
BaseOffice.prototype.getOcxState=function(){
	if(typeof(this.officeObj)!="undefined" && this.officeObj !=null){
		return this.officeObj.getOcxState();
	}else{
		return "";
	}
}


/**
 * 打印正文
 */
BaseOffice.prototype.officePrint=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	//开启office转换后officeFrameDiv使用display=none隐藏，在多浏览器下不能加载控件，使用以下方式进行进行隐藏
		if(typeof(trans2Html)!='undefined' && trans2Html==true){
			document.getElementById("officeFrameDiv").setAttribute("style","width:0px;height:0px;overflow:hidden; position: absolute;");
		}
		this.officeObj.officePrint();
}
/**
 * 是否有专业签章
 */
BaseOffice.prototype.HasSpecialSignature=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}	
	return this.officeObj.HasSpecialSignature();
}

//判断是否盖章
BaseOffice.prototype.getIsSignOperation = function(createDate){
	if(!hasLoadOfficeFrameComplete()){
		return false;
	}
	return this.officeObj.getIsSignOperation();
}

BaseOffice.prototype.taoHong4Form=function(taoHongCllBack){
	
	this.officeObj.taoHong4Form(taoHongCllBack);
}

BaseOffice.prototype.taoHongHt=function(formdata){
	
	this.officeObj.taoHongHt(formdata);
}

BaseOffice.prototype.setCanEdit=function(canEdit){
	  editTypeList.canEdit = canEdit;
	  editTypeList.canCopy = 1;
}

BaseOffice.prototype.setCanCopy=function(canCopy){
	  editTypeList.canCopy = canCopy;
}
BaseOffice.prototype.setHasTrail=function(hasTrail){
	  editTypeList.hasTrail = hasTrail;
}

BaseOffice.prototype.transAttribute=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.transAttribute(editTypeList);
}
BaseOffice.prototype.getFileSize=function(){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.getFileSize();
}
BaseOffice.prototype.setAffairMemberId = function(affairMemberId){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	  this.officeObj.affairMemberId=affairMemberId;
}
BaseOffice.prototype.setAffairMemberName = function(affairMemberName){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.affairMemberName=affairMemberName;
}
BaseOffice.prototype.setFileId = function(fileId){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setFileId(fileId);
}
BaseOffice.prototype.setFormDataId = function(formDataId){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setFormDataId(formDataId);
}

BaseOffice.prototype.setOriginalFileId = function(originalFileId){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setOriginalFileId(originalFileId);
}
BaseOffice.prototype.setOriginalCreateDate = function(originalCreateDate){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setOriginalCreateDate(originalCreateDate);
}
BaseOffice.prototype.setCreateDate = function(createDate){
	if(!hasLoadOfficeFrameComplete()){
		return;
	}
	this.officeObj.setCreateDate(createDate);
}
/**
 * 获取国际化信息
 * @param keys
 * @returns {String}
 */
function getOfficeLanguage(keys)
{
	var jsCode="";
	var argv="";
	var i;
	var str="";	
	if(typeof(arguments)!="undefined" && arguments.length>1 && arguments[1].length>1)
	{
		for(i=1;i<arguments[1].length;i++)
		{
			argv+=",";
			argv+="\""+arguments[1][i]+"\"";
		}
	}
	var items=keys.split(",");
	for(i=0;i<items.length;i++)
	{	
		jsCode="v3x.getMessage(\"V3XOfficeLang."+items[i]+"\"";
		if(argv!="")
		{
			jsCode+=argv;			
		}
		jsCode+=")";				
		str+=eval(jsCode);
		if(i<items.length-1){str+=",";}
	}
	return str;
}
/**
 * 判断是否为IE
 * @returns {Boolean}
 */
function isIE(){
	if(v3x.isMSIE){
		return true;
	}else{
		return false;
	}
}
/**
 * 
 * 判断是否是excel
 * @param type
 * @returns {Boolean}
 */
function isExcelFileType (type){
	if(type == "xls" || type == "xlsx" || type == ".xls" || type == ".xlsx"){
		return true;
	}else{
		return false;
	}
}
/**
 * 判断是否是word
 * @param type
 * @returns {Boolean}
 */
function isWordFileType (type){
	if(type == "doc" || type == "docx" || type == ".doc" || type == ".docx"){
		return true;
	}else{
		return false;
	}
}

/**
 * 读取文件名称,默认跟id一致
 */
function getOcxFileName(_fileId){
	var cObj=document.getElementById("contentNameId");
	if(cObj!=null && cObj.value!="" && cObj.value!="null" && cObj.value!=null){
		return cObj.value;
	}
	else{
		return _fileId;
	}
}

function getCurrentUserName(){
	var _currUserName = "";
	
	if(typeof(getA8Top)=="function" 
		&& typeof(getA8Top().$)!='undefined'
		&& typeof(getA8Top().$.ctx)!='undefined'
	    && typeof(getA8Top().$.ctx.CurrentUser)!='undefined'){
		
		_currUserName = getA8Top().$.ctx.CurrentUser.name;
		
	}else if(typeof(getCtpTop)=="function" 
		&& typeof(getCtpTop().$)!='undefined' 
		&& typeof(getCtpTop().$.ctx)!='undefined' 
	    && typeof(getA8Top().$.ctx.CurrentUser)!='undefined'){
		
		_currUserName = getCtpTop().$.ctx.CurrentUser.name;
		
	}else if(typeof(currUserName)!="undefined"){
		_currUserName =  currUserName;
	}else if(typeof(currentUserName)!="undefined"){
		_currUserName= currentUserName;
	}
	return _currUserName;
}
