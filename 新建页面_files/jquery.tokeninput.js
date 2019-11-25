/*
 * jQuery Plugin: Tokenizing Autocomplete Text Entry
 * Version 1.6.1
 *
 * Copyright (c) 2009 James Smith (http://loopj.com)
 * Licensed jointly under the GPL and MIT licenses,
 * choose which one suits your project best!
 *
 */
(function ($) {
// Default settings
var DEFAULT_SETTINGS = {
    // Search settings
    method: "GET",
    queryParam: "q",
    searchDelay: 400,
    minChars: 1,
    propertyToSearch: "v", //
    propertyDesc: "d",//lilong 新增属性，鼠标上浮alt部门信息
    jsonContainer: null,
    contentType: "json",

    // Prepopulation settings
    prePopulate: null,
    processPrePopulate: false,

    // Display settings
    hintText: "",
    noResultsText: $.i18n('org.select.people.no.search.result'),
    searchingText: $.i18n('org.select.people.searching'),
    deleteText: "&times;",
    animateDropdown: false,
    placeholder: null,
    theme: null,
    zindex: 999,
    resultsLimit: 10,//最大结果
    maxResultLimit: 50,// 最大检索见过 lilong 2014/05/15

    enableHTML: false,//HTML转义

    resultsFormatter: function(item) {
      var string = item[this.propertyToSearch];
      return "<li>"+ (this.enableHTML ? string : _escapeHTML(string)) +"</li>";
    },

    tokenFormatter: function(item) {
        //var tem = item['d'];//部门信息
      var string = item[this.propertyToSearch];
      //lilong 增加部门信息
      if(typeof item['d'] === "undefined" || item['d'] == "") {
        return "<li>" + (this.enableHTML ? string : _escapeHTML(string)) + "、</li>";//返回结果
      } else {
        return "<li title='"+item['d']+"'>" + (this.enableHTML ? string : _escapeHTML(string)) + "、</li>";//返回结果
      }
    },

    // Tokenization settings
    tokenLimit: null,
    tokenDelimiter: ",",
    preventDuplicates: true,//去重
    tokenValue: "k",//最终结果的取值 lilong改造减少传输，改为k

    // Behavioral settings
    allowFreeTagging: false,
    allowTabOut: false,

    // Callbacks
    onResult: null,
    onCachedResult: null,
    onAdd: null,
    onFreeTaggingAdd: null,
    onDelete: null,
    onReady: null,

    // Other settings
    idPrefix: "token-input-",

    // Keep track if the input is currently in disabled mode
    disabled: false
};

// Default classes to use when theming
var DEFAULT_CLASSES = {
    tokenList: "token-input-list",
    token: "token-input-token",
    tokenReadOnly: "token-input-token-readonly",
    tokenDelete: "token-input-delete-token",
    selectedToken: "token-input-selected-token",
    highlightedToken: "token-input-highlighted-token",
    dropdown: "token-input-dropdown",
    dropdownItem: "token-input-dropdown-item",
    dropdownItem2: "token-input-dropdown-item2",
    selectedDropdownItem: "token-input-selected-dropdown-item",
    inputToken: "token-input-input-token",
    focused: "token-input-focused",
    disabled: "token-input-disabled",
    //lilong
    token_error:"token-input-token-error",
    token_dup:"token-input-token-dup"
};

// Input box position "enum"
var POSITION = {
    BEFORE: 0,
    AFTER: 1,
    END: 2
};

// Keys "enum"
var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUMPAD_ENTER: 108,
    COMMA: 188,
    V:86,
    Oemtilde:220
};

var HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

var HTML_ESCAPE_CHARS = /[&<>"'\/]/g;

function coerceToString(val) {
  return String((val === null || val === undefined) ? '' : val);
}

function _escapeHTML(text) {
  return coerceToString(text).replace(HTML_ESCAPE_CHARS, function(match) {
    return HTML_ESCAPES[match];
  });
}

var topWindow = null;
// Additional public (exposed) methods
var methods = {
    init: function(options) {
        //如果屏蔽快速选人，直接屏蔽
        if(getCtpTopFromOpener(window)==null|| getCtpTopFromOpener(window).distroy_token) {
          $("#process_info").bind('click',function(){
              
              var defaultPro = this.getAttribute("defaultValue");
              if(this.value == "" || this.value == defaultPro){
                 createProcessXml("collaboration",getCtpTop(),window,$.ctx.CurrentUser.id,$.ctx.CurrentUser.name,
                  $.ctx.CurrentUser.loginAccountName,"collaboration",$.ctx.CurrentUser.loginAccount,$.i18n('collaboration.newColl.collaboration'));  //协同
              }else{
                  $("#workflow_btn").trigger("click");
              }
           });
          return;
        } else {
            topWindow = getCtpTopFromOpener(window);

            var url_or_data_or_function = "/seeyon/organization/orgIndexController.do?method=index";//默认地址
            var settings = $.extend({}, DEFAULT_SETTINGS, options || {});
            return this.each(function () {
                $(this).data("settings", settings);
                $(this).data("tokenInputObject", new $.TokenList(this, url_or_data_or_function, settings));
            });
        }
    },
    clear: function() {
        this.data("tokenInputObject").clear();
        return this;
    },
    add: function(item) {
        this.data("tokenInputObject").add(item);
        return this;
    },
    remove: function(item) {
        this.data("tokenInputObject").remove(item);
        return this;
    },
    get: function() {
        var t = this.data("tokenInputObject");
        if(t == null){
            return null;
        }
        return t.getTokens();
    },
    toggleDisabled: function(disable) {
        this.data("tokenInputObject").toggleDisabled(disable);
        return this;
    },
    setOptions: function(options){
        $(this).data("settings", $.extend({}, $(this).data("settings"), options || {}));
        return this;
    },
    destroy: function () {
        if(this.data("tokenInputObject")){
            this.data("tokenInputObject").clear();
            var tmpInput = this;
            var closest = this.parent();
            closest.empty();
            tmpInput.show();
            closest.append(tmpInput);
            // lilong wangchw 0326
            $("#process_info").bind('click',function(){
                $("#workflow_btn").trigger("click");
                  /*createProcessXml("collaboration",getCtpTop(),window,$.ctx.CurrentUser.id,$.ctx.CurrentUser.name,
                             $.ctx.CurrentUser.loginAccountName,"collaboration",$.ctx.CurrentUser.loginAccount,$.i18n('collaboration.newColl.collaboration'));  //协同
*/              });

            return tmpInput;
        }
    }
};

// Expose the .tokenInput function to jQuery as a plugin
$.fn.tokenInput = function (method) {
    // Method calling and initialization logic
    if(methods[method]) {
        result =  methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
        result = methods.init.apply(this, arguments);
    }
    return result;
};

// TokenList class for each input
$.TokenList = function (input, url_or_data, settings) {
    //
    // Initialization
    //

    // Configure the data source
    if($.type(url_or_data) === "string" || $.type(url_or_data) === "function") {
        // // Set the url to query against
        // $(input).data("settings").url = url_or_data;

        // // If the URL is a function, evaluate it here to do our initalization work
        // var url = computeURL();

        // // Make a smart guess about cross-domain if it wasn't explicitly specified
        // if($(input).data("settings").crossDomain === undefined && typeof url === "string") {
        //     if(url.indexOf("://") === -1) {
        //         $(input).data("settings").crossDomain = false;
        //     } else {
        //         $(input).data("settings").crossDomain = (location.href.split(/\/+/g)[1] !== url.split(/\/+/g)[1]);
        //     }
        // }
        var start1 = +new Date();
        var stop1;
        if(window.console) {
            console.log("加载耗时计时开始");
        }
        /****lilong****/
        /*
        $.ajax(url_or_data, {
        	cache:false,
            dataType: "json"
          }).done(function(data) {
          });
          */ //不用ajax，直接用script标签
        
        if("undefined" != typeof orgIndexData){
        	$(input).data("settings").local_data = orgIndexData;
        }
        /********/
        stop1 = +new Date();
        if(window.console) {
            console.log("加载耗时"+(stop1-start1));
        }
    } else if(typeof(url_or_data) === "object") {
        // Set the local data to search through
        $(input).data("settings").local_data = url_or_data;
    }
    var $input = $(input);
    var settings = $input.data("settings");
    // Build class names
    if(settings.classes) {
        // Use custom class names
        $input.data("settings").classes = $.extend({}, DEFAULT_CLASSES, $input.data("settings").classes);
    } else if(settings.theme) {
        // Use theme-suffixed default class names
        $input.data("settings").classes = {};
        $.each(DEFAULT_CLASSES, function(key, value) {
            $input.data("settings").classes[key] = value + "-" + $input.data("settings").theme;
        });
    } else {
        $input.data("settings").classes = DEFAULT_CLASSES;
    }

    // Save the tokens
    var saved_tokens = [];

    // Keep track of the number of tokens in the list
    var token_count = 0;

    // Basic cache to save on db hits
    var cache = new $.TokenList.Cache();

    // Keep track of the timeout, old vals
    var timeout;
    var input_val;

    // Create a new text input an attach keyup events // 将原来的input隐藏重新生成input处 lilong
    var input_box = $('<input type="text"  autocomplete="off" autocapitalize="off" style="width: 400px;color:#b0b0b0;outline: none" '
        +'id="'+ $(input).data("settings").idPrefix + input.id +'" '
        +'value="' + $.i18n('org.index.input.label.js') + '"'
        +'>')
        // .css({
        //     outline: "none",
        //     width: 400,
        //     color:"#b0b0b0"
        // })
        // .attr("id", $(input).data("settings").idPrefix + input.id)
        // .val($.i18n('org.index.input.label.js'))
        .click(function() {
            // lilong 点击出现最近联系人列表 20140221
            showRecentDatas();
        })
        .focus(function () {
            if ($input.data("settings").disabled) {
                return false;
            } else
            if ($input.data("settings").tokenLimit === null || $input.data("settings").tokenLimit !== token_count) {
                show_dropdown_hint();
            }
            token_list.addClass($input.data("settings").classes.focused);
        })
        .blur(function () {
            hide_dropdown();

            if ($input.data("settings").allowFreeTagging) {
              add_freetagging_tokens();
            }

            $(this).val("");
            token_list.removeClass($input.data("settings").classes.focused);
        })
        .bind("keyup blur input propertychange", resize_input)
        // .keyup(function (event) { // 新增行
        //     switch(event.keyCode) { 
        //           //case KEY.LEFT:
        //           //case KEY.RIGHT:
        //           case KEY.UP:
        //           case KEY.DOWN:
        //                break;
        //           default:
        //                setTimeout(function(){do_search();}, $(input).data("settings").searchDelay); 
        //     }
        // })
        .keyup(function (event) {
            var previous_token;
            var next_token;

            switch(event.keyCode) {
                //case KEY.LEFT:
                //case KEY.RIGHT:
                case KEY.UP:
                case KEY.DOWN:
                    if(!$(this).val()) {
                        previous_token = input_token.prev();
                        next_token = input_token.next();

                        if((previous_token.length && previous_token.get(0) === selected_token) 
                            || (next_token.length && next_token.get(0) === selected_token)) {
                            // Check if there is a previous/next token and it is selected
                            if(event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) {
                                deselect_token($(selected_token), POSITION.BEFORE);
                            } else {
                                deselect_token($(selected_token), POSITION.AFTER);
                            }
                        } else if((event.keyCode === KEY.LEFT || event.keyCode === KEY.UP) && previous_token.length) {
                            // We are moving left, select the previous token if it exists
                            select_token($(previous_token.get(0)));
                        } else if((event.keyCode === KEY.RIGHT || event.keyCode === KEY.DOWN) && next_token.length) {
                            // We are moving right, select the next token if it exists
                            select_token($(next_token.get(0)));
                        }
                    } else {
                        var dropdown_item = null;

                        if(event.keyCode === KEY.DOWN || event.keyCode === KEY.RIGHT) {
                            dropdown_item = $(selected_dropdown_item).next();
                        } else {
                            dropdown_item = $(selected_dropdown_item).prev();
                        }

                        if(dropdown_item.length) {
                            select_dropdown_item(dropdown_item);
                        }
                    }
                    return false;
                    break;

                case KEY.BACKSPACE:
                    previous_token = input_token.prev();

                    if(!$(this).val().length) {
                        if(selected_token) {
                            delete_token($(selected_token));
                            hidden_input.change();
                        } else if(previous_token.length) {
                            select_token($(previous_token.get(0)));
                        }

                        return false;
                    } else if($(this).val().length === 1) {
                        hide_dropdown();
                    } else {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function(){do_search();}, $(input).data("settings").searchDelay);
                    }
                    break;

                case KEY.TAB:
                case KEY.ENTER:
                case KEY.NUMPAD_ENTER:
                case KEY.COMMA:
                  if(selected_dropdown_item) {
                    add_token($(selected_dropdown_item).data("tokeninput"));
                    hidden_input.change();
                  } else {
                    if ($(input).data("settings").allowFreeTagging) {
                      if($(input).data("settings").allowTabOut && $(this).val() === "") {
                        return true;
                      } else {
                        add_freetagging_tokens();
                      }
                    } else {
                      $(this).val("");
                      if($(input).data("settings").allowTabOut) {
                        return true;
                      }
                    }
                    event.stopPropagation();
                    event.preventDefault();
                  }
                  return false;

                case KEY.ESCAPE:
                  hide_dropdown();
                  return true;
                // 使用监控input的属性变化来支持复制粘贴
                //case KEY.Oemtilde://监听顿号 0317 与杨园确认，不需要监听顿号，没有匹配到的不允许输入
                // case KEY.V://ctrl+V粘贴 lilong 0318
                //   if(String.fromCharCode(event.which)) {
                //         setTimeout(function(){validateTokenInner();}, 5);
                //     }
                //     break;
                default:
                    if(String.fromCharCode(event.which)) {
                        // set a timeout just long enough to let this function finish.
                        setTimeout(function(){do_search();}, $(input).data("settings").searchDelay);
                    }
                    break;
            }
        });

    // 在input后面追加一个span，是选人的图标 0326 lilong
    $("#process_info_div").append("<span id='process_info_select_people' title='"+$.i18n('org.index.select.people.label.js')+"' class='ico16 selection_16'></span>");
    $("#process_info_div").css({
        position: 'relative',
        height: 20
    }).find(".ico16").css({
        position: 'absolute',
        right: 5,
        bottom: 5,
        'z-index': 2
    });
    $("#process_info_select_people").bind('click',function(){
        createProcessXml("collaboration",getCtpTop(),window,$.ctx.CurrentUser.id,$.ctx.CurrentUser.name,
              $.ctx.CurrentUser.loginAccountName,"collaboration",$.ctx.CurrentUser.loginAccount,
              $.i18n('collaboration.newColl.collaboration'),null,null,
              true,"",getNormalData("process_info"));  //协同
    });

    // Keep reference for placeholder
    if (settings.placeholder)
        input_box.attr("placeholder", settings.placeholder)

    // Keep a reference to the original input box
    var hidden_input = $input
                           .hide()
                           .val("")
                           .focus(function () {
                               focus_with_timeout(input_box);
                           })
                           .blur(function () {
                               input_box.blur();
                               //return the object to this can be referenced in the callback functions.
                               return hidden_input;
                           });

    // Keep a reference to the selected token and dropdown item
    var selected_token = null;
    var selected_token_index = 0;
    var selected_dropdown_item = null;

    // The list to store the token items in
    var token_list = $("<ul />")

        .addClass($input.data("settings").classes.tokenList)
        .click(function (event) {
            var li = $(event.target).closest("li");
            if(li && li.get(0) && $.data(li.get(0), "tokeninput")) {
                toggle_select_token(li);
            } else {
                // Deselect selected token
                if(selected_token) {
                    deselect_token($(selected_token), POSITION.END);
                }

                // Focus input box
                focus_with_timeout(input_box);
            }
        })
        .dblclick(function (event){//双击修改 0325 lilong
            var li = $(event.target).closest("li");
            if(li && li.get(0) && $.data(li.get(0), "tokeninput")) {
                dbl_edit_inserted_token(li);
            }
        }) 
        .mouseover(function (event) {
            var li = $(event.target).closest("li");
            if(li && selected_token !== this) {
                li.addClass($(input).data("settings").classes.highlightedToken);
            }
        })
        .mouseout(function (event) {
            var li = $(event.target).closest("li");
            if(li && selected_token !== this) {
                li.removeClass($(input).data("settings").classes.highlightedToken);
            }
        })
        .insertBefore(hidden_input);

    // The token holding the input box
    var input_token = $("<li />")
        .addClass($(input).data("settings").classes.inputToken)
        .appendTo(token_list)
        .append(input_box);

    // The list to store the dropdown items in
    var dropdown = $('<div class="' + $(input).data("settings").classes.dropdown + '"></div>')
        // .addClass($(input).data("settings").classes.dropdown)
        .appendTo("body")
        .hide();
    // 为了盖住word 正文编辑器增加一个 iframe
    var token_input_frame = $('<iframe class="tokeninput_iframe" src="about:blank" frameborder="0"></iframe>')
        .appendTo('body');

    // Magic element to help us resize the text input
    var input_resizer = $("<tester/>")
        .insertAfter(input_box)
        .css({
            position: "absolute",
            top: -9999,
            left: -9999,
            width: "auto",
            fontSize: input_box.css("fontSize"),
            fontFamily: input_box.css("fontFamily"),
            fontWeight: input_box.css("fontWeight"),
            letterSpacing: input_box.css("letterSpacing"),
            whiteSpace: "nowrap"
        });

    // Pre-populate list if items exist
    hidden_input.val("");
    var li_data = $(input).data("settings").prePopulate || hidden_input.data("pre");
    if($(input).data("settings").processPrePopulate && $.isFunction($(input).data("settings").onResult)) {
        li_data = $(input).data("settings").onResult.call(hidden_input, li_data);
    }
    if(li_data && li_data.length) {
        $.each(li_data, function (index, value) {
            insert_token(value);
            checkTokenLimit();
            input_box.attr("placeholder", null)
        });
    }

    // Check if widget should initialize as disabled
    if ($(input).data("settings").disabled) {
        toggleDisabled(true);
    }

    // Initialization is done
    if($.isFunction($(input).data("settings").onReady)) {
        $(input).data("settings").onReady.call();
    }

    //
    // Public functions
    //

    this.clear = function() {
        token_list.children("li").each(function() {
            if ($(this).children("input").length === 0) {
                delete_token($(this));
            }
        });
    };

    this.add = function(item) {
        add_token(item);
    };

    this.remove = function(item) {
        token_list.children("li").each(function() {
            if ($(this).children("input").length === 0) {
                var currToken = $(this).data("tokeninput");
                var match = true;
                for (var prop in item) {
                    if (item[prop] !== currToken[prop]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    delete_token($(this));
                }
            }
        });
    };

    this.getTokens = function() {
        return saved_tokens;
    };

    this.toggleDisabled = function(disable) {
        toggleDisabled(disable);
    };

    // Resize input to maximum width so the placeholder can be seen
    //resize_input();

    //
    // Private functions
    //

    function escapeHTML(text) {
      return $(input).data("settings").enableHTML ? text : _escapeHTML(text);
    }

    // Toggles the widget between enabled and disabled state, or according
    // to the [disable] parameter.
    function toggleDisabled(disable) {
        if (typeof disable === 'boolean') {
            $(input).data("settings").disabled = disable
        } else {
            $(input).data("settings").disabled = !$(input).data("settings").disabled;
        }
        input_box.attr('disabled', $(input).data("settings").disabled);
        token_list.toggleClass($(input).data("settings").classes.disabled, $(input).data("settings").disabled);
        // if there is any token selected we deselect it
        if(selected_token) {
            deselect_token($(selected_token), POSITION.END);
        }
        hidden_input.attr('disabled', $(input).data("settings").disabled);
    }

    function checkTokenLimit() {
        if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
            input_box.hide();
            hide_dropdown();
            return;
        }
    }

    function resize_input() {
        setTimeout(function(){resize_input_real();}, 100);
    }

    function resize_input_real() {
        input_val = input_box.val();
        if(input_val == "") {return;}
        input_box.width(100);
        // Get width left on the current line
        // var width_left = token_list.width() - input_box.offset().left - token_list.offset().left;
        // // Enter new content into resizer and resize input accordingly
        // input_resizer.html(_escapeHTML(input_val) || _escapeHTML(settings.placeholder));
        // // Get maximum width, minimum the size of input and maximum the widget's width
        // input_box.width(Math.min(token_list.width(), Math.max(width_left, input_resizer.width() + 30)));

        //右键复制和ctrl+v粘贴过来的值
        if(input_val.indexOf("、") > -1 || input_val.indexOf(",") > -1 || input_val.indexOf("，") > -1) {
            validateTokenInner();
        }
    }

    /**
    * lilong 0318
    * 用于监听复制粘贴过来的内容
    * 将错误的变颜色
    */
    function validateTokenInner() {
        input_val = input_val.replace(/,/g,"、");
        input_val = input_val.replace(/，/g,"、");
        $.ajax({
          url:"/seeyon/organization/orgIndexController.do?method=checkFromCopy",
          type:'POST',
          dataType: "json",
          data:{
            "cData":input_val
          },
          success:function(data){
            if(data) {
                var obj = eval(data);
                for(var i=0;i<data.length;i++) {
                    if(obj[i].s == "1") {//错误
                        add_error_token(obj[i]);
                    } else if(obj[i].s == "2") {//重名
                        add_dup_token(obj[i]);
                    } else {//正常
                        add_token(obj[i]);
                    }
                }
            }
          }
        });
    }

    function is_printable_character(keycode) {
        return ((keycode >= 48 && keycode <= 90) ||     // 0-1a-z
                (keycode >= 96 && keycode <= 111) ||    // numpad 0-9 + - / * .
                (keycode >= 186 && keycode <= 192) ||   // ; = , - . / ^
                (keycode >= 219 && keycode <= 222));    // ( \ ) '
    }

    function add_freetagging_tokens() {
        var value = $.trim(input_box.val());
        var tokens = value.split($(input).data("settings").tokenDelimiter);
        $.each(tokens, function(i, token) {
          if (!token) {
            return;
          }

          if ($.isFunction($(input).data("settings").onFreeTaggingAdd)) {
            token = $(input).data("settings").onFreeTaggingAdd.call(hidden_input, token);
          }
          var object = {};
          object[$(input).data("settings").tokenValue] = object[$(input).data("settings").propertyToSearch] = token;
          add_token(object);
        });
    }

    // 重复数据，变颜色
    function insert_dup_token(item) {
        var $this_token = $($(input).data("settings").tokenFormatter(item));
        $this_token.addClass($(input).data("settings").classes.token_dup);
        $this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);

        // Store data on the token
        $("<span>" + $(input).data("settings").deleteText + "</span>")
          .addClass($(input).data("settings").classes.tokenDelete)
          .appendTo($this_token)
          .click(function () {
              if (!$(input).data("settings").disabled) {
                  delete_token($(this).parent());
                  hidden_input.change();
                  return false;
              }
          });

        input_box.width(80);//输入完成后重置input的宽度
        // Check the token limit
        if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
            input_box.hide();
            hide_dropdown();
        }

        return $this_token;
    }

    // 错误数据，变颜色
    function insert_error_token(item) {
        var $this_token = $($(input).data("settings").tokenFormatter(item));
        $this_token.addClass($(input).data("settings").classes.token_error);
        $this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);
        $("<span>" + $(input).data("settings").deleteText + "</span>")
          .addClass($(input).data("settings").classes.tokenDelete)
          .appendTo($this_token)
          .click(function () {
              if (!$(input).data("settings").disabled) {
                  delete_token($(this).parent());
                  hidden_input.change();
                  return false;
              }
          });

        input_box.width(80);//输入完成后重置input的宽度
        // Check the token limit
        if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
            input_box.hide();
            hide_dropdown();
        }
        return $this_token;
    }

    // Inner function to a token to the list
    function insert_token(item) {
        var $this_token = $($(input).data("settings").tokenFormatter(item));
        var readonly = item.readonly === true ? true : false;

        //if(readonly) $this_token.addClass($(input).data("settings").classes.tokenReadOnly);

        $this_token.addClass($(input).data("settings").classes.token).insertBefore(input_token);

        // The 'delete token' button
        // lilong 去除删除叉号
        if(!readonly) {
          $("<span>" + $(input).data("settings").deleteText + "</span>")
              .addClass($(input).data("settings").classes.tokenDelete)
              .appendTo($this_token)
              .click(function () {
                  if (!$(input).data("settings").disabled) {
                      delete_token($(this).parent());
                      hidden_input.change();
                      return false;
                  }
              });
        }

        // Store data on the token
        var token_data = item;
        $.data($this_token.get(0), "tokeninput", item);

        // Save this token for duplicate checking
        saved_tokens = saved_tokens.slice(0,selected_token_index).concat([token_data]).concat(saved_tokens.slice(selected_token_index));
        selected_token_index++;

        // Update the hidden input
        update_hidden_input(saved_tokens, hidden_input);

        token_count += 1;
        input_box.width(80);//输入完成后重置input的宽度
        // Check the token limit
        if($(input).data("settings").tokenLimit !== null && token_count >= $(input).data("settings").tokenLimit) {
            input_box.hide();
            hide_dropdown();
        }

        return $this_token;
    }

    // lilong 0324 已经增加的数据双击修改方法
    //先将input框值，然后再删除已经录入的li，然后在focus
    function dbl_edit_inserted_token(token) {
        selected_token = token.get(0);
        var to_search = selected_token.innerHTML;
        to_search = to_search.replace("<span class=\"token-input-delete-token\">×</span>","");
        to_search = to_search.replace(new RegExp("<span class=token-input-delete-token.*?>×</span>","gi"),"");
        to_search = to_search.replace("、","");
        if(to_search.indexOf("(") > -1) {
            to_search = to_search.substr(0,to_search.indexOf("("));//双击修改，去除部门或者单位信息20140331
        }
        
        delete_token(token);//方法内部会清空input框的value

        input_box.val(to_search);
        input_token.insertBefore(token);
        
        tidyTotalData();
        run_search(to_search);

        // Show the input box and give it focus again
        focus_with_timeout(input_box);
    }

    // lilong 增加错误数据方法 完善
    function add_error_token(item) {
        if(item == undefined || item == 'undefined') {
            input_box.val("");
            return;
        }
        var callback = $(input).data("settings").onAdd;

        // Squeeze input_box so we force no unnecessary line break
        input_box.width(0);
        // Insert the new tokens
        if($(input).data("settings").tokenLimit == null || token_count < $(input).data("settings").tokenLimit) {
            insert_error_token(item);
            // Remove the placeholder so it's not seen after you've added a token
            input_box.attr("placeholder", null)
            checkTokenLimit();
        }

        // Clear input box
        input_box.val("");

        // Don't show the help dropdown, they've got the idea
        hide_dropdown();

        // Execute the onAdd callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,item);
        }
    }

    // lilong 增加重复数据 双击修改功能 完善
    function add_dup_token(item) {
        if(item == undefined || item == 'undefined') {
            input_box.val("");
            return;
        }
        var callback = $(input).data("settings").onAdd;

        // Squeeze input_box so we force no unnecessary line break
        input_box.width(0);
        // Insert the new tokens
        if($(input).data("settings").tokenLimit == null || token_count < $(input).data("settings").tokenLimit) {
            insert_dup_token(item);
            // Remove the placeholder so it's not seen after you've added a token
            input_box.attr("placeholder", null)
            checkTokenLimit();
        }

        // Clear input box
        input_box.val("");

        // Don't show the help dropdown, they've got the idea
        hide_dropdown();

        // Execute the onAdd callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,item);
        }
    }

    // Add a token to the token list based on user input
    function add_token (item) {
        if(item == undefined || item == 'undefined') {
            input_box.val("");
            return;
        }
        if(item.k){
          var _value = item.k.substring(0,item.k.lastIndexOf("|"));
          if(_value.indexOf("Member")==0){
        	  $.ajax({type: "POST",
        		  url: encodeURI("/seeyon/organization/orgIndexController.do?method=saveRecentData4OrgIndex&rData="+_value)
        	  });
          }
        }
        var callback = $(input).data("settings").onAdd;

        // See if the token already exists and select it if we don't want duplicates
        if(token_count > 0 && $(input).data("settings").preventDuplicates) {
            var found_existing_token = null;
            token_list.children().each(function () {
                var existing_token = $(this);
                var existing_data = $.data(existing_token.get(0), "tokeninput");
                if(existing_data && existing_data[settings.tokenValue] === item[settings.tokenValue]) {
                    found_existing_token = existing_token;
                    return false;
                }
            });

            if(found_existing_token) {
                select_token(found_existing_token);
                //input_token.insertAfter(found_existing_token);
                focus_with_timeout(input_box);
                return;
            }
        }

        // Squeeze input_box so we force no unnecessary line break
        input_box.width(0);

        // Insert the new tokens
        if($(input).data("settings").tokenLimit == null || token_count < $(input).data("settings").tokenLimit) {
            insert_token(item);
            // Remove the placeholder so it's not seen after you've added a token
            input_box.attr("placeholder", null)
            checkTokenLimit();
        }

        // Clear input box
        input_box.val("");

        // Don't show the help dropdown, they've got the idea
        hide_dropdown();

        // Execute the onAdd callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,item);
        }
    }

    // Select a token in the token list
    function select_token (token) {
        if (!$(input).data("settings").disabled) {

            token.addClass($(input).data("settings").classes.selectedToken);
            selected_token = token.get(0);

            // Hide input box
            input_box.val("");

            // Hide dropdown if it is visible (eg if we clicked to select token)
            hide_dropdown();
        }
    }

    // Deselect a token in the token list
    function deselect_token (token, position) {
        token.removeClass($(input).data("settings").classes.selectedToken);
        selected_token = null;

        if(position === POSITION.BEFORE) {
            input_token.insertBefore(token);
            selected_token_index--;
        } else if(position === POSITION.AFTER) {
            input_token.insertAfter(token);
            selected_token_index++;
        } else {
            input_token.appendTo(token_list);
            selected_token_index = token_count;
        }

        // Show the input box and give it focus again
        focus_with_timeout(input_box);
    }

    // Toggle selection of a token in the token list
    function toggle_select_token(token) {
        var previous_selected_token = selected_token;

        if(selected_token) {
            deselect_token($(selected_token), POSITION.END);
        }

        if(previous_selected_token === token.get(0)) {
            deselect_token(token, POSITION.END);
        } else {
            select_token(token);
        }
    }

    // Delete a token from the token list
    function delete_token (token) {
        // Remove the id from the saved list
        var token_data = $.data(token.get(0), "tokeninput");
        var callback = $(input).data("settings").onDelete;

        var index = token.prevAll().length;
        if(index > selected_token_index) index--;

        // Delete the token
        token.remove();
        selected_token = null;

        // Show the input box and give it focus again
        focus_with_timeout(input_box);

        // Remove this token from the saved list
        saved_tokens = saved_tokens.slice(0,index).concat(saved_tokens.slice(index+1));
        if (saved_tokens.length == 0) {
            input_box.attr("placeholder", settings.placeholder)
        }
        if(index < selected_token_index) selected_token_index--;

        // Update the hidden input
        update_hidden_input(saved_tokens, hidden_input);

        token_count -= 1;

        if($(input).data("settings").tokenLimit !== null) {
            input_box
                .show()
                .val("");
            focus_with_timeout(input_box);
        }

        // Execute the onDelete callback if defined
        if($.isFunction(callback)) {
            callback.call(hidden_input,token_data);
        }
    }

    // Update the hidden input box value
    function update_hidden_input(saved_tokens, hidden_input) {
        var token_values = $.map(saved_tokens, function (el) {
            if(typeof $(input).data("settings").tokenValue == 'function')
              return $(input).data("settings").tokenValue.call(this, el);

            return el[$(input).data("settings").tokenValue];
        });
        hidden_input.val(token_values.join($(input).data("settings").tokenDelimiter));

    }

    // Hide and clear the results dropdown
    function hide_dropdown () {
        dropdown.hide().empty();
        token_input_frame.hide();
        selected_dropdown_item = null;
				showOfficeObj();
    }

    function show_dropdown() {
        dropdown
            .css({
                position: "absolute",
                top: token_list.offset().top + token_list.outerHeight(),
                left: $(input_box).offset().left,//0326 下拉框的位移
                width: 200,
                'z-index': $(input).data("settings").zindex
            })
            .show();

        token_input_frame
            .css({
                position: "absolute",
                top: token_list.offset().top + token_list.outerHeight(),
                left: $(input_box).offset().left,
                width: 200
            })
            .show();
				hideOfficeObj();
    }

    function show_dropdown_searching () {
        if($(input).data("settings").searchingText) {
            dropdown.html("<p>" + escapeHTML($(input).data("settings").searchingText) + "</p>");
            show_dropdown();
            token_input_frame.css({
                height:22
            });
        }
    }

    function show_dropdown_hint () {
        if($(input).data("settings").hintText) {
            dropdown.html("<p>" + escapeHTML($(input).data("settings").hintText) + "</p>");
            show_dropdown();
            token_input_frame.css({
                height:22
            });
        }
    }

    var regexp_special_chars = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g');
    function regexp_escape(term) {
        return term.replace(regexp_special_chars, '\\$&');
    }

    // Highlight the query part of the search term
    function highlight_term(value, term) {
        return value.replace(
          new RegExp(
            "(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape(term) + ")(?![^<>]*>)(?![^&;]+;)",
            "gi"
          ), function(match, p1) {
            return "<b>" + escapeHTML(p1) + "</b>";
          }
        );
    }

    function find_value_and_highlight_term(template, value, term) {
        return template.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + regexp_escape(value) + ")(?![^<>]*>)(?![^&;]+;)", "g"), highlight_term(value, term));
    }

    function populate_dropdown_recent (query, results) {
        var height_tokenIfame = 0;
        if(results && results.length) {
            dropdown.empty();
            var dropdown_ul = $("<ul>")
                .appendTo(dropdown)
                .mouseover(function (event) {
                    select_dropdown_item($(event.target).closest("li"));
                })
                .mousedown(function (event) {
                    add_token($(event.target).closest("li").data("tokeninput"));
                    hidden_input.change();
                    return false;
                })
                .hide();
            
            if ($(input).data("settings").resultsLimit && results.length > $(input).data("settings").resultsLimit) {
                results = results.slice(0, $(input).data("settings").resultsLimit);
            }

            $.each(results, function(index, value) {
                var this_li = $(input).data("settings").resultsFormatter(value);

                height_tokenIfame++

                this_li = find_value_and_highlight_term(this_li ,value[$(input).data("settings").propertyToSearch], query);

                this_li = $(this_li).appendTo(dropdown_ul);

                if(index % 2) {
                    this_li.addClass($(input).data("settings").classes.dropdownItem);
                } else {
                    this_li.addClass($(input).data("settings").classes.dropdownItem2);
                }

                if(index === 0) {
                    select_dropdown_item(this_li);
                }

                $.data(this_li.get(0), "tokeninput", value);
            });

            show_dropdown();

            if($(input).data("settings").animateDropdown) {
                dropdown_ul.slideDown("fast");
            } else {
                dropdown_ul.show();
            }
            // 为了挡住office正文
            token_input_frame.css({
                height: dropdown.height()
            });
        } else {
            if($(input).data("settings").noResultsText) {
                dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                show_dropdown();
            }
        }
    }

    // Populate the results dropdown with some results
    function populate_dropdown (query, results) {
        var height_tokenIfame = 0;
        if(results && results.length) {
            dropdown.empty();
            var dropdown_ul = $("<ul>")
                .appendTo(dropdown)
                .mouseover(function (event) {
                    select_dropdown_item($(event.target).closest("li"));
                })
                .mousedown(function (event) {
                    add_token($(event.target).closest("li").data("tokeninput"));
                    hidden_input.change();
                    return false;
                })
                .hide();

            // 为了解决检索性能问题，先分一下页，只取50个结果再按照权限判断
            if (results.length > $(input).data("settings").maxResultLimit) {
                results = results.slice(0, $(input).data("settings").maxResultLimit);
            }

            if(results && results.length) {
            }else{
                if($(input).data("settings").noResultsText) {
                    dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                    show_dropdown();
                    return;
                }
            }
            if ($(input).data("settings").resultsLimit && results.length > $(input).data("settings").resultsLimit) {
                results = results.slice(0, $(input).data("settings").resultsLimit);
            }

            $.each(results, function(index, value) {
                var this_li = $(input).data("settings").resultsFormatter(value);

                height_tokenIfame++

                this_li = find_value_and_highlight_term(this_li ,value[$(input).data("settings").propertyToSearch], query);

                this_li = $(this_li).appendTo(dropdown_ul);

                if(index % 2) {
                    this_li.addClass($(input).data("settings").classes.dropdownItem);
                } else {
                    this_li.addClass($(input).data("settings").classes.dropdownItem2);
                }

                if(index === 0) {
                    select_dropdown_item(this_li);
                }

                $.data(this_li.get(0), "tokeninput", value);
            });

            show_dropdown();

            if($(input).data("settings").animateDropdown) {
                dropdown_ul.slideDown("fast");
            } else {
                dropdown_ul.show();
            }
            // 为了挡住office正文
            token_input_frame.css({
                height: dropdown.height()
            });
        } else {
            if($(input).data("settings").noResultsText) {
                dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                show_dropdown();
            }
        }
    }

    // Highlight an item in the results dropdown
    function select_dropdown_item (item) {
        if(item) {
            if(selected_dropdown_item) {
                deselect_dropdown_item($(selected_dropdown_item));
            }

            item.addClass($(input).data("settings").classes.selectedDropdownItem);
            selected_dropdown_item = item.get(0);
        }
    }

    // Remove highlighting from an item in the results dropdown
    function deselect_dropdown_item (item) {
        item.removeClass($(input).data("settings").classes.selectedDropdownItem);
        selected_dropdown_item = null;
    }

    // Do a search and show the "searching" dropdown if the input is longer
    // than $(input).data("settings").minChars
    function do_search() {
        var query = input_box.val().trim();

        if(query && query.length > 0) {
            if(selected_token) {
                deselect_token($(selected_token), POSITION.AFTER);
            }

            if(query.length >= $(input).data("settings").minChars) {
                show_dropdown_searching();
                clearTimeout(timeout);

                timeout = setTimeout(function(){
                    tidyTotalData();
                    run_search(query);
                }, $(input).data("settings").searchDelay);
            } else {
                hide_dropdown();
            }
        }
    }
    /**
    * lilong 2014/03/10
    * 支持CTRL+V粘贴，根据输入内容的顿号来检索
    */
    function do_search_for_paste() {
        var query = input_box.val();
        //TODO
        query.replaceAll(",","、");
    }

    var results1 = null;
    var results2 = null;
    function tidyTotalData() {
        results1 = new Array();
        results2 = new Array();
        /*
        var totalData = new Array();
        if($(input).data("settings").local_data) {
            totalData = $(input).data("settings").local_data;
            for(var i = 0; i < totalData.length ; i++) {
                if(totalData[i]['v'].indexOf("(") > -1) {
                    results1.push(totalData[i]);// 人员重名带有部门名称或者外单位需要备注外单位名称的人员的集合
                } else {
                    results2.push(totalData[i]);// 本单位不重名人员的结果集合
                }
            }
        }
        */
    }

    /**
    * 优化策略，减少查询的结果集
    * 1.现将结果集缩小成两个 (1)本单位的所有人员集合 (2)外单位的所有人员集合
    * 2.先查询本单位内的所有人，如果结果大于50，则不继续查
    * 3.如果结果不足50，则继续查询外单位的前200个结果
    * 4.如果结果仍然不足50，则继续再查询所有结果
    */
    // Do the actual search
	var hisQueryData = {};
    function run_search(query) {
        if(window.console) {
            console.log("检索计时开始");
        }
		if(hisQueryData[query]){
			populate_dropdown0(hisQueryData[query]);
			return;
		}
        var start = new Date();
        $.ajax({
            url:"/seeyon/organization/orgIndexController.do?method=searchMember",
            type:'POST',
            dataType: "json",
            data:{
                "key":query
              },
            success:function(data){
            	//获取的数据已经从后台经过了校验，最多十条 全部显示即可
              if(data) {
				  hisQueryData[query] = data;
				  populate_dropdown0(data);

              }
            }
          });
        
        var stop = new Date();
        if(window.console) {
            console.log("检索耗时"+(stop-start));
        }
    	
/*        if($(input).data("settings").local_data) {
            var start = +new Date();
            var stop;
            if(window.console) {
                console.log("检索计时开始");
            }
            var results_n = $.grep(results2, function (row) {
                return row['v'].toLowerCase().indexOf(query.toLowerCase()) > -1;
            });

            if($.ctx.CurrentUser.isInternal == false) {//外部人员工作范围最大是本单位，这里是本单位
                populate_dropdown(query, results_n);
            }

            if(results_n.length > $(input).data("settings").maxResultLimit) {
                stop = +new Date();
                if(window.console) {
                    console.log("范围1检索耗时"+(stop-start));
                }
                populate_dropdown(query, results_n);
            } else {
                var results_w = new Array();
                if(results1.length > 200) {
                    for(var j = 0; j < 200 ; j++) {
                        if(results1[j]['v'].substr(0, results1[j]['v'].indexOf("(")).indexOf(query) > -1) {
                            results_w.push(results1[j]);
                        }
                    }
                    $.merge(results_n, results_w);
                    if(results_n.length > $(input).data("settings").maxResultLimit) {
                        stop = +new Date();
                        if(window.console) {
                            console.log("范围2检索耗时"+(stop-start));
                        }
                        populate_dropdown(query, results_n);
                    } else {
                        var results_w2 = new Array();
                        for(var j = 200; j < results1.length ; j++) {
                            if(results1[j]['v'].substr(0, results1[j]['v'].indexOf("(")).indexOf(query) > -1) {
                                results_w2.push(results1[j]);
                            }
                        }
                        stop = +new Date();
                        if(window.console) {
                            console.log("范围3检索耗时"+(stop-start));
                        }
                        $.merge(results_n, results_w2);
                        populate_dropdown(query, results_n);
                    }
                }  else {
                    stop = +new Date();
                    if(window.console) {
                        console.log("范围4检索耗时"+(stop-start));
                    }
                    $.merge(results_n, results1);
                    var results_n = $.grep(results_n, function (row) {
                        return row['v'].toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                    populate_dropdown(query, results_n);
                }
            }

            //cache.add(cache_key, results);
            // if($.isFunction($(input).data("settings").onResult)) {
            //     results = $(input).data("settings").onResult.call(hidden_input, results);
            // }
            //populate_dropdown(query, results);
        }*/
    }
    
    function populate_dropdown0 (results) {
        var height_tokenIfame = 0;
        if(results && results.length) {
            dropdown.empty();
            var dropdown_ul = $("<ul>")
                .appendTo(dropdown)
                .mouseover(function (event) {
                    select_dropdown_item($(event.target).closest("li"));
                })
                .mousedown(function (event) {
                    add_token($(event.target).closest("li").data("tokeninput"));
                    hidden_input.change();
                    return false;
                })
                .hide();

            if(results && results.length) {
            }else{
                dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                show_dropdown();
                return;
            }

            $.each(results, function(index, value) {
                var this_li = $(input).data("settings").resultsFormatter(value);

                height_tokenIfame++

                this_li = $(this_li).appendTo(dropdown_ul);

                if(index % 2) {
                    this_li.addClass($(input).data("settings").classes.dropdownItem);
                } else {
                    this_li.addClass($(input).data("settings").classes.dropdownItem2);
                }

                if(index === 0) {
                    select_dropdown_item(this_li);
                }

                $.data(this_li.get(0), "tokeninput", value);
            });

            show_dropdown();

            if($(input).data("settings").animateDropdown) {
                dropdown_ul.slideDown("fast");
            } else {
                dropdown_ul.show();
            }
            // 为了挡住office正文
            token_input_frame.css({
                height: dropdown.height()
            });
        } else {
            if($(input).data("settings").noResultsText) {
                dropdown.html("<p>" + escapeHTML($(input).data("settings").noResultsText) + "</p>");
                show_dropdown();
            }
        }
    }

    // compute the dynamic URL
    function computeURL() {
        var url = $(input).data("settings").url;
        if(typeof $(input).data("settings").url == 'function') {
            url = $(input).data("settings").url.call($(input).data("settings"));
        }
        return url;
    }

    // Bring browser focus to the specified object.
    // Use of setTimeout is to get around an IE bug.
    // (See, e.g., http://stackoverflow.com/questions/2600186/focus-doesnt-work-in-ie)
    //
    // obj: a jQuery object to focus()
    function focus_with_timeout(obj) {
        setTimeout(function() { obj.focus(); }, 5);
    }

    /**
    * 显示最近10个联系人的下拉框方法
    * lilong
    */
    function showRecentDatas() {
        var input_value = input_box.val();
        if("" != input_value && input_value != $.i18n('org.index.input.label.js')) {
            return;
        } else {
            input_box.val("");
        }
        var recentDatas = null;
        $.ajax("/seeyon/organization/orgIndexController.do?method=getRecentData&time="+new Date().getTime(), {
            dataType: "json"
          }).done(function(data) {
            populate_dropdown_recent('', data);
          });
    }

};

