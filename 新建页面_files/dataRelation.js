var pageX = {
        hasLoadInit : false,
        repeatTime : 10//尝试重试最大次数
};

$(function(){
    
	//是否是需要点击图标才加载相关数据的模式
	var isIconClkMode =  window.openFrom == "newColl" ? false : true;
	
	if(isIconClkMode){
		$(".guanlian").click( __guanlianIconClkFunc);
	}
	else{

	    if(window.openFrom == "newColl" && window.bodyType == "20" && !pageX.formMasterId){
	        //新建表单的时候没有masterId，这个时候动态刷新右则数据关联表单区域/初始化表单区域读取一些表单的预置数据有问题，等正文加载完毕之后再处理。
	    }else{
	        //IE8加载顺序解决方式
	        _init_();
	    }
	}
	
});


//初始化方法
function _init_(){
    
    if(pageX.hasLoadInit){
        return;
    }
    
    pageX.hasLoadInit = true;

    var glContainer = document.getElementById("guanlian_info_div"); 
    if(!glContainer){
        //没有dom元素, IE在没有缓存的情况下，不知道为什么找不到dom， 进行重试机制
        if(pageX.repeatTime > 0){
            pageX.repeatTime = pageX.repeatTime - 1;
            pageX.hasLoadInit = false;
            setTimeout(_init_, 1000);
        }
        return;
    }
    
    pageX.drAreaVisible = typeof(newColl)!="undefined"? newColl : false;//数据关联区域是否可见
//    pageX.ajaxM = new dataRelationManager();
    pageX.poList = [];//配置文件对象列表
    pageX.po2DataListMap = {};//配置对象id和查询数据map
    var _templateId = typeof(templateId) == "undefined" ? "-1": templateId;
    var sysTemplateId = typeof(systemTemplateId) == "undefined" ? "-1": systemTemplateId;

    if(typeof(newColl) != "undefined"){
        _templateId = sysTemplateId;
    }

    var activityId = typeof(_summaryActivityId) == "undefined" ? "-1": _summaryActivityId;
    if(affairState == "2" || affairState == "1"){//待发，已发
        activityId = "start";
    }
    pageX._activityId = activityId;
    pageX._templateId = _templateId;
    pageX.formMasterId = formRecordid;
    pageX.clkCounter = clickCounter();
    pageX.ajaxReqM = ajaxRequestManager();
    pageX.chartCount = 0;//图表计数
    pageX.poId2ItemValueMap = {};//表单统计和表单查询的查询条件与查询值的对应关系
    pageX._formAppid = typeof(formAppid) == "undefined" ? "-1": formAppid;
    var canCopy1 = typeof(canCopy) == "undefined" ? "-1": canCopy;
    pageX.canCopy = canCopy1;
    
    if(window.openFrom == "newColl"){
        //新建页面进行展现
        dataRelation4Template();
    }
    
    //初始化各种数据对应的展现形式
    var params = {};
    params.templateId = _templateId;
    params.activityId = activityId;
    params.DR = DR;
    params.affairId = affairId;
    params.projectId = projectId;
    params.summaryId = summaryId;
    params.memberId = _affairMemberId;
    params.senderId = senderId;
    params.nodePolicy = nodePolicy;
    
    pageX.params = params;
    
    if(_templateId != "-1" && _templateId != ""){//模板数据
        
        pageInit();
        
        callBackendMethod("dataRelationManager","findRelationDatasByDR",params,{
	    	success:function(rval){
	    		 pageX.poList = rval;
	             //初始化所有标题和数据区域
	             initTitles(rval);
	             pageX.ajaxReqM.requestAll(pageX.poList);
	    	}
        });
    }else{
        if (typeof (affairState) != "undefined" && (affairState == 3 || affairState == 4 || affairState == -1)){//自由协同
            defaultConfig();
        }else{
            $(".guanlian_info").hide();
        }
    }
    
    document.body.onbeforeunload = function(){// submit时屏蔽提示
        if(removeCtpWindow)removeCtpWindow(null,2);
    };
}

function dataRelation4Template(){
    $(".guanlian").hide();
    $(".guanlian_msg").show("fast");
    $("#closeBtn").hide();
}

//新建表单页面需要等正文加载完成后再执行数据加载
function _onFormLoaded(){
    if(window.openFrom == "newColl" && window.bodyType == "20" && !pageX.formMasterId){
        //IE8加载顺序解决方式
        _init_();
    }
}

function contentLoadCallBack(){
	var zframe = null;
	//绑定表修改事件
	if(typeof(componentDiv)!= "undefined"){
		if(componentDiv.zwIframe){
			zframe = componentDiv.zwIframe;
		}
	}else if(typeof(zwIframe)!="undefined"){
		zframe = zwIframe;
	}
	if (zframe) {
		zframe.onload = function(){ 
			if(zframe.window.$){
				var ctp =  zframe.window.$.ctp;
				if(ctp && ctp.bind){
					//改变事件
					ctp.bind('afterFormFieldChange',function(o){   
						var formData = {};
						formData[o.id] = o.value;
						try{
							formChangeEvent(formData,"change"); 
						}catch(e){}
					});
					//计算事件
					ctp.bind('afterFormFieldCalc',function(o){ 
						var formData = {};
						formData[o.id] = o.value;
						try{
							formChangeEvent(formData,"calcChange"); 
						}catch(e){}
					});
				}
			}
		}
	}
}

function defaultConfig(){
	pageInit();
    
    var summaryId = pageX.params.summaryId;
    var affairId = pageX.params.affairId;
	var projectId = pageX.params.projectId;
	var memberId = pageX.params.memberId;
	var activityId = pageX.params.activityId;
    
	
	//初始化各种数据对应的展现形式
	callBackendMethod("dataRelationManager","findSelfCollConfig",summaryId,affairId,activityId,projectId,memberId,{
    	success:function(rval){
    		//待发编辑页面不显示“我发起”与“发起给我”的栏目
    		var new_rval = new Array();
    		if(affairState == '-1'){
    			for(var i = 0 ; i < rval.length ; i++){
    				var obj = rval[i];
    				if(obj.id != '10000' && obj.id != '10001'){
    					new_rval.push(obj);
    				}
    			}
    		}else{
    			new_rval = rval;
    		}
    		pageX.poList = new_rval;
    		//初始化所有标题和数据区域
    		initTitles(new_rval);
    		//加载数据
    		pageX.ajaxReqM.requestAll(pageX.poList);
    		$(".guanlian_msg .msg_title #data_msg").html($.i18n('datarelation.title2.js'));
    	}
    });
	
	//设置整体标题
}

/**
 * 当前页面的上下文
 */
function initContext(){
	pageX.area = $(".guanlian_info");//数据关联区域
	pageX.fillArea = pageX.area.find(".msg_body_info");//填充数据区域
	pageX.tplHtml = {
		"listTpl" : pageX.area.find("#listTpl").html(), 
		"tabTpl" : pageX.area.find("#tabTpl").html(),
		"vTabTpl" : pageX.area.find("#vTabTpl").html(),
		"imgTpl":pageX.area.find("#imgTpl").html(),
		"tab2img":pageX.area.find("#tab2img").html()
	};// 模板html
}

/**
 * 初始化所有数据区域的标题头部
 */
