var WFAjax=RemoteJsonService.extend({
  jsonGateway: _ctxPath+"/ajax.do?method=ajaxAction&managerName=WFAjax",
  addMemberIdToCache: function(){
               return this.ajaxCall(arguments,"addMemberIdToCache");
  },
  addNode: function(){
               return this.ajaxCall(arguments,"addNode");
  },
  branchTranslateBranchExpression: function(){
               return this.ajaxCall(arguments,"branchTranslateBranchExpression");
  },
  canChangeNode: function(){
               return this.ajaxCall(arguments,"canChangeNode");
  },
  canRepeal: function(){
               return this.ajaxCall(arguments,"canRepeal");
  },
  canSpecialStepBack: function(){
               return this.ajaxCall(arguments,"canSpecialStepBack");
  },
  canStepBack: function(){
               return this.ajaxCall(arguments,"canStepBack");
  },
  canStopFlow: function(){
               return this.ajaxCall(arguments,"canStopFlow");
  },
  canTakeBack: function(){
               return this.ajaxCall(arguments,"canTakeBack");
  },
  canTemporaryPending: function(){
               return this.ajaxCall(arguments,"canTemporaryPending");
  },
  canWorkflowCurrentNodeSubmit: function(){
               return this.ajaxCall(arguments,"canWorkflowCurrentNodeSubmit");
  },
  changeCaseProcess: function(){
               return this.ajaxCall(arguments,"changeCaseProcess");
  },
  changeCaseProcessNodeProperty: function(){
               return this.ajaxCall(arguments,"changeCaseProcessNodeProperty");
  },
  checkWorkflowLock: function(){
               return this.ajaxCall(arguments,"checkWorkflowLock");
  },
  cloneWorkflowTemplateById: function(){
               return this.ajaxCall(arguments,"cloneWorkflowTemplateById");
  },
  conditionToFieldDisplay: function(){
               return this.ajaxCall(arguments,"conditionToFieldDisplay");
  },
  conditionToFieldName: function(){
               return this.ajaxCall(arguments,"conditionToFieldName");
  },
  deleteNode: function(){
               return this.ajaxCall(arguments,"deleteNode");
  },
  editWFCDiagram: function(){
               return this.ajaxCall(arguments,"editWFCDiagram");
  },
  getAcountExcludeElements: function(){
               return this.ajaxCall(arguments,"getAcountExcludeElements");
  },
  getCaseState: function(){
               return this.ajaxCall(arguments,"getCaseState");
  },
  getMainProcessTitleList: function(){
               return this.ajaxCall(arguments,"getMainProcessTitleList");
  },
  getProcessTitleByAppNameAndProcessId: function(){
               return this.ajaxCall(arguments,"getProcessTitleByAppNameAndProcessId");
  },
  getTargetClass: function(){
               return this.ajaxCall(arguments,"getTargetClass");
  },
  hasAutoSkipNodeBeforeSetCondition: function(){
               return this.ajaxCall(arguments,"hasAutoSkipNodeBeforeSetCondition");
  },
  hasConditionAfterSelectNode: function(){
               return this.ajaxCall(arguments,"hasConditionAfterSelectNode");
  },
  hasMainProcess: function(){
               return this.ajaxCall(arguments,"hasMainProcess");
  },
  hasSubProcess: function(){
               return this.ajaxCall(arguments,"hasSubProcess");
  },
  hasten: function(){
               return this.ajaxCall(arguments,"hasten");
  },
  isAutoSkipBeforeNewSetFlowOfNode: function(){
               return this.ajaxCall(arguments,"isAutoSkipBeforeNewSetFlowOfNode");
  },
  isExchangeNode: function(){
               return this.ajaxCall(arguments,"isExchangeNode");
  },
  isPreFiltered: function(){
               return this.ajaxCall(arguments,"isPreFiltered");
  },
  lockWorkflow: function(){
               return this.ajaxCall(arguments,"lockWorkflow");
  },
  releaseWorkflow: function(){
               return this.ajaxCall(arguments,"releaseWorkflow");
  },
  saveModifyWorkflowData: function(){
               return this.ajaxCall(arguments,"saveModifyWorkflowData");
  },
  selectProcessTemplateXMLForClone: function(){
               return this.ajaxCall(arguments,"selectProcessTemplateXMLForClone");
  },
  setPreFiltered: function(){
               return this.ajaxCall(arguments,"setPreFiltered");
  },
  templateExist: function(){
               return this.ajaxCall(arguments,"templateExist");
  },
  transBeforeInvokeWorkFlow: function(){
               return this.ajaxCall(arguments,"transBeforeInvokeWorkFlow");
  },
  validateCurrentSelectedNode: function(){
               return this.ajaxCall(arguments,"validateCurrentSelectedNode");
  },
  validateFailReSelectPeople: function(){
               return this.ajaxCall(arguments,"validateFailReSelectPeople");
  },
  validateFormTemplate: function(){
               return this.ajaxCall(arguments,"validateFormTemplate");
  },
  validateWFTemplete: function(){
      return this.ajaxCall(arguments,"validateWFTemplete");
  },
  validateWorkflowAutoCondition: function(){
               return this.ajaxCall(arguments,"validateWorkflowAutoCondition");
  }
  ,
  validateCanAddNode: function(){
               return this.ajaxCall(arguments,"validateCanAddNode");
  },
  isCanPasteAndReplaceNode: function(){
	  		   return this.ajaxCall(arguments,"isCanPasteAndReplaceNode");
  }
  ,
  getHandSelectOptions: function(){
               return this.ajaxCall(arguments,"getHandSelectOptions");
  }
  ,
  getNeedRepalceTemplateList: function(){
               return this.ajaxCall(arguments,"getNeedRepalceTemplateList");
  }
  ,repalceTemplateList:function(){
               return this.ajaxCall(arguments,"repalceTemplateList");
  }
  ,getEditTemplateParams:function(){
               return this.ajaxCall(arguments,"getEditTemplateParams");
  }
  ,updateTemplateList:function(){
               return this.ajaxCall(arguments,"updateTemplateList");
  }
  ,getUnenabledEntity:function(){
               return this.ajaxCall(arguments,"getUnenabledEntity");
  }
  ,transCheckBrachSelectedWorkFlow:function(){
    return this.ajaxCall(arguments,"transCheckBrachSelectedWorkFlow");
  }
  ,executeWorkflowBeforeEvent:function(){
      return this.ajaxCall(arguments,"executeWorkflowBeforeEvent");
  }
  ,analysisProcessDataForFlash:function(){
	  return this.ajaxCall(arguments,"analysisProcessDataForFlash");
  }
  ,validateProcessTemplateXMLForEgg:function(){
	  return this.ajaxCall(arguments,"validateProcessTemplateXMLForEgg");
  }
  ,removeWorkflowMatchResultCache:function(){
	  return this.ajaxCall(arguments,"removeWorkflowMatchResultCache");
  }
  ,lockWorkflowForStepBack:function(){
	  return this.ajaxCall(arguments,"lockWorkflowForStepBack");
  }
});