var snMessage = "";
// 回调函数，页面加载完毕以后调用
function init() {
}

loadedCallBack();

function loadedCallBack(){
	try {
		if(parent.contentLoadCallBack){
			parent.contentLoadCallBack();
		}else if(parent.parent.parent.contentLoadCallBack){
			parent.parent.contentLoadCallBack();
		}
	} catch (e) {
	}
}
// 保存或修改成模板参数设置
function setTemplateParam(moduleId, title) {
	if (title == null || title == "") {
		$.alert("未传入正确的参数title");
		return;
	}
	if (moduleId == null || moduleId == "") {
		$.alert("未传入正确的参数moduleId");
		return;
	}
	var contentDiv = getMainBodyDataDiv$();
	$("#moduleId", contentDiv).val(moduleId);
	$("#moduleTemplateId", contentDiv).val(-1);
	$("#title", contentDiv).val(title);
}

// 设置协同ID
function setContentModuleId(moduleId) {
    if (moduleId == null || moduleId == "") {
        $.alert("未传入正确的参数moduleId");
        return;
    }
    var contentDiv = getMainBodyDataDiv$();
    $("#moduleId", contentDiv).val(moduleId);
}
// 保存或修改模板(带数据库保存)
function saveTemplate(moduleId, title, successCallBack, failedCallBack) {
	setTemplateParam(moduleId, title);
	saveOrUpdate({
		"mainbodyDomains" : null,
		"needSubmit" : true,
		"success" : successCallBack,
		"failed" : failedCallBack
	});
}
// 万能方法，推荐使用,各种新建修改场景均能使用
// 对外接口，保存正文,不修改模块类型,指定moduleId,外面应用功能已经申请了自己的UUID，使用这个方法后，不用在保存完成后更新正文组件表的关系
function setSaveContentParam(moduleId, title,_templateId) {
	if (title == null || title == "") {
		$.alert("未传入正确的参数title");
		return;
	}
	if (moduleId == null || moduleId == "") {
		$.alert("未传入正确的参数moduleId");
		return;
	}
	var contentDiv = getMainBodyDataDiv$();
	var moduleTemplateId = $("#moduleTemplateId", contentDiv).val();
	if (moduleTemplateId == "-1") {// 调用模板新建
		if(_templateId){
			$("#moduleTemplateId", contentDiv).val(_templateId);	
		}else{
			$("#moduleTemplateId", contentDiv).val($("#id", contentDiv).val());
		}
		$("#id", contentDiv).val(-1);
		$("#createId", contentDiv).val(0);
	} else if (moduleTemplateId == "0") {// 没有调用模板的业务数据新建或者修改
		// $("#id",contentDiv).val(-1);
	} else {// 调用模板后发起的业务数据修改
	}
	$("#moduleId", contentDiv).val(moduleId);
	$("#title", contentDiv).val(title);
}
// 正文保存方法（带数据库保存）
function saveContent(moduleId, title, successCallBack, failedCallBack,errorAlert) {
	setSaveContentParam(moduleId, title);
	saveOrUpdate({
		"mainbodyDomains" : null,
		"needSubmit" : true,
		"success" : successCallBack,
		"failed" : failedCallBack,
		"errorAlert" : errorAlert==null?true:errorAlert
	});
}
// 另存为同类型的新业务数据
function setSaveAsContentParam(title) {
	if (title == null || title == "") {
		$.alert("未传入正确的参数title");
		return;
	}
	var contentDiv = getMainBodyDataDiv$();
	$("#id", contentDiv).val(-1);
	$("#moduleId", contentDiv).val(-1);
	$("#title", contentDiv).val(title);
}
// 另存为同类型的新业务数据(带数据库保存)
function saveAsContent(title, successCallBack, failedCallBack) {
	setSaveAsContentParam(title);
	saveOrUpdate({
		"mainbodyDomains" : null,
		"needSubmit" : true,
		"success" : successCallBack,
		"failed" : failedCallBack
	});
}
// 数据预提交，不入库，会更新缓存对象
function preSubmitData(callBack, failedCallback, checkNull,needCheckRule) {
	if ($("#contentType", getMainBodyDataDiv$()).val() == "20") {// 表单才预提交
		saveOrUpdate({
			"mainbodyDomains" : null,
			"success" : callBack,
			"failed" : failedCallback,
			"needSubmit" : true,
			"saveDB" : false,
			"checkNull" : checkNull,
			"needCheckRule":needCheckRule,
			"needCheckRepeatData":false
		});
	} else {
		if (typeof callBack == 'function') {
			callBack();
		}
	}
}
// 正文相关的错误，如果处于错误状态， 提交代码将提示 1正文未加载完毕，2 表单执行了循环嵌套计算
var _contentError=1;
function content_hasContentError(){return _contentError==0;}// 判断正文是否有错误，如果有不允许提交
function content_loadComplete(){_contentError=0;}// 正文加载完成
function content_isComplete(){return _contentError==0;}// 正文是否加载完成
// 新建或者更新正文,内部方法，不允许调用，调用后果自负
function saveOrUpdate(mainbodyArgs) {
	if(_contentError==2){
		$.alert("当前表单计算公式存在循环嵌套，不允许提交，请于管理员联系!");
		return;
	}
	var contentDiv = getMainBodyDataDiv$();// 当前选项卡的DIV,多正文时区分当前正文
	var mainbody_callBack_success = mainbodyArgs.success; // 执行成功后的回调函数
	var mainbody_callBack_failed = mainbodyArgs.failed;// 执行失败后的回调函数
	var mainbodyDomains = mainbodyArgs.mainbodyDomains;// 传入的正文数据
	var needSubmit = mainbodyArgs.needSubmit == null ? true: mainbodyArgs.needSubmit;// 是否需要提交数据(有些业务模块正文不单独提交，随着业务整体入库)
	var saveDB = mainbodyArgs.saveDB == null ? true : mainbodyArgs.saveDB;// 提交后是否要保存数据到数据库
	var checkNull = mainbodyArgs.checkNull == null ? true: mainbodyArgs.checkNull;// 是否需要校验必填
	var needCheckRule = mainbodyArgs.needCheckRule==null?true:mainbodyArgs.needCheckRule;// 是否需要校验表单业务规则
	//var isCheckRepeatData = $.trim(mainbodyArgs.needCheckRepeatData) == ""?true:mainbodyArgs.needCheckRepeatData;// 是否校验重复表存在重复数据
	var isCheckRepeatData = false;//重复表向同行不校验
	var notSaveOffice = mainbodyArgs.notSaveOffice;
	var optType = mainbodyArgs.optType;
	if ($("#viewState", contentDiv).val() != "1") {
		mainbody_callBack_success();
		return;
	}// 不是可编辑状态直接返回

	var contentData = [];// 正文数据
	if (mainbodyDomains) {// 如果传入了正文数据，就使用传入的
		contentData = mainbodyDomains;
	}
	contentData.push("_currentDiv");
	contentData.push(getMainBodyDataDiv());
	var contentType = $("#contentType", contentDiv).val();// 正文类型
	if (contentType == 10) {// HTML正文
		var val = $.content.getContent();
		$("#content", contentDiv).val(val);
	} else if (contentType == 20) {// 表单正文
		var validateOpt = new Object();// 表单验证参数
		validateOpt['errorAlert'] = mainbodyArgs.errorAlert==null?true:mainbodyArgs.errorAlert;
		validateOpt['errorBg'] = true;
		validateOpt['errorIcon'] = false;
		validateOpt['validateHidden'] = true;
		validateOpt['checkNull'] = checkNull;
		if (!getMainBodyHTMLDiv$().validate(validateOpt)) {// 验证失败调用 ，执行失败的回调函数
			mainbody_callBack_failed("data check failed!");
			return;
		}else if(isCheckRepeatData && isLegalDataOfRepeatingTable(getMainBodyHTMLDiv$())){
			// 判断重复表中是否存在相同的数据行
	    	var confirm = $.confirm({
	    	    'msg': $.i18n('form.repeatdata.same.error.label'),
	    	    ok_fn: function () { 
	    	    	// 验证通过，组装表单数据到正文数据中
	    			if (checkNull && !checkHW(getMainBodyHTMLDiv$())) {
	    				mainbody_callBack_failed("data check failed!");
	    				return;
	    			}
	    			for ( var i = 0; i < form.tableList.length; i++) {
	    				var tempTable = $("#" + form.tableList[i].tableName);
	    				if (tempTable.length > 0) {
	    					contentData.push(form.tableList[i].tableName);
	    				}
	    			}

	    			if (needSubmit) {// 是否需要提交数据
	    				submitContentData(saveDB,needCheckRule,contentData, mainbody_callBack_success,
	    						mainbody_callBack_failed,false,optType);
	    			} else {// 不保存数据库
	    				mainbody_callBack_success(contentData);
	    			}
	    	    },
	    		cancel_fn:function(){
	    			// 调用错误回调函数，关闭进度条
	    			if(mainbody_callBack_failed != undefined){
	    				mainbody_callBack_failed("data check failed!");
	    			}
	    			confirm.close();
	    		},
	    		close_fn:function(){
	    			// 调用错误回调函数，关闭进度条
	    			if(mainbody_callBack_failed != undefined){
	    				mainbody_callBack_failed("data check failed!");
	    			}
	    			confirm.close();
	    		}
	    	});
		}else {
			// 验证通过，组装表单数据到正文数据中
			if (checkNull && !checkHW(getMainBodyHTMLDiv$())) {
				mainbody_callBack_failed("data check failed!");
				return;
			}
			for ( var i = 0; i < form.tableList.length; i++) {
				var tempTable = $("#" + form.tableList[i].tableName);
				if (tempTable.length > 0) {
					contentData.push(form.tableList[i].tableName);
				}
			}
			
			if (needSubmit) {// 是否需要提交数据
				submitContentData(saveDB,needCheckRule,contentData, mainbody_callBack_success,
						mainbody_callBack_failed,false,optType);
			} else {// 不保存数据库
				mainbody_callBack_success(contentData);
			}
		}
		
	} else if (contentType > 40 && contentType < 50) {// OFFICE正文
		if(!notSaveOffice){
			if (contentType == 45) {
				if (!savePdf()) { // 保存pdf文件
					if (typeof (mainbody_callBack_failed) == "function") {
						mainbody_callBack_failed("saveOffice failed!");
					}
					return;
				}
			} else if (!saveOffice()) {// 保存OFFICE文件 chenxd
				if (typeof (mainbody_callBack_failed) == "function") {
					mainbody_callBack_failed("saveOffice failed!");
				}
				return;
			}
		}
	} 
	// 表单的单独在上面逻辑中处理，因为考虑到confirm组件是异步的，所以把这点逻辑提到表单逻辑分支里
	if(contentType != 20){
		if (needSubmit) {// 是否需要提交数据
			submitContentData(saveDB,needCheckRule,contentData, mainbody_callBack_success,
					mainbody_callBack_failed,false,optType);
		} else {// 不保存数据库
			mainbody_callBack_success(contentData);
		}
	}
	
}
var calBackTag = false;
// 提交正文数据
function submitContentData(saveDB, needCheckRule, contentData, mainbody_callBack_success,
		mainbody_callBack_failed,onlyGenerateSn,optType) {
	if(calBackTag){// 预提交
		needCheckRule = false;
	}
	if(typeof onlyGenerateSn == undefined){
		onlyGenerateSn = false;
	}
	if (contentData == null) {
		$.alert("contentData传入为空!");
		return;
	}
	// if(typeof(mainbody_callBack_success)!="function"){$.alert("成功时回调函数为空!");return;}
	// 提交数据
	var url = _ctxPath+'/content/content.do?method=saveOrUpdate&onlyGenerateSn='+onlyGenerateSn+(saveDB==true?"":"&notSaveDB=true")+(needCheckRule==true?"":"&needCheckRule=false") + "&optType="+optType;
	$("body")
			.jsonSubmit(
					{
						action : url,
						domains : contentData,
						debug : false,
						ajax:true,
						validate : false,
						isMask:false,
						callback : function(jsonObj) {
							try {
								var returnObj = $.parseJSON(jsonObj);
								if (returnObj.success == "true") {// 返回值证明是操作成功
                                    if ((saveDB==true) && (typeof(saveHwData) == "function") && !saveHwData()) {// 保存签章单元格
                                        if (typeof (mainbody_callBack_failed) == "function") {
                                            mainbody_callBack_failed("saveHwData failed!");
                                        }
                                        return;
                                    }
                                    var snMsg = "";
									if (returnObj.sn != null) {// 如果产生了流水号需要给出提示
										var snObj = returnObj.sn;
										for ( var snField in snObj) {
											snMsg += $.i18n('form.flow.generate.seriesnumber.tip.label', snField, snObj[snField]) + "\n";
										}
									}
									if(snMsg!=""){
										snMessage = snMsg;
									}
									if (typeof (mainbody_callBack_success) == "function") {
										mainbody_callBack_success(returnObj.contentAll,snMsg);
									}else{
										if(snMsg!=""){
											alert(snMsg);
										}
									}
								} else { // 返回值证明操作失败，解析错误信息
									var errorMessage = "";
									try {
										errorMessage = $
												.parseJSON(returnObj.errorMsg);
										if (errorMessage.ruleError) {
											if(errorMessage.forceCheck==1){// 强制
												$.alert({"msg":errorMessage.ruleError,"width":530,"height":300});
											}else{// 非强制
												var random = $.messageBox({
												    'type': 100,
													'imgType':2,
													'width':530,
													'height':405,
												    'msg': errorMessage.ruleError,
												    buttons: [{
												    id:'goon',
												        text: $.i18n("common.content.goon"),
												        handler: function () {
												        	calBackTag = true;
															if(errorMessage.formType == "unflow"){
																window.parent.tips = false;// 修改无流程提交页面提示是否关闭窗口的标识。
															}
												        	submitContentData(saveDB, false, contentData, mainbody_callBack_success,mainbody_callBack_failed,true,optType);
												        	random.close();
												        }
												    }, {
												    id:'cancel',
												        text: $.i18n("common.button.cancel.label"),
												        handler: function () {
												        	random.close();
												        }
												    }]
												});
											}
											var fields = errorMessage.fields;
											for ( var i = 0; i < fields.length; i++) {
												changeValidateColor(fields[i]);
											}
										}
									} catch (e) {
										errorMessage = returnObj.errorMsg;
										$.alert(errorMessage);
									}
									if (typeof (mainbody_callBack_failed) == "function") {
										mainbody_callBack_failed(errorMessage);
									}
								}
							} catch (e) {
								$.alert("content submit error:" + e);
								if (typeof (mainbody_callBack_failed) == "function") {
									mainbody_callBack_failed("error:" + e);
								}
							}
						}
					});
}