function initTitles(poList){
	if(poList != null && typeof(poList) != 'undefined'){
	   
	    var toShowCopyNote = false;
		
	    //填充数据块名称
		for (var i = 0; i < poList.length; i++) {
			var po = poList[i];
			var tpl = $("<div>"+getTpl(po.dataTypeName).tplHtml+"</div>");
			var ul = tpl.find("ul");
			ul.attr("id",po.id);
			var title = ul.find(".msg_ul_title");
			$("span[class='title_span']", title).attr("title",po.subject).text(getSubStr(po.subject,35));
			
			$noteDiv = $("#copyFormNote", title);
			if(po.dataTypeName != "templateSend" || window.openFrom != "newColl"){
			    $noteDiv.remove();
			}else{
			    $noteDiv.attr("id", "copyNote" + po.id);
			    toShowCopyNote = true;
			}
			if(!po.showMore){
				ul.find("#amore").hide();
			}
			switch (po.dataTypeName) {
				case "templateSend":
				case "templateDeal":
					break;
				case "traceWorkflow":
				case "outSystem":
					ul.find("#amore").hide();
					break;
				case "project":
				case "doc":
				case "formStat":
				case "formSearch":
				default:
			}
			
			var ctpTop =  getCtpTop();
			title.find("#amore").attr({"title":$.i18n('datarelation.open.win.more.js'),"pid":po.id,"onclick":"openMoreWin(this);"});
			pageX.fillArea.append(ul);
		}
		
		//tooltip提示
		if(toShowCopyNote){
		    var tipDesc = $.i18n("datarelation.note.copyform.title.js")
		                   + "<br/>"
		                   + $.i18n("datarelation.note.copyform.note1.js")
		                   + "<br/>"
		                   + $.i18n("datarelation.note.copyform.note2.js");
		                   /*+ "<br/>"
		                   + $.i18n("datarelation.note.copyform.note3.js")*/
		    var div_tipDesc = "<div style='font-size:12px; color:green;'>"+tipDesc+"</div>";
		    pageX.tooltipObj = null;
		    
		    $(".copyFormNote", pageX.fillArea).each(function(){
		          var $this = $(this);
		        $this.mouseenter(function () {
		            var _targetId = $this.attr("id").replace("#", "");
		            var tipOptions = {
		                        event:true,
		                        direction: 'TR',
		                        msg : div_tipDesc,
		                        targetId: _targetId
		                }
		            pageX.tooltipObj = new MxtToolTip(tipOptions);
		            pageX.tooltipObj.setPoint(null,null);
		            pageX.tooltipObj.show();
		        }).mouseleave(function() {
		            if(pageX.tooltipObj){
		                pageX.tooltipObj.close();
		                pageX.tooltipObj = null;
		            }
		        });
		        
		        $(this).tooltip({
		                singleTon : false,
		                event:false,
		                direction: 'TR',
		                msg : div_tipDesc
	            })
		    });
		}
	}
	
	//设置整体标题
	$(".guanlian_msg .msg_title #data_msg").attr("title",$.i18n('datarelation.title2.js')).html($.i18n('datarelation.title2.js'));
}

/**
 * 加载头部下面的数据块区域
 * @param id2DataMap po的id和po对象的map集合
 */
function loadArea(id2DataMap){
	for(var poId in id2DataMap) {
		var po = getConfigById(poId);
		if (po) {
			var tpl = pageX.fillArea.find("ul[id=" + po.id + "]");
			if (tpl.length == 1) {
				var dataList = id2DataMap[poId];
				tpl.find(".loading_li").show();
				tpl.children("li[class=table_li]").remove();
				tpl.children("li[class=chart_li]").remove();
				if (dataList) {//初始化配置对象和数据的关联
					pageX.po2DataListMap[po.id] = dataList;
					fillRow(po.dataTypeName,dataList,tpl,po);
				} else {// 如果是表单查询和表单统计，表示没权限,更多置灰
					switch (po.dataTypeName) {
						case "formStat":
						case "formSearch":
							//tpl.find("#amore").hide();
							tpl.remove();//将整个区域去除
							break;
						default:
					}
				}
				//隐藏loading
				tpl.find(".loading_li").hide();
			}
		}
	}
}

/**
 * @param dataType 数据类型
 * @param data 填充的数据
 * @param tpl 填充到那个对象里面
 */