// Really basic cache for the results
$.TokenList.Cache = function (options) {
    var settings = $.extend({
        max_size: 500
    }, options);

    var data = {};
    var size = 0;

    var flush = function () {
        data = {};
        size = 0;
    };

    this.add = function (query, results) {
        if(size > settings.max_size) {
            flush();
        }

        if(!data[query]) {
            size += 1;
        }

        data[query] = results;
    };

    this.get = function (query) {
        return data[query];
    };
};
}(jQuery));


/**
* lilong 改造，追加属性和函数
*/
var token_flowType = 1;//流程类型,默认1并发 并发，串发； 多层 快速录入不支持

/**
* 整理协同发送前的数据最终方法
* 0318 更新
*/
function tidyDatas(inputId,defaultNodeName,defaultNodeLable) {
    if(getCtpTopFromOpener(window)==null || getCtpTopFromOpener(window).distroy_token) {
        return;
    }
    // 快速录入没有选择，要将流程清空，发送前提示流程不能为空
    var inputStr = "#"+inputId;
    var tokenData = new Object();
    tokenData = $(inputStr).tokenInput("get");
    if("" == tokenData || undefined == tokenData || "undefined" == tokenData) {
        return;
    }
    var res = new Object();//TODO lilong
    res.obj = new Array(deal4wfDatas(getTrueValues(tokenData)),token_flowType);
    createProcessXmlCallBack(
        getCtpTop(),res,"collaboration",
        window,$.ctx.CurrentUser.id,$.ctx.CurrentUser.name,
        $.ctx.CurrentUser.loginAccountName,defaultNodeName,
        $.ctx.CurrentUser.loginAccount,defaultNodeLable);

    getCtpTopFromOpener(window).distroy_token = false;
}

