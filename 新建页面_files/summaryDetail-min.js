/*
 * jQuery Auto Fill Form Plugin @requires jQuery v1.1 or later @author Andy
 */
(function($) {
  /**
   * $.autofillform() provides a mechanism for fill form automatically, no more
   * script or code, very convenient.
   * 
   * $.autofillform() accepts a single option object argument, the following
   * attributes are supported:
   * 
   * fillformobj: Identifies the data to fill form.
   */
  $._autofill = new Object();

  $.autofillform = function(options) {
    var settings = {};
    options = $.extend(settings, options);

    var fillmaps = options.fillmaps ? options.fillmaps : new Object();
    $._autofill.filllists = fillmaps;

    for ( var f in fillmaps) {
      $("#" + f).fillform(fillmaps[f]);
    }
  }

  $.fn.clearform = function(options) {
    var settings = {
      clearHidden : false
    };
    this.resetValidate();
    options = $.extend(settings, options);
    this.find(':input').each(function() {
      switch (this.type) {
        case 'passsword':
        case 'select-multiple':
        case 'select-one':
        case 'text':
        case 'textarea':
          $(this).val('');
        case 'hidden':
          if (options.clearHidden)
            $(this).val('');
          break;
        case 'checkbox':
        case 'radio':
          this.checked = false;
      }
    });
  }

  $.fn.fillform = function(fillData) {
    if (this[0] == null)
      return;
    this.each(function(i) {
      var frm = $(this);
      frm.resetValidate();
      for ( var fi in fillData) {
        $("#" + fi, frm).each(function(i) {
          $(this).fill(fillData[fi], fi, frm);
        });
      }
      frm = null;
    });
    try{
    	this.find("input[type=text]:first").focus();
    }catch(e){
    }
  }

  $.fn.fill = function(v, fi, frm) {
    var el = this[0], eq = $(el), tag = el.tagName.toLowerCase();
    if (v && typeof v == "string")
      v = v.replace(/<\/\/script>/gi, "</script>");
    var t = el.type, val = el.value;
    switch (tag) {
      case "input":
        switch (t) {
          case "text":
            eq.val(v);
            break;
          case "hidden":
            var cp = eq.attrObj("_comp"), ctp;
            if (cp) {
              ctp = cp.attr("compType");
              if (ctp === "selectPeople") {
                var pv = "", pt = "";
                if (v && v.startsWith("{")) {
                  v = $.parseJSON(v);
                  if(v.value === undefined){
                    v.value = '';
                    v.text = '';
                  }
                  cp.comp(v);
                  pv = v.value;
                  pt = v.text;
                }
                cp.val(pt);
                eq.val(pv);
                break;
              }
            }
            eq.val(v);
            break;
          case "checkbox":
            if (v == val)
              el.checked = true;
            else
              el.checked = false;
            break;
          case "radio":
            if (frm) {
              $("input[type=radio]", frm).each(
                  function() {
                    if ((this.id == fi || this.name == fi) && v == this.value
                        && !this.checked)
                      this.checked = true;
                  });
            } else if (v == el.value && !el.checked) {
              el.checked = true;
            }
        }
        break;
      case "textarea":
        eq.val(v);
        break;
      case "select":
        switch (t) {
          case "select-one":
              eq.val(v);
            break;
          case "select-multiple":
            var ops = el.options;
              if(v.split){
                var sv = v.split(",");
                for ( var i = 0; i < ops.length; i++) {
                  var op = ops[i];
                  // extra pain for IE...
                  var opv = $.browser.msie && !(op.attributes['value'].specified) ? op.text
                      : op.value;
                  for ( var j = 0; j < sv.length; j++) {
                    if (opv == sv[j]) {
                      op.selected = true;
                    }
                  }
                }
              }
        }
        break;
      default:
        if (!((!v || v == '') && $(this)[0].innerHTML.indexOf('&nbsp;') != -1)) {
          if(v && eq.parent('.text_overflow').length == 1) {
            eq.attr('title', v);
          }
          if (v && typeof v == "string")
            v = v.replace(/\n/g, '<br/>');
          el.innerHTML = v;
        }
    }
    if (this.attr('validate')) {
      this.validate();
    }
  };

  $.fn.fillgrid = function(d) {
    this.each(function(i) {
      var t = this.tagName.toLowerCase(), e = $(this);
      switch (t) {
        case "table":
          elem.grid.addData(d);
          break;
      }
    });
  };
})(jQuery);
/*
 * jQuery UI Core 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function(B,F){var A=0,E=/^ui-id-\d+$/;B.ui=B.ui||{};if(B.ui.version){return }B.extend(B.ui,{version:"1.9.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}});B.fn.extend({_focus:B.fn.focus,focus:function(G,H){return typeof G==="number"?this.each(function(){var I=this;setTimeout(function(){B(I).focus();if(H){H.call(I)}},G)}):this._focus.apply(this,arguments)},scrollParent:function(){var G;if((B.ui.ie&&(/(static|relative)/).test(this.css("position")))||(/absolute/).test(this.css("position"))){G=this.parents().filter(function(){return(/(relative|absolute|fixed)/).test(B.css(this,"position"))&&(/(auto|scroll)/).test(B.css(this,"overflow")+B.css(this,"overflow-y")+B.css(this,"overflow-x"))}).eq(0)}else{G=this.parents().filter(function(){return(/(auto|scroll)/).test(B.css(this,"overflow")+B.css(this,"overflow-y")+B.css(this,"overflow-x"))}).eq(0)}return(/fixed/).test(this.css("position"))||!G.length?B(document):G},zIndex:function(J){if(J!==F){return this.css("zIndex",J)}if(this.length){var H=B(this[0]),G,I;while(H.length&&H[0]!==document){G=H.css("position");if(G==="absolute"||G==="relative"||G==="fixed"){I=parseInt(H.css("zIndex"),10);if(!isNaN(I)&&I!==0){return I}}H=H.parent()}}return 0},uniqueId:function(){return this.each(function(){if(!this.id){this.id="ui-id-"+(++A)}})},removeUniqueId:function(){return this.each(function(){if(E.test(this.id)){B(this).removeAttr("id")}})}});function D(I,G){var K,J,H,L=I.nodeName.toLowerCase();if("area"===L){K=I.parentNode;J=K.name;if(!I.href||!J||K.nodeName.toLowerCase()!=="map"){return false}H=B("img[usemap=#"+J+"]")[0];return !!H&&C(H)}return(/input|select|textarea|button|object/.test(L)?!I.disabled:"a"===L?I.href||G:G)&&C(I)}function C(G){return B.expr.filters.visible(G)&&!B(G).parents().andSelf().filter(function(){return B.css(this,"visibility")==="hidden"}).length}B.extend(B.expr[":"],{data:B.expr.createPseudo?B.expr.createPseudo(function(G){return function(H){return !!B.data(H,G)}}):function(I,H,G){return !!B.data(I,G[3])},focusable:function(G){return D(G,!isNaN(B.attr(G,"tabindex")))},tabbable:function(I){var G=B.attr(I,"tabindex"),H=isNaN(G);return(H||G>=0)&&D(I,!H)}});B(function(){try{var G=document.body,I=G.appendChild(I=document.createElement("div"));I.offsetHeight;B.extend(I.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});B.support.minHeight=I.offsetHeight===100;B.support.selectstart="onselectstart" in I;G.removeChild(I).style.display="none"}catch(H){}});if(!B("<a>").outerWidth(1).jquery){B.each(["Width","Height"],function(I,G){var H=G==="Width"?["Left","Right"]:["Top","Bottom"],J=G.toLowerCase(),L={innerWidth:B.fn.innerWidth,innerHeight:B.fn.innerHeight,outerWidth:B.fn.outerWidth,outerHeight:B.fn.outerHeight};function K(O,N,M,P){B.each(H,function(){N-=parseFloat(B.css(O,"padding"+this))||0;if(M){N-=parseFloat(B.css(O,"border"+this+"Width"))||0}if(P){N-=parseFloat(B.css(O,"margin"+this))||0}});return N}B.fn["inner"+G]=function(M){if(M===F){return L["inner"+G].call(this)}return this.each(function(){B(this).css(J,K(this,M)+"px")})};B.fn["outer"+G]=function(M,N){if(typeof M!=="number"){return L["outer"+G].call(this,M)}return this.each(function(){B(this).css(J,K(this,M,true,N)+"px")})}})}if(B("<a>").data("a-b","a").removeData("a-b").data("a-b")){B.fn.removeData=(function(G){return function(H){if(arguments.length){return G.call(this,B.camelCase(H))}else{return G.call(this)}}})(B.fn.removeData)}(function(){var G=/msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];B.ui.ie=G.length?true:false;B.ui.ie6=parseFloat(G[1],10)===6})();B.fn.extend({disableSelection:function(){return this.bind((B.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(G){G.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});B.extend(B.ui,{plugin:{add:function(H,I,K){var G,J=B.ui[H].prototype;for(G in K){J.plugins[G]=J.plugins[G]||[];J.plugins[G].push([I,K[G]])}},call:function(G,I,H){var J,K=G.plugins[I];if(!K||!G.element[0].parentNode||G.element[0].parentNode.nodeType===11){return }for(J=0;J<K.length;J++){if(G.options[K[J][0]]){K[J][1].apply(G.element,H)}}}},contains:B.contains,hasScroll:function(J,H){if(B(J).css("overflow")==="hidden"){return false}var G=(H&&H==="left")?"scrollLeft":"scrollTop",I=false;if(J[G]>0){return true}J[G]=1;I=(J[G]>0);J[G]=0;return I},isOverAxis:function(H,G,I){return(H>G)&&(H<(G+I))},isOver:function(L,H,K,J,G,I){return B.ui.isOverAxis(L,K,G)&&B.ui.isOverAxis(H,J,I)}})})(jQuery);
/*
 * jQuery UI Widget 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function(B,E){var A=0,D=Array.prototype.slice,C=B.cleanData;B.cleanData=function(F){for(var G=0,H;(H=F[G])!=null;G++){try{B(H).triggerHandler("remove")}catch(I){}}C(F)};B.widget=function(G,J,F){var M,L,I,K,H=G.split(".")[0];G=G.split(".")[1];M=H+"-"+G;if(!F){F=J;J=B.Widget}B.expr[":"][M.toLowerCase()]=function(N){return !!B.data(N,M)};B[H]=B[H]||{};L=B[H][G];I=B[H][G]=function(N,O){if(!this._createWidget){return new I(N,O)}if(arguments.length){this._createWidget(N,O)}};B.extend(I,L,{version:F.version,_proto:B.extend({},F),_childConstructors:[]});K=new J();K.options=B.widget.extend({},K.options);B.each(F,function(O,N){if(B.isFunction(N)){F[O]=(function(){var P=function(){return J.prototype[O].apply(this,arguments)},Q=function(R){return J.prototype[O].apply(this,R)};return function(){var T=this._super,R=this._superApply,S;this._super=P;this._superApply=Q;S=N.apply(this,arguments);this._super=T;this._superApply=R;return S}})()}});I.prototype=B.widget.extend(K,{widgetEventPrefix:L?K.widgetEventPrefix:G},F,{constructor:I,namespace:H,widgetName:G,widgetBaseClass:M,widgetFullName:M});if(L){B.each(L._childConstructors,function(O,P){var N=P.prototype;B.widget(N.namespace+"."+N.widgetName,I,P._proto)});delete L._childConstructors}else{J._childConstructors.push(I)}B.widget.bridge(G,I)};B.widget.extend=function(K){var G=D.call(arguments,1),J=0,F=G.length,H,I;for(;J<F;J++){for(H in G[J]){I=G[J][H];if(G[J].hasOwnProperty(H)&&I!==E){if(B.isPlainObject(I)){K[H]=B.isPlainObject(K[H])?B.widget.extend({},K[H],I):B.widget.extend({},I)}else{K[H]=I}}}}return K};B.widget.bridge=function(G,F){var H=F.prototype.widgetFullName||G;B.fn[G]=function(K){var I=typeof K==="string",J=D.call(arguments,1),L=this;K=!I&&J.length?B.widget.extend.apply(null,[K].concat(J)):K;if(I){this.each(function(){var N,M=B.data(this,H);if(!M){return B.error("cannot call methods on "+G+" prior to initialization; attempted to call method '"+K+"'")}if(!B.isFunction(M[K])||K.charAt(0)==="_"){return B.error("no such method '"+K+"' for "+G+" widget instance")}N=M[K].apply(M,J);if(N!==M&&N!==E){L=N&&N.jquery?L.pushStack(N.get()):N;return false}})}else{this.each(function(){var M=B.data(this,H);if(M){M.option(K||{})._init()}else{B.data(this,H,new F(K,this))}})}return L}};B.Widget=function(){};B.Widget._childConstructors=[];B.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:false,create:null},_createWidget:function(F,G){G=B(G||this.defaultElement||this)[0];this.element=B(G);this.uuid=A++;this.eventNamespace="."+this.widgetName+this.uuid;this.options=B.widget.extend({},this.options,this._getCreateOptions(),F);this.bindings=B();this.hoverable=B();this.focusable=B();if(G!==this){B.data(G,this.widgetName,this);B.data(G,this.widgetFullName,this);this._on(true,this.element,{remove:function(H){if(H.target===G){this.destroy()}}});this.document=B(G.style?G.ownerDocument:G.document||G);this.window=B(this.document[0].defaultView||this.document[0].parentWindow)}this._create();this._trigger("create",null,this._getCreateEventData());this._init()},_getCreateOptions:B.noop,_getCreateEventData:B.noop,_create:B.noop,_init:B.noop,destroy:function(){this._destroy();this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(B.camelCase(this.widgetFullName));this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled");this.bindings.unbind(this.eventNamespace);this.hoverable.removeClass("ui-state-hover");this.focusable.removeClass("ui-state-focus")},_destroy:B.noop,widget:function(){return this.element},option:function(I,J){var F=I,K,H,G;if(arguments.length===0){return B.widget.extend({},this.options)}if(typeof I==="string"){F={};K=I.split(".");I=K.shift();if(K.length){H=F[I]=B.widget.extend({},this.options[I]);for(G=0;G<K.length-1;G++){H[K[G]]=H[K[G]]||{};H=H[K[G]]}I=K.pop();if(J===E){return H[I]===E?null:H[I]}H[I]=J}else{if(J===E){return this.options[I]===E?null:this.options[I]}F[I]=J}}this._setOptions(F);return this},_setOptions:function(F){var G;for(G in F){this._setOption(G,F[G])}return this},_setOption:function(F,G){this.options[F]=G;if(F==="disabled"){this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!G).attr("aria-disabled",G);this.hoverable.removeClass("ui-state-hover");this.focusable.removeClass("ui-state-focus")}return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_on:function(I,H,G){var J,F=this;if(typeof I!=="boolean"){G=H;H=I;I=false}if(!G){G=H;H=this.element;J=this.widget()}else{H=J=B(H);this.bindings=this.bindings.add(H)}B.each(G,function(P,O){function M(){if(!I&&(F.options.disabled===true||B(this).hasClass("ui-state-disabled"))){return }return(typeof O==="string"?F[O]:O).apply(F,arguments)}if(typeof O!=="string"){M.guid=O.guid=O.guid||M.guid||B.guid++}var N=P.match(/^(\w+)\s*(.*)$/),L=N[1]+F.eventNamespace,K=N[2];if(K){J.delegate(K,L,M)}else{H.bind(L,M)}})},_off:function(G,F){F=(F||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace;G.unbind(F).undelegate(F)},_delay:function(I,H){function G(){return(typeof I==="string"?F[I]:I).apply(F,arguments)}var F=this;return setTimeout(G,H||0)},_hoverable:function(F){this.hoverable=this.hoverable.add(F);this._on(F,{mouseenter:function(G){B(G.currentTarget).addClass("ui-state-hover")},mouseleave:function(G){B(G.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(F){this.focusable=this.focusable.add(F);this._on(F,{focusin:function(G){B(G.currentTarget).addClass("ui-state-focus")},focusout:function(G){B(G.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(F,G,H){var K,J,I=this.options[F];H=H||{};G=B.Event(G);G.type=(F===this.widgetEventPrefix?F:this.widgetEventPrefix+F).toLowerCase();G.target=this.element[0];J=G.originalEvent;if(J){for(K in J){if(!(K in G)){G[K]=J[K]}}}this.element.trigger(G,H);return !(B.isFunction(I)&&I.apply(this.element[0],[G].concat(H))===false||G.isDefaultPrevented())}};B.each({show:"fadeIn",hide:"fadeOut"},function(G,F){B.Widget.prototype["_"+G]=function(J,I,L){if(typeof I==="string"){I={effect:I}}var K,H=!I?G:I===true||typeof I==="number"?F:I.effect||F;I=I||{};if(typeof I==="number"){I={duration:I}}K=!B.isEmptyObject(I);I.complete=L;if(I.delay){J.delay(I.delay)}if(K&&B.effects&&(B.effects.effect[H]||B.uiBackCompat!==false&&B.effects[H])){J[G](I)}else{if(H!==G&&J[H]){J[H](I.duration,I.easing,L)}else{J.queue(function(M){B(this)[G]();if(L){L.call(J[0])}M()})}}}});if(B.uiBackCompat!==false){B.Widget.prototype._getCreateOptions=function(){if(B.metadata&&B.metadata.get){return B.metadata&&B.metadata.get(this.element[0])[this.widgetName]}return null}}})(jQuery);
/*
 * jQuery UI Mouse 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function(B,C){var A=false;B(document).mouseup(function(D){A=false});B.widget("ui.mouse",{version:"1.9.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var D=this;this.element.bind("mousedown."+this.widgetName,function(E){return D._mouseDown(E)}).bind("click."+this.widgetName,function(E){if(true===B.data(E.target,D.widgetName+".preventClickEvent")){B.removeData(E.target,D.widgetName+".preventClickEvent");E.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName);if(this._mouseMoveDelegate){B(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)}},_mouseDown:function(F){if(A){return }(this._mouseStarted&&this._mouseUp(F));this._mouseDownEvent=F;var E=this,G=(F.which===1),D=(typeof this.options.cancel==="string"&&F.target.nodeName?B(F.target).closest(this.options.cancel).length:false);if(!G||D||!this._mouseCapture(F)){return true}this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){E.mouseDelayMet=true},this.options.delay)}if(this._mouseDistanceMet(F)&&this._mouseDelayMet(F)){this._mouseStarted=(this._mouseStart(F)!==false);if(!this._mouseStarted){F.preventDefault();return true}}if(true===B.data(F.target,this.widgetName+".preventClickEvent")){B.removeData(F.target,this.widgetName+".preventClickEvent")}this._mouseMoveDelegate=function(H){return E._mouseMove(H)};this._mouseUpDelegate=function(H){return E._mouseUp(H)};B(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);F.preventDefault();A=true;return true},_mouseMove:function(D){if(B.ui.ie&&!(document.documentMode>=9)&&!D.button){return this._mouseUp(D)}if(this._mouseStarted){this._mouseDrag(D);return D.preventDefault()}if(this._mouseDistanceMet(D)&&this._mouseDelayMet(D)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,D)!==false);(this._mouseStarted?this._mouseDrag(D):this._mouseUp(D))}return !this._mouseStarted},_mouseUp:function(D){B(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;if(D.target===this._mouseDownEvent.target){B.data(D.target,this.widgetName+".preventClickEvent",true)}this._mouseStop(D)}return false},_mouseDistanceMet:function(D){return(Math.max(Math.abs(this._mouseDownEvent.pageX-D.pageX),Math.abs(this._mouseDownEvent.pageY-D.pageY))>=this.options.distance)},_mouseDelayMet:function(D){return this.mouseDelayMet},_mouseStart:function(D){},_mouseDrag:function(D){},_mouseStop:function(D){},_mouseCapture:function(D){return true}})})(jQuery);
/*
 * jQuery UI Slider 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function(B,C){var A=5;B.widget("ui.slider",B.ui.mouse,{version:"1.9.2",widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,pointer:true,step:1,value:0,values:null},_create:function(){var I,D,E=this.options,F=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),K="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#' title='"+E.value+"'></a>",N=[];this._keySliding=false;this._mouseSliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"+(E.disabled?" ui-slider-disabled ui-disabled":""));this.range=B([]);if(E.range){if(E.range===true){if(!E.values){E.values=[this._valueMin(),this._valueMin()]}if(E.values.length&&E.values.length!==2){E.values=[E.values[0],E.values[0]]}}this.range=B("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+((E.range==="min"||E.range==="max")?" ui-slider-range-"+E.range:""))}D=(E.values&&E.values.length)||1;for(I=F.length;I<D;I++){N.push(K)}this.handles=F.add(B(N.join("")).appendTo(this.element));this.handle=this.handles.eq(0);if(E.pointer){this.point=B("<div class='relative'></div>").width(this.element.width()).css("margin-top",this.element[0].offsetHeight-2).addClass("ui-slider-pointer");var G="";var J=this._valueMin();var M=this._valueMax();for(var I=J;I<=M;I++){var L=I;var H=(M!==J)?(L-J)/(M-J)*100:0;G+="<span class='ui_sliderPoint absolute'step='"+I+"' style='left:"+H+"%;'><em></em>";if(E.text){G+="<p class='ui_point_text'>"+E.text[I]+"</p>"}G+="</span>"}this.point.append(B(G)).appendTo(this.element)}this.handles.filter("a").click(function(O){O.preventDefault()}).mouseenter(function(){if(!E.disabled){B(this).addClass("ui-state-hover")}}).mouseleave(function(){B(this).removeClass("ui-state-hover")}).focus(function(){if(!E.disabled){B(".ui-slider .ui-state-focus").removeClass("ui-state-focus");B(this).addClass("ui-state-focus")}else{B(this).blur()}}).blur(function(){B(this).removeClass("ui-state-focus")});this.handles.each(function(O){B(this).data("ui-slider-handle-index",O)});this._on(this.handles,{keydown:function(S){var T,Q,P,R,O=B(S.target).data("ui-slider-handle-index");switch(S.keyCode){case B.ui.keyCode.HOME:case B.ui.keyCode.END:case B.ui.keyCode.PAGE_UP:case B.ui.keyCode.PAGE_DOWN:case B.ui.keyCode.UP:case B.ui.keyCode.RIGHT:case B.ui.keyCode.DOWN:case B.ui.keyCode.LEFT:S.preventDefault();if(!this._keySliding){this._keySliding=true;B(S.target).addClass("ui-state-active");T=this._start(S,O);if(T===false){return }}break}R=this.options.step;if(this.options.values&&this.options.values.length){Q=P=this.values(O)}else{Q=P=this.value()}switch(S.keyCode){case B.ui.keyCode.HOME:P=this._valueMin();break;case B.ui.keyCode.END:P=this._valueMax();break;case B.ui.keyCode.PAGE_UP:P=this._trimAlignValue(Q+((this._valueMax()-this._valueMin())/A));break;case B.ui.keyCode.PAGE_DOWN:P=this._trimAlignValue(Q-((this._valueMax()-this._valueMin())/A));break;case B.ui.keyCode.UP:case B.ui.keyCode.RIGHT:if(Q===this._valueMax()){return }P=this._trimAlignValue(Q+R);break;case B.ui.keyCode.DOWN:case B.ui.keyCode.LEFT:if(Q===this._valueMin()){return }P=this._trimAlignValue(Q-R);break}this._slide(S,O,P)},keyup:function(P){var O=B(P.target).data("ui-slider-handle-index");if(this._keySliding){this._keySliding=false;this._stop(P,O);this._change(P,O);B(P.target).removeClass("ui-state-active")}}});this._refreshValue();this._animateOff=false},_destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all");this._mouseDestroy()},_mouseCapture:function(F){var J,M,E,H,L,N,I,D,K=this,G=this.options;if(G.disabled){return false}this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();J={x:F.pageX,y:F.pageY};M=this._normValueFromMouse(J);E=this._valueMax()-this._valueMin()+1;this.handles.each(function(O){var P=Math.abs(M-K.values(O));if(E>P){E=P;H=B(this);L=O}});if(G.range===true&&this.values(1)===G.min){L+=1;H=B(this.handles[L])}N=this._start(F,L);if(N===false){return false}this._mouseSliding=true;this._handleIndex=L;H.addClass("ui-state-active").focus();I=H.offset();D=!B(F.target).parents().andSelf().is(".ui-slider-handle");this._clickOffset=D?{left:0,top:0}:{left:F.pageX-I.left-(H.width()/2),top:F.pageY-I.top-(H.height()/2)-(parseInt(H.css("borderTopWidth"),10)||0)-(parseInt(H.css("borderBottomWidth"),10)||0)+(parseInt(H.css("marginTop"),10)||0)};if(!this.handles.hasClass("ui-state-hover")){this._slide(F,L,M)}this._animateOff=true;return true},_mouseStart:function(){return true},_mouseDrag:function(F){var D={x:F.pageX,y:F.pageY},E=this._normValueFromMouse(D);this._slide(F,this._handleIndex,E);return false},_mouseStop:function(D){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(D,this._handleIndex);this._change(D,this._handleIndex);this._handleIndex=null;this._clickOffset=null;this._animateOff=false;return false},_detectOrientation:function(){this.orientation=(this.options.orientation==="vertical")?"vertical":"horizontal"},_normValueFromMouse:function(E){var D,H,G,F,I;if(this.orientation==="horizontal"){D=this.elementSize.width;H=E.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{D=this.elementSize.height;H=E.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}G=(H/D);if(G>1){G=1}if(G<0){G=0}if(this.orientation==="vertical"){G=1-G}F=this._valueMax()-this._valueMin();I=this._valueMin()+G*F;return this._trimAlignValue(I)},_start:function(F,E){var D={handle:this.handles[E],value:this.value()};if(this.options.values&&this.options.values.length){D.value=this.values(E);D.values=this.values()}return this._trigger("start",F,D)},_slide:function(H,G,F){var D,E,I;if(this.options.values&&this.options.values.length){D=this.values(G?0:1);if((this.options.values.length===2&&this.options.range===true)&&((G===0&&F>D)||(G===1&&F<D))){F=D}if(F!==this.values(G)){E=this.values();E[G]=F;I=this._trigger("slide",H,{handle:this.handles[G],value:F,values:E});D=this.values(G?0:1);if(I!==false){this.values(G,F,true)}}}else{if(F!==this.value()){I=this._trigger("slide",H,{handle:this.handles[G],value:F});if(I!==false){this.value(F)}}}},_stop:function(F,E){var D={handle:this.handles[E],value:this.value()};if(this.options.values&&this.options.values.length){D.value=this.values(E);D.values=this.values()}this._trigger("stop",F,D)},_change:function(F,E){if(!this._keySliding&&!this._mouseSliding){var D={handle:this.handles[E],value:this.value()};if(this.options.values&&this.options.values.length){D.value=this.values(E);D.values=this.values()}D.handle.title=D.value;this._trigger("change",F,D)}},value:function(D){if(arguments.length){this.options.value=this._trimAlignValue(D);this._refreshValue();this._change(null,0);return }return this._value()},values:function(E,H){var G,D,F;if(arguments.length>1){this.options.values[E]=this._trimAlignValue(H);this._refreshValue();this._change(null,E);return }if(arguments.length){if(B.isArray(arguments[0])){G=this.options.values;D=arguments[0];for(F=0;F<G.length;F+=1){G[F]=this._trimAlignValue(D[F]);this._change(null,F)}this._refreshValue()}else{if(this.options.values&&this.options.values.length){return this._values(E)}else{return this.value()}}}else{return this._values()}},_setOption:function(E,F){var D,G=0;if(B.isArray(this.options.values)){G=this.options.values.length}B.Widget.prototype._setOption.apply(this,arguments);switch(E){case"disabled":if(F){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.prop("disabled",true);this.element.addClass("ui-disabled")}else{this.handles.prop("disabled",false);this.element.removeClass("ui-disabled")}break;case"orientation":this._detectOrientation();this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case"value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case"values":this._animateOff=true;this._refreshValue();for(D=0;D<G;D+=1){this._change(null,D)}this._animateOff=false;break;case"min":case"max":this._animateOff=true;this._refreshValue();this._animateOff=false;break}},_value:function(){var D=this.options.value;D=this._trimAlignValue(D);return D},_values:function(D){var G,F,E;if(arguments.length){G=this.options.values[D];G=this._trimAlignValue(G);return G}else{F=this.options.values.slice();for(E=0;E<F.length;E+=1){F[E]=this._trimAlignValue(F[E])}return F}},_trimAlignValue:function(G){if(G<=this._valueMin()){return this._valueMin()}if(G>=this._valueMax()){return this._valueMax()}var D=(this.options.step>0)?this.options.step:1,F=(G-this._valueMin())%D,E=G-F;if(Math.abs(F)*2>=D){E+=(F>0)?D:(-D)}return parseFloat(E.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var I,H,L,J,M,G=this.options.range,F=this.options,K=this,E=(!this._animateOff)?F.animate:false,D={};if(this.options.values&&this.options.values.length){this.handles.each(function(N){H=(K.values(N)-K._valueMin())/(K._valueMax()-K._valueMin())*100;D[K.orientation==="horizontal"?"left":"bottom"]=H+"%";B(this).stop(1,1)[E?"animate":"css"](D,F.animate);if(K.options.range===true){if(K.orientation==="horizontal"){if(N===0){K.range.stop(1,1)[E?"animate":"css"]({left:H+"%"},F.animate)}if(N===1){K.range[E?"animate":"css"]({width:(H-I)+"%"},{queue:false,duration:F.animate})}}else{if(N===0){K.range.stop(1,1)[E?"animate":"css"]({bottom:(H)+"%"},F.animate)}if(N===1){K.range[E?"animate":"css"]({height:(H-I)+"%"},{queue:false,duration:F.animate})}}}I=H})}else{L=this.value();J=this._valueMin();M=this._valueMax();H=(M!==J)?(L-J)/(M-J)*100:0;D[this.orientation==="horizontal"?"left":"bottom"]=H+"%";this.handle.stop(1,1)[E?"animate":"css"](D,F.animate);if(G==="min"&&this.orientation==="horizontal"){this.range.stop(1,1)[E?"animate":"css"]({width:H+"%"},F.animate)}if(G==="max"&&this.orientation==="horizontal"){this.range[E?"animate":"css"]({width:(100-H)+"%"},{queue:false,duration:F.animate})}if(G==="min"&&this.orientation==="vertical"){this.range.stop(1,1)[E?"animate":"css"]({height:H+"%"},F.animate)}if(G==="max"&&this.orientation==="vertical"){this.range[E?"animate":"css"]({height:(100-H)+"%"},{queue:false,duration:F.animate})}}}})}(jQuery));
/*
 * jQuery UI Draggable 1.9.2
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function(A,B){A.widget("ui.draggable",A.ui.mouse,{version:"1.9.2",widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper=="original"&&!(/^(?:r|a|f)/).test(this.element.css("position"))){this.element[0].style.position="relative"}(this.options.addClasses&&this.element.addClass("ui-draggable"));(this.options.disabled&&this.element.addClass("ui-draggable-disabled"));this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy()},_mouseCapture:function(C){var D=this.options;if(this.helper||D.disabled||A(C.target).is(".ui-resizable-handle")){return false}this.handle=this._getHandle(C);if(!this.handle){return false}A(D.iframeFix===true?"iframe":D.iframeFix).each(function(){A('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css(A(this).offset()).appendTo("body")});return true},_mouseStart:function(C){var D=this.options;this.helper=this._createHelper(C);this.helper.addClass("ui-draggable-dragging");this._cacheHelperProportions();if(A.ui.ddmanager){A.ui.ddmanager.current=this}this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};A.extend(this.offset,{click:{left:C.pageX-this.offset.left,top:C.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(C);this.originalPageX=C.pageX;this.originalPageY=C.pageY;(D.cursorAt&&this._adjustOffsetFromHelper(D.cursorAt));if(D.containment){this._setContainment()}if(this._trigger("start",C)===false){this._clear();return false}this._cacheHelperProportions();if(A.ui.ddmanager&&!D.dropBehaviour){A.ui.ddmanager.prepareOffsets(this,C)}this._mouseDrag(C,true);if(A.ui.ddmanager){A.ui.ddmanager.dragStart(this,C)}return true},_mouseDrag:function(E,G){var D=A.browser.msie;var C=A.browser.version;D=D&&(C.length>3);D=D||A.browser.mozilla;if(D){if(E.buttons!=1){this._mouseUp({});return false}}this.position=this._generatePosition(E);this.positionAbs=this._convertPositionTo("absolute");if(!G){var F=this._uiHash();if(this._trigger("drag",E,F)===false){this._mouseUp({});return false}this.position=F.position}if(!this.options.axis||this.options.axis!="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!="x"){this.helper[0].style.top=this.position.top+"px"}if(A.ui.ddmanager){A.ui.ddmanager.drag(this,E)}return false},_mouseStop:function(E){var G=false;if(A.ui.ddmanager&&!this.options.dropBehaviour){G=A.ui.ddmanager.drop(this,E)}if(this.dropped){G=this.dropped;this.dropped=false}var C=this.element[0],F=false;while(C&&(C=C.parentNode)){if(C==document){F=true}}if(!F&&this.options.helper==="original"){return false}if((this.options.revert=="invalid"&&!G)||(this.options.revert=="valid"&&G)||this.options.revert===true||(A.isFunction(this.options.revert)&&this.options.revert.call(this.element,G))){var D=this;A(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){if(D._trigger("stop",E)!==false){D._clear()}})}else{if(this._trigger("stop",E)!==false){this._clear()}}return false},_mouseUp:function(C){A("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)});if(A.ui.ddmanager){A.ui.ddmanager.dragStop(this,C)}return A.ui.mouse.prototype._mouseUp.call(this,C)},cancel:function(){if(this.helper.is(".ui-draggable-dragging")){this._mouseUp({})}else{this._clear()}return this},_getHandle:function(C){var D=!this.options.handle||!A(this.options.handle,this.element).length?true:false;A(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==C.target){D=true}});return D},_createHelper:function(D){var E=this.options;var C=A.isFunction(E.helper)?A(E.helper.apply(this.element[0],[D])):(E.helper=="clone"?this.element.clone().removeAttr("id"):this.element);if(!C.parents("body").length){C.appendTo((E.appendTo=="parent"?this.element[0].parentNode:E.appendTo))}if(C[0]!=this.element[0]&&!(/(fixed|absolute)/).test(C.css("position"))){C.css("position","absolute")}return C},_adjustOffsetFromHelper:function(C){if(typeof C=="string"){C=C.split(" ")}if(A.isArray(C)){C={left:+C[0],top:+C[1]||0}}if("left" in C){this.offset.click.left=C.left+this.margins.left}if("right" in C){this.offset.click.left=this.helperProportions.width-C.right+this.margins.left}if("top" in C){this.offset.click.top=C.top+this.margins.top}if("bottom" in C){this.offset.click.top=this.helperProportions.height-C.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var C=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&A.contains(this.scrollParent[0],this.offsetParent[0])){C.left+=this.scrollParent.scrollLeft();C.top+=this.scrollParent.scrollTop()}if((this.offsetParent[0]==document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&A.ui.ie)){C={top:0,left:0}}return{top:C.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:C.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var C=this.element.position();return{top:C.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:C.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0),right:(parseInt(this.element.css("marginRight"),10)||0),bottom:(parseInt(this.element.css("marginBottom"),10)||0)}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var F=this.options;if(F.containment=="parent"){F.containment=this.helper[0].parentNode}if(F.containment=="document"||F.containment=="window"){this.containment=[F.containment=="document"?0:A(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,F.containment=="document"?0:A(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(F.containment=="document"?0:A(window).scrollLeft())+A(F.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(F.containment=="document"?0:A(window).scrollTop())+(A(F.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!(/^(document|window|parent)$/).test(F.containment)&&F.containment.constructor!=Array){var G=A(F.containment);var D=G[0];if(!D){return }var E=G.offset();var C=(A(D).css("overflow")!="hidden");this.containment=[(parseInt(A(D).css("borderLeftWidth"),10)||0)+(parseInt(A(D).css("paddingLeft"),10)||0),(parseInt(A(D).css("borderTopWidth"),10)||0)+(parseInt(A(D).css("paddingTop"),10)||0),(C?Math.max(D.scrollWidth,D.offsetWidth):D.offsetWidth)-(parseInt(A(D).css("borderLeftWidth"),10)||0)-(parseInt(A(D).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(C?Math.max(D.scrollHeight,D.offsetHeight):D.offsetHeight)-(parseInt(A(D).css("borderTopWidth"),10)||0)-(parseInt(A(D).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];this.relative_container=G}else{if(F.containment.constructor==Array){this.containment=F.containment}}},_convertPositionTo:function(F,H){if(!H){H=this.position}var D=F=="absolute"?1:-1;var E=this.options,C=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&A.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,G=(/(html|body)/i).test(C[0].tagName);return{top:(H.top+this.offset.relative.top*D+this.offset.parent.top*D-((this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(G?0:C.scrollTop()))*D)),left:(H.left+this.offset.relative.left*D+this.offset.parent.left*D-((this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():G?0:C.scrollLeft())*D))}},_generatePosition:function(D){var E=this.options,L=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&A.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,I=(/(html|body)/i).test(L[0].tagName);var H=D.pageX;var G=D.pageY;if(this.originalPosition){var C;if(this.containment){if(this.relative_container){var K=this.relative_container.offset();C=[this.containment[0]+K.left,this.containment[1]+K.top,this.containment[2]+K.left,this.containment[3]+K.top]}else{C=this.containment}if(D.pageX-this.offset.click.left<C[0]){H=C[0]+this.offset.click.left}if(D.pageY-this.offset.click.top<C[1]){G=C[1]+this.offset.click.top}if(D.pageX-this.offset.click.left>C[2]){H=C[2]+this.offset.click.left}if(D.pageY-this.offset.click.top>C[3]){G=C[3]+this.offset.click.top}}if(E.grid){var J=E.grid[1]?this.originalPageY+Math.round((G-this.originalPageY)/E.grid[1])*E.grid[1]:this.originalPageY;G=C?(!(J-this.offset.click.top<C[1]||J-this.offset.click.top>C[3])?J:(!(J-this.offset.click.top<C[1])?J-E.grid[1]:J+E.grid[1])):J;var F=E.grid[0]?this.originalPageX+Math.round((H-this.originalPageX)/E.grid[0])*E.grid[0]:this.originalPageX;H=C?(!(F-this.offset.click.left<C[0]||F-this.offset.click.left>C[2])?F:(!(F-this.offset.click.left<C[0])?F-E.grid[0]:F+E.grid[0])):F}}return{top:(G-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+((this.cssPosition=="fixed"?-this.scrollParent.scrollTop():(I?0:L.scrollTop())))),left:(H-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+((this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():I?0:L.scrollLeft())))}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");if(this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval){this.helper.remove()}this.helper=null;this.cancelHelperRemoval=false},_trigger:function(C,D,E){E=E||this._uiHash();A.ui.plugin.call(this,C,[D,E]);if(C=="drag"){this.positionAbs=this._convertPositionTo("absolute")}return A.Widget.prototype._trigger.call(this,C,D,E)},plugins:{},_uiHash:function(C){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});A.ui.plugin.add("draggable","connectToSortable",{start:function(D,F){var E=A(this).data("draggable"),G=E.options,C=A.extend({},F,{item:E.element});E.sortables=[];A(G.connectToSortable).each(function(){var H=A.data(this,"sortable");if(H&&!H.options.disabled){E.sortables.push({instance:H,shouldRevert:H.options.revert});H.refreshPositions();H._trigger("activate",D,C)}})},stop:function(D,F){var E=A(this).data("draggable"),C=A.extend({},F,{item:E.element});A.each(E.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;E.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert){this.instance.options.revert=true}this.instance._mouseStop(D);this.instance.options.helper=this.instance.options._helper;if(E.options.helper=="original"){this.instance.currentItem.css({top:"auto",left:"auto"})}}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",D,C)}})},drag:function(D,G){var F=A(this).data("draggable"),C=this;var E=function(J){var O=this.offset.click.top,N=this.offset.click.left;var H=this.positionAbs.top,L=this.positionAbs.left;var K=J.height,M=J.width;var P=J.top,I=J.left;return A.ui.isOver(H+O,L+N,P,I,K,M)};A.each(F.sortables,function(I){var H=false;var J=this;this.instance.positionAbs=F.positionAbs;this.instance.helperProportions=F.helperProportions;this.instance.offset.click=F.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){H=true;A.each(F.sortables,function(){this.instance.positionAbs=F.positionAbs;this.instance.helperProportions=F.helperProportions;this.instance.offset.click=F.offset.click;if(this!=J&&this.instance._intersectsWith(this.instance.containerCache)&&A.ui.contains(J.instance.element[0],this.instance.element[0])){H=false}return H})}if(H){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=A(C).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return G.helper[0]};D.target=this.instance.currentItem[0];this.instance._mouseCapture(D,true);this.instance._mouseStart(D,true,true);this.instance.offset.click.top=F.offset.click.top;this.instance.offset.click.left=F.offset.click.left;this.instance.offset.parent.left-=F.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=F.offset.parent.top-this.instance.offset.parent.top;F._trigger("toSortable",D);F.dropped=this.instance.element;F.currentItem=F.element;this.instance.fromOutside=F}if(this.instance.currentItem){this.instance._mouseDrag(D)}}else{if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",D,this.instance._uiHash(this.instance));this.instance._mouseStop(D,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();if(this.instance.placeholder){this.instance.placeholder.remove()}F._trigger("fromSortable",D);F.dropped=false}}})}});A.ui.plugin.add("draggable","cursor",{start:function(D,E){var C=A("body"),F=A(this).data("draggable").options;if(C.css("cursor")){F._cursor=C.css("cursor")}C.css("cursor",F.cursor)},stop:function(C,D){var E=A(this).data("draggable").options;if(E._cursor){A("body").css("cursor",E._cursor)}}});A.ui.plugin.add("draggable","opacity",{start:function(D,E){var C=A(E.helper),F=A(this).data("draggable").options;if(C.css("opacity")){F._opacity=C.css("opacity")}C.css("opacity",F.opacity)},stop:function(C,D){var E=A(this).data("draggable").options;if(E._opacity){A(D.helper).css("opacity",E._opacity)}}});A.ui.plugin.add("draggable","scroll",{start:function(D,E){var C=A(this).data("draggable");if(C.scrollParent[0]!=document&&C.scrollParent[0].tagName!="HTML"){C.overflowOffset=C.scrollParent.offset()}},drag:function(E,F){var D=A(this).data("draggable"),G=D.options,C=false;if(D.scrollParent[0]!=document&&D.scrollParent[0].tagName!="HTML"){if(!G.axis||G.axis!="x"){if((D.overflowOffset.top+D.scrollParent[0].offsetHeight)-E.pageY<G.scrollSensitivity){D.scrollParent[0].scrollTop=C=D.scrollParent[0].scrollTop+G.scrollSpeed}else{if(E.pageY-D.overflowOffset.top<G.scrollSensitivity){D.scrollParent[0].scrollTop=C=D.scrollParent[0].scrollTop-G.scrollSpeed}}}if(!G.axis||G.axis!="y"){if((D.overflowOffset.left+D.scrollParent[0].offsetWidth)-E.pageX<G.scrollSensitivity){D.scrollParent[0].scrollLeft=C=D.scrollParent[0].scrollLeft+G.scrollSpeed}else{if(E.pageX-D.overflowOffset.left<G.scrollSensitivity){D.scrollParent[0].scrollLeft=C=D.scrollParent[0].scrollLeft-G.scrollSpeed}}}}else{if(!G.axis||G.axis!="x"){if(E.pageY-A(document).scrollTop()<G.scrollSensitivity){C=A(document).scrollTop(A(document).scrollTop()-G.scrollSpeed)}else{if(A(window).height()-(E.pageY-A(document).scrollTop())<G.scrollSensitivity){C=A(document).scrollTop(A(document).scrollTop()+G.scrollSpeed)}}}if(!G.axis||G.axis!="y"){if(E.pageX-A(document).scrollLeft()<G.scrollSensitivity){C=A(document).scrollLeft(A(document).scrollLeft()-G.scrollSpeed)}else{if(A(window).width()-(E.pageX-A(document).scrollLeft())<G.scrollSensitivity){C=A(document).scrollLeft(A(document).scrollLeft()+G.scrollSpeed)}}}}if(C!==false&&A.ui.ddmanager&&!G.dropBehaviour){A.ui.ddmanager.prepareOffsets(D,E)}}});A.ui.plugin.add("draggable","snap",{start:function(D,E){var C=A(this).data("draggable"),F=C.options;C.snapElements=[];A(F.snap.constructor!=String?(F.snap.items||":data(draggable)"):F.snap).each(function(){var H=A(this);var G=H.offset();if(this!=C.element[0]){C.snapElements.push({item:this,width:H.outerWidth(),height:H.outerHeight(),top:G.top,left:G.left})}})},drag:function(O,L){var F=A(this).data("draggable"),M=F.options;var S=M.snapTolerance;var R=L.offset.left,Q=R+F.helperProportions.width,E=L.offset.top,D=E+F.helperProportions.height;for(var P=F.snapElements.length-1;P>=0;P--){var N=F.snapElements[P].left,K=N+F.snapElements[P].width,J=F.snapElements[P].top,U=J+F.snapElements[P].height;if(!((N-S<R&&R<K+S&&J-S<E&&E<U+S)||(N-S<R&&R<K+S&&J-S<D&&D<U+S)||(N-S<Q&&Q<K+S&&J-S<E&&E<U+S)||(N-S<Q&&Q<K+S&&J-S<D&&D<U+S))){if(F.snapElements[P].snapping){(F.options.snap.release&&F.options.snap.release.call(F.element,O,A.extend(F._uiHash(),{snapItem:F.snapElements[P].item})))}F.snapElements[P].snapping=false;continue}if(M.snapMode!="inner"){var C=Math.abs(J-D)<=S;var T=Math.abs(U-E)<=S;var H=Math.abs(N-Q)<=S;var I=Math.abs(K-R)<=S;if(C){L.position.top=F._convertPositionTo("relative",{top:J-F.helperProportions.height,left:0}).top-F.margins.top}if(T){L.position.top=F._convertPositionTo("relative",{top:U,left:0}).top-F.margins.top}if(H){L.position.left=F._convertPositionTo("relative",{top:0,left:N-F.helperProportions.width}).left-F.margins.left}if(I){L.position.left=F._convertPositionTo("relative",{top:0,left:K}).left-F.margins.left}}var G=(C||T||H||I);if(M.snapMode!="outer"){var C=Math.abs(J-E)<=S;var T=Math.abs(U-D)<=S;var H=Math.abs(N-R)<=S;var I=Math.abs(K-Q)<=S;if(C){L.position.top=F._convertPositionTo("relative",{top:J,left:0}).top-F.margins.top}if(T){L.position.top=F._convertPositionTo("relative",{top:U-F.helperProportions.height,left:0}).top-F.margins.top}if(H){L.position.left=F._convertPositionTo("relative",{top:0,left:N}).left-F.margins.left}if(I){L.position.left=F._convertPositionTo("relative",{top:0,left:K-F.helperProportions.width}).left-F.margins.left}}if(!F.snapElements[P].snapping&&(C||T||H||I||G)){(F.options.snap.snap&&F.options.snap.snap.call(F.element,O,A.extend(F._uiHash(),{snapItem:F.snapElements[P].item})))}F.snapElements[P].snapping=(C||T||H||I||G)}}});A.ui.plugin.add("draggable","stack",{start:function(D,E){var G=A(this).data("draggable").options;var F=A.makeArray(A(G.stack)).sort(function(I,H){return(parseInt(A(I).css("zIndex"),10)||0)-(parseInt(A(H).css("zIndex"),10)||0)});if(!F.length){return }var C=parseInt(F[0].style.zIndex)||0;A(F).each(function(H){this.style.zIndex=C+H});this[0].style.zIndex=C+F.length}});A.ui.plugin.add("draggable","zIndex",{start:function(D,E){var C=A(E.helper),F=A(this).data("draggable").options;if(C.css("zIndex")){F._zIndex=C.css("zIndex")}C.css("zIndex",F.zIndex)},stop:function(C,D){var E=A(this).data("draggable").options;if(E._zIndex){A(D.helper).css("zIndex",E._zIndex)}}})})(jQuery);
/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,H,C){var A=$([]),E=$.resize=$.extend($.resize,{}),I,K="setTimeout",J="resize",D=J+"-special-event",B="delay",F="throttleWindow";E[B]=250;E[F]=true;$.event.special[J]={setup:function(){if(!E[F]&&this[K]){return false}var L=$(this);A=A.add(L);$.data(this,D,{w:L.width(),h:L.height()});if(A.length===1){G()}},teardown:function(){if(!E[F]&&this[K]){return false}var L=$(this);A=A.not(L);L.removeData(D);if(!A.length){clearTimeout(I)}},add:function(L){if(!E[F]&&this[K]){return false}var N;function M(S,O,P){var Q=$(this),R=$.data(this,D);R.w=O!==C?O:Q.width();R.h=P!==C?P:Q.height();N.apply(this,arguments)}if($.isFunction(L)){N=L;return M}else{N=L.handler;L.handler=M}}};function G(){I=H[K](function(){A.each(function(){var N=$(this),M=N.width(),L=N.height(),O=$.data(this,D);if(M!==O.w||L!==O.h){N.trigger(J,[O.w=M,O.h=L])}});G()},E[B])}})(jQuery,this);
/*!
 * jquery.base64.js 0.1 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 *
 * Based upon: https://gist.github.com/Yaffle/1284012
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function(c) { // (note parentheses for precence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function(c) { // (note parentheses for precence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));
(function($){$.addFlex=function(t,p){if(typeof (t)==="undefined"){return }if(t.grid){return t}var initFlag=true;var pageSize=($.ctx&&$.ctx._pageSize)?$.ctx._pageSize:20;p=$.extend({id:Math.floor(Math.random()*100000000)+"_grid",height:200,width:"auto",striped:true,novstripe:false,minwidth:30,minheight:0,resizable:true,method:"POST",errormsg:"Connection Error",usepager:true,nowrap:true,page:1,total:1,useRp:true,useRpInput:true,rp:pageSize,rpMaxSize:200,rpOptions:[10,20,30,40,50,100,150,200],title:false,idProperty:"id",pagestat:"Displaying {from} to {to} of {total} items",pagetext:$.i18n("validate.grid.over_page6.js"),outof:$.i18n("validate.grid.over_page5.js"),findtext:"Find "+$.i18n("validate.grid.over_page5.js"),params:{},procmsg:"Processing, please wait ...",query:"",qtype:"",nomsg:"No items",minColToggle:2,showToggleBtn:true,hideOnSubmit:true,autoload:true,blockOpacity:0.5,preProcess:false,addTitleToCell:false,dblClickResize:false,onDragCol:false,onToggleCol:false,onChangeSort:false,onCurrentPageSort:true,onSuccess:false,onNoDataSuccess:false,onError:false,onSubmit:false,datas:null,click:null,dblclick:null,render:null,callBackTotle:null,singleSelect:true,managerName:null,managerMethod:null,isEscapeHTML:true,heightSubtract:0,customize:true,vChangeParam:{changeTar:"grid_detail",overflow:"auto",subHeight:0,position:"static",autoResize:true},vChange:false,isHaveIframe:false,hChangeParam:{subHeight:55},hChange:false,parentId:null,slideToggleBtn:false,UMD:"down",slideToggleUpHandle:function(){if(p.UMD=="down"){p.UMD="middle"}else{if(p.UMD=="middle"){p.UMD="up"}else{if(p.UMD=="up"){g.resizeGridUpDown(p.UMD)}}}g.resizeGridUpDown(p.UMD)},slideToggleDownHandle:function(){if(p.UMD=="down"){g.resizeGridUpDown(p.UMD)}else{if(p.UMD=="middle"){p.UMD="down"}else{if(p.UMD=="up"){p.UMD="middle"}}}g.resizeGridUpDown(p.UMD)},dataTable:false},p);p.colModelBak=$.extend({},p.colModel);if(p.vChangeParam.changeTar==undefined){p.vChangeParam.changeTar="grid_detail"}if(p.vChangeParam.overflow==undefined){p.vChangeParam.overflow="auto"}if(p.vChangeParam.subHeight==undefined){p.vChangeParam.subHeight=0}if(p.vChangeParam.autoResize==undefined){p.vChangeParam.autoResize=true}$(t).show().attr({cellPadding:0,cellSpacing:0,border:0}).removeAttr("width");p.gridClassName=p.id+"_classtag";var timer=null;var grayTimer=null;var g={hset:{},finished:true,rePosDrag:function(){var hsl=this.hDiv.scrollLeft;var cdleft=0-hsl;if(hsl>0){cdleft-=Math.floor(p.cgwidth/2)}$(g.cDrag).css({top:g.hDiv.offsetTop+1});var cdpad=this.cdpad;$("div",g.cDrag).hide();var arr=$("thead tr:first th:visible",this.hDiv);for(var i=0;i<arr.length;i++){var cdpos=parseInt($("div",arr[i]).width());if(cdleft==0){cdleft-=Math.floor(p.cgwidth/2)}cdpos=cdpos+cdleft+cdpad;if(isNaN(cdpos)){cdpos=0}$("div:eq("+i+")",g.cDrag).css({left:cdpos+"px"}).show();cdleft=cdpos}$(".bDiv table").eq(0).css({width:$(".hDiv table").eq(0).width()+"px"});$(".hDivBox").eq(0).css({width:$(".hDivBox table").eq(0).width()+20+"px"})},fixHeight:function(newH){newH=false;if(!newH){newH=$(g.bDiv).height()}var hdHeight=$(this.hDiv).height();$("div",this.cDrag).each(function(){$(this).height(newH+hdHeight)});var nd=parseInt($(g.nDiv).height());if(nd>newH){$(g.nDiv).height(newH).width(200)}else{$(g.nDiv).height("auto").width("auto")}$(g.block).css({height:newH,marginBottom:(newH*-1)});var hrH=g.bDiv.offsetTop+newH;if(p.height!="auto"&&p.resizable){hrH=g.vDiv.offsetTop}$(g.rDiv).css({height:hrH});if(p.vChange){var tt=$("#"+p.vChangeParam.changeTar);if(tt.length>0){var h=$(g.gDiv).parent().height();$("#"+p.vChangeParam.changeTar).css("overflow",p.vChangeParam.overflow).height(h-$(g.gDiv).height()-p.vChangeParam.subHeight)}}},saveCustomize:function(resetFlag,callBackFn){if(p.customize){var ck=p.customId;if(ck){var _cols=$("th",g.hDiv);var _modes={};var orders=[];var showWidth=[];_cols.each(function(){var $t=$(this),_colmodes=$t.attr("colmode"),v=$t.is(":visible");if(_colmodes&&_colmodes!=""){$.each(p.colModel,function(i,n){if(n.name==_colmodes){if(!v){_modes[n.name]=0}else{showWidth.push(n.name+"#"+$t.width())}orders.push(n.name)}})}});if(resetFlag){_modes={};_modes.resetWidth=true}else{_modes.__ORDER=orders}$.each(orders,function(i,n){var matchVar=n+"#";$.each(showWidth,function(j,m){if(m.substring(0,matchVar.length)==matchVar){orders[i]=m}})});var upm=new ctpUserPreferenceManager();upm.saveGridPreference(ck,_modes,{success:function(){if(getCtpTop().$.ctx&&getCtpTop().$.ctx.customize){var ugpStr=getCtpTop().$.ctx.customize.grid_pref;var ugpRoot={};if(ugpStr){ugpRoot=$.parseJSON(ugpStr)}var ugp=ugpRoot[ck];if(ugp==undefined||ugp==null||ugp==""){ugp={}}if(resetFlag){ugp.resetWidth=true}else{ugp.__ORDER=orders}ugpRoot[ck]=ugp;var newGridPrefStr=$.toJSON(ugpRoot);getCtpTop().$.ctx.customize.grid_pref=newGridPrefStr}if(callBackFn!=undefined){callBackFn()}}})}}},dragStart:function(dragtype,e,obj){if(dragtype=="colresize"){$(g.nDiv).hide();$(g.nBtn).hide();var n=$("div",this.cDrag).index(obj);var ow=$("th:visible div:eq("+n+")",this.hDiv).width();$(obj).addClass("dragging").siblings().hide();$(obj).prev().addClass("dragging").show();var isIE8ORIE9=false;if(navigator.userAgent.indexOf("MSIE 8")!=-1||navigator.userAgent.indexOf("MSIE 9")!=-1){isIE8ORIE9=true}this.colresize={startX:(isIE8ORIE9?window.event.clientX:e.pageX),ol:parseInt(obj.style.left),ow:ow,n:n};$("body").css("cursor","col-resize")}else{if(dragtype=="vresize"){var hgo=false;$("body").css("cursor","row-resize");if(obj){hgo=true;$("body").css("cursor","col-resize")}p.height=$(g.bDiv).height();if(p.vChange==true&&p.isHaveIframe==true){var gridDetail=$("#"+p.vChangeParam.changeTar);gridDetail.css({position:"relative"});$("<div class='grid_mask'></div>").css({position:"absolute",background:"red",top:0,left:0,width:gridDetail.width()+"px",height:gridDetail.height()+"px","z-index":20,"-moz-opacity":0,opacity:0}).appendTo(gridDetail)}this.vresize={h:p.height,sy:e.pageY,w:p.width,sx:e.pageX,hgo:hgo}}else{if(dragtype=="colMove"){$(g.nDiv).hide();$(g.nBtn).hide();this.hset=$(this.hDiv).offset();this.hset.right=this.hset.left+$("table",this.hDiv).width();this.hset.bottom=this.hset.top+$("table",this.hDiv).height();this.dcol=obj;this.dcoln=$("th",this.hDiv).index(obj);this.colCopy=document.createElement("div");this.colCopy.className="colCopy";this.colCopy.innerHTML=obj.innerHTML;if($.browser.msie){this.colCopy.className="colCopy ie"}$(this.colCopy).css({position:"absolute","float":"left",display:"none",textAlign:obj.align});$("body").append(this.colCopy);$(this.cDrag).hide()}}}$("body").noSelect()},dragMove:function(e){if(this.colresize){var n=this.colresize.n;var isIE8ORIE9=false;if(navigator.userAgent.indexOf("MSIE 8")!=-1||navigator.userAgent.indexOf("MSIE 9")!=-1){isIE8ORIE9=true}var diff=(isIE8ORIE9?window.event.clientX:e.pageX)-this.colresize.startX;var nleft=this.colresize.ol+diff;var nw=this.colresize.ow+diff;if(nw>p.minwidth){$("div:eq("+n+")",this.cDrag).css("left",nleft);this.colresize.nw=nw}}else{if(this.vresize){var v=this.vresize;var y=e.pageY;var diff=y-v.sy;if(!p.defwidth){p.defwidth=p.width}if(p.width!="auto"&&!p.nohresize&&v.hgo){var x=e.pageX;var xdiff=x-v.sx;var newW=v.w+xdiff;if(newW>p.defwidth){this.gDiv.style.width=newW+"px";p.width=newW}}var newH=v.h+diff;if((newH>p.minheight||p.height<p.minheight)&&!v.hgo){this.bDiv.style.height=newH+"px";p.height=newH;this.fixHeight(newH)}v=null}else{if(this.colCopy){$(this.dcol).addClass("thMove").removeClass("thOver");if(e.pageX>this.hset.right||e.pageX<this.hset.left||e.pageY>this.hset.bottom||e.pageY<this.hset.top){$("body").css("cursor","move")}else{$("body").css("cursor","pointer")}$(this.colCopy).css({top:e.pageY+10,left:e.pageX+20,display:"block"})}}}},dragEnd:function(){if(this.colresize){var n=this.colresize.n;var nw=this.colresize.nw;$("th:visible div:eq("+n+")",this.hDiv).css("width",nw);$("tr",this.bDiv).each(function(){var $tdDiv=$("td:visible div:eq("+n+")",this);$tdDiv.css("width",nw);g.addTitleToCell($tdDiv)});this.hDiv.scrollLeft=this.bDiv.scrollLeft;$("div:eq("+n+")",this.cDrag).siblings().show();$(".dragging",this.cDrag).removeClass("dragging");this.rePosDrag();this.fixHeight();this.colresize=false;var name=p.colModel[n].name;this.saveCustomize()}else{if(this.vresize){this.vresize=false;if(p.vChange==true&&p.isHaveIframe==true){var gridDetail=$("#"+p.vChangeParam.changeTar);var _position=p.vChangeParam.position;gridDetail.css({position:_position});var grid_mask=$(".grid_mask");if(grid_mask.size()>0){grid_mask.remove()}}this.saveCustomize()}else{if(this.colCopy){$(this.colCopy).remove();if(this.dcolt!=null){if(this.dcoln>this.dcolt){$("th:eq("+this.dcolt+")",this.hDiv).before(this.dcol)}else{$("th:eq("+this.dcolt+")",this.hDiv).after(this.dcol)}this.switchCol(this.dcoln,this.dcolt);$(this.cdropleft).remove();$(this.cdropright).remove();this.rePosDrag();if(p.onDragCol){p.onDragCol(this.dcoln,this.dcolt)}}this.dcol=null;this.hset=null;this.dcoln=null;this.dcolt=null;this.colCopy=null;$(".thMove",this.hDiv).removeClass("thMove");$(this.cDrag).show();var _cols=$("th",g.hDiv);var _modes=[];var _modesMap=[];_cols.each(function(k){var _colmodes=$(this).attr("colmode");$.each(p.colModelBak,function(i,n){if(n.name==_colmodes){_modesMap[k]=i;_modes.push(n)}})});p.colModel=_modes;p._modesMap=_modesMap;this.saveCustomize()}}}$("body").css("cursor","default");$("body").noSelect(false)},toggleCol:function(cid,visible){var ncol=$("th[axis='col"+cid+"']",this.hDiv)[0];var n=$("thead th",g.hDiv).index(ncol);var cb=$("input[value="+cid+"]",g.nDiv)[0];if(visible==null){visible=ncol.hidden}if($("input:checked",g.nDiv).length<p.minColToggle&&!visible){return false}if(visible){ncol.hidden=false;$(ncol).show();cb.checked=true}else{ncol.hidden=true;$(ncol).hide();cb.checked=false}$("tbody tr",t).each(function(){if(visible){$("td:eq("+n+")",this).show()}else{$("td:eq("+n+")",this).hide()}});this.rePosDrag();if(p.onToggleCol){p.onToggleCol(cid,visible)}this.saveCustomize();return visible},switchCol:function(cdrag,cdrop){$("tbody tr",t).each(function(){if(cdrag>cdrop){$("td:eq("+cdrop+")",this).before($("td:eq("+cdrag+")",this))}else{$("td:eq("+cdrop+")",this).after($("td:eq("+cdrag+")",this))}});if(cdrag>cdrop){$("tr:eq("+cdrop+")",this.nDiv).before($("tr:eq("+cdrag+")",this.nDiv))}else{$("tr:eq("+cdrop+")",this.nDiv).after($("tr:eq("+cdrag+")",this.nDiv))}if($.browser.msie&&$.browser.version<7){$("tr:eq("+cdrop+") input",this.nDiv)[0].checked=true}this.hDiv.scrollLeft=this.bDiv.scrollLeft},scroll:function(){this.hDiv.scrollLeft=this.bDiv.scrollLeft;this.rePosDrag()},addNewData:function(data,parentId){data=$.extend({rows:[],page:0,total:0},data);if(p.preProcess){data=p.preProcess(data)}$(".pReload",this.pDiv).removeClass("loading");this.loading=false;if(!data){$(".pPageStat",this.pDiv).html(p.errormsg);return false}if(data.params){p.params=data.params}tbody=$("#list");var ttr=document.createElement("tr"),cc=0;$("thead tr:first th",g.hDiv).each(function(){var th=$(this),td=document.createElement("td"),tdDiv=document.createElement("div");var idx=th.attr("axis").substr(3);td.align=this.align;if(p.sortname==th.attr("abbr")&&p.sortname){td.className="sorted"}$(tdDiv).css({textAlign:th[0].align,width:$("div:first",th)[0].style.width});if(this.hidden){$(td).css("display","none")}if(p.nowrap==false){$(tdDiv).css("white-space","normal")}if(p.colModel[cc].codecfg){$(tdDiv).attr("codecfg",p.colModel[cc].codecfg).addClass("codecfg")}$(td).append(tdDiv);$(td).attr("abbr",th.attr("abbr"));$(ttr).append(td);td=null;cc++});$.each(data.rows,function(i,row){var ctr=$(ttr).clone();tr=ctr[0];if(row.name){tr.name=row.name}if(row.color){$(tr).css("background",row.color)}else{if(i%2&&p.striped){tr.className="erow"}}if(row.ishidden){$(tr).addClass("hidden")}if(row.disable){$(tr).addClass("graytr")}if(row[p.idProperty]){tr.id="row"+row[p.idProperty]}var ctrc=ctr.children();for(var j=0;j<cc;j++){var td=ctrc[j],tdiv=$(td).children()[0],divd,clm=p.colModel[j];if(typeof row.cell=="undefined"){divd=row[clm.name];if(divd&&typeof divd=="string"&&p.isEscapeHTML){divd=divd.escapeHTML(true,false)}}else{if(typeof row.cell[j]!="undefined"){divd=(row.cell[j]!=null)?row.cell[j]:""}else{divd=row.cell[clm.name]}}if(divd&&clm.cutsize){divd=divd.substring(0,clm.cutsize)}if(clm.type=="checkbox"){divd='<input type="checkbox" gridRowCheckBox="'+p.gridClassName+"\" class='noClick' row=\""+i+'" value="'+divd+'"/>'}else{if(clm.type=="radio"){divd='<input type="radio" gridRowCheckBox="'+p.gridClassName+"\" class='noClick' row=\""+i+'" value="'+divd+'" name="gridradio"/>'}else{if(p.render){var mj=p._modesMap?p._modesMap[j]:j;divd=p.render(divd,row,i,mj,clm)}}}if(divd!=0&&(divd===""||divd===null)){divd="&nbsp;"}$(tdiv).addClass("text_overflow");tdiv.innerHTML=divd;$(tdiv).has("input[type='checkbox']").addClass("noClick");$(tdiv).has("input[type='radio']").addClass("noClick");if($.trim($(tdiv).text()).length>0){tdiv.setAttribute("title",$(tdiv).text())}}if(parentId){$("#"+parentId).after(tr)}else{$(tbody).append(tr)}tr=null});$("tr",t).unbind();$(t).empty();$(t).append(tbody);if(p.click){$(t).unbind("click");$(t).click(function(e){var target=e.target||e.srcElement;if(target.className.indexOf("noClick")==-1){var td=$(target).parents("td").eq(0);var tr=td.parent();if(tr.hasClass("graytr")){return }var col=$("td",tr).index(td);var row=$("tr",t).index(tr);if(row==-1){row=0}p.click(p.datas.rows[row],row,col,tr.attr("id"))}})}if(p.dblclick){$(t).unbind("dblclick");$(t).dblclick(function(e){var target=e.target||e.srcElement;if(target.className.indexOf("noClick")==-1){var td=$(target).parents("td").eq(0);var tr=td.parent();if(tr.hasClass("graytr")){return }var col=$("td",tr).index(td);var row=$("tr",t).index(tr);if(row==-1){row=0}p.dblclick(p.datas.rows[row],row,col,tr.attr("id"))}})}this.addRowProp();this.rePosDrag();tbody=null;data=null;i=null;if(p.onSuccess){p.onSuccess(this)}if(p.hideOnSubmit){$(g.block).remove()}this.hDiv.scrollLeft=this.bDiv.scrollLeft;if($.browser.opera){$(t).css("visibility","visible")}$(t).codetext()},addData:function(data){$(".grid_checkbox input[type=checkbox]",this.hDiv).prop("checked",false);data=$.extend({rows:[],page:0,total:0},data);p.datas=data;if(p.preProcess){data=p.preProcess(data)}$(".pReload",this.pDiv).removeClass("loading");this.loading=false;if(!data){$(".pPageStat",this.pDiv).html(p.errormsg);return false}if(!data.total){data.total=data.rows.length}p.total=data.total;if(p.total==0){$("tr, a, td, div",t).unbind();$(t).empty();p.pages=1;p.page=1;this.buildpager();$(".pPageStat",this.pDiv).html(p.nomsg);if($(g.block).size()>0){$(g.block).remove()}$("<div id='total_0_"+p.id+"'></div>").width($(".hDivBox",this.hDiv).width()).height(1).appendTo($(this.bDiv));if(p.onNoDataSuccess){p.onNoDataSuccess(this)}if(p.callBackTotle){p.callBackTotle(p.total)}this.rePosDrag();return false}else{var _totle0=$("#total_0_"+p.id);if(_totle0.size()>0){_totle0.remove()}}p.pages=Math.ceil(p.total/p.rp);p.page=data.page;if(data.params){p.params=data.params}this.buildpager();var tbodyInnerHtml=[];var cc=0;var widths=[];var aligns=[];var tdAttributes=[];$("thead tr:first th",g.hDiv).each(function(){var tdAttr="";var th=$(this);var width=$("div:first",th)[0].style.width;var align=th[0].align;var abbr=th.attr("abbr");if(p.sortname==abbr&&p.sortname){tdAttr+='class="sorted" '}tdAttr+='align="'+align+'" ';tdAttr+='abbr="'+abbr+'"';if(this.hidden){tdAttr+='style="display:none"'}widths.push(width);aligns.push(align);tdAttributes.push(tdAttr);cc++});$.each(data.rows,function(i,row){var tr={};if(row.name){tr.name=row.name.escapeHTML(false)}if(row.color){tr.style="background:"+row.color}else{if(i%2&&p.striped){tr["class"]="erow"}}if(row.disable){tr["class"]=tr["class"]+" graytr"}if(row[p.idProperty]){tr.id="row"+row[p.idProperty]}var trAttrs=[];$.each(tr,function(k,v){trAttrs.push(k);trAttrs.push("=");trAttrs.push('"'+v+'"')});var trInnerHTML=[];for(var j=0;j<cc;j++){var divd,clm=p.colModel[j];if(typeof row.cell=="undefined"){divd=row[clm.name];if(divd&&typeof divd=="string"){divd=divd.escapeHTML(true,false)}}else{if(typeof row.cell[j]!="undefined"){divd=(row.cell[j]!=null)?row.cell[j]:""}else{divd=row.cell[clm.name]}}if(divd&&clm.cutsize){divd=divd.substring(0,clm.cutsize)}if(clm.type=="checkbox"){divd='<input type="checkbox" gridRowCheckBox="'+p.gridClassName+"\" class='noClick' onclick='_noClickType = false;' row=\""+i+'" value="'+divd+'"/>'}else{if(clm.type=="radio"){divd='<input type="radio" gridRowCheckBox="'+p.gridClassName+"\" class='noClick' onclick='_noClickType = false;' row=\""+i+'" value="'+divd+'" name="gridradio"/>'}else{if(p.render){var mj=p._modesMap?p._modesMap[j]:j;divd=p.render(divd,row,i,Number(mj),clm)}}}if(divd!=0&&(divd===""||divd===null||typeof divd==="undefined")){divd="&nbsp;"}if(divd===""){divd="&nbsp;"}var codecfg=(p.colModel[j].codecfg);var tdiv='<div class="text_overflow'+(codecfg?" codecfg":"")+'"'+(codecfg?' codecfg="'+codecfg+'"':"")+' style="text-align:'+aligns[j]+";width:"+widths[j]+""+((p.nowrap==false)?";white-space:normal":"")+'">'+divd+"</div>";trInnerHTML.push("<td "+tdAttributes[j]+">"+tdiv+"</td>")}var grid_trClick="trClick_"+p.id;var grid_trMousedown="trMousedown_"+p.id;var grid_trMouseup="trMouseup_"+p.id;var grid_trMouseenter="trMouseenter_"+p.id;var grid_trMouseleave="trMouseleave_"+p.id;tbodyInnerHtml.push('<tr onclick="'+grid_trClick+'(event,this)" onmousedown="'+grid_trMousedown+'(event,this)" onmouseup="'+grid_trMouseup+'(event)" onmouseenter="'+grid_trMouseenter+'(event,this)" onmouseleave="'+grid_trMouseleave+'(event,this)" '+trAttrs.join(" ")+">"+trInnerHTML.join("")+"</tr>")});var $t=$(t);var tbodyHtml='<tbody id="list" class="hand">'+tbodyInnerHtml.join("")+"</tbody>";if(($.browser.msie&&$.browser.version!=10)||($.browser.msie&&document.documentMode==8)||($.browser.version==10&&document.documentMode==9)){$t.html(tbodyHtml)}else{t.innerHTML=tbodyHtml}$("div",$t).each(function(){var text=$.trim($(this).text());if(text.length>0){this.setAttribute("title",text)}});if(p.click){var grid_Click="click_"+p.id;window[grid_Click]=function(e){var target=e.target||e.srcElement;if(target.className.indexOf("noClick")==-1){var td=$(target).parents("td").eq(0);var tr=td.parent();if(tr.hasClass("graytr")){return }var col=$("td",tr).index(td);var row=$("tr",t).index(tr);if(row==-1){row=0}clearTimeout(timer);clearTimeout(grayTimer);if($.browser.version=="8.0"||$.browser.version=="7.0"){p.click(p.datas.rows[row],row,col);timer=setTimeout(function(){tr.addClass("graytr")},200)}else{timer=setTimeout(function(){if(p.datas.rows[row]){p.click(p.datas.rows[row],row,col);tr.addClass("graytr")}},200)}grayTimer=setTimeout(function(){tr.removeClass("graytr")},400)}};$t.attr("onclick",grid_Click+"(event)")}if(p.dblclick){var grid_DbClick="Dbclick_"+p.id;window[grid_DbClick]=function(e){var target=e.target||e.srcElement;if(target.className.indexOf("noClick")==-1){var td=$(target).parents("td").eq(0);var tr=td.parent();if(tr.hasClass("graytr")){return }var col=$("td",tr).index(td);var row=$("tr",t).index(tr);if(row==-1){row=0}clearTimeout(timer);clearTimeout(grayTimer);if(p.datas.rows[row]){p.dblclick(p.datas.rows[row],row,col)}}};$t.attr("ondblclick",grid_DbClick+"(event)")}this.addRowProp();this.rePosDrag();tbody=null;data=null;i=null;if(p.onSuccess){p.onSuccess(this)}if(p.callBackTotle){p.callBackTotle(p.total)}if(p.hideOnSubmit){$(g.block).remove()}this.hDiv.scrollLeft=this.bDiv.scrollLeft;$(".hDivBox",this.hDiv).width($(t).width()+20);if($.browser.opera){$t.css("visibility","visible")}$t.codetext()},changeSort:function(th){if(this.loading){return true}$(g.nDiv).hide();$(g.nBtn).hide();var sortByname;p.onCurrentPageSort==true?sortByname=$(th).attr("colmode"):sortByname=$(th).attr("abbr");p.sortType=$(th).attr("sortType");if(p.sortname==sortByname){if(p.sortorder=="asc"){p.sortorder="desc"}else{p.sortorder="asc"}}else{p.sortorder="asc"}$(th).addClass("sorted").siblings().removeClass("sorted");$(".sdesc",this.hDiv).removeClass("sdesc");$(".sasc",this.hDiv).removeClass("sasc");$("div",th).addClass("s"+p.sortorder);p.sortname=sortByname;if(p.onCurrentPageSort){this.setSort(p.sortname,p.sortorder,p.sortType)}else{this.populate()}if(p.onChangeSort){p.onChangeSort(p.sortname,p.sortorder,p.sortType)}},buildpager:function(){$(".pcontrol input",this.pDiv).val(p.page);$("span.total_page",this.pDiv).html($.i18n("validate.grid.over_page4.js")+p.pages+$.i18n("validate.grid.over_page5.js"));var r1=(p.page-1)*p.rp+1;var r2=r1+p.rp-1;if(p.total<r2){r2=p.total}var stat=p.pagestat;stat=stat.replace(/{from}/,r1);stat=stat.replace(/{to}/,r2);stat=stat.replace(/{total}/,p.total);$(".pPageStat",this.pDiv).html(stat);$(".total",this.pDiv).html($.i18n("validate.grid.over_page2.js")+p.total+$.i18n("validate.grid.over_page3.js"))},setSort:function(name,order,type){if($.trim(p.datas)==""){return }if(!p.datas.rows.sort){return }p.datas.rows.sort(function(a,b){var valueA=a[name];var valueB=b[name];if(type=="date"){valueA=Date.parse(valueA);valueB=Date.parse(valueB)}if(type=="number"){valueA=Number(valueA);valueB=Number(valueB)}if(type=="string"){if(valueA==null){valueA=""}else{valueA=""+valueA}if(valueB==null){valueB=""}else{valueB=""+valueB}var _f=valueA.localeCompare(valueB);if(order=="desc"){return _f}else{return _f*-1}}else{if(order=="desc"){if(valueA<valueB){return -1}if(valueA>valueB){return 1}return 0}if(order=="asc"){if(valueA>valueB){return -1}if(valueA<valueB){return 1}return 0}}});this.addData(p.datas)},populate:function(paras){if(this.loading){return true}if(p.onSubmit){var gh=p.onSubmit();if(!gh){return false}}this.loading=true;$(".pPageStat",this.pDiv).html(p.procmsg);$(".pReload",this.pDiv).addClass("loading");$(g.block).css({top:g.bDiv.offsetTop});if(p.hideOnSubmit){$(this.gDiv).prepend(g.block)}if($.browser.opera){$(t).css("visibility","hidden")}if(!p.newp){p.newp=1}if(p.page>p.pages){p.page=p.pages}if(paras){p.params=paras;if(paras.newp){p.newp=paras.newp}if(paras.page){p.newp=paras.page}}var fp={page:p.newp,size:p.rp,sortField:p.sortname,sortOrder:p.sortorder};if(p.onCurrentPageSort){fp.sortField=undefined;fp.sortOrder=undefined}if(p.managerName&&p.managerMethod&&window[p.managerName]){var callerResponder=new CallerResponder();callerResponder.success=function(fpi){if(fpi==null){return }fpi.rows=fpi.data;g.addData(fpi)};var _bs=new window[p.managerName]();_bs[p.managerMethod](fp,p.params,callerResponder)}else{if(p.datas!=null){g.addData(p.datas)}}},doSearch:function(){p.query=$("input[name=q]",g.sDiv).val();p.qtype=$("select[name=qtype]",g.sDiv).val();p.params[p.qtype]=p.query;p.newp=1;this.populate()},changePage:function(ctype,fc){$(".sdesc",this.hDiv).removeClass("sdesc");$(".sasc",this.hDiv).removeClass("sasc");if(p.total==0){return false}if(this.loading){return true}switch(ctype){case"first":p.newp=1;break;case"prev":if(p.page>1){p.newp=parseInt(p.page)-1}break;case"next":if(p.page<p.pages){p.newp=parseInt(p.page)+1}break;case"last":p.newp=p.pages;break;case"input":var nv=parseInt($(".pcontrol input",this.pDiv).val());if(isNaN(nv)){nv=1}if(nv<1){nv=1}else{if(nv>p.pages){nv=p.pages}}$(".pcontrol input",this.pDiv).val(nv);p.newp=nv;break}p.rpNew=$("#rpInputChange",g.pDiv).val();if(p.rpNew>p.rpMaxSize){p.rpNew=p.rpMaxSize;$("#rpInputChange",g.pDiv).val(p.rpNew)}if((p.newp==p.page)&&(p.rp==p.rpNew)&&!fc){return false}p.rp=p.rpNew;if(p.onChangePage){p.onChangePage(p.newp)}else{this.populate()}},getCellDim:function(obj){var ht=parseInt($(obj).height());var pht=parseInt($(obj).parent().height());var wt=parseInt(obj.style.width);var pwt=parseInt($(obj).parent().width());var top=obj.offsetParent.offsetTop;var left=obj.offsetParent.offsetLeft;var pdl=parseInt($(obj).css("paddingLeft"));var pdt=parseInt($(obj).css("paddingTop"));return{ht:ht,wt:wt,top:top,left:left,pdl:pdl,pdt:pdt,pht:pht,pwt:pwt}},addRowProp:function(){var _noClickType=true;var grid_trClick="trClick_"+p.id;window[grid_trClick]=function(e,t){t=$(t);var obj=(e.target||e.srcElement);if(obj.href||obj.type){if(obj.type=="checkbox"||obj.type=="radio"){var _checked=$(obj).prop("checked");if(_checked){t.siblings().removeClass("trSelected");t.addClass("trSelected")}else{t.removeClass("trSelected")}}return true}if(p.singleSelect&&!g.multisel){t.siblings().removeClass("trSelected");if($(obj).find("input[gridrowcheckbox]").size()==0){t.siblings().find("input[gridrowcheckbox]").prop("checked",false)}t.addClass("trSelected");if(t.hasClass("trSelected")){var _ch=t.find("input[gridrowcheckbox]");if(_ch.prop("disabled")==false){_ch.prop("checked",true)}}else{t.find("input[gridrowcheckbox]").prop("checked",false)}}if(p.vChange){if(_noClickType){if($("#"+p.vChangeParam.changeTar).size()>0&&p.vChangeParam.autoResize){p.UMD="middle";g.resizeGridUpDown(p.UMD)}var tar=t.find("input[type=checkbox]");if(tar.size()>0){try{tar.focus()}catch(e){}}var tar2=t.find("input[type=radio]");if(tar2.size()>0){try{tar2.focus()}catch(e){}}}else{_noClickType=true}}};var grid_trMousedown="trMousedown_"+p.id;window[grid_trMousedown]=function(e,t){t=$(t);if(e.shiftKey){t.toggleClass("trSelected");g.multisel=true;t.focus();$(g.gDiv).noSelect()}if(e.ctrlKey){t.toggleClass("trSelected");g.multisel=true;t.focus()}};var grid_trMouseup="trMouseup_"+p.id;window[grid_trMouseup]=function(e){if(g.multisel&&!e.ctrlKey){g.multisel=false;$(g.gDiv).noSelect(false)}};var grid_trMouseenter="trMouseenter_"+p.id;window[grid_trMouseenter]=function(e,t){t=$(t);if(g.multisel&&e.shiftKey){t.toggleClass("trSelected")}if($.browser.msie&&$.browser.version<7){t.addClass("trOver")}};var grid_trMouseleave="trMouseleave_"+p.id;window[grid_trMouseleave]=function(e,t){t=$(t);if(g.multisel&&e.shiftKey){t.toggleClass("trSelected")}if($.browser.msie&&$.browser.version<7){t.removeClass("trOver")}}},combo_flag:true,combo_resetIndex:function(selObj){if(this.combo_flag){selObj.selectedIndex=0}this.combo_flag=true},combo_doSelectAction:function(selObj){eval(selObj.options[selObj.selectedIndex].value);selObj.selectedIndex=0;this.combo_flag=false},addTitleToCell:function(tdDiv){if(p.addTitleToCell){var $span=$("<span />").css("display","none"),$div=(tdDiv instanceof jQuery)?tdDiv:$(tdDiv),div_w=$div.outerWidth(),span_w=0;$("body").children(":first").before($span);$span.html($div.html());$span.css("font-size",""+$div.css("font-size"));$span.css("padding-left",""+$div.css("padding-left"));span_w=$span.innerWidth();$span.remove();if(span_w>div_w){$div.attr("title",$div.text())}else{$div.removeAttr("title")}}},autoResizeColumn:function(obj){if(!p.dblClickResize){return }var n=$("div",this.cDrag).index(obj),$th=$("th:visible div:eq("+n+")",this.hDiv),ol=parseInt(obj.style.left),ow=$th.width(),nw=0,nl=0,$span=$("<span />");$("body").children(":first").before($span);$span.html($th.html());$span.css("font-size",""+$th.css("font-size"));$span.css("padding-left",""+$th.css("padding-left"));$span.css("padding-right",""+$th.css("padding-right"));nw=$span.width();$("tr",this.bDiv).each(function(){var $tdDiv=$("td:visible div:eq("+n+")",this),spanW=0;$span.html($tdDiv.html());$span.css("font-size",""+$tdDiv.css("font-size"));$span.css("padding-left",""+$tdDiv.css("padding-left"));$span.css("padding-right",""+$tdDiv.css("padding-right"));spanW=$span.width();nw=(spanW>nw)?spanW:nw});$span.remove();nw=(p.minWidth>nw)?p.minWidth:nw;nl=ol+(nw-ow);$("div:eq("+n+")",this.cDrag).css("left",nl);this.colresize={nw:nw,n:n};g.dragEnd()},getSelectRows:function(){var inputs=$(t).find("input[gridRowCheckBox="+p.gridClassName+"]:checked");if(inputs.length<=0){$(t).find("input[gridRowCheckBox="+p.gridClassName+"]").each(function(){var checked=$(this).attr("checked");if(checked){inputs.push($(this))}})}var rows=[];inputs.each(function(){var index=$(this).attr("row");rows.push(p.datas.rows[index])});return rows},getPageRows:function(){var inputs=$(t).find("input[gridRowCheckBox="+p.gridClassName+"]");var rows=[];inputs.each(function(){var index=$(this).attr("row");rows.push(p.datas.rows[index])});return rows},resizeGrid:function(h){var _orgin=$(g.bDiv).height();var sub=_orgin-h;$(g.bDiv).css("height",h);var ssss=$("#"+p.vChangeParam.changeTar).height();$("#"+p.vChangeParam.changeTar).height(ssss+sub);$(g.block).css({height:h,marginBottom:(h*-1)})},resizeGridAuto:function(){if(p.parentId!=null){var userpagerH=0;p.usepager?userpagerH+=34:null;p.resizable?userpagerH+=11:null;g.resizeGrid($("#"+p.parentId).height()-userpagerH-52);$("#"+p.id).width($("#"+p.parentId).width())}else{$("#"+p.id).width(p.width);g.resizeGrid(p.height-52)}},resizeGridUpDown:function(upDown){setTimeout(function(){var bDivHeight=$(g.bDiv).height();var userpagerH=0;var resizableH=0;p.usepager?userpagerH+=34:null;p.resizable?resizableH+=10:null;var stepArr=[0,($("#"+p.parentId).height()-userpagerH-resizableH-52)/100*35,$("#"+p.parentId).height()-resizableH-userpagerH-52];if(upDown=="up"){g.resizeGrid(stepArr[0]);if(p.vChange){var tt=$("#"+p.vChangeParam.changeTar);if(tt.length>0&&bDivHeight>0){var _tth=tt.height();tt.height(_tth+34)}p.addPDivHeight=true}if(p.usepager){$(g.pDiv).hide()}}else{if(upDown=="middle"){g.resizeGrid(stepArr[1]);$(g.pDiv).show();if(p.addPDivHeight){if(p.vChange){var tt=$("#"+p.vChangeParam.changeTar);if(tt.length>0){var _tth=tt.height();tt.height(_tth-34)}p.addPDivHeight=false}}}else{if(upDown=="down"){g.resizeGrid(stepArr[2]);$(g.pDiv).show();var tt=$("#"+p.vChangeParam.changeTar);if(tt.length>0){tt.data("resizeGridUpDownStop",true)}}else{return }}}p.UMD=upDown},200)},pager:0};g.gDiv=document.createElement("div");g.mDiv=document.createElement("div");g.hDiv=document.createElement("div");g.bDiv=document.createElement("div");g.vDiv=document.createElement("div");g.rDiv=document.createElement("div");g.cDrag=document.createElement("div");g.block=document.createElement("div");g.nDiv=document.createElement("div");g.nBtn=document.createElement("div");g.iDiv=document.createElement("div");g.tDiv=document.createElement("div");g.sDiv=document.createElement("div");g.pDiv=document.createElement("div");if(!p.usepager){g.pDiv.style.display="none"}g.hTable=document.createElement("table");g.gDiv.className=p.dataTable?"flexigrid dataTable":"flexigrid";g.gDiv.id=p.id;if(p.width!="auto"){g.gDiv.style.width=p.width+"px"}if(p.parentId!=null){var userpagerH=0;p.usepager?userpagerH+=34:null;p.resizable?userpagerH+=11:null;p.height=$("#"+p.parentId).height()-userpagerH-p.heightSubtract;if(p.vChange){var tt=$("#"+p.vChangeParam.changeTar);if(tt.length>0){tt.height(0)}}}if($.browser.msie){$(g.gDiv).addClass("ie")}if(p.novstripe){$(g.gDiv).addClass("novstripe")}$(t).before(g.gDiv);$(g.gDiv).append(t);g.hDiv.className="hDiv";g.hDiv.id=p.id+"_hDiv";$(t).before(g.hDiv);p.holewidth=$(g.hDiv).width();var cpi;if($.ctx){cpi=$.ctx._currentPathId}if(cpi&&!p.customId){p.customId=cpi}var resetWidth=false;if(p.colModel){if(getCtpTop().$.ctx&&p.customize&&getCtpTop().$.ctx.customize){var ugp=getCtpTop().$.ctx.customize.grid_pref;if(p.customId&&ugp){ugp=$.parseJSON(ugp);ugp=ugp[p.customId];if(ugp&&!(ugp instanceof Array)){var _modes=[],_modesMap={},cs=[];var orders=ugp.__ORDER;if(ugp.resetWidth!=undefined){resetWidth=ugp.resetWidth}if(orders&&(!resetWidth)){for(var i=0;i<orders.length;i++){u=orders[i];var nameAndWidthArray=u.split("#");u=nameAndWidthArray[0];var u_width=-1;if(nameAndWidthArray.length>1){u_width=nameAndWidthArray[1]}if(u===""){return }cs.push(u);$.each(p.colModel,function(j,n){if(n.name==u){if(u_width!=(-1)){if(!resetWidth){n.width=u_width;n.hide=false}}else{n.hide=true}_modesMap[_modes.length]=j;if(n.hide==undefined){if(!(n.isToggleHideShow!==undefined&&n.hide&&!n.isToggleHideShow)){n.hide=((ugp[u]===0||ugp[u]==="0")&&(!resetWidth))?true:false}}_modes.push(n)}})}}$.each(p.colModel,function(j,n){if(!cs.contains(n.name)){_modesMap[_modes.length]=j;_modes.push(n)}});p.colModel=_modes;p._modesMap=_modesMap}}else{ugp=null}}thead=document.createElement("thead");var tr=document.createElement("tr");var grid_ThClick="ThClick"+p.id;var grid_ThMouseenter="ThMouseenter"+p.id;var grid_ThMouseleave="ThMouseleave"+p.id;for(var i=0;i<p.colModel.length;i++){var cm=p.colModel[i];var th=document.createElement("th");$(th).attr("axis","col"+i);$(th).attr({onclick:grid_ThClick+"(event,this)",onmouseenter:grid_ThMouseenter+"(this)",onmouseleave:grid_ThMouseleave+"(this)"});if(cm){if(cm.display!=undefined){if(cm.type=="checkbox"){th.innerHTML="<input type='checkbox' onclick=\"getGridSetAllCheckBoxSelect123456(this,'"+p.gridClassName+"')\"/>";$(th).addClass("grid_checkbox")}else{if(cm.type=="radio"){th.innerHTML=""}else{th.innerHTML=cm.display}}}cm.sortType=cm.sortType?cm.sortType:"string";$(th).attr("colMode",cm.name);$(th).attr("sortType",cm.sortType);var _isToggleHideShow=cm.isToggleHideShow==undefined?true:cm.isToggleHideShow;if(cm.name=="id"||cm.name=="name"||cm.name=="title"){_isToggleHideShow=false}$(th).attr("isToggleHideShow",_isToggleHideShow);if(cm.name&&cm.sortable){$(th).attr("abbr",cm.sortname?cm.sortname:cm.name)}if(cm.align==undefined){cm.align="left"}th.align=cm.align;var thWidth=null;if(cm.width){var ddd=cm.width+"";if(ddd.indexOf("%")>-1){var _W=(p.holewidth-10)*parseInt(ddd)/100;cm.width=_W-10;thWidth=cm.width}else{thWidth=cm.width-10}$(th).attr("width",thWidth)}if($(cm).attr("hide")||cm.hide){th.hidden=true}if(cm.process){th.process=cm.process}}else{th.innerHTML="";$(th).attr("width",30)}$(tr).append(th)}$(thead).append(tr);$(t).prepend(thead)}g.hTable.cellPadding=0;g.hTable.cellSpacing=0;$(g.hDiv).append('<div class="hDivBox" style="width:100%"></div>');$("div",g.hDiv).append(g.hTable);var thead=$("thead:first",t).get(0);if(thead){$(g.hTable).append(thead)}thead=null;if(!p.colmodel){var ci=0}var grid_ThClick="ThClick"+p.id;window[grid_ThClick]=function(e,t){if(!$(t).hasClass("thOver")){return false}var obj=(e.target||e.srcElement);if(obj.href||obj.type){return true}g.changeSort(t)};var grid_ThMouseenter="ThMouseenter"+p.id;window[grid_ThMouseenter]=function(t){if(!g.colresize&&!$(t).hasClass("thMove")&&!g.colCopy){$(t).addClass("thOver")}if($(t).attr("abbr")!=p.sortname&&!g.colCopy&&!g.colresize&&$(t).attr("abbr")){$("div",t).addClass("s"+p.sortorder)}else{if($(t).attr("abbr")==p.sortname&&!g.colCopy&&!g.colresize&&$(t).attr("abbr")){var no=(p.sortorder=="asc")?"desc":"asc";$("div",t).removeClass("s"+p.sortorder).addClass("s"+no)}}if(g.colCopy){var n=$("th",g.hDiv).index(t);if(n==g.dcoln){return false}if(n<g.dcoln){$(t).append(g.cdropleft)}else{$(t).append(g.cdropright)}g.dcolt=n}else{if(!g.colresize){var nv=$("th:visible",g.hDiv).index(t);var onl=parseInt($("div:eq("+nv+")",g.cDrag).css("left"));var nw=jQuery(g.nBtn).outerWidth();var nl=onl-nw+Math.floor(p.cgwidth/2);var ie7HasCheckbox=$.browser.msie&&$.browser.version==7&&(p.colModel[0].type=="checkbox");if(ie7HasCheckbox){nl+=5*nv}$(g.nDiv).hide();$(g.nBtn).hide();$(g.nBtn).css({left:nl,top:g.hDiv.offsetTop+1}).show();var ndw=parseInt($(g.nDiv).width());$(g.nDiv).css({top:g.bDiv.offsetTop-1});if((nl+ndw)>$(g.gDiv).width()){var l=onl-ndw+1;if(ie7HasCheckbox){l+=5*nv}$(g.nDiv).css("left",l)}else{$(g.nDiv).css("left",nl-5)}if($(t).hasClass("sorted")){$(g.nBtn).addClass("srtd")}else{$(g.nBtn).removeClass("srtd")}}}};var grid_ThMouseleave="ThMouseleave"+p.id;window[grid_ThMouseleave]=function(t){$(t).removeClass("thOver");if($(t).attr("abbr")!=p.sortname){$("div",t).removeClass("s"+p.sortorder)}else{if($(t).attr("abbr")==p.sortname){var no=(p.sortorder=="asc")?"desc":"asc";$("div",t).addClass("s"+p.sortorder).removeClass("s"+no)}}if(g.colCopy){$(g.cdropleft).remove();$(g.cdropright).remove();g.dcolt=null}};$("thead tr:first th",g.hDiv).each(function(){var thdiv=document.createElement("div");if($(this).attr("abbr")){if($(this).attr("abbr")==p.sortname){this.className="sorted";thdiv.className="s"+p.sortorder}}if(this.hidden){$(this).hide()}if(!p.colmodel){$(this).attr("axis","col"+ci++)}$(thdiv).css({textAlign:this.align,width:this.width+"px"});thdiv.innerHTML=this.innerHTML;$(this).empty().append(thdiv).removeAttr("width").mousedown(function(e){g.dragStart("colMove",e,this)})});g.bDiv.className="bDiv";g.bDiv.id=p.gridClassName+"_bDiv";$(t).before(g.bDiv);if(p.hChange){var pObj=$(g.gDiv).parent();pObj.css({overflow:"hidden"});p.height=pObj.height()-p.hChangeParam.subHeight}if(p.height<50){p.height="auto"}$(g.bDiv).css({height:(p.height=="auto")?"auto":p.height-52+"px"}).scroll(function(e){if($.browser.msie&&$.browser.version==8){if(g.finished){setTimeout(function(){g.hDiv.scrollLeft=g.bDiv.scrollLeft;g.rePosDrag();g.finished=true},200);g.finished=false}}else{g.scroll()}}).append(t);if(p.height=="auto"){$("table",g.bDiv).addClass("autoht")}g.addRowProp();var cdcol=$("thead tr:first th:first",g.hDiv).get(0);if(cdcol!=null){g.cDrag.className="cDrag";g.cdpad=0;g.cdpad+=(isNaN(parseInt($("div",cdcol).css("borderLeftWidth")))?0:parseInt($("div",cdcol).css("borderLeftWidth")));g.cdpad+=(isNaN(parseInt($("div",cdcol).css("borderRightWidth")))?0:parseInt($("div",cdcol).css("borderRightWidth")));g.cdpad+=(isNaN(parseInt($("div",cdcol).css("paddingLeft")))?0:parseInt($("div",cdcol).css("paddingLeft")));g.cdpad+=(isNaN(parseInt($("div",cdcol).css("paddingRight")))?0:parseInt($("div",cdcol).css("paddingRight")));g.cdpad+=(isNaN(parseInt($(cdcol).css("borderLeftWidth")))?0:parseInt($(cdcol).css("borderLeftWidth")));g.cdpad+=(isNaN(parseInt($(cdcol).css("borderRightWidth")))?0:parseInt($(cdcol).css("borderRightWidth")));g.cdpad+=(isNaN(parseInt($(cdcol).css("paddingLeft")))?0:parseInt($(cdcol).css("paddingLeft")));g.cdpad+=(isNaN(parseInt($(cdcol).css("paddingRight")))?0:parseInt($(cdcol).css("paddingRight")));$(g.bDiv).before(g.cDrag);var cdheight=$(g.bDiv).height();var hdheight=$(g.hDiv).height();$(g.cDrag).css({top:-hdheight+"px"});$("thead tr:first th",g.hDiv).each(function(){var cgDiv=document.createElement("div");$(g.cDrag).append(cgDiv);if(!p.cgwidth){p.cgwidth=$(cgDiv).width()}$(cgDiv).css({height:cdheight+hdheight}).mousedown(function(e){g.dragStart("colresize",e,this)}).dblclick(function(e){g.autoResizeColumn(this)});if($.browser.msie&&$.browser.version<7){g.fixHeight($(g.gDiv).height());$(cgDiv).hover(function(){g.fixHeight();$(this).addClass("dragging")},function(){if(!g.colresize){$(this).removeClass("dragging")}})}})}if(p.striped){$("tbody tr:odd",g.bDiv).addClass("erow")}if(p.resizable&&p.height!="auto"){g.vDiv.className="vGrip";g.vDiv.id=p.id+"vGrip";$(g.vDiv).mousedown(function(e){g.dragStart("vresize",e)});if(p.slideToggleBtn){var _html="";_html+="";$(g.vDiv).html("<div class='vGrip_line'><table align='center' border='0' cellpadding='0' cellspacing='0' height='7'><tr><td align='center'><span class='slideUpBtn spiretBarHidden4'><em></em></span><span class='slideDownBtn spiretBarHidden3' style='border-left:0;'><em></em></span></td></tr></table></div>")}else{$(g.vDiv).html("<span id='dragBtn'></span>")}$(g.bDiv).after(g.vDiv);if(p.slideToggleBtn){var slideToggleUpHandleClick="slideToggleUpHandle"+p.id;var slideToggleDownHandleClick="slideToggleDownHandle"+p.id;window[slideToggleUpHandleClick]=function(){p.slideToggleUpHandle()};window[slideToggleDownHandleClick]=function(){p.slideToggleDownHandle()};$("#"+p.id+"vGrip .slideUpBtn").attr("onclick",slideToggleUpHandleClick+"()");$("#"+p.id+"vGrip .slideDownBtn").attr("onclick",slideToggleDownHandleClick+"()")}}if(p.resizable&&p.width!="auto"&&!p.nohresize){g.rDiv.className="hGrip";$(g.rDiv).mousedown(function(e){g.dragStart("vresize",e,true)}).html("<span></span>").css("height",$(g.gDiv).height());if($.browser.msie&&$.browser.version<7){$(g.rDiv).hover(function(){$(this).addClass("hgOver")},function(){$(this).removeClass("hgOver")})}$(g.gDiv).append(g.rDiv)}if(p.usepager){g.pDiv.className="pDiv";g.pDiv.id=p.id+"_pDiv";g.pDiv.innerHTML='<div class="pDiv2 common_over_page align_right" style="padding-top:10px;padding-bottom:10px;"></div>';$(g.bDiv).after(g.pDiv);var html='<a   class="pFirst pButton common_over_page_btn"><span class="pageFirst"></span></a><a  class="pPrev pButton common_over_page_btn"><span class="pagePrev"></span></a><span class="pcontrol margin_l_10">'+p.pagetext+'<input type="text" size="4" value="1" class="common_over_page_txtbox"/>'+p.outof+'</span><a  class="pNext pButton common_over_page_btn"><span class="pageNext"></span></a><a  class="pLast pButton common_over_page_btn"><span class="pageLast"></span></a><a  class="common_over_page_btn" style="display:none"><span class="pReload pButton "><span class="ico16 refresh_16 margin_lr_5">&nbsp;</span></span></a><a href="javascript:void(0)" id="grid_go" class="common_button margin_lr_10 common_over_page_go">GO</a><div class="pGroup"><span class="pPageStat"></span></div>';$("div",g.pDiv).html(html);var pReloadClick="pReload_click"+p.id;var pFirstClick="pFirst_click"+p.id;var pPrevClick="pPrev_click"+p.id;var pNextClick="pNext_click"+p.id;var pLastClick="pLast_click"+p.id;var pcontrol_input_keydown="pcontrol_input_keydown"+p.id;var grid_goClick="grid_go_click"+p.id;window[pReloadClick]=function(){g.populate()};window[pFirstClick]=function(){g.changePage("first")};window[pPrevClick]=function(){g.changePage("prev")};window[pNextClick]=function(){g.changePage("next")};window[pLastClick]=function(){g.changePage("last")};window[pcontrol_input_keydown]=function(e){if(e.keyCode==13){g.changePage("input")}};window[grid_goClick]=function(){g.changePage("input",true)};$(".pButton",g.pDiv).attr("onclick",pReloadClick+"()");$(".pFirst",g.pDiv).attr("onclick",pFirstClick+"()");$(".pPrev",g.pDiv).attr("onclick",pPrevClick+"()");$(".pNext",g.pDiv).attr("onclick",pNextClick+"()");$(".pLast",g.pDiv).attr("onclick",pLastClick+"()");$(".pcontrol input",g.pDiv).attr("onkeydown",pcontrol_input_keydown+"(event)");$("#grid_go").attr("onclick",grid_goClick+"()");if($.browser.msie&&$.browser.version<7){var pButtonMouseenter="pButton_mouseenter"+p.id;var pButtonMouseleave="pButton_mouseleave"+p.id;window[pButtonMouseenter]=function(){$(this).addClass("pBtnOver")};window[pButtonMouseout]=function(){$(this).removeClass("pBtnOver")};$(".pButton",g.pDiv).attr({onmouseenter:pButtonMouseenter+"()",onmouseleave:pButtonMouseleave+"()"})}if(p.useRpInput){$(".pDiv2",g.pDiv).prepend($.i18n("validate.grid.over_page.js")+"<input type='text' id='rpInputChange' name='rp' maxlength='3' value='"+p.rp+"' class='common_over_page_txtbox' style='width:32px;'/><span class='margin_r_10 total'>"+$.i18n("validate.grid.over_page2.js")+"0"+$.i18n("validate.grid.over_page3.js")+"</span><span class='total_page'>1</span>");$("#rpInputChange",g.pDiv).blur(function(){var _val=$(this).val();var _nval=_val.replace(/\D/g,"");if(_nval<=0){_nval=p.rp}$(this).val(_nval);$("#grid_go").click()})}if(p.searchitems){$(".pDiv2",g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");$(".pSearch",g.pDiv).click(function(){$(g.sDiv).slideToggle("fast",function(){$(".sDiv:visible input:first",g.gDiv).trigger("focus")})});g.sDiv.className="sDiv";var sitems=p.searchitems;var sopt="",sel="";for(var s=0;s<sitems.length;s++){if(p.qtype==""&&sitems[s].isdefault==true){p.qtype=sitems[s].name;sel='selected="selected"'}else{sel=""}sopt+="<option value='"+sitems[s].name+"' "+sel+" >"+sitems[s].display+"&nbsp;&nbsp;</option>"}if(p.qtype==""){p.qtype=sitems[0].name}$(g.sDiv).append("<div class='sDiv2'>"+p.findtext+" <input type='text' value='"+p.query+"' size='30' name='q' class='qsbox' />  <select name='qtype'>"+sopt+"</select></div>");$("input[name=q]",g.sDiv).keydown(function(e){if(e.keyCode==13){g.doSearch()}});$("select[name=qtype]",g.sDiv).keydown(function(e){if(e.keyCode==13){g.doSearch()}});$("input[value=Clear]",g.sDiv).click(function(){$("input[name=q]",g.sDiv).val("");p.query="";g.doSearch()});$(g.bDiv).after(g.sDiv)}}$(g.pDiv,g.sDiv).append("<div style='clear:both'></div>");if(p.title){g.mDiv.className="mDiv";g.mDiv.innerHTML='<div class="ftitle">'+p.title+"</div>";$(g.gDiv).prepend(g.mDiv);if(p.showTableToggleBtn){$(g.mDiv).append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');$("div.ptogtitle",g.mDiv).click(function(){$(g.gDiv).toggleClass("hideBody");$(this).toggleClass("vsble")})}}g.cdropleft=document.createElement("span");g.cdropleft.className="cdropleft";g.cdropright=document.createElement("span");g.cdropright.className="cdropright";g.block.className="gBlock";var gh=$(g.bDiv).height();var gtop=g.bDiv.offsetTop;$(g.block).css({width:g.bDiv.style.width,height:gh,position:"relative",marginBottom:(gh*-1),zIndex:1,top:gtop,left:"0px"});$(g.block).fadeTo(0,p.blockOpacity);if($("th",g.hDiv).length){g.nDiv.className="nDiv";g.nDiv.innerHTML="<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";$(g.nDiv).css({marginBottom:(gh*-1),display:"none",top:gtop}).noSelect();var cn=0;$("th div",g.hDiv).each(function(){var kcol=$("th[axis='col"+cn+"']",g.hDiv)[0];var chk='checked="checked"';if(kcol.style.display=="none"){chk=""}var _parent=$(this).parent();var ishidden="";var _isToggleHideShow=_parent.attr("isToggleHideShow");if(_isToggleHideShow=="false"){ishidden="none"}if(this.innerHTML.indexOf("locking_white_16")>-1){newInnerHTML=this.innerHTML.replace(/locking_white_16/g,"locking_16");$("tbody",g.nDiv).append('<tr style="display:'+ishidden+'"><td class="ndcol1"><input type="checkbox" '+chk+' class="togCol" value="'+cn+'" /></td><td class="ndcol2">'+newInnerHTML+"</td></tr>")}else{$("tbody",g.nDiv).append('<tr style="display:'+ishidden+'"><td class="ndcol1"><input type="checkbox" '+chk+' class="togCol" value="'+cn+'" /></td><td class="ndcol2">'+this.innerHTML+"</td></tr>")}cn++});if($.browser.msie&&$.browser.version<7){$("tr",g.nDiv).hover(function(){$(this).addClass("ndcolover")},function(){$(this).removeClass("ndcolover")})}var ndcol2_Click="ndcol2Click"+p.id;window[ndcol2_Click]=function(t){if($("input:checked",g.nDiv).length<=p.minColToggle&&$(t).prev().find("input")[0].checked){return false}if($(t).prev().find("input").val()=="_reset_width_"){g.saveCustomize(true,function(){window.location.reload()});$(t).attr("checked","")}else{return g.toggleCol($(t).prev().find("input").val())}};$("td.ndcol2",g.nDiv).attr("onclick",ndcol2_Click+"(this)");var togCol_Click="togColClick"+p.id;window[togCol_Click]=function(t){if($("input:checked",g.nDiv).length<p.minColToggle&&t.checked==false){$(t).attr("checked","checked");return false}$(t).parent().next().trigger("click");$("#total_0_"+p.id).width($(".hDivBox",t.hDiv).width())};$("input.togCol",g.nDiv).attr("onclick",togCol_Click+"(this)");$(g.gDiv).prepend(g.nDiv);$(g.nBtn).addClass("nBtn").html("<div></div>").attr("title",$.i18n("grid.togglefield.js"));var nBtn_click="nBtn"+p.id;window[nBtn_click]=function(){$(g.nBtn).addClass("set_col");$(g.nDiv).show();if($(g.nDiv).height()>=($(g.bDiv).height()+$(g.pDiv).height())){$(g.nDiv).css({height:$(g.bDiv).height()+$(g.pDiv).height()+"px"})}return true};$(g.nBtn).attr("onclick",nBtn_click+"()");if(p.showToggleBtn){$(g.gDiv).prepend(g.nBtn)}}$(g.iDiv).addClass("iDiv").css({display:"none"});$(g.bDiv).append(g.iDiv);var bDiv_mouseenter="nBtn_Mouseenter"+p.id;window[bDiv_mouseenter]=function(){$(g.nDiv).hide();$(g.nBtn).hide().removeClass("set_col")};var bDiv_mouseleave="nBtn_Mouseleave"+p.id;window[bDiv_mouseleave]=function(){if(g.multisel){g.multisel=false}};$(g.bDiv).attr({onmouseenter:bDiv_mouseenter+"()",onmouseleave:bDiv_mouseleave+"()"});var gDiv_mouseenter="gDiv_Mouseenter"+p.id;window[gDiv_mouseenter]=function(){$(g.nDiv).hide();$(g.nBtn).hide()};$(g.gDiv).attr({onmouseenter:gDiv_mouseenter+"()"});$(document).mousemove(function(e){g.dragMove(e)}).mouseup(function(e){g.dragEnd()}).hover(function(){},function(){g.dragEnd()});if($.browser.msie&&$.browser.version<7){$(".hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv",g.gDiv).css({width:"100%"});$(g.gDiv).addClass("ie6");if(p.width!="auto"){$(g.gDiv).addClass("ie6fullwidthbug")}}g.rePosDrag();g.fixHeight();t.p=p;t.grid=g;$(t).attrObj("_grid",g);if(p.managerName){$("head").append("<script src='"+_ctxPath+"/ajax.do?managerName="+p.managerName+"' type='text/javascript'><\/script>")}if(p.datas&&p.autoload){g.populate()}initFlag=false;if($._autofill){var $af=$._autofill,$afg=$af.filllists;if($afg&&$afg[t.id]){$afg[t.id].rows=$afg[t.id].data;g.addData($afg[t.id]);$afg[t.id]=null}else{var bt=$("table",g.bDiv);var ht=$("table",g.hDiv);bt.width(ht.width());bt.height(ht.height())}}return t};var docloaded=false;$(document).ready(function(){docloaded=true});$.fn.ajaxgrid=function(p){return $.addFlex(this[0],p)};$.fn.resizeGrid=function(h){return };$.fn.getSelectCheckbox=function(){var cNstr=this[0].className;var cNstrstr=this[0].className+"_bDiv";return $("."+cNstr).find("input[gridRowCheckBox="+cNstr+"]:checked")};$.fn.flexReload=function(p){return this.each(function(){if(this.grid&&this.p.managerName){this.grid.populate()}})};$.fn.flexOptions=function(p){return this.each(function(){if(this.grid){$.extend(this.p,p)}})};$.fn.flexToggleCol=function(cid,visible){return this.each(function(){if(this.grid){this.grid.toggleCol(cid,visible)}})};$.fn.ajaxgridLoad=function(para){return this.each(function(){if(this.grid){this.grid.populate(para)}})};$.fn.ajaxgridData=function(data){return this.each(function(){if(this.grid){this.grid.addData(data)}})};$.fn.noSelect=function(p){var prevent=(p==null)?true:p;if(prevent){return this.each(function(){if($.browser.msie||$.browser.safari){$(this).bind("selectstart",function(){return false})}else{if($.browser.mozilla){$(this).css("MozUserSelect","none");$("body").trigger("focus")}else{if($.browser.opera){$(this).bind("mousedown",function(){return false})}else{$(this).attr("unselectable","on")}}}})}else{return this.each(function(){if($.browser.msie||$.browser.safari){$(this).unbind("selectstart")}else{if($.browser.mozilla){$(this).css("MozUserSelect","inherit")}else{if($.browser.opera){$(this).unbind("mousedown")}else{$(this).removeAttr("unselectable","on")}}}})}};$.fn.flexSearch=function(p){return this.each(function(){if(this.grid&&this.p.searchitems){this.grid.doSearch()}})}})(jQuery);function getGridSetAllCheckBoxSelect123456(B,A){if($(B).prop("checked")){$(".flexigrid").find("input[gridRowCheckBox="+A+"]").not("input[type=checkbox][disabled]").prop("checked",true)}else{$(".flexigrid").find("input[gridRowCheckBox="+A+"]").prop("checked",false)}if(typeof (gridSelectAllPersonalFunction)=="function"){gridSelectAllPersonalFunction($(B).prop("checked"))}};
(function(B){B.fn.superfish=function(J){var F=B.fn.superfish,I=F.c,E=B(['<span class="',I.arrowClass,'"> &#187;</span>'].join("")),H=function(){var K=B(this),L=C(K);clearTimeout(L.sfTimer);if(!K.hasClass("common_menu_dis")){K.showSuperfishUl().siblings().hideSuperfishUl()}},D=function(){var K=B(this),M=C(K),L=F.op;clearTimeout(M.sfTimer);M.sfTimer=setTimeout(function(){L.retainPath=(B.inArray(K[0],L.$path)>-1);K.hideSuperfishUl();if(L.$path.length&&K.parents(["li.",L.hoverClass].join("")).length<1){H.call(L.$path)}},L.delay)},C=function(K){var L=K.parents(["ul.",I.menuClass,":first"].join(""))[0];F.op=F.o[L.serial];return L},G=function(K){K.addClass(I.anchorClass).append(E.clone())};return this.each(function(){var K=this.serial=F.o.length;var M=B.extend({},F.defaults,J);M.$path=B("li."+M.pathClass,this).slice(0,M.pathLevels).each(function(){B(this).addClass([M.hoverClass,I.bcClass].join(" ")).filter("li:has(ul)").removeClass(M.pathClass)});F.o[K]=F.op=M;B("li:has(ul)",this)[(B.fn.hoverIntent&&!M.disableHI)?"hoverIntent":"hover"](H,D).each(function(){if(M.autoArrows){G(B(">a:first-child",this))}}).not("."+I.bcClass).hideSuperfishUl();var L=B("a",this);L.each(function(N){var O=L.eq(N).parents("li");L.eq(N).focus(function(){H.call(O)}).blur(function(){D.call(O)})});M.onInit.call(this)}).each(function(){var K=[I.menuClass];if(F.op.dropShadows&&!(B.browser.msie&&B.browser.version<7)){K.push(I.shadowClass)}B(this).addClass(K.join(" "))})};var A=B.fn.superfish;A.o=[];A.op={};A.IE7fix=function(){var C=A.op;if(B.browser.msie&&B.browser.version>6&&C.dropShadows&&C.animation.opacity!=undefined){this.toggleClass(A.c.shadowClass+"-off")}};A.c={bcClass:"common_menu_breadcrumb",menuClass:"common_menu_js-enabled",anchorClass:"common_menu_with-ul",arrowClass:"common_menu_sub-indicator",shadowClass:"common_menu_shadow"};A.defaults={hoverClass:"sfHover",pathClass:"overideThisToUse",pathLevels:1,delay:800,animation:{opacity:"show"},speed:"normal",autoArrows:true,dropShadows:true,disableHI:false,onInit:function(){},onBeforeShow:function(){},onShow:function(){},onHide:function(){}};B.fn.extend({hideSuperfishUl:function(){var E=A.op,D=(E.retainPath===true)?E.$path:"";E.retainPath=false;var C=B(["li.",E.hoverClass].join(""),this).add(this).not(D).removeClass(E.hoverClass).find(">ul").hide().css("visibility","hidden");E.onHide.call(C);return this},showSuperfishUl:function(){var E=A.op,D=A.c.shadowClass+"-off",C=this.addClass(E.hoverClass).find(">ul:hidden").css("visibility","visible");A.IE7fix.call(C);E.onBeforeShow.call(C);C.animate(E.animation,E.speed,function(){A.IE7fix.call(C);E.onShow.call(C)});return this}})})(jQuery);function commonMenuSimple(P,H){var L=P.id?P.id:"menuSimple_"+Math.floor(Math.random()*1000000000);var C=P.data?P.data:[];var E=P.width?P.width:128;var G=P.height?P.height:"";var M=P.maxHeight?P.maxHeight:"";var D=P.event?P.event:"click";var K=P.direction?P.direction:"BL";var J=P.offsetLeft?P.offsetLeft:0;var B=P.offsetTop?P.offsetTop:0;var F=P.mRow?P.mRow:false;function O(){var S=$("body");if(H==null){var Q=S.data("isMenuSimple");if(Q!=L){$("#"+Q).remove();$("#"+Q+"_iframe_mask").remove();S.data("isMenuSimple",L)}}else{var V=$(H);var Q=V.data("isMenuSimple");if(Q!=L){$("#"+Q).remove();$("#"+Q+"_iframe_mask").remove();V.data("isMenuSimple",L)}}var U=$("#"+L);if(U.size()!=0){U.remove();$("#"+L+"_iframe_mask").remove()}function W(f,g){var Y="";var d="";if(G!=""){d="height:"+G+"px;overflow-y:auto;"}if(M!=""){d="max-height:"+M+"px;overflow-y:auto;"}Y+='<div id="'+L+'" class="menu_simple_box" style="z-index:20001;left:'+g+"px;top:"+f+"px;"+d+'"><div class="menu_simple">';var b="";F!=true?b=" text_overflow":null;for(var c=0;c<C.length;c++){if(C[c].isShow==false){continue}if(C[c].type=="line"){Y+='<div class="line"></div>'}else{C[c].id!=null?"":C[c].id="menuSimple_item"+Math.floor(Math.random()*1000000000);var Z="";C[c].className!=null?Z="<span class='ico16 margin_r_5 "+C[c].className+"'></span>":null;var X="";C[c].customAttr!=null?X=C[c].customAttr:null;var a="";C[c].disabled==true?a="disabled":null;var e="";_name=$("<div>"+C[c].name+"</div>").text();Y+='<a id="'+C[c].id+"\" title='"+e+"'"+X+" class='"+a+" "+b+"'>"+Z+C[c].name+"</a>"}}Y+="</div></div>";Y+='<iframe id="'+L+'_iframe_mask" style="left:'+g+"px;top:"+f+"px;"+d+'"></iframe>';return Y}if(H==null){var R=P.left?P.left:0;var T=P.top?P.top:0}else{var V=$(H);if(V.size()>0){var R=function(){switch(K){case"BL":left=V.offset().left+J;if((left+E)>$(document).width()){left=$(document).width()-E-20}return left;break;case"BR":left=V.offset().left+V.width()-E-12+J;if((left+E)>$(document).width()){left=$(document).width()-E-20}return left;break}}();var T=function(){var Y=V.offset().top+V.height()+5+B;var X=$(document).height();if((Y+U.height()+5)>X){Y=X-U.height()-5}return Y}()}}S.append(W(T,R));$("#"+L+"_iframe_mask").css({display:"none","z-index":20000,position:"absolute",top:T+"px",left:R+"px",width:$("#"+L).width()+"px",height:$("#"+L).height()+"px"});if(H==null){$("#"+L).show();$("#"+L+"_iframe_mask").show();hideOfficeObj()}if(E!=150){U.find("a").width(E);U.find(".line").width(E+10)}$("#"+L+" .menu_simple").children().each(function(X){if(C[X].type!="line"&&C[X].handle){$(this).click(function(){if(C[X].disabled!=true){C[X].handle({id:C[X].id,name:C[X].name,obj:$(this)})}})}})}O();function I(){$("#"+L).click(function(){if(G!=""){$("#"+L).scrollTop(0)}$(this).hide();$("#"+L+"_iframe_mask").hide();showOfficeObj()}).mouseleave(function(){if(G!=""){$("#"+L).scrollTop(0)}$(this).hide();$("#"+L+"_iframe_mask").hide();A=true;showOfficeObj()}).mouseenter(function(){A=false})}var N=$(H);N.unbind().bind(D,function(){I();setTimeout(function(){if($(H).attr("disable")!="disable"){var Q=function(){var T;switch(K){case"BL":T=$(H).offset().left+J;if((T+E)>$(document).width()){T=$(document).width()-E-20}return T;break;case"BR":T=$(H).offset().left+$(H).width()-E-12+J;if((T+E)>$(document).width()){T=$(document).width()-E-20}return T;break}}();var S=function(){var U=$(H).offset().top+$(H).height()+5+B;var T=$(document).height();if((U+$("#"+L).height()+5)>T){U=T-$("#"+L).height()-5}return U}();var R=$("#"+L);R.css({left:Q+"px",top:S+"px"});R.show();$("#"+L+"_iframe_mask").css({width:(E*1+16)+"px",top:S+"px",left:Q+"px"});$("#"+L+"_iframe_mask").show();hideOfficeObj()}},100)});var A=true;N.mouseleave(function(){setTimeout(function(){if(A){if(G!=""){$("#"+L).scrollTop(0)}$("#"+L).hide();$("#"+L+"_iframe_mask").hide();showOfficeObj()}},100)})}$.fn.menuSimple=function(A){commonMenuSimple(A,$(this).selector)};$.menuSimple=function(A){commonMenuSimple(A,null)};
function WebFXMenuBar(A){this.allMenuBottons=[];this.menuStrBuffer=[];this.render=A.render;this.contextPath=A.contextPath==null?"":A.contextPath;this.isPager=true;if(A.isPager==false){this.isPager=false}this.searchHtml=A.searchHtml;this.top=A.top==null?0:A.top;this.left=A.left==null?0:A.left;this.borderTop=0;if(A.borderTop==true){this.borderTop=1}this.borderBottom=0;if(A.borderBottom==true){this.borderBottom=1}this.borderRight=0;if(A.borderRight==true){this.borderRight=1}this.borderLeft=0;if(A.borderLeft==true){this.borderLeft=1}this.id=A.id?A.id:Math.floor(Math.random()*100000000);this.type=A.type;this.items=A.items;this.disabledItemArr=[];this.hideIdArray=[];this.showSeparate=A.showSeparate!=undefined?A.showSeparate:false}WebFXMenuBar.prototype.add=function(A){this.allMenuBottons[this.allMenuBottons.length]=A};WebFXMenuBar.prototype.addMenu=function(A){this.add(new WebFXMenuButton(A));var B=this.allMenuBottons[this.allMenuBottons.length-1];B.toObj($("#toolbar_"+this.id))};WebFXMenuBar.prototype.isA=false;WebFXMenuBar.prototype.isB=false;WebFXMenuBar.prototype.show=function(){var B=this;if(this.allMenuBottons.length>0){this.menuStrBuffer=[];if(this.isPager){var A="toolbar_m_r"+B.id+"Click";var E="toolbar_m_l"+B.id+"Click";this.menuStrBuffer.push("<div id='toolbar_"+this.id+"_box' class='common_toolbar_box clearfix' style='overflow:hidden; border-top-width:"+this.borderTop+"px;border-bottom-width:"+this.borderBottom+"px;border-left-width:"+this.borderLeft+"px;border-right-width:"+this.borderRight+"px;border-color:#b6b6b6;border-style:solid;'>");this.menuStrBuffer.push("<div id='toolbar_"+this.id+"_wrap' class='toolbar_l clearfix' style='overflow:hidden'><div id='toolbar_"+this.id+"' style='height:30px;white-space:nowrap;width:auto'>");this.menuStrBuffer.push("</div></div><div id='toolbar_m' class='left hidden'><span class=' toolbar_m_l' onclick='"+E+"()'></span><span class=' toolbar_m_r' onclick='"+A+"()'></span></div>");this.menuStrBuffer.push("<div id='toolbar_"+this.id+"_wrap_right' class='toolbar_l clearfix' style='overflow:hidden;float: right;'><div id='toolbar_"+this.id+"_right' style='height:30px;white-space:nowrap;width:auto'></div></div>")}else{this.menuStrBuffer.push("<div class='common_toolbar_box clearfix' style='_display:inline; border-top-width:"+this.borderTop+"px;border-bottom-width:"+this.borderBottom+"px;border-left-width:"+this.borderLeft+"px;border-right-width:"+this.borderRight+"px;border-color:#b6b6b6;border-style:solid;'>");this.menuStrBuffer.push("<div id='toolbar_"+this.id+"' class='toolbar_l clearfix'>");this.menuStrBuffer.push("</div>")}if(this.searchHtml!=null){this.menuStrBuffer.push("<div class='toolbar_r clearfix'>");this.menuStrBuffer.push($("#"+this.searchHtml).html());this.menuStrBuffer.push("</div>");$("#"+this.searchHtml).remove()}this.menuStrBuffer.push("</div>")}if(this.render==undefined){document.write(this.menuStrBuffer.join(""))}else{$("#"+this.render).append(this.menuStrBuffer.join(""))}var G=$("#toolbar_"+this.id);var F=$("#toolbar_"+this.id+"_right");for(var C=0;C<this.allMenuBottons.length;C++){var D=this.allMenuBottons[C];D.toObj(G,F);if(this.showSeparate){if(C!=(this.allMenuBottons.length-1)){D.toSeparate(G)}}}if(this.isPager){this.setPage()}$(".sub_ico,.rolling_btn_b").each(function(){var N=this.id;B.initDisabledItem(N);var K=navigator.userAgent.toLowerCase();var I=(K.indexOf("opera")!=-1);var M=(K.indexOf("msie")!=-1&&!I);var O="sub_"+this.id+"mouseover";var L="sub_"+this.id+"mouseout";var J="sub_"+this.id+"mouseenter";var H="sub_"+this.id+"mouseleave";if(M){window[O]=function(){if($(this).hasClass("common_menu_dis")!==true){window.setTimeout(function(){B.showMoreMenu(N)},20)}};window[L]=function(){window.setTimeout(function(){B.hideMoreMenu()},20)}}else{window[J]=function(){B.isA=true;if($(this).hasClass("common_menu_dis")!==true){window.setTimeout(function(){B.showMoreMenu(N)},1)}};window[H]=function(){B.isA=false;window.setTimeout(function(){B.hideMoreMenu()},1)}}});this.menuStrBuffer=[]};WebFXMenuBar.prototype.setPage=function(){var M=this;var C=$("#toolbar_"+this.id);var B=C.width();var N=$("#toolbar_"+this.id+"_box");var P=N.width();var A=$("#toolbar_"+this.id+"_wrap");var L=A.width();var H;if($(".common_search_condition ").css("position")=="static"){H=0}else{if($(".common_search_condition").find("li:visible").length>2){H=$(".common_search_condition ").width()}else{H=($(".common_search_condition ").width())*2}}var I=$("#toolbar_"+this.id+"_wrap_right").width();var E=$("#toolbar_m").width();if(B>(P-H-I-E)){var K=P-H-I-E;var S=C.children();var U=S.size();var F=0;this._subm=[];for(var Q=0;Q<U;Q++){var J=S[Q];if(J){var T=parseInt($(J).css("margin-left"));if(isNaN(T)){T=0}var R=parseInt($(J).css("margin-right"));if(isNaN(R)){R=0}var O=parseInt($(J)[0].offsetWidth);if(isNaN(O)){O=0}F=F+O+T+R;if(F>K){F=F-O-T-R;this._subm[this._subm.length]=F;F=0}}}if(this._subm.length>0){K=this._subm[0];$("#toolbar_m").attr("move",0)}$("#toolbar_m").show();A.width(K);var D="toolbar_m_r"+M.id+"Click";window[D]=function(){var V=parseInt($("#toolbar_"+M.id).css("margin-left"));var W=parseInt($("#toolbar_m").attr("move"));if(M._subm[W]){$("#toolbar_"+M.id).animate({"margin-left":V-M._subm[W]},200);W=W+1;$("#toolbar_m").attr("move",W)}};var G="toolbar_m_l"+M.id+"Click";window[G]=function(){var V=parseInt($("#toolbar_"+M.id).css("margin-left"));var W=parseInt($("#toolbar_m").attr("move"))-1;if(M._subm[W]){$("#toolbar_"+M.id).animate({"margin-left":V+M._subm[W]},200);W=W;$("#toolbar_m").attr("move",W)}}}};WebFXMenuBar.prototype.hideMoreMenu=function(B){if(this.isA||this.isB){return }this.hiddenFlag=true;var A=this;setTimeout(function(){A.hideMoreMenuAction(B)},20)};WebFXMenuBar.prototype.hideMoreMenuAction=function(){if(this.hiddenFlag==true){$("#toolbar_more").remove();$("#toolbar_more_iframe").remove();showOfficeObj()}};WebFXMenuBar.prototype.getPosition=function(D){if(this.top==0&&this.left==0){var C=document.getElementById(D+"_a");var A=C.getBoundingClientRect().left+"px";var B=(C.getBoundingClientRect().top-2)+C.clientHeight+"px";return{position:"absolute",top:B,left:A,width:185,"z-index":500}}else{return{position:"absolute",top:this.top,left:this.left,width:185,"z-index":500}}};WebFXMenuBar.prototype.initDisabledItem=function(G){if(G){var C=this.getMenuButton(G);var A=C.subMenu;var E=A.allItems;var B=this.hideIdArray.join(",");for(var D=0;D<E.length;D++){var F=E[D];if(F.disabled!=undefined&&F.disabled==true){this.disabledItemArr.push(F.id)}}}};WebFXMenuBar.prototype.showMoreMenu=function(C){if(C){this.hiddenFlag=false;var N=this.getMenuButton(C);var G=N.subMenu;if($("#toolbar_more").length>0){$("#toolbar_more").remove();$("#toolbar_more_iframe").remove()}var P=this.getPosition(C);var L="toolbar_more"+this.id+"mouseover";var K="toolbar_more"+this.id+"mouseout";$("<div id='toolbar_more' onmouseenter='"+L+"()' onmouseleave='"+K+"()' style='background:#ffffff;z-index:10' class='common_order_menu_box clearfix'><ul id='toolbar_more_ul' class='common_order_menu'></ul></div>").css(P).appendTo($("body"));var I=$("#toolbar_more_ul");var Q=this;window[L]=function(){Q.isB=true;Q.hiddenFlag=false};window[K]=function(){Q.hiddenFlag=true;Q.isB=false;Q.hideMoreMenu()};var F=G.allItems;var M=this.hideIdArray.join(",");for(var H=0;H<F.length;H++){var E=F[H];if(M.indexOf(E.id)!=-1){continue}var O="toolbar_more_ul"+H+"Click";$('<li><a  id="'+E.id+'_a" onclick="'+O+'(this)" class="order_menuitem" title="'+E.name+'">'+E.name+"</a></li>").appendTo(I);$("#"+E.id+"_a").attr("value",E.value);if(this.disabledItemArr.indexOf(E.id)==-1){(function(R){window[O]=function(S){R.click.apply(S);setTimeout(function(){$("#toolbar_more").remove();$("#toolbar_more_iframe").remove()},100)}})(E)}else{window[O]=function(){};$("#"+E.id+"_a").css({color:"#D2D2D2"})}}$("<iframe id='toolbar_more_iframe' src='about:blank' class='absolute' frameborder='0' style='z-index:9'></iframe>").css({top:$("#toolbar_more").css("top"),left:$("#toolbar_more").css("left"),width:$("#toolbar_more").width(),height:$("#toolbar_more").height()}).appendTo($("body"));var J=document.getElementById(C+"_a");var A=parseInt(J.getBoundingClientRect().top)+parseInt(J.clientHeight);var B=$("#toolbar_more").height();var D=parseInt($("body").height());if((A+B)>D){$("#toolbar_more").height(D-A-$(J).height()).css({overflow:"auto"}).addClass("border_all");$("#toolbar_more_ul").css("border","0");$("#toolbar_more_iframe").height(D-A-$(J).height())}hideOfficeObj()}};WebFXMenuBar.prototype.disabledAll=function(){var A=this;$.each(this.allMenuBottons,function(){var B=$(this).attr("id");A.disabled(B)})};WebFXMenuBar.prototype.selected=function(C){var A=this;if(C){var B=C+"_a";$("#"+B).addClass("selected")}};WebFXMenuBar.prototype.unselected=function(C){var A=this;if(C){var B=C+"_a";$("#"+B).removeClass("selected")}else{$("#toolbar_"+this.id+" a").removeClass("selected")}};WebFXMenuBar.prototype.disabled=function(H){var A=this;if(H){var C=H+"_a";$("#"+C).addClass("common_menu_dis");var G=$("#"+C).attr("onclick");if(typeof (G)=="undefined"){var F=$("#"+C).attr("onmouseover");var E=$("#"+C).attr("onmouseout");var D=$("#"+C).attr("onmouseenter");var B=$("#"+C).attr("onmouseleave");if(typeof (F)=="undefined"){$("#"+C).attr("bakonmouseenter",D);$("#"+C).attr("bakonmouseleave",B);$("#"+C).removeAttr("onmouseenter").removeAttr("onmouseleave")}else{$("#"+C).attr("bakonmouseover",F);$("#"+C).attr("bakonmouseout",E);$("#"+C).removeAttr("onmouseover").removeAttr("bakonmouseout")}}else{$("#"+C).attr("bakclick",G);$("#"+C).removeAttr("onclick")}this.disabledItemArr.push(H)}};WebFXMenuBar.prototype.enabledAll=function(){var A=this;$.each(this.allMenuBottons,function(){var B=$(this).attr("id");A.enabled(B)})};WebFXMenuBar.prototype.enabled=function(B){var L=this;if(B){var A=B+"_a";$("#"+A).removeClass("common_menu_dis");var I=this.getMenuButton(B);if(I){var H=$("#"+A).attr("bakclick");if(typeof (H)=="undefined"){var G=$("#"+A).attr("bakonmouseover");var E=$("#"+A).attr("bakonmouseout");var D=$("#"+A).attr("bakonmouseenter");var C=$("#"+A).attr("bakonmouseleave");if(typeof (G)=="undefined"){$("#"+A).attr("onmouseenter",D);$("#"+A).attr("onmouseleave",C);$("#"+A).removeAttr("bakonmouseenter").removeAttr("bakonmouseleave")}else{$("#"+A).attr("onmouseover",G);$("#"+A).attr("onmouseout",E);$("#"+A).removeAttr("bakonmouseover").removeAttr("bakonmouseout")}}else{$("#"+A).attr("onclick",H);$("#"+A).removeAttr("bakclick")}}if(this.disabledItemArr.length>0){var J=[];for(var F=0;F<this.disabledItemArr.length;F++){var K=this.disabledItemArr[F];if(K!=B){J.push(K)}}this.disabledItemArr=J}$("#"+A).attr("style","")}};WebFXMenuBar.prototype.hideBtn=function(E){var B=this;if(E){this.hideIdArray.push(E);var C=E+"_a";var A=$("#"+C);if(A.length>0){A.hide();var D=A.next();if(D.hasClass("seperate")){D.hide()}}}};WebFXMenuBar.prototype.showBtn=function(H){var B=this;if(H){if(this.hideIdArray.length>0){var G=[];for(var E=0;E<this.hideIdArray.length;E++){var D=this.hideIdArray[E];if(D!=H){G.push(D)}}this.hideIdArray=G}var C=H+"_a";var A=$("#"+C);A.show();var F=A.next();if(F.hasClass("seperate")){F.show()}}};WebFXMenuBar.prototype.getMenuButton=function(C){if(C&&this.allMenuBottons.length>0){for(var B=0;B<this.allMenuBottons.length;B++){var A=this.allMenuBottons[B];if(A.id==C){return A}}}};function WebFXMenuButton(A){this.id=A.id;this.name=A.name;this.click=A.click;this.className=typeof (A.className)=="undefined"?"":A.className;this.subMenu=A.subMenu;this.selected=A.selected;this.type=A.type;this.text=A.text;this.items=A.items;this.onchange=A.onchange;this.disabled=A.disabled;this.value=A.value;this.checked=A.checked;this.position=A.position;this.fontColor=A.fontColor;this.iconPosition=A.iconPosition;this.border=A.border}WebFXMenuButton.prototype.toObj=function(A,B){var N=[];var G=this.name;var E=this;var L="toolbar"+this.id+"_aChange";var M="toolbar"+this.id+"_aClick";if(this.type=="select"){var O=this.text;N.push("<select id='"+this.id+"'");if(this.disabled==true){N.push(" disabled='true' ")}else{N.push(" onchange='"+L+"(this)' ");window[L]=function(P){E.onchange.apply(P)}}N.push("class='valign_m "+this.className+"' ><option value='"+this.value+"'>"+O+"</option>");if(this.items!=null){$.each(this.items,function(P,Q){N.push("<option value='"+Q.value+"'>"+Q.text+"</option>")})}N.push("</select>");$(N.join("")).appendTo(A)}else{if(this.type=="checkbox"){N.push('<label for="'+this.id+'" class="margin_l_10 margin_r_10 hand"><input onclick="'+M+'()" type="checkbox" id="'+this.id+'" value="'+this.value+'" ');if(this.checked==true){N.push(' checked="checked" ')}N.push(' class="radio_com">'+this.text+"</label>");$(N.join("")).appendTo(A);window[M]=function(){E.click()}}else{var C=navigator.userAgent.toLowerCase();var D=(C.indexOf("opera")!=-1);var F=(C.indexOf("msie")!=-1&&!D);var K="sub_"+this.id+"mouseover";var J="sub_"+this.id+"mouseout";var I="sub_"+this.id+"mouseenter";var H="sub_"+this.id+"mouseleave";if(this.position=="right"){N.push("<a style='float:right;'  id='"+this.id+"_a' ");if(this.selected!=undefined&&this.selected==true){N.push(" class='selected'")}if(this.iconPosition!="right"&&this.subMenu!=null){if(F){N.push(" onmouseover='"+K+"()' onmouseout='"+J+"()' >")}else{N.push(" onmouseenter='"+I+"()' onmouseleave='"+H+"()' >")}}else{N.push(" onclick='"+M+"()' >")}if(this.iconPosition=="right"){if(this.fontColor){N.push("<span id='"+this.id+"_span' class='menu_span' style='color: "+this.fontColor+";' title='"+G+"'>"+G+"</span>")}else{N.push("<span id='"+this.id+"_span' class='menu_span' title='"+G+"'>"+G+"</span>")}if(this.className!=null){N.push("<em id='"+this.id+"_em' class='"+this.className+"' style='margin-right: 0;'></em>")}if(this.subMenu!=null){N.push("<em id='"+this.id+"'  class='ico16 rolling_btn_b' style='margin-right:-5px;margin-left:5px;'></em>")}N.push("</a>")}else{if(this.className!=null){N.push("<em id='"+this.id+"_em' class='"+this.className+"'></em>")}N.push("<span id='"+this.id+"_span' class='menu_span' title='"+G+"'>"+G+"</span>");if(this.subMenu!=null){N.push("<em id='"+this.id+"'  class='sub_ico' style='margin-right:-5px;margin-left:5px;'></em>")}N.push("</a>")}$(N.join("")).appendTo(B);window[M]=function(){E.click()}}else{N.push("<a   id='"+this.id+"_a' ");if(this.selected!=undefined&&this.selected==true){N.push(" class='selected'")}if(this.subMenu!=null){if(F){N.push(" onmouseover='"+K+"()' onmouseout='"+J+"()' >")}else{N.push(" onmouseenter='"+I+"()' onmouseleave='"+H+"()' >")}}else{N.push(" onclick='"+M+"()' >")}if(this.className!=null){N.push("<em id='"+this.id+"_em' class='"+this.className+"'></em>")}N.push("<span id='"+this.id+"_span' class='menu_span' title='"+G+"'>"+G+"</span>");if(this.subMenu!=null){N.push("<em id='"+this.id+"'  class='sub_ico' style='margin-right:-5px;margin-left:5px;'></em>")}N.push("</a>");$(N.join("")).appendTo(A);window[M]=function(){E.click()}}}}};WebFXMenuButton.prototype.toSeparate=function(B){var A="seperate margin_lr_5";if(this.className&&this.className.indexOf("hidden")!=-1){A="seperate margin_lr_5 hidden"}$("<em class='"+A+"'></em>").appendTo(B)};function WebFXMenu(){this.allItems=[]}WebFXMenu.prototype.add=function(A){this.allItems[this.allItems.length]=A};function WebFXMenuItem(A){this.id=A.id;this.name=A.name;this.click=A.click;this.className=A.className;this.value=A.value;this.disabled=A.disabled};
jQuery.fn.comLanguage=function(F){var E=$(this).selector;var K=F.textboxID?"#"+F.textboxID:alert("error:\u5e38\u7528\u8bed - \u672a\u6307\u5b9a txtboxID");var P=F.newBtnHandler?F.newBtnHandler:alert("error:\u5e38\u7528\u8bed - \u672a\u6307\u5b9a newBtnHandler");var L=F.id?"#"+F.id:"#comLanguage_"+Math.floor(Math.random()*1000000000);var M=F.width?F.width:200;var B="";var O=F.data?F.data:null;var S=F.left?F.left:0;var A=F.top?F.top:0;var I={left:S,top:A};var C=F.phraseper?F.phraseper:null;var G=F.posLeftRight?F.posLeftRight:"left";var N=F.inputType?F.inputType:null;function T(U){if(S==0&&A==0){if(U=="left"){I.top=$(E).offset().top;I.left=$(E).offset().left-M-10;if(I.top<0){I.top=0}if(I.left<0){I.left=0}}if(U=="right"){I.top=$(E).offset().top;I.left=$(E).offset().left+$(E).outerWidth()+2;if(I.top<0){I.top=0}if(I.left+M>$(window).width()){I.left=$(window).width()-M}}}$(L).css({left:I.left,top:I.top})}var D="#btnDiv_"+Math.floor(Math.random()*1000000000);var Q="#_comLanguageListDiv"+Math.floor(Math.random()*1000000000);var H="#_comLanguageBtnDiv"+Math.floor(Math.random()*1000000000);B+="<div id='"+L.replace("#","")+"' class='comlanguage' style='width:"+M+"px;top:"+I.top+"px;left:"+I.left+"px;'>";B+="<div id='"+Q.replace("#","")+"' class='comlanguage_list'>";var J=1;for(var R=0;R<O.length;R++){B+="<a>"+J+".  <span title='"+tranCharacter(O[R])+"'>"+tranCharacter(O[R])+"</span></a>";J++}B+="</div>";B+="<div id='"+H.replace("#","")+"' class='clearfix comlanguage_btn'>";B+="<span class='left'><a id='"+D.replace("#","")+"' class='common_button common_button_gray comLanguage_new left'>"+$.i18n("phrase.sys.js.neworupdate")+"</a></span>";B+="<span class='right'><a class='common_button common_button_gray comLanguage_close right'>"+$.i18n("phrase.sys.js.close")+"</a></span>";B+="</div>";B+="</div>";$("body").append(B);T(G);if(F.height){$(L).css({height:F.height-2});$(Q).css({height:$(L).innerHeight()-$(D).outerHeight()-$(H).outerHeight()-2})}$(L).show();$(L).mouseleave(function(){$(this).remove()});$(L+" .comLanguage_close").click(function(){$(L).remove()});$(L+" .comLanguage_new").click(function(){$(L).remove();P()});$(L+" .comlanguage_list a").click(function(){$(L).remove();if(N=="ckeditor"){$(K).insertEditorContent(escapeStringToHTML($(this).find("span").text()))}else{var V=$(K).val().trim()==""?"":"\r\n";var U=$(K).val().trim()+V+$(this).find("span").text();$(K).val(U)}})};function tranCharacter(A){if(!A){return""}if(A.indexOf('"')>-1){A=A.replace(/"/g,"&quot;")}if(A.indexOf("<")>-1){A=A.replace(/</g,"&lt;")}if(A.indexOf(">")>-1){A=A.replace(/>/g,"&gt;")}return A};
var plist=null;var styleData=null;var printDefaultSelect=null;var notPrintDefaultSelect=null;var otherPrarams=null;var contentType=null;var viewState=null;var moduleId=null;var isFormPrintFlag=false;function printList(A,B,C){if(!A){return }plist=A;styleData=B;if(arguments[2]!=null){printDefaultSelect=arguments[2]}else{printDefaultSelect=null}if(arguments[3]!=null){notPrintDefaultSelect=arguments[3]}else{notPrintDefaultSelect=null}if(arguments[4]!=null){contentType=arguments[4]}else{contentType=null}if(arguments[5]!=null){viewState=arguments[5]}else{viewState=null}if(arguments[6]!=null){otherPrarams=arguments[6]}else{otherPrarams=null}if(typeof C!="undefined"&&C=="true"){printButton("true")}else{printButton("false")}}function printButton(B){var A=_ctxPath+"/common/print/print.jsp?isEdge="+B+"&jsessionid="+_sessionid;if(contentType){A+="&contentType="+contentType}if(viewState){A+="&viewState="+viewState}window.open(A)}function printListLodop(G,A,H,F,D,E,C,B){if(!G){return }plist=G;styleData=A;if(H!=null){printDefaultSelect=H}else{printDefaultSelect=null}if(F!=null){notPrintDefaultSelect=F}else{notPrintDefaultSelect=null}if(D!=null){contentType=D}else{contentType=null}if(E!=null){viewState=E}else{viewState=null}if(C!=null){otherPrarams=C}else{otherPrarams=null}if(B!=null){moduleId=B}else{moduleId=null}printButtonLodop()}function printButtonLodop(){var A=_ctxPath+"/common/print/lodopprint.jsp?jsessionid="+_sessionid;if(contentType){A+="&contentType="+contentType}if(viewState){A+="&viewState="+viewState}if(moduleId){A+="&moduleId="+moduleId}window.open(A)}function getParentWindow(A){A=A||window;if(A.dialogArguments){return A.dialogArguments}else{return A.opener||A}}function printLoad(){var E=getParentWindow();var B=document.getElementById("context");var H=E.plist;var C=H.size();for(var F=0;F<C;F++){var K=H.get(F);if(typeof (K.dataHtml)==="undefined"||typeof (K.dataHtml)===undefined){B.innerHTML+="<p></p>"}else{B.innerHTML+="<p>"+K.dataHtml+"</p>"}}var D=E.styleData;setStyle(D);var G=document.getElementById("checkOption");var A=E.plist;var J=H.size();var I=0;for(var F=0;F<J;F++){var K=A.get(F);if(K.dataName!=null&&K.dataName!=""){G.innerHTML+="<label for='dataNameBox"+F+"' class='margin_r_10 hand'><input class='radio_com' type=checkbox checked name='dataNameBoxes' id=dataNameBox"+F+" onclick='printMain(this)'><font style='font-size:12px' color='black'>"+K.dataName+"</font></label>&nbsp;&nbsp;";I++}}if(I>0){G.innerHTML+="<font style='font-size:12px' color='black'><label for='printall' class='margin_r_10 hand'><input class='radio_com' type=checkbox id ='printall' checked name=cboxs onclick=printAll(this)>"+$.i18n("print.printall.label.js")+"</label></font>"}if(E.notPrintDefaultSelect!=null){for(var F=0;F<E.notPrintDefaultSelect.length;F++){if(document.getElementById("dataNameBox"+E.notPrintDefaultSelect[F])!=null){document.getElementById("dataNameBox"+E.notPrintDefaultSelect[F]).checked=false}}}document.close();var B=document.getElementById("context");creatDataHtml(H,B);disabledLink()}function printMain(F){var E=getParentWindow();var H=E.plist;var C=document.getElementById("context");creatDataHtml(H,C);checkCount(F,H);disabledLink();initBodyHeight();loadSign();if(C.className=="content set_ul_ls"){var G=$("#context>div>ul>li.comment_li");for(var B=0,A=G.length;B<A;B++){G[B].style.listStyle="none"}var D=$("#context div[class=content]>ul>li");for(var B=0,A=D.length;B<A;B++){D[B].style.listStyle="none"}}}function cleanSpecial(E){var A=E.indexOf("<DIV>");if(A==-1){return E}var C=E.substr(0,A-1);var D=E.substr(A);var B=D.indexOf("</DIV>");var F=D.substr(B+6);return cleanSpecial(C+F)}function creatDataHtml(G,A){var B=G.size();var E=new StringBuffer();E.append("");for(var D=0;D<B;D++){var I=G.get(D);if(I.dataName!=null&&I.dataName!=""){var H=document.getElementById("dataNameBox"+D);if(H.checked){if(typeof (I.dataHtml)==="undefined"||typeof (I.dataHtml)===undefined){E.append("<p></p>")}else{E.append("<p>"+I.dataHtml+"</p>")}}else{var C=document.getElementById("printall");C.checked=false}}if(I.dataName==""){if(typeof (I.dataHtml)==="undefined"||typeof (I.dataHtml)===undefined){E.append("<p></p>")}else{E.append("<p>"+I.dataHtml+"</p>")}}}var F=E.toString();$(A).html(E.toString());if(contentType==20||(contentType==10&&$("div[id^='formmain_']",$(A)).length>0)){replaceFormCompField();initFormContent(true)}else{if(contentType==10&&F.indexOf("formmain_")!=-1){initFormContent(true,true)}}$(":checkbox",$("div[id^='formmain_']")).removeProp("disabled").removeAttr("name").removeAttr("id").attr("onclick","return false;").unbind("click").bind("click",function(){return false})}function replaceFormCompField(){var G=null;var A=$("span[id$='_span']",$("#context"));var B=getParentWindow().otherPrarams;if(B){if(B.formObj){G=B.formObj}}for(var C=0;C<A.length;C++){var E=$(A[C]);var F=E.attr("fieldVal");if(F==undefined){continue}else{F=$.parseJSON(F)}var D=E.attr("id").split("_")[0];if(F.inputType=="attachment"||F.inputType=="document"||F.inputType=="image"){if(20==contentType&&G!=null){E.html(B[getRecordIdByJqueryField(E)+"_"+D]);E.find("div[id^=attachment2Area]").css("background-color","white");E.find("div[id^=attachmentArea]").css("background-color","white")}E.find(".ico16").each(function(){if($(this).hasClass("affix_del_16")||$(this).hasClass("affix_16")||$(this).hasClass("associated_document_16")||$(this).hasClass("insert_pic_16")||$(this).hasClass("editor_16")){$(this).hide()}if($(this).hasClass("collection_16")){$(this).attr("title","")}});E.find(".attachment_operate").remove();E.find("a").each(function(){$(this).attr("title","")})}else{if(F.inputType=="barcode"){if(20==contentType&&G!=null){E.html(B[getRecordIdByJqueryField(E)+"_"+D])}}}}}function checkCount(F,D){var A=D.size();var H=0;for(var C=0;C<A;C++){var I=D.get(C);if(I.dataName==undefined){H=H+1}}H=A-H;if(F.checked==false){var E=0;for(var C=0;C<A;C++){var I=D.get(C);if(I.dataName!=null&&I.dataName!=""){var G=document.getElementById("dataNameBox"+C);if(G.checked==false){E++}}}if(E==H){alert("\u6253\u5370\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a");if(F.id=="printall"){var B=parent.getParentWindow();if(B.printDefaultSelect!=null){if(document.getElementById("dataNameBox"+B.printDefaultSelect[0])!=null){document.getElementById("dataNameBox"+B.printDefaultSelect[0]).checked=true}else{document.getElementById("dataNameBox0").checked=true}}else{document.getElementById("dataNameBox0").checked=true}}else{F.checked=true}printMain(F);return false}}}function PrintFragment(A,B){this.dataName=A;this.dataHtml=B}function disabledLink(){var K=document.body.getElementsByTagName("a");var U=document.body.getElementsByTagName("span");var B=document.body.getElementsByTagName("u");var G=document.body.getElementsByTagName("table");var C=document.body.getElementsByTagName("INPUT");var J=document.body.getElementsByTagName("img");var Y=document.body.getElementsByTagName("select");var H=document.body.getElementsByTagName("TEXTAREA");var O=document.body.getElementsByTagName("td");var I=document.body.getElementsByTagName("tr");var A=document.body.getElementsByTagName("OBJECT");var L=$(".xdRepeatingSection");var T="border-left:0px;border-top:0px;border-right:0px;border-bottom:0px solid #ff0000";for(var P=0;P<K.length;P++){K[P].target="_self";K[P].style.color="#000000";K[P].onclick="";K[P].href="###";K[P].style.textDecoration="none";K[P].style.cursor="default"}for(var P=0;P<U.length;P++){U[P].onmouseout="";U[P].onmouseover="";U[P].onclick="";U[P].style.cursor="default"}for(var P=0;P<B.length;P++){B[P].onclick=function(){}}for(var P=0;P<G.length;P++){G[P].onclick=""}for(var P=C.length-1;P>=0;P--){if(C[P].type=="checkbox"){if(C[P].parentNode.parentNode.id=="checkOption"||C[P].id=="printall"){continue}}else{if(C[P].type=="text"){if(C[P].id!="print8"){var Q=C[P].style.cssText;var E="WORD-WRAP: break-word;TABLE-LAYOUT: fixed;word-break:break-all;";if(Q==""){Q=E+"display:inline-block"}else{if(Q.toLowerCase().indexOf("display")==-1){E=E+"display:inline-block"}Q=Q+";"+E}if(Q&&Q.indexOf('"')!=-1){Q=Q.replace(/"/g,"&quot;")}var R=C[P].value.escapeSameWidthSpace()?C[P].value.escapeSameWidthSpace():C[P].title.escapeSameWidthSpace();C[P].outerHTML='<span type="text" id="'+C[P].id+'" class="'+C[P].className+'" style="'+Q+'">'+R+"</span>";continue}}}var W="print1 print2 print3 print4 print5 print6 print7 print8 dataNameBox0 dataNameBox1 dataNameBox2 dataNameBox3 dataNameBox4 dataNameBox5 printall";if(W.indexOf(C[P].id)==-1){C[P].disabled="disabled";C[P].onkeypress="";C[P].onchange="";C[P].onclick="";C[P].onmouseout="";C[P].onmouseover="";C[P].onfocus="";C[P].onblur="";if(!v3x.isMSIE){C[P].disabled="disabled"}}}for(var P=0;P<J.length;P++){J[P].onkeypress="";J[P].onchange="";J[P].onclick="";J[P].style.cursor="default";J[P].alt="";J[P].title="";try{var N=J[P].src.toString();if(N.indexOf("form/image/selecetUser.gif")!=-1||N.indexOf("form/image/date.gif")!=-1||N.indexOf("form/image/add.gif")!=-1||N.indexOf("form/image/addEmpty.gif")!=-1||N.indexOf("form/image/delete.gif")!=-1||N.indexOf("handwrite.gif")!=-1||N.indexOf("seeyon/apps_res/v3xmain/images/message/16/attachment.gif")!=-1||N.indexOf("seeyon/apps_res/form/image/quoteform.gif")!=-1){J[P].outerHTML="&nbsp;&nbsp;&nbsp;";P--}if(N.indexOf("handwrite.gif")!=-1){for(var X=0;X<A.length;X++){if(A[X].innerHTML.indexOf("Enabled")!=-1){A[X].Enabled=false}}}}catch(S){}}for(var M=Y.length-1;M>=0;M--){var Q=Y[M].style.cssText;try{var D=Y[M].parentNode.childNodes;for(var V=0;V<D.length;V++){if(D[V].id==Y[M].id+"_autocomplete"){Q=D[V].style.cssText;break}}}catch(S){}if(Q&&Q.indexOf('"')!=-1){Q=Q.replace(/"/g,"&quot;")}$(Y[M].parentNode).replaceWith('<span class="'+Y[M].className+'" style="'+Q+'">'+Y[M].options[Y[M].selectedIndex].text+"</span>")}for(var P=0;P<H.length;P++){try{var F="overflow-y:visible;overflow-x:visible;";var Q=H[P].style.cssText;if(Q==""){Q=F}else{Q=Q+";"+F}H[P].style.cssText=Q;H[P].onclick="";H[P].onkeypress="";H[P].onchange="";H[P].onmouseout="";H[P].onmouseover="";H[P].onfocus="";H[P].onblur=""}catch(S){}H[P].readOnly="readOnly"}for(var P=0;P<O.length;P++){O[P].onclick=""}for(var P=0;P<I.length;P++){I[P].onclick="";$(I[P]).unbind("click").attr("onclick","")}L.each(function(){this.onclick="";$(this).unbind("click").attr("onclick","")})}function printInnerLoad(){var D=document.getElementById("context");var F=parent.getParentWindow();var G=F.plist;var C=G.size();for(var B=0;B<C;B++){var E=G.get(B);if(typeof (E.dataHtml)==="undefined"||typeof (E.dataHtml)===undefined){D.innerHTML+="<p></p>"}else{D.innerHTML+="<p>"+E.dataHtml+"</p>"}}var A=F.styleData;if(!A){setStyle(A)}}function setStyle(A){if(A.size()>0){var B=document.getElementById("linkList");if(B==null){return }for(var C=0;C<A.size();C++){var D=document.createElement("link");D.setAttribute("rel","stylesheet");D.setAttribute("href",A.get(C));D.setAttribute("type","text/css");B.appendChild(D)}}}function printAll(C){var A=document.getElementsByName("dataNameBoxes");if(C.checked){for(var B=0;B<A.length;B++){A[B].checked=true}printMain(C)}else{for(var B=0;B<A.length;B++){A[B].checked=false}printMain(C)}loadSign()}function onbeforeprint(){document.getElementById("checkOption").style.display="none"}function onafterprint(){document.getElementById("checkOption").style.display=""};
(function(A){A.Jcrop=function(E,c){var j=A.extend({},A.Jcrop.defaults),AG,AJ=navigator.userAgent.toLowerCase(),AD=/msie/.test(AJ),AI=/msie [1-6]\./.test(AJ);function N(AU){return Math.round(AU)+"px"}function e(AU){return j.baseClass+"-"+AU}function f(){return A.fx.step.hasOwnProperty("backgroundColor")}function g(AU){var AV=A(AU).offset();return[AV.left,AV.top]}function h(AU){return[(AU.pageX-AG[0]),(AU.pageY-AG[1])]}function b(AU){if(typeof (AU)!=="object"){AU={}}j=A.extend(j,AU);A.each(["onChange","onSelect","onRelease","onDblClick"],function(AV,AW){if(typeof (j[AW])!=="function"){j[AW]=function(){}}})}function G(AW,AZ,AY){AG=g(AS);q.setCursor(AW==="move"?AW:AW+"-resize");if(AW==="move"){return q.activateHandlers(s(AZ),R,AY)}var AU=AB.getFixed();var AV=T(AW);var AX=AB.getCorner(T(AV));AB.setPressed(AB.getCorner(AV));AB.setCurrent(AX);q.activateHandlers(i(AW,AU),R,AY)}function i(AV,AU){return function(AW){if(!j.aspectRatio){switch(AV){case"e":AW[1]=AU.y2;break;case"w":AW[1]=AU.y2;break;case"n":AW[0]=AU.x2;break;case"s":AW[0]=AU.x2;break}}else{switch(AV){case"e":AW[1]=AU.y+1;break;case"w":AW[1]=AU.y+1;break;case"n":AW[0]=AU.x+1;break;case"s":AW[0]=AU.x+1;break}}AB.setCurrent(AW);x.update()}}function s(AV){var AU=AV;AR.watchKeys();return function(AW){AB.moveOffset([AW[0]-AU[0],AW[1]-AU[1]]);AU=AW;x.update()}}function T(AU){switch(AU){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function C(AU){return function(AV){if(j.disabled){return false}if((AU==="move")&&!j.allowMove){return false}AG=g(AS);S=true;G(AU,h(AV));AV.stopPropagation();AV.preventDefault();return false}}function v(AY,AV,AX){var AU=AY.width(),AW=AY.height();if((AU>AV)&&AV>0){AU=AV;AW=(AV/AY.width())*AY.height()}if((AW>AX)&&AX>0){AW=AX;AU=(AX/AY.height())*AY.width()}n=AY.width()/AU;F=AY.height()/AW;AY.width(AU).height(AW)}function z(AU){return{x:AU.x*n,y:AU.y*F,x2:AU.x2*n,y2:AU.y2*F,w:AU.w*n,h:AU.h*F}}function R(AV){var AU=AB.getFixed();if((AU.w>j.minSelect[0])&&(AU.h>j.minSelect[1])){x.enableHandles();x.done()}else{x.release()}q.setCursor(j.allowSelect?"crosshair":"default")}function AF(AU){if(j.disabled){return false}if(!j.allowSelect){return false}S=true;AG=g(AS);x.disableHandles();q.setCursor("crosshair");var AV=h(AU);AB.setPressed(AV);x.update();q.activateHandlers(AQ,R,AU.type.substring(0,5)==="touch");AR.watchKeys();AU.stopPropagation();AU.preventDefault();return false}function AQ(AU){AB.setCurrent(AU);x.update()}function AH(){var AU=A("<div></div>").addClass(e("tracker"));if(AD){AU.css({opacity:0,backgroundColor:"white"})}return AU}if(typeof (E)!=="object"){E=A(E)[0]}if(typeof (c)!=="object"){c={}}b(c);var J={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0};var y=A(E),AL=true;if(E.tagName=="IMG"){if(y[0].width!=0&&y[0].height!=0){y.width(y[0].width);y.height(y[0].height)}else{var W=new Image();W.src=y[0].src;y.width(W.width);y.height(W.height)}var AS=y.clone().removeAttr("id").css(J).show();AS.width(y.width());AS.height(y.height());y.after(AS).hide()}else{AS=y.css(J).show();AL=false;if(j.shade===null){j.shade=true}}v(AS,j.boxWidth,j.boxHeight);var r=AS.width(),p=AS.height(),AA=A("<div />").width(r).height(p).addClass(e("holder")).css({position:"relative",backgroundColor:j.bgColor}).insertAfter(y).append(AS);if(j.addClass){AA.addClass(j.addClass)}var k=A("<div />"),M=A("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),m=A("<div />").width("100%").height("100%").css("zIndex",320),a=A("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var AU=AB.getFixed();j.onDblClick.call(I,AU)}).insertBefore(AS).append(M,m);if(AL){k=A("<img />").attr("src",AS.attr("src")).css(J).width(r).height(p),M.append(k)}if(AI){a.css({overflowY:"hidden"})}var V=j.boundary;var B=AH().width(r+(V*2)).height(p+(V*2)).css({position:"absolute",top:N(-V),left:N(-V),zIndex:290}).mousedown(AF);var AP=j.bgColor,AC=j.bgOpacity,Z,AN,Q,u,n,F,P=true,S,d,AE;AG=g(AS);var t=(function(){function AU(){var Ab={},AZ=["touchstart","touchmove","touchend"],Aa=document.createElement("div"),AY;try{for(AY=0;AY<AZ.length;AY++){var AW=AZ[AY];AW="on"+AW;var AX=(AW in Aa);if(!AX){Aa.setAttribute(AW,"return;");AX=typeof Aa[AW]=="function"}Ab[AZ[AY]]=AX}return Ab.touchstart&&Ab.touchend&&Ab.touchmove}catch(Ac){return false}}function AV(){if((j.touchSupport===true)||(j.touchSupport===false)){return j.touchSupport}else{return AU()}}return{createDragger:function(AW){return function(AX){if(j.disabled){return false}if((AW==="move")&&!j.allowMove){return false}AG=g(AS);S=true;G(AW,h(t.cfilter(AX)),true);AX.stopPropagation();AX.preventDefault();return false}},newSelection:function(AW){return AF(t.cfilter(AW))},cfilter:function(AW){AW.pageX=AW.originalEvent.changedTouches[0].pageX;AW.pageY=AW.originalEvent.changedTouches[0].pageY;return AW},isSupported:AU,support:AV()}}());var AB=(function(){var AW=0,Ah=0,AV=0,Ag=0,AZ,AX;function Ab(Ak){Ak=AY(Ak);AV=AW=Ak[0];Ag=Ah=Ak[1]}function Aa(Ak){Ak=AY(Ak);AZ=Ak[0]-AV;AX=Ak[1]-Ag;AV=Ak[0];Ag=Ak[1]}function Aj(){return[AZ,AX]}function AU(Am){var Al=Am[0],Ak=Am[1];if(0>AW+Al){Al-=Al+AW}if(0>Ah+Ak){Ak-=Ak+Ah}if(p<Ag+Ak){Ak+=p-(Ag+Ak)}if(r<AV+Al){Al+=r-(AV+Al)}AW+=Al;AV+=Al;Ah+=Ak;Ag+=Ak}function Ac(Ak){var Al=Ai();switch(Ak){case"ne":return[Al.x2,Al.y];case"nw":return[Al.x,Al.y];case"se":return[Al.x2,Al.y2];case"sw":return[Al.x,Al.y2]}}function Ai(){if(!j.aspectRatio){return Af()}var Am=j.aspectRatio,At=j.minSize[0]/n,Al=j.maxSize[0]/n,Aw=j.maxSize[1]/F,An=AV-AW,Av=Ag-Ah,Ao=Math.abs(An),Ap=Math.abs(Av),Ar=Ao/Ap,Ak,As,Au,Aq;if(Al===0){Al=r*10}if(Aw===0){Aw=p*10}if(Ar<Am){As=Ag;Au=Ap*Am;Ak=An<0?AW-Au:Au+AW;if(Ak<0){Ak=0;Aq=Math.abs((Ak-AW)/Am);As=Av<0?Ah-Aq:Aq+Ah}else{if(Ak>r){Ak=r;Aq=Math.abs((Ak-AW)/Am);As=Av<0?Ah-Aq:Aq+Ah}}}else{Ak=AV;Aq=Ao/Am;As=Av<0?Ah-Aq:Ah+Aq;if(As<0){As=0;Au=Math.abs((As-Ah)*Am);Ak=An<0?AW-Au:Au+AW}else{if(As>p){As=p;Au=Math.abs(As-Ah)*Am;Ak=An<0?AW-Au:Au+AW}}}if(Ak>AW){if(Ak-AW<At){Ak=AW+At}else{if(Ak-AW>Al){Ak=AW+Al}}if(As>Ah){As=Ah+(Ak-AW)/Am}else{As=Ah-(Ak-AW)/Am}}else{if(Ak<AW){if(AW-Ak<At){Ak=AW-At}else{if(AW-Ak>Al){Ak=AW-Al}}if(As>Ah){As=Ah+(AW-Ak)/Am}else{As=Ah-(AW-Ak)/Am}}}if(Ak<0){AW-=Ak;Ak=0}else{if(Ak>r){AW-=Ak-r;Ak=r}}if(As<0){Ah-=As;As=0}else{if(As>p){Ah-=As-p;As=p}}return Ae(Ad(AW,Ah,Ak,As))}function AY(Ak){if(Ak[0]<0){Ak[0]=0}if(Ak[1]<0){Ak[1]=0}if(Ak[0]>r){Ak[0]=r}if(Ak[1]>p){Ak[1]=p}return[Math.round(Ak[0]),Math.round(Ak[1])]}function Ad(An,Ap,Am,Ao){var Ar=An,Aq=Am,Al=Ap,Ak=Ao;if(Am<An){Ar=Am;Aq=An}if(Ao<Ap){Al=Ao;Ak=Ap}return[Ar,Al,Aq,Ak]}function Af(){var Al=AV-AW,Ak=Ag-Ah,Am;if(Z&&(Math.abs(Al)>Z)){AV=(Al>0)?(AW+Z):(AW-Z)}if(AN&&(Math.abs(Ak)>AN)){Ag=(Ak>0)?(Ah+AN):(Ah-AN)}if(u/F&&(Math.abs(Ak)<u/F)){Ag=(Ak>0)?(Ah+u/F):(Ah-u/F)}if(Q/n&&(Math.abs(Al)<Q/n)){AV=(Al>0)?(AW+Q/n):(AW-Q/n)}if(AW<0){AV-=AW;AW-=AW}if(Ah<0){Ag-=Ah;Ah-=Ah}if(AV<0){AW-=AV;AV-=AV}if(Ag<0){Ah-=Ag;Ag-=Ag}if(AV>r){Am=AV-r;AW-=Am;AV-=Am}if(Ag>p){Am=Ag-p;Ah-=Am;Ag-=Am}if(AW>r){Am=AW-p;Ag-=Am;Ah-=Am}if(Ah>p){Am=Ah-p;Ag-=Am;Ah-=Am}return Ae(Ad(AW,Ah,AV,Ag))}function Ae(Ak){return{x:Ak[0],y:Ak[1],x2:Ak[2],y2:Ak[3],w:Ak[2]-Ak[0],h:Ak[3]-Ak[1]}}return{flipCoords:Ad,setPressed:Ab,setCurrent:Aa,getOffset:Aj,moveOffset:AU,getCorner:Ac,getFixed:Ai}}());var D=(function(){var AZ=false,Ae=A("<div />").css({position:"absolute",zIndex:240,opacity:0}),AY={top:Aa(),left:Aa().height(p),right:Aa().height(p),bottom:Aa()};function Ag(Ah,Ai){AY.left.css({height:N(Ai)});AY.right.css({height:N(Ai)})}function AW(){return Ab(AB.getFixed())}function Ab(Ah){AY.top.css({left:N(Ah.x),width:N(Ah.w),height:N(Ah.y)});AY.bottom.css({top:N(Ah.y2),left:N(Ah.x),width:N(Ah.w),height:N(p-Ah.y2)});AY.right.css({left:N(Ah.x2),width:N(r-Ah.x2)});AY.left.css({width:N(Ah.x)})}function Aa(){return A("<div />").css({position:"absolute",backgroundColor:j.shadeColor||j.bgColor}).appendTo(Ae)}function AX(){if(!AZ){AZ=true;Ae.insertBefore(AS);AW();x.setBgOpacity(1,0,1);k.hide();Ad(j.shadeColor||j.bgColor,1);if(x.isAwake()){AV(j.bgOpacity,1)}else{AV(1,1)}}}function Ad(Ah,Ai){H(AU(),Ah,Ai)}function Af(){if(AZ){Ae.remove();k.show();AZ=false;if(x.isAwake()){x.setBgOpacity(j.bgOpacity,1,1)}else{x.setBgOpacity(1,1,1);x.disableHandles()}H(AA,0,1)}}function AV(Ai,Ah){if(AZ){if(j.bgFade&&!Ah){Ae.animate({opacity:1-Ai},{queue:false,duration:j.fadeTime})}else{Ae.css({opacity:1-Ai})}}}function Ac(){j.shade?AX():Af();if(x.isAwake()){AV(j.bgOpacity)}}function AU(){return Ae.children()}return{update:AW,updateRaw:Ab,getShades:AU,setBgColor:Ad,enable:AX,disable:Af,resize:Ag,refresh:Ac,opacity:AV}}());var x=(function(){var Af,Ao=370,Ab={},Ar={},AW={},AY=false;function Ac(Av){var Aw=A("<div />").css({position:"absolute",opacity:j.borderOpacity}).addClass(e(Av));M.append(Aw);return Aw}function AX(Av,Aw){var Ax=A("<div />").mousedown(C(Av)).css({cursor:Av+"-resize",position:"absolute",zIndex:Aw}).addClass("ord-"+Av);if(t.support){Ax.bind("touchstart.jcrop",t.createDragger(Av))}m.append(Ax);return Ax}function Ag(Av){var Aw=j.handleSize,Ax=AX(Av,Ao++).css({opacity:j.handleOpacity}).addClass(e("handle"));if(Aw){Ax.width(Aw).height(Aw)}return Ax}function Am(Av){return AX(Av,Ao++).addClass("jcrop-dragbar")}function Aj(Av){var Aw;for(Aw=0;Aw<Av.length;Aw++){AW[Av[Aw]]=Am(Av[Aw])}}function An(Av){var Aw,Ax;for(Ax=0;Ax<Av.length;Ax++){switch(Av[Ax]){case"n":Aw="hline";break;case"s":Aw="hline bottom";break;case"e":Aw="vline right";break;case"w":Aw="vline";break}Ab[Av[Ax]]=Ac(Aw)}}function Ai(Av){var Aw;for(Aw=0;Aw<Av.length;Aw++){Ar[Av[Aw]]=Ag(Av[Aw])}}function Ae(Av,Aw){if(!j.shade){k.css({top:N(-Aw),left:N(-Av)})}a.css({top:N(Aw),left:N(Av)})}function Au(Av,Aw){a.width(Math.round(Av)).height(Math.round(Aw))}function AZ(){var Av=AB.getFixed();AB.setPressed([Av.x,Av.y]);AB.setCurrent([Av.x2,Av.y2]);As()}function As(Av){if(Af){return Ad(Av)}}function Ad(Av){var Aw=AB.getFixed();Au(Aw.w,Aw.h);Ae(Aw.x,Aw.y);if(j.shade){D.updateRaw(Aw)}Af||At();if(Av){j.onSelect.call(I,z(Aw))}else{j.onChange.call(I,z(Aw))}}function AV(Aw,Ax,Av){if(!Af&&!Ax){return }if(j.bgFade&&!Av){AS.animate({opacity:Aw},{queue:false,duration:j.fadeTime})}else{AS.css("opacity",Aw)}}function At(){a.show();if(j.shade){D.opacity(AC)}else{AV(AC,true)}Af=true}function Ap(){Aq();a.hide();if(j.shade){D.opacity(1)}else{AV(1)}Af=false;j.onRelease.call(I)}function AU(){if(AY){m.show()}}function Ak(){AY=true;if(j.allowResize){m.show();return true}}function Aq(){AY=false;m.hide()}function Al(Av){if(Av){d=true;Aq()}else{d=false;Ak()}}function Ah(){Al(false);AZ()}if(j.dragEdges&&A.isArray(j.createDragbars)){Aj(j.createDragbars)}if(A.isArray(j.createHandles)){Ai(j.createHandles)}if(j.drawBorders&&A.isArray(j.createBorders)){An(j.createBorders)}A(document).bind("touchstart.jcrop-ios",function(Av){if(A(Av.currentTarget).hasClass("jcrop-tracker")){Av.stopPropagation()}});var Aa=AH().mousedown(C("move")).css({cursor:"move",position:"absolute",zIndex:360});if(t.support){Aa.bind("touchstart.jcrop",t.createDragger("move"))}M.append(Aa);Aq();return{updateVisible:As,update:Ad,release:Ap,refresh:AZ,isAwake:function(){return Af},setCursor:function(Av){Aa.css("cursor",Av)},enableHandles:Ak,enableOnly:function(){AY=true},showHandles:AU,disableHandles:Aq,animMode:Al,setBgOpacity:AV,done:Ah}}());var q=(function(){var AV=function(){},AX=function(){},AW=j.trackDocument;function Ae(Af){B.css({zIndex:450});if(Af){A(document).bind("touchmove.jcrop",Ad).bind("touchend.jcrop",Aa)}else{if(AW){A(document).bind("mousemove.jcrop",AU).bind("mouseup.jcrop",AY)}}}function Ac(){B.css({zIndex:290});A(document).unbind(".jcrop")}function AU(Af){AV(h(Af));return false}function AY(Af){Af.preventDefault();Af.stopPropagation();if(S){S=false;AX(h(Af));if(x.isAwake()){j.onSelect.call(I,z(AB.getFixed()))}Ac();AV=function(){};AX=function(){}}return false}function AZ(Ag,Af,Ah){S=true;AV=Ag;AX=Af;Ae(Ah);return false}function Ad(Af){AV(h(t.cfilter(Af)));return false}function Aa(Af){return AY(t.cfilter(Af))}function Ab(Af){B.css("cursor",Af)}if(!AW){B.mousemove(AU).mouseup(AY).mouseout(AY)}AS.before(B);return{activateHandlers:AZ,setCursor:Ab}}());var AR=(function(){var AX=A('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),AZ=A("<div />").css({position:"absolute",overflow:"hidden"}).append(AX);function AV(){if(j.keySupport){AX.show();AX.focus()}}function AY(Aa){AX.hide()}function AW(Ab,Aa,Ac){if(j.allowMove){AB.moveOffset([Aa,Ac]);x.updateVisible(true)}Ab.preventDefault();Ab.stopPropagation()}function AU(Ab){if(Ab.ctrlKey||Ab.metaKey){return true}AE=Ab.shiftKey?true:false;var Aa=AE?10:1;switch(Ab.keyCode){case 37:AW(Ab,-Aa,0);break;case 39:AW(Ab,Aa,0);break;case 38:AW(Ab,0,-Aa);break;case 40:AW(Ab,0,Aa);break;case 27:if(j.allowSelect){x.release()}break;case 9:return true}return false}if(j.keySupport){AX.keydown(AU).blur(AY);if(AI||!j.fixedSupport){AX.css({position:"absolute",left:"-20px"});AZ.append(AX).insertBefore(AS)}else{AX.insertBefore(AS)}}return{watchKeys:AV}}());function L(AU){AA.removeClass().addClass(e("holder")).addClass(AU)}function U(An,Ab){var Ah=An[0]/n,AW=An[1]/F,Ag=An[2]/n,AV=An[3]/F;if(d){return }var Af=AB.flipCoords(Ah,AW,Ag,AV),Al=AB.getFixed(),Ai=[Al.x,Al.y,Al.x2,Al.y2],AY=Ai,AX=j.animationDelay,Ak=Af[0]-Ai[0],Aa=Af[1]-Ai[1],Aj=Af[2]-Ai[2],AZ=Af[3]-Ai[3],Ae=0,Ac=j.swingSpeed;Ah=AY[0];AW=AY[1];Ag=AY[2];AV=AY[3];x.animMode(true);var AU;function Ad(){window.setTimeout(Am,AX)}var Am=(function(){return function(){Ae+=(100-Ae)/Ac;AY[0]=Math.round(Ah+((Ae/100)*Ak));AY[1]=Math.round(AW+((Ae/100)*Aa));AY[2]=Math.round(Ag+((Ae/100)*Aj));AY[3]=Math.round(AV+((Ae/100)*AZ));if(Ae>=99.8){Ae=100}if(Ae<100){AO(AY);Ad()}else{x.done();x.animMode(false);if(typeof (Ab)==="function"){Ab.call(I)}}}}());Ad()}function l(AU){AO([AU[0]/n,AU[1]/F,AU[2]/n,AU[3]/F]);j.onSelect.call(I,z(AB.getFixed()));x.enableHandles()}function AO(AU){AB.setPressed([AU[0],AU[1]]);AB.setCurrent([AU[2],AU[3]]);x.update()}function K(){return z(AB.getFixed())}function AM(){return AB.getFixed()}function X(AU){b(AU);o()}function Y(){j.disabled=true;x.disableHandles();x.setCursor("default");q.setCursor("default")}function w(){j.disabled=false;o()}function O(){x.done();q.activateHandlers(null,null)}function AK(){AA.remove();y.show();y.css("visibility","visible");A(E).removeData("Jcrop")}function AT(AV,AW){x.release();Y();var AU=new Image();AU.onload=function(){var AX=AU.width;var AZ=AU.height;var Aa=j.boxWidth;var AY=j.boxHeight;AS.width(AX).height(AZ);AS.attr("src",AV);k.attr("src",AV);v(AS,Aa,AY);r=AS.width();p=AS.height();k.width(r).height(p);B.width(r+(V*2)).height(p+(V*2));AA.width(r).height(p);D.resize(r,p);w();if(typeof (AW)==="function"){AW.call(I)}};AU.src=AV}function H(AX,AU,AV){var AW=AU||j.bgColor;if(j.bgFade&&f()&&j.fadeTime&&!AV){AX.animate({backgroundColor:AW},{queue:false,duration:j.fadeTime})}else{AX.css("backgroundColor",AW)}}function o(AU){if(j.allowResize){if(AU){x.enableOnly()}else{x.enableHandles()}}else{x.disableHandles()}q.setCursor(j.allowSelect?"crosshair":"default");x.setCursor(j.allowMove?"move":"default");if(j.hasOwnProperty("trueSize")){n=j.trueSize[0]/r;F=j.trueSize[1]/p}if(j.hasOwnProperty("setSelect")){l(j.setSelect);x.done();delete (j.setSelect)}D.refresh();if(j.bgColor!=AP){H(j.shade?D.getShades():AA,j.shade?(j.shadeColor||j.bgColor):j.bgColor);AP=j.bgColor}if(AC!=j.bgOpacity){AC=j.bgOpacity;if(j.shade){D.refresh()}else{x.setBgOpacity(AC)}}Z=j.maxSize[0]||0;AN=j.maxSize[1]||0;Q=j.minSize[0]||0;u=j.minSize[1]||0;if(j.hasOwnProperty("outerImage")){AS.attr("src",j.outerImage);delete (j.outerImage)}x.refresh()}if(t.support){B.bind("touchstart.jcrop",t.newSelection)}m.hide();o(true);var I={setImage:AT,animateTo:U,setSelect:l,setOptions:X,tellSelect:K,tellScaled:AM,setClass:L,disable:Y,enable:w,cancel:O,release:x.release,destroy:AK,focus:AR.watchKeys,getBounds:function(){return[r*n,p*F]},getWidgetSize:function(){return[r,p]},getScaleFactor:function(){return[n,F]},getOptions:function(){return j},ui:{holder:AA,selection:a}};if(AD){AA.bind("selectstart",function(){return false})}y.data("Jcrop",I);return I};A.fn.Jcrop=function(B,D){var C;this.each(function(){if(A(this).data("Jcrop")){if(B==="api"){return A(this).data("Jcrop")}else{A(this).data("Jcrop").setOptions(B)}}else{if(this.tagName=="IMG"){A.Jcrop.Loader(this,function(){A(this).css({display:"block",visibility:"hidden"});C=A.Jcrop(this,B);if(A.isFunction(D)){D.call(C)}})}else{A(this).css({display:"block",visibility:"hidden"});C=A.Jcrop(this,B);if(A.isFunction(D)){D.call(C)}}}});return this};A.Jcrop.Loader=function(F,G,C){var D=A(F),B=D[0];function E(){if(B.complete){D.unbind(".jcloader");if(A.isFunction(G)){G.call(B)}}else{window.setTimeout(E,50)}}D.bind("load.jcloader",E).bind("error.jcloader",function(H){D.unbind(".jcloader");if(A.isFunction(C)){C.call(B)}});if(B.complete&&A.isFunction(G)){D.unbind(".jcloader");G.call(B)}};A.Jcrop.defaults={allowSelect:true,allowMove:true,allowResize:true,trackDocument:true,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:0.6,bgFade:false,borderOpacity:0.4,handleOpacity:0.5,handleSize:null,aspectRatio:0,keySupport:true,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:true,dragEdges:true,fixedSupport:true,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}}(jQuery));
// 为支持动态加载ckeditor依赖的js，需定义此变量，否则ckeditor无法定位
var CKEDITOR_BASEPATH =  _ctxPath + "/common/ckeditor/";
function FCKeditor_OnComplete( editorInstance ){
    $('#' + editorInstance.Name ).attr('editorReadyState','complete');
    $('#' + editorInstance.Name ).trigger('editorReady');
};


//前端事件拦截机制beforSendColl beforeSaveDraftColl dealRepeatChange fieldValueChange
var ctpEventIntercept = {};
function ctpEventType(eventName){
    if(eventName=='beforSendColl'){
        return ctpEventIntercept.ctpEventIntercept;
    }else if(eventName=='beforeSaveDraftColl'){
        return ctpEventIntercept.beforeSaveDraftColl;
    }else if(eventName=='dealRepeatChange'){
        return ctpEventIntercept.dealRepeatChange;
    }else if(eventName=='fieldValueChange'){
        return ctpEventIntercept.fieldValueChange;
    }else if(eventName=='beforeDealSubmit'){//提交方法
        return ctpEventIntercept.beforeDealSubmit;
    }else if(eventName=='beforeDealSaveWait'){//暂存待办
        return ctpEventIntercept.beforeDealSaveWait;
    }else if(eventName=='beforeDealCancel'){//流程撤销
        return ctpEventIntercept.beforeDealCancel;
    }else if(eventName=='beforeDealstepback'){//回退
        return ctpEventIntercept.beforeDealstepback;
    }else if(eventName=='beforeDealstepstop'){//终止
        return ctpEventIntercept.beforeDealstepstop;
    }else if(eventName=='beforeDealaddnode'){//加签
        return ctpEventIntercept.beforeDealaddnode;
    }else if(eventName=='beforeDealdeletenode'){//减签
        return ctpEventIntercept.beforeDealdeletenode;
    }else if(eventName=='beforeDealspecifiesReturn'){//指定回退
        return ctpEventIntercept.beforeDealspecifiesReturn;
    }else if(eventName=='beforeDoneTakeBack'){//协同已办列表取回
        return ctpEventIntercept.beforeDoneTakeBack;
    }else if(eventName=='beforeWaitSendDelete'){//协同待发列表删除
        return ctpEventIntercept.beforeWaitSendDelete;
    }else if(eventName=='beforeSentCancel'){//协同已发列表撤销
        return ctpEventIntercept.beforeSentCancel;
    }else{
        return ctpEventIntercept[eventName];
    }
}
function setCtpEvent(eventName,listeners){
    if(eventName=='beforSendColl'){
        ctpEventIntercept.ctpEventIntercept=listeners;
    }else if(eventName=='beforeSaveDraftColl'){
        ctpEventIntercept.beforeSaveDraftColl=listeners;
    }else if(eventName=='dealRepeatChange'){
        ctpEventIntercept.dealRepeatChange=listeners;
    }else if(eventName=='fieldValueChange'){
        ctpEventIntercept.fieldValueChange=listeners;
    }else if(eventName=='beforeDealSubmit'){//提交方法
        ctpEventIntercept.beforeDealSubmit=listeners;
    }else if(eventName=='beforeDealSaveWait'){//暂存待办
        ctpEventIntercept.beforeDealSaveWait=listeners;
    }else if(eventName=='beforeDealCancel'){//流程撤销
        ctpEventIntercept.beforeDealCancel=listeners;
    }else if(eventName=='beforeDealstepback'){//回退
        ctpEventIntercept.beforeDealstepback=listeners;
    }else if(eventName=='beforeDealstepstop'){//终止
        ctpEventIntercept.beforeDealstepstop=listeners;
    }else if(eventName=='beforeDealaddnode'){//加签
        ctpEventIntercept.beforeDealaddnode=listeners;
    }else if(eventName=='beforeDealdeletenode'){//减签
        ctpEventIntercept.beforeDealdeletenode=listeners;
    }else if(eventName=='beforeDealspecifiesReturn'){//指定回退
        ctpEventIntercept.beforeDealspecifiesReturn=listeners;
    }else if(eventName=='beforeDoneTakeBack'){//协同已办列表取回
        ctpEventIntercept.beforeDoneTakeBack=listeners;
    }else if(eventName=='beforeWaitSendDelete'){//协同待发列表删除
        ctpEventIntercept.beforeWaitSendDelete=listeners;
    }else if(eventName=='beforeSentCancel'){//协同已发列表撤销
        ctpEventIntercept.beforeSentCancel=listeners;
    }else{
        return ctpEventIntercept[eventName]=listeners;
    }
}
$.ctp={
    bind : function(eventName, func) {
        var ctpEventTypeInfo=ctpEventType(eventName);
        var listeners = ctpEventTypeInfo;
        if (!Boolean(listeners)) {
            listeners = [];
            listeners.push(func);
            setCtpEvent(eventName,listeners);
        } else {
            listeners.push(func);
        }
    },
    trigger : function(eventName,o) {
        var listeners = ctpEventType(eventName);
        if (Boolean(listeners)) {
            for (var i = 0; i < listeners.length; i++) {
                if (!listeners[i](o)) {
                    return false;
                }
            }
        } else {
            return true;
        }
        return true;
    }
};

(function($) {
    // 根据浏览器版本确定使用FckEditor还是CkEditor
    var useFckEditor = false;//$.browser.msie  && (parseInt($.browser.version, 10)<7);

    $.messageBox = function(options) {
        return new MxtMsgBox(options);
    };

    $.alert = function(msg) {
        var options = null;
        if(typeof(msg) == "object"){
            options = msg;
        }
        options = options == null ? {} : options;
        options.title = options.title ? options.title : $.i18n('system.prompt.js');
        options.type = options.type ? options.type : 0;
        options.imgType = options.imgType ? options.imgType : 2;
        options.close_fn = options.close_fn ? options.close_fn : null;
        if (typeof(msg) != "object") {
            options.msg = msg;
        }
        return new MxtMsgBox(options);
    };
    $.infor = function(msg) {
        var options = null;
        if(typeof(msg) == "object"){
            options = msg;
        }
        var options = options == undefined ? {} : options;
        options.title = $.i18n('system.prompt.js');
        options.type = 0;
        if (typeof(msg) != "object") {
            options.msg = msg;
        }
        options.imgType = options.imgType ? options.imgType : 0;
        options.close_fn = options.close_fn ? options.close_fn : null;
        return new MxtMsgBox(options);
    };
    $.confirm = function(options) {
        var options = options == undefined ? {} : options;
        options.title = options.title ? options.title : $.i18n('system.prompt.js');
        options.type = 1;
        options.imgType = options.imgType ? options.imgType : 4;
        options.close_fn = options.close_fn ? options.close_fn : null;
        return new MxtMsgBox(options);
    };
    /**
     * $.success = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "成功"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 0; options.msg = msg; return new MxtMsgBox(options); };
     * $.warning = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "警告"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 2; options.msg = msg; return new MxtMsgBox(options); };
     */
    $.error = function(msg) {
        var options = null;
        if(typeof(msg) == "object"){
            options = msg;
        }
        var options = options == undefined ? {} : options;
        options.title = options.title ? options.title : $.i18n('system.prompt.js');
        options.type = options.type ? options.type : 0;
        options.imgType = options.imgType ? options.imgType : 1;
        options.close_fn = options.close_fn ? options.close_fn : null;
        if (typeof(msg) != "object") {
            options.msg = msg;
        }
        return new MxtMsgBox(options);
    };
    $.gc = function(){
        if (typeof(CollectGarbage) == "function") {
            CollectGarbage();//适用于IE
        }
    };
    // avoid IE memory leak
    $.releaseContext = function(){
        function releaseObject(o){
            if(typeof o !== 'undefined'){
                for ( var prop in o ) {
                    try {
                        if(typeof o[prop] == 'object' && (o[prop]!=null)){
                            releaseObject(o[prop]);
                        }
                        o[prop] = null;
                    } catch(e) {}
                }
            }
        }
        try {
            if($ && $.ctx)releaseObject($.ctx);
            releaseObject(v3x);
            releaseObject(MainLang);
            releaseObject(CTPLang);
            releaseObject(sectionHandler);
            $('iframe').each(function(){
                var w = this.contentWindow;
                releaseObject(w.sectionHandler);
                releaseObject(w.MainLang);
                releaseObject(w.CTPLang);
                releaseObject(w.v3x);
                if(w.$ && w.$.ctx)releaseObject(w.$.ctx);
                this.src = 'about:blank';
            });
        } catch(e) {}
    };
    $.releaseOnunload = function(){

        // Prevent memory leaks in IE
        // Window isn't included so as not to unbind existing unload events
        // More info:
        //  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
        // try{
        /*    if ( window.attachEvent || window.addEventListener ) {
         function releaseAll(){
         $.releaseContext();
         }
         if(window.attachEvent)window.attachEvent("onunload",releaseAll );
         if(window.addEventListener)window.addEventListener("onunload", releaseAll);
         }*/
        if($.browser.msie){
            $(window).bind('unload',  function () {
                $.releaseContext();
            });
        }
        $( window ).unload(function() {
            for (var id in jQuery.cache) {
                if (jQuery.cache[id].handle) {
                    try { jQuery.event.remove(jQuery.cache[id].handle.elem); } catch (e) { };
                }
                delete jQuery.cache[id];
            }
        });
    }
    $.globalCache = function(key,value){
        var storage = window.sessionStorage;
        if(typeof storage !== 'undefined' && storage !== null && (typeof JSON !== 'undefined')){
            if(typeof value !== 'undefined'){
                storage.setItem(key,JSON.stringify(value));
                return;
            }
            var cachedItem = storage.getItem(key)
            if(cachedItem !=undefined){
                return JSON.parse(cachedItem);
            }
            return undefined;
        }
    }

    $.progressBar = function(options) {
        if (options == undefined) {
            options = {}
        }
        return new MxtProgressBar(options)
    }
    $.dialog = function(options) {
        // return new MxtDialog(options);
        var optionsTargetWindow = options.targetWindow;
        if(!options.targetWindow){//targetWindow未定义的情况下取getCtpTop()，建议必须定义
            optionsTargetWindow = getCtpTop();
        }

        //dialog存在复制dom---存在所在window复制targetWindow显示与只在所在window复制与显示两种情况
        if(!(options.url)&&!(options.type) && options.htmlId){
            if(!options.targetWindow){//只在所在window复制与显示
                optionsTargetWindow = window;
                options.contentCopyWindow = window;//复制dom的情况增加参数记录dom所在的window
            }else{//所在window复制targetWindow显示
                options.contentCopyWindow = window;
            }
        }
        //panel复制dom---只在所在window复制与显示
        if(options.type == "panel" && options.htmlId){
            optionsTargetWindow = window;
            options.contentCopyWindow = window;
        }
        if(options.type == "panel" && options.targetId && options.url){
            optionsTargetWindow = window;
            options.contentCopyWindow = window;
        }
        if(options.type == "panel" && options.targetId && options.html){
            optionsTargetWindow = window;
            options.contentCopyWindow = window;
        }
        //赋值为正确的targetWindow
        options.targetWindow = optionsTargetWindow;

        if(typeof(getCtpTop().isVJTop) != "undefined" && getCtpTop().isVJTop != null){
            getCtpTop().vjOpenDialog(options);
        }else{
            if(options.targetWindow.layer){
                return options.targetWindow.layer.open(options);//调用相应窗口的layer，由于layer是全局定义，每个window的layer都是独立的
            }else{
                return window.layer.open(options);
            }
        }
    };
    $.PeopleCard = function (options) {
        insertScriptP();
        return PeopleCard(options);
    }
    $.PeopleCardMini = function (options) {
        //flash people card
        var _options = insertScript(options);
        return new PeopleCardMini_flash(_options);
    }
    $.fn.PeopleCardMini = function (options) {
        var _options = insertScript(options);
        return new PeopleCardMini(_options, this);
    }
    $.metadata = function(data) {
        function Metadata(data) {
            this.data = data;
            function getColumnByProperty(tableName, columnName, propertyName) {
                var table = data[tableName];
                var columns = table['columns'];
                if (columns != null) {
                    for ( var i = 0; i < columns.length; i++) {
                        if (columns[i][propertyName] == columnName)
                            return columns[i];
                    }
                }
                return null;
            }
            /**
             * 按表名称和字段名称取字段实体。
             */
            this.getColumn = function(tableName, columnName) {
                return getColumnByProperty(tableName, columnName, 'name');
            };
            this.getColumnByAlias = function(tableName, columnName) {
                return getColumnByProperty(tableName, columnName, 'alias');
            };
            this.getColumns = function(tableName) {
                var table = data[tableName];
                return table['columns'];
            };
        }
        ;
        return new Metadata(data);
    };
    $.renderMetadata = function() {

    }
    /**
     * 按metadata数据渲染组件。
     */
    $.metadataForm = function(container, tableName, options) {
        // var manager = new metadataManager();
        // var data = manager.toJSON();
        var data = serverMetadata;

        var html = [];

        function buildControl(column) {
            var component = column.component;
            if (component == 'codecfg') {
                return buildCodeCfg(column);
            }
            var compHtml = '';
            var validation = '';
            var rule = column.rule;
            if (component != null) {
                rule = rule == null ? '' : ',' + rule;
                compHtml = ' class="comp" comp="type:' + "'" + component + "'" + rule
                    + '"';
            } else if (rule != null) {
                // component的rule是comp的补充，否则为校验规则
                validation = ' class="validate" validate="' + rule + '"';
            }
            return '<input type="text" ' + buildIdNameHtml(column.name) + compHtml
                + validation + '/>';
        }
        function buildIdNameHtml(name) {
            var nameHtml = 'name="' + name + '"';
            var idHtml = ' id="' + name + '"';
            return idHtml + nameHtml;
        }
        function buildCodeCfg(column) {
            var compHtml = '';
            var rule = column.rule;

            rule = rule == null ? '' : rule;
            compHtml = ' class="codecfg" codecfg="' + rule + '"';

            return '<select ' + buildIdNameHtml(column.name) + compHtml
                + '><option value="">' + $.i18n('pleaseSelect')
                + '...</option></select>';
        }
        ;
        var columns = options ? options.columns : null;

        var position = options ? options.position : 'in';
        var metadata = $.metadata(data);
        var allColumns = [];
        if (columns) {
            $.each(columns, function(i, name) {
                var column = metadata.getColumnByAlias(tableName, name);
                if (column) {
                    allColumns.push(column);
                } else {
                    column = metadata.getColumn(tableName, name);
                    if (column)
                        allColumns.push(column);
                }
            });
        } else {
            allColumns = metadata.getColumns(tableName);
        }
        $.each(allColumns, function(i, column) {
            var label = column.label;
            var input = buildControl(column);
            html
                .push('<tr><th nowrap="nowrap"><label class="margin_r_10" for="'
                    + column.name + '">' + label + ':</label></th>'
                    + '<td><div class="common_txtbox_wrap">' + input
                    + '</div></td></tr>');
        });
        if (position == 'after') {
            $(container).after(html.join(''));
        } else if (position == 'before') {
            $(container).before(html.join(''));
        } else {
            $(container).html(html.join(''));
        }
    };
    /**
     * 面包屑：当前位置
     */
    function showBreadcrumb(div, options) {
        var code = options.code;
        var type = options.type;
        var suffix = options.suffix;
        function showLocation(html){
            var top = getA8Top();
            if(top){
                //首页显示当前位置
                top.showLocation(html);
            }else{
                div.addClass('common_crumbs');
                div.html(html);
            }
        }
        if(options.html){
            showLocation(html);
        }
        function buildResourceMenuMap(menus, parentMenu, map) {
            for ( var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                menu.parentMenu = parentMenu;
                var resourceCode = menu.resourceCode;
                if (resourceCode != null) {
                    map[resourceCode] = menu;
                }
                if (menu.items) {
                    buildResourceMenuMap(menu.items, menu, map);
                }
            }
            ;
        }
        ;
        function findMenu(code) {
            var ctpTop = getCtpTop ? getCtpTop() : parent ;
            if (ctpTop) {
                var allmenu = $(ctpTop.memberMenus);
                if (allmenu) {
                    var cacheKey = 'resourceMenuCache';
                    var cache = ctpTop.$.data(ctpTop.document.body, cacheKey);
                    if (cache == undefined) {
                        cache = new Array();
                        buildResourceMenuMap(allmenu, null, cache);
                        ctpTop.$.data(ctpTop.document.body, cacheKey, cache);
                    }
                    ;
                    var result = [];
                    var menu = cache[code];
                    if (menu != undefined) {
                        while (menu != null) {
                            result.push(menu);
                            menu = menu.parentMenu;
                        }
                        ;
                    }
                    ;
                    return result.reverse();
                }
                ;
            }
            ;
            return [];
        }
        ;
        var menus = findMenu(code);
        if (menus.length > 0) {
            //$.i18n('seeyon.top.nowLocation.label')
            var icon = getCtpTop().currentSpaceType || "personal";
            var skinPathKey = getCtpTop().skinPathKey || "defaultV51";
            var html = '<span class="nowLocation_ico"><img src="'+_ctxPath+'/main/skin/frame/'+skinPathKey+'/menuIcon/'+icon+'.png"></span>';
            html += '<span class="nowLocation_content">';
            var items = [];
            for ( var i = 0; i < menus.length; i++) {
                if(menus[i].url){
                    items.push('<a class="hand" onclick="showMenu(\'' + _ctxPath+menus[i].url + '\')">' + escapeStringToHTML(menus[i].name,false) + '</a>');
                }else{
                    items.push('<a style="cursor:default" >' + escapeStringToHTML(menus[i].name,false) + '</a>');
                }
            }
            ;
            html += items
                .join(' > ');
            if(suffix){
                html += ' > ' + suffix;
            }
            html += '</span>';
            showLocation(html);
        }
    }
    ;
    $.fn.tooltip = function(options) {
        return ___tooltip(options, 1, $(this));
    };
    $.tooltip = function(options) {
        return ___tooltip(options, 0);
    };
    function ___tooltip(options, n, obj) {
        // n用来区分不同方法,1:$.fn.tooltip 和 0: $.tooltip
        var options = options;
        var mtt;
        if (n == 1) {
            var _targetId = obj.attr("id").replace("#", "");
            $.extend(options, { event: true, targetId: _targetId });
            mtt = new MxtToolTip(options);
            obj.mouseenter(function () {
                mtt.setPoint(null,null);
                mtt.show();
            }).mouseleave(function() {
                mtt.hide();
            });
        } else {
            mtt = new MxtToolTip(options);
        }
        return mtt;
    }
    var layoutIdx = 1;
    $.fn.layout = function() {
        var t = $(this), lo = t.attrObj("_layout");
        if (lo)
            return lo;
        var i = layoutIdx, id = t[0].id, nor = $("#" + id + " > .layout_north"), ea = $("#"
            + id + " > .layout_east"), we = $("#" + id + " > .layout_west"), sou = $("#"
            + id + " > .layout_south"), cen = $("#" + id + " > .layout_center"), cfg = {
            id : id
        }, co, cs, cl;

        nor.each(function() {
            this.id = this.id ? this.id : ("north" + i);
            co = {
                id : this.id
            };
            cl = $(this).attr("layout");
            cs = cl ? $.parseJSON("{" + cl + "}") : {};
            co = $.extend(co, cs);
            cfg.northArea = co;
        });

        ea.each(function() {
            this.id = this.id ? this.id : ("east" + i);
            co = {
                id : this.id
            };
            cl = $(this).attr("layout");
            cs = cl ? $.parseJSON("{" + cl + "}") : {};
            co = $.extend(co, cs);
            cfg.eastArea = co;
        });

        we.each(function() {
            this.id = this.id ? this.id : ("west" + i);
            co = {
                id : this.id
            };
            cl = $(this).attr("layout");
            cs = cl ? $.parseJSON("{" + cl + "}") : {};
            co = $.extend(co, cs);
            cfg.westArea = co;
        });

        sou.each(function() {
            this.id = this.id ? this.id : ("south" + i);
            co = {
                id : this.id
            };
            cl = $(this).attr("layout");
            cs = cl ? $.parseJSON("{" + cl + "}") : {};
            co = $.extend(co, cs);
            cfg.southArea = co;
        });

        cen.each(function() {
            this.id = this.id ? this.id : ("center" + i);
            co = {
                id : this.id
            };
            cl = $(this).attr("layout");
            cs = cl ? $.parseJSON("{" + cl + "}") : {};
            co = $.extend(co, cs);
            cfg.centerArea = co;
        });
        t.attrObj("_layout", new MxtLayout(cfg));
        layoutIdx++;
    };
    $.fn.compThis = function(options) {
        var t = this;
        if (t.attrObj("_comp"))
            t = t.attrObj("_comp");
        var tc = t.attr("comp"), tj, tp;
        if (tc) {
            tj = $.parseJSON('{' + tc + '}');
            if (options) {
                tj = $.extend(tj, options);
                var com = $.toJSON(tj);
                t.attr("comp", com.substring(1, com.length - 1));
            }
            tp = tj.type;
            t.attr('compType', tp);
            switch (tp) {
                case 'onlyNumber':{
                    t.onlyNumber(tj);
                    break;
                }
                case 'calendar':
                    t.calendar(tj);
                    break;
                case 'layout':
                    t.layout();
                    break;
                case 'tab':
                    t.tab(tj);
                    break;
                case 'fileupload':
                    // TODO 新框架转旧框架附件解析出错，无法处理
                    try{
                        initFileUpload(t, tj);
                    }catch(e){
                    }
                    break;
                case 'attachlist':
                    fileList(t);
                    break;
                case 'showattachlist':
                    showFileList(t, tj);
                    break;
                case 'assdoc':
                    assdoc(t, tj);
                    break;
                case 'selectPeople':
                    tj.srcElement = t;
                    t.selectPeople(tj);
                    break;
                case 'barCode':
                    t.barCode(tj);
                    break;
                case 'editor':
                    t.showEditor(tj);
                    break;
                case 'tooltip':
                    t.tooltip(tj);
                    break;
                case 'slider':
                    var _temp = $("<div id='"+t.attr('id')+"'></div>");
                    t.replaceWith(_temp);
                    t = _temp;
                    t.slider(tj);
                    break;
                case 'workflowEdit':
                    var cu = $.ctx.CurrentUser;
                    if (tj.isTemplate) {//模板流程：协同、表单、公文等
                        if (tj.isView) {
                            t.click(function() {
                                showWFTDiagram(getCtpTop(), tj.workflowId, window,cu.name,cu.loginAccountName);
                            });
                        } else {
                            t.click(function() {
                                createWFTemplate(
                                    getCtpTop(),
                                    tj.moduleType,
                                    tj.formApp, //非表单模板，请传-1
                                    tj.formId,//非表单模板，请传-1
                                    tj.workflowId,
                                    window,
                                    tj.defaultPolicyId,//默认节点权限
                                    cu.id,
                                    cu.name,
                                    cu.loginAccountName,
                                    tj.flowPermAccountId,
                                    tj.operationName,//非表单模板，请传-1
                                    tj.startOperationName,//非表单模板，请传-1
                                    tj.defaultPolicyName
                                );
                            });
                        }
                    } else {//非模板流程
                        if (tj.isView) {
                            t.click(function() {
                                showWFCDiagram(getCtpTop(),tj.caseId,tj.workflowId,false,false,null,null,"collaboration");
                            });
                        }else{
                            t.click(function() {
                                    createWFPersonal(
                                        getCtpTop(),
                                        tj.moduleType,
                                        cu.id,
                                        cu.name,
                                        cu.loginAccountName,
                                        tj.workflowId,
                                        window,
                                        tj.defaultPolicyId,
                                        cu.loginAccount,
                                        tj.defaultPolicyName
                                    );
                                }
                            );
                        }
                    }
                    break;
                case 'correlation_form':
                    showInput(t, tp, tj);
                    break;
                case 'affix':
                    showInput(t, tp, tj);
                    break;
                case 'associated_document':
                    showInput(t, tp, tj);
                    break;
                case 'insert_pic':
                    showInput(t, tp, tj);
                    break;
                case 'correlation_project':
                    showInput(t, tp, tj);
                    break;
                case 'data_task':
                    showInput(t, tp, tj);
                    break;
                case 'search':
                    showInput(t, tp, tj);
                    break;
                case 'breadcrumb':
                    if(!tj.code) {
                        tj.code = _resourceCode;
                    }
                    showBreadcrumb(t, tj);
                    break;
                case 'autocomplete':
                    if(t.autocomplete)t.autocomplete(tj);
                    break;
                // 封装一切的List选择
                case 'select':
                    // 下拉方式选择
                    if(tj.mode == 'dropdown'){
                        if(t.imageDropdown){
                            return t.imageDropdown(tj);
                        }
                    }
                    break;
                case 'office':
                    t.showOffice(tj);
                    break;
                case 'PeopleCardMini':
                    t.PeopleCardMini(tj);
                    break;
                case 'htmlSignature':
                    t.htmlSignature(t,tj);
                    break;
                case 'chooseProject':
                    t.chooseProject(tj);
                    break;
                case 'map':
                    if(t.initMap){
                        t.initMap(tj);
                    }
                    break;
                case 'fastSelect':
                    tj.srcElement = t;
                    t.fastSelect(tj);
                    break;
            }
        }
    };
    $.fn.comp = function(options) {
        $(".comp", this).add(this).each(function(i) {
            $(this).compThis(options);
        });
    };
    $.fn.chooseProject = function(jsonObj) {
        var input = $(this);
        var width = input.width();
        var id = input.attr("id");
        input.attr("id",id+"_txt");
        input.attr("name",id+"_txt");
        var htmlStr = $("<input id='"+id+"' name='"+id+"' type='hidden'/>");
        if(typeof(jsonObj.text)!='undefined'){
            input.val(jsonObj.text);
            input.attr("title",jsonObj.text);
        }
        if(typeof(jsonObj.value)!='undefined'){
            htmlStr.val(jsonObj.value);
        }
        input.before(htmlStr);
        var spanStr=$("<span class='ico16 correlation_project_16'></span>");
        input.after(spanStr);
        if(jsonObj.okCallback!=undefined){
            input.blur(function(){
                jsonObj.okCallback(spanStr);
            })
        }
        if(htmlStr.height()!=0){
            input.height(htmlStr.height());
        }
        width = width-spanStr.outerWidth(true)-8;
        if(width>0){
            input.width(width);
        }else{
            //IE7 下input.width()可能为0,只能延时后再获取。
            setTimeout(function(){
                width=input.width()-spanStr.outerWidth(true)-8;
                input.width(width);
            },300);
        }

        spanStr.unbind("click").bind("click",function(){
            var selectId = input.prev().val();
            var resetCallback = jsonObj.resetCallback;
            var OkCallback = jsonObj.okCallback;
            var chooseProjectdialog = $.dialog({
            	id:"projectSelectDialog",
                url : _ctxPath+"/project/project.do?method=projectSelect",
                title : $.i18n('form.base.relationProject.title'),
                width : 700,
                height : 450,
                targetWindow : getCtpTop(),
                transParams: {
	    	    	projectRole: "0,1,2,3,4,5",
	    	    	projectState: "0,1,2", //开始、进行中、已结束 OA-117201	
	    	    	projectId: selectId
	    	    },
                buttons : [ {
                    text : $.i18n('common.button.reset.label'),
                    handler : function() {
                        input.val("");
                        input.prev().val("");
                        if(resetCallback!=undefined){
                            resetCallback(spanStr);
                        }
                        chooseProjectdialog.close();
                    }
                }, {
                    text : $.i18n('common.button.ok.label'),
                    isEmphasize:true,
                    handler : function() {
                        var retObj = chooseProjectdialog.getReturnValue();
                        if(retObj == false){
                            $.alert($.i18n('form.base.relationProject.chooseItem'));
                            return;
                        }else{
                            input.val(retObj.projectName);
                            input.attr("title",retObj.projectName);
                            input.prev().val(retObj.projectId);
                            if(OkCallback!=undefined){
                                OkCallback(spanStr);
                            }
                            chooseProjectdialog.close();
                        }
                    }
                }, {
                    text : $.i18n('common.button.cancel.label'),
                    handler : function() {
                        chooseProjectdialog.close();
                    }
                }]
            });
        });
    };
    $.fn.showEditor = function(options) {
        var input = $(this);
        if (options.contentType == 'html') {
            var contextPath = _ctxPath;
            var settings = $.extend({}, {
                toolbarSet : 'Basic',
                category : '1',
                maxSize : 1048576,
                autoResize : true,
                showToolbar : true,
                height : "100%"
            }, options);
            input.attr('editorReadyState','loading');
            $.ajaxSetup({
                cache: true
            });
            if(useFckEditor){
                $.getScript(contextPath + "/common/RTE/fckeditor.js", function() {
                    var sBasePath = contextPath + "/common/RTE/";

                    var oFCKeditor = new FCKeditor(input[0].id);
                    oFCKeditor.BasePath = sBasePath;
                    oFCKeditor.Config["DefaultLanguage"] = _locale.replace('_', '-')
                        .toLowerCase();
                    oFCKeditor.ToolbarSet = settings.toolbarSet;

                    oFCKeditor.Config["ImageUploadURL"] = contextPath
                        + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                        + settings.category + '&extensions=jpg,gif,jpeg,png&maxSize='
                        + settings.maxSize;
                    oFCKeditor.Config["FlashUploadURL"] = contextPath
                        + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                        + settings.category + '&extensions=swf,fla&maxSize='
                        + settings.maxSize;
                    oFCKeditor.Config["ImageUploadMaxFileSize"] = "1M";
                    oFCKeditor.ReplaceTextarea();
                });
            }else{
                var path = "/common/ckeditor";
                var bv = parseInt($.browser.version, 10);
                var ua = navigator.userAgent;
                var isIe = $.browser.msie;
                //var edge = ua.indexOf('Edge/');
                var useHighVersion;
                var hasImportWrongVersion = false;
                if(typeof useHighVersionEditor !== 'undefined'){
                    useHighVersion = useHighVersionEditor;
                    // 引用了低版本的Ckeditor，前端UA判断却是以高版本渲染，需要纠正（for 360）
                    if(!useHighVersionEditor && !(isIe && (bv<9))){
                        hasImportWrongVersion = true;
                        useHighVersion = true;
                    }
                }else{
                    useHighVersion = !(isIe && (bv<9));
                }



                if(useHighVersion){
                    path = path + "45";
                    CKEDITOR_BASEPATH = CKEDITOR_BASEPATH.replace('ckeditor','ckeditor45');
                }

                function initEditor(){
                    CKEDITOR.basePath = contextPath + path + '/';
                    CKEDITOR.baseHref = CKEDITOR.basePath;
                    if (CKEDITOR.instances[input[0].id]) {
                        CKEDITOR.instances[input[0].id].destroy();
                    }
                    var ckeContentHeight = $(input[0]).height();
                    // 页面定义了editorStartupFocus变量，则以之控制编辑器是否设置焦点
                    var f = (typeof(editorStartupFocus) == 'undefined') ? false : editorStartupFocus;
                    if(!settings.showToolbar){
                        $(input[0]).parent().hide();
                    }

                    //协同处理页面设置字体为12px
                    if(settings.defaultStyle){
                        CKEDITOR.addCss(settings.defaultStyle);
                    }

                    CKEDITOR.replace(input[0].id,{
                        height : settings.height,
                        startupFocus : f,
                        toolbar : settings.toolbarSet,
                        on : {
                            instanceReady : function( ev ) {
                                var editor = CKEDITOR.instances[input.attr('id')];
                                input.attr('editorReadyState','complete');
                                input.trigger('editorReady',ev);
                                if(ckeContentHeight != 0){
                                    editor.document.getBody().setStyle('height',ckeContentHeight-10+"px");
                                }
                                if($.browser.mozilla && editor.document.getBody().getHtml() == "<p><br></p>"){
                                    editor.document.getBody().setHtml('<p><br type="_moz"></p>');
                                }
                                if(!settings.showToolbar){
                                    $('#'+ev.editor.id+'_top').hide();
                                    $(input[0]).parent().show();
                                }
                                //oa-128594 增加一层控制隐藏和显示的防护
                                if(settings.toolbarSet == "VerySimple" && !($.parseJSON('{' + $(input[0]).attr("comp") + '}').showToolbar)){
                                    $('#'+ev.editor.id+'_top').hide();
                                    $(input[0]).parent().show();
                                }
                                function resizeEditor(){
                                    var editor = CKEDITOR.instances[input.attr('id')];
                                    //OA-22421 修复正文由html切换到office时的resize事件空值异常
                                    var cts = editor.ui.space( 'contents' );
                                    if(cts) {
                                        var height = document.body.clientHeight - $(cts.$).offset().top;
                                        height = height<0 ? 0 : height;
                                        try {
                                            if(_fckEditorDecentHeight) {
                                                height -= 20;
                                            }
                                        }catch(e){}
                                        cts.setStyle( 'height', height +'px' );
                                        // 解决chrome resize时正文区域变宽问题
                                        var iframe = editor.window.getFrame();
                                        if(iframe.$.style.width != '786px'){
                                            iframe.$.style.width = '786px';
                                        }
                                    }
                                    //90723 89605(yinr)   OA-97328
                                    // if(!isIe){   都需要垂直居中加背景色
                                    editor.window.getFrame().$.style.display = "block";
                                    editor.window.getFrame().$.style.margin = "auto";
                                    editor.window.getFrame().$.parentNode.style.marginTop = "0px";
                                    var $iframenParentHeight = editor.window.getFrame().$.parentNode.offsetHeight;
                                    editor.window.getFrame().$.parentNode.style.backgroundColor = "#d8d9db";
                                    // }
                                }
                                if(settings.autoResize){
                                    resizeEditor();
                                    window.onresize = function(event) {
                                        resizeEditor();
                                    }
                                    $(input[0]).parent().resize(function(){
                                        resizeEditor();
                                    });
                                }else{
                                    var cts = editor.ui.space( 'contents' );
                                    cts.setStyle( 'height', settings.height );
                                }
                                if(settings.toolbarSet == 'VerySimple'){
                                    editor.document.getBody().setStyle('padding',0);
                                    editor.document.getBody().setStyle('margin','5px 0 0 0');
                                    var iframe = editor.window.getFrame();
                                    iframe.$.style.width = $(input[0]).width() + "px";
                                }
                                // 为了避免onbeforeunload弹出提示，必须对a作特殊处理
                                if(v3x && v3x.isMSIE){
                                    ev.editor.on('dialogShow',
                                        function(dialogShowEvent){
                                            var allHref = dialogShowEvent.data._.element.$.getElementsByTagName('a');
                                            for (var i = 0; i < allHref.length; i++) {
                                                var href = allHref[i].getAttribute('href');
                                                if(href && href.indexOf('void(0)')>-1){
                                                    allHref[i].removeAttribute('href');
                                                }
                                            };

                                        });
                                }
                            }
                        }
                    });
                }

                if(!hasImportWrongVersion){
                    initEditor();
                }else{
                    // 重新加载正确版本的ckeditor
                    CKEDITOR = null;
                    $.getScript(contextPath + path + '/ckeditor.js', function() {
                        initEditor();
                    })
                }
            }
            $.ajaxSetup({
                cache: false
            });
        }
    };
    /**
     * 取得编辑器的内容。
     */
    $.fn.getEditorContent = function(options) {
        var input = $(this);
        var tc = input.attr('comp');
        if (tc) {
            var tj = $.parseJSON('{' + tc + '}')
            if (tj.type == 'editor' && tj.contentType == 'html') {
                if(useFckEditor){
                    return FCKeditorAPI.GetInstance(this.attr('id')).GetHTML();
                }else{
                    var data = CKEDITOR.instances[this.attr('id')].getData();
                    // 替换&#8203和\t\n
                    return data.replace(/\u200B/g,'').replace(/\n/g,'').replace(/\t/g,'');
                }
            }
        }
        return null;
    }
    /**
     * 取得编辑器的文本内容，保留\r\n。
     */
    $.fn.getEditorText = function(options) {
        var input = $(this), retstr="";
        var tc = input.attr('comp');
        if (tc) {
            var tj = $.parseJSON('{' + tc + '}')
            if (tj.type == 'editor' && tj.contentType == 'html') {
                if(useFckEditor){
                    return 'not supported yet';
                }else{
                    var $body = CKEDITOR.instances[this.attr('id')].document.$.body;
                    if($.browser.mozilla && ($.browser.version).substring(0,2)<45){
                        retstr = $body.textContent;
                    }else{
                        if(tj.toolbarSet == "VerySimple"){
                            
                            // if($("#VerySimple_tempHtml").length){//存在就直接赋值
                            //     var tempHtmlId = document.getElementById("VerySimple_tempHtml");
                            //     tempHtmlId.innerHTML = $body.innerHTML;
                            // }else{
                            //创建一个临时的div
                            var tempHtml = document.createElement("div");
                            tempHtml.id = "VerySimple_tempHtml";
                            tempHtml.innerHTML = $body.innerHTML;
                            input.append(tempHtml);
                            var tempHtmlId = document.getElementById("VerySimple_tempHtml");
                            // }                           
                            
                            if(($.browser.msie && (parseInt($.browser.version, 10)==9)) || ($.browser.msie && (parseInt($.browser.version, 10)==10))){//IE9、IE10
                                tempHtmlId.innerHTML  = tempHtmlId.innerHTML.replace(/<p>/g,"").replace(/<\/p>/g,"<br>");
                                retstr = tempHtmlId.innerText;
                            }else if($.browser.msie && (parseInt($.browser.version, 10)>10)){//IE11
                                tempHtmlId.innerHTML  = tempHtmlId.innerHTML.replace(/<p>/g,"").replace(/<\/p>/g,"");
                                retstr = tempHtmlId.innerText;
                            }else if($.browser.mozilla){//firefox45以上的版本
                                //直接修改，避免双倍换行的bug，这里绕不过，我也不想修改。。。。
                                $body.innerHTML = $body.innerHTML.replace(/<p>/g,"").replace(/<\/p>/g,"").replace(/<br><\/li>/g,"<\/li>");
                                retstr = $body.innerText;
                            }else{//ie8 和其他浏览器
                                retstr = $body.innerText;
                            }
                            //清除掉临时div
                            $(tempHtmlId).remove();
                        }else{
                            retstr = $body.innerText;
                        }
                    }

                    //对已知的特殊字符进行替换
                    retstr = retstr.replace(/\u00A0/g, " ");//空格
                    retstr = retstr.replace(/\ufeff/g, "");//IE8下面复制粘贴特殊字符
                    retstr = retstr.replace(/\u200b/g, "");//8203特殊字符
                    return retstr;
                }
            }
        }
        return null;
    }
    $.fn.toggleEditorToolbar = function(options) {
        var editor = CKEDITOR.instances[this.attr('id')];
        if(editor){
            if(options.hide){
                $('#'+editor.id+'_top').hide();
            }else{
                $('#'+editor.id+'_top').show();
            }
        }
    }
    function setCkEditorData(name,value){
        if(this.CKEDITOR){
            var editor = CKEDITOR.instances[name];
            editor.setData(value);
        }
        $('#'+name).bind('editorReady',function(){
            var editor = CKEDITOR.instances[name];
            editor.setData(value);
        });
    }
    $.fn.setEditorContent = function(value) {
        var input = $(this);
        var tc = input.attr('comp');
        if (tc) {
            var tj = $.parseJSON('{' + tc + '}')
            if (tj.type == 'editor' && tj.contentType == 'html') {
                if(useFckEditor){
                    FCKeditorAPI.GetInstance(this.attr('id')).SetHTML(value);
                }else{
                    setCkEditorData(this.attr('id'),value);
                }
                return null;
            }
        }
        if (input.val)
            input.val(value);
        return null;
    }
    $.fn.insertEditorContent = function(value) {
        var input = $(this);
        var tc = input.attr('comp');
        if (tc) {
            var tj = $.parseJSON('{' + tc + '}')
            if (tj.type == 'editor' && tj.contentType == 'html') {
                var editor = CKEDITOR.instances[this.attr('id')];
                editor.insertHtml(value);
                return null;
            }
        }
        return null;
    }
    $.fn.selectPeople = function(options) {
        var input = $(this), id = input.attr('id'), inited = input.attr('_inited'), delSize = 28;
        var valueInputName = id, valueInput, btp, btcl, bth, btn, showbtn = options.showBtn != undefined ? options.showBtn
            : false;
        if (inited) {
            valueInput = input.next();
            valueInputName = valueInput.attr("id");
            btp = valueInput.next(), btcl = btp.attrObj("tmpclone"), bth = btp
                .attr("_hide");
            btp.remove();
            valueInput.remove();
        } else {
            input.attr('id', id + '_txt');
            input.attr('name', id + '_txt');
            input.attr('readonly', 'readonly');
            if (showbtn&&!options.extendWidth&&input.width()!=0)
                input.width(input.width() - delSize);
            input.attr('_inited', 1);
        }
        
        valueInput = $('<input type="hidden" />');
        valueInput.attr('id', valueInputName);
        valueInput.attr('name', valueInputName);
        valueInput.attrObj('_comp', input);
        if(options.value){
            valueInput.val(options.value);
        }
        input.after(valueInput);
        if(options.valueChange){
            valueInput.change(options.valueChange(valueInput));
        }
        if (showbtn) {
            var multiSelect = !(options.maxSize===1)||(input[0].tagName&&input[0].tagName.toLowerCase()=='textarea');
            var selectTypes = {'Account' : 'account',
                'Department' : 'dept',
                'Team' : 'team',
                'Post' : 'post',
                'Level' : 'level',
                'Member' : 'people'
            };
            var selectType = selectTypes[options.selectType];
            selectType = selectType ? selectType : 'people';
            btn = $('<span></span>');
            input.attrObj("_rel", btn);// for enable/disable using
            btn.attr('_isrel', 1);
            btn.attr('class', 'ico16 '+ (multiSelect?'check':'radio')  +'_'+selectType+'_16');
            btn.addClass('_autoBtn');

            if (btcl)
                btn.attrObj('tmpclone', btcl);
            if (bth == 1)
                btn.hide();
            valueInput.after(btn);
        } else {
            btn = input;
            btn.css("cursor", "pointer");
        }
        //继承原有input的宽度
        if(options.extendWidth){
            if(!$.browser.msie || ($.browser.msie && (parseInt($.browser.version, 10)>=9))){//非ie ie9 ie10
                var oldDisp = valueInput.css("display");
                valueInput.css("display","block");
                if(valueInput.css("width").indexOf("%")!=-1){
                    input.css("width",valueInput.css("width"));
                }else{
                    if(valueInput.width()>0){
                        input.width(valueInput.width());
                    }
                }
                valueInput.css("display",oldDisp);
            }else{
                var temptag = false;
                if(input.width()<=0){
                    input.css("width","100%");
                    temptag = true;
                }
                if(input.width()<=0){
                    input.css("width","100");
                    temptag = true;
                }
            }
            if (showbtn){
                var w = 0;
                if($.browser.msie && $.browser.version=='7.0'){
                    w = input.width()*2-input.outerWidth(true)-btn.outerWidth(true)-15;
                }else{
                    w = input.width()*2-input.outerWidth(true)-btn.outerWidth(true)-2;
                }
                if(w>0){
                    input.width(w);
                }
            }
        }

        //宽度计算之后再赋值
        if(options.text){
            input.val(options.text);
            input.attr('title',options.text);
        }


        function setValue(ret){
            input.val(ret.text);
            input.attr('title',ret.text);
            // 缓存以解决returnValueNeedType为false时的值传递问题
            if(ret.obj && (options.returnValueNeedType===false)){
                input.data('obj',ret.obj);
            }
            valueInput.val(ret.value);
            if(options.valueChange){
                valueInput.change(options.valueChange(valueInput));
            }
            // 将中间选择的结果记录到comp中，避免再次调用.comp方法回到初始状态
            var tc = input.attr("comp");
            if (tc) {
                var tj = $.parseJSON('{' + tc + '}');
                tj.value = ret.value;
                tj.text = ret.text;
                var com = $.toJSON(tj);
                input.attr("comp",com.substring(1, com.length - 1));
            }
        }
        if(options.excludeElements){

        }
        options.id = input.attr('id');
        if (options.mode != 'modal') {
            options.callbk = function(ret) {
                setValue(ret);
                input.focus(); // for trigger validate component
            };
        }
        if (!options.params)
            options.params = {};

        var optionsHasElements = options.elements;
        btn.unbind("click").click(function() {
            options.params.value = valueInput.val();
            options.params.text = input.val();
            if(!optionsHasElements){
                var obj = input.data('obj');
                // 如果没有在options中显式传入elements，取缓存的obj对象传入
                if(obj){
                    options.elements = obj;
                }
            }
            var ret = $.selectPeople(options);
            if (ret) {
                setValue(ret);
            }
        });
    };

    $.fn.fastSelect = function(options) {
        var selectTypes = {'Account' : 'account',
            'Department' : 'dept',
            'Team' : 'team',
            'Post' : 'post',
            'Level' : 'level',
            'Member' : 'people'
        };
        var selectType = selectTypes[options.selectType];
        var multiSelect = !(options.maxSize===1);
        selectType = selectType ? selectType : 'people';
        var input = $(this), id = options.id, inited = input.attr('_inited'), delSize = 28;
        var btnSpan = $("<span id='"+id+"_btn' title='"+$.i18n('org.index.select.people.label.js')+"' class='selectPeopleIcon ico16 "+ (multiSelect?'check':'radio')  +'_'+selectType+"_16'></span>");
        options.srcElement.after(btnSpan);
        

        var valueInputName = id, valueInput,nameInput, btp, btcl, bth, btn, showbtn = options.showBtn != undefined ? options.showBtn
            : false;
        if(options.text){
            input.val(options.text);
            input.attr('title',options.text);
        }
        valueInput = $('<input type="hidden" />');
        valueInput.attr('id', valueInputName);
        valueInput.attr('name', valueInputName);
        nameInput = $('<input type="hidden" />');
        nameInput.attr('id', valueInputName+"_txt");
        nameInput.attr('name', valueInputName+"_txt");
        valueInput.attrObj('_comp', input);
        nameInput.attrObj('_comp', input);
        if(options.value){
            valueInput.val(options.value);
        }
        input.after(valueInput);
        input.after(nameInput);
        if(options.valueChange){
            valueInput.change(options.valueChange(valueInput));
        }
        //继承原有input的宽度
        if(options.extendWidth){
            if(!$.browser.msie || ($.browser.msie && (parseInt($.browser.version, 10)>=9))){//非ie ie9 ie10
                var oldDisp = valueInput.css("display");
                valueInput.css("display","block");
                if(valueInput.css("width").indexOf("%")!=-1){
                    input.css("width",valueInput.css("width"));
                }else{
                    if(valueInput.width()>0){
                        input.width(valueInput.width());
                    }
                }
                valueInput.css("display",oldDisp);
            }else{
                var temptag = false;
                if(input.width()<=0){
                    input.css("width","100%");
                    temptag = true;
                }
                if(input.width()<=0){
                    input.css("width","100");
                    temptag = true;
                }
            }
        }
        if(options.extendWidth){
            if(options.outBtn){
                var oldWidth = options.srcElement.width()+2;//select获取出来的值不包括边框，修正一下
                if(oldWidth<140){
                    oldWidth = 140;
                }
                options.srcElement.width(oldWidth - 30);
            }
        }
        // if(options.maxSize<2){//单选加标记
            // options.srcElement.addClass('singleOption');
        // }
              
        function setValue(ret){
            var newValue;
            var newNameText;
            var name_arr = [];
            var value_arr = [];
            // input 原始值
            var sourceData = input.select2("data");
            var arrValue = ret.value.split(",");
            var arrNameText= ret.text.split("、");
            for (var i = 0; i < sourceData.length; i++) {
                var items = sourceData[i];
                //options.maxSize为undefined  表示可以选择多个
                if((items.text.indexOf($.i18n('ctp.select2.people.departure'))>-1 || items.text.indexOf($.i18n('ctp.select2.people.deactivate'))>-1) && (undefined == options.maxSize || options.maxSize > 1 )){
                	name_arr.push(items.text);
                	value_arr.push(items.id);
                }
                	
            }
            if(value_arr != "" && value_arr != null){
                newValue= $.merge(value_arr, arrValue);
            }else{
                newValue = arrValue;
            }
            // 缓存以解决returnValueNeedType为false时的值传递问题
            if(ret.obj && (options.returnValueNeedType===false)){
            	input.data('obj',ret.obj);
            }
            if (null != newValue) {
                for (var i = 0; i < newValue.length; i++) {
                    var items = newValue[i];if ($.inArray(items, value_arr) == -1) {
                    	value_arr.push(items);
                    }
                }
                valueInput.val(value_arr.join(","));
            }else{
            	valueInput.val("");
            }
            if(name_arr != "" && name_arr != null){
            	newNameText =  $.merge(name_arr, arrNameText);
            }else{
            	newNameText = arrNameText;
            }
            nameInput.val(newNameText.join("、"));
            if(options.valueChange){
                valueInput.change(options.valueChange(valueInput));
            }
            input.empty();
            for(var i= 0 ;i< value_arr.length;i++){
            	if("" != value_arr[i]){
            		input.append("<option value='"+value_arr[i]+"'>"+newNameText[i]+"</option>");
            	}
            }
            input.val(value_arr).trigger("change");
            // 将中间选择的结果记录到comp中，避免再次调用.comp方法回到初始状态
            var tc = input.attr("comp");
            if (tc) {
                var tj = $.parseJSON('{' + tc + '}');
                var com = $.toJSON(tj);
                input.attr("comp",com.substring(1, com.length - 1));
            }
        }
        if(options.excludeElements){

        }
        if (options.mode != 'modal') {
            options.callbk = function(ret) {
                setValue(ret);
                input.focus(); // for trigger validate component
            };
        }
        if (!options.params)
            options.params = {};

        var optionsHasElements = options.elements;
        switch(options.selectType){
            case 'Account' :{
                initSelectData(options,$.i18n('ctp.select2.account.placeholder'));
                break;
            }
            case 'Department' :{
                initSelectData(options,$.i18n('ctp.select2.account.placeholder'));
                break;
            }
            case 'Team' :{
                initSelectData(options,$.i18n('ctp.select2.team.placeholder'));
                break;
            }
            case 'Post' :{
                initSelectData(options,$.i18n('ctp.select2.post.placeholder'));
                break;
            }
            case 'Level' :{
                initSelectData(options,$.i18n('ctp.select2.leave.placeholder'));
                break;
            }
            case 'Member' :{
                initSelectData(options,$.i18n('ctp.select2.people.placeholder'));
                break;
            }
        }
        input.bind("change").change(function() {
        	var sourceValue = input.val();
        	var new_arr = [];
        	var name_arr = [];
        	var nameTexts = input.select2("data");
            if (null != sourceValue) {
                for (var i = 0; i < sourceValue.length; i++) {
                    var items = sourceValue[i];if ($.inArray(items, new_arr) == -1) {
                        new_arr.push(items);
                    }
                }
                valueInput.val(new_arr.join(","));
            }else{
            	valueInput.val("");
            }
            if(nameTexts != null){
            	for (var i = 0; i < nameTexts.length; i++) {
                    var items = nameTexts[i];if ($.inArray(items, name_arr) == -1) {
                    	name_arr.push(items.text);
                    }
                }
            	nameInput.val(name_arr.join("、"));
            }else{
            	nameInput.val("");
            }
        });
        btnSpan.unbind("click").click(function() {
            options.params.value = null;
            if(null != input.val() ){
                options.params.value = input.val().join(",");
            }else{
                options.params.value = valueInput.val();
            }

            if(!optionsHasElements){
                var obj = input.data('obj');
                // 如果没有在options中显式传入elements，取缓存的obj对象传入
                if(obj){
                    options.elements = obj;
                }
            }
            var ret = $.selectPeople(options);
            if (ret) {
                setValue(ret);
            }
        });
    };

    function initSelectData(options,placeholder){
    	var length = options.maxSize;
        if(undefined ==length || null == length){
        	length= 99999;
    	}
        var initData = [];
        var arr_value = [];
        if(undefined != options.value && options.value != ""){
        	arr_value = options.value.split(",");
        }
        var arr_text = [];
        if(undefined != options.text){
        	arr_text = options.text.split(",");
        }
        for(var i = 0;i<arr_value.length;i++){
        	var fd = {id:"",text:""};
        	fd.id= arr_value[i];
        	fd.text= arr_text[i];
            options.srcElement.append("<option value='"+arr_value[i]+"'>"+arr_text[i]+"</option>");
        	initData.push(fd);
        }
        if(_language== "zh_CN"){
        	_language = 'zh-CN'
        }
        if(_language== "zh_TW"){
        	_language = 'zh-TW'
        }
        options.srcElement.select2({
            placeholder:placeholder,
            language: _language,
            maximumSelectionLength: length,
            initSelection:function (element, callback){
            	 if(undefined != options.value){
            		element.val(options.value.split(","));
                 	$("#"+options.id+"_txt").val(arr_text.join("、"));
            	 }
                callback(initData);
                },
            ajax: {
                url: "/seeyon/organization/orgIndexController.do?method=getFastSelect"+options.selectType+"&time="+new Date().getTime(),
                dataType: 'json',
                delay: 250,
                data: function (params) {
                  return {
                    q: params.term, // search term
                    page: params.page
                  };
                },
                processResults: function (data, params) {
                  params.page = params.page || 1;
                  var source= [];
                 
                  //去掉键盘移动事件后， 删除事件从下拉列表中处理，原始数据在这里获取
                  if(undefined == params.term){
                	  var sourceData =options.srcElement.select2("data");
                      for (var i = 0; i < sourceData.length; i++) {
                    	  var od = {id:"",text:""};
                          var sourceItems = sourceData[i];
                          od.id=sourceItems.id;
                          od.text=sourceItems.text;
                          source.push(od);
                      }
                      data = source.concat(data);
                  }
                  return {
                    results:data.unique()
                  };
                },
                cache: true
              },
              allowClear: false,
              // 防止XSS 注入
              escapeMarkup: function (markup) {
            	  var replaceMap = {
            		      '\\': '&#92;',
            		      '&': '&amp;',
            		      '<': '&lt;',
            		      '>': '&gt;',
            		      '"': '&quot;',
            		      '\'': '&#39;',
            		      '/': '&#47;'
            		    };
            		    // Do not try to escape the markup if it's not a string
            		    if (typeof markup !== 'string') {
            		      return markup;
            		    }

            		    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            		      return replaceMap[match];
            		    });
              }, 
              minimumInputLength: 0,  //最少输入0个字节开始查询， 不输入返回 最近10个联系人
              templateResult: formatRepo, // 返回结果
              templateSelection: formatRepoSelection //选中项回调
        });
        
        function formatRepo (repo) {  
            return repo.text;  
        }  
          
        function formatRepoSelection (repo) {  
            return repo.text ;  
        }
        
        Array.prototype.unique = function()
        {
        	var n = []; //一个新的临时数组
        	var m = [];
        	for(var i = 0; i < this.length; i++){
        		//如果当前数组的第i已经保存进了临时数组，那么跳过，
        		//否则把当前项push到临时数组里面
        		if (n.indexOf(this[i].id) == -1){
        			 n.push(this[i].id);
        			 m.push(this[i]);
        		}
        	}
        	return m;
        }
    }

    $.selectPeople = function(options) {
        var settings = {
            mode : 'div'
        };

        function cloneArray(ary) {
            var newAry = [];
            for(var i=0; i<ary.length; i++){
                if(Object.prototype.toString.call(ary[i]) == '[object Array]') {
                    newAry.push(cloneArray(ary[i]));
                } else{
                    newAry.push(ary[i]);
                }
            }
            return newAry;
        }

        options._window = window;
        options = $.extend(settings, options);
        var onlyShowChildrenAccount = options.onlyShowChildrenAccount;
        var url = _ctxPath + '/selectpeople.do?onlyShowChildrenAccount='+onlyShowChildrenAccount, ret;
        if (options.mode == 'modal') {
            if (options.preCallback)
                options.preCallback(options);
            // 弹出新窗口
            var retv = window.showModalDialog(url + "&isFromModel=true", options, 'dialogWidth=708px;dialogHeight=568px');
            if(retv != null && (typeof retv == "object")){
                retv.obj = cloneArray(retv.obj);
            }
            else if(retv == -1) {
                return;
            }
            if (retv) {
                ret = retv;
                if (options.callback)
                    options.callback(retv, options);
            }
        } else {
            if (options.preCallback)
                options.preCallback(options);
            var dialog = $
                .dialog({
                    id : "SelectPeopleDialog",
                    url : url,
                    width : 820,
                    height : 506,
                    title : $.i18n("selectPeople.page.title"),
                    checkMax:true,
                    transParams : options,
                    closeParam: {
                        show:true,
                        autoClose:true,
                        handler:function() {
                            if (options.canclecallback){
                                options.canclecallback();
                            }
                        }
                    },
                    targetWindow : getCtpTop(),
                    buttons : [ {
                        text : $.i18n('common.button.ok.label'),
                        isEmphasize: true,
                        handler : function() {
                            var retv = dialog.getReturnValue(),cl = true;
                            if (retv == -1) {
                                return;
                            }
                            if (retv) {
                                if (options.callbk && options.callbk(retv))
                                    cl = false;
                                if (options.callback && options.callback(retv, options))
                                    cl = false;
                            }
                            if(cl){
                            	var retvalue = "";
                            	var count=0;
                            	var retvalueDate = retv.value.split(",");
                                for (var i = 0; i < retvalueDate.length; i++) {
                                	var retvalueItem = retvalueDate[i];
                                	if(retvalueItem.indexOf("Member")==0){
                                		if(retvalue==""){
                                			retvalue = retvalueItem;
                                		}else{
                                			retvalue = retvalue+","+retvalueItem;
                                		}
                                		count++;
                                		if(count>=30){
                                			break;
                                		}
                                	}
                                }
                                $.ajax({
                                    type: "POST",
                                    url: encodeURI("/seeyon/organization/orgIndexController.do?method=saveRecentData4OrgIndex&rData="+retvalue)
                                });
                                dialog.close(dialog.index);
                            }
                        }
                    }, {
                        text : $.i18n('common.button.cancel.label'),
                        handler : function() {
                            if (options.canclecallback){
                                options.canclecallback();
                            }
                            dialog.close();
                        }
                    } ],

                    bottomHTML : "<table id=\"flowTypeDiv\" class=\"hidden\" width=\"\" border=\"0\" height=\"30\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\r\n"
                    + "  <tr>\r\n"
                    + "    <td id=\"concurrentType\">&nbsp;&nbsp;&nbsp;&nbsp;\r\n"
                    + "      <label for=\"concurrent\">\r\n"
                    + "        <input id=\"concurrent\" name=\"flowtype\" type=\"radio\" value=\"1\" checked>&nbsp;<span>"
                    + $.i18n("selectPeople.flowtype.concurrent.lable")
                    + "</span>\r\n"
                    + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                    + "    </td>\r\n"
                    + "    <td id=\"sequenceType\">\r\n"
                    + "      <label for=\"sequence\">\r\n"
                    + "        <input id=\"sequence\" name=\"flowtype\" type=\"radio\" value=\"0\">&nbsp;<span>"
                    + $.i18n("selectPeople.flowtype.sequence.lable")
                    + "</span>\r\n"
                    + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                    + "    </td>\r\n"
                    + "    <td id=\"multipleType\">\r\n"
                    + "      <label for=\"multiple\">\r\n"
                    + "        <input id=\"multiple\" name=\"flowtype\" type=\"radio\" value=\"2\">&nbsp;<span>"
                    + $.i18n("selectPeople.flowtype.multiple.lable")
                    + "</span>\r\n"
                    + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                    + "    </td>\r\n"
                    + "    <td id=\"colAssignType\">\r\n"
                    + "      <label for=\"colAssign\">\r\n"
                    + "        <input id=\"colAssign\" name=\"flowtype\" type=\"radio\" value=\"3\">&nbsp;<span>"
                    + $.i18n("selectPeople.flowtype.colAssign.lable")
                    + "</span>\r\n"
                    + "      </label>\r\n"
                    + "    </td>\r\n"
                    + "  </tr>\r\n" + "</table>"
                });
        }
        return ret;
    };
    //显示制定单据指定类型的字段列表
    $.selectStructuredDocFileds = function(options) {
        var settings = $.extend({}, {
            appName : '',//应用类别
            formAppId: '',//单据ID
            fieldType: '',//字段类型，多个字段类型之间用逗号隔开
            showSystemVariables: '',//是否显示系统变量页签
            showFormVariables:'true',//是否显示表单字段页签
            tableType:''//主表和重复表,如果不传则表示所有，如果传main则表示只显示主表字段；如果传son则表示只显示子表字段
        }, options);
        var url = _ctxPath+'/custom/function.do?method=showParamBindIndex&appName=' + settings.appName
            + '&formAppId=' +settings.formAppId+"&tableType="+settings.tableType+"&fieldType="+settings.fieldType
            +"&showSystemVariables="+settings.showSystemVariables
            +"&showFormVariables="+settings.showFormVariables;
        var dialog = $.dialog({
            id : "SelectStructuredDocFiledsDialog",
            url : url,
            width : 500,
            height : 500,
            title : $.i18n('workflow.customFunction.parmbind.label.js'), //'参数绑定'
            checkMax:true,
            transParams : options,
            targetWindow : getCtpTop(),
            buttons : [{
                text : $.i18n('common.button.ok.label'),
                isEmphasize: true,
                handler : function() {
                    var retv = dialog.getReturnValue();
                    if (typeof(retv) == undefined||retv===null) {
                        return;
                    }
                    if(options.onOk){
                        options.onOk(retv);
                    }
                    dialog.close();
                }}, {
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                    dialog.close();
                    if(options.onCancel){
                        options.onCancel();
                    }
                }
            }]
        });
    };
    $.selectFunction = function(options) {
        var settings = $.extend({}, {
            templateCode : '',
            category : '*'
        }, options);
        var url = _ctxPath+'/custom/function.do?category=' + settings.category + '&templateCode=' +settings.templateCode;
        var dialog = $.dialog({
            id : "SelectFunctionDialog",
            url : url,
            width : 708,
            height : 530,
            title : $.i18n("functionmod.title.info"),
            checkMax:true,
            transParams : options,
            targetWindow : getCtpTop(),
            buttons : [{
                text : $.i18n('common.button.ok.label'),
                isEmphasize: true,
                handler : function() {
                    var retv = dialog.getReturnValue();
                    if (typeof(retv) == undefined||retv===null) {
                        alert($.i18n('functionmod.select.isnul'));
                        return;
                    }
                    settings.methodName = retv;

                    if(options.onOk){
                        options.onOk(retv);
//                    __setFunctionParams(settings);
                    }

                    dialog.close();
                }}, {
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                    dialog.close();
                }
            }]
        });
    };
    function __setFunctionParams(options){
        var url = _ctxPath+'/custom/function.do?method=setParams&category=' + options.category +
            '&templateCode=' +options.templateCode +
            '&methodName=' + options.methodName +
            '&formApp=' + options.formApp;
        var dialog = $.dialog({
            id : "SetParamsFunctionDialog",
            url : url,
            width : 708,
            height : 530,
            title : $.i18n("functionmod.title.info"),
            checkMax:true,
            transParams : options,
            targetWindow : getCtpTop(),
            buttons : [{
                text : $.i18n('common.button.ok.label'),
                isEmphasize: true,
                handler : function() {
                    var retv = dialog.getReturnValue();
                    if(retv!=null && retv!=""){
                        if(options.onOk){
                            options.onOk(retv);
                        }
                        dialog.close();
                    }
                }}, {
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                    dialog.close();
                }
            }]
        });
    }
    $.callFormula = function(options) {
        var settings = $.extend({}, {
            returnType:"String,Bool,Numberic,DateTime,Member,Department,Post,Level,Account,Role",
            formulaType:"Constant,Variable,GroovyFunction,JavaFunction",
            templateCode:"",
            catagory:"",
            appName:"",
            showFormVariables:"true"
        }, options);
        var url=_ctxPath+'/formula/formula.do?method=callFormula';
        if(settings.returnType){
            url += '&returnType='+settings.returnType;
        }
        if(settings.formulaType){
            url += '&formulaType='+settings.formulaType;
        }
        if(settings.templateCode){
            url += '&templateCode='+settings.templateCode;
        }
        if(settings.formulaType){
            url += '&formulaType='+settings.formulaType;
        }
        if(settings.appName){
            url += '&appName='+settings.appName;
        }
        if(settings.appName){
            url += '&catagory='+settings.catagory;
        }
        if(settings.showFormVariables){
            url += '&showFormVariables='+settings.showFormVariables;
        }
        var dialog = $.dialog({
            id: 'formulaDialog',
            url: url,
            width: 600,
            height: 400,
            title: '调用',
            checkMax:true,
            targetWindow: getCtpTop(),
            transParams : options,
            buttons: [{
                text: $.i18n('common.button.ok.label'),
                isEmphasize: true,
                handler: function () {
                    var r = dialog.getReturnValue();
                    if(r==''||r==null||r==undefined){
                        alert("请先选择!");
                        return;
                    }
                    dialog.close();
                    settings.methodName=r.formulaName;
                    if(r.params!=null&&r.params!=undefined&&r.params!=""){
                        setFormulaParams(settings,r);
                    }else{
                        if(r.formulaType!="0"&&r.formulaType!="1"){
                            setFormulaParams(settings,r);
                        }else{
                            var retv="getVar(\""+r.formulaName+"\")";
                            if(options.onOk){
                                options.onOk(retv);
                            }
                        }
                    }
                }
            }, {
                text: $.i18n('common.button.cancel.label'),
                handler: function () {
                    dialog.close();
                }
            }]
        });
    }
    function setFormulaParams(options,r){
        var url = _ctxPath+'/formula/formula.do?method=setParams&id='+r.id+'&category=' + options.category +
            '&templateCode=' +options.templateCode +
            '&methodName=' + options.methodName +
            '&appName=' + options.appName +
            '&showFormVariables=' + options.showFormVariables +
            '&formApp=' + options.formApp;
        var dialog = $.dialog({
            id : "SetParamsFunctionDialog",
            url : url,
            width : 600,
            height : 400,
            title : "参数设置",
            checkMax:true,
            targetWindow : getCtpTop(),
            buttons : [{
                text : $.i18n('common.button.ok.label'),
                isEmphasize: true,
                handler : function() {
                    var retv = dialog.getReturnValue();
                    if(retv!=null && retv!=""){
                        if(options.onOk){
                            options.onOk(retv);
                        }
                        dialog.close();
                    }
                }}, {
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                    dialog.close();
                }
            }]
        });
    }
    $.fn.showOffice = function(options) {
        var settings = {
            webRoot : _ctxServer
        };
        options = $.extend(settings, options);
        //如果指定类型无法打开，则尝试使用另一种类型打开 如果都不支持的话对office控件类型进行提示
        var typeReplace = [];
        typeReplace['.doc'] = '.wps';
        typeReplace['.wps'] = '.doc';
        typeReplace['.et'] = '.xls';
        typeReplace['.xls'] = '.et';
        typeReplace['.pdf'] = '.pdf';
        var f = $.ctx.isOfficeEnabled(options.fileType);
        if(!f && typeReplace[options.fileType]){
            f = $.ctx.isOfficeEnabled(typeReplace[options.fileType]);
            // if(f){
            //     options.fileType = typeReplace[options.fileType];
            // }
        }
        if(f) {
            var od = $('<div id="officeFrameDiv" style="display:none;height:100%"><iframe src="" name="officeEditorFrame" id="officeEditorFrame" frameborder="0" width="100%" height="100%"></iframe></div>');
            this.replaceWith(od);

            options.handWriteCurrentUserId = $.ctx.CurrentUser.id;

            if(options.fileType == '.pdf'){
                createPdfOcx(options)
            }else{
                initBaseOffice(options);
            }
            if(typeof officeSupportCallback != "undefined") {
                officeSupportCallback();
            }
        }else {
            this.replaceWith($('<center><font color="red" style="font-weight:bold">' + $.i18n('common.body.type.officeNotSupported') + '</font></center>'));
            if(typeof officeNotSupportCallback != "undefined") {
                officeNotSupportCallback();
            }
        }
    };
    $.fn.tab = function(tj) {
        var tb = this.attrObj("tabObj");
        if (tb)
            return tb;
        tj.id = this.attr('id');
        tb = new MxtTab(tj);
        this.attrObj("tabObj", tb);
        if (tj.mode && 'mouseOver' === tj.mode)
            tb.setMouseOver();
    };
    $.fn.tabEnable = function(tgt) {
        var tab = this.attrObj("tabObj");
        if (tab)
            tab.enable(tgt);
    };

    $.fn.tabDisable = function(tgt) {
        var tab = this.attrObj("tabObj");
        if (tab)
            tab.disabled(tgt);
    };

    $.fn.tabCurrent = function(tgt) {
        var tab = this.attrObj("tabObj");
        if (tab)
            tab.setCurrent(tgt);
    };

    $.fn.toolbar = function(options) {
        var par = {
            contextPath : _ctxPath,
            render : this[0].id
        };
        par = $.extendParam(par, options);
        var myBar = new WebFXMenuBar(par), toolbarOpt = options.toolbar;
        this.attrObj("toolbarObj", myBar);
        if (toolbarOpt) {
            if (!_isDevelop) {
                var toolbarOptTmp = [];
                $.each(toolbarOpt, function(n, val) {
                    var rc = val.resCode, pi = val.pluginId, ps = false;
                    $.privCheck(rc, pi, function() {
                        toolbarOptTmp.push(val);
                        ps = true;
                    });
                    if (ps && val.subMenu) {
                        var smOpt = [];
                        $.each(val.subMenu, function(ns, sm) {
                            rc = sm.resCode, pi = sm.pluginId;
                            $.privCheck(rc, pi, function() {
                                smOpt.push(sm);
                            });
                        });
                        val.subMenu = smOpt;
                    }
                });
                toolbarOpt = toolbarOptTmp;
            }
            $.each(toolbarOpt, function(n, val) {
                var pm = $.extendParam({}, val);
                if (val.items)
                    pm.items = val.items; // select的option
                if (val.subMenu)
                    pm.subMenu = initSubMenu(val.subMenu);
                pm.id = pm.id ? pm.id : ("mb_" + n);
                myBar.add(new WebFXMenuButton(pm));
            });
        }
        function initSubMenu(sm) {
            var tm = new WebFXMenu();
            $.each(sm, function(n, val) {
                var pm = $.extendParam({}, val), mi;
                pm.id = pm.id ? pm.id : ("mi_" + n);
                mi = new WebFXMenuItem(pm);
                tm.add(mi);
                // doesn't support hirachy menu currently
                // if (val.subMenu)
                // mi.add(initSubMenu(val.subMenu));
            });
            return tm;
        }

        myBar.show();
        return myBar;
    };

    $.fn.toolbarEnable = function(tgt) {
        var tb = this.attrObj("toolbarObj");
        if (tb)
            tb.enabled(tgt);
    };

    $.fn.toolbarDisable = function(tgt) {
        var tb = this.attrObj("toolbarObj");
        if (tb)
            tb.disabled(tgt);
    };

    $.fn.menu = function(options) {
        var par = $.extendParam({
            render : this[0].id
        }, options);
        var menubar = new MxtMenuBar(par);

        if (options.menus) {
            $.each(options.menus, function(n, val) {
                var pm = $.extendParam({}, val);
                var menu = new MxtMenu(pm);
                if (val.items) {
                    $.each(val.items, function(m, it) {
                        menu.add(initMenuItem(it));
                    });
                }
                menubar.add(menu);
            });
        }
        function initMenuItem(mi) {
            var pm = $.extendParam({}, mi);
            var mit = new MxtMenuItem(pm);
            if (mi.items) {
                var sm = new MxtSubMenu({});
                mit.add(sm);
                $.each(mi.items, function(n, is) {
                    sm.add(initMenuItem(is));
                });
            }
            return mit;
        }

        menubar.show();

    };
    function hasSetupHw(){
        var cacheKey = 'DBstep.WebSignature.hasSetupHw';
        var value = $.globalCache(cacheKey);
        if(value == null){
            var res = false;
            try{
                if($.v3x.isMSIE){
                    new ActiveXObject("DBstep.WebSignature");
                    res = true;
                }else{
                    res = true;
                }

            }catch(e){
                res = false;
            }
            $.globalCache(cacheKey,res);
            return res;
        }else{
            return value;
        }

    }
    function isMSEdge() {
        var isMSEdge = false;
        //是edge浏览器
        if(navigator.userAgent.toLowerCase().indexOf("edge")!=-1){
            isMSEdge=true;
        }
        return  isMSEdge;
    }
    $.fn.htmlSignature = function(t,tj) {
        if(!hasSetupHw()){
            t.after($('<center><font color="red" style="font-weight:bold">' + $.i18n('common.isignaturehtml.notInstall') + '</font></center>'));
        } else if(isMSEdge()) {
            t.after($('<center><font color="red" style="font-weight:bold">当前浏览器不支持office签章！</font></center>'));
        } else {
            if(t.length>0&&t[0].tagName.toLowerCase()==="input"){
                var twidth = 0;
                if(t.css("width")==="100%"||t.width()==0){
                    twidth = t.parent("div").width();
                }else{
                    twidth = t.width();
                }

                var theight = t.height();
                if(twidth==0){
                    twidth = 100;
                }
                if(theight==0){
                    theight = 20;
                }
                if(tj.showButton == true){
                    var button = $("<span></span>");
                    button.attr("id","signButton");
                    button.attr("class",tj.buttonClass ? tj.buttonClass : "ico16 signa_16");
                    if(tj.enabled===1){
                        button.unbind("click").bind("click",function(){
                            handWrite(tj.recordId,tj.signObj,false,'',$.ctx.CurrentUser.id);
                        });
                    }
                    t.after(button);
                    twidth = twidth-button.width()-2;
                }
                t[0].initWidth = twidth+"";
                t[0].initHeight = theight+"";
                t.attr("initWidth",twidth+"");
                t.attr("initHeight",theight+"");
            }
            tj.signObj = t[0];
            tj.currentUserId = $.ctx.CurrentUser.id;
            initHandWriteData(tj);
        }
    };

    $.fn.barCode = function (options) {
        var barCode = new barCodeManager();
        var width = options.width || 30, height = options.height || 30;
        var input = $(this), id = input.attr('id');
        var imgId = id+"_img";
        var baseDiv = $("<span style='display: block;float: left;'></span>");
        var imgDiv = $("<div id='" + imgId + "' class='left border_all' style='width: " + width + "px;height: " + height + "px;'></div>");
        var margin = height > 40 ? height - 40 : 0;
        var btnDiv = $("<div class='left' style='vertical-align:bottom;width: 20px;height: "+height+"px;margin-top: "+margin+"px'></div>");
        var delBtn = $("<div class='ico16 affix_del_16 left' style='vertical-align: top'></div>");
        var addBtn = $("<div class='ico16 two_dimensional_code_scanning_16 left' style='vertical-align: top'></div>");
        var showBtnAdd = options.showBtnAdd || false;
        var showBtnDel = options.showBtnDel || false;

        //生成二维码宽度，用于回填时等比例缩放
        var imgWidth;

        delBtn.unbind("click").bind("click",function(){
            delValue();
        });
        addBtn.unbind("click").bind("click",function(){
            var barOption = $.extend({},options);
            barOption.preCallback = "";
            barOption.callback = "";
            var customOption = {};
            if (options.preCallback) {
                var result = options.preCallback(input);
                if (result && result.barOption) {
                    barOption = $.extend(barOption, result.barOption);
                }
                imgWidth = barOption.width;
                if (result && result.customOption) {
                    customOption = result.customOption;
                }
            }
            var result = barCode.getBarCodeAttachment(barOption, customOption);
            if (!result.success) {
                $.alert(result.msg);
                return;
            }
            var att = result.attachment;
            if (options.callback) {
                options.callback(att,imgDiv);
            }
            setValue(att);
        });

        baseDiv.append(imgDiv).append(btnDiv);
        btnDiv.append(delBtn).append(addBtn);
        input.after(baseDiv);
        input.hide();
        if(input.attr("attr")){
            var attr = input.attr("attr");
            attr = $.parseJSON(attr);
            setValue(attr);
        } else {
            showButton(false);
        }
        function setValue(att){
            clearValue();
            input.val(att.subReference);
            input.attr("reference", att.reference);
            var url = _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + att.fileUrl + "&type=image";
            var imgDivWidth = $(imgDiv).width();
            var imgDivHeight = $(imgDiv).height();
            imgDiv.append("<img onclick='openCtpWindow({url:$(this).attr(\"src\")})' src='" + url + "'>");
            var img = $("img",imgDiv);
            var realImgWidth;
            var newImg = new Image();
            newImg.onload = function(){
                realImgWidth = newImg.width ;
                if(realImgWidth > imgWidth || !imgWidth){
                    imgWidth = realImgWidth;
                }
                if(imgWidth != undefined && imgDivWidth != undefined && imgDivHeight != undefined){
                    if(imgWidth>imgDivWidth && imgWidth > imgDivHeight){
                        //如果宽度高度同时超出，按照超出比例的大的缩放
                        var wScale = parseFloat(imgWidth/imgDivWidth);
                        var hScale = parseFloat(imgWidth/imgDivHeight);
                        if(wScale >= hScale){
                            imgWidth = imgDivWidth;
                        }else{
                            imgWidth = imgDivHeight;
                        }
                    } else if(imgWidth > imgDivWidth){
                        imgWidth = imgDivWidth;
                    }else if(imgWidth > imgDivHeight){
                        imgWidth = imgDivHeight;
                    }
                    var img = $("img",imgDiv);
                    img.css({"width":imgWidth,"height":imgWidth,"cursor":"pointer"});
                }
            }
            newImg.src = $(img).attr("src");
            showButton(true);
        }
        function delValue() {
            $.confirm({
                msg: $.i18n('common.barcode.delete.label'),
                ok_fn:function(){
                    //var reference = input.attr("reference");
                    //var subReference = input.val();
                    //if (reference && subReference) {
                    //    barCode.deleteBarCode(reference, subReference);
                    //}
                    clearValue();
                    //如果设置有回调函数，则执行回调，第二个参数标识是否为删除
                    if (options.callback) {
                        options.callback(null,imgDiv,true);
                    }
                }
            });
        }
        function clearValue() {
            input.val("");
            imgDiv.html("");
            showButton(false);
        }

        function showButton(showDel) {
            addBtn.hide();
            delBtn.hide();
            if (showBtnAdd) {
                addBtn.show();
            }
            if (showBtnDel && showDel) {
                delBtn.show();
            }
            if(!showBtnAdd && !showBtnDel){
                btnDiv.hide();
            }
        }
    };

    function useUploadActivex(){

        var value = $.globalCache('useUploadActivex');
        if(value == null){
            try{
                var ufa = new ActiveXObject('UFIDA_Upload.A8Upload.2');
                ufa.SetLimitFileSize(1024);
                value = true;
            }catch(e){
                value = false;
            }
            $.globalCache('useUploadActivex',value);
        }
        return value;
    }

    function initFileUpload(t, tj) {
        if(v3x && v3x.isMSIE7){
            //兼容ie7，莫名的高度
            t.css("font-size","0");
        }

        t.attrObj("_attachShow") ? t.attrObj("_attachShow").remove() : null;
        downloadURL = _ctxPath
            + "/fileUpload.do?type="
            + ((tj.customType == undefined) ? 0 : tj.customType)
            + ((tj.firstSave == undefined) ? '' : ("&firstSave=" + tj.firstSave))
            + "&applicationCategory="
            + tj.applicationCategory
            + "&extensions="
            + ((tj.extensions == undefined) ? '' : tj.extensions)
            + ((tj.quantity == undefined) ? '' : ("&quantity=" + tj.quantity))
            + "&maxSize="
            + ((tj.maxSize == undefined) ? '' : tj.maxSize)
            + "&isEncrypt="
            + ((tj.isEncrypt == undefined) ? '' : tj.isEncrypt)
            + "&popupTitleKey="
            + ((tj.attachmentTrId == undefined) ? ''
                : ("&attachmentTrId=" + tj.attachmentTrId))
            + ((tj.embedInput == undefined) ? ''
                : ("&embedInput=" + tj.embedInput))
            + ((tj.showReplaceOrAppend == undefined) ? ''
                : ("&selectRepeatSkipOrCover=" + tj.showReplaceOrAppend))
            + ((tj.callMethod == undefined) ? '' : ("&callMethod=" + tj.callMethod))
            + ((tj.isShowImg == undefined) ? '' : ("&isShowImg=" + tj.isShowImg))
            + ((tj.takeOver == undefined) ? '' : ("&takeOver=" + tj.takeOver));

        //精灵上传附件
        var isA8geniusAdded=useUploadActivex();
        downloadURL += ((!isA8geniusAdded) ? '' : ("&isA8geniusAdded=" + isA8geniusAdded));

        var  formVisible=((tj.displayMode == undefined) ? "auto;" :  tj.displayMode) ;
        var styleStr = "";
        if((tj.autoHeight != undefined && tj.autoHeight == true) || tj.canDeleteOriginalAtts == true || (typeof(tj.noMaxheight)!= undefined && tj.noMaxheight == true)){
            if(tj.applicationCategory!=undefined && tj.applicationCategory==2 || tj.noMaxheight == true){//表单附件自动撑开显示，不使用滚动条；如果参数中有tnoMaxheight:true，也不使用滚动条
                styleStr = "style=\"overflow: "+formVisible+" *font-size:0;overflow-x:hidden;\"";
            }else{
                styleStr = "style=\"overflow: "+formVisible+" *font-size:0;max-height:192px; overflow-x:hidden;\"";
            }
        }else{
            styleStr = "style=\"overflow: "+formVisible+" *font-size:0; max-height:64px; overflow-x:hidden;\"";
        }
        if(tj.isShowImg){
            styleStr = " ";
        }
        var showAreaDiv = "<div id='attachmentArea"+ (tj.attachmentTrId ? tj.attachmentTrId : '') + "' "+styleStr+" requrl='" + downloadURL + "' "+ ((tj.delCallMethod == undefined) ? '' : ("delCallMethod=" + tj.delCallMethod))+"></div>";
        if ($("#downloadFileFrame").length == 0) {
            showAreaDiv = showAreaDiv
                + "<div style=\"display:none;\"><iframe name=\"downloadFileFrame\" id=\"downloadFileFrame\" frameborder=\"0\" width=\"0\" height=\"0\"></iframe></div>";
        }
        if(tj.embedInput){
            t.append('<input type="text" style="display:none" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
        }

        showAreaDiv = $(showAreaDiv);
        t.after(showAreaDiv);
        t.hide();
        t.attrObj("_attachShow", showAreaDiv);

        initAttData(t, tj, true,  (tj.embedInput ? tj.embedInput : ''));

        if(t.attr("attsdata")!=""){
            var tempAtts = $.parseJSON(t.attr("attsdata"));
            //自适应图片的宽度和高度，默认隐藏图片，不让图片撑大容器，让宽度计算正确
            if(tempAtts!=null&&tj.isShowImg&&tempAtts.length>0){
                for(var i=0;i<tempAtts.length;i++){
                    if(tempAtts[i].subReference==tj.attachmentTrId){
                        var displayDiv = $('#attachmentDiv_' + tempAtts[i].fileUrl);
                        displayDiv.find("img").hide();
                        var hiddenInput = $("#"+tj.embedInput);
                        hiddenInput.parent("div").css("display","block");
                        hiddenInput.css("display","block");
                        var tempWidth = hiddenInput.width();
                        var tempHeight = hiddenInput.height();
                        hiddenInput.css("display","none");
                        var delSpanWidth=displayDiv.find(".ico16").width()+2;
                        displayDiv.width(tempWidth-delSpanWidth).height(tempHeight);
                        displayDiv.css("overflow","hidden");
                        displayDiv.find("img").show().load(function(){
                            //$(this).width(displayDiv.width()-delSpanWidth).height(hiddenInput.height());
                            $(this).css({"max-width":displayDiv.width()-delSpanWidth,"max-height":tempHeight,"cursor":"pointer"});
                            hiddenInput.parent("div").css("display","none");
                        });
                        break;
                    }
                }
            }
        }
    }
    function initAttData(t, tj, isAtt, embedInput) {
        var atts = tj.attsdata ? tj.attsdata : t.attr("attsdata") ? $.parseJSON(t
                    .attr("attsdata")) : null;
        // var datas1 =new Array();
        if (atts && atts instanceof Array) {
            var att;
            for ( var i = 0; i < atts.length; i++) {
                att = atts[i];
                if (isAtt) {
                    if (att.type == 2)
                        continue;
                } else {
                    if (att.type != 2)
                        continue;
                }
                var canFavourite=true;
                var  isShowImg=false;
                if(tj.canFavourite  != undefined) canFavourite=tj.canFavourite;
                if(tj.isShowImg  != undefined) isShowImg=tj.isShowImg;
                // if(isImg(att)){
                // 	datas1.push({"dataId":att.fileUrl,"src": _ctxPath + "/fileUpload.do?method=showRTE&type=image&fileId=" + att.fileUrl + "&createdate=" + att.createdate.substring(0, 10) + "&filename=" + encodeURIComponent(att.filename)});
                // }
                if (tj.attachmentTrId){
                    //页面上重复显示附件的时候不需要判断
                    var checkSubReference = tj.checkSubReference != undefined ? tj.checkSubReference : true;
                    if(checkSubReference && att.reference !=att.subReference && tj.attachmentTrId!=att.subReference)
                        continue;
                    addAttachmentPoi(att.type, att.filename, att.mimeType,
                        att.createdate ? att.createdate.toString() : null, att.size,
                        att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
                        att.description, att.extension, att.icon, tj.attachmentTrId,
                        att.reference, att.category, false,null,embedInput,true, att.officeTransformEnable, att.v, canFavourite,isShowImg,att.id,att.hasFavorite);
                }else{
                    addAttachment(att.type, att.filename, att.mimeType,
                        att.createdate ? att.createdate.toString() : null, att.size,
                        att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
                        att.description, att.extension, att.icon, att.reference,
                        att.category, false,null,true, att.officeTransformEnable, att.v,canFavourite,att.hasFavorite);
                }
            }
        }
    }




    function preview(fileId){
        if(fileUploadAttachments != null){
            var tempDatas = fileUploadAttachments.values();
            var datas1 =new Array();
            for(var i=0;i<tempDatas.size();i++){
                var tt = tempDatas.get(i);
                if(tt.isImg()){
                    datas1.push({dataId:tt.fileUrl2,src: _ctxPath + "/fileUpload.do?method=showRTE&type=image&fileId=" + tt.fileUrl2 + "&createDate=" + tt.createDate.substring(0, 10) + "&filename=" + encodeURIComponent(tt.filename)});
                }
            }

        }
    }

    function fileList(t) {
        theToShowAttachments = new ArrayList();
        var downloadURL = _ctxPath + "/fileUpload.do";
        var atts = t.attr("attsdata");
        if (atts != null && atts != '') {
            atts = $.parseJSON(atts);
        }
        var att;
        for ( var i = 0; i < atts.length; i++) {
            att = atts[i];
            theToShowAttachments.add(new Attachment(att.id, att.reference,
                att.subReference, att.category, att.type, att.filename, att.mimeType,
                att.createdate.toString(), att.size, att.fileUrl, '', null,
                att.extension, att.icon, true, 'true'));
        }
    }
    function showFileList(t, tj) {
        showAttachment(tj.subRef, tj.atttype, tj.attachmentTrId, tj.numberDivId);
    }

    function assdoc(t, tj) {
        //兼容ie7，莫名的高度
        t.css("font-size","0");

        var _maxHeight = tj.noMaxheight==true?"":"max-height:96px;";
        t.after($('<div id="attachment2Area'
            + (tj.attachmentTrId ? tj.attachmentTrId : '') + '" poi="'
            + (tj.attachmentTrId ? tj.attachmentTrId : '') + '"  ' +(tj.embedInput ? ' embedInput="'+tj.embedInput+'"' : '')+(tj.callMethod ? ' callMethod="'+tj.callMethod+'"' : '')+' requestUrl="'
            + _ctxPath + '/ctp/common/associateddoc/assdocFrame.do?isBind='
            + (tj.modids ? tj.modids : '')
            +'&referenceId='+(tj.referenceId ? tj.referenceId : '')
            +'&applicationCategory='+(tj.applicationCategory ? tj.applicationCategory : '')
            + '&poi='
            + (tj.attachmentTrId ? tj.attachmentTrId : '')
            + ('" style="overflow: '+((tj.displayMode == undefined) ? "auto; *font-size:0;"+_maxHeight:  tj.displayMode)+'"></div>')));

        if(tj.embedInput){
            t.append('<input type="hidden" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
        }
        initAttData(t, tj, false, (tj.embedInput ? tj.embedInput : ''));
    }
    // 替换页面input
    function showInput(t, cls, tj) {
        var obj = $(t[0]);
        obj.width(obj.width() - 21);
        var html = "<span class=\"margin_l_5 ico16 " + cls + "_16\"";
        tj.fun ? html += " onclick='" + tj.fun + "()'" : null;
        tj.fun ? html += " title='" + tj.title + "'" : null;
        html += "></span> ";
        obj.after(html);
    }
//var onlyNumber = {
//    start : /^[.]|[^0123456789.-]+|[.-]{2,}|[-]$/g,
//    end : /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g,
//    type :/^[-+\d]+$/,
//    nonNumber : /[.-]+/g
//}
//限制输入框只能输入小数
    /**
     * 自己的clone方法jquery is so bad
     */
    $.fn.ctpClone = function(){
        if(this){
            return $.ctpClone($(this));
        }
    }
    $.ctpClone = function(jqObj){
        if(jqObj && jqObj.size()>0){
            var cloneObj;
            if(jqObj[0].outerHTML){
                //****ie7下jquery的clone方法复制出来的对象有问题，因为如果对复制出来的对象设置attr自定义属性的时候会将老对象的attr给修改了,jquery is so bad！
                cloneObj = $(jqObj[0].outerHTML.replace(/jQuery\d+="\d+"/g,""));
            }else{
                cloneObj = jqObj.clone();
            }
            return cloneObj;
        }
    }
    $.batchExport = function(total,callback){
        var pageSize = 10000;
        if(total<=pageSize){
            callback(1,total);
            return;
        }
        var pageCount = Math.ceil(total/pageSize);
        var options = '';
        for(var i=1; i<=pageCount;i++){
            options+='<option value="'+i+'">'+i+'</option>';
        }
        var html ='<table class="popupTitleRight bg_color_white margin_5" style="font-size: 12px;">'
            +'<tr><td height="30">'+$.i18n('export.batch.desc.1.js')+'</td></tr>'
            +'<tr><td height="30">'+$.i18n('export.batch.desc.2.js',pageSize,total,pageCount)+'</td></tr>'
            +'<tr><td height="30">'+$.i18n('export.batch.desc.3.js','<select id="exportPageNo" style="width:60px" >'+options+'</select>')+'</td></tr>'
            +'</table>';
        var dialog = $.dialog({
            id: 'dlgExport',
            html : html,
            title: $.i18n('export.batch.title.js'),
            width : 300,
            height : 120,
            targetWindow:window,
            buttons: [{
                id : 'btnExport',
                text : $.i18n('export.batch.title.js'),
                handler : function () {
                    var idExportButton = 'btnExport';
                    var cur = parseInt($('#exportPageNo').val());
                    dialog.disabledBtn(idExportButton);
                    var btn = dialog.getBtn(idExportButton);
                    var text = btn.html();
                    var times = 10;
                    btn.html('&#160;' + times + '&#160;');
                    callback(cur,pageSize);
                    if(cur < pageCount){
                        // 转到下一批
                        $('#exportPageNo').val(cur+1);
                        // 10秒以后才允许下一次导出
                        var interval1 = setInterval(function(){
                                btn.html('&#160;' + (--times) + '&#160;');
                            }
                            ,1000);
                        setTimeout(function(){
                            window.clearInterval(interval1);
                            dialog.enabledBtn(idExportButton);
                            btn.html(text);
                        },10000);
                    }else{
                        dialog.close();
                    }
                }
            }, {
                text : $.i18n('collaboration.button.cancel.label'),
                handler : function () {
                    dialog.close();
                }
            }]
        });
    }
    function onlyInputNumber(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var onlyNumber = e.data;
            if(isNaN(value) || !onlyNumber.type.test(value)){
                value = value.replace(onlyNumber.start,"");
                if(value!="-" && value!="+" && isNaN(value)){
                    value = value.replace(onlyNumber.nonNumber,"");
                }
            }
            if(onlyNumber.decimalDigit!=null){
                var dotIndex = value.indexOf("."), allLength = value.length;
                if(dotIndex>-1){
                    if(onlyNumber.decimalDigit<=0){
                        value = value.substr(0,dotIndex);
                    }else{
                        value = value.substr(0,dotIndex+onlyNumber.decimalDigit+1);
                    }
                }
            }
            if(tempThis.val()!=value){
                tempThis.val(value);
            }
        }
        tempThis = null;
    }
    function deleteNonNumber(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var onlyNumber = e.data;
            if(isNaN(value) || !onlyNumber.type.test(value)){
                //焦点移开时，将非法字符全部转换
                value = value.replace(onlyNumber.end,"");
                if(value!="-" && value!="+" && isNaN(value)){
                    value = value.replace(onlyNumber.nonNumber,"");
                }
            }
            if(onlyNumber.decimalDigit!=null){
                var dotIndex = value.indexOf("."), allLength = value.length;
                if(dotIndex>-1){
                    if(onlyNumber.decimalDigit<=0){
                        value = value.substr(0,dotIndex);
                    }else{
                        value = value.substr(0,dotIndex+onlyNumber.decimalDigit+1);
                    }
                }
            }
            tempThis.val(value);
        }
        tempThis = null;
    }
    function percentFunctionKeyUp(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var index = value.lastIndexOf("%");
            var numberValue = value;
            if(index>-1){
                numberValue = value.sub(0, index);
            }
            if(isNaN(numberValue) || !/^[-+]?\d+(\.\d*)?$/.test(value)){
                if(!$.isANumber(numberValue)){
                    numberValue = numberValue.replace(/[^\d]+/g,"");
                }
                tempThis.val(numberValue);
            }
        }
        tempThis = null;
    }
    function percentFunctionBlur(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var index = value.lastIndexOf("%");
            var numberValue = value;
            if(index>-1){
                numberValue = value.sub(0, index);
            }
            if(isNaN(numberValue) || !/^\d+(\.\d+)?$/.test(value)){
                if(!$.isANumber(numberValue)){
                    numberValue = numberValue.replace(/[^\d]+/g,"");
                }
                tempThis.val(numberValue+"%");
            }
        }
        tempThis = null;
    }
    function thousandthFunctionKeyUp(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var numberValue = value;
            if(value.length<=3){
                if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
                    if(!$.isANumber(numberValue)){
                        numberValue = numberValue.replace(/[^\d]+/g,"");
                    }
                    tempThis.val(numberValue);
                }
            } else {
                var tempReg = /^\d\d\d(,\d\d\d)*,\d{0,3}$/;
                if(!tempReg.test(value)){
                    numberValue = numberValue.match(/\d\d\d(,\d\d\d)*(,\d{0,3})?/);
                    if(numberValue==null){
                        numberValue = "";
                    }else{
                        numberValue = numberValue[0];
                    }
                    tempThis.val(numberValue);
                }
            }
        }
        tempThis = null;
    }
    function thousandthFunctionBlur(e){
        var tempThis = $(this);
        var value = tempThis.val();
        if(value.length>0){
            var numberValue = value;
            if(value.length<=3){
                if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
                    if(!$.isANumber(numberValue)){
                        numberValue = numberValue.replace(/[^\d]+/g,"").substr(0,3);
                    }
                    tempThis.val(numberValue);
                }
            } else {
                var tempReg = /^\d\d\d(,\d\d\d)*$/;
                if(!tempReg.test(value)){
                    numberValue = numberValue.match(/\d\d\d(,\d\d\d)*/);
                    if(numberValue==null){
                        numberValue = "";
                    }else{
                        numberValue = numberValue[0];
                    }
                    tempThis.val(numberValue);
                }
            }
        }
        tempThis = null;
    }
    $.fn.extend({
        onlyNumber : function (obj){
            //限制为只给输入框绑定事件。
            if(this[0] && this[0].nodeName  && this[0].nodeName.toUpperCase() == "INPUT"){
                if(this.prop("type")=="text"){
                    var type = obj.numberType, decimalDigit = obj.decimalDigit;
                    if(isNaN(decimalDigit)){
                        decimalDigit = null;
                    }
                    if(type=="delete"){
                        this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                    }else{
                        if(type=='percent'){
                            this.unbind("keyup",percentFunctionKeyUp).unbind("blur",percentFunctionBlur);
                            this.bind("keyup",percentFunctionKeyUp).bind("blur",percentFunctionBlur);
                        }else if(type=="thousandth"){
                            this.unbind("keyup",thousandthFunctionKeyUp).unbind("blur",thousandthFunctionBlur);
                            this.bind("keyup",thousandthFunctionKeyUp).bind("blur",thousandthFunctionBlur);
                        }else{
                            var onlyNumber = {};
                            switch(type){
                                case "int" : {
                                    onlyNumber.start = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                    onlyNumber.end = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                    onlyNumber.nonNumber = /[-]+/g;
                                    onlyNumber.type = /^[-+]?\d+$/;
                                    onlyNumber.decimalDigit = decimalDigit;
                                    break;
                                };
                                case "float" : {
                                    onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                    onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                    onlyNumber.nonNumber = /[.-]+/g;
                                    onlyNumber.type = /^[-+]?\d+(\.\d+)?$/;
                                    onlyNumber.decimalDigit = decimalDigit;
                                    break;
                                };
                                default : {
                                    onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                    onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                    onlyNumber.nonNumber = /[.-]+/g;
                                    onlyNumber.type = /^[-+]?\d+$/;
                                    onlyNumber.decimalDigit = decimalDigit;
                                    break;
                                };
                            }
                            this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                            this.bind("keyup",onlyNumber,onlyInputNumber)
                                .bind("blur",onlyNumber,deleteNonNumber);
                        }
                    }
                }
            }
        }
    });
})(jQuery);