function fillRow(dataType, dataList, tpl, po) {
	var tplType = getTpl(dataType);
	var width = (window.openFrom == "newColl" ? 330 : 341) - 20 - 20; // 每一项左右10px, 滚动条20px
	if (tplType.type == "list") {
		var li = tpl.find("div.display_none");
		var html = li.html();
		for (var i = 0; i < dataList.length; i++) {
			var data = dataList[i];
			var row = $(html);
			var t = getTitle(dataType,data,35, width);
			row.find("span:first").after(t.text);
			row.attr({"title":t.title,"pid":po.id,"index":i,"onclick":"openWin(this);"});
			if(data.affair && data.affair.formAppId != null && data.affair.formAppId == pageX._formAppid && pageX._activityId == "start"){//发起节点,同一个表单的数据
				if(data.affair.formRecordid != null && affairState != "2" && affairState != "1"){//待发，已发
					row.find("#copyToForm").attr({"formAppid":data.affair.formAppId,"formRecordid":data.affair.formRecordid});
				} else {
					row.find("#copyToForm").remove();
				}
			} else {
				row.find("#copyToForm").remove();
			}
			if(pageX.canCopy!="-1" && pageX.canCopy == "false") {
			    row.find("#copyToForm").remove();
			}
			tpl.append(row);
		}
	} else if (tplType.type == "tab") {
		var urlFieldAndImageField = po.urlAndImgField;
		var urlFieldList = [];
		var imageDisList = [];
		if(urlFieldAndImageField != [] && urlFieldAndImageField != null && typeof(urlFieldAndImageField) != 'undefined'){
			try{
				urlFieldList = urlFieldAndImageField["urlFieldList"];
				imageDisList = urlFieldAndImageField["imageDisList"];
			}catch(e){
			}
		}
		
		var showColFieldList = po.showColFieldList;//显示属性列表
		var showColNameList = po.showColNameList;//显示列名列表
		var header2field = [];//属性和标题文本名称
		for (var i = 0; i < showColNameList.length; i++) {
			var colName = showColNameList[i];
			for (var j = 0; j < showColFieldList.length; j++) {
				var field = showColFieldList[j];
				if (colName == field.name) {
					var pIndex = colName.indexOf(".");
					if (pIndex != -1) {
						colName = colName.substr(pIndex + 1);
					}
					header2field.push({"fieldCode":colName,"fieldTxt":field.value});
					break;
				}
			}
		}
		
		if(po.vertical && dataList.length <= 1){//单行数据转置显示
			var li = tpl.find("#vTab");
			var tr = li.find("tr:first");
			var trs = [];
			var data = dataList.length < 1 ? {} : dataList[0];
			for (var i = 0; i < header2field.length; i++) {
				var fieldCode = header2field[i].fieldCode;
				tr.find("th").attr("title",header2field[i].fieldTxt).html(getLimitLength(header2field[i].fieldTxt, 15));//标题
				
				var val = data[fieldCode];
				var tempTitle = val; 
				if (val == "" || val == null) {
					val ="&nbsp;";
				}else{
					var isUrl = false;
					var isDisImage = false;
					if(urlFieldList){
			            for(iUrl in urlFieldList){
			                if(urlFieldList[iUrl] == fieldCode){
			                    isUrl = true;
			                    break;
			                }
			            }
			        }
			        if(imageDisList){
			            for(imgj in imageDisList){
			                if(imageDisList[imgj] == fieldCode){
			                    isDisImage = true;
			                    break;
			                }
			            }
			        }
			        if(isUrl){
			            val ='<a class="noClick" href='+val+' target="_blank">'+val+'</a>';
			        }else if(isDisImage && val != "" && val != "&nbsp;" ){
			            var imgSrc = _ctxPath+"/fileUpload.do?method=showRTE&fileId="+val+"&expand=0&type=image";
			            val = "<img class='showImg' src='"+imgSrc+"' height=25 />";
			        }else{
			        	val = escapeStringToHTML(val);
			        }
				}
				//数据
				isDisImage ? tr.find("td").attr("title","").html(val) : tr.find("td").attr("title",tempTitle).html(val);
				trs.push(tr.prop("outerHTML"));
			}
			

			if (header2field.length > 0) {
				var _li = $(li.html());
				_li.find("table").html(trs.join(""));
				tpl.append(_li);
			}
		} else {
			var li = tpl.find("#tab");
			//生成标题
			var head = li.find("tr:first");
			var th = $(head.html());
			var heads = [];
			for (var i = 0; i < header2field.length; i++) {
				var thHtml = th.attr("title",header2field[i].fieldTxt).html(header2field[i].fieldTxt).prop("outerHTML");
				heads.push(thHtml);
			}
			//生成数据
			var row = li.find("tr:last");
			var tr = $(row.prop("outerHTML"));
			var td = row.find("td");
			var trs = [];
			for (var i = 0; i < dataList.length; i++) {
				var data = dataList[i];
				var tds = [];
				for (var j = 0; j < header2field.length; j++) {
					var fieldCode = header2field[j].fieldCode;
					var val = data[fieldCode];
					var isUrl = false;
					var isDisImage = false;
					if(urlFieldList){
			            for(urlI in urlFieldList){
			                if(urlFieldList[urlI] == fieldCode){
			                    isUrl = true;
			                    break;
			                }
			            }
			        }
			        if(imageDisList){
			            for(imgj in imageDisList){
			                if(imageDisList[imgj] == fieldCode){
			                    isDisImage = true;
			                    break;
			                }
			            }
			        }
			        if(isUrl){
			            val ='<a class="noClick" href='+val+' target="_blank">'+val+'</a>';
			        }else if(isDisImage && val != ""){
			            var imgSrc = _ctxPath+"/fileUpload.do?method=showRTE&fileId="+val+"&expand=0&type=image";
			            val = "<img class='showImg' src='"+imgSrc+"' height=25 />";
			        }else{
			        	val = getLimitLength(data[fieldCode], 20);
			        	val = escapeStringToHTML(val);
			        }
			        var title = isDisImage ?"":data[fieldCode] ;//图片枚举不显示title
			        td.attr("title",title);
					tds.push(td.html(val).prop("outerHTML"));
				}
				trs.push(tr.html(tds.join("")).prop("outerHTML"));
			}
			var _li = $(li.html());
			var _head = $(head.prop("outerHTML"));
			_li.find("table").html(_head.html(heads.join("")).prop("outerHTML") + trs.join(""));
			tpl.append(_li);
		}
	}else if(tplType.type == "img"){//外部系统
		var li = tpl.find(".display_none");
		for (var i = 0; i < dataList.length; i++) {
			var data = dataList[i];
			//img src
			if(data){
				var _li = $(li.html());
				var contentLen =  62;
				if (data.subject != "" && data.content != null) {
					if(data.imgSrc){
						var imgUrl = _ctxPath + "/fileUpload.do?method=showRTE&type=image&fileId="+data.imgSrc+"&createDate="+data.imgDate;
						_li.find("img").attr({"title":data.subject,"pid":po.id,"index":i,"onclick":"openWin(this);","src":imgUrl});
						_li.find("p").css("line-height", "30px");
						//_li.find("p").removeClass("chart_title_p").addClass("chart_title");
					}else{
						var _content =  data.content == null? "":data.content;
						var img = _li.find("p").removeClass("chart_title")
						                       .addClass("chart_title_p")
						                       .after("<span pid='"+po.id+"' index='"+i+"' onclick='openWin(this);' title='"+_content+"'>"+escapeStringToHTML(getLimitLength(_content, 145))+"</span>");
						_li.find("td[class='chart_img_td']").remove();
						contentLen =25;
					}
				
					//title
					var t = getTitle(dataType,data,contentLen, width);
					_li.find("p").attr({"title":t.title,"pid":po.id,"index":i,"onclick":"openWin(this);","title":t.title}).html(escapeStringToHTML(t.text));
					tpl.append(_li);
				}
			}
		}
	}else if(tplType.type == "tab2img" && dataList.report){//表单统计专用，图形和列表混合
		var hearders = dataList.report.hearders;
		var datas =  dataList.report.datas;
		var showColFieldList = po.showColFieldList;//显示列名列表
		
		//显示的列
		var showColFieldNameList = [];
		if(showColFieldList && showColFieldList.length > 0){
		    for(var i = 0, l = showColFieldList.length; i < l; i++){
		        showColFieldNameList.push(showColFieldList[i].display);
		    }
		}
		
		//pageSize统计不能分页， 通过js进行处理
		var tempLength = datas.length;
		if(tempLength > po.pageSize){
		    tempLength = po.pageSize;
		    var newDatas = [];
		    for(var i = 0; i < tempLength; i++){
		        newDatas.push(datas[i]);
		    }
		    datas = newDatas;
		}
		
		if (po.showTable == 1 && po.vertical2 && tempLength <= 1) {// 单行数据转置显示
            var li = tpl.find("#vTab");
            // 标题数据转置
            var vHearders = [];
            for (var i = 0; i < hearders.length; i++) {
                for (var j = 0; j < hearders[i].cells.length; j++) {
                    if (vHearders[j] == null) {
                        vHearders[j] = {
                            "cells" : []
                        };
                    }
                    vHearders[j]["cells"][i] = hearders[i].cells[j];
                }
            }

            // 生成标题
            var head = li.find("tr:first");
            var th = $(head.find("th").prop("outerHTML"));
            var td = $(head.find("td").prop("outerHTML"));
            var _head = $(head.prop("outerHTML"));
            
            //转置算法
            var tablaDatas = [];
            var headerColCount = 0;
            for(var i = 0,len = hearders.length; i < len; i++){
                var tRow = hearders[i];
                var tCols = tRow.cells;
                var tempColCount = 0;
                for (var j = 0; j < tCols.length; j++) {
                    tCols[j]._isHeader = true;
                    var cSpan = tCols[j].colSpan;
                    if (cSpan) {
                        cSpan = parseInt(cSpan, 10);
                    } else{
                    	cSpan = 1;
                    }
                    tempColCount += cSpan;
                }
                headerColCount = Math.max(headerColCount, tempColCount);
                tablaDatas.push(tRow);
            }
            if (datas.length > 0) {
            	for(var i = 0,len = datas.length; i < len; i++){
            		var tRow = datas[i];
            		var tCols = tRow.cells;
            		for (var j = 0; j < tCols.length; j++) {
            			tCols[j]._isHeader = false;
            		}
            		tablaDatas.push(tRow);
            	}
            }else{
        		var tempRow = {};
        		var tempCells = [];
    			for (var i = 0; i < headerColCount; i++) {
    				tempCells.push({"colspan" : 1,
                        "rowspan" : 1,
                        "display" : "",
                         "_isHeader" : false});
    			}
    			tempRow["cells"] = tempCells;
    			tablaDatas.push(tempRow);
            }
            
            //坐标，标记td
            var racts = [];
            for (var i = 0,len = tablaDatas.length; i < len; i++) {
                var tRow = tablaDatas[i];
                var tCols = tRow.cells;
                for (var j = 0; j < tCols.length; j++) {
                    var tCol = tCols[j];
                    var rSpan = tCol.rowSpan;
                    if (rSpan) {
                        rSpan = parseInt(rSpan, 10);
                    } else {
                        rSpan = 1;
                    }
                    var cSpan = tCol.colSpan;
                    if (cSpan) {
                        cSpan = parseInt(cSpan, 10);
                    } else {
                        cSpan = 1;
                    }

                    var cellObj = {
                        "cell" : tCol,
                        "read" : false,
                        "isHeader" : tCol._isHeader,
                        "colspan" : rSpan,
                        "rowspan" : cSpan
                    };

                    for (var kr = 0; kr < rSpan; kr++) {

                        for (var kc = 0; kc < cSpan; kc++) {
                            var tempCol = j + kc;
                            if (typeof racts[i + kr] == 'undefined') {
                                racts[i + kr] = [];
                            }
                            while (typeof racts[i + kr][tempCol] != 'undefined') {
                                tempCol++;
                            }
                            racts[i + kr][tempCol] = cellObj;
                        }
                    }
                }
            }
            
            //转置Table
            var newRacts = [];
            for (var i = 0; i < racts.length; i++) {
                for (var j = 0; j < racts[i].length; j++) {
                    if (!newRacts[j]) {
                        newRacts[j] = [];
                    }
                    newRacts[j][i] = racts[i][j];
                }
            }
            
            //转置后展示
            var heads = [];
            for (var i = 0; i < newRacts.length; i++) {
                var headThs = [];
                for (var j = 0; j < newRacts[i].length; j++) {
                    var tCell = newRacts[i][j];
                    if (tCell['read'] === false) {
                        tCell['read'] = true;
                        
                        var tHtml = "";
                        var cell = tCell.cell;
                        if(tCell.isHeader){
                            tHtml = th.attr({
                                "colspan" : tCell['colspan'],
                                "rowspan" : tCell['rowspan'],
                                "title" : cell.display
                            }).html(escapeStringToHTML(cell.display)).prop("outerHTML");
                        }else{
                            tHtml = td.attr({
                                "colspan" : tCell['colspan'],
                                "rowspan" : tCell['rowspan'],
                                "title" : cell.display
                            }).html(escapeStringToHTML(cell.display)).prop("outerHTML");
                        }
                        headThs.push(tHtml);
                    }
                }
                heads.push(headThs.join(""));
            }
            var trs = [];
            for (var i = 0; i < heads.length; i++) {
                trs.push(_head.html(heads[i]).prop("outerHTML"));
            }

            var _li = $(li.html());
            _li.find("table").html(trs.join(""));
            tpl.append(_li);
            
    } else if(po.showTable == 1){
			var li = tpl.find("#tab");
			//生成标题
			var head = li.find("tr:first");
			var th = $(head.html());
			var heads = [];
			var _head = $(head.prop("outerHTML"));
			
			for (var i = 0; i < hearders.length; i++) {
				var row = hearders[i];
				var headThs = [];
				for (var j = 0; j < row.cells.length; j++) {
					var cell = row.cells[j];
					var thHtml = th.attr({"colspan":cell.colSpan,"rowspan":cell.rowSpan,"title":cell.display}).html(escapeStringToHTML(cell.display)).prop("outerHTML");
					headThs.push(thHtml);
				}
				heads.push(_head.html(headThs.join("")).prop("outerHTML"));
			}
			
			//生成数据
			var row = li.find("tr:last");
			var tr = $(row.prop("outerHTML"));
			var td = row.find("td");
			var trs = [];
			for (var i = 0; i < datas.length; i++) {
				var row = datas[i];
				var tds =[];
				for (var j = 0; j < row.cells.length; j++) {
					var cell = row.cells[j];
					var tdHtml = td.attr({"colspan":cell.colSpan,"rowspan":cell.rowSpan,"title":cell.display}).html(escapeStringToHTML(getLimitLength(cell.display,22))).prop("outerHTML");
					tds.push(tdHtml);
				}
				trs.push(tr.html(tds.join("")).prop("outerHTML"));
			}
			
			var _li = $(li.html());
			_li.find("table").html(heads.join("") + trs.join(""));
			tpl.append(_li);
		}
		
		
		//生成统计图
		var chartList = dataList.chartList;
		if (chartList && po.showChart == 1) {// 显示图表
			var li = tpl.find("#img[class='display_none']");
			var chartDiv = li.find("#chartIndex");//图表对象
			var chartTitleP = li.find(".chart_title");
			var charItemNameList = po.formCondMap.charItemNameList;
			var chartData = [];
			var chartHtml = [];
			for (var i = 0; i < po.chartItemList.length; i++) {
				var chartItem = po.chartItemList[i];
				var chartJson = null;
				var chartTitle = null;
				var chartType = null;
				for (var j = 0; j < chartList.length; j++) {
					var chart = chartList[j];
					if(chartItem.imgId == chart.id ){
						chartJson = $.parseJSON(chart.chartJSON);
						chartType = chartItem.type;	
						break;
					}
				}
				
				for (var j = 0; j < charItemNameList.length; j++) {
					var chart = charItemNameList[j];
					if(chartItem.imgId == chart.chartId){
						//找到图对应的标题。
						chartTitle = chart.title;
						break;
					}
				}
				
				if(chartJson != null && !isEmptyData(chartJson.option)){
					pageX.chartCount++;
					chartTitleP.html(escapeStringToHTML(chartTitle));//标题
					chartDiv.attr("id","chartIndex"+pageX.chartCount);
					chartHtml.push(li.html());
					chartData.push({"type":chartType,"json":chartJson.option,"id":"chartIndex"+pageX.chartCount});
				}
			}
			chartDiv.attr("id","chartIndex");
			tpl.append(chartHtml.join(""));
			
			var cMinWidth = 277;
			var cMaxWidth = 450;
			var cMinSize = 4;
			var cMaxSize = 8;
			var cWidthStep = 50;
			
			for (var j = 0; j < chartData.length; j++) {
				var d =  chartData[j];
				
				//更具数据列， 适当调整宽度
				if(d && d.json && d.json.legend && d.json.legend.data){

				    var labelData = d.json.legend.data;
				    var finalSize = Math.min(cMaxSize, labelData.length);
				    if(finalSize > cMinSize){
				        var finalWidth = cMinWidth + (finalSize - cMinSize) * cWidthStep;
				        finalWidth = Math.min(finalWidth, cMaxWidth);
				        var charEle = document.getElementById(d.id);
				        charEle.style.width = finalWidth + "px";
				    }
				}
				
				if(d.json){//,"x2":20  ,chart距离左边的距离，x2为距离右边的距离
					d.json["grid"] = {"x":40, "x2":20};
				}				
				drawingChart2(d.type,d.json,d.id,"DataRelation");//OA-128237
				//$("#"+d.id).html("<span style='color:red;'>"+d.id+"&nbsp;type="+d.type+"</span>");
			}
		}
	}
}