/**
 * 设置content的值
 */
function setContent(contentHtmlStr) {
	var contentDiv = getMainBodyDataDiv$();
	$("#content", contentDiv).val(contentHtmlStr);
	$("#fckedit").setEditorContent(contentHtmlStr);
}

// 返回正文组件数据的DOMAIN
function getMainBodyDataDiv() {
	var mainBodyDataDiv = "mainbodyDataDiv_" + $("#_currentDiv").val();
	return mainBodyDataDiv;
}
function getMainBodyDataDiv$() {
	return $("#" + getMainBodyDataDiv());
}
// 返回HTML区域的DOMAIN
function getMainBodyHTMLDiv() {
	var curDiv = "mainbodyHtmlDiv_" + $("#_currentDiv").val();
	return curDiv;
}
function getMainBodyHTMLDiv$() {
	return $("#" + getMainBodyHTMLDiv());
}
// 返回渲染过后的HTML代码
function getHTML() {
	return getMainBodyHTMLDiv$().html();
}

// 查看第几个正文
function viewContent(count) {
	var url = window.location + "";
	if (url.indexOf("&count") >= 0) {
		url = url.replace(/&count=\d*/g, "&count=" + count);
	} else {
		url = url + "&count=" + count;
	}
	window.location.href = url;
}