/**
* 处理成工作流需要的数据
*/
function getTrueValues(tokenValue) {
    var result = "";
    $.each(tokenValue, function(i) {
        if(i != 0){
            result += ",";
        }
        result += tokenValue[i].k + "|" + tokenValue[i].v;
    });
    return result;
}
/**
* 将快速录入的结果，处理成工作流需要的数据格式
* 0318 修改支持选择所有实体，增加type
*/
function deal4wfDatas(tokenStr) {
    var result = new Array();
    //非空容错
    if("" == tokenStr || undefined == tokenStr || "undefined" == tokenStr) {
        return result;
    }
    
    var topWindow = getCtpTopFromOpener(window);
    var t = tokenStr.trim().split(",");
    $.each(t, function(i){
        // 使用组织模型选人orgDataCenter.js缓存
        var t2 = t[i].split("\|"); //"Member|"+m.getId()+"|"+m.getOrgAccountId()+"|" +m.getName()
        if(t2[0] == "Member"){
            var r = new Object();
            r.id = t2[1];
            r.name = t2[3];
            r.accountId = t2[2];
            r.type = "Member";
            result.push(r);
        }
        else if(t2[0] == "Department_Post") {
            var r = new Object();
            r.id = t2[1];
            var org_entity_dept = topWindow.getObject("Department", t2[1].split("_")[0]+'');
            var org_entity_post = topWindow.getObject("Post", t2[1].split("_")[1]+'');
            r.name = org_entity_dept.name + "-" + org_entity_post.name;
            r.accountId = org_entity_dept.accountId;
            r.type = "Department_Post";
            result.push(r);
        } else {
            var org_entity = topWindow.getObject(t2[0], t2[1]+'');
            if(null == org_entity) {
                topWindow.initOrgModel(t2[2]+"",t2[1]+"","");
                org_entity = topWindow.getObject(t2[0], t2[1]+'');
                // init其他单位的缓存影响本单位前端缓存，新单位取出实体后再load一次本单位，防护性代码
                topWindow.initOrgModel($.ctx.CurrentUser.loginAccount+"", $.ctx.CurrentUser.id+"", "");
            }
            if(org_entity != null) {
                var r = new Object();
                r.id = org_entity.id;
                r.name = org_entity.name;
                r.accountId = org_entity.accountId;
                r.type = t2[0];
								if(t2[0]=="Department"){
									if(t2[4]=="1"){
										r.excludeChildDepartment= true; 
									}else{
										r.excludeChildDepartment= false; 
									}
									r.name = t2[3];
								}
                result.push(r);
            }
        }
    });
    return result;
}
/**
* 为工作流回写数据提供的截取已选数据的方法
*/
function getNormalData(inputId) {
    var inputStr = "#"+inputId;
    var tokenData = $(inputStr).tokenInput("get");
    var result = "";
    if(tokenData.length != 0) {
        tokenStr = getTrueValues(tokenData);
        var t = tokenStr.split(",");
        $.each(t, function(i){
            // 使用组织模型选人orgDataCenter.js缓存
            var t2 = t[i].split("\|");
							if(t2[0]=="Department"){
								result += t2[0]+"|"+t2[1]+"|"+t2[4]+",";
							}else{
								result += t2[0]+"|"+t2[1]+",";
							}
        });
    }
    return result;
}
/**
* 处理选人界面会写回来的数据，变成快速录入的格式的数据
* 要注意已选数据的保存
* inputId 绑定快速录入的input框id
* spRes 选人界面返回的对象
*
* 0318 修改支持选择所有实体，增加type
*/
function dealSPData2Token(inputId, spRes) {
    var topWindow = getCtpTopFromOpener(window);
    var _temp = spRes.obj[0];
    //并发或串发
    token_flowType = spRes.obj[1];
    var inputStr = "#"+inputId;
    //如果是选人或这编辑过多层的直接清空再添加
    $(inputStr).tokenInput("clear");
    $.each(_temp, function(i) {
        if(_temp[i].type == "Department_Post") {
            var tempObj = new Object();
            var org_entity_dept = topWindow.getObject("Department", _temp[i].id.split("_")[0]+'');
            var org_entity_post = topWindow.getObject("Post", _temp[i].id.split("_")[1]+'');

            tempObj.v = org_entity_dept.name + "-" + org_entity_post.name;
            tempObj.k = "Department_Post|" + org_entity_dept.id + "_" + org_entity_post.id;
            tempObj.d = org_entity_dept.name + "-" + org_entity_post.name;

            $(inputStr).tokenInput("add", tempObj);
            return;
        }

        var org_entity = topWindow.getObject(_temp[i].type, _temp[i].id+'');
        if(null == org_entity) {
            topWindow.initOrgModel(_temp[i].accountId+"",_temp[i].id+"","");
            org_entity = topWindow.getObject(_temp[i].type, _temp[i].id+'');
            // init其他单位的缓存影响本单位前端缓存，新单位取出实体后再load一次本单位，防护性代码
            topWindow.initOrgModel($.ctx.CurrentUser.loginAccount+"", $.ctx.CurrentUser.id+"", "");
        }
        if(org_entity != null) {
            var tempObj = new Object();
            if(_temp[i].type == 'Account') {
                tempObj.k = _temp[i].type + "|" + org_entity.id + "|" + org_entity.id;
                tempObj.v = org_entity.name;
            } else {
                tempObj.k = _temp[i].type + "|" + org_entity.id + "|" + org_entity.accountId;
                if($.ctx.CurrentUser.loginAccount != org_entity.accountId) {
                    if(_temp[i].accountShortname) {//防护，有可能取不出来单位简称
                        tempObj.v = org_entity.name + "(" + _temp[i].accountShortname + ")";
                    } else {
                        var org_entity_acc = topWindow.getObject('Account', org_entity.accountId+'');
                        tempObj.v = org_entity.name + "(" + org_entity_acc.shortname + ")";
                    }
                } else {
                    tempObj.v = org_entity.name;
                }
								if(_temp[i].type == 'Department'){
									if(_temp[i].excludeChildDepartment){
										tempObj.k += "|"+_temp[i].name+"|1";
									}else{
										tempObj.k += "|"+_temp[i].name+"|0";
									}
									tempObj.v = _temp[i].name;
								}
            }
            // 增加alt属性，人员则显示部门，非人员不显示
            if(_temp[i].type == 'Member') {
                tempObj.d = org_entity.departmentName;
            } else {
                tempObj.d = '';
            }
            $(inputStr).tokenInput("add", tempObj);
        }
    });
}
/**
* 禁用快速录入组件，并恢复原有input框，用于点击【编辑流程】或选择多层流程后禁用快速录入
* inputId 绑定快速录入的input框id
*/
function disableTokenInput(inputId) {
    var inputStr = "#"+inputId
    $(inputStr).tokenInput("toggleDisabled");
}

/**
* 数据校验对外方法 TODO
*/
function validateTokenOutter(intputId) {

}

/**
* 恢复token的input为原来的内容input
* 调用模版、编辑流程、选人多层
*/
function resumeInput(inputId) {
    var inputStr = "#"+inputId
    $(inputStr).tokenInput("destroy");//禁用快速录入组件
}
/**
* 为工作流提供屏蔽
*/
function dealB4wfEdit(inputId) {
    if(getCtpTopFromOpener(window)==null || getCtpTopFromOpener(window).distroy_token) {
        return;
    }
    tidyDatas("process_info");
    disableTokenInput("process_info");
}

/**
* 为外部提供综合接口，例如没有匹配，或者拷贝错误，等数据错误不允许发协同或者发流程
*/
function allowSent4Outter(){

}

function clickProcessInfoButton() {
    if(getCtpTopFromOpener(window)==null || getCtpTopFromOpener(window).distroy_token) {
        $("#process_info").click();
    } else {
        $("#process_info_select_people").click();
    }
}