function getSubStr(title,len){
	if(title == null){
		return "";
	}
	return getLimitLength(title,len);
}

/**
 * 查看数据
 */
function openWin(_this){
	var ths = $(_this);
	var pId = ths.attr("pid"), index = parseInt(ths.attr("index"));
	var dataList = pageX.po2DataListMap[pId];
	var data = dataList[index];
	var po = getConfigById(pId);
	
	var  baseObjectId = typeof(summaryId) == 'undefined' ? '' : summaryId  ;
	switch (po.dataTypeName) {
		case "selfColl":
			var affairId = data.affairId;
			if(po.sendToOther){
				affairId = callBackendMethod("dataRelationManager","getSenderAffairId",data.summaryId);
			}
			openCtpWindow({"url":_ctxPath + "/collaboration/collaboration.do?method=summary&openFrom=glwd&affairId=" + affairId+"&baseObjectId="+baseObjectId+"&baseApp=1"});
			break;
		case "traceWorkflow":
			openCtpWindow({"url":_ctxPath + "/collaboration/collaboration.do?method=summary&openFrom=repealRecord&affairId=" + data.affairId+"&baseObjectId="+baseObjectId+"&baseApp=1"});
			break;
		case "templateSend":
		case "templateDeal":
			openCtpWindow({"url":_ctxPath + "/collaboration/collaboration.do?method=summary&openFrom=glwd&affairId=" + data.affairId+"&baseObjectId="+baseObjectId+"&baseApp=1"});
			break;
		case "outSystem":
			openCtpWindow({"url":data.url,"id":po.id});
			break;
		case "project":
			turnToUrl("project"+data.id,_ctxPath + "/project/project.do?method=projectSpace&projectId=" + data.id);
			break;
		case "doc":
			if (data.folder) {
				turnToUrl("doc"+data.id,_ctxPath + "/doc.do?method=docHomepageIndex&docResId=" + data.id); 
				return;
			} else {
				var url = _ctxPath + "/doc.do?method=docOpenIframeOnlyId&openFrom=glwd&docResId=" + data.id + "&baseObjectId=&baseApp=1";
				if(opener && opener.openCtpWindow){
					opener.openCtpWindow({"url":url});
				}else{
					openCtpWindow({"url":url});
				}
				return;
			}
		case "formStat":
		case "formSearch":
		default:
			return;
	}
}

function openMoreWin(_this){
	var ths = $(_this);
	var pId = ths.attr("pid");
	var po = getConfigById(pId);
	var top = getA8Top().screen;
	var width = top.width,heigth = top.heigth;
	switch (po.dataTypeName) {
		case "project":
		case "doc":
			pageX.clkCounter.click(po.dataTypeName);
			break;
		default:
	}
	
	switch (po.dataTypeName) {
		case "templateSend":
			openCtpWindow({"height":heigth,"width":width,"url":_ctxPath + "/dataRelation.do?method=templateSendMore&openFrom="+openFrom+"&summaryId="+pageX.params.summaryId+"&pid="+po.id+"&affairId="+affairId + "&templateId="+pageX._templateId+"&formAppid="+pageX._formAppid+"&canCopy="+pageX.canCopy+"&bodyType="+window.bodyType+"&subject="+encodeURIComponent(po.subject),"id":"templateSend"});
			return;
		case "templateDeal":
			openCtpWindow({"height":heigth,"width":width,"url":_ctxPath + "/dataRelation.do?method=templateDealMore&pid="+po.id+"&summaryId="+pageX.params.summaryId+"&senderId="+pageX.params.senderId+"&memberId="+pageX.params.memberId+"&nodePolicy="+encodeURIComponent(pageX.params.nodePolicy)+"&affairId="+affairId+"&templateId="+pageX._templateId+"&subject="+encodeURIComponent(po.subject),"id":"templateDeal"});
			return;
		case "selfColl"://自由协同
			openCtpWindow({"height":heigth,"width":width,"url":_ctxPath + "/dataRelation.do?method=selfCollMore&pid="+po.id+"&summaryId="+pageX.params.summaryId+"&senderId="+pageX.params.senderId+"&memberId="+pageX.params.memberId+"&affairId="+affairId+"&subject="+encodeURIComponent(po.subject)+"&sendToOther="+po.sendToOther,"id":po.id,"id":"selfColl"});
			return;
		case "outSystem":
			openCtpWindow({"height":heigth,"width":width,"url":data.url,"id":"outSystem"});
			return;
		case "project":
			turnToUrl(po.dataTypeName,_ctxPath + "/projectandtask.do?method=projectAndTaskIndex&pageType=project&_resourceCode=F02_projecttask");
			return;
		case "doc":
			turnToUrl(po.dataTypeName,_ctxPath + "/doc.do?method=docIndex&openLibType=1&_resourceCode=F04_docIndex");
			return;
		case "formStat":
				var url = _ctxPath + "/report/queryReport.do?method=index&_resourceCode=F08_reportviewindex";
				if(po.formQueryId){
					url  = _ctxPath + "/report/queryReport.do?method=goIndexRight&masterId="+pageX.formMasterId+"&type=drQuery&affairId="+affairId+"&drPoId="+po.id+"&reportId="+po.formQueryId;
				}
				openFormWin(url, po);
			return;
		case "formSearch":
			var url = _ctxPath + "/form/queryResult.do?method=queryExc&masterId="+pageX.formMasterId+"&type=drQuery&hidelocation=false&affairId="+affairId+"&drPoId="+po.id+"&queryId="+po.formQueryId;
			if (!po.formQueryId) {
				url = _ctxPath + "/form/queryResult.do?method=queryIndex&_resourceCode=T05_formQuery";
			} 
			openFormWin(url, po);
			return;
		default:
			return;
	}
}