// 校验contentDomain中签章 关联表单 附件 图片 关联文档是否为空
function checkHW(contentDomain) {
	var ret = true;
	var errorMsg = "";
	// 签章
	contentDomain.find("span[fieldVal*='handwrite']").find("object").each(
					function() {
						if($.browser.msie){// ie
							if($(this).parent("div").parent("span").hasClass("edit_class")){
								// 找到表单中签章字段对应的input元素
								var input = $(this).parent().find("input")[0];
								// 获取校验规则，是否有为空校验
								var validate = $.parseJSON("{"
										+ $(input).attr("validate") + "}");
								if (validate.notNull) {
									var signUserSize = 0;// 已经签章的用户列表长度
									if(this.UserList!=undefined){
										var musers = this.UserList.split(",");
										for(var i=0;i<musers.length;i++){
											if($.trim(musers[i])!=''){
												signUserSize++;
											}
										}
									}
									if(this.DocEmpty&&signUserSize<=0){
										errorMsg=errorMsg + validate.name + $.i18n("form.base.notnull.label") +"!<br/>";
										ret = false;
									}
								}
							}
						}else{
							// 其他浏览器
							if($(this).parent("span").parent("div").parent("span").hasClass("edit_class")){
								// 找到表单中签章字段对应的input元素
								var input = $(this).parent().parent().find("input")[0];
								// 获取校验规则，是否有为空校验
								var validate = $.parseJSON("{"
										+ $(input).attr("validate") + "}");
								if (validate.notNull) {
									var signUserSize = 0;// 已经签章的用户列表长度
									if(this.UserList!=undefined){
										var musers = this.UserList.split(",");
										for(var i=0;i<musers.length;i++){
											if($.trim(musers[i])!=''){
												signUserSize++;
											}
										}
									}
									if(this.DocEmpty&&signUserSize<=0){
										errorMsg=errorMsg + validate.name + $.i18n("form.base.notnull.label") +"!<br/>";
										ret = false;
									}
								}
							}
						}
					});
	
	var res = false;
	if(v3x.isMSIE){
		try{
			new ActiveXObject("DBstep.WebSignature");
			res = true;
		}catch(e){
			res = false;
		}
	}else{
		if(navigator.mimeTypes["application/iwebplugin"]!=undefined){
			res = true;
		}
	}
	if(!res){
		// 没有安装签章的时候也要判断必填项，如果有必填，给出必须安装签章控件的提示
		contentDomain.find("input[comp*='htmlSignature']").each(function(){
			var _tempComp = $.parseJSON("{"+ $(this).attr("comp") + "}");
			if (_tempComp.isNotNull) {
				errorMsg+=_tempComp.displayName + $.i18n("form.base.notnull.label") +"<br/>";
				ret = false;
			}
		});
	}
	// 关联表单
	contentDomain
			.find("span[relation]")
			.each(
					function() {
						var curField = $(this).parent("span");
						var id = curField.attr("id").split("_")[0];
						if (curField.find("#" + id).attr("validate") != undefined) {
							var validate = $.parseJSON("{"
									+ curField.find("#" + id).attr(
											"validate") + "}");
							// 获取校验规则，是否有为空校验
							if (validate.notNull) {
								if ($.trim($(this).parent("span").find("span")
										.eq(0)[0].innerHTML) == ""
										|| "&nbsp;" == $
												.trim($(this).parent("span")
														.find("span").eq(0)[0].innerHTML)) {
									errorMsg = errorMsg + validate.name + $.i18n("form.base.notnull.label") +"!<br/>";
									ret = false;
								}
							}
						}else if(curField.find("div[id^='attachment']").length>0){
							if($(this).attr("isNull")=='true'&&$(this).attr("hasRelatied")=='false'){
								var fieldVal = curField.attr("fieldVal");
								if (fieldVal != undefined) {
									fieldVal = $.parseJSON(fieldVal);
									errorMsg = errorMsg + fieldVal.displayName+$.i18n("form.base.notnull.label")+"!<br/>";
									ret = false;
								}
							}
						}
					});
	// 附件 图片 关联文档
	contentDomain.find(".comp").each(
			function() {
				if ($(this).parent("span").hasClass("edit_class")) {// 首先判断编辑态
					if ($(this).attr("comp") != undefined) {
						var compParm = $.parseJSON("{" + $(this).attr("comp")
								+ "}");
						if (compParm.notNull == "true") {
							var jqField = $(this).parent("span");
							var fieldVal = jqField.attr("fieldVal");
							if (fieldVal != undefined) {
								fieldVal = $.parseJSON(fieldVal);
								if (fieldVal.inputType == "attachment") {
									// 3.5
									// 时附件和关联文档在一个控件，升级上来后，两种类型都有的单元格必填校验做兼容，不然流程提交不了
									if (jqField.find("[id^=attachmentArea]").children().length <= 0 && jqField.find("div[id^=attachment2Area]").children().length <= 0) {
										errorMsg += fieldVal.displayName;
										errorMsg = errorMsg + $.i18n("form.base.notnull.label")+"!<br/>";
										ret = false;
									}
								} else if (fieldVal.inputType == "document") {
									if (jqField
											.find("div[id^=attachment2Area]")
											.children().length <= 0) {
										errorMsg += fieldVal.displayName;
										errorMsg = errorMsg + $.i18n("form.base.notnull.label")+"!<br/>";
										ret = false;
									}
								} else if (fieldVal.inputType == "image") {
									if (jqField.find("div[id^=attachmentArea]")
											.children().length <= 0) {
										errorMsg += fieldVal.displayName;
										errorMsg = errorMsg + $.i18n("form.base.notnull.label")+"!<br/>";
										ret = false;
									}
								}
							}
						}
					}
				}
			});
	contentDomain.find(".editableSpan").each(function() {
		if ($(this).hasClass("edit_class")) {// 首先判断编辑态
			var fieldVal = $(this).attr("fieldVal");
			if (fieldVal != undefined) {
				fieldVal = $.parseJSON(fieldVal);
				if (fieldVal.inputType == "radio") {
					if ($(this).find("input:radio[checked]").length <= 0) {
						errorMsg += fieldVal.displayName;
						errorMsg = errorMsg + $.i18n("form.base.notnull.label")+"!<br/>";
						ret = false;
					}
				}
			}
		}
	});
	// 关联部门属性-部门成员数量选择上线判断
	contentDomain.find("span[fieldVal]").each(function(){
		var currfield = $(this);
		if(currfield.attr("fieldVal").indexOf('data_relation_department')==-1){
			return;
		}
		if(currfield.hasClass("browse_class")){
			var fieldVal = currfield.attr("fieldVal");
			if (fieldVal != undefined) {
				fieldVal = $.parseJSON(fieldVal);
			}
			if(fieldVal.inputType=="multimember"){
				var dispInpSpan = currfield.find("#"+fieldVal.name);
				if (dispInpSpan.attr("validate") != undefined) {
					var validate = $.parseJSON("{"+ dispInpSpan.attr("validate") + "}");
					var maxSize = validate.maxLength/21;
					if(dispInpSpan.text().split("、").length>maxSize){
						errorMsg += fieldVal.displayName;
						errorMsg += "超过最大数目！<br/>";
						ret = false;
					}
				}
			}
		}else if(currfield.hasClass("edit_class")){
			var compStr = currfield.find(".comp").attr("comp");
			if (compStr != undefined) { 
				var compParm = $.parseJSON("{" +compStr + "}");
				if(compParm.type=="selectPeople"){
					var fieldVal = currfield.attr("fieldVal");
					if (fieldVal != undefined) {
						fieldVal = $.parseJSON(fieldVal);
					}
					if(fieldVal.inputType == "multimember"&&"data_relation_department"==fieldVal.toRelationType){
						var hidinp = currfield.find("#"+fieldVal.name);
						if(hidinp.length>0){
							var curSize = hidinp.val().split(",").length;
							if(curSize>compParm.maxSize){
								errorMsg += fieldVal.displayName;
								errorMsg += "超过最大数目！<br/>";
								ret = false;
							}
						}
					}
				}
			}
		}
	});
	contentDomain.find("div[id^='showMore_']").each(function(){
		var showMoreBtn = $(this);
		if(showMoreBtn.attr("hasNotNullField")=="true"){
			errorMsg +=$.i18n("form.submit.subdata.hasnotnull");
			ret = false;
		}
	});
	if (!ret) {
		$.alert(errorMsg);
	}
	return ret;
}

/**
 * 获取表单正文中非隐藏的附件数据
 */
function getContentAttrs() {
	var atts = [];
	$("span[id$='_span']", $("#mainbodyDiv"))
			.each(
					function() {
						var sp = $(this);
						if (sp.hasClass("browse_class")
								|| sp.hasClass("edit_class")) {
							var fieldVal = sp.attr("fieldVal");
							var idStr = sp.attr("id").split("_")[0];
							if (fieldVal != undefined) {
								fieldVal = $.parseJSON(fieldVal);
								if (fieldVal.inputType == 'attachment'||fieldVal.formatType=='attachment' || fieldVal.inputType == 'image'||fieldVal.formatType=='image') {
									var attCompDiv = sp.find(".comp");
									if (attCompDiv.length > 0) {
										var subReferenceId = attCompDiv.find(
												"#" + idStr).val();
										var fieldAttsData = attCompDiv
												.attr("attsData");
										if (fieldAttsData != null) {
											fieldAttsData = $
													.parseJSON(fieldAttsData);
											if (fieldAttsData != null
													&& fieldAttsData.length > 0) {
												for ( var i = 0; i < fieldAttsData.length; i++) {
													if (fieldAttsData[i].subReference == subReferenceId) {
														atts
																.push(fieldAttsData[i]);
													}
												}
											}
										}
									}
								}
							}
						}
					});
	return atts;
}

/**
 * 正文组件打印接口实现。
 * 本方法将页面各部分构造成PrintFragment对象。并传入buildPrintFragmentList方法中构造成列表传入组件方法printList中。
 * 
 * @param {String}
 *            preBodyFragArr 正文前PrintFragment列表。
 * @param {String}
 *            afterBodyFragArr 正文后PrintFragment列表。
 * @param {String}
 *            printType office或表单格式时打印类型:mainpp 正文/colPrint 意见。
 * @param {String}
 *            printFrom 打印来自于哪： newCol 新建 、summary 协同详细页面。
 */
