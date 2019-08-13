/*
 * 动态创建
 * 创建人:yangjianxue
 * templateType：当前视图类型---1录入视图；2查询视图；3列表视图；4报表视图 ；5 表单视图
 */

;
(function () {
    if (window.CreateEleFn === undefined) {
        window.CreateEleFn = {};
    };
    /*
     * 功能：动态创建form表单
     * domWrap ：承载动态元素的Wrap
     * createFormId : 动态创建的from的id
     * isViewEdit : 当前视图是否可编辑 （1是可编辑0是不可编辑）//默认可编辑
     *    loadLeftDataUrl  : form表单的左侧数据请求路径
     *    loadLeftData ： form表单的左侧数据
     *    formDefaults   : form表单的默认值默认空数组
     *    radioCallBack : radio的回调(包括默认事件的回调，点击事件的回调)
     *    checkCallBack : checkbox的回调(包括默认事件的回调，点击事件的回调)
     *    comboBoxCallBack : comboBox的回调
     *    dataBoxCallBack : 日期框的回调
     *    comboTreeCallBack : 下拉tree的回调
     *    inputIntegerCallBack ： 整数框的回调
     *    textareaCallBack ： 大文本框的回调
     *    inputMoneyCallBack ： 金额框的回调
     *    menuid : url默认必传参数
     *    formInitData ： form初始化值
     *    */
    CreateEleFn.createForm = function () {
        var Fn = function (obj) {
            // this.templateType = obj.template_type;
            this.domWrap = obj.domWrap;
            this.createFormId = obj.createFormId;
            this.loadLeftDataUrl = obj.loadLeftDataUrl ? obj.loadLeftDataUrl : '';
            this.loadLeftData = obj.loadLeftData ? obj.loadLeftData : [];
            this.isViewEdit = obj.isViewEdit == 0 ? false : true;
            this.formDefaults = obj.formDefaults ? obj.formDefaults : [];
            this.formInitData = obj.formInitData ? obj.formInitData : {};
            this.radioCallBack = obj.radioCallBack ? obj.radioCallBack : [];
            this.checkCallBack = obj.checkCallBack ? obj.checkCallBack : [];
            this.comboBoxCallBack = obj.comboBoxCallBack ? obj.comboBoxCallBack : [];
            this.dataBoxCallBack = obj.dataBoxCallBack ? obj.dataBoxCallBack : [];
            this.comboTreeCallBack = obj.comboTreeCallBack ? obj.comboTreeCallBack : [];
            this.inputIntegerCallBack = obj.inputIntegerCallBack ? obj.inputIntegerCallBack : [];
            this.textareaCallBack = obj.textareaCallBack ? obj.textareaCallBack : [];
            this.inputMoneyCallBack = obj.inputMoneyCallBack ? obj.inputMoneyCallBack : [];
            this.menuid = obj.menuid;
            this.init();
        };
        Fn.prototype = {
            constructor: Fn,
            init: function () {
                // 数据是否需要请求
                if (this.loadLeftDataUrl) {
                    this.getLeftField(); //ajax动态请求
                } else {
                    this.creatFormLabel(this.loadLeftData); //已经确定数据，直接进行页面渲染
                };
            },
            //异步获取左边标签值
            getLeftField: function () {
                var _this = this;
                $.ajax({
                    url: _this.loadLeftDataUrl,
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        _this.creatFormLabel(data);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            },
            //动态创建form左侧标签
            creatFormLabel: function (proarrs) {
                var _this = this,
                    infoCon = "";
                var proarrsArr = proarrs.psUvColumnList;
                if (this.isViewEdit) {
                    //可编辑--(需要单独判断每一项是否可编辑)
                    infoCon = '<form id="' + _this.createFormId + '" class="createForm"></form>';
                    _this.domWrap.append(infoCon);
                    $.each(proarrsArr, function (key, value) {
                        if (value.is_visible) {
                            if (value.is_enabled) {
                                infoCon = _this.returnEnumType(value);
                            } else {
                                infoCon = _this.createViewField(value);
                            };
                        } else {
                            infoCon = _this.createHiddenField(value);
                        };
                        $('#' + _this.createFormId).append(infoCon);
                    });
                } else {
                    //不可编辑- 直接创建label - span
                    $.each(proarrsArr, function (key, value) {
                        infoCon = _this.createViewField(value);
                        _this.domWrap.append(infoCon);
                    });
                };
                //为form表单赋默认值
                _this.getFormValue();
                //为form 添加回调事件
                _this.formCallBack();

                //为form 添加回调事件
                // _this.radioChangeHandle();
                //为form表单添加接口初始化值
                // _this.setFormValue(_this.formInitData);

            },
            formCallBack: function () {
                var _this = this;
                //radio 是否带有回调事件
                if (_this.radioCallBack) {
                    _this.radioClickHandle();
                };
                //checkbox 是否带有回调事件
                if (_this.checkCallBack) {
                    _this.checkClickHandle();
                };
                //下拉框 是否带有回调事件
                if (_this.comboBoxCallBack) {
                    _this.comboBoxHandle();
                };
                //日期框 是否带有回调事件
                if (_this.dataBoxCallBack) {
                    _this.dataBoxHandle();
                };
                //下拉树 是否带有回调事件
                if (_this.comboTreeCallBack) {
                    _this.comboTreeHandle();
                };
                //整数框带有回调
                if (_this.inputIntegerCallBack) {
                    _this.inputIntegerHandle();
                };
                //金额框带有回调
                if (_this.inputMoneyCallBack) {
                    _this.inputMoneyHandle();
                };
                //大文本框带有回调
                if (_this.textareaCallBack) {
                    _this.textareaHandle();
                };
            },
            //创建隐藏的form数据
            createHiddenField: function (node) {
                var curCon = '';
                if (!node.default_value) {
                    node.default_value = '';
                };
                curCon = '<input hidden value="' + node.default_value + '" name="' + node.property_name + '"/>';
                return curCon;
            },
            //创建不可编辑form数据
            createViewField: function (node) {
                var curCon = '';
                if (!node.default_value) {
                    node.default_value = '暂无数据';
                };
                curCon = '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>' +
                    '<input readonly class="FieldValue" value="' + node.default_value + '" name="' + node.property_name + '"/></div>';
                return curCon;
            },
            //判断当前form标签右侧值是否可编辑以及不可编辑时标签类型
            // *枚举值转换
            // * 列类型0文本框；1下拉框；2多选下拉框；3单选框；4复选框；5辅助录入（下拉树）；6日期选择框；7整数框；8金额框；12大文本框；
            returnEnumType: function (node) {
                var returnType = "",
                    curCon = '',
                    _this = this;
                switch (node.column_type) {
                    case 0: //文本框
                        // 创建可输入的input(完成)
                        curCon = _this.createInputText(node);
                        return curCon;
                    case 1: //下拉框
                        // 创建可输入的input(完成)
                        curCon = _this.createCombox(node);
                        return curCon;
                    case 2: //可选下拉框
                        returnType = '';
                        break;
                    case 3: //单选框
                        //创建radio并赋值（完成）
                        curCon = _this.createRadioBox(node);
                        return curCon;
                    case 4: //复选框
                        //创建checkbox并赋值
                        curCon = _this.createCheckBox(node);
                        return curCon;
                    case 5: //辅助录入（下拉树）
                        //创建checkbox并赋值
                        curCon = _this.createComboTreeBox(node);
                        return curCon;
                    case 6: //日期选择框
                        //创建checkbox并赋值
                        curCon = _this.createdataBox(node);
                        return curCon;
                    case 7: //整数框
                        curCon = _this.createInputInteger(node);
                        return curCon;
                    case 8: //金额框
                        curCon = _this.createInputMoney(node);
                        return curCon;
                    case 12: //大文本框
                        curCon = _this.createTextareaText(node);
                        return curCon;
                };
                return returnType;
            },
            //创建可编辑的input文本框
            createInputText: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText FieldValue' />";
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //创建可编辑的下拉框
            createCombox: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText combox FieldValue' />";
                if (node.data_source) {
                    var hiddenId = node.data_source.toLowerCase() + '_id';
                    var hiddenCode = node.data_source.toLowerCase() + '_code';
                    CreateEleFn.createComboBox({
                        eleName: node.data_source,
                        eleCodeName: node.property_name,
                        eleId: hiddenCode,
                        eleCode: hiddenId,
                        levelNum: node.level_num,
                        menuid: menuid
                    });
                };
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            createComboTreeBox: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText comboFieldSty' />";
                if (node.data_source) {
                    var hiddenId = node.data_source.toLowerCase() + '_id';
                    var hiddenCode = node.data_source.toLowerCase() + '_code';
                    CreateEleFn.createComboTree({
                        eleName: node.data_source,
                        eleCodeName: node.property_name,
                        eleId: hiddenCode,
                        eleCode: hiddenId,
                        levelNum: node.level_num,
                        menuid: menuid
                    });
                };
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //日期框
            createdataBox: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText FieldValue' />";
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //创建可选择的radio单选组
            createRadioBox: function (node) {
                var curCon = '',
                    _this = this,
                    dataSource = [],
                    defaultVal = null;
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += '<div class="FieldValue ' + node.key + 'Wrap">';
                if (node.data_source.split('-').length > 1) {
                    dataSource = _this.splitDataSorce(node.data_source, node.key); //解析data_source将字符串转成数组json
                    defaultVal = _this.defaultValueHandle(dataSource, node.default_value); //获取radio默认值
                    //创建radio组
                    curCon += CreateEleFn.createRadioGroup({
                        dataSource: dataSource,
                        eleName: node.key,
                        paramId: 'iptId',
                        paramCode: '',
                        paramIptVal: 'iptKey',
                        paramLabelVal: 'iptValue'
                    });
                    //如果初始化值发生改变
                    for (var initKey in _this.formInitData) {
                        if (initKey == node.property_name) {
                            defaultVal = _this.defaultValueHandle(dataSource, _this.formInitData[initKey]); //获取radio默认值
                        };
                    };
                    if (defaultVal) {
                        defaultVal.name = node.key;
                        _this.recordValue(defaultVal); //收集默认值
                        _this.radioDefaultHandle(defaultVal); //radio默认值触发的事件
                    };
                } else {
                    // 如果没有dataSource说明是要素
                    var data = Tools.callElement({
                        eleCode: node.property_name,
                        levelNum: node.level_num,
                        menuid: menuid
                    });
                    curCon += CreateEleFn.createRadioGroup({
                        dataSource: data,
                        eleName: node.property_name
                    });
                };
                curCon += '</div></div>';
                return curCon;
            },
            //创建可选择的checkbox复选组
            createCheckBox: function (node) {
                var curCon = '',
                    _this = this,
                    dataSource = [],
                    defaultVal = null;
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += '<span class="FieldValue ' + node.key + 'Wrap">';
                if (node.data_source.split('-').length > 1) {
                    dataSource = _this.splitDataSorce(node.data_source, node.key); //解析data_source将字符串转成数组json
                    defaultVal = _this.defaultValueHandle(dataSource, node.default_value); //获取radio默认值
                    //创建check组
                    curCon += CreateEleFn.createCheckbox({
                        dataSource: dataSource,
                        eleName: node.key,
                        paramId: 'iptId',
                        paramCode: '',
                        paramIptVal: 'iptKey',
                        paramLabelVal: 'iptValue'
                    });
                    if (defaultVal) {
                        defaultVal.name = node.key;
                        _this.recordValue(defaultVal); //收集默认值
                        _this.checkDefaultHandle(defaultVal); //check默认值触发的事件
                    };
                } else {
                    //要素
                    var data = Tools.callElement({
                        eleCode: node.dataSource,
                        levelNum: node.level_num,
                        menuid: menuid
                    });
                    curCon += CreateEleFn.createCheckbox({
                        dataSource: data,
                        eleName: node.dataSource
                    });
                };
                curCon += '</span></div>';
                return curCon;
            },
            //创建可编辑的整数框
            createInputInteger: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText FieldValue' />";
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //创建可编辑的金额框
            createInputMoney: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {};
                curCon += '<div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText FieldValue' />";
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //创建可编辑的大文本框（textarea）
            createTextareaText: function (node) {
                var _this = this,
                    curCon = '',
                    isdefaultVal = node.default_value,
                    defaultVal = {},
                    max_length = node.max_length ? node.max_length : 300;
                curCon += '<div><div class="createFormRow"><label class="createField">' + node.column_user_name + ' :</label>';
                curCon += "<div class='relWrap'><input id='" + node.property_name + "' name='" + node.property_name + "'  class='iptText FieldValue' />";
                curCon += '<span class="countWrap">已输入<em class="iptNum">0</em>/<span class="maxNum">' + max_length + '</span></span></div></div>';
                if (isdefaultVal) {
                    defaultVal.name = node.property_name;
                    defaultVal.iptKey = isdefaultVal;
                    defaultVal.iptValue = node.property_name;
                    _this.recordValue(defaultVal); //收集默认值
                };
                curCon += '</div>';
                return curCon;
            },
            //解析data_source将字符串转成数组json
            splitDataSorce: function (node, radioName) {
                if (node) {
                    var sorceArr = node.split(';'),
                        newArr = [];
                    $.each(sorceArr, function (key, value) {
                        var curSorceArr = value.split('-');
                        newArr.push({
                            iptId: radioName + curSorceArr[0],
                            iptKey: curSorceArr[0],
                            iptValue: curSorceArr[1]
                        });
                    });
                    return newArr;
                };
            },
            // 遍历单个字段得到默认值
            defaultValueHandle: function (node, defaultVal) {
                var cur = null;
                // [
                //   {radioKey:1,radioValue:是},
                //   {radioKey:0,radioValue:否}
                // ]
                if (defaultVal) {
                    if (node) {
                        $.each(node, function (key, value) {
                            if (value.iptKey == defaultVal) {
                                cur = value;
                            };
                        });
                    };
                } else {
                    if (node) {
                        $.each(node, function (key, value) {
                            if (value.iptKey == 0) {
                                cur = node[key];
                            };
                        });
                    };
                };
                return cur;
            },
            //收集整个表单可编辑的默认值
            recordValue: function (node) {
                var _this = this;
                _this.formDefaults.push(node);
            },
            //为form表单赋默认值
            getFormValue: function () {
                var _this = this,
                    formLoadData = {};
                $.each(_this.formDefaults, function (key, value) {
                    formLoadData[value.name] = value.iptKey;
                });
                $('#' + _this.createFormId).form('load', formLoadData);
            },
            //----------------------------------------------------------------
            setFormValue: function (formInitData) {
                var _this = this;
                $('#' + _this.createFormId).form('load', formInitData);
            },

            //为radio绑定默认事件
            radioDefaultHandle: function (node) {
                var _this = this;
                // 执行radio的回调事件
                for (var i = 0; i < _this.radioCallBack.length; i++) {
                    (function (j) {
                        if (node.name == _this.radioCallBack[j].radioName && _this.radioCallBack[j].defaultFn) {
                            _this.radioCallBack[j].defaultFn.call(node);
                        };
                    })(i);
                };
            },
            //为radio绑定点击事件
            radioClickHandle: function () {
                var _this = this;
                // 执行radio的回调事件
                for (var i = 0; i < _this.radioCallBack.length; i++) {
                    (function (j) {
                        // 利用事件委托为radio组绑定事件
                        $('.' + _this.radioCallBack[j].radioName + 'Wrap').on('click', 'input[name=' + _this.radioCallBack[j].radioName + ']', function () {
                            _this.radioCallBack[j].handleFn.call(this);
                        });
                        // $(document).on('change','input[name='+ _this.radioCallBack[j].radioName +']',function(){
                        //     _this.radioCallBack[j].handleFn.call(this);
                        // });

                    })(i);
                };
            },
            //为checkbox绑定默认事件
            checkDefaultHandle: function (node) {
                var _this = this;
                // 执行check的回调事件
                for (var i = 0; i < _this.checkCallBack.length; i++) {
                    (function (j) {
                        if (_this.checkCallBack[j].defaultFn) {
                            _this.checkCallBack[j].defaultFn.call(node);
                        };
                    })(i);
                };
            },
            //为checkbox绑定点击事件
            checkClickHandle: function () {
                var _this = this;
                // 执行 check 的回调事件
                for (var i = 0; i < _this.checkCallBack.length; i++) {
                    (function (j) {
                        // 利用事件委托为 check 组绑定事件
                        $('.' + _this.checkCallBack[j].checkName + 'Wrap').on('click', 'input[name=' + _this.checkCallBack[j].checkName + ']', function () {
                            _this.checkCallBack[j].handleFn.call(this);
                        });
                    })(i);
                };
            },
            comboBoxHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.comboBoxCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.comboBoxCallBack[j].comboBoxName).length) {
                            $('#' + _this.comboBoxCallBack[j].comboBoxName).combobox(_this.comboBoxCallBack[j].configField);
                        };
                    })(i);
                };
            },
            comboTreeHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.comboTreeCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.comboTreeCallBack[j].comboTreeName).length) {
                            $('#' + _this.comboTreeCallBack[j].comboTreeName).combotree(_this.comboTreeCallBack[j].configField);
                        };
                    })(i);
                };
            },
            dataBoxHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.dataBoxCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.dataBoxCallBack[j].dataBoxName).length) {
                            $('#' + _this.dataBoxCallBack[j].dataBoxName).datebox(_this.dataBoxCallBack[j].configField);
                        };
                    })(i);
                };
            },
            //整数框回调处理
            inputIntegerHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.inputIntegerCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.inputIntegerCallBack[j].inputIntegerName).length) {
                            $('#' + _this.inputIntegerCallBack[j].inputIntegerName).numberbox({
                                min: 0,
                                precision: 0
                            }).textbox(_this.inputIntegerCallBack[j].configField);
                        };
                    })(i);
                }
            },
            //金额框回调处理
            inputMoneyHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.inputMoneyCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.inputMoneyCallBack[j].inputMoneyName).length) {
                            $('#' + _this.inputMoneyCallBack[j].inputMoneyName).numberbox({
                                min: 0,
                                precision: _this.inputMoneyCallBack[j].precision
                            }).textbox(_this.inputMoneyCallBack[j].configField);
                        };

                    })(i);
                }
            },
            //大文本框回调处理
            textareaHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.textareaCallBack.length; i++) {
                    (function (j) {
                        if ($('#' + _this.textareaCallBack[j].textareaName).length) {
                            _this.textareaCallBack[j].configField.multiline = true;
                            $('#' + _this.textareaCallBack[j].textareaName).textbox(_this.textareaCallBack[j].configField);
                            //大文本框字数限制代码
                            Tools.ChangeNum($('#' + _this.textareaCallBack[j].textareaName), _this.textareaCallBack[j].prompt, _this.textareaCallBack[j].max_length);
                        };
                    })(i);
                }
            }
        };
        return Fn;
    }();
    /*
     * 功能：动态创建checkbox
     * 创建人：yangjianxue
     * dataSource ：checkbox数据源(必传)
     * eleName ：要素名称(必传)
     * paramId ： 要素id 默认为 ID
     * paramCode : 要素code 默认为 CODE
     * paramIptVal ：要素value 默认为 ID
     * paramLabelVal : label显示值 默认为 CODENAME*/
    CreateEleFn.createCheckbox = function (obj) {
        var dataSource = obj.dataSource;
        var eleName = obj.eleName;
        var paramId = obj.paramId ? obj.paramId : 'ID';
        var paramCode = obj.paramCode ? obj.paramCode : 'CODE';
        var paramIptVal = obj.paramIptVal ? obj.paramIptVal : 'ID';
        var paramLabelVal = obj.paramLabelVal ? obj.paramLabelVal : 'CODENAME';
        var curCon = '';
        if (dataSource) {
            $.each(dataSource, function (key, value) {
                var code = value[paramCode] ? value[paramCode] : null;
                curCon += "<input type='checkbox' id='" + value[paramId] + "'  name='" + eleName + "' value='" + value[paramIptVal] + "' data-code='" + code + "' class='FieldValue'/>" +
                    "<label for='" + value[paramId] + "' class='dyCheck'>" + value[paramLabelVal] + "</label>";
            });
        };
        return curCon;
    }
    /*
     * 功能：动态创建radioGroup
     * 创建人：yangjianxue
     * dataSource ：radio数据源(必传)
     * eleName ：要素名称(必传)
     * paramId ： 要素id 默认为 ID
     * paramCode : 要素code 默认为 CODE
     * paramIptVal ：要素value 默认为 ID
     * paramLabelVal : label显示值 默认为 CODENAME*/
    CreateEleFn.createRadioGroup = function (obj) {
        var dataSource = obj.dataSource;
        var eleName = obj.eleName;
        var paramId = obj.paramId ? obj.paramId : 'ID';
        var paramCode = obj.paramCode ? obj.paramCode : 'CODE';
        var paramIptVal = obj.paramIptVal ? obj.paramIptVal : 'ID';
        var paramLabelVal = obj.paramLabelVal ? obj.paramLabelVal : 'CODENAME';
        var curCon = '';
        if (dataSource) {
            $.each(dataSource, function (key, value) {
                var code = value[paramCode] ? value[paramCode] : null;
                curCon += "<input type='radio' id='" + value[paramId] + "'  name='" + eleName + "' value='" + value[paramIptVal] + "' data-code='" + code + "' class='FieldValue'/>" +
                    "<label for='" + value[paramId] + "' class='dyRaio'>" + value[paramLabelVal] + "</label>";
            });
        };
        return curCon;
    }
    /*
     * 功能：动态创建comboTree
     * 创建人：yangjianxue
     * eleName ：要素名称(必传)
     * eleCodeName ：要素标签的id(必传)
     * eleId ： 要素对应的隐藏标签的id
     * eleCode : 要素对应的隐藏标签的code
     * menuid ：url默认参数*/
    CreateEleFn.createComboTree = function (obj) {
        var eleName = obj.eleName;
        var eleCodeName = obj.eleCodeName;
        var eleId = obj.eleId;
        var eleCode = obj.eleCode;
        var idField = obj.idField ? obj.idField : 'ID';
        var textField = obj.textField ? obj.textField : 'CODENAME';
        var parentField = obj.parentField ? obj.parentField : 'PARENT_ID';
        var levelNum = obj.levelNum;
        var menuid = obj.menuid;
        $('#' + eleCodeName).combotree({
            prompt: '请选择',
            idField: idField,
            textField: textField,
            parentField: parentField,
            height: 36,
            onLoadSuccess: function () {},
            onSelect: function (record) {
                $('input[name=' + eleId + ']').val(record.ID);
                $('input[name=' + eleCode + ']').val(record.CODE);
            }
        });
        CreateEleFn.loadComboTreeData({
            eleCodeName: eleCodeName,
            eleName: eleName,
            levelNum: levelNum,
            menuid: menuid
        });
    }

    CreateEleFn.loadComboTreeData = function (obj) {
        var eleCodeName = obj.eleCodeName;
        var eleName = obj.eleName;
        var levelNum = obj.levelNum;
        var menuid = obj.menuid;
        var data = Tools.callElement({
            eleCode: eleName,
            levelNum: levelNum,
            menuid: menuid
        });
        $('#' + eleCodeName).combotree({
            data: data
        }).combotree('loadData', data);
    }
    /*
     * 功能：动态创建combobox
     * 创建人：yangjianxue
     * eleName ：要素名称(必传)
     * eleCodeName ：要素标签的id(必传)
     * valueField ：value 值
     * textField ：下拉框展示的值
     * eleId ： 要素对应的隐藏标签的id
     * eleCode : 要素对应的隐藏标签的code
     * levelNum ： 要素级别
     * menuid ：url默认参数*/
    CreateEleFn.createComboBox = function (obj) {
        var eleName = obj.eleName;
        var eleCodeName = obj.eleCodeName;
        var valueField = obj.valueField ? obj.valueField : 'CODE';
        var textField = obj.textField ? obj.textField : 'CODENAME';
        var eleId = obj.eleId;
        var eleCode = obj.eleCode;
        var levelNum = obj.levelNum;
        var menuid = obj.menuid;
        $('#' + eleCodeName).combobox({
            valueField: valueField,
            textField: textField,
            disabled: false,
            prompt: '请选择',
            height: 36,
            onLoadSuccess: function () {},
            onSelect: function (record) {
                $('input[name=' + eleId + ']').val(record.ID);
                $('input[name=' + eleCode + ']').val(record.CODE);
            }
        });
        CreateEleFn.loadComboBoxData({
            eleCodeName: eleCodeName,
            eleName: eleName,
            levelNum: levelNum,
            menuid: menuid
        });
    }

    CreateEleFn.loadComboBoxData = function (obj) {
        var eleCodeName = obj.eleCodeName;
        var eleName = obj.eleName;
        var levelNum = obj.levelNum;
        var menuid = obj.menuid;
        var data = Tools.callElement({
            eleCode: eleName,
            levelNum: '',
            menuid: menuid
        });
        $('#' + eleCodeName).combobox({
            data: data
        }).combobox('loadData', data);
    }


    /*
     * 功能：查找锚点元素
     * 创建人：yangjianxue
     * formId ：from 的id */
    CreateEleFn.getTabEl = function (obj) {
        var originObj = obj.originObj,
            elClass = obj.elClass;
        var el = '';
        $.each(originObj, function (key, value) {
            if ($(this).hasClass(elClass)) {
                el = $(this);
                return false;
            };
        });
        return el;
    };


    /*
     * 功能：获取动态form的所有值
     * 创建人：yangjianxue
     * formId ：from 的id */
    CreateEleFn.getForm = function (obj) {
        var formId = obj.formId;
        var objData = {};
        var array = formId.serializeArray();
        $.each(array, function () {
            objData[this.name] = this.value;
        });
        return objData;
    };

    /*
     * 功能：动态创建datagridColumn
     * 参数：
     * loadColumnUrl ：列表头的数据请求路径
     * columnData ：获取到的列表头信息*/
    CreateEleFn.createDatagridColumn = function (obj) {
        var loadColumnUrl = obj.columnUrl ? obj.columnUrl : '';
        var columnData = obj.columnData ? obj.columnData : [];
        var columnArr = [];
        if (columnUrl) {
            $.ajax({
                url: loadColumnUrl,
                type: 'GET',
                async: false,
                success: function (data) {
                    columnData = data;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        };
        if (columnData) {
            $.each(columnData, function (key, value) {
                columnArr[0] = [];
                if (value.is_visible) {
                    columnArr[0].push({
                        field: value.property_name,
                        title: value.column_user_name,
                        // width:'100%',
                        editor: "text",
                        halign: 'center',
                        align: 'left'
                    })
                }

            });
        };
        return columnArr;
    }

    /*
     * 功能：动态创建按钮组
     * domWrap ：承载动态元素的Wrap
     * loadLeftDataUrl  : form表单的左侧数据请求路径
     * loadLeftData ： 按钮的数据
     * btnCallBack : radio的回调(包括默认事件的回调，点击事件的回调)
     *    */
    CreateEleFn.createBtn = function () {
        var Fn = function (obj) {
            this.domWrap = obj.domWrap;
            this.loadBtnUrl = obj.loadBtnUrl ? obj.loadBtnUrl : '';
            this.loadUrlParam = obj.loadUrlParam ? obj.loadUrlParam : '';
            this.loadLeftData = obj.loadLeftData ? obj.loadLeftData : [];
            this.btnCallBack = obj.btnCallBack ? obj.btnCallBack : [];
            this.loading = {
                //index 当前展示tab页的钩子
                add: function (index) {
                    console.log('加载中。。。');
                    // var $la = this.$pagesParent.find('.loadingArea' +index);
                    // if ($la.length != 0) { $la.remove(); };
                    // $la = $('<div class="loadingArea' + index + '"">加载中。。。</div>');
                    // $la.appendTo(this.$pagesParent).siblings().hide();
                },
                hide: function (index) {
                    console.log('结束加载。。。');
                    // var $la = this.$pagesParent.find('.loadingArea' +index);
                    // if ($la.css('display') != 'none') {
                    //     this.tabChangew(index);
                    // };
                    // $la.remove();
                }
            };
            this.init();
        };
        Fn.prototype = {
            constructor: Fn,
            init: function () {
                if (this.loadLeftData.length) {
                    this.createBtnHandle(this.loadLeftData);
                } else {
                    this.getBtnVal();
                };
            },
            getBtnVal: function () {
                var _this = this;
                $.ajax({
                    url: _this.loadBtnUrl,
                    data: _this.loadUrlParam,
                    type: "GET",
                    success: function (data) {
                        if (data) {
                            _this.createBtnHandle(data);
                        };
                    }
                });
            },
            createBtnHandle: function (data) {
                var _this = this,
                    con = '';
                for (var i = 0; i < data.length; i++) {
                    // 按钮显示状态
                    // if(data[i].btn_type == 1){//有任务可编辑：如新增，修改
                    //
                    // }else if(data[i].btn_type == 2){//无任务不可编辑：如保存，取消
                    //
                    // }else(data[i].btn_type == 3){//随时可用：如导入导出查看
                    //
                    // }else{//置灰
                    //
                    // }
                    var btn = data[i].property_name;
                    if (data[i].greyClass) {
                        con += '<a href="javascript:;" id="' + btn + '" class="topBtns grayEntityBtn">' + data[i].column_name + '</a>';
                    } else {
                        con += '<a href="javascript:;" id="' + btn + '" class="topBtns projHollowBtn">' + data[i].column_name + '</a>';
                    }


                };
                _this.domWrap.append(con);
                if (_this.btnCallBack) {
                    _this.btnCallBackHandle();
                };
            },
            btnCallBackHandle: function () {
                var _this = this;
                for (var i = 0; i < _this.btnCallBack.length; i++) {
                    (function (j) {
                        // 利用事件委托为radio组绑定事件
                        if (_this.btnCallBack[j].btnName) {
                            $('#' + _this.btnCallBack[j].btnName).off().on('click', function () {
                                if (!$(this).hasClass('grayEntityBtn')) {
                                    _this.loading.add.call(_this);
                                    _this.btnCallBack[j].handleFn.call(this, function () {
                                        _this.loading.hide.call(_this);
                                    });
                                };

                            });
                        };
                    })(i);
                };
            }

        };
        return Fn;
    }();
    /*
     * 功能 ： 动态创建- 侧边栏 - 锚点
     * 创建人 ： yangjianxue
     * 参数：
     * elTitleArr : 锚点对应的标签集合
     * tabPointWrap ： 为避免重复可以多传一个class,用于绑定事件的锚点的wrap*/
    CreateEleFn.createTabPoint = function (obj) {
        var elTitleArr = obj.elTitleArr;
        var elTitleArrLen = elTitleArr.length;
        var tabPointWrap = obj.tabPointWrap ? obj.tabPointWrap : '';
        var con = '<div class="tabPointWrap " ' + tabPointWrap + '>' +
            '<div class="enRoutePointCon">' +
            '<div class="tabPointMain">';
        for (var i = 0; i < elTitleArrLen; i++) {
            var objTxt = $(elTitleArr[i]).text();
            var tabHref = $(elTitleArr[i]).attr('id');
            if (i == 0) {
                con += '<a href="#' + tabHref + '" class="tabPoint cur">' + objTxt + '</a>';
            } else if (i == elTitleArrLen - 1) {
                con += '<a href="#' + tabHref + '" class="tabPoint">' + objTxt + '</a>';
            } else {
                con += '<a href="#' + tabHref + '" class="tabPoint">' + objTxt + '</a>';
            };
        }
        con += '</div></div></div>';
        return con;
    }
    /*
     * 功能 ： 动态创建- 侧边栏 - tab切换
     * 创建人 ： yangjianxue
     * 参数：
     * ajaxUrl : 锚点数据的请求路径
     * tabSwitchWrap ： 页面中承载创建的tab元素
     * ifameWrap ： 锚点上的页面url 需要在哪个ifame中切换
     * tabUrl : 绑定了点击tab需要跳转的页面的url,以及需要传递的新页面中的参数
     * 说明：
     * 1、根据接口里返回的数据动态穿件tab的个数，目前功能每个tab对应一个页面
     * 2、每个tab上都绑定了点击tab需要跳转的页面的url,以及需要传递的新页面中的参数有 menuid ,ui_code,view_id,report_id
     * 3、control_id是每个锚点唯一的标识
     * 4、view_user_name是每个锚点的展示文本*/
    CreateEleFn.createTabSwitch = function (obj) {
        var ajaxUrl = obj.ajaxUrl ? obj.ajaxUrl : '';
        var originData = obj.originData ? obj.originData : [];
        var tabSwitchWrap = obj.tabSwitchWrap;
        var ifameWrap = obj.ifameWrap;
        var otherParam = obj.otherParam ? obj.otherParam : '';
        var tabCurClass = '';
        var verifySaveCallBacks = obj.verifySaveCallBacks ? obj.verifySaveCallBacks : [];

        var con = '',
            tabData = [];
        if (ajaxUrl) {
            $.ajax({
                type: 'GET',
                url: ajaxUrl,
                async: false,
                success: function (data) {
                    tabData = data;
                },
                error: function (err) {
                    console.log(err)
                }
            });
        } else if (originData) {
            tabData = originData;
        };

        if (tabData && tabData.length > 0) {
            for (var i = 0; i < tabData.length; i++) {
                var url = '';
                var obj = JSON.stringify(tabData[i]);
                if (otherParam) {
                    url = tabData[i].url + '&ui_code=' + tabData[i].ui_code + '&reportid=' + tabData[i].report_id + otherParam;
                } else {
                    url = tabData[i].url + '&ui_code=' + tabData[i].ui_code + '&reportid=' + tabData[i].report_id;
                };
                if (i == 0) {
                    if (otherParam) {
                        tabData[0].url = tabData[i].url + '&ui_code=' + tabData[i].ui_code + '&reportid=' + tabData[i].report_id + otherParam;
                    } else {
                        tabData[0].url = tabData[i].url + '&ui_code=' + tabData[i].ui_code + '&reportid=' + tabData[i].report_id;
                    };
                    con += '<div id="' + tabData[i].control_id + '" data-url="' + url + '" class="tab cur ' + tabData[i].control_id + '" >' + tabData[i].view_user_name + '<input type="text" hidden value=' + obj + ' /></div>';
                } else if (i == tabData.length - 1) {
                    con += '<div id="' + tabData[i].control_id + '" data-url="' + url + '" class="tab bdNo ' + tabData[i].control_id + '">' + tabData[i].view_user_name + '<input type="text" hidden value=' + obj + ' /></div>'
                } else {
                    con += '<div id="' + tabData[i].control_id + '" data-url="' + url + '" class="tab ' + tabData[i].control_id + '" >' + tabData[i].view_user_name + '<input type="text" hidden value=' + obj + ' /></div>'
                };
            };
            tabCurClass = tabData[0].control_id;
            tabSwitchWrap.append(con);
            ifameWrap.attr("src", tabData[0].url);

            for (var j = 0; j < tabData.length; j++) {
                (function (k) {
                    $('.tab').eq(k).on('click', function () {

                        if (verifySaveCallBacks) {
                            $.each(verifySaveCallBacks, function (key, value) {
                                if (value.tabId == tabCurClass) {
                                    var verifyCallBack = value.verifyCallBack;
                                    var saveCallBack = value.saveCallBack;
                                    var verify = document.getElementById("repbilEditIframe").contentWindow[verifyCallBack];
                                    var save = document.getElementById("repbilEditIframe").contentWindow[saveCallBack];
                                    var verifyFlag = verify.call(this);
                                    if (verifyFlag) {
                                        save.call(this);
                                    };
                                    return false;
                                };
                            });
                        };
                        $(this).addClass('cur').siblings().removeClass('cur');
                        var url = $(this).data('url');
                        ifameWrap.attr("src", url);
                        tabCurClass = $(this).attr('id');
                    });
                })(j);
            };

        }
    }


})();

//重写树控件（数据加载）-- 平台提供
$.fn.tree.defaults.loadFilter = function (data, parent) {
    var opt = $(this).data().tree.options;
    var idField, textField, parentField;
    if (opt.parentField) {
        idField = opt.idField || 'id';
        textField = opt.textField || 'text';
        parentField = opt.parentField;
        var i, treeData = [],
            tmpMap = [];
        var l = data.length;
        for (i = 0; i < l; i++) {
            tmpMap[data[i][idField]] = data[i];
        }
        for (i = 0; i < l; i++) {
            if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
                if (!tmpMap[data[i][parentField]]['children'])
                    tmpMap[data[i][parentField]]['children'] = [];
                data[i]['text'] = data[i][textField];
                tmpMap[data[i][parentField]]['children'].push(data[i]);
            } else {
                data[i]['text'] = data[i][textField];
                treeData.push(data[i]);
            }
        }
        return treeData;
    }
    return data;
};
//重写combotree（数据加载）-- 平台提供
$.fn.combotree.defaults.loadFilter = $.fn.tree.defaults.loadFilter;
//
// //重写树控件（数据加载）-- 平台提供
// $.fn.treegrid.defaults.loadFilter = function (data, parent) {
//     var opt = $(this).data().datagrid.options;
//     var idField,textField,parentField;
//     if (opt.parentField) {
//         idField = opt.idField || 'id';
//         textField = opt.textField || 'text';
//         parentField = opt.parentField;
//         var i,treeData = [],tmpMap = [];
//         var l = data.length;
//         for (i = 0; i < l; i++) {
//             tmpMap[data[i][idField]] = data[i];
//         }
//         for (i = 0; i < l; i++) {
//             if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
//                 if (!tmpMap[data[i][parentField]]['children'])
//                     tmpMap[data[i][parentField]]['children'] = [];
//                 data[i]['textField'] = data[i][textField];
//                 tmpMap[data[i][parentField]]['children'].push(data[i]);
//             } else {
//                 data[i]['textField'] = data[i][textField];
//                 treeData.push(data[i]);
//             }
//         }
//         console.log('1---------------------');
//         console.log(treeData);
//         return treeData;
//     }
//     console.log('2---------------------');
//     console.log(data);
//     return data;
// };
//重写combotree（数据加载）-- 平台提供
// $.fn.treegrid.defaults.loadFilter = $.fn.tree.defaults.loadFilter;