/**
 * 打开窗口，参数不能通过url传递，否则会被截取
 */
function openFormWin(url,po){
	
	var condItemList = [];
	var pageCondMap = {};
	if (po.pageCondItemList) {
		for (var i = 0; i < po.pageCondItemList.length; i++) {
			var item = po.pageCondItemList[i];
			var fieldValueCode = "";
			for (var objFieldName in item) {
				if(objFieldName!="leftChar" && objFieldName!="fieldName"
					&& objFieldName!="operation" && objFieldName!="fieldValue"
					&& objFieldName!="rightChar" && objFieldName!="rowOperation" && objFieldName != "trunkFieldName"){//找到值的名称
					if(item.fieldName == objFieldName){
						fieldValueCode = objFieldName;
						break;
					}
				}
			}
			var fname = item.fieldName + fieldValueCode;
			pageCondMap[fname] = item;
		}
	}
	
	if (po.customCondItemList) {
		for (var i = 0; i < po.customCondItemList.length; i++) {
			var item = po.customCondItemList[i];
			var fname =  item.trunkFieldName + item.fieldValue;
			var item2 = null;
			if (pageCondMap[fname] != null) {
				item2 = $.extend(true, {}, pageCondMap[fname]);
			} else {
				item2 = $.extend(true, {}, item);
				item2.fieldValue = null;
			}
			condItemList.push(item2);
		}
	}
	
	
	var winName = "drWin"+Math.abs(po.id),
	    postUrl = "/seeyon/collaboration/collaboration.do?method=cashTransData&_rand=" + new Date().getTime(),
	    width = parseInt(getA8Top().screen.width)-20,
	    height = parseInt(getA8Top().screen.height)-102,
	    winParam = "width="+width+",height="+height + ",top=0, left=0",
	    tParams = {"pageCondJSON" : $.toJSON(condItemList)};
	
	ajaxSubmit(postUrl, tParams, url, winName, winParam);
}