$.content.print = function(preBodyFragArr, afterBodyFragArr, printType,
		printFrom) {
	var curDiv = getMainBodyHTMLDiv$();
	var contentDiv = getMainBodyDataDiv$();
	if(contentDiv.length==0){
		contentDiv = $("#mainbodyDataDiv_0");
	}
	var contentType = $("#contentType", contentDiv).val();
	var viewState = $("#viewState", contentDiv).val();
	if (contentType == undefined) {
		contentType = $("#contentType").val();
		viewState = $("#viewState").val();
	}
	
	var printContent = '<div id="inputPosition" style="width: 1px; height: 0px; border:0px  solid;" ></div>';
	
	var officeDisplay = $('#zwOfficeIframe', parent.document).css("display");// 表单office意见打印时，不打印正文
	var printForwardFragment = "";// 1 原意见
	var sendOpinionFrag = "";// 2 附言
	var printCommentFragment = '';// 3 处理意见
	var printComment = '';//
	var printFragment = '';// 4 正文

	// 如果是协同，先构造 原意见、 附言、 处理意见三个对象，因为构造正文PrintFragment可能需要异步方法提交数据并从后台获取数据
	// if($("#viewState", contentDiv).val() != "1" || printFrom === "summary"){
	// $("#viewState", contentDiv).val() != "1" 待办打开时 viewState==1
	if (printFrom.indexOf("summary")!=-1 || viewState == "2") {
		// 原意见（转发）
		var forwards = parent.$("#commentForwardDiv");
		var forwardsNum = forwards.length;
		if (typeof (forwardsNum) !== "undefined" && forwardsNum > 0) {
			var printForward = "";
			for ( var i = 0; i < forwardsNum; i++) {
				printForward += cleanA("</br>" + forwards[i].outerHTML);
			}
			
			printForwardFragment = new PrintFragment($
					.i18n('collaboration.colPrint.oldOpinion'), printForward);
		}
		// 附言
		var printColOpinion = $.i18n('collaboration.sender.postscript'); // 附言
		var colOpinion = '';
		var printColOpinion1 = "";
		if(printColOpinion){ 
 			printColOpinion1 = printColOpinion +" :";
		}
		if (printFrom !== "template") {
			colOpinion = "<br/><div class='div-float body-detail-su' style='font-size: 12px; font-weight: bolder;'>"
					+ printColOpinion1 + "</div><br />";
			$("#replyContent_sender #replyContent_sender_content #reply_sender",parent.document).css('display','none');
			colOpinion += cleanA("<div style='line-height: 20px; margin-bottom: 5px;font-size: 12px;'>"
					+ $("#replyContent_sender #replyContent_sender_content",parent.document).html() + "</div></br>");

			// if (colOpinion.indexOf("left") >= 0) {
				// colOpinion = colOpinion.replace("left", "");
			// }
			sendOpinionFrag = new PrintFragment(printColOpinion, colOpinion);
		}

		// 处理意见
		if (printFrom !== "template") {
			if(typeof(parent.$("#currentComment").html())== 'undefined'){
				printComment += cleanA("");
			}else{
				printComment += cleanA(parent.$("#currentComment").html());
			}
			
			printComment = printComment.replace(/no_like_16/g,"no_like_disable_16");
			//将printComment中 span 标签的title=“取消赞、赞”变为 title='' 
			//printComment = printComment.replace(new RegExp("title=[^>]*?(?=onclick)","g"),"title='' ");
			//OA-91675 处理待办协同页面点击打印，打印页面中，意见回复区人员后面赞的手势图标未显示
			printComment = printComment.replace(new RegExp("title=[^>]*?(?= )","g"),"title='' ");
			//将日志图标隐藏
			printComment = printComment.replace(/log_span/g, "log_span display_none");
			printCommentFragment = new PrintFragment($
					.i18n('collaboration.colPrint.handleOpinion'), printComment);
		}

	}

	if (contentType == 10) {
		// 以前不知道是谁在这个div中设置了line-height:20导致打印普通协同出现bugOA-62147，现在已经去掉
		printContent += "<div style='font-size:16px;'>";
		if ($("#fckedit").attr("comp")) {
			printContent += $("#fckedit").getEditorContent();
		} else {
			// 转发的表单中如果包含签章，打印的时候会根据input再次comp初始化导致出现两个签章图片
			getMainBodyHTMLDiv$().find("input[comp*='htmlSignature']").each(function(){
				var handWriteInp = $(this);
				if(handWriteInp.prev("img").length>0){
					handWriteInp.remove();
				}
			})
			//调用扩展的正文打印处理方法
			if(typeof(printContentMethodName) == "function"){
				var contentResult = printContentMethodName();
				if(contentResult != null && contentResult != ""){
					printContent += contentResult;
				}else{
					printContent += getMainBodyHTMLDiv$().html();
				}
			}else{
				printContent += getMainBodyHTMLDiv$().html();
			}
		}
		printContent += "<div class='clearfix'></div></div>";
	} else if (contentType > 40 && contentType < 50 && printType == "mainpp") {
		if (contentType == 45) { // pdf打印
			pdfPrint();
		} else {
			officePrint();
		}
		return;
	}
	printContent = cleanA(printContent);

	if (printType != "colPrint") {// office格式时不打印正文
		if (contentType != 20) { // 不是表单就在此处组装printFragment，否则走下面表单的逻辑
			printFragment = new PrintFragment($
					.i18n('collaboration.colPrint.mainBody'), printContent);
			printFragment.dataHtml = printFragment.dataHtml.replace(
					"undefined", "");
		}
	}
	// 表单打印需要使用异步JsonSubmit方式提交数据后从后台获取HTML代码，所以放在最后面使用回调方式实现打印逻辑
	if (contentType == 20 && (!officeDisplay || officeDisplay =="none")) {
		isFormPrintFlag = true;
		// 获取附件、图片和关联文档的HTML代码，表单编辑态附件等内容无法从后台获取
		// 这个地方获取后传到打印页面，在打印页面将对应的单元格替换
		var attsList = new Array();
		if (form) {// 还要将form对象传过去，用于寻找表单重复项的recordId
			attsList["formObj"] = form;
		}
		$("span[id$='_span']", $("#mainbodyDiv")).each(
				function() {
					var inputSpan = $(this);
					var fieldVal = inputSpan.attr("fieldVal");
					if (fieldVal == undefined) {
						return true;
					} else {
						fieldVal = $.parseJSON(fieldVal);
					}
					if (fieldVal.inputType == 'attachment'
							|| fieldVal.inputType == 'document' || fieldVal.inputType == 'barcode'
							|| fieldVal.inputType == 'image') {
						// 二维的重复项中的单元格idStr是一样的，所以使用recordId_idStr作为Key，如果不是重复项，recordId=0
						var idStr = inputSpan.attr("id").split("_")[0];
						attsList[getRecordIdByJqueryField(inputSpan) + "_"
								+ idStr] = inputSpan.html();
					}
				});
		if (viewState == 1) {// 编辑态需要先提交后获取代码；其他状态可以直接获取前台代码；
			preSubmitData(
					function() {
						//调用扩展的正文打印处理方法
						if(typeof(printContentMethodName) == "function"){
							var contentResult = printContentMethodName();
							if(contentResult != null && contentResult != ""){
								printContent += contentResult;
							}else{
								printContent += getFormPrintContent(printContent);
							}
						}else{
							printContent = getFormPrintContent(printContent);
						}
						printFragment = new PrintFragment($
								.i18n('collaboration.colPrint.mainBody'),
								printContent);
						buildPrintFragmentList(preBodyFragArr,
								afterBodyFragArr, printFrom, printFragment,
								printForwardFragment, sendOpinionFrag,
								printCommentFragment, contentType, viewState,
								attsList);
					}, function() {
						return;
					}, false,false);
		} else {
			//调用扩展的正文打印处理方法
			if(typeof(printContentMethodName) == "function"){
				var contentResult = printContentMethodName();
				if(contentResult != null && contentResult != ""){
					printContent += contentResult;
				}else{
					printContent += getFormPrintContent(printContent);
				}
			}else{
				printContent = getFormPrintContent(printContent);
			}
			printFragment = new PrintFragment($
					.i18n('collaboration.colPrint.mainBody'), printContent);
			buildPrintFragmentList(preBodyFragArr, afterBodyFragArr, printFrom,
					printFragment, printForwardFragment, sendOpinionFrag,
					printCommentFragment, contentType, viewState, attsList);
		}
	} else {
		buildPrintFragmentList(preBodyFragArr, afterBodyFragArr, printFrom,
				printFragment, printForwardFragment, sendOpinionFrag,
				printCommentFragment, contentType, viewState);
	}
};

/**
 * 构造PrintFragmentList
 * 
 * @param {String}
 *            preBodyFragArr 正文前PrintFragment列表。
 * @param {String}
 *            afterBodyFragArr 正文后PrintFragment列表。
 * @param {String}
 *            printFrom 打印来自于哪： newCol 新建 、summary 协同详细页面。
 * @param {PrintFragment}
 *            printFragment 正文PrintFragment
 * @param {PrintFragment}
 *            printForwardFragment 原意见。
 * @param {PrintFragment}
 *            sendOpinionFrag 附言。
 * @param {PrintFragment}
 *            printCommentFragment 处理意见。
 * @param {String}
 *            contentType 标识正文类型
 * @param {String}
 *            viewState 查看状态
 * @param {Object}
 *            otherPrarams 其他参数。表单编辑态打印中需要使用该参数存放comp空间中的HTML代码，用于替换打印页面中对应的单元格。
 */
