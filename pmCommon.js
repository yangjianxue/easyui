var editIndex = undefined;//判断表格初始化时是否是编辑状态
;(function(){
    if(window.Tools === undefined){
        window.Tools = {};
    };
    /*
     * 功能：textarea再次编辑内容高亮--最大数字计算
     * 创建人：yangjianxue
     * 目前存在问题：当输入框出现滚动时，高亮区不随之滚动
     * 参数：
     * liveEl           绑定的模拟的显示框
     * isHightLight     是否需要高亮，无高亮只计算当前输入字数
     * placeholder      默认提示的文案
     * maxLen           最大可编辑的字数
     * changeCallBack   内容改变后的回调
     * html 案例结构
     * <div class="highLightWrap">
     *      <label class="showTitle">政策依据：</label>
     *      <pre id="policyGist" class="textareaDiv dp_i"></pre>
     *      <textarea name="message" class="showTxtare dp_i" placeholder="请输入政策依据"></textarea>
     *      <span class="showNumWrap">已输入<em class="iptNum">0</em>/300</span>
     *      </div>
     * */
    Tools.ChangeHeightLight = function(){
        var Fn = function(obj){
            this.liveEl = obj.liveEl;
            this.iptEl = $(this.liveEl).parent().find('textarea');
            this.startMst = this.iptEl.val();
            this.startLen = this.startMst.length;
            this.changeMst = '';
            this.changeText = this.startMst;
            this.placeholder = obj.placeholder;
            this.maxLen = obj.maxLen ? obj.maxLen : 300;
            this.isHightLight = obj.isHightLight;
            this.changeCallBack = obj.changeCallBack ? obj.changeCallBack: null;
            this.init();
            this.bindEvent();
        };
        Fn.prototype = {
            init:function(){
                this.iptEl.parent().find('.iptNum').text(this.startLen);
                if(this.isHightLight){
                    this.liveEl.text = this.startMst;
                };
            },
            bindEvent:function(){
                var _this = this;
                if(_this.isHightLight){
                    _this.iptEl.on('keyup',function(){
                        _this.getVal(this);
                        _this.highInput(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                    _this.iptEl.on('change',function(){
                        _this.getVal(this);
                        _this.highInput(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                    _this.iptEl.on('input',function(){
                        _this.getVal(this);
                        _this.highInput(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                }else{
                    _this.iptEl.on('keyup',function(){
                        _this.getVal(this);
                        _this.substrByte(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                    _this.iptEl.on('change',function(){
                        _this.getVal(this);
                        _this.substrByte(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                    _this.iptEl.on('input',function(){
                        _this.getVal(this);
                        _this.substrByte(this);
                        if (_this.changeCallBack !== null) {
                            _this.changeCallBack(this);
                        };
                    });
                };
            },
            getVal:function(el){
                if(this.changeText == this.placeholder){
                    this.liveEl.text() == '';
                };
            },
            highInput:function(el){
                var _this = this,
                    showVal = $(el).val(),
                    endLen = (showVal.length >= _this.maxLen) ? _this.maxLen : showVal.length;
                _this.changeMst = '';
                if(endLen >= _this.maxLen){
                    showVal = showVal.substring(0,_this.maxLen);
                    $(el).val(showVal);
                    $(el).parent().find('.iptNum').text(_this.maxLen);
                    $(_this.liveEl).text().substring(0,_this.maxLen);
                }else{
                    $(el).parent().find('.iptNum').text(endLen);
                };
                for(var i= 0;i<endLen;i++){
                    if(_this.startMst[i] != showVal[i]){
                        _this.changeMst += '<span class="colorF00">'+showVal[i]+'</span>';
                    }else{
                        _this.changeMst += _this.startMst[i];
                    };
                };
                this.changeText = showVal;
                $(this.liveEl).html(_this.changeMst);
            },
            substrByte:function(el){
                var _this = this,
                    curNum = $(el).val().length;
                if(curNum <= _this.maxLen){
                    $(el).parent().find('.iptNum').text(curNum);
                }else{
                    $(el).val($(el).val().substring(0,this.maxLen));
                    $(_this.liveEl).text().substring(0,_this.maxLen);
                };
            }
        };
        return Fn;
    }();
    /*
     * 功能：textarea 输入字数限制 (基于easyui创建的textarea)
     * 创建人：yangjianxue
     * 参数：(3个)
     * 第一个           绑定的input
     * 第二个           默认提示的文案
     * 第三个           最大可编辑的字数
     * html 案例结构
     * <div>
     *      <label>政策依据：</label>
     *      <input id="policyGist" name="message" />
     *      <span>已输入<em class="iptNum">0</em>/<span class="maxNum"></span></span>
     * </div>
     * */
    Tools.ChangeNum = function(el,placeholder,maxNum){
        var elVal = el.val(),     //获取当前内容
            textInpEl = el.parent().find('.textbox-text'),//查找textarea
            placeVal = $(textInpEl).val(),//获取textarea内容
            textInpElVal = $(textInpEl).next().val(),//获取textarea后面input内容
            startFontLen = textInpElVal.length,//获取当前textarea后面input内容长度
            iptNumEl = el.parent().parent().find(".iptNum"); //当前字数的盒子
        var maxNumBox = el.parent().parent().find('.maxNum');
        $(maxNumBox).text(maxNum);
        if(placeVal == placeholder && textInpElVal == ''){
            $(textInpEl).val('');
            startFontLen = 0;
            $(iptNumEl).text(startFontLen);
        }else{
            $(textInpEl).val(textInpElVal);
            $(iptNumEl).text(startFontLen);
        };
        $(textInpEl).on("input",function(){
            var endFontLen=$(this).val().length;
            if(endFontLen <= maxNum){
                $(iptNumEl).text(endFontLen);
            }else{
                $(this).val($(this).val().substring(0,maxNum));
            };
        });
    };

    /*
     * 功能：侧边栏-锚点功能(带返回顶部)
     * 创建人：yangjianxue
     * 参数：
     * tabScrollWrap      可滚动的元素
     * tabShowWrap        当前展示的最大区域
     * pageWrap           当前的page页
     * parentEl           父元素
     * handleEl           锚点元素
     * childPage          每个锚点对应的page
     * showClass          当前锚点样式
     * */
    Tools.tabPoint = function(){
        var Fn = function(obj){
            this.tabScrollWrap = obj.tabScrollWrap ? obj.tabScrollWrap : '';
            this.tabShowWrap = obj.tabShowWrap ? obj.tabShowWrap :'';
            this.pageWrap = obj.pageWrap ? obj.pageWrap : '';
            this.parentEl = obj.parentEl ? obj.parentEl : $('.tabPointWrap');
            this.handleEl = obj.handleEl ? obj.handleEl : $('.tabPoint');
            this.handleAll = obj.handleEl ? obj.handleEl : $('.tabPoint');
            this.childPage = obj.childPage ?obj.childPage :$('.partWrap');
            this.showClass = obj.showClass ? obj.showClass :'cur';
            this.docEl = document.body.scrollTop == 0 ? document.documentElement : document.body;
            this.timer = null;
            this.init();
        };
        Fn.prototype = {
            constructor:Fn,
            init:function(){
                var _this = this,
                    curUrl = window.location.toString(),
                    idName = curUrl.split("#")[1];
                _this.handleEl = _this.handleEl.not('.dp_n');
                _this.throttle(_this.addMouseWheelEvent(),200);//添加滚轮事件

                //如果高度小于滚动的高度
                if(_this.tabScrollWrap.height()+41 < 300){
                    var mt = 264 - (_this.tabScrollWrap.height()+41);
                    _this.tabScrollWrap.css({'marginTop':mt + 'px'});
                }else{
                    _this.scrollInit();
                    _this.throttle(_this.scrollHandle(),2000);
                };
                if(idName){
                    var topNum = $("#"+idName).offset().top;
                    _this.docEl.scrollTop = topNum;
                    for(var i = 0;i< _this.handleEl.length;i++){
                        var curId = $(_this.handleEl[i]).attr('href').slice(1);
                        if(curId == idName){
                            _this.changeClass($(_this.handleEl[i]),$("#"+idName));
                        };
                    };
                }else{
                    _this.changeClass($(_this.handleEl[0]));
                };
                //新建返回顶部按钮隐藏按钮
                _this.createOtherBtn();
                //返回顶部 事件
                $('#returnTopBtn').on('click',function(){
                    _this.returnTopHandle();
                });
                //展示隐藏 事件
                $('#showHide').on('click',function(){
                    _this.showHideHandle(_this);
                });
                for(var i = 0;i<this.handleAll.length;i++){
                    (function(j){
                        $(_this.handleAll[j]).on('click',function(){
                            _this.changeClass.call(_this,$(this));
                        });
                    })(i)
                };

                // //鼠标滑过时显示隐藏侧面三角
                // _this.tabShowWrap.hover(function(){
                //     _this.showArrowFn();
                // },function(){
                //     $('.arrowWrap').addClass('dp_n').removeClass('dp_i');
                // });
            },
            //创建返回顶部按钮隐藏按钮
            createOtherBtn:function(){
                var _this = this,
                    con = '';
                con += '<span id="returnTopBtn" class="returnTopBtn iconfont icon-daoding"></span>';
                con += '<span id="showHide" class="showHideBtn showBtn"></span>';
                _this.parentEl.append(con);
            },
            //返回顶部
            returnTopHandle:function(){
                var _this = this;
                _this.timer = setInterval(function(){
                    _this.docEl.scrollTop -= Math.ceil(_this.docEl.scrollTop * 0.1);
                    if(_this.docEl.scrollTop <= 10){
                        _this.docEl.scrollTop = 0;
                        $(_this.handleEl[0]).addClass(_this.showClass).siblings().removeClass(_this.showClass);
                        clearInterval(_this.timer);
                    };
                },10);
            },
            //隐藏按钮事件
            showHideHandle:function(_this){
                if($('#showHide').hasClass('hideBtn')){
                    $('#showHide').removeClass('hideBtn');
                    _this.handleEl.parent().removeClass('dp_n');
                }else{
                    $('#showHide').addClass('hideBtn');
                    _this.handleEl.parent().addClass('dp_n');
                };
            },
            changeClass:function(el,idEl){
                el.addClass(this.showClass).siblings().removeClass(this.showClass);
            },
            throttle:function(handle, wait){
                var startTime = 0;
                return function(e) {
                    var _this = this,
                        args = arguments,
                        curTime = new Date();
                    // 如果达到了规定的触发时间间隔，触发 handler
                    if(curTime - startTime >= wait){
                        handle.apply(_this,args);
                        startTime = curTime;
                    };
                };
            },
            scrollInit:function(){
                var _this = this,
                    totalHeight = _this.pageWrap.height(), //页面总高度
                    winScrollTop = $(window).scrollTop(), //页面滚动的距离
                    smallHeight = _this.tabScrollWrap.height(), //tab的总高度
                    step = winScrollTop * smallHeight/totalHeight,
                    curTop = parseInt(_this.tabScrollWrap.css("top") || 0);
                if (winScrollTop<=0){
                    curTop = 0
                }else{
                    curTop = -step
                };
                _this.tabScrollWrap.css("top",curTop + 'px');
            },
            //返回页面每个元素距离顶部的距离
            returnHeightArr:function(){
                var _this = this,
                    childPageLen = _this.childPage.length,
                    returnHeightArr = [];
                for(var i = 0;i<childPageLen;i++){
                    var pageTop = _this.childPage.eq(i).offset().top;
                    if(_this.childPage.eq(i).hasClass('dp_n')){
                        pageTop = 0;
                    };
                    if(pageTop > 0){
                        returnHeightArr.push(pageTop);
                    };
                };
                return returnHeightArr;
            },
            //页面滚动事件
            scrollHandle:function(event){
                var _this = this,
                    pageHeightArr = _this.returnHeightArr();
                var totalHeight = _this.pageWrap.height(); //页面总高度
                $(window).scroll(function(){
                    //为页面添加页面滚动监听事件
                    var wst =  $(window).scrollTop(); //滚动条距离顶端值
                    for (i=0; i<_this.handleEl.length; i++){             //加循环
                        var pageHeight = $($(_this.handleEl[i]).attr('href')).offset().top;
                        if( pageHeight - wst- 40 <= 0){ //判断滚动条位置
                            $(_this.handleEl[i]).addClass(_this.showClass).siblings().removeClass(_this.showClass);
                            if(i<_this.handleEl.length-7){
                                _this.tabScrollWrap.css("top",-(i*35) + 'px');
                            };
                        };
                    };
                });
                // $(window).scroll(function(){
                //     var before = $(window).scrollTop(),
                //         totalHeight = _this.pageWrap.height(), //页面总高度
                //         winScrollTop = $(window).scrollTop(), //页面滚动的距离
                //         smallHeight = _this.tabScrollWrap.height(), //tab的总高度
                //         step = winScrollTop * smallHeight/totalHeight,//滚动页签滚动的距离
                //         scrollMax = -(_this.tabScrollWrap.height()+60) -_this.tabShowWrap.height(),//滚动页签滚动的最大距离
                //         after = $(window).scrollTop(),
                //         curTop = parseInt(_this.tabScrollWrap.css("top") || 0);
                //     if (before<after) {
                //         before = after;
                //         curTop = -step;
                //     };
                //     if (before>=after) {
                //         before = after;
                //         curTop = -step;
                //     };
                //     if (winScrollTop<=10){
                //         curTop = 0;
                //     }else if (curTop <= scrollMax) {
                //         curTop = scrollMax;
                //     };
                //     if(($(document).scrollTop()+30) >= $(document).height() - $(window).height()){
                //         $(_this.handleEl[pageHeightArr.length-1]).addClass(_this.showClass).siblings().removeClass(_this.showClass);
                //     }else{
                //         for(var i = 0;i<pageHeightArr.length;i++){
                //             if(before >= pageHeightArr[i]){
                //                 $(_this.handleEl[i]).addClass(_this.showClass).siblings().removeClass(_this.showClass);
                //             };
                //         };
                //     };
                //     if(-curTop > (smallHeight+120-400)){
                //         _this.tabScrollWrap.css("top",-(smallHeight+120-400) + 'px');
                //     }else{
                //         _this.tabScrollWrap.css("top",curTop + 'px');
                //     };
                // });
            },
            //添加鼠标滚轮事件
            addMouseWheelEvent: function () {
                var _this = this;
                _this.handleEl.on('mousewheel',function(event){
                    event = event ? event : window.event;
                    event.preventDefault();
                    _this.handlerMouseWheel(event);
                });
            },
            //鼠标滚轮处理程序
            handlerMouseWheel: function (event) {
                var _this = this;
                if (_this.tabScrollWrap.height() > _this.tabShowWrap.height()) {
                    event = event ? event : window.event;
                    //方向    大于0 向上  小于0 向下
                    var currTop = parseInt(_this.tabScrollWrap.css("top") || 0),
                        nextTop = 0,
                        delta = event.originalEvent.wheelDelta || event.originalEvent.detail,
                        scrollH = (_this.tabScrollWrap.height()+60) -_this.tabShowWrap.height();
                    //滚动算法
                    if (delta > 0) {
                        currTop < -35 ? nextTop = currTop + 35 : nextTop = 0;
                        $('.arrowUp').addClass('cur').siblings().removeClass('cur');
                    } else {
                        -currTop < scrollH - 35 ? nextTop = currTop - 35 : nextTop = -scrollH;
                        $('.arrowDown').addClass('cur').siblings().removeClass('cur');
                    };
                    _this.tabScrollWrap.css("top",nextTop + 'px');
                };
            },
            showArrowFn:function(){
                var _this = this,
                    str = '';
                if($('.arrowWrap').length <= 0){
                    str += '<div class="arrowWrap dp_i">'
                        +'<span class="arrowUp cur"><em></em></span>'
                        +'<span class="arrowDown"><em></em></span>'
                        +'</div>';
                    _this.tabShowWrap.append(str);
                }else{
                    $('.arrowWrap').addClass('dp_i').removeClass('dp_n');
                };
            }
        };
        return Fn;
    }();
    /*
     * 功能：侧边栏 - tab切换（锚点初始化以及事件）
     * 创建人：yangjianxue
     * 参数：
     * tabScrollWrap      可滚动的元素
     * tabShowWrap        当前展示的最大区域
     * $tabs              绑定的tab
     * $pages             tab对应的div也签
     * showClass          当前锚点样式
     * callBacks          [数组]，tab点击后对应的回调
     * isTabChange        是否是tab切换（否，需要自定义锚点事件）
     *  html 案例结构
     * <div class="tabScrollWrap">
     *      <div class="tabScrollCon">
     *          <div class="tabWrap">
     *              <div class="tab cur">项目信息</div>
     *              <div class="tab">项目附件</div>
     *              <div class="tab">项目附件</div>
     *              <div class="tab bdNo">实施单位</div>
     *          </div>
     *     </div>
     * </div>
     * */
    Tools.tabSwitch = function(){
        var Fn = function(obj){
            this.tabScrollWrap = obj.tabScrollWrap ? obj.tabScrollWrap : $('.tabWrap');
            this.tabShowWrap = obj.tabShowWrap ? obj.tabShowWrap : $('.tabScrollCon');
            this.$tabs = obj.$tabs ? obj.$tabs : null;
            this.$pages = obj.$pages ? obj.$pages : null;
            this.$pagesParent = obj.$pages ? obj.$pages.parent() : null;
            this.showClass = obj.showClass;
            this.callBacks = obj.callBacks ? obj.callBacks : null;
            this.isTabChange = (obj.isTabChange == false) ? false : true;
            this.loading = {
                //index 当前展示tab页的钩子
                add: function (index) {
                    var $la = this.$pagesParent.find('.loadingArea' +index);
                    if ($la.length != 0) { $la.remove(); };
                    $la = $('<div class="loadingArea' + index + '"">加载中。。。</div>');
                    $la.appendTo(this.$pagesParent).siblings().hide();
                },
                hide: function (index) {
                    var $la = this.$pagesParent.find('.loadingArea' +index);
                    if ($la.css('display') != 'none') {
                        this.tabChangew(index);
                    };
                    $la.remove();
                }
            };
            this.init();
        };
        Fn.prototype = {
            constructor:Fn,
            init:function(){
                var _this = this;
                _this.tabScrollWrap.css('height', (_this.$tabs.length*40+82) + 'px');
                //如果高度小于滚动的高度
                // if(_this.tabScrollWrap.height()+41 < 300){
                //     var mt = 284 - (_this.tabScrollWrap.height()+41);
                //     _this.tabScrollWrap.css({'marginTop':mt + 'px'});
                // };
                // if(_this.tabScrollWrap.height()+41 < 330){
                //     var mt = -(( _this.tabScrollWrap.height()+41) /2);
                //     _this.tabScrollWrap.css({'top':'50%','marginTop':mt + 'px'});
                // };
                if(_this.isTabChange){
                    _this.$tabs.off('click').on('click',function(){
                        var idx = $(this).index();
                        if (typeof _this.callBacks[idx] == 'function') {
                            _this.loading.add.call(_this, idx);
                            _this.callBacks[idx].call(this,function (i) {
                                if(typeof i == 'number'){
                                    _this.loading.hide.call(_this, i);
                                }else{
                                    _this.loading.hide.call(_this, idx);
                                };
                            });
                        } else {
                            _this.tabChangew(idx);
                        };
                    });
                };
                _this.addMouseWheelEvent();//添加滚轮事件
                //新建返回顶部按钮隐藏按钮
                _this.createOtherBtn();
                //展示隐藏 事件
                $('#showHide').on('click',function(){
                    _this.showHideHandle(_this);
                });
                //鼠标滑过时显示隐藏侧面三角
                _this.tabShowWrap.hover(function(){
                    _this.showArrowFn();
                },function(){
                    $('.arrowWrap').addClass('dp_n').removeClass('dp_i');
                });
                _this.showArrowFn();
            },
            tabChangew:function(idx){
                var _this = this;
                _this.$tabs.eq(idx).addClass(_this.showClass).siblings().removeClass(_this.showClass);
                _this.$pages.siblings().hide().eq(idx).show();
            },
            //创建返回顶部按钮隐藏按钮
            createOtherBtn:function(){
                var _this = this,
                    con = '';
                con += '<span id="showHide" class="showHideBtn showBtn"></span>';
                _this.tabShowWrap.parent().append(con);
            },
            //隐藏按钮事件
            showHideHandle:function(_this){
                if($('#showHide').hasClass('hideBtn')){
                    $('#showHide').removeClass('hideBtn');
                    _this.tabShowWrap.removeClass('dp_n');
                }else{
                    $('#showHide').addClass('hideBtn');
                    _this.tabShowWrap.addClass('dp_n');
                };
            },
            //添加鼠标滚轮事件
            addMouseWheelEvent: function () {
                var _this = this;
                _this.$tabs.on('mousewheel',function(event){
                    event = event ? event : window.event;
                    _this.handlerMouseWheel(event);
                    event.preventDefault();
                });
            },
            //鼠标滚轮处理程序
            handlerMouseWheel: function (event) {
                var _this = this;
                if (_this.tabScrollWrap.height() > _this.tabShowWrap.height()) {
                    event = event ? event : window.event;
                    //方向    大于0 向上  小于0 向下
                    var currTop = parseInt(_this.tabScrollWrap.css("top") || 0),
                        nextTop = 0,
                        delta = event.originalEvent.wheelDelta || event.originalEvent.detail,//判断滚轮滚动的方向
                        scrollMax = -(_this.tabScrollWrap.innerHeight() - _this.tabShowWrap.height());//滚动页签滚动的最大距离
                    //滚动算法
                    if (delta > 0) {
                        currTop < -35 ? nextTop = currTop + 35 : nextTop = 0;
                        $('.arrowUp').addClass('cur').siblings().removeClass('cur');
                    } else {
                        currTop > scrollMax ? nextTop = currTop - 35 : nextTop = scrollMax;
                        $('.arrowDown').addClass('cur').siblings().removeClass('cur');
                    };
                    _this.tabScrollWrap.css("top",nextTop + 'px');
                };
            },
            showArrowFn:function(){
                var _this = this,
                    str = '';
                if($('.arrowWrap').length <= 0){
                    str += '<div class="arrowWrap dp_i">'
                        +'<span class="arrowUp cur"><em></em></span>'
                        +'<span class="arrowDown"><em></em></span>'
                        +'</div>';
                    _this.tabShowWrap.append(str);
                }else{
                    $('.arrowWrap').addClass('dp_i').removeClass('dp_n');
                };
            }
        };
        return Fn;
    }();
    /*
     * 功能：侧边栏 - tab切换(下一步调用)
     * 创建人：yangjianxue
     * 参数：
     * idx      当前锚点的index
     * el        锚点元素 （默认为$(.tab)）
     * elParent              锚点的父级元素
     * pageEl             锚点对应的div的父级*/
    Tools.changeTab = function(obj){
        idx = obj.idx;
        el = obj.el ? obj.el : $('.tab');
        elParent = obj.elParent;
        pageEl = obj.pageEl;
        el.siblings().removeClass('cur').eq(idx).addClass('cur');
        pageEl.children().hide().eq(idx).show();
        var scrollTop = -(20*idx);
        if(elParent.height() - Math.abs(scrollTop) > 300){
            elParent.css('top',scrollTop);
        };
    };
    /*
     * 功能：返回url参数值(支持中文参数值)
     * 创建人：yangjianxue
     * 参数：2个
     * 第一个             需要获取的参数的名称
     * 第二个             指定的url(省略时直接获取当前url参数)
     * */
    Tools.getUrlArgVal = function(name,str){
        str = ((typeof str == 'string') && (str != '')) ? str : window.location.href;
        var vars = [],
            hashes = str.split('?')[1].split('&');
        if(hashes){
            for(var i = 0;i<hashes.length;i++){
                var hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            };
        };
        if(vars[name]){
            return decodeURI(decodeURI(vars[name]));
        }else{
            return undefined;
        };
    };
    /*
     * 功能：修改表格内的checked样式，需在onLoadSuccess 回调中引用
     * 创建人：yangjianxue
     * 参数：
     * datagridName       绑定的表格，
     * isHideTdBorder     是否去掉边框线
     * headTrBackground     标题行背景色
     * bodyOddTrBackground  奇数行背景色
     * bodyEvenTrBackground 偶数行背景色
     * isRemoveScroll       是否去掉滚动条
     * */
    Tools.changeCheckSty = function(){
        var Fn = function(obj){
            this.datagridName = obj.datagridName;
            this.datagridParents = this.datagridName.parent().parent('.datagrid-wrap');
            this.checkBoxs = this.datagridParents.find('input[type=checkbox]');
            this.checkLen = this.checkBoxs.length;
            this.isHideTdBorder = obj.isHideTdBorder ? obj.isHideTdBorder : false;
            this.headTrBackground = obj.headTrBackground ? obj.headTrBackground : '#f5f6fa';
            this.bodyOddTrBackground = obj.bodyOddTrBackground ? obj.bodyOddTrBackground :'#fff';
            this.bodyEvenTrBackground = obj.bodyEvenTrBackground ? obj.bodyEvenTrBackground :'#fafbfd';
            this.isRemoveScroll = obj.isRemoveScroll ? obj.isRemoveScroll : false;
            this.init();
        };
        Fn.prototype = {
            constructor:Fn,
            init:function(){
                for(var i = 0;i < this.checkLen;i++){
                    var el = $(this.checkBoxs[i]);
                    var checkboxParent = el.parent();
                    checkboxParent.css('position','relative');
                    el.attr('id',i);
                    checkboxParent.append('<label for="'+ i+'"></label>');
                };
                if(this.isHideTdBorder){
                    this.hideTdBorder();
                };
            },
            hideTdBorder:function(){
                var tr = this.datagridName.datagrid('getPanel').find('div.datagrid-view tr');
                tr.each(function () {
                    var td = $(this).children('td');
                    td.css({"border-width": "0"});
                });
            }
        };
        return Fn;
    }();
    /*
     * 功能：弹窗（简单类提示弹窗/复杂型自定义弹窗）
     * 创建人：yangjianxue
     * 参数：
     * messageType        是否是简单提示类弹窗
     * isSingleBtn        简单类提示弹窗是否是单按钮
     * title              弹窗标题
     * messTxt            弹窗的提示文案
     * iconType           图标类型（successIcon（默认） errorIcon warnIcon tipIcon）
     * closeCallBack      提示类弹窗回调（参数 closeEvent）
     * leftBtnTxt         弹窗左按钮文本
     * rightBtnTxt        弹窗右按钮文本
     * popWidth           弹窗宽度
     * innerHtml          复杂弹窗自定义内容
     * suffix             避免多个弹窗id重复后缀
     * ajaxError          ajax请求 error弹窗（简化简单类弹窗）
     * layerEvent         复杂弹窗按钮回调函数（参数 closeEvent）
     * */
    Tools.popUp = function(){
        var Fn = function(obj){
            this.title = obj.title ? obj.title : '提示信息';   //弹窗标题
            this.messageType = obj.messageType ? obj.messageType : true;   //是否是简单提示类弹窗
            this.isSingleBtn = obj.isSingleBtn ? obj.isSingleBtn : false; //简单类提示弹窗是否是单按钮
            this.messTxt = obj.messTxt ? obj.messTxt : '';   //提示类弹窗文本
            this.iconType = obj.iconType ? obj.iconType : 'successIcon';  //提示类弹窗图标
            this.leftBtnTxt = obj.leftBtnTxt ? obj.leftBtnTxt : '取消';  //提示类弹窗左按钮文本
            this.rightBtnTxt = obj.rightBtnTxt ? obj.rightBtnTxt : '确定';  //提示类弹窗右按钮文本
            this.cancleCallBack = obj.cancleCallBack ? obj.cancleCallBack : null;//提示类弹窗取消按钮回调
            this.closeCallBack = obj.closeCallBack ? obj.closeCallBack :null;  //提示类弹窗确定按钮回调
            this.popWidth = obj.popWidth ? obj.popWidth : 440;  //弹窗宽度
            this.innerHtml = obj.innerHtml ? obj.innerHtml : '';           //复杂弹窗自定义内容
            this.suffix = obj.suffix ? obj.suffix : '';     //避免id重复后缀
            this.layerEvent = obj.layerEvent ? obj.layerEvent : null;   //复杂类弹窗回调
            this.ajaxError = obj.ajaxError ? obj.ajaxError : false;
            this.init();
        };
        Fn.prototype = {
            constructor:Fn,
            init:function(){
                this.popupLayer();
                this.addLayerEvent();
                this.popShadow();
            },
            /*创建遮罩层*/
            popShadow: function () {
                var bodySize = this.getBodySize(),
                    popShadow = '<div id="popShadow'+ this.suffix +'" class="popShadow" style="width:100%;height:' + bodySize.docHeight + 'px;position: absolute;top:0;left:0;opacity:0;filter:alpha(opacity=0) ;z-index: 9998;background-color: #fff;"></div>'
                $('body').append(popShadow);
                this.scrollWheel();
            },
            /*获取当前页面总宽度和高度*/
            getBodySize: function () {
                var bodySize = {};
                bodySize.docWidth = $(document).width();
                bodySize.docHeight = $(window).height() + $(document).scrollTop();
                return bodySize;
            },
            /*创建弹窗层*/
            popupLayer: function () {
                var _this = this,
                    con = '';
                //ajax error回调 弹窗
                if(_this.ajaxError){
                    _this.messTxt = _this.messTxt ? _this.messTxt :'网络错误，请刷新重试!';
                    _this.messageType = true;
                    _this.iconType = "errorIcon";
                    _this.isSingleBtn= true;
                };
                if(!_this.innerHtml){
                    con += '<div id="popWrap'+ _this.suffix +'" class="popCon" style="width:'+ this.popWidth+'px;min-height:188px;">'
                        + '<p class="infoTitle">'+_this.title+'</p>'
                        + '<p class="infoP"><em class="popIcon '+ _this.iconType+'"></em>'+_this.messTxt+'</p>'
                        + '<p class="infoBtnWrap">'
                        +  '<span id="submitBtn'+this.suffix+'" class="projEntityBtn">'+_this.rightBtnTxt+'</span>';
                    if(_this.isSingleBtn){
                        con +=  '';
                    }else{
                        con +=  '<span id="closePopEvent'+this.suffix+'" class="projHollowBtn ml_10">'+_this.leftBtnTxt+'</span></p>';
                    };
                    + '</div>';
                }else{
                    con += '<div id="popLayer'+ _this.suffix +'" class="popWrap" style="position:absolute;top:50%;left:50%;width:'+ this.popWidth+'px;min-height:188px;padding:20px 30px 34px 30px;">'
                        + _this.innerHtml
                        +'</div>'
                        +'</div>';
                };
                $('body').append(con);
                new Tools.dragEl({
                    elem:$('#popWrap' +  _this.suffix)
                });
                _this.bindEvent();
            },
            bindEvent:function(){
                var _this = this;
                $('#closePopEvent'+_this.suffix).on('click',function(){
                    if(_this.cancleCallBack !== null){
                        _this.cancleCallBack(function(){
                            _this.closeLayerEvent();
                        });
                    }else{
                        _this.closeLayerEvent();
                    };
                });
                $('#submitBtn'+_this.suffix).on('click',function(){
                    if(_this.closeCallBack !== null){
                        _this.closeCallBack(function(){
                            _this.closeLayerEvent();
                        });
                    }else{
                        _this.closeLayerEvent();
                    };
                });
            },
            /*添加弹出框内部事件*/
            addLayerEvent: function () {
                var _this = this;
                if (_this.layerEvent !== null) {
                    _this.layerEvent(function () {
                        _this.closeLayerEvent();
                    });
                };
            },
            /*关闭弹出框*/
            closeLayerEvent: function () {
                var popWrap = $('#popWrap' + this.suffix),
                    popShadow = $('#popShadow' + this.suffix);
                popWrap.remove();
                popShadow.remove();
            },
            scrollWheel:function(){
                $(".popShadow").on('mousewheel',function(e){
                    var sl;
                    e = e || window.event;
                    if (navigator.userAgent.toLowerCase().indexOf('msie') >= 0) {
                        event.returnValue = false;
                    }else {
                        e.preventDefault();
                    };
                    if (e.wheelDelta) {
                        sl = e.wheelDelta;
                    } else if (e.detail) {
                        sl = -e.detail;
                    };
                    if (sl < 0) {
                        var x = parseInt($("he").innerHTML);
                        x++;
                    } else {
                        var x = parseInt($("he").innerHTML);
                        x--;
                    };
                    $("he").innerHTML = x;
                });
                if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
                    //firefox不支持onmousewheel
                    var popShadow = document.getElementsByClassName('popShadow')[0];
                    popShadow.addEventListener('DOMMouseScroll',function(e) {
                        var obj = e.target;
                        var onmousewheel;
                        while (obj) {
                            onmousewheel = obj.getAttribute('onmousewheel') || obj.onmousewheel;
                            if (onmousewheel) break;
                            if (obj.tagName == 'BODY') break;
                            obj = obj.parentNode;
                        };
                        if (onmousewheel) {
                            if (e.preventDefault) e.preventDefault();
                            e.returnValue = false; //禁止页面滚动
                            if (typeof obj.onmousewheel != 'function') {
                                //将onmousewheel转换成function
                                eval('window._tmpFun = function(event){' + onmousewheel + '}');
                                obj.onmousewheel = window._tmpFun;
                                window._tmpFun = null;
                            };
                            // 不直接执行是因为若onmousewheel(e)运行时间较长的话，会导致锁定滚动失效，使用setTimeout可避免
                            setTimeout(function() {
                                obj.onmousewheel(e);
                            },1);
                        };
                    },false);
                };
            }
        };
        return Fn;
    }();
    /*
     * 功能：元素拖拽
     * 创建人：yangjianxue
     * 参数：
     * elem : 需要移动的元素*/
    Tools.dragEl = function(){
        var Fn = function(obj){
            this.elem = obj.elem;
            this.init();
        };
        Fn.prototype = {
            constructor:Fn,
            init:function(){
                var _this = this,
                    disX,  //向左移动的距离
                    disY,
                    mlDis,  //元素距离左边的外边距
                    mrDis,
                    mtDis,
                    mbDis,
                    rightBorder,//元素到左边的边界
                    leftBorder,
                    topBorder,
                    bottomBorder;
                $(document).on('mousedown',_this.elem,function(e){
                    _this.mouseDown(e)
                });
            },
            mouseDown:function(e){
                var _this = this,
                    event = e || window.event;
                disX = event.clientX - parseInt(_this.getStyle(_this.elem,'left'));
                disY = event.clientY - parseInt(_this.getStyle(_this.elem,'top'));
                mlDis = parseInt(_this.elem.css('marginLeft'));
                mrDis = parseInt(_this.elem.css('marginRight'));
                mtDis = parseInt(_this.elem.css('marginTop'));
                mbDis = parseInt(_this.elem.css('marginBottom'));
                leftBorder = -mlDis;
                //右边的边界 = 浏览器宽度 - 元素的宽度（包括内外边距） + 元素距离右边的外边距
                rightBorder = $(document).width() - _this.elem.outerWidth(true)+mrDis;
                topBorder = -mtDis;
                bottomBorder = $(document).height() - _this.elem.outerHeight(true)+mbDis;
                $(document).on('mousemove',_this.elem,function(event){
                    _this.mouseMove(event);
                });
                $(document).on('mouseup',_this.elem,function(event){
                    _this.mouseUp(event);
                });
                return false;//阻止默认事件或冒泡
            },
            mouseMove:function(e){
                var _this = this;
                var ev = e || window.event;
                var newLeft = ev.clientX - disX;
                var newTop = ev.clientY - disY;
                //计算元素的左右边界
                if(newLeft <= leftBorder){
                    newLeft = leftBorder;
                }else if(newLeft >= rightBorder){
                    newLeft = rightBorder;
                };
                // 计算元素的上下边界
                if(newTop <= topBorder){
                    newTop = topBorder;
                }else if(newTop >= bottomBorder){
                    newTop = bottomBorder;
                };
                _this.elem.css({'left':newLeft + 'px','top':newTop+ 'px'});
                return false;//阻止默认事件或冒泡
            },
            mouseUp:function(e){
                var event = e || window.event;
                var _this = this;
                $(document).off('mousemove mouseup');
            },
            getStyle:function(elem,prop){
                elem = elem[0];//转换成dom元素
                if(window.getComputedStyle){
                    return window.getComputedStyle(elem,null)[prop];
                }else{
                    return elem.currenStyle[prop];
                };
            }
        };
        return Fn;
    }();
    /*
     * 功能：判断浏览器类型
     * 创建人：yangjianxue
     * 可选参数如下：
     * Opera   欧朋浏览器
     * FF      火狐浏览器
     * Chrome  谷歌浏览器
     * Safari  safari浏览器
     * IE11    ie11浏览器
     * IE10    ie10浏览器
     * 返回值 是true/false
     * */
    Tools.browserType = function(isTarType){
        var userAgent = window.navigator.userAgent, //取得浏览器的userAgent字符串
            isCurType = '';
        if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
            isCurType =  "Opera";
        }//判断是否Opera浏览器
        else if (userAgent.indexOf("Firefox") > -1) {
            isCurType =  "FF";
        } //判断是否Firefox浏览器
        else if (userAgent.indexOf("Chrome") > -1) {
            isCurType =  "Chrome";
        }//判断是否Chrome浏览器
        else if (userAgent.indexOf("Safari") > -1) {
            isCurType =  "Safari";
        } //判断是否Safari浏览器
        else if (!!window.ActiveXObject || "ActiveXObject" in window){
            //ie10:"Mozilla/5.0(compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"
            //ie11:"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; HCTE; rv:11.0) like Gecko"
            if (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv:11.0") > -1) {
                isCurType =  "IE11";
            };
            if (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("MSIE 10.0") > -1) {
                isCurType =  "IE10";
            };
        };
        var result = isCurType == isTarType ?  true :  false;
        return result;
    };
    /*
     * 功能：深度克隆对象
     * 创建人：yangjianxue
     * 参数：
     * origin   克隆原对象
     * type     被克隆的对象类型 可选参数：[] 或{}
     * target   克隆后的对象，可选
     * */
    Tools.deepClone = function(origin,target){
        var toStr = Object.prototype.toString,
            arrtype = "[object Array]";
        for(var prop in origin){
            if(origin.hasOwnProperty(prop)){
                if(origin[prop] !== null && typeof origin[prop] == "object"){
                    target[prop] = (toStr.call(origin[prop])) == arrtype
                        ? []
                        : {}
                    clone(origin[prop],target[prop]);
                }else{
                    target[prop] = origin[prop];
                };
            };
        };
        return target;
    };
    /*
     * 功能：深度克隆JSON数据
     * 创建人：yangjianxue
     * 参数：
     * val     克隆原对象
     * */
    Tools.cloneData = function(val){
        return JSON.parse(JSON.stringify(val));
    };
    /*
     * 功能：easyui datagrid对初始数据进行处理动态添加合计小计行
     * 创建人：yangjianxue
     * 参数：
     * datas :   原始数据
     * specialField : 区分字段标题行和数据行
     * titleFieldArr : 标题行的集合
     * isDefaultRow:初始化时是否展示默认数据行
     * isTotal ：是否展示合计行，小计行*/
    Tools.easyuiDataInit = function(obj){
        var datas = obj.datas;
        var specialField = obj.specialField ? obj.specialField :'';
        var titleFieldArr = obj.titleFieldArr ? obj.titleFieldArr:'';
        var isDefaultRow = obj.isDefaultRow == true ? true : false;
        var isTotal = obj.isTotal  == false ? false : true;
        var isPfsSpecial = obj.isPfsSpecial == true ? true : false;
        // var firTotalField = obj.columns && obj.columns.columns && obj.columns.columns[0][0].field ? obj.columns.columns[0][0].field :'';
        var result = [];

        // var demo = [];
        if(isPfsSpecial && specialField){
            // var newTitleFieldArr = JSON.parse(JSON.stringify(titleFieldArr));//[1,2]
            for(var u = 0;u<datas.length;u++){
                // 资金明细 区分汇总和细化数据字段：  pfs_type  0，汇总 ；1，细化。
                if(datas[u].pfs_type == 0){
                    var str = {};
                    str.title_field = datas[u][specialField];
                    var c = $.extend(str, datas[u]);
                    result.push(c);
                    continue;
                }else{
                    result.push(datas[u]);
                    continue;
                };
                // if(demo.indexOf(datas[u][specialField]) < 0){
                //     demo.push(datas[u][specialField]);
                //     var str = {};
                //     str.title_field = datas[u][specialField];
                //     var c = $.extend(str, datas[u]);
                //     result.push(c);
                //     continue;
                // }else{
                //     result.push(datas[u]);
                //     continue;
                // };
            };
            if(isTotal){
                result.push({
                    isTotal: true
                });
            };
            return result;
        }else if(specialField){
            var newTitleFieldArr = JSON.parse(JSON.stringify(titleFieldArr));
            for(var m = 0;m<titleFieldArr.length;m++){
                var str = newTitleFieldArr[m];
                str.title_field = titleFieldArr[m][specialField];
                result.push(str);
                if(datas && datas.length > 0) {
                    for(var n = 0;n<datas.length;n++){
                        if(datas[n][specialField] == titleFieldArr[m][specialField]){
                            result.push(datas[n])
                        };
                    };
                }else if(isDefaultRow){
                    result.push(titleFieldArr[m]);
                };
            };
            if(isTotal){
                result.push({
                    isTotal: true
                    // firTotalField:firTotalField
                });
            };
            return result;
        }else{
            if(datas && datas.length > 0){
                result = datas
            }else if(isDefaultRow){
                result.push({});
            };
            if(isTotal){
                result.push({
                    isTotal: true
                });
            };
            return result;
        };
    };
    /*
     * 功能：easyui datagrid 获取列字段上的隐藏的公式字段 并计算
     * 创建人：yangjianxue
     * 参数：
     * idLabel :   表格id
     * calFormula : 携带计算公式和展示字段的数组对象*/
    Tools.getHiddenColField = function(obj){
        var idLabel = obj.idLabel;
        var calFormula = obj.calFormula;
        var opts = idLabel.datagrid('options');
        var calField = [];//需要计算的列和公式
        // console.log(opts.columns)
        for(var k = 0;k<opts.columns.length;k++){
            if(opts.columns[k].length > 0){
                for(var j = 0 ;j<opts.columns[k].length;j++){
                    if(opts.columns[k][j].calFormula){
                        var calArr = [];
                        var str = opts.columns[k][j].calFormula.split(' '); //分割公式
                        for(var b =0;b<str.length;b++){
                            if(!reg.test(str[b])){
                                calArr.push(str[b]);
                            };
                        };
                        calField.push({
                            showField:opts.columns[k][j].field,//公式的结果字段
                            calFormula:opts.columns[k][j].calFormula,//公式
                            calArr:calArr//公式中涉及到的字段
                        });
                    };
                };
            };
        };
        var rows = idLabel.datagrid('getRows');//获取表格所有数据
        for(var m = 0;m<rows.length;m++){//遍历当前表格的每行
            for(var n = 0;n<calField.length;n++){ //遍历公式数组
                var resultStr = Tools.cutCalFn({ //返回需要计算的字符串
                    calField : calField,
                    curRow : rows[m],
                    curCol:calField[n],
                    isAllRow:true
                });
                // rows[m][calField[n].showField] = eval(resultStr);
                rows[m][calField[n].showField] = (new Function("return "+resultStr))(); //计算公式的结果
                idLabel.datagrid('refreshRow', m);

            };
        };
        return calField;
    };
    // /*
    //  * 功能：easyui datagrid 遍历公式变量，返回需要计算的字段所对应的实际值的字符串
    //  * 创建人：yangjianxue
    //  * 参数：
    //  * idLabel :   表格id
    //  * calFormula : 携带计算公式和展示字段的数组对象*/
    Tools.cutCalFn = function(obj){
        var calField = obj.calField;//s承接所有公式的变量
        var curRow = obj.curRow;//当前行
        var curCol = obj.curCol;//当前列
        var isAllRow = obj.isAllRow == false ? false : true;//是否需要重新计算整行的公式
        var curField = obj.curField;//当前编辑的字段（onClickCell的时候需要传递此参数）
        var curFieldNewVal = obj.curFieldNewVal;//编辑后的newValue（onClickCell的时候需要传递此参数）
        var resultStr = '';  //组合新的公式
        if(isAllRow){
            var str =  curCol.calFormula, //当前公式
                newStr =  str.split(' '); //分割公式(通过空格分割)
        }else{
            var newStr = curCol.split(' ');
        };
        for(var k =0;k<newStr.length;k++){
            if(!reg.test(newStr[k])){ //判断当前数组值是否是运算符
                // console.log(rows[m][newStr[k]])//当前这个字段的对应的值
                //parseFloat(curRow[newStr[k]]) - 判断当前行是否有该字段
                if(parseFloat(curRow[newStr[k]])){
                    if(newStr[k] == curField){ //如果当前遍历的字段和正在编辑的字段相同
                        resultStr += curFieldNewVal;//需要计算的字符串 += 编辑完成后的新值
                    }else{
                        resultStr += curRow[newStr[k]];
                    };
                }else{
                    // 当前行是新增行时,没有需要合计展示的字段
                    if(newStr[k] == curField){ //如果当前遍历的字段和正在编辑的字段相同
                        resultStr += curFieldNewVal;//需要计算的字符串 += 编辑完成后的新值
                    }else{
                        resultStr += 0;
                    };
                };
            }else{
                resultStr += newStr[k];
            };
        };
        return resultStr;
    };
    /*
     * 功能：easyui datagrid 总计行计算
     * 创建人：yangjianxue
     * 参数：
     * needCalArr :   需要总计的字段
     * idLabel : 表格id
     * total : 总计的变量*/
    Tools.calculate = function(obj){
        var needCalArr = obj.needCalArr;
        var idLabel = obj.idLabel;
        var total = obj.total;
        var datagridData = obj.datagridData;
        var isSpecialDg = obj.isSpecialDg == true ? true :false;
        for(var j = 0; j < needCalArr.length; j++) {
            total[j] = 0;
        };
        if(isSpecialDg){
            rows = idLabel.datagrid('getRows');//获取所有数据
            lastIndex = rows.length - 1;
            console.log(rows);
            if(rows.length){
                for(var i = 0; i < lastIndex; i++) {
                    if(rows[i].title_field) {
                        for(var rowName in rows[i]) {
                            for(var k = 0; k < needCalArr.length; k++) {
                                if(rowName == needCalArr[k]) {
                                    total[k] += (rows[i][needCalArr[k]] ? parseFloat(rows[i][needCalArr[k]]) : 0);
                                };
                            };
                        };
                    };
                };
            };
        }else{
            var rows = [];
            var lastIndex = 0;
            if(datagridData){
                rows = datagridData;//获取所有数据
                lastIndex = datagridData.length - 1;
            }else{
                rows = idLabel.datagrid('getRows');//获取所有数据
                lastIndex = rows.length - 1;
            };
            if(rows.length){
                for(var i = 0; i < lastIndex; i++) {
                    if(!rows[i].title_field) {
                        for(var rowName in rows[i]) {
                            for(var k = 0; k < needCalArr.length; k++) {
                                if(rowName == needCalArr[k]) {
                                    total[k] += (rows[i][needCalArr[k]] ? parseFloat(rows[i][needCalArr[k]]) : 0);
                                };
                            };
                        };
                    };
                };

            };
        };
        //为总计行赋值
        for(var z = 0; z < needCalArr.length; z++) {
            idLabel.datagrid('getRows')[lastIndex][needCalArr[z]] = total[z];
            idLabel.datagrid('refreshRow', lastIndex);
        };

    };
    /*
     * 功能：easyui datagrid 小计行计算
     * 创建人：yangjianxue
     * 参数：
     * needCalArr :   需要总计的字段
     * idLabel : 表格id
     * total : 总计的变量*/
    Tools.smallCalculate = function(obj){
        var arr = obj.arr;
        var idLabel = obj.idLabel;
        var smallHe = obj.smallHe;
        var titleFieldArr = obj.titleFieldArr;
        var specialField = obj.specialField;
        for(var j = 0; j < arr.length; j++) {
            smallHe[j] = [];
            for(var r = 0; r < titleFieldArr.length; r++){
                smallHe[j][r] = 0;
            };
        };
        var rows = idLabel.datagrid('getRows'),
            lastIndex = rows.length - 1;
        for(var i = 0; i < lastIndex; i++) {
            if(!rows[i].title_field) {
                for(var n = 0; n < arr.length; n++) {
                    for(var rowName in rows[i]) {
                        if(rowName == arr[n]) {
                            for(var j = 0; j < titleFieldArr.length; j++) {
                                if(rows[i][specialField] == titleFieldArr[j][specialField]) {
                                    smallHe[n][j] += (rows[i][arr[n]] ? parseFloat(rows[i][arr[n]]) : 0);
                                };
                            };
                        };
                    };
                };
            };
        };
        var p = 0;
        for(var k = 0; k < lastIndex; k++) {
            if(rows[k]["title_field"]) {
                for(var c = 0; c < arr.length; c++) {
                    idLabel.datagrid('getRows')[k][arr[c]] = smallHe[c][p];
                    idLabel.datagrid('refreshRow', k);
                };
                p++;
            };
        };
    };
    /*
     * 功能：获取当前行索引
     * 创建人：yangjianxue
     * 参数：
     * target :  当前点击的对象*/
    Tools.getRowIndex = function (target) {
        var tr = $(target).closest('tr.datagrid-row');
        return parseInt(tr.attr('datagrid-row-index'));
    };
    /*
     * 功能： 利用 fomatter 小计行
     * 创建人：yangjianxue
     * 参数：无*/
    Tools.littleCol = function (value, row, index) {
        var litCol = '';
        if(index == 0) {
            litCol = '<a>小计</a>';
        } else if(row.title_field) {
            litCol = '<a>小计</a>';
        } else {
            litCol = value;
        };
        return litCol;
    };
    /*
     * 功能： 过滤表格数据去掉标题行和合计行
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class*/
    Tools.filterDataFn = function (idLabel){
        var rows = idLabel.datagrid('getRows'),
            newRows = [];
        //过滤数据
        $.each(rows,function(i,data) {
            idLabel.datagrid('endEdit', i);
            if(!data.title_field && !data.isTotal){
                newRows.push(data)
            };
        });
        return newRows;
    };
    /*
     * 功能： 过滤表格数据去掉标题行和合计行
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class*/
    Tools.filterDataFns = function (obj){
        var idLabel = obj.idLabel;
        var datas = obj.datas;
        var newRows = [];
        // var rows = idLabel.datagrid('getRows'),
        //     newRows = [];
        //过滤数据
        if(datas.length){
            $.each(datas,function(i,data) {
                idLabel.datagrid('endEdit', i);
                if(!data.title_field && !data.isTotal){
                    newRows.push(data)
                };
            });
        };
        return newRows;
    };
    /*
     * 功能： 基于easyui datagrid 合并单元格
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class
     * merges ： 合并单元格的数组对象
     * mergesField ： 需要合并的列字段*/
    Tools.marginCellFn = function(obj){
        var idLabel = obj.idLabel;
        var merges = obj.merges;
        var mergesField = obj.mergesField;
        if(idLabel.length > 0){
            var rows = idLabel.datagrid('getRows'),
                firName = rows[0][mergesField],
                k = 0;
            // var spanLen = 0;
            merges[0]={};
            if(rows && rows.length > 0){
                for(var d = 0;d<rows.length;d++){
                    if(rows[d][mergesField] == firName){
                        if(merges[k].index == undefined){
                            merges[k].index = 0
                        };
                    }else{
                        k++;
                        merges[k]={};
                        merges[k].index = d
                        firName = rows[d][mergesField]
                    };
                    merges[k].rowspan = d-merges[k].index +1;
                };
            };
        };
        for(var i=0; i<merges.length; i++)
            idLabel.datagrid('mergeCells',{
                index:merges[i].index,
                field:mergesField,
                rowspan:merges[i].rowspan
            });
    };
    /*
     * 功能： 基于easyui datagrid 新增行
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class
     * target ： 当前点击对象
     * fieldName ： 区分是哪一个标题下的字段
     * isMerges ： 是否需要合并列
     * merges ： 合并列的数组对象
     * objRow ： 是否有默认隐藏字段
     * mergesField ：需要合并的列字段 */
    Tools.addRow = function(obj){
        var target = obj.target;
        var idLabel = obj.idLabel;
        var fieldName = obj.fieldName;
        var isShowSum = obj.isShowSum == 1 ? true : false;
        var isMerges = obj.isMerges == false ? false : true;
        var merges = obj.merges;
        var objRow = obj.objRow ? obj.objRow :{};
        var mergesField = obj.mergesField;
        if(fieldName){
            var index = Tools.getRowIndex(target) + 1, //当前索引行的下一行
                rows = idLabel.datagrid('getRows'),
                curRow = rows[Tools.getRowIndex(target)];
            if(fieldName.length>=1){
                for(var i=0;i<fieldName.length;i++){
                    objRow[fieldName[i]] = curRow[fieldName[i]];
                };
            };
            $(idLabel).datagrid('insertRow', {
                index: index,
                row:objRow
            });
            if(isMerges){
                Tools.marginCellFn({
                    idLabel:idLabel,
                    merges:merges,
                    mergesField:[mergesField]
                });
            };
        }else{
            if(isShowSum){
                var index = $(idLabel).datagrid('getRows').length-1;
            }else{
                var index = $(idLabel).datagrid('getRows').length;
            };

            $(idLabel).datagrid('insertRow', {
                index: index,
                row:objRow
            });
            if(isMerges){
                Tools.marginCellFn({
                    idLabel:idLabel,
                    merges:merges,
                    mergesField:[mergesField]
                });
            };
        };
    };
    /*
     * 功能： 基于easyui datagrid 删除行
     * 创建人：yangjianxue
     * 参数：
     * target ：当前点击的按钮
     * idLabel ： 表格的id
     * isTotal： 是否需要合并行
     * arr : 需要合并行的字段
     * he ： 合并行总计的变量名
     * smallHe ：合并行小计的变量名
     * fieldName ： 区分是哪一个标题下的字段
     * isMerges ： 是否需要合并行
     * merges ：合并行需要的 merges集合[{index:0;rospan}]
     * mergesField : 需要合并行的字段*/
    Tools.deleteRow = function(obj){
        var target = obj.target;
        var idLabel = obj.idLabel;
        var arr = obj.arr;
        var he = obj.he;
        var smallHe = obj.smallHe;
        var titleFieldArr = obj.titleFieldArr;
        var isTotal = obj.isTotal == false ? false : true;
        var isSmallTotal = obj.isSmallTotal == false ? false : true;
        var fieldName = obj.fieldName;
        var isMerges = obj.isMerges == false ? false : true;
        var merges = obj.merges;
        var mergesField = obj.mergesField;
        new Tools.popUp({
            title: '提示信息',
            messTxt: '确定删除吗',
            iconType: 'warnIcon',
            closeCallBack: function (closeEvent) {
                closeEvent();
                idLabel.datagrid('deleteRow',Tools.getRowIndex(target));
                if(isTotal){
                    Tools.calculate({
                        needCalArr :arr,idLabel:idLabel,total:he
                    });//总计
                };
                if(isSmallTotal){
                    Tools.smallCalculate({
                        arr:arr,idLabel:idLabel,smallHe:smallHe,titleFieldArr:titleFieldArr,specialField:specialField
                    });//小计
                };
                if(isMerges){
                    Tools.marginCellFn({
                        idLabel:idLabel,
                        merges:merges,
                        mergesField:[mergesField]
                    });
                };
            }
        });
    };
    /*
     * 功能： 基于easyui datagrid 判断是否编辑状态
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class*/
    Tools.endEditing = function(idLabel) {
        if(editIndex == undefined) {
            return true;
        };
        if(idLabel.datagrid('validateRow', editIndex)) {
            idLabel.datagrid('endEdit', editIndex);
            editIndex = undefined;
            return true;
        }else{
            return false;
        };
    };
    /*
     * 功能： 基于easyui datagrid 结束正在编辑的行，（有合并功能）
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class
     * isMerges ：是否需要合并
     * merges ： 合并的数据
     * mergesField ： 需要合并的列字段*/
    Tools.endEditingRow = function(obj){
        var idLabel = obj.idLabel;
        var isMerges = obj.isMerges  == false ? false : true;
        var merges = obj.merges;
        var mergesField = obj.mergesField;
        if(Tools.endEditing(idLabel)){
            idLabel.datagrid('endEdit',editIndex);
            if(isMerges){
                Tools.marginCellFn({
                    idLabel:idLabel,
                    merges:merges,
                    mergesField:mergesField
                });
            };
        };
        $(document).on('click',function(e){
            var _con = idLabel;
            if($(e.target).parents().length == 0 && e.target.nodeName == 'HTML'){
                Tools.endEditing(idLabel);
            };
        });
    };
    /*
     * 功能： 基于easyui datagrid 结束正在编辑的行，（有合并功能）
     * 创建人：yangjianxue
     * 参数：
     * idLabel ：表格id/class
     * clickBtnEl ： btn事件
     * isMerges ：是否需要合并
     * merges ： 合并的数据
     * mergesField ： 需要合并的列字段*/
    Tools.blurDatagridFn = function(obj){
        var clickBtnEl = obj.clickBtnEl ? obj.clickBtnEl :'';
        var idLabel = obj.idLabel;
        var isMerges = obj.isMerges  == true ? true : false;
        var merges = obj.merges;
        var mergesField = obj.mergesField;
        if(obj.clickBtnEl){
            clickBtnEl.on('click',function(e){
                if(Tools.endEditing(idLabel)){
                    idLabel.datagrid('endEdit',editIndex);
                };
                var rows = idLabel.datagrid('getRows');
            });
        };
        $(document).on('click',function(e){
            var _con = idLabel;
            if($(e.target).parents().hasClass('datagrid-header')){
                if(Tools.endEditing(idLabel)){
                    idLabel.datagrid('endEdit',editIndex);
                };
            };
            // if(!$(e.target).parents().hasClass('datagrid-body') && $(e.target).parents().hasClass('datagrid-header') && ($(e.target).parent()[0].tagName !=  'TD' && $(e.target)[0].tagName ==  'DIV')  || ($(e.target)[0].tagName ==  'BODY' || $(e.target)[0].tagName ==  'HTML')){
            //     if(Tools.endEditing(idLabel)){
            //         idLabel.datagrid('endEdit',editIndex);
            //     };
            // };
            // if($(e.target)[0].tagName ==  'DIV' || $(e.target)[0].tagName ==  'BODY' || $(e.target)[0].tagName ==  'HTML'){
            //
            // };
        });
        if(isMerges){
            Tools.marginCellFn({
                idLabel:idLabel,
                merges:merges,
                mergesField:mergesField
            });
        };
    };
    /*
     * 功能： 获取录入表
     * 添加人：yangjianxue
     * 参数：
     * menuid ：录入表menuid
     * reportId ： 录入表reportId
     * id : 录入表 id
     * isOpera ：是否需要添加操作行
     * isDefaultRow ：是否需要添加默认数据行 */
    Tools.initReportInfo = function(obj){
        var menuid = obj.menuid;
        var reportId = obj.reportId;
        var id = obj.id;
        var isOpera = obj.isOpera == true ? true : false;//是否需要添加操作行
        var isDefaultRow = obj.isDefaultRow == true ? true : false;//是否需要添加默认数据行
        var currRpEngineObj = {};
        $.ajax({
            url:'/bgt-budget-server/fwRpDesigner/loadRpAll?menuid='+ menuid +'&report_id='+reportId+"&timestamp="+new Date().getTime(),
            type:'GET',
            async:false,
            success:function(data){
            	if(data){
                    rpAll = data.data;
                    // CreateRpWebEngine(rpAll,id,false,0);
                    var currRpEngine = CreateRpWebEngine(rpAll,id,false,1);
                    currRpEngineObj = currRpEngine;
                    var rowIndex = GetDataStartIndex(currRpEngine);//获取数据行开始的行的index
                    var sheetIndex = currRpEngine.Cell.GetCurSheet();//获取当前表页页号
                    if(isOpera){//创建操作列
                        Tools.createOperaHandle({
                            currRpEngine:currRpEngine,
                            sheetIndex: sheetIndex,
                            rowIndex : rowIndex,
                            isDefaultRow:isDefaultRow
                        });
                    }
                };
            },
            error:function(err){
                console.log(err);
            }
        });
        return currRpEngineObj;
    };
    /*
     * 功能： 创建录入表操作列 及绑定事件
     * 添加人：yangjianxue
     * 参数：
     * currRpEngine ：录入表
     * sheetIndex : 录入表 sheetIndex
     * rowIndex : 数据行开始的行的index
     * isDefaultRow ： 是否需要添加默认数据行*/
    Tools.createOperaHandle = function(obj){

        var currRpEngine = obj.currRpEngine;
        var sheetIndex = obj.sheetIndex;
        var rowIndex = obj.rowIndex;
        var isDefaultRow = obj.isDefaultRow == true ? true : false;//是否需要添加默认数据行
        var arr = [];
        currRpEngine.Cell.InsertCol(1, 1, sheetIndex);//插入列
        currRpEngine.Cell.MergeCells(1, 1, 1, rowIndex-3); //将操作行的删除和增加合并
        currRpEngine.Cell.SetCellString(1, 1, sheetIndex, '操作');//标题行添加文字
        currRpEngine.Cell.SetCellBackColor(1, 1,sheetIndex, currRpEngine.Cell.FindColorIndex(15395562, 1));//设置单元格背景颜色
        for(var j=1;j<=rowIndex-2;j++){//行---画表格线
            currRpEngine.Cell.SetCellBorder(1, j,sheetIndex,0,2);
            currRpEngine.Cell.SetCellBorder(1, j,sheetIndex,1,2);
            currRpEngine.Cell.SetCellBorder(1, j,sheetIndex,3,2);
        };
        currRpEngine.Cell.SetCellBorderClr(1,rowIndex-3, sheetIndex, 1, currRpEngine.Cell.FindColorIndex(16777215, 1));//设置单元边框颜色
        currRpEngine.Cell.SetButtonCell(1, rowIndex-2, sheetIndex, 'add',1, '',1);//为新增单元格注册事件
        // currRpEngine.RegistOperaButtonClicked("OperaButtonCellClicked");
        // alert(currRpEngine.Cell.AddImage("c:\iconBase.png"))
        // currRpEngine.Cell.SetCellImage(1, rowIndex-2, sheetIndex, 1, 1);//设置背景图片
        currRpEngine.Cell.SetCellFontSize(1, 1, sheetIndex, 11);//设置字体
        currRpEngine.Cell.SetCellAlign(1, 1, sheetIndex, 4+32);//垂直居中
        if(isDefaultRow){
            arr.push({});
            currRpEngine.AppendRow(arr);//为表格默认添加一行
            var initIndex = GetDataStartIndex(currRpEngine);//获取数据起始行的索引
            currRpEngine.Cell.SetRowHeight(1, 24, initIndex, sheetIndex);//设置行高
            currRpEngine.Cell.SetButtonCell(1, initIndex, sheetIndex, 'minus',1, '',1);//为删除单元格注册事件
        };
        currRpEngine.RegistButtonCellClicked('Tools.operaHandle');

        // currRpEngine.Cell.AddImage("D:\2019_ctj\maven_repo\budget-web\trunk\code\budget-web\src\main\webapp\grp\budget\js\images\tabCirIcon.png");
        // currRpEngine.Cell.SetCellImage(1, initIndex, 0, currRpEngine.Cell.AddImage('../../images/tabCirIcon.png'), 1);//设置背景图片
        // currRpEngine.Cell.SetCellBackColor(1, rowIndex, 0, currRpEngine.Cell.FindColorIndex(15395562, 1));

    };
    /*
     * 功能： 为录入表操作列
     * 添加人：yangjianxue
     * 说明：
     * 1、在 RpWebEngineBudget.js 中 通过 RegistButtonCellClicked 注册到 cell 的 点击事件（不需自定义，了解即可）
     * 2、通过 CreateRpWebEngine 创建 cell 返回 cell 对象 currRpEngine（不需自定义，了解即可）
     * 3、通过 Tools.createOperaHandle 创建操作列，并绑定事件（不需自定义，了解即可）
     * 4、通过 currRpEngine.RegistButtonCellClicked('Tools.operaHandle') 绑定具体的事件回调（不需自定义，了解即可）
     * 5、该方法是新增和删除的具体实现*/
    Tools.operaHandle = function(col, row, sheetindex){
        //获取当前表格数据行
        var arrSource = _cacheRpEngine.GetPageData();
        var initIndex = GetDataStartIndex(_cacheRpEngine);//获取数据起始行索引
        var type = _cacheRpEngine.Cell.GetBtnCellString(1,row, sheetindex);
        if(type == 'minus'){
            // _cacheRpEngine.Cell.DeleteRow(row,1,sheetindex);
            _cacheRpEngine.DeleteRow(row,1,sheetindex);
            return;
        }else if(type == 'add'){
            //增加
            _cacheRpEngine.Cell.InsertRow(arrSource.length+initIndex,1,sheetindex);
            _cacheRpEngine.Cell.SetRowHeight(1, 24, arrSource.length+initIndex, sheetindex);
            var colNum = _cacheRpEngine.Cell.GetCols(sheetindex);
            for(var j=arrSource.length+initIndex;j<=arrSource.length+initIndex;j++){//行
                for(var n = 1;n<colNum;n++){
                    _cacheRpEngine.Cell.SetCellBorder(n, arrSource.length+initIndex,0,0,2);
                    _cacheRpEngine.Cell.SetCellBorder(n, arrSource.length+initIndex,0,1,2);
                    _cacheRpEngine.Cell.SetCellBorder(n, arrSource.length+initIndex,0,3,2);
                    _cacheRpEngine.Cell.SetCellBorder(n, arrSource.length+initIndex,0,2,2);
                };
            };
            _cacheRpEngine.Cell.SetCellBorderClr(1,2, 0, 1, _cacheRpEngine.Cell.FindColorIndex(16777215, 1));//设置单元边框颜色
            _cacheRpEngine.Cell.SetButtonCell(1, arrSource.length+initIndex, sheetindex, 'minus',1, '',1);//为删除单元格注册事件
        };
    };
    /*
     * 功能： 录入表初始化时操作列恢复删除按钮
     * 添加人：yangjianxue
     * 说明：
     * data : cell表格需要渲染的数据
     * currRpEngine ： 创建的cell表 对象*/
    Tools.initCellMinusBtn = function(obj){
        var data = obj.data;
        var currRpEngine = obj.currRpEngine;
        currRpEngine.SetData(data);
        var rowTotalIndex = GetDataStartIndex(currRpEngine) + 1;//获取数据行结束行的index
        var rowIndex = GetDataStartIndex(currRpEngine);//获取数据行开始的行的index
        var sheetIndex = currRpEngine.Cell.GetCurSheet();//获取当前表页页号
        for(var i = rowIndex;i<=rowTotalIndex;i++){
            currRpEngine.Cell.SetRowHeight(1, 24, i, sheetIndex);//设置行高
            currRpEngine.Cell.SetButtonCell(1, i, sheetIndex, 'minus',1, '',1);//为删除单元格注册事件
        };
        currRpEngine.RegistButtonCellClicked('Tools.operaHandle');
    }
    /*
    * 功能：获取录入表的report_id
   * 添加人：gaocaiqiong
   * 参数：
   * url ：录入表请求路径
   * id : 录入表 id*/
    Tools.getRepBillInfo = function(obj){
        var menuid = obj.menuid;
        var uiCode = obj.ui_code;
        $.ajax({
            url:"/bgt-budget-server/bgtMenu/menuRepBill?menuid="+menuid+"&uiCode="+uiCode+"&timestamp="+new Date().getTime(),
            type:'GET',
            async:false,
            success:function(data){
                if(data){
                    btnList = data.uvBtnList;
                    if(data.repBillMenuReportList&&data.repBillMenuReportList.length>0){
                        reportId= data.repBillMenuReportList[0].report_id;
                    }
                };
            },
            error:function(err){
                console.log(err)
            }

        })
    };
    /*
     * 功能： 动态获取要素的
     * 添加人：yangjianxue
     * 参数：
     * eleCode  要素简称
     * levelNum : 要素级次
     * url：接口 url 非必须参数，*/
    Tools.callElement = function(obj){
        var eleCode = obj.eleCode;
        var storageVal;
        if(eleCode&&(typeof(eleCode) != "undefined")&& (eleCode != "")){
        	var levelNum = obj.levelNum;
            var curData = obj.curData ? obj.curData :'';
            var menuid = obj.menuid;
            var url = obj.url ? obj.url : '/bgt-basic-server/bsElement/getDataSourceFilteredData?menuid=' + menuid+"&timestamp="+new Date().getTime()+"&ele_code="+eleCode
                +"&level_num="+ levelNum;
            $.ajax({
                url: url,
                type: 'POST',
                async: false,
                contentType: "application/json;charset=utf-8",
                success: function(data) {
                    storageVal = data.data;
                },
                error: function(data) {
                    console.log(data);
                }
            });
        }
        return storageVal;
    }

    // 总计
    Tools.totalAmountFn = function(obj){
        var data = obj.data;
        var totalShowField = obj.totalShowField;
        var totalArrField = obj.totalArrField;
        var resultArr = [];
        var resultObj = {};
        resultObj[totalShowField] = '合计';
        $.each(totalArrField,function(key,value){
            resultObj[value] = 0 ;
        });
        $.each(data,function(key,value){
            if(!value._parentId){
                $.each(totalArrField,function(i,field){
                    if(value[field]){
                        resultObj[field] += parseInt(value[field]);
                    };
                });
            };
        });
        resultArr.push(resultObj);
        return resultArr;
    }

    // Tools.treeGridTotal = function(obj){
    //     var result = obj.result;
    //     // var isTotal = obj.isTotal == false ? false : true;
    //     // var totalField = obj.totalField;
    //     var newObj = {};
    //     // newObj['footer'][0][totalField] = '合计';
    //     // if(isTotal){
    //     //     newObj = {
    //     //         "total" : datas.length,
    //     //         "rows" : datas,
    //     //         "footer":[
    //     //             {"f1":14000,"f2":12600,"f3":13321,"f4":15281,"f5":14931,"f6":13461,"f7":14126,"f8":12866}
    //     //         ]
    //     //     }
    //     // }
    //     newObj = {
    //         "total" : result.length,
    //         "rows" : result
    //     };
    //     return newObj;
    // }


})();
/*
 * 功能：自定义indexOf，用于兼容ie8
 * 添加人：yangjianxue
 * 参数:*/
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for(var i = 0;i < this.length;i++){
            if (this[i] == obj) {
                return i;
            };
        };
        return -1;
    };
};
Array.prototype.indexObjOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (JSON.stringify(this[i]) == val) return i;
    }
    return -1;
};
Array.prototype.removeObj = function(arrVal) {
    var _this = this;
    $.each(arrVal,function(key,val){
        var index = _this.indexObjOf(JSON.stringify(val));
        if (index > -1) {
            _this.splice(index, 1);
        }
    });
};
// 去重
// Array.prototype.unique = function(){
//     var result = [];
//     this.forEach(function(v){
//
//     })
// }
/*
 * 功能：easyui datagrid 触发编辑单元格
 * 创建人：yangjianxue
 * */
$.extend($.fn.datagrid.methods, {
    editCell: function(jq, param) {
        return jq.each(function() {
            var opts = $(this).datagrid('options');
            var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));
            for(var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor1 = col.editor;
                if(fields[i] != param.field) {
                    col.editor = null;
                };
            };
            $(this).datagrid('beginEdit', param.index);
            for(var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor = col.editor1;
            };
        });
    }
});
/*
 * 功能： 基于easyui datagrid 行计算
 * 创建人：yangjianxue
 * 参数：
 * needCalArr ：需要合计的字段
 * idLabel ：表格id/class
 * rowTotal ：行合计的值
 * showField ：需要展示到哪里
 * operatorCal ： 运算符*/
Tools.rowCalculate = function(obj){
    var needCalArr = obj.needCalArr;
    var idLabel = obj.idLabel;
    var rowTotal = obj.rowTotal;
    var showField = obj.showField;
    var operatorCal= obj.operatorCal;
    var rows = idLabel.datagrid('getRows');
    if(operatorCal == '+' || operatorCal == '-'){
       for(var j = 0; j < rows.length; j++) {
        rowTotal[j] = 0;
       };
    };
    if(operatorCal == '*' || operatorCal == '/'){
       for(var j = 0; j < rows.length; j++) {
        rowTotal[j] = 1;
       };
    };
   for(var i = 0;i<rows.length;i++){
       for(var j=0;j<needCalArr.length;j++){
           switch (operatorCal){
               case '+':
                 rowTotal[i] += (rows[i][needCalArr[j]] ? parseFloat(rows[i][needCalArr[j]]) : 0);
                 break;
               case '-':
                 rowTotal[i] -= (rows[i][needCalArr[j]] ? parseFloat(rows[i][needCalArr[j]]) : 0);
                 break;
               case '*':
                 rowTotal[i] *= (rows[i][needCalArr[j]] ? parseFloat(rows[i][needCalArr[j]]) : 0);
                 break;
               case '/':
                 rowTotal[i] /= (rows[i][needCalArr[j]] ? parseFloat(rows[i][needCalArr[j]]) : 0);
                 break;
           };
       };
   };
    //为行合计赋值
    for(var z = 0; z < rows.length; z++) {
        idLabel.datagrid('getRows')[z][showField] = rowTotal[z];
        idLabel.datagrid('refreshRow', z);
    };
};
/*
 * 功能：easyui datagrid 扩展编辑单元格方法
 * 创建人：yangjianxue
 * 参数:
 * index: onclickCell默认参数index
 * field: onclickCell默认参数field
 * value:onclickCell默认参数value
 * isTotal ：是否合计 true是/false否
 * isSmallTotal : 是否需要小计 true是/false否
 *  isRowTotal: 是否行合计true是/false否
 *  needCalArr：  需要行合计的字段
 *  idLabel:当前表格id
 *  rowTotal : 行合计的值 ,默认传一个空数组
 *  showField: 行合计后的值需要展示到哪个字段
 *  operatorCal:  运算符 '+' /'-' / '*'/ '/'*/
$.extend($.fn.datagrid.methods, {onClickCell: function(jq, param) {
    return jq.each(function() {
        var _this = $(this);
        if(Tools.endEditing(_this)){
            var curCallBackFlag = false;
            if(param.callBackFieldArr){
                $.each(param.callBackFieldArr,function(key,value){
                    if(value == param.field){
                        curCallBackFlag = true;
                    };
                });
            }
            var rows = _this.datagrid('getRows'),
                curRow = rows[param.index];
            if(param.isMerges){
                Tools.marginCellFn({
                    idLabel:param.idLabel,
                    merges:param.merges,
                    mergesField:param.mergesField
                });
            };
            var flag = false;
            if(param.isTotal){
                flag = param.index != (rows.length - 1);
            }else{
                flag = param.index <= (rows.length - 1);
            };
            if(flag && !curRow.title_field) {
                _this.datagrid('selectRow', param.index)
                    .datagrid('editCell', {
                        index: param.index,
                        field: param.field
                    });
                var editors = _this.datagrid('getEditors', param.index),
                    curField = param.field; // 当前单元格所在的列
                if(editors[0] && editors[0].target && editors[0].type != 'combotree'&& editors[0].type != 'combobox'){
                    $(editors[0].target).focus();
                };
                if(param.isMerges){
                    Tools.marginCellFn({
                        idLabel:param.idLabel,
                        merges:param.merges,
                        mergesField:param.mergesField
                    });
                };
                // if(editors.length>0){
                //     $(editors[0].target).focus();
                // };
                if(editors.length>0 && editors[0].type == 'combotree'){
                    var name = editors[0].target.combotree('getText');
                    var code = editors[0].target.combotree('getValues');
                    editors[0].target.combotree('showPanel');
                    editors[0].target.combotree({
                        onChange: function(newValue, oldValue) {
                            //值没有发生改变
                            if(code == newValue || name == newValue){
                            }else{
                                //值发生改变的回调
                                if(typeof param.combotreeHandle == 'function'){
                                    param.combotreeHandle.call(this,name,code);
                                };
                            };
                        }
                    });
                };
                var isNotSpecialDg =  param.isNotSpecialDg == false ? false : true;
                if(editors.length>0 && editors[0].type == 'numberbox') {
                    editors[0].target.numberbox({
                        onChange: function(newValue, oldValue) {
                            //新增限制，如果当前单元格大于某单元格数据则不修改
                            if(param.isLimit && (param.field == param.confined)){
                                if(newValue > rows[param.index][param.limitField]){
                                    rows[param.index][param.field] = oldValue;
                                    _this.datagrid('refreshRow', param.index);
                                    return;
                                };
                            };
                            var lastIndex = rows.length - 1, //获取合计行inde
                                totalValues = rows[lastIndex][curField] ? rows[lastIndex][curField] :0,//重新计算总计
                                curSmallRow = rows[param.index][param.showField] ? rows[param.index][param.showField] :0;
                            if(typeof totalValues == 'number'){
                                oldValue = oldValue ? oldValue : 0; //避免值空时为NAN
                                newValue = newValue ? newValue : 0;
                                totalValues = totalValues - parseFloat(oldValue) + parseFloat(newValue);
                                if(param.isTotal && isNotSpecialDg){
                                    // 总计赋值
                                    _this.datagrid('getRows')[lastIndex][curField] = totalValues;
                                    _this.datagrid('refreshRow', lastIndex);
                                };
                                if(param.isSmallTotal && isNotSpecialDg){
                                    //重新计算小计
                                    for(var r = param.index; r >= 0; r--) {
                                        if(rows[r]["title_field"]) {
                                            var smallValues = rows[r][curField] ? rows[r][curField] :0;
                                            smallValues = smallValues - parseFloat(oldValue) + parseFloat(newValue);
                                            _this.datagrid('getRows')[r][curField] = smallValues;
                                            _this.datagrid('refreshRow', r);
                                            break;
                                        };
                                    };
                                };
                            };
                            //是否公式计算
                            if(param.isCalField){
                                // index: index,
                                // field:field,
                                // value:value,
                                // isCalField:true,//是否需要公式计算
                                // calField:calField, //携带计算公式和展示字段的数组对象
                                // calFormula:calFormula//携带公式的字段
                                for(var i = 0;i<param.calField.length;i++){//遍历公式变量
                                    for(var j = 0;j<param.calField[i].calArr.length;j++){//遍历当前列中的公式变量中的calArr(参与公式计算的所有字段)
                                        if(param.calField[i].calArr[j].indexOf(param.field) >=0){//查找当前列中参与计算的所有字段是否含有和当前修改的单元格对应的字段
                                            // console.log(param.calField[i].showField) //公式的展示字段
                                            // console.log(param.calField[i].calFormula) //公式
                                            // 如果有则重新展示字段中对应的公式
                                            // calField = obj.calField;//承接所有公式的变量
                                            // curRow = obj.curRow;//当前行
                                            // curCol = obj.curCol;//当前列
                                            // isAllRow = obj.isAllRow == false ? false : true;//是否需要重新计算整行的公式
                                            var resultStr = Tools.cutCalFn({
                                                curField:param.field,
                                                curFieldNewVal :parseInt(newValue),
                                                calField : param.calField,
                                                curRow : curRow,
                                                curCol:param.calField[i].calFormula,
                                                isAllRow:false
                                            });
                                            // rows[param.index][param.calField] = parseInt(newValue);
                                            rows[param.index][param.calField[i].showField] = (new Function("return "+resultStr))();
                                        };
                                    };
                                };
                            };
                        }
                    });
                };
                editIndex = param.index;
                if(editors[0] && editors[0].target && editors[0].type != 'combotree'&& editors[0].type != 'combobox'){
                    editors[0].target.next('span').find('.textbox-text').focus();
                };
            };
        };
    });
}
});
//开始
/*
 * jquery 初始化form插件，传入一个json对象，为form赋值
 * version: 1.0.0-2013.06.24
 * @requires jQuery v1.5 or later
 * Copyright (c) 2013
 * note:  1、此方法能赋值一般所有表单，但考虑到checkbox的赋值难度，以及表单中很少用checkbox，这里不对checkbox赋值
 *		  2、此插件现在只接收json赋值，不考虑到其他的来源数据
 *		  3、对于特殊的textarea，比如CKEditor,kindeditor...，他们的赋值有提供不同的自带方法，这里不做统一，如果项目中有用到，不能正确赋值，请单独赋值
 */
$.fn.extend({
    initForm:function(options){
        //默认参数
        var defaults = {
            jsonValue:"",
            isDebug:false	//是否需要调试，这个用于开发阶段，发布阶段请将设置为false，默认为false,true将会把name value打印出来
        }
        //设置参数
        var setting = $.extend({}, defaults, options);
        var form = this;
        jsonValue = setting.jsonValue;
        //如果传入的json字符串，将转为json对象
        if($.type(setting.jsonValue) === "string"){
            jsonValue = $.parseJSON(jsonValue);
        }
        //如果传入的json对象为空，则不做任何操作
        if(!$.isEmptyObject(jsonValue)){
            var debugInfo = "";
            $.each(jsonValue,function(key,value){
                //是否开启调试，开启将会把name value打印出来
                if(setting.isDebug){
                    alert("name:"+key+"; value:"+value);
                    debugInfo += "name:"+key+"; value:"+value+" || ";
                }
                var formField = form.find("[name='"+key+"']");
                if($.type(formField[0]) === "undefined"){
                    if(setting.isDebug){
                        alert("can not find name:["+key+"] in form!!!");	//没找到指定name的表单
                    }
                } else {
                    var fieldTagName = formField[0].tagName.toLowerCase();
                    if(fieldTagName == "input"){
                        if(formField.attr("type") == "radio"){
                            $("input:radio[name='"+key+"'][value='"+value+"']").attr("checked","checked");
                        } else {
                            $(formField).val(value);
                        }
                    } else if(fieldTagName == "select"){
                        //do something special
                        formField.val(value);
                    } else if(fieldTagName == "textarea"){
                        //do something special
                        formField.val(value);
                    } else {
                        formField.val(value);
                    }
                }
            })
            if(setting.isDebug){
                alert(debugInfo);
            }
        }
        return form;	//返回对象，提供链式操作
    }
});
//结束
//取消点击选中的功能（单击数据时，数据也会被选中）
function clickRow(index, row) {
    var checkedRows = $("#dg").datagrid("getChecked");
    if(checkedRows.length != "0" ){
        var isNotCheckedFlag = true;
        if (row) {
            for (var i = 0; i < checkedRows.length; i++) {
                if (row.pm_name == checkedRows[i].pm_name) {
                    isNotCheckedFlag = false;
                    break;
                }
            }
        }
        if (isNotCheckedFlag) {
            $(this).datagrid('unselectRow', index);
        } else {
            $(this).datagrid('selectRow', index);
        }
    }

}
//显示报错数据
function dataGridErr() {
    new Tools.popUp({
        title: '提示信息',
        messTxt: '加载出错！',
        iconType: 'tipIcon',
        isSingleBtn :  true ,
        suffix : 'd',
        closeCallBack: function (closeEvent) {
            closeEvent();
        }
    })
}
/** resultOriginal:后台请求的数据
 * id:选择器
 * resultList:最后的结果集;
 * code 值为区别后台返回来的数据,还是新增的数据;根据字段
 */
//表格数据处理;
function judgeObj(resultOriginal, id,judgeField,mustField,mustVal){
    var resultList=new Array();
    var result = $(id).datagrid('getData').rows;//关键指标;
    //如果原始数据为空,新增也为空,证明没有操作,直接返回;
    if(resultOriginal =="" && (result == "" || result == [])){
        return "";
    }
    //如果原始数据为空,新增的数据不为空,证明都是新增的数据;
    if((resultOriginal=="" || resultOriginal == null )&&  result != ""){
        for(var j=0;j<result.length;j++){
            result[j].operation = 1;
            result[j][mustField] = mustVal;
            resultList.push(result[j]);
        }
        return resultList;
    }
    //如果原始数据不为空,新增数据为空,证明都是是删除;
    if(resultOriginal !="" && (result == "" || result == [])){
        for(var j=0;j<resultOriginal.length;j++){
            resultOriginal[j].operation = 3;
            resultList.push(resultOriginal[j]);
        }
        return resultList;
    }
    //原始数据有数据,获得得结果有数据;判断是否是新增,修改,删除;
    if(resultOriginal != "" && result !=""){
        for( var i = 0;i<result.length;i++){
            var resultObj = result[i];
            //如果没有code值证明都是新增的对象
            if(resultObj[judgeField] == undefined ){
                resultObj.operation = 1;
                resultObj[mustField] = mustVal;
                resultList.push(resultObj);
                result.splice(i,1);
                i--;
                continue;
            }
            for(var j=0;j<resultOriginal.length;j++){
                var	resultOriginalObj =  resultOriginal[j];
                if(resultOriginalObj[judgeField] == resultObj[judgeField]){
                    //如果相同,不处理;两个集合里面删掉
                    if(diff(resultObj,resultOriginalObj)){
                        result.splice(i,1);
                        resultOriginal.splice(j,1);
                        i--;
                        break;
                    }else{
                        //如果不想同,证明是修改;
                        resultObj.operation = 2;
                        resultList.push(resultObj);
                        result.splice(i,1);
                        resultOriginal.splice(j,1);
                        i--;
                        break;
                    }
                }
            }

        }
        //resultOriginal剩下的就是删除的对象;
        for(var i=0;i<resultOriginal.length;i++){
            var	resultOriginalObj =  resultOriginal[i];
            resultOriginalObj.operation = 3;
            resultList.push(resultOriginalObj);
        }
        return resultList;
    }
};
//判断两个方法是否相同
function diff(obj1,obj2){
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if(!o1 || !o2){/*  判断不是对象  */
        return obj1 === obj2;
    }
    if(Object.keys(obj1).length !== Object.keys(obj2).length){
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }
    for(var attr in obj1){
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if(t1 && t2){
            return diff(obj1[attr],obj2[attr]);
        }else{
            //null和空是一样的;
            if((obj1[attr] == "" && obj2[attr] == null) || (obj1[attr] == null && obj2[attr] == "")){
                continue;
            }
            //!==判断类型,!=判断值,不判断类型;
            if(obj1[attr] != obj2[attr]){
                return false;
            }
        }
    }
    return true;
};
//修改合并对象;
function joinObject(originalObj,nowObj){
    for (var i =0;i<nowObj.length;i++) {
        originalObj[nowObj[i].name] = nowObj[i].value;
    }
    return originalObj;
}
//form表单返回对象方法封装；使用方法eg:$("form").serializeArray();
$.prototype.serializeObject = function () {
    var a,o,h,i,e;
    a = this.serializeArray();
    o={};
    h=o.hasOwnProperty;
    for(i=0;i<a.length;i++){
        e=a[i];
        if(!h.call(o,e.name)){
            o[e.name]=e.value;
        }
    }
    return o;
}
//加载年度按钮
function returnYear(menuid) {
//定义一个承接变量
    var undertake = 0;
    $.ajax({
        url :"/framework-server/busiyear/list?menuid="+menuid,
        type : "POST",
        async:false,
        contentType: "application/json;charset=utf-8",
        success : function (data) {
            //默认加载is_default==1
            for (var i=0; i<data.length;i++){
                if(data[i].is_default == 1){
                    undertake = data[i].year;
                }
            }
        },
        error:function(err){
            console.log(err)
        }
    });
    return undertake;
}
//克隆
//复制对象的数值方法
function clone(obj) {
    var o, i, j, k;
    if(typeof(obj) != "object" || obj === null) return obj;
    if(obj instanceof(Array)) {
        o = [];
        i = 0;
        j = obj.length;
        for(; i < j; i++) {
            if(typeof(obj[i]) == "object" && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    } else {
        o = {};
        for(i in obj) {
            if(typeof(obj[i]) == "object" && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            } else {
                o[i] = obj[i];
            }
        }
    }
    return o;
};
/**
 * 获取父节点下面所有的字节点id字符串; 默认拼接code值,2为id
 * @param {treeId} 树的id
 * @param {nodeTree} 选择的节点;
 */
function getChildren(treeId,nodeTree,differentParam){
    var fileParameter = 'CODE';
    if(differentParam==2){
        fileParameter='id';
    }
    var idList =  new Array();
        //如果选择的部门,把单位code值传给后台;
//	if(nodeTree.IS_LEAF=='1'){
//		idString=nodeTree[fileParameter];
//		return idString;
//	}
        $tree = $(treeId),
        node = $tree.tree('find',nodeTree.id),
        childrenNodes = $tree.tree('getChildren',node.target);
    //如果childrenNodes没有子集,为空,证明是最下面一个,然后把值返回去;
    if(childrenNodes == "" || childrenNodes == null){
        idList.push(nodeTree[fileParameter]);
        return idList;
    };
    var count =0;
    for(var i = 0; i < childrenNodes.length; i++){
        if(childrenNodes[i].IS_LEAF=='1'){
            count++;
            if(count == 1){
                idList.push(childrenNodes[i][fileParameter]);
            }else{
                idList.push(childrenNodes[i][fileParameter]);
                //idString += ","+childrenNodes[i][fileParameter];
            };
        };
    };
    return idList;
};
//分组数据============================================================
/*
 * datas初始数据
 * specialField合并字段
 * treeField树字段名称
 * treeFieldCode树字段编码
 */
function groupData(obj) {
    datas = obj.datas;
    var specialField = obj.specialField;
    var treeField = obj.treeField;
    var treeFieldCode = obj.treeFieldCode;
    var titleFieldArr = obj.titleFieldArr;
    var isDefaultRow = obj.isDefaultRow == false ? false : true;
    var result = [];
    if(specialField){
        var newTitleFieldArr = JSON.parse(JSON.stringify(titleFieldArr));
        for(var m = 0;m<titleFieldArr.length;m++){
            var str = newTitleFieldArr[m];
            str.title_field = titleFieldArr[m][specialField];
            result.push(str);
            if(datas && datas.length > 0) {
                for(var n = 0;n<datas.length;n++){
                    if(datas[n][specialField] == titleFieldArr[m][specialField]){
                        datas[n][parent] = titleFieldArr[m][specialFieldCode]
                        result.push(datas[n])
                    };
                };
            }else if(isDefaultRow){
                result.push(titleFieldArr[m]);
            };
        };
        return result;
    }
}


//校验数据
/**
 * data原始数据
 * groupFied分组数据array
 * treeFied树形展示数据obj
 */
function verifyOffRecetion(list, fn,obj,parentFile) {
    const groups = {};
    list.forEach(function (o) {
        const group = JSON.stringify(fn(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return  group(groups,obj,parentFile);
}
// function group(groups,obj,parentFile) {
//     var code = obj.code;
//     var name  = obj.name;
//     var codeg = obj.codeg;
//     var nameg  = obj.nameg;
//     var parentCode = obj.parentCode;
//     var returnlist = new Array();
//    var  keycache = 0;
//    for(var key in groups){
//        var filed  = {};
//        filed[codeg]  =  groups[key][0][codeg]
//        filed[nameg]  = groups[key][0][nameg]
//        filed[name] = groups[key][0][name];
//        filed[code] = groups[key][0][code];
//        returnlist.push(filed);
//        for(var i=0;i<groups[key].length;i++){
//            if(parentFile){
//                groups[key][i]._parentId = groups[key][i][parentCode];
//                groups[key][i][parentCode] = "";
//                returnlist.push(groups[key][i]);
//            }else{
//                returnlist.push(groups[key][i]);
//           }
//        }
//
//
//    }
//    return returnlist;
// }
//=========================

// function  groupBy(array, f){
//     const groups = {};
//     array.forEach(function (o) {
//         const group = JSON.stringify(f(o));
//         groups[group] = groups[group] || [];
//         groups[group].push(o);
//     });
//      return groups;
// }
//
// function groupBy(data,fileData) {
//     var retrunList =[];
//     var cacheList =[];
//     for(var i =0;i<fileData.length;i++){
//        for(var x=0;x<data.length;x++) {
//                var obj ={};
//                if(retrunList.length == 0){
//                    obj[fileData[i]] = data[x][fileData[i]];
//                    cacheList.push(obj);//作缓存的数据
//                    retrunList.push(obj);//真正返回的数据
//                }else{
//                    for(var y = 0 ;y<cacheList.length;y++){
//                        //相同等级比较
//                      if(cacheList[y][fileData[i]]==data[x][fileData[i]]){
//                          if(cacheList[y][fileData[i+1]]){
//                              if(cacheList[y][fileData[i+1]] != data[x][fileData[i+1]]){
//                                  obj[fileData[i]] = data[x][fileData[i]];
//                                  obj[fileData[i+1]] = data[x][fileData[i+1]];
//                                  cacheList.splice(y, 0,obj);
//                                  retrunList.splice(y, 0,obj);
//                              }
//                          }else{
//                              if(!cacheList[y+1][fileData[i]]){
//                                  if(cacheList[y+1][fileData[i]]!= cacheList[y][fileData[i]]){
//                                      obj[fileData[i]] = data[x][fileData[i]];
//                                      obj[fileData[i+1]] = data[x][fileData[i+1]];
//                                      cacheList.splice(y, 0,obj);
//                                      retrunList.splice(y, 0,obj);
//                                  }
//                              }
//                          }
//                      }else{
//                          //等级不同的比较
//                          obj[fileData[i]] = data[x][fileData[i]];
//                          cacheList.push(obj);
//                          retrunList.push(obj);
//                      }
//                    }
//               }
//        }
//     }
//     return retrunList;
// }
//判断是否在本岗
function isThisJobs(obj){
	var menuid = obj.meunid;
	var agency_id = obj.agency_id;
	var ui_code = obj.ui_code;
	var isJob;
	$.ajax({
		url:'/bgt-budget-server/bgtMenu/menuIsCanCancel?menuid='+menuid+'&agency_id='+agency_id+'&ui_code='+ui_code+"&timestamp="+new Date().getTime(),
		type:'GET',
		async:false,
		success:function(data){
            // 数据是否可撤销:0,可编辑;1,可撤销;2,不可编辑也不可撤销
			isJob = data.data;
		}
	});
	return isJob;
}
//自适应高度
function resizeHength(id,hength){
	if(!hength){
		hength = 70;
	}
	$('#'+id).datagrid('resize',{ 
		height:($(window).height()-hength) 
	});
}