//Post方式提交表单
function ajaxSubmit(postUrl, tParams, openUrl, winName, winParam){
	// 先声明一个异步请求对象
	var xmlHttpReg = null;
	if (window.ActiveXObject) {// 如果是IE
		xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {
		xmlHttpReg = new XMLHttpRequest(); // 实例化一个xmlHttpReg
	}
	// 如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
	if (xmlHttpReg != null) {
	    xmlHttpReg.onreadystatechange = function(){
	        if (xmlHttpReg.readyState == 4 && xmlHttpReg.status == 200) {//4代表执行完成
	        	var cashId = xmlHttpReg.responseText
	            window.open(openUrl + "&cashId=" + cashId, winName, winParam);
	        }
	    }
		xmlHttpReg.open("POST", postUrl, true);
		xmlHttpReg.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"); 
		xmlHttpReg.send(_formatParams(tParams));
	}
};

function _formatParams(data) {
    if(data){
        var arr = [];
        for ( var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        return arr.join("&");
    }else{
        return null;
    }
}

/**
 * 转向特定的url
 * @param typeId
 * @param url
 */
var openerMainFrame = null;
function turnToUrl(typeId,url){
	var _location = {},isConfim = false;
	var rval = {"location":{},"isConfim":false};
	var mainFrame = null;
	if(openerMainFrame){
	    mainFrame = openerMainFrame;
	}else if(opener){
	    mainFrame = opener.frames["main"];
	    if(!mainFrame){
	    //OA-96392 需要向上找主窗口的情况
	        var tempTopWin = opener.getCtpTop ? opener.getCtpTop() : opener.window.top;
	        //向上找
	        mainFrame = tempTopWin.frames["main"];
	        
	        if(mainFrame){
	            openerMainFrame = mainFrame;//重定向父窗口
	        }
	    }
	}
	if (mainFrame && mainFrame.location) {
	    
	    opener && opener.focus();
	    
		pageX.clkCounter.click(typeId);
		_location = mainFrame.location;
	}else{
		if (getCtpTop().frames && getCtpTop().frames["main"]) {
			_location = getCtpTop().frames["main"].location;
			isConfim = true;
		}
	}

	if (isConfim) {
		var confirm = $.confirm({
	        'msg': $.i18n('datarelation.js.confirm.js'),
	        "ok_fn": function(){
	        	_location.href = url;
	        },
	        "cancel_fn":function(){}
	    });
	} else {
		_location.href = url;
	}
}


/**
 * 复制到当前表单模板
 * @param ths
 */
function copyFormData(ths,event){
	try{
		if(contentLoaded && contentLoaded == true){
			contentLoaded = false;
		}
	}catch(e){}
	var tempZwOfficeFrame = $("#zwOfficeIframe");
	var hasLoad="false";
	if(tempZwOfficeFrame){
		hasLoad = tempZwOfficeFrame.attr("hasLoad"); // 获取frame中的hasLoad值
	}
    if (hasLoad == "true") {// 已打开过office正文,先切换到表单视图
		var win = $(window.frames["zwIframe"].document);
		var id = win.find("#viewsTab li:first-child").attr("index");
		var _zwIframe = window.document.zwIframe;
		_zwIframe._viewContentSwitch(this, id,changeViewCallBack);
    }
	var evt = event||window.event;
	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}
	var _this = $(ths);
	var formRecordid = _this.attr("formRecordid");
	copyForm(formRecordid);
}

function copyForm(formRecordid){
  if (!pageX.url) {
      pageX.url = zwIframe.location.href;
  }
	var url = pageX.url + "&openFrom=dataRelation&formRecordid=" + formRecordid+"&summaryId=" + $("#id",$("#colMainData")).val();
	if (zwIframe && zwIframe.location) {
		zwIframe.location.href = url;
	}
}

function openDialog(options){
	var topWindow = getCtpTop();
	var defaultSet = {
		id:'_dr_dialog',
		btnOk : $.i18n('office.auto.ok.js'),
		btnCancel : $.i18n('office.auto.cancel.js'),
		width : 850,
		height : 730,
		hasBtn : true
	};
	
	var opt = $.extend(true, defaultSet, options);
	var transParams = "";
	if (opt.transParams && opt.transParams != null) {
		transParams = opt.transParams;
	}

	var windowParam = {
		id : opt.id,
		url : opt.url,
		targetWindow : topWindow,
		width : opt.width,
		height : opt.height,
		top:opt.top,
		title : opt.title,
		transParams : transParams 
	};

	if (opt.hasBtn) {
		windowParam.buttons = [ {
			text : opt.btnOk,
			isEmphasize:true,
			handler : function() {
				if (typeof (fnOK) !== 'undefined') {
					fnOK({
						dialog : topWindow._officeWin,
						okParam : topWindow._officeWin.getReturnValue()
					});
				}
			}
		}, {
			text : opt.btnCancel,
			handler : function() {
				if (typeof (fnCancel) !== 'undefined') {
					fnCancel({
						dialog : topWindow._officeWin
					});
				}
			}
		} ];
	}
	topWindow._officeWin = $.dialog(windowParam);
}

//在正文组件中找到数据记录ID
function _setFormRecordId(){
    
    var fnx = document.getElementById("zwIframe");
    if(fnx){
        fnx = fnx.contentWindow;
        var dataEle = fnx.document.getElementById("contentDataId");
        if(dataEle){
            pageX.formMasterId = dataEle.value;
        }
    }
}

/**
 * 根据配置，在后台取关联数据
 */
function loadRelationData(ids,map, loadCallback){
    if(!pageX.formMasterId){
        _setFormRecordId();
    }
    
    pageX.params.poIds = ids;
    pageX.params.formMasterId = pageX.formMasterId;
    pageX.params.pageConditions = map;

	callBackendMethod("dataRelationManager","findByDataRelationIds",pageX.params,{
    	success:function(rval){
    		loadArea(rval);
    		for (var i = 0; i < ids.length; i++) {
    			var po = getConfigById(ids[i]);
    			pageX.ajaxReqM.response(po);
    		}
    		//页面刷新后执行回调函数
    		if(loadCallback){
    		    setTimeout(function(){
    		        loadCallback();
    		    }, 50);
    		}
    	}
    });
}

function getTitle(dataType,data,len, width){
    
    width = width - 5;//兼容5px
    
	var title,text;
	switch (dataType) {
		case "selfColl":
		case "templateSend":
		case "templateDeal":
			title = data.subject;
			
		    var iconCount = 0;
		    
		    //加图标
		    //重要程度
		    var importIcon = "";
		    if(data.importantLevel !=""&& data.importantLevel != 1){
		        width = width - ((data.importantLevel - 2) * 4 + 8);
		        importIcon = "<span class='ico16 important"+data.importantLevel+"_16 '></span>";
		    }
		    
		  //流程状态
		   /* var stateIcon = "";
            if(data.state != null && data.state !="" && data.state != "0"){
                iconCount++;
                stateIcon = "<span class='ico16  flow"+data.state+"_16 '></span>" ;
            }*/
		    
		    //附件
            var attIcon = "";
		    if(data.hasAttsFlag == true){
		        iconCount++;
		        attIcon = "<span class='ico16 affix_16'></span>" ;
		    }
		    //协同类型
		    var bodyIcon = "";
		    if(data.bodyType!=""&&data.bodyType!=null&&data.bodyType!="10"&&data.bodyType!="30"){
		        iconCount++;
		        bodyIcon = "<span class='ico16 office"+data.bodyType+"_16'></span>";
		    }
		    
		    //如果设置了处理期限(节点期限),添加超期图标\
		    /*if(data.deadLineName != $.i18n('collaboration.project.nothing.label')){
		        if(data.isCoverTime){//超期图标
		            txt = txt + "<span class='ico16 extended_red_16'></span>" ;
		        }else{//未超期图标
		            txt = txt + "<span class='ico16 extended_blue_16'></span>" ;
		        }
		    }*/
		    
		    var txt = data.subject;
		    if(!txt){
		        txt = "";
		    }
		    txt = txt.replace(/\r\n/ig, "").replace(/\r/ig, "").replace(/\n/ig, "");
		    
            //如果是代理 ，颜色变成蓝色
            var proxyColor = "";
            if (data.proxy) {
                proxyColor = "color_blue";
            }
            
            iconCount++;//最后有一个复制图标
            var cWidth = width - 16;//前面有一个.
            var liWidth = cWidth - iconCount * 16;
            
            //标题列加深(OA-88826 在协同待办事项里，点击待办数据，查看报错，只有reny1，才会出现这个问题，其他都是正常的，点击查看表单协同，报js错误,转译)
            //txt="<span class='grid_black " + proxyColor + "'>"+escapeStringToHTML(getLimitLength(txt,len))+"</span>";
            txt="<span style='max-width:"+liWidth+"px' class='grid_black dr_item_title " + proxyColor + "'>"+escapeStringToHTML(txt)+"</span>";
		    
		    txt =  importIcon + txt + attIcon + bodyIcon;
		    
		    text = txt;
		    
		    
		    
			break;
		case "outSystem":
		case "traceWorkflow":
			title = data.subject;
			if(!title){
			    title = "";
            }
			title = title.replace(/\r\n/ig, "").replace(/\r/ig, "").replace(/\n/ig, "");
			text = escapeStringToHTML(getLimitLength(title,len));
			break;
		case "project":
			title = data.projectName;
			if(!title){
                title = "";
            }
            title = title.replace(/\r\n/ig, "").replace(/\r/ig, "").replace(/\n/ig, "");
			var iconCount = 1;//同模板保持一致
			iconCount++;
			var cWidth = width - 16 - 5;//前面有一个.
            var liWidth = cWidth - iconCount * 16;
            text ="<span style='max-width:"+liWidth+"px' class='grid_black dr_item_title'>" + escapeStringToHTML(title) +"</span>";
			text = "<span class='ico16 icon_group_16'></span> " + text;
			break;
		case "doc":
			title = data.frName;
			if(!title){
                title = "";
            }
            title = title.replace(/\r\n/ig, "").replace(/\r/ig, "").replace(/\n/ig, "");
			var attIcon = "";
			var iconCount = 1;//同模板保持一致
			if(data.hasAttachments){
			    iconCount++;
			    attIcon = "<span class='ico16 affix_16'></span>";
			}
			
			iconCount++;
			var cWidth = width - 16 - 5;//前面有一个.
            var liWidth = cWidth - iconCount * 16;
            
			text = "<img width='16' height='16' src='/seeyon/apps_res/doc/images/docIcon/"+data.icon+"' style='vertical-align: middle'/>"
			      +"<span style='max-width:"+liWidth+"px' class='margin_l_5 grid_black dr_item_title'>" + escapeStringToHTML(title)+"</span>";
			
			text = text + attIcon;
			
			break;
		case "formStat":
			break;
		case "formSearch":
			break;
		default:
			break;
	}
	title = title==null ? "": title;
	text = text== null ? "" : text;
	return {"title":title,"text":text};
}

/**
 * 返回对应数据类型返回的模板的html内容和类型
 */
function getTpl(dataType){
	switch (dataType) {
		case "formStat":
			return {"type":"tab2img","tplHtml":pageX.tplHtml["tab2img"]};
		case "formSearch":
			return {"type":"tab","tplHtml":pageX.tplHtml["tabTpl"]};
		case "outSystem":
			return {"type":"img","tplHtml":pageX.tplHtml["imgTpl"]};
		default:
			return {"type":"list","tplHtml": pageX.tplHtml["listTpl"]};;
	}
}

function getConfigById(poId){
	for (var i = 0; i < pageX.poList.length; i++) {
		var po = pageX.poList[i];
		if(poId ==  po.id){
			return po;
		}
	}
}

function pageInit(){
	initContext();
	
	_setDRHeight();
	$(window).resize(_setDRHeight);
	//数据关联滚动事件
	$(".msg_body", $("#guanlian_info_div")).scroll(_loadDataOnScorll);
	
	var _ifameMaskHtml="<iframe id='guanlian_iframe_mask' class='absolute' style='right:0;width:0;height:0;border:0;z-index:1;display:none;''></iframe>";
	$("#colSummaryData").append(_ifameMaskHtml);
	setTimeout(function(){
		checkDRHeight();
	},1000)
}


function __guanlianIconClkFunc() {
	

	if ($(this).siblings(".guanlian_msg").css("display") == "none") {
		$(this).siblings(".guanlian_msg").show("fast");
		pageX.drAreaVisible = true;
		//pageX.ajaxReqM.requestAll(pageX.poList);
		_setDRHeight();
		setTimeout(function() {
			var _guanlianWidth = $("#guanlian_info_div").width();
			var _guanlianHeight = $("#guanlian_info_div").height();
			var _guanlianTop = $("#guanlian_info_div").position().top;
			$("#guanlian_iframe_mask").css({
				"width" : _guanlianWidth + "px",
				"height" : _guanlianHeight + "px",
				"top" : _guanlianTop + "px",
				"display" : "block"
			});
		}, 250)

        //360极速模式
        if(window.navigator.userAgent.indexOf('AppleWebKit') != -1) {
            hideOfficeObj();
        }
	} else {
		pageX.drAreaVisible = false;
		$(this).siblings(".guanlian_msg").hide("fast");
		$("#guanlian_iframe_mask").css({
			"width" : 0,
			"height" : 0,
			"top" : 0,
			"display" : "none"
		});

        //360极速模式
        //360极速模式
        if(window.navigator.userAgent.indexOf('AppleWebKit') != -1) {
            showOfficeObj();
        }
	}
	
	 _init_();
		
	
}


//计算高度
function _setDRHeight(){
    setTimeout(function(){
    	var $drDiv = $("#guanlian_info_div");
    	var _height = $drDiv.height();
    	_height = _height - 34;
    	pageX._height = _height;
    	$(".msg_body", $drDiv).height(_height);
    },1);
}

//fix msg_body 的高度
function checkDRHeight(){
	var $drDiv = $("#guanlian_info_div");
	var _height = $drDiv.height();
	_height = _height - 34;
	if($(".msg_body").height()<_height){
		$(".msg_body").height(_height);
	}
}
/**
 * 点击事件计数器
 */
function clickCounter(){
	var type2ClickCount = {};// 类型,点击次数
	var ths = {};
	ths.click = function (type){
		var clkCount = 2;
		if(type == "doc" || type == "project"){
			clkCount = 4;
		}
		if (type) {
			if (type2ClickCount[type] == null) {
				type2ClickCount[type] = 0;
			}
			type2ClickCount[type] = type2ClickCount[type] + 1;
			if (type2ClickCount[type] >= clkCount) {
				$.alert($.i18n("datarelation.win.dbclick.title.js"));
				type2ClickCount[type] = 0;
			}
		}
		//重置其它计数器
		for ( var t in type2ClickCount) {
			if(t!=type){
				type2ClickCount[t] = 0;
			}
		}
	}
	return ths;
}

/**
 * ajax请求管理器，主要管理编辑页面条件实时加载栏目数据的时机
 * 规则：每个栏目的数据请求是一个队列，如果有2个以上的请求时，每个栏目第一个请求和最后一次的请求为有效请求且需要等到第一次请求返回完毕，第二次请求才会触发。
 * 1.保存自己的请求队列，如果有新的请求，但是栏目有请求未返回，暂停请求
 * 2.如果当前数据关联未展开，不请求，只缓存有效的请求，当展开的时候出发【未实现】
 * 3.默认加载第一次数据关联。
 * 4.记录返回为null的条件，如果返回为空的条件成立，再新增条件，则不会查询。【未实现】
 * // shift:从数组中把第一个元素删除，并返回这个元素的值。
   // unshift: 在数组的开头添加一个或更多元素，并返回新的长度
   // push:在数组的中末尾添加元素，并返回新的长度
   // pop:从数组中把最后一个元素删除，并返回这个元素的值。
 */
function ajaxRequestManager(){
	var ajaxReq = {};//poId:po,等待请求的队列
	var a = {};
	var batchNum = 3;
	a.request = function(po){//请求注册
		if(pageX.drAreaVisible){//队列里面已经没有可以运行的po，直接运行，大于0时，直接加入队列等待响应
			run(po);
		} else {
		    this.addRequest(po);
		}
	}
	a.addRequest = function(po){
	    po.isLoad = false;
        ajaxReq[po.id] =  po;
	}
	
	//私有方法，外部不能调用
	function run(po) {
		po.isLoad = true;
		var tpl = pageX.fillArea.find("ul[id=" + po.id + "]");
		if(po.pageCondItemList == null){
			po.pageCondItemList = [];
		}
		if (tpl.length == 1) {
			tpl.find(".loading_li").show();//loading
			
			var pageCondItemListObj = new Object();
			pageCondItemListObj[po.id] = po.pageCondItemList;
			loadRelationData([po.id],pageCondItemListObj);
		}
	}
	
	//回调
	function _loadData(reqArray, pBatchNum, pPageCondItemListObj, callback){
	    if(reqArray.length > 0){
            var subSize = Math.min(pBatchNum, reqArray.length);
            var subArray = reqArray.splice(0, subSize);
            loadRelationData(subArray, pPageCondItemListObj, function(){
                _loadData(reqArray, pBatchNum, pPageCondItemListObj, callback)
            });
        } else{
            if(callback){
                callback();
            }
        }
	}
	
	a.runBatch = function(_polist, loadAllCallback) {
		var reqArray = new Array();
		var pageCondItemListObj = new Object();
		for (var i = 0; i < _polist.length; i++) {
			var po = _polist[i];
			if(!po.isLoad){
			    po.isLoad = true;
			    var tpl = pageX.fillArea.find("ul[id=" + po.id + "]");
			    if(po.pageCondItemList == null){
			        po.pageCondItemList = [];
			    }
			    if (tpl.length == 1) {
			        tpl.find(".loading_li").show();//loading
			        reqArray.push(po.id);
			        pageCondItemListObj[po.id] = po.pageCondItemList;
			    }
			}
		}
		
	    //加载数据
        _loadData(reqArray, batchNum, pageCondItemListObj, loadAllCallback);
	}
	
	//相应
	a.response = function(po){
		if(!po.isLoad){
			run(po);
		}
	}
	//请求所有未加载或者需要加载的。
	a.requestAll = function(poList){
	    var batchArray = new Array();
		if (poList) {
			for (var i = 0; i < poList.length; i++) {
				var po = poList[i];
				if (!po.isLoad && pageX.drAreaVisible) {
				    //滚动加载
				    if(batchArray.length < batchNum){
				        batchArray.push(po);
				    }
				}else{
					ajaxReq[po.id] =  po;
				}
			}
		} else {
			for (var poId in ajaxReq) {
				var po = ajaxReq[poId];
				if (!po.isLoad) {
				    if(batchArray.length < batchNum){
				        batchArray.push(po);
				    }
				}
			}
		}
		this.runBatch(batchArray, _loadDataOnScorll);
	}
	return a;
}

/** 滚动请求数据 **/
pageX.scrollLoadTimeout = 0;
pageX.scrollDataIds = [];
function _loadDataOnScorll(){
    
    var fixHeight = 10;//10px 的margin-top
    var drBody = pageX.fillArea.parent().get(0);
    var drBodyTop = drBody.scrollTop;//可见区域顶部
    var drBodyHeight = drBody.clientHeight;
    var drBodyButton = drBodyTop + drBodyHeight;//可见区域高度
    
    $(".dr_item", pageX.fillArea).each(function(){
        var $this = $(this);
        var itemTop = this.offsetTop + fixHeight;
        var itemButton = itemTop + this.offsetHeight;
        if(itemTop > drBodyTop || itemButton > drBodyTop || itemTop<drBodyButton || itemButton<drBodyButton){
            //元素进入可见区域
            pageX.scrollDataIds.push($this.attr("id"));
        }
    });
    
    clearTimeout(pageX.scrollLoadTimeout);
    pageX.scrollLoadTimeout = setTimeout(function(){
        var poList = [];
        for(var i = 0, len = pageX.scrollDataIds.length; i < len; i++){
            var po = getConfigById(pageX.scrollDataIds[i]);
            poList.push(po);
        }
        pageX.ajaxReqM.runBatch(poList, function(){
            pageX.scrollDataIds = [];
        });
    }, 100);
}


/**
 * 表单事件的改变
 * @param formData 表单计算后的值，根据条件查询
 * 1.所有配置文件的po
 * 2.根据po里面的查找表单查询和表单统计
 * 3.根据po的条件在表单里面查找，比对以前的值和现在的值是否一致，如果不一致，查询
 */
function formChangeEvent(formData,eventType) {
	var poList = pageX.poList;
	if(!poList){
		return;
	}
	
	if(!pageX.formMasterId){
	    _setFormRecordId();
	}
	if(eventType == "calcChange"){//查询条件不为null
		var condFieldNameList = [];
		for (var i = 0; i < poList.length; i++) {// 一次性取回，分批再次加载。
			var po = poList[i];
			var customCondItemList = po.customCondItemList;
			if (customCondItemList) {
				for (var j = 0; j < customCondItemList.length; j++) {
					var item = customCondItemList[j];
					condFieldNameList.push(item.trunkFieldName);
				}
			}
		}
		if (pageX.formMasterId != null && condFieldNameList.length > 0) {
			callBackendMethod("dataRelationManager","findFormCalcData",condFieldNameList,pageX.formMasterId,{
		    	success:function(rval){
		    		for ( var fieldName in rval) {
						formData[fieldName] = rval[fieldName];
					}
					_dynamicRequest(poList, formData);
		    	}
		    });
		}			
	}else if(eventType == "change"){
	    _dynamicRequest(poList, formData);
	}
}

function _dynamicRequest(poList, formData){
    var tempPOList = [];
    if(poList){
        for (var i = 0; i < poList.length; i++) {
            var po = poList[i];
            var reqPO = initFormCond(po,formData);
            if(reqPO){
                tempPOList.push(reqPO);
            }
        }
    }
    
    if(tempPOList.length > 0){
        
        var fixHeight = 10;//10px 的margin-top
        var drBody = pageX.fillArea.parent().get(0);
        var drBodyTop = drBody.scrollTop;//可见区域顶部
        var drBodyHeight = drBody.clientHeight;
        var drBodyButtom = drBodyTop + drBodyHeight;//可见区域高度
        
        for(var i = 0; i < tempPOList.length; i++){

            //滚动条下面的数据进行清空
            var tpl = pageX.fillArea.find("ul[id=" + tempPOList[i].id + "]");
            if(tpl && tpl.length > 0){
                var itemTop = tpl.get(0).offsetTop + fixHeight;
                var itemButtom = tpl.get(0).offsetTop + tpl.get(0).offsetHeight;
                if(itemTop > drBodyTop || itemButtom > drBodyTop || itemTop<drBodyButtom || itemButtom<itemButtom){
                    tpl.children("li[class=table_li]").remove();
                    tpl.children("li[class=chart_li]").remove();
                }
            }
        }
        _loadDataOnScorll();//执行滚动判断
    }
}

/**
 * 初始化表单后台查询条件
 * @param po
 * @param formData
 */
function initFormCond(po,formData){
    var reqPO = null;
	switch (po.dataTypeName) {
		case "formStat"://查询配置条件所对应的值
			if(!pageX.poId2ItemValueMap["po"+po.id]){
				var rval = callBackendMethod("dataRelationManager","findFormSearchCond",po.id,affairId);
				pageX.poId2ItemValueMap["po"+po.id] = rval;
                reqPO = loadByPageCond(po,formData);
			} else {
			    reqPO = loadByPageCond(po,formData);
			}
			break;
		case "formSearch"://查询配置条件所对应的值
			if(!pageX.poId2ItemValueMap["po"+po.id]){
				var rval = callBackendMethod("dataRelationManager","findFormSearchCond",po.id,affairId);
				pageX.poId2ItemValueMap["po"+po.id] = rval;
                reqPO = loadByPageCond(po,formData);
			} else {
			    reqPO = loadByPageCond(po,formData);
			}			
			break;
		default:
			break;
	}
	return reqPO;
}

/**
 * 加载数据
 * 清空栏目显示，后台查询数据，刷新页面
 * @param po
 */
function loadByPageCond(po,formData){
    var reqPO = null;
	buildFormCond(po,formData);
	if(po.isChange && po.pageCondItemList.length > 0){//页面有条件修改,清空栏目显示，后台查询数据，刷新页面
		//pageX.ajaxReqM.request(po);
	    pageX.ajaxReqM.addRequest(po);
        reqPO = po;
	}
    return reqPO;
}

/**
 * 根据po和当前表单数据返回查询条件的列表
 * @param po 当前栏目的配置对象
 * @param formData 表单数据
 * @returns {Array} 后台配置的属性中，条件值的列表。如果没有匹配的，返回空的数组
 * 1.后台条件表达式
   2.后台条件的值
   3.页面缓存的条件表达式
   4.表单填写传过来的值
   比较逻辑：
	页面填写的缓存比较
	找到，修改，
	找不到，找后台条件值表达式
	找到，修改，增加
	找不到，找后台条件表达式
	找到，如果非空，增加
	找不到，结束
 * 
 */
function buildFormCond(po,formData){
	var condItemList =  po.customCondItemList;//1.查询条件列表
	var valueItemList = pageX.poId2ItemValueMap["po"+po.id];//2.后台条件的值
	var pageCondItemList = po.pageCondItemList == null ? [] : po.pageCondItemList;//3.页面缓存的条件表达式
	var initValueItemList = po.initItemValueList;//页面最开始条件的值
	var changed = false;
	//页面缓存的条件表达式map
	var pageCondMap = {};
	for (var i = 0; i < pageCondItemList.length; i++) {
		var item = pageCondItemList[i];
		pageCondMap[item.trunkFieldName] = item;
	}
	//后台条件的值map
	var valueItemMap = {};
	for (var i = 0; i < valueItemList.length; i++) {
		var item = valueItemList[i];
		valueItemMap[item.trunkFieldName] = item;
	}
	
	//页面最开始条件的值map
	var initValueItemMap = {};
	if(initValueItemList){
		for (var i = 0; i < initValueItemList.length; i++) {
			var item = initValueItemList[i];
			initValueItemMap[item.trunkFieldName] = item;
		}
	}
	
	//查询条件列表
	var condItemMap = {};
	for (var i = 0; i < condItemList.length; i++) {
		var item = condItemList[i];
		condItemMap[item.trunkFieldName] = item;
	}
	
	for (var fieldName in formData) {
		var pageItem = pageCondMap[fieldName];
		var valueItem =  valueItemMap[fieldName];
		var initValueItem =  initValueItemMap[fieldName];
		var condItem =  condItemMap[fieldName];
		var formValue = formData[fieldName];
		if(isChange(pageItem,formValue)){
			pageItem.fieldValue = formValue;//直接修改
			pageItem[fieldName] = formValue;
			pageItem.fieldName =  pageItem.trunkFieldName;
			changed = true;
		}else if(!hasCondItem(pageCondItemList,fieldName)){
			if(isChange(valueItem,formValue)){
				var cItem = $.extend(true,{},valueItem);
				cItem.fieldValue = formValue;
				cItem[fieldName] = formValue;
				cItem.fieldName = cItem.trunkFieldName;
				pageCondItemList.push(cItem);
				changed = true;
			}else if(!hasCondItem(valueItemList,fieldName)){
				if(hasCondItem(condItemList,fieldName) && !isBlank(formValue)){
					var cItem = $.extend(true,{},condItem);
					cItem.fieldValue = formValue;
					cItem[fieldName] = formValue;
					cItem.fieldName = cItem.trunkFieldName;
					pageCondItemList.push(cItem);
					changed = true;
				}
			}
		}
		//第一次改变值判断
		if(!changed && !pageItem && isChange(initValueItem,formValue)){
			var cItem = $.extend(true,{},initValueItem);
			cItem.fieldValue = formValue;
			cItem[fieldName] = formValue;
			cItem.fieldName = cItem.trunkFieldName;
			pageCondItemList.push(cItem);
			changed = true;
		}
	}
	
	po.pageCondItemList = pageCondItemList;
//	console.log(changed);
	po.isChange = changed;
}

function isChange(valueItem,formValue){
	var rval = false;
	if(valueItem != null){
		if(isBlank(valueItem.fieldValue) && !isBlank(formValue)){
			rval = true;
		}else if(!isBlank(valueItem.fieldValue) && isBlank(formValue)){
			rval = true;
		}else if(!isBlank(valueItem.fieldValue) && !isBlank(formValue) && valueItem.fieldValue != formValue){
			rval = true;
		}
	}
	return rval;
}

function isBlank(val){
	return val == null || val == undefined || val.trim() == "";
}

function hasCondItem(condList, fieldName) {
	if(condList && fieldName){
		for (var i = 0; i < condList.length; i++) {
			if(condList[i].trunkFieldName ==  fieldName){
				return true;
			}
		}
	}
	return false;
}

function getLimitLength(str,maxlengh) {
    if(!maxlengh || maxlengh < 0 || str == null){
        return str;
    }
    maxlengh = maxlengh;
    var len = str.getBytesLength();
    if(len <= maxlengh){
        return str;
    }
    
    var symbol = "..";
    maxlengh = maxlengh - symbol.length;

    var a = 0; 
    var temp = ''; 
    for(var i = 0; i < str.length; i++){ 
       if (str.charCodeAt(i) > 255) {
			a += 2;
		} else {
			a++;
		}
        temp += str.charAt(i);  
        if(a >= maxlengh) {
            return temp + symbol;
        }
    } 
    return str; 
}

//功能说明
function fundescription(){
	var fndesc = $.dialog({
        url : _ctxPath + "/dataRelation.do?method=functionDescription&templateId="+templateId,
        title : $.i18n("datarelation.descript.title.js"),
        width : 700,
        height : 590,
        targetWindow : getCtpTop()
    });
}