function buildPrintFragmentList(preBodyFragArr, afterBodyFragArr, printFrom,
		printFragment, printForwardFragment, sendOpinionFrag,
		printCommentFragment, contentType, viewState, otherPrarams) {
	
	var printDefaultSelect = new Array();// 默认打印的部分的索引
	var notPrintDefaultSelect = new Array(); // 默认不勾选的部分的索引列表
	var printFragmentList = new ArrayList();
	
	for ( var i = 0; i < preBodyFragArr.size(); i++) {
		if (preBodyFragArr.get(i) != "undefined"
				&& preBodyFragArr.get(i) != undefined) {
			notPrintDefaultSelect.push(printFragmentList.size());
			printFragmentList.add(preBodyFragArr.get(i));
		}
	}

	// 当是模版的时候，这里等于0是创建人。然后在是正文，最后是附件
	if (printFrom == "template") {
		for (i = 0; i < afterBodyFragArr.size(); i++) {
			if (afterBodyFragArr.get(i) != "undefined"
					&& afterBodyFragArr.get(i) != undefined) {
				notPrintDefaultSelect.push(printFragmentList.size());
				printFragmentList.add(afterBodyFragArr.get(i));
			}
		}
	}
	// 这里是正文
	if (printFragment != "undefined" && printFragment != undefined&&printFragment!="") {
		printDefaultSelect.push(printFragmentList.size());
		printFragmentList.add(printFragment);
	}
	if (printFrom != "template") {
		for (i = 0; i < afterBodyFragArr.size(); i++) {
			if (afterBodyFragArr.get(i) != "undefined"
					&& afterBodyFragArr.get(i) != undefined) {
				notPrintDefaultSelect.push(printFragmentList.size());
				printFragmentList.add(afterBodyFragArr.get(i));
			}
		}
	}
	if (printForwardFragment != "" && printForwardFragment != "undefined"
			&& printForwardFragment != undefined) {
		notPrintDefaultSelect.push(printFragmentList.size());
		printFragmentList.add(printForwardFragment);
	}
	if (sendOpinionFrag != "undefined" && sendOpinionFrag != undefined) {
		notPrintDefaultSelect.push(printFragmentList.size());
		printFragmentList.add(sendOpinionFrag);
	}
	if (printCommentFragment != "undefined"
			&& printCommentFragment != undefined) {
		
		// 在打印Office正文的协同时，默认选中打印意见 OA-60318
		if(printDefaultSelect.length==0){
			printDefaultSelect.push(printFragmentList.size());
		}else{
		notPrintDefaultSelect.push(printFragmentList.size());
		}
		printFragmentList.add(printCommentFragment);
	}

	var styleDatas = new ArrayList();
	if(printFrom.indexOf("summary_")!=-1){
		var print_Form= new Array(); 
		print_Form=printFrom.split("_"); // 字符分割
		if(print_Form.length>1){
			printListLodop(printFragmentList, styleDatas, printDefaultSelect, notPrintDefaultSelect, contentType,
					viewState, otherPrarams,print_Form[1]);
		}else{
			printList(printFragmentList, styleDatas, printDefaultSelect, notPrintDefaultSelect, contentType,
					viewState, otherPrarams);
		}
	}else{
		printList(printFragmentList, styleDatas, printDefaultSelect, notPrintDefaultSelect, contentType,
				viewState, otherPrarams);
	}
	
}

// 获取表单打印态的HTML代码
function getFormPrintContent(printContent) {
	var contentDiv = getMainBodyDataDiv$();
	if(contentDiv.length==0){
		contentDiv = $("#mainbodyDataDiv_0");
	}
	var moduleType = $("#moduleType", contentDiv).val();
	var moduleId = $("#moduleId", contentDiv).val();
	var contentTemplateId = $("#contentTemplateId", contentDiv).val();
	var contentDataId = $("#contentDataId", contentDiv).val();
	var currentIndex = $("#_currentDiv").val();
	
	
	// 获取rightId 首先从URL中获取rightId，如果不能获取在从hidden域中获取。by zhangc
	// 原因：如果表单存在高级权限，formMainbodyHandler会将rightId替换成高级权限的ID，导致URL中的rightId和hidden域中的值不同，如果直接使用高级权限ID会引起空指针。
	var rightId="";
	var params = window.location.search;
	if(params.indexOf("?")>=0){
		params = params.substring(params.indexOf("?")+1);
		params = params.split("&");
		for(var i=0;i<params.length;i++){
			var param = params[i].split("=");
			if(param[0]=="rightId"){
				// id=123.234|123.123
				// 如果是多视图正文（归档后可以显示多视图）的打印，不需要使用URL中的rightId，直接获取正文中的隐藏域即可
				if(param[1].indexOf("_")<0){
				rightId = param[1];
				break;
				}else{
					rightIds = param[1].split("_");
					if(rightIds.length>=currentIndex){
						// 从URL中回去第N个表单视图的权限
						rightId = rightIds[currentIndex];
						break;
					}
				}
			}
		}
	}
	if(rightId==null || rightId==""){
		rightId = $("#rightId", contentDiv).val();
	}
	// 多视图情况下，right = viewId.rightID,分离rightId；单视图不需分离
	if(rightId != null && rightId.indexOf(".") > -1){
		rightId = rightId.split(".")[1];
	}
	var formMgr = new formManager();
	var formContentHtml = formMgr.getPrintFormHTML(moduleType, moduleId,
			contentTemplateId, contentDataId, rightId);
	
	//黄奎修改 BUG_重要_V5_V6.0sp1__唐山为友信息技术有限公司_新建的枚举值包含大小写，在填写完单子后，打印时枚举值都变成了大写。
	//是由于InfoPath默认给重复表头h3添加了TEXT-TRANSFORM: uppercase;样式
	formContentHtml = formContentHtml.replace("TEXT-TRANSFORM: uppercase;", "TEXT-TRANSFORM: none;");
	
	printFromContent = printContent + formContentHtml;
	printFromContent = cleanA(printFromContent);
	return printFromContent;
}
var ctpMainbodyManager = RemoteJsonService.extend({
	jsonGateway : _ctxPath
			+ "/ajax.do?method=ajaxAction&managerName=ctpMainbodyManager",
	transContentNewResponse : function() {
		return this.ajaxCall(arguments, "transContentNewResponse");
	},
	deleteById: function(){
        return this.ajaxCall(arguments,"deleteById");
	},
	getByModuleIdAndType: function(){
        return this.ajaxCall(arguments,"getByModuleIdAndType");
	}
});
$.content.switchContentType = function(mainbodyType, successCallback) {
	var confirm = "";
	var contentDiv = getMainBodyDataDiv$();
	var alreadyId = "";
	alreadyId = $("#id", contentDiv).val();
	confirm = $.confirm({
		'msg' : $.i18n('content.switchtype.message'),
		ok_fn : function() {
			var curDiv = getMainBodyHTMLDiv$();
			var contentDiv = getMainBodyDataDiv$();
			if ($("#contentType", contentDiv).val() == mainbodyType) {
				return;
			}
			var mgr = new ctpMainbodyManager();
			mgr.transContentNewResponse($("#moduleType", contentDiv).val(), $(
					"#moduleId", contentDiv).val(), mainbodyType, "1", {
				success : function(ret) {
					curDiv.html(ret.contentHtml);
					contentDiv.fillform(ret);
					curDiv.comp();
					// office正文切换时重新设置office正文的高度
					if(mainbodyType >= 41 ){
						curDiv.height("98%");
						$("#mainbodyDiv").height("100%");
					}
					if (alreadyId && alreadyId != '') {
						$("#id", contentDiv).val(alreadyId);
					}
				}
			});
			if (successCallback)
				successCallback();
		}
	});
};

/** 唐桂林 public 手动切换正文类型，不弹出内容清空提示 */
$.content.switchContentTypeNoComfirm = function(toolbarId, mainbodyType, successCallback) {
	var contentDiv = getMainBodyDataDiv$();
	var alreadyId = "";
	var curDiv = getMainBodyHTMLDiv$();
	var contentDiv = getMainBodyDataDiv$();
	if ($("#contentType", contentDiv).val() == mainbodyType) {
		return;
	}
	var mgr = new ctpMainbodyManager();
	mgr.transContentNewResponse($("#moduleType", contentDiv).val(), $(
			"#moduleId", contentDiv).val(), mainbodyType, "1", {
		success : function(ret) {
			curDiv.html(ret.contentHtml);
			contentDiv.fillform(ret);
			curDiv.comp();
			if (alreadyId && alreadyId != '') {
				$("#id", contentDiv).val(alreadyId);
			}
		}
	});
	$.content.changeToolbarContentType(toolbarId, mainbodyType);
	if (successCallback) {		
		successCallback();
	}
};
/** 唐桂林 private 手动修改toolbar上正文类型样式(供方法switchContentTypeNoComfirm使用) */
$.content.changeToolbarContentType = function(toolbarId, defaultType) {
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
			}
		} else if (i == 0) {
			mtCfg[i].disabled = true;
		}
		try {
			if ($.ctx.isOfficeEnabled(mt))
				r.push(mtCfg[i]);
		} catch (e) {
		}
	}
	if (_lastMainbodyType)
		$("#" + _mt_toolbar_id).toolbarEnable("_mt_" + _lastMainbodyType);
	$("#" + _mt_toolbar_id).toolbarDisable("_mt_" + defaultType);
	_lastMainbodyType = defaultType;
	return r;
};

function cleanSpecial(str){
	var position = str.indexOf("<DIV>");
	if(position == -1){
		return str;
	}
	var leftstr = str.substr(0,position-1);
	var rightstr = str.substr(position);
	var nextposition = rightstr.indexOf("</DIV>");
	var laststr = rightstr.substr(nextposition+6);
	return cleanSpecial(leftstr+laststr);
}
function cleanA(str) {
    
    // 附件鼠标移入移除效果
    if(str){
        var mLeave = / onmouseleave=[^>]*?(?=[ >])/ig;
        var mEnter = / onmouseenter=[^>]*?(?=[ >])/ig;
        str = str.replace(mLeave, "");
        str = str.replace(mEnter, "");
    }
    
	var position = str.indexOf("<a>");
	if (position == -1) {
		return str;
	}
	var leftstr = str.substr(0, position - 1);
	var rightstr = str.substr(position);
	var nextposition = rightstr.indexOf("</a>");
	var laststr = rightstr.substr(nextposition + 4);
	return cleanSpecial(cleanA(leftstr + laststr));
}
var zwIframeHeight = 0;
// 选项卡切换事件,目前只有协同模块使用多视图和office套红正文
function _viewContentSwitch(currentA,id,changeViewCallBack) {

    // changeViewCallBack 下面有些场景不会调用，这里做兼容处理了
    var doSwitchFn = window.parent.onSwitchFormContent 
                         || window.parent.parent.onSwitchFormContent 
                         || function(){}
    
	var jqCurrenta = $(currentA);
	var officeParm = jqCurrenta.attr("officeParm");
	if(officeParm){// 点击的是office套红正文
		getA8Top().isOffice = true;
	    var isChrome = navigator.userAgent.indexOf('Chrome');
	    if(isChrome>=0){//360极速不支持office插件
			alert("当前浏览器不支持office插件，请使用IE浏览器");
			return;
		}
	    doSwitchFn("word");
	    changeViewCallBack = changeViewCallBack || parent.changeViewCallBack;
		if(typeof(changeViewCallBack) =='function'){
			changeViewCallBack(oldIndex,"word",function(officeIf,formIf,openFrom,nodePolicy,deeReadOnly){
				var cont = $.parseJSON(officeParm);
				var params = {};
				params.fileId = cont.fileId;
				params.fileType = "."+cont.extension;
				params.webRoot = _ctxPath;
				params.createDate = cont.createDate;
				params.needReadFile = true;
				params.canTaohong = true;
				params.formDataId = cont.formDataId;
				params.officeOcxUploadMax = cont.officeOcxUploadMax;
				if(nodePolicy == "inform" || deeReadOnly){//知会节点/加签只读 只有浏览权限，不能编辑正文
					cont.auth = 'browse';
				}
				if(cont.auth == 'browse'){
					params.editType = "0,0";
					params.canEditContent = "false";
					params.officecanSaveLocal = "false";
				}
				else if(cont.auth == 'edit'){
					params.editType = "1,0";
					params.canEditContent = "true";
					params.officecanSaveLocal = "true";
				}
				
				if(typeof(hasDealArea) != 'undefined' && hasDealArea == 'false'){
					
					params.editType = "0,0";
					params.canEditContent = "false";
				}
				//office正文加载成功的回调函数
				params.initOfficeSucessCallback=function(){
					officeIf.attr("hasLoad",true);
				};
				
				// 打印权限取协同外层的。
				try{
					if(typeof(parent)!='undefined' && typeof( parent.parent)!='undefined' && typeof(parent.parent.officecanPrint)!='undefined'){
						params.officecanPrint = parent.parent.officecanPrint;
					}
					else if(typeof(parent)!='undefined'  && typeof(parent.officecanPrint)!='undefined'){
						params.officecanPrint = parent.officecanPrint;
					}
				}catch(e){
					
				}
				formIf.contents().find(".content_text").css("display","none");
				if(zwIframeHeight==0){
					zwIframeHeight=formIf.height();
				}
				//formIf.attr("_height",formIf.height());
				formIf.css({"height":"30px"});
				formIf.attr("isShow","false");
				jqCurrenta.parent().parent().find("li").removeClass("current");
				jqCurrenta.parent().removeClass("current").addClass("current");
				
				if(officeIf.attr("hasLoad")=="false"){//未加载office时
					officeIf[0].contentWindow.initBaseOffice(params);
					officeIf.attr("fileId",params.fileId);
				}
				else{//判断是否刷新了正文
					if(officeIf.attr("fileId")!=params.fileId){//刷新正文(重新生成了一个fileId)
						officeIf[0].contentWindow.initBaseOffice(params);
					}else{
						officeIf[0].contentWindow.setFormDataId(params.formDataId);
					}
					
				}
				
				if((openFrom == "listPending" || openFrom == "newColl") && nodePolicy != "inform" ){
					// 从待办和新建打开：套红
					taoHong(officeIf);
				}
				officeIf.css("display","block");
				if(openFrom != "newColl"){
					officeIf.parent().css("height","");
					officeIf.parent().parent().css("height","");
				}
			});
		}
	}else{// 表单正文
	    getA8Top().isOffice = false;
	    doSwitchFn("form");
	    
		var currClass = "current";
		var hiddClass = "hidden";
		var h = window.location.href;
		// 如果url中最后一个字符为# 则去掉，否则在后面添加参数不生效
		if(h.lastIndexOf("#")==h.length-1){
			h = h.substring(0,h.lastIndexOf("#"))+h.substring(h.lastIndexOf("#")+1);
		}
		// 通过正文组件url方式使用的正文组件
		if(h.indexOf("content.do")!=-1){
			var tempzwIframe = $('#zwIframe', parent.document);
			if(tempzwIframe.length>0 && getURLParam("moduleType")==1){// 协同页面
				var oldIndex = getURLParam("indexParam");
				if(oldIndex==null){
					oldIndex=0;
				}
				var bdzwframeShowTag = tempzwIframe.attr("isShow");
				// 表单正文显示的时候点击当前页签，不用刷新页面
				if(bdzwframeShowTag=="true"&&oldIndex == id){
					return;
				}
				// 从office套红正文切换回表单正文，并且表单正文只有一个视图的时候，不用刷新页面
				if (bdzwframeShowTag=="false"&&$("#viewsTab > li",tempzwIframe).length==2) {
					return;
				} 
				if(bdzwframeShowTag==undefined||bdzwframeShowTag=="true"){// 表单正文之间的切换
					if (h.indexOf("indexParam") != -1) {
						if (oldIndex == id) {
							return;
						} else {
							h=setUrlParam("indexParam",id,h);
						}
					} else {
						h = h + "&indexParam=" + id;
					}
					if(typeof(changeViewCallBack) =='function'){
						changeViewCallBack(oldIndex,id,function(){
							tempzwIframe[0].contentWindow.location.href = h;
						});
					}else{
						tempzwIframe[0].contentWindow.location.href = h;
					}
					
				}else{// 从office套红正文切换到表单
					
					// 如果是新建页面，则不刷新页面
					if($("li[index]").length>2){
						
						if (h.indexOf("indexParam") != -1) {
							h=setUrlParam("indexParam",id,h);
						} else {
							h = h + "&indexParam=" + id;
						}
						if(typeof(changeViewCallBack) =='function'){
							changeViewCallBack(oldIndex,id,function(){
								tempzwIframe[0].contentWindow.location.href = h;
							});
						}else{
							tempzwIframe[0].contentWindow.location.href = h;
						}
						tempzwIframe.attr("isShow","true").css("height",zwIframeHeight+"px");
						$('#zwOfficeIframe', parent.document).css("display","none");
						// tempzwIframe[0].contentWindow.location.href = h;
						
					}else{
						tempzwIframe.attr("isShow","true").css("height",zwIframeHeight+"px");
						tempzwIframe.contents().find(".content_text").css("display","block");
	                    $('#zwOfficeIframe', parent.document).css("display","none");
	                    $("li[index]").removeClass(currClass);
	                    $("li[index='"+id+"']").addClass(currClass);
	                    $("#_currentDiv").val(id);
						$('#newColl_layout', parent.document).css("overflow","visible");
						
					}
				}
			}else{// 其他页面
				if (h.indexOf("indexParam") != -1) {
					var oldIndex = getURLParam("indexParam");
					if (oldIndex == id) {
						return;
					} else {
						h=setUrlParam("indexParam",id,h);
					}
				} else {
					h = h + "&indexParam=" + id;
				}
				if(typeof(changeViewCallBack) =='function'){
					changeViewCallBack(oldIndex,id,function(){
						window.location.href = h;
					});
				}else{
					window.location.href = h;
				}
			}
		}else{
			// 通过jspinclude方式使用的正文组件
			$("li[index]").removeClass(currClass);
			$("li[index='"+id+"']").addClass(currClass);
			$("div[id^='mainbodyHtmlDiv_']").addClass(hiddClass);
			$("div[id='mainbodyHtmlDiv_"+id+"']").removeClass(hiddClass);
			$("#_currentDiv").val(id);
		}
	}
}

function taoHong(officeIf){
	if(!officeIf[0].contentWindow.hasLoadOfficeFrameComplete()){
			window.setTimeout(function(){
				taoHong(officeIf);
			},1000);			
	}else{
		officeIf[0].contentWindow.taoHong4Form(function(dataId,displayStrNames){
			var hasNotDealArea = typeof(hasDealArea) != 'undefined' && hasDealArea == 'false'; // 处理页面非待办状态,要注意新建页面没有传递这个参数
			var deeReadOnly = typeof(parent)!="undefined" && typeof(parent.parent)!="undefined" && typeof(parent.parent.deeReadOnly)!="undefined" && parent.parent.deeReadOnly;
			if(displayStrNames != "" && displayStrNames != null  && !hasNotDealArea && !deeReadOnly){
				var formAjax = new formManager();
				formAjax.getFormDataJsonStrByFieldNames(dataId,displayStrNames,{
				"success" : function(rval){
					var attFormObj = $.parseJSON(rval);
					attFormObj = transFormData(attFormObj);
					officeIf[0].contentWindow.taoHongHt(attFormObj);
				}
				});
			}
			
		});
						
	}			
}

//图片附件要单独处理
function transFormData(formdata){
	var formdataArray = [];
	for(var i=0;i<formdata.data.length;i++){
		var formBean = formdata.data[i];
		if(formBean){
			var beanType = formBean.type;
			if(beanType == "image"){
				var tempData = {};
				tempData["name"] = formBean.name;
				tempData["type"] = beanType;
				var tempVal = formBean.val;
				if(tempVal){
					tempData["val"] = getAttIdBySubreference(tempVal);
				}
				formdataArray.push(tempData);
			} else if(beanType == "handwrite" ){
				var hwObj = document.getElementById(formBean.val);
				if(hwObj){
					hwObj.SaveAsGifEx(formBean.val,'All', 'Remote');
				}
				formdataArray.push(formBean);
			}else{
				formdataArray.push(formBean);
			}
		}
    }
    return {"data":formdataArray};
}
//根据subReference取图片的id
function getAttIdBySubreference(subReference){
	var attId = "";
	if(fileUploadAttachments){
		var attValues = fileUploadAttachments.values();
		if(attValues){
			for(var i = 0; i < attValues.size(); i++){
				var tempAttObj = attValues.get(i);
				if(tempAttObj){
					if(tempAttObj.subReference == subReference){
						var createDate = tempAttObj.createDate;
						if(createDate){
							createDate = createDate.substring(0,10);
						}
						attId = tempAttObj.fileUrl + "_"  + createDate;
						break;
					}
				}
			}
		}
	}
	return attId;
}

// 获取参数值
function getURLParam(name) {
	var value = window.location.search.match(new RegExp("[?&]" + name
			+ "=([^&]*)(&?)", "i"));
	return value ? decodeURIComponent(value[1]) : value;
}

// para_name 参数名称 para_value 参数值 url所要更改参数的网址
function setUrlParam(para_name, para_value, url) {
	var strNewUrl = new String();
	var strUrl = url;
	if (strUrl.indexOf("?") != -1) {
		strUrl = strUrl.substr(strUrl.indexOf("?") + 1);
		if (strUrl.toLowerCase().indexOf(para_name.toLowerCase()) == -1) {
			strNewUrl = url + "&" + para_name + "=" + para_value;
			return strNewUrl;
		} else {
			var aParam = strUrl.split("&");
			for ( var i = 0; i < aParam.length; i++) {
				if (aParam[i].substr(0, aParam[i].indexOf("=")).toLowerCase() == para_name
						.toLowerCase()) {
					aParam[i] = aParam[i].substr(0, aParam[i].indexOf("="))
							+ "=" + para_value;
				}
			}
			strNewUrl = url.substr(0, url.indexOf("?") + 1) + aParam.join("&");
			return strNewUrl;
		}
	} else {
		strUrl += "?" + para_name + "=" + para_value;
		return strUrl
	}
}
$.content.getContent = function() {
	var contentDiv = getMainBodyDataDiv$();
	var contentType = $("#contentType", contentDiv).val();
	if ($("#viewState", contentDiv).val() == "1" && contentType == 10) {
		if ($("#fckedit").attr("comp")) {
			return $("#fckedit").getEditorContent();
		} else {
			return getMainBodyHTMLDiv$().html();
		}
	}
	return "";
};
$.content.setContent = function(content) {
	var contentDiv = getMainBodyDataDiv$();
	var contentType = $("#contentType", contentDiv).val();
	if (contentType == 10) {
		if ($("#viewState", contentDiv).val() == '1') {
			if ($("#fckedit").size() > 0) {
				$("#fckedit").setEditorContent(content);
			} else {
				getMainBodyHTMLDiv$().html(content);
			}
		} else {
			getMainBodyHTMLDiv$().html(content);
		}
	}
	window.fnResizeContentIframeHeight();
};

$.content.getContentDomains = function(callbk, optType, domains, failedCallback) {
	if (!domains)
		domains = [];
	var contentDiv = getMainBodyDataDiv$();
	var cb = function() {
		if (useWorkflow == "true") {
			$.content.getWorkflowDomains($("#moduleType", contentDiv).val(),
					domains);
			if (optType == 'send') {
				$.content.callback.workflowNew = function() {
					if (callbk)
						callbk(domains);
				};
				$.content.callback.workflowFinish = function() {
					if (callbk)
						callbk(domains);
				};
				preSubmitData(function() {
					var formContentId = "";
					var formAppid= "";
					var formId= "";
					var formOperationId= "";
					var myAppName= moduleTypeName;
					if ($("#contentType").val() == 20) {
						formContentId = $("#contentDataId",contentDiv).val();
						myAppName= "form";
						formAppid = $("#formAppid").val();
						formOperationId = $("#formOperationId").val();
					}
					if(!executeWorkflowBeforeEvent("BeforeStart","","",wfProcessId,"","start",formContentId,myAppName,formAppid,formId,formOperationId)){
						return;
					}
					preSendOrHandleWorkflow(window, wfItemId, wfProcessId,
							wfProcessId, wfActivityId, CurrentUserId, wfCaseId,
							loginAccount, formContentId, moduleTypeName, $(
									"#process_xml").val(), false);

				}, failedCallback, false);
			} else if (callbk) {
				callbk(domains);
				if (optType == 'saveAs') {
					var contentType = $("#contentType", contentDiv).val();
					if ((contentType > 40 && contentType < 50) && $("#moduleType").val() != '32') {
						fileId = getUUID();
						$("#contentDataId", contentDiv).val(fileId);
					}
				}
			}
		} else {
			if (callbk) {
				callbk(domains);
			}
		}
	};
	var needcheckNullFlag = null;
	// 是否校验重复行
	var needCheckRepeatData = true;
	if (optType
			&& (optType == 'saveAs' || optType == 'stepBack'
					|| optType == 'stepStop' || optType == 'repeal')) {// 终止,撤销,回退
		needcheckNullFlag = false;
		needCheckRepeatData = false;
	}
	var notSaveOffice = false;
	if(optType && (optType == 'stepBack' || optType == 'stepStop' || optType == 'repeal')){
		notSaveOffice = true;
	}
	saveOrUpdate({
		"mainbodyDomains" : domains,
		"needSubmit" : false,
		"success" : cb,
		"checkNull" : needcheckNullFlag,
		"failed" : failedCallback,
		"needCheckRepeatData":needCheckRepeatData,
		"notSaveOffice": notSaveOffice
	});
	return domains;
};

$.content.getContentDomains_newColl = function(callbk, optType, domains, failedCallback,templateId) {
	if (!domains)
		domains = [];
	var contentDiv = getMainBodyDataDiv$();
	var cb = function() {
		var _contentObj =  arguments[0];// 提交正文后返回的数据
		var snMsg =  arguments[1];// 流水号
		if(snMsg==''){
			snMsg = snMessage;
		}
		if(typeof(_contentObj) != 'undefined'){
			parent.$("#contentZWID").val(_contentObj.id);
			parent.$("#bodyType").val(_contentObj.contentType);// 正文类型
			parent.$("#tembodyType").val(_contentObj.contentType);
			
			if(_contentObj.contentType == 20){
				parent.$("#formRecordid").val(_contentObj.contentDataId);// 表单
			}
			parent.$("#formAppid").val(_contentObj.contentTemplateId);// 表单Appid
			parent.$("#contentSaveId").val(_contentObj.id)// 正文的ID 保存待发的时候要用
			parent.$("#contentRightId").val($("#rightId", contentDiv).val());
			// 以下两个在存个人模板的时候有用到
			parent.$("#contentDataId").val(_contentObj.contentDataId);
			parent.$("#contentTemplateId").val(_contentObj.contentTemplateId);
		}else{
			// 转发的表单撤销重新发送的时候
			parent.$("#contentZWID").val($("#id",contentDiv).val());
			parent.$("#bodyType").val($("#contentType",contentDiv).val());// 正文类型
			parent.$("#tembodyType").val($("#contentType",contentDiv).val());
			parent.$("#formRecordid").val($("#contentDataId",contentDiv).val());//表单
			parent.$("#contentSaveId").val($("#id".contentDiv).val());//正文的ID 保存待发的时候要用
			parent.$("#contentRightId").val($("#rightId", contentDiv).val());
			// 以下两个在存个人模板的时候有用到
			parent.$("#contentDataId").val($("#contentDataId",contentDiv).val());
			parent.$("#contentTemplateId").val($("#contentTemplateId",contentDiv).val());
		}
		if (callbk) {
			callbk(domains,snMsg);
		}
	};
	
	
	function formDevelopAdance4ThirdParty(bodyType,affairId,attitude,opinionContent,currentDialogWindowObj,succesCallBack,fnx$) {
		try{
			if(bodyType != '20' ){
				succesCallBack();
			}else {
				parent.beforeSubmit(affairId, $.trim(attitude), $.trim(opinionContent),currentDialogWindowObj,succesCallBack,failedCallback);
			}
		}catch(e){
			alert("表单开发高级异常!"+e.message);
		}
	}
	
	var saveContentFunc = function(){
		var needcheckNullFlag = null;
		// 是否校验重复行
		var needCheckRepeatData = true;
		var needCheckRule = true;
		if (optType
				&& (optType == 'saveAs' || optType == 'stepBack'
						|| optType == 'stepStop' || optType == 'repeal'
						    || optType == 'saveAsTemplate')) {// 终止,撤销,回退
			needcheckNullFlag = false;
			needCheckRepeatData = false;
			if(optType == 'saveAs' || optType == 'saveAsTemplate'){
				needCheckRule = false;
			}
		}
		saveOrUpdate({
			"mainbodyDomains" : domains,
			"needSubmit" : true,
			"success" : cb,
			"checkNull" : needcheckNullFlag,
			"failed" : failedCallback,
			"needCheckRule":needCheckRule,
			"needCheckRepeatData":needCheckRepeatData,
			"optType":optType
		});
	}
	
	var workflowFunc = function(){
		if (parent.useWorkflow == "true") {
			parent.$.content.getWorkflowDomains($("#moduleType", contentDiv).val(),
					domains);
			if (optType == 'send') {
				parent.$.content.callback.workflowNew = function() {
					saveContentFunc(domains);
				};
				parent.$.content.callback.workflowFinish = function() {
					saveContentFunc(domains);
				};
				calBackTag = false;// 表单的校验规则为非强制校验时需要的参数。by wangh
				preSubmitData(function() {
					function successCallback4ThirdParty(){
						var formContentId = "";
						var formAppid= "";
						var formId= "";
						var formOperationId= "";
						var myAppName= parent.moduleTypeName;
						if ($("#contentType").val() == 20) {
							formContentId = $("#contentDataId",getMainBodyDataDiv$()).val();
							formAppid = $("#formAppid",parent.window.document).val();
							formOperationId = $("#formOperationId",parent.window.document).val();
							myAppName= "form";
						}
						if(!parent.executeWorkflowBeforeEvent("BeforeStart","","",parent.wfProcessTemplateId,"","start",formContentId,myAppName,formAppid,formId,formOperationId)){
							return;
						}
						
						//自由协同 不执行预提交，性能优化，只有模板协调才执行预提交
						if(templateId == "0" || templateId == "-1" || templateId == ""){ 
							saveContentFunc(domains);
						}else{
							parent.preSendOrHandleWorkflow(parent.window, parent.wfItemId, parent.wfProcessTemplateId,
									parent.wfProcessId, parent.wfActivityId, parent.CurrentUserId, parent.wfCaseId,
									parent.loginAccount, formContentId, parent.moduleTypeName, parent.$(
									"#process_xml").val(), false);
						}
						
					}
					formDevelopAdance4ThirdParty($("#contentType").val(),$("#contentDataId").val(),"start",$("#rightId").val(),null,successCallback4ThirdParty,null);
				}, failedCallback, true);
			} else if (saveContentFunc) {
				saveContentFunc(domains);
				if (optType == 'saveAs') {
					var contentType = $("#contentType", contentDiv).val();
					if ((contentType > 40 && contentType < 50) && $("#moduleType").val() != '32') {
						fileId = getUUID();
						$("#contentDataId", contentDiv).val(fileId);
					}
				}
			}
		} else {
			saveContentFunc(domains);
		}
	}
	workflowFunc();
	
};

// 正文组件打获取正文切换Toolbar定义实现
var _mt_toolbar_id = "", _lastMainbodyType, _mainbodyOcxObj, _clickMainbodyType;
$.content.getMainbodyChooser = function(toolbarId, defaultType, callBack) {
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
				$.content.switchContentType(cmt, function() {
					if (_lastMainbodyType)
						$("#" + _mt_toolbar_id).toolbarEnable(
								"_mt_" + _lastMainbodyType);
					$("#" + _mt_toolbar_id).toolbarDisable("_mt_" + cmt);
					_lastMainbodyType = cmt;
					
					callBack(cmt);
				});
			} else {
				$.content.switchContentType(cmt, function() {
					if (_lastMainbodyType)
						$("#" + _mt_toolbar_id).toolbarEnable(
								"_mt_" + _lastMainbodyType);
					$("#" + _mt_toolbar_id).toolbarDisable("_mt_" + cmt);
					_lastMainbodyType = cmt;
				});
			}
		};
		try {
			if ($.ctx.isOfficeEnabled(mt)==true || $.ctx.isOfficeEnabled(mt)=="true")
				r.push(mtCfg[i]);
		} catch (e) {
		}
	}
	return r;
};

$(function() {
	$('#' + getMainBodyHTMLDiv() + ' a').each(
			function() {
				if (this.target == '' && this.href
						&& (this.href.indexOf('http') == 0)) {
					this.target = '_blank';
				}
			});
});

var _fckEditorDecentHeight = false;
$(function() {
	if ($.v3x.isMSIE && _isModalDialog) {
		$("input,textarea").keydown(function(e) {
			if (e.ctrlKey && e.keyCode == 65) {
				this.select();
			}
		});
	}
	if (getParameter("isFullPage") == "true") {
		if (($.v3x.isMSIE8 || $.v3x.isChrome)
				&& $("#moduleType", getMainBodyDataDiv$()).val() == '3'
				&& $("#contentType", getMainBodyDataDiv$()).val() == '10'
				&& $("#viewState", getMainBodyDataDiv$()).val() == '1') {
			_fckEditorDecentHeight = true;
		}
	}
});
// 320升级上来的打开转发之后表单协同内部的关联文档接口
function openDetail(object,url){
    var _url = _ctxPath + "/collaboration/collaboration.do?method=summary&"+url;
    var rv = v3x.openWindow({
        url: _url,
        dialogType:'open',
        workSpace: 'yes'
   });
}
function deleteContentById(){
	var mgr = new ctpMainbodyManager();
	mgr.deleteById(parent.$("#contentZWID").val()+"");
}

function getContentIdByModuleIdAndType(type,cModuleId){
	var mgr = new ctpMainbodyManager();
	var obj = new Object();
	obj.moduleType=type;
	obj.moduleId = cModuleId;
	var reMap = mgr.getByModuleIdAndType(obj);
	return reMap.contentId;
}

function _keyDown(e) {
	var code;   
	if (!e){ var e = window.event;}   
	if (e.keyCode){
		code = e.keyCode;
	}else if (e.which){
		code = e.which;
	}
	if ((event.keyCode == 8||event.keyCode == 13)&& ((event.srcElement.type != "text" && event.srcElement.type != "textarea" &&  event.srcElement.type != "password")||  event.srcElement.readOnly == true)) {
		event.keyCode = 0; 
		event.returnValue = false;
	}
	return true;
}