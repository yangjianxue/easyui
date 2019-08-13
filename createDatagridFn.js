/*
 * 动态创建datagrid
 * 创建人:yangjianxue
 */

var reg = /[\+\-\*\/()]/; //正则判断算数运算符
;
(function () {
    if (window.CreateEleFn === undefined) {
        window.CreateEleFn = {};
    };
    /*
     * 功能：动态创建form表单
     * domWrap ：承载动态元素的Wrap
     * datagridId : 动态创建的datagrid的id
     * loadDatagridPropUrl : 从远程站点请求数据的 URL
     * loadDatagridPropData : 需要创建的基本信息
     // * datagridInitParam ： datagrid操作的默认参数
     * datagridSelfParam : datagrid创建表格的默认参数
     *
     *    */
    CreateEleFn.CreateDatagrid = function () {
        var Fn = function (obj) {
            this.domWrap = obj.domWrap;
            this.datagridId = obj.datagridId;
            this.loadDatagridPropUrl = obj.loadDatagridPropUrl;
            this.loadDatagridPropData = obj.loadDatagridPropData;
            // this.datagridInitParam = obj.datagridInitParam;
            this.datagridSelfParam = obj.datagridSelfParam;
            this.needCalArr = []; //需要合计的字段
            this.init();
        };
        Fn.prototype = {
            constructor: Fn,
            init: function () {
                // 数据是否需要请求
                if (this.loadDatagridPropUrl) {
                    var proarrsArr = this.getDatagridProp(this.loadDatagridPropUrl); //ajax动态请求
                    this.createDatagridByView({
                        proarrs: proarrsArr,
                        datagridSelfParam: this.datagridSelfParam
                        // datagridInitParam:this.datagridInitParam
                    }); //已经确定数据，直接进行页面创建
                } else {
                    this.createDatagridByView({
                        proarrs: this.loadDatagridPropData,
                        datagridSelfParam: this.datagridSelfParam
                        // datagridInitParam:this.datagridInitParam
                    }); //已经确定数据，直接进行页面创建
                };
            },
            // 表格默认参数
            returnInitParam: function (obj) {
                var newParams = CreateEleFn.extend({
                    pagination: obj.is_page
                }, obj);
                return newParams;
            },
            // 从远程站点请求数据
            getDatagridProp: function (url) {
                var loadDgPropData = [];
                $.ajax({
                    url: url,
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        loadDgPropData = data;
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                return loadDgPropData;
            },
            //创建 datagrid 视图
            createDatagridByView: function (obj) {
                var _this = this,
                    infoCon = '',
                    proarrsObj = obj.proarrs,
                    // datagridInitParam = obj.datagridInitParam,
                    datagridSelfParam = obj.datagridSelfParam;
                if (proarrsObj && proarrsObj.is_visible) {
                    //可编辑--(需要单独判断每一项是否可编辑)
                    infoCon = '<div id="' + _this.datagridId + '" class="createDatagrid"></div>';
                    _this.domWrap.append(infoCon);
                    if (proarrsObj.psUvColumnList) {
                        // 处理多表头
                        var multColums = CreateEleFn.multiColumnData(proarrsObj.psUvColumnList);
                        //处理操作列
                        if (datagridSelfParam.isNewAdd) {
                            var demo = 'addBtn' + datagridSelfParam.suffix;
                            multColums[0].unshift({
                                "column_length": 60,
                                "column_name": "操作",
                                "column_type": -1,
                                "property_name": "operat",
                                "column_user_name": "操作<a class='" + demo + " handleBtn add-class'></a>",
                                "template_id": 19000050,
                                "is_visible": 1,
                                "is_input": 0,
                                "is_enabled": 0,
                                "column_level": 0,
                                "is_using": 0,
                                "column_id": -1,
                                "parent_id": 0,
                                'row_span': multColums.length,
                                'col_span': 1
                            });
                        };
                        if (datagridSelfParam.is_btn) {
                            multColums[multColums.length - 1].push({
                                "column_length": 120,
                                "column_name": "操作按钮",
                                "column_type": -1,
                                "property_name": "frontOperat",
                                "column_user_name": "操作按钮",
                                "template_id": 19000050,
                                "is_visible": 1,
                                "is_input": 0,
                                "is_enabled": 0,
                                "column_level": 0,
                                "is_using": 0,
                                "column_id": -2,
                                "parent_id": 0,
                                'row_span': multColums.length,
                                'col_span': 1,
                                'is_btn': 1
                            })
                        };
                        var columnsD = CreateEleFn.createDatagridColumn({
                            datagridSelfParam: datagridSelfParam,
                            dataOrigin: multColums,
                            originObj: proarrsObj
                        });
                    };
                };
                //动态创建 datagrid
                CreateEleFn.datagridBindHandle({
                    datagridId: _this.datagridId,
                    proarrsObj: proarrsObj,
                    columns: columnsD,
                    // datagridInitParam:datagridInitParam,
                    datagridSelfParam: datagridSelfParam
                });
                //点击按钮或者表格其他区域取消编辑状态
                Tools.blurDatagridFn({
                    clickBtnEl: this.datagridSelfParam.clickBtnEl,
                    idLabel: $('#' + this.datagridId),
                    isMerges: this.datagridSelfParam.isMerges
                });
            }

        };
        return Fn;
    }();
    //处理多表头
    CreateEleFn.multiColumnData = function (columns) {
        var newColumn = [];
        // var arrIndex = 0;
        var curLevNum = columns[0].column_level;

        $.each(columns, function (key, value) {
            if (typeof newColumn[value.column_level - 1] == 'undefined') {
                newColumn[value.column_level - 1] = [];
            };
            // if(value.column_level == curLevNum){
            //     newColumn[arrIndex].push(value);
            // }else{
            //     arrIndex += 1;
            //     newColumn[arrIndex] = [];
            //     curLevNum = value.column_level;
            newColumn[value.column_level - 1].push(value);
            // };
        });
        return newColumn;
    };

    //动态column
    CreateEleFn.createDatagridColumn = function (obj) {
        var dataOrigin = obj.dataOrigin;
        var dataOriginLen = dataOrigin.length;
        var datagridSelfParam = obj.datagridSelfParam;
        var columnsObj = {};
        var columnArr = [];
        var totleIndex = 0;
        var needTotalField = [];
        var originObj = obj.originObj;
        for (var i = 0; i < dataOriginLen; i++) {
            columnArr[i] = [];
            $.each(dataOrigin[i], function (key, value) {
                if (value.is_visible) {
                    var alignType = value.column_type == -1 ? 'center' : ((value.column_type == 7 || value.column_type == 8 || value.column_type == 6) ? 'right' : 'left');
                    if (value.column_type == 7 || value.column_type == 8) {
                        needTotalField.push(value.property_name);
                    };
                    var obj = {
                        "field": value.property_name,
                        "title": value.column_user_name,
                        "halign": 'center',
                        "align": alignType,
                        "width": value.column_length,
                        "rowspan": value.row_span,
                        "colspan": value.col_span
                    };
                    //编辑状态
                    if (value.is_enabled) {
                        datagridSelfParam.is_enabled = true;
                        // // *枚举值转换
                        // // * 列类型0文本框；1下拉框；2多选下拉框；3单选框；4复选框；5辅助录入（下拉树）；6日期选择框；7整数框；8金额框；12大文本框；
                        var curCellType = CreateEleFn.ReturnEnumType(value.column_type);
                        var validTypeVal = '';
                        if (value.column_type == 0 || value.column_type == 12) {
                            validTypeVal = 'isAmongLen[' + value.min_length + ',' + value.max_length + ']';
                        };
                        if (value.column_type == 7) {
                            validTypeVal = 'isIntNum';
                        };
                        if (value.column_type == 8) {
                            validTypeVal = 'isMoney[' + value.dec_len + ']';
                        };
                        if (value.column_type == 1) {
                            // 获取下拉框要素值
                            var eleData = Tools.callElement({
                                eleCode: value.data_source,
                                levelNum: '',
                                menuid: datagridSelfParam.menuid
                            });
                            //获取当前要素的展示字段
                            var showType = value.show_type == 1 ? 'CODE' : (value.show_type == 2 ? 'NAME' : 'CODENAME');
                            obj.editor = {
                                'type': curCellType,
                                'options': {
                                    required: value.is_input == 1 ? true : false,
                                    data: (eleData && eleData.length) ? eleData : [],
                                    valueField: 'id',
                                    textField: showType,
                                    disabled: false,
                                    editable: false,
                                    prompt: '请选择',
                                    panelWidth: 300,
                                    onSelect: function (record) {
                                        // 如果指定level_num 那么只能选中同级别的要素，如果是0 则可以选择所有级别，如果是9那么只能选择底级
                                        if (value.level_num == 9 && !record.isLeaf) {
                                            return false;
                                        } else if (value.level_num > 0 || value.level_num < 9) {
                                            if (record.LEVEL_NUM != value.level_num) {
                                                return false;
                                            };
                                        };
                                    },
                                    validType: validTypeVal
                                }
                            };
                        } else if (value.column_type == 5) {
                            // 获取下拉框要素值
                            var eleData = Tools.callElement({
                                eleCode: value.data_source,
                                levelNum: '',
                                menuid: datagridSelfParam.menuid
                            });
                            //获取当前要素的展示字段
                            var showType = value.show_type == 1 ? 'CODE' : (value.show_type == 2 ? 'NAME' : 'CODENAME');
                            //普通要素（xxx_xxx_id）需要给后台返回 （xxx_xxx_code/xxx_xxx_name）
                            var propertyNameArr = value.property_name.split('_');
                            if (propertyNameArr.length) {

                                if(propertyNameArr[propertyNameArr.length -1] == 'id'){
                                    var curShow = '';
                                    $.each(propertyNameArr, function (key, value) {
                                        if (value == 'id') {
                                            return false;
                                        };
                                        var aa = value + '_';
                                        curShow += aa;
                                    });
                                    var showId = value.property_name;
                                    var showCode = curShow + 'code';
                                    var showName = curShow + 'name';
                                }else{
                                    showType = value.property_name;
                                };

                            };
                            obj.editor = {
                                'type': curCellType,
                                'options': {
                                    required: value.is_input == 1 ? true : false,
                                    data: (eleData && eleData.length) ? eleData : [],
                                    idField: 'id',
                                    textField: showType,
                                    parentField: "PARENT_ID",
                                    editable: false,
                                    disabled: false,
                                    prompt: '请选择',
                                    panelWidth: 300,
                                    onSelect: function (record) {
                                        // 如果指定level_num 那么只能选中同级别的要素，如果是0 则可以选择所有级别，如果是9那么只能选择底级
                                        if (value.level_num == 9 && !record.isLeaf) {
                                            return false;
                                        } else if (value.level_num > 0 || value.level_num < 9) {
                                            if (record.LEVEL_NUM != value.level_num) {
                                                return false;
                                            };
                                        };
                                    }
                                    // validType:validTypeVal
                                }
                            };
                            obj.formatter = function (value, row, index) {
                                //当要素值唯一时默认选中
                                if (eleData && eleData.length == 1) {
                                    if (value == row[showId] && row[showType]) {
                                        return row[showType];
                                    } else {
                                        row[showCode] = eleData[0].CODE;
                                        row[showName] = eleData[0].NAME;
                                        return eleData[0][showType];
                                    };

                                };
                                if (value) {
                                    if (value == row[showId] && row[showType]) {
                                        return row[showType];
                                    } else {
                                        for (var i = 0; i < eleData.length; i++) {
                                            if (eleData[i].id == value) {
                                                row[showCode] = eleData[i].CODE;
                                                row[showName] = eleData[i].NAME;
                                                return eleData[i][showType];
                                            };
                                        };
                                    };
                                };
                            };
                        } else {
                            obj.editor = {
                                'type': curCellType,
                                'options': {
                                    required: value.is_input == 1 ? true : false,
                                    panelWidth: 300
                                    // validType:validTypeVal
                                }
                            };
                        };
                    };
                    if (datagridSelfParam.isSpecialDg && totleIndex == 0) {
                        obj["formatter"] = function (value, row, index) {
                            var a = '';
                            if (index == 0) {
                                a = row[originObj.specialfield] + '<a class="addBtn handleBtn add-class"></a>';
                            } else if (row.isTotal) {
                                a = '<a>合计</a>';
                            } else if (row.title_field) {
                                a = row.title_field + '<a class="addBtn handleBtn add-class"></a>';
                            } else {
                                a = '<span class="cover-btn delBtn"><a class="handleBtn remove-class"></a><span>';
                            };
                            return a;
                        };
                        totleIndex += 1;
                    } else if (datagridSelfParam.isNewAdd && totleIndex == 0) {
                        obj["formatter"] = CreateEleFn.dgFormatter;
                        totleIndex += 1;
                    } else if ((originObj.is_show_sum == 1) && totleIndex == 0) {
                        obj["formatter"] = CreateEleFn.dgIsTotal;
                        totleIndex += 1;
                    };

                    if (value.is_btn == 1) {
                        obj["formatter"] = datagridSelfParam.isBtnFormatter;
                    };
                    //列上是否带有公式
                    if (value.formula_express) {
                        obj.calFormula = value.formula_express;
                    };
                    //列上是否需要formatt
                    if (datagridSelfParam.columnFormattArr && datagridSelfParam.columnFormattArr.length) {
                        $.each(datagridSelfParam.columnFormattArr, function (k, v) {
                            if (v.columnFiled == value.property_name) {
                                obj["formatter"] = v.columnFormatter;
                                return false;
                            };
                        });
                    };
                    columnArr[i].push(obj);
                };
            });
            if (needTotalField.length) {
                datagridSelfParam.needTotalField = needTotalField;
            } else {
                datagridSelfParam.needTotalField = [];
            }
        };

        columnsObj["columns"] = columnArr;
        columnsObj["columns"][0].unshift({
            "field": "ck",
            "halign": 'center',
            "align": 'center',
            "width": 60,
            "rowspan": 2,
            "colspan": 1,
            "checkbox": true
        });
        // if (proarrsObj.is_checkbox) {

        // }
        return columnsObj;
    };

    CreateEleFn.datagridBindHandle = function (obj) {
        var datagridId = obj.datagridId;
        var proarrsObj = obj.proarrsObj;
        var columns = obj.columns;
        var titleFieldArr1 = [];
        var titleFieldArr = [];
        var datagridSelfParam = obj.datagridSelfParam;
        var curSpecialField = proarrsObj.specialfield;
        if (datagridSelfParam.data && datagridSelfParam.data.length) {
            $.each(datagridSelfParam.data, function (key, value) {
                //数组去重-整理titleFieldArr[{'specialfield':value}]
                if (titleFieldArr1.indexOf(value[proarrsObj.specialfield]) < 0) {
                    titleFieldArr1.push(value[proarrsObj.specialfield]);
                    var curStr = '{' + curSpecialField + ':value[proarrsObj.specialfield]}';
                    var curObj = eval("(" + curStr + ")");
                    titleFieldArr.push(curObj);
                };
            });
        };
        //需要合计，- 默认处理初始化数据（增加合计行）
        if (datagridSelfParam.isSpecialDg && proarrsObj.is_show_sum) {
            var newData = Tools.easyuiDataInit({
                datas: datagridSelfParam.data,
                isDefaultRow: datagridSelfParam.isDefaultRow,
                isPfsSpecial: true,
                isTotal: proarrsObj.is_show_sum == 1 ? true : false,
                specialField: proarrsObj.specialfield,
                titleFieldArr: titleFieldArr,
                datagridData: datagridSelfParam.data
            });
        } else if (proarrsObj.is_show_sum) {
            var newData = Tools.easyuiDataInit({
                datas: datagridSelfParam.data,
                isDefaultRow: datagridSelfParam.isDefaultRow,
                isTotal: proarrsObj.is_show_sum == 1 ? true : false
            });
        };

        var param = CreateEleFn.extend(datagridSelfParam, columns);

        //是否需要分页
        if (proarrsObj.is_page) {
            // param.pagePosition = proarrsObj.pagePosition ? proarrsObj.pagePosition : 'bottom';
            param.pagination = true;
            param.pageSize = 20;
            param.pageList = [20, 50, 100, 200]; //分页的选择列表
        };
        //数据加载成功后触发事件
        param.onLoadSuccess = CreateEleFn.onLoadSuccessFn({
            proarrsObj: proarrsObj,
            datagridId: datagridId,
            param: param,
            loadSuccessFn: param.loadSuccessFn ? param.loadSuccessFn : null
        });

        // 单元格单击事件
        if (datagridSelfParam.is_enabled) {
            param.onClickCell = function (index, field, value) {
                $('#' + datagridId).datagrid('onClickCell', {
                    idLabel: $('#' + datagridId),
                    index: index,
                    field: field,
                    value: value,
                    isTotal: proarrsObj.is_show_sum,
                    calField: calField,
                    isCalField: param.isForMula == true ? true : false,
                    isNotSpecialDg: datagridSelfParam.isSpecialDg == true ? false : true
                });
            };
        };
        $('#' + datagridId).datagrid(param);
        if (newData) {
            $('#' + datagridId).datagrid('loadData', newData);
        };
        //初始化公式计算  [（单位成本或标准 + 计量单位）* 工作量 = 项目任务明细]
        var calField = Tools.getHiddenColField({
            idLabel: $('#' + datagridId),
            calFormula: 'calFormula' //携带公式的字段
        });
        //计算合计
        if (datagridSelfParam.isSpecialDg && proarrsObj.is_show_sum) {
            Tools.calculate({
                isSpecialDg: true,
                needCalArr: param.needTotalField,
                idLabel: $('#' + datagridId),
                total: param.he
            });
        } else if (proarrsObj.is_show_sum) {
            Tools.calculate({
                needCalArr: param.needTotalField,
                idLabel: $('#' + datagridId),
                total: param.he
            });
        };

    };

    // CreateEleFn.clickCellHandle = function(index, field, value){
    //
    // };

    CreateEleFn.dgFormatter = function (value, row, index) {
        var a = '';
        if (row.isTotal) {
            a = '<span class="dp_b ta_c">合计</span>';
        } else {
            a = '<span class="cover-btn delBtn"><a class="handleBtn remove-class"></a><span>';
        };
        // else if(row["firTotalField"]){
        //     a = row["firTotalField"];
        // };
        return a;
    };
    CreateEleFn.dgIsTotal = function (value, row, index) {
        var a = '';
        if (row.isTotal) {
            a = '<span class="dp_b ta_c">合计</span>';
        } else {
            a = value;
        };
        return a;
    };
    // CreateEleFn.isSpecialTotal = function(value, row, index){
    //     var a = '';
    //     if(row.isTotal) {
    //         a = '<span class="dp_b ta_c">合计</span>';
    //     }else{
    //         a = value;
    //     };
    //     return a;
    // };

    // CreateEleFn.btnFormatter = function(value, row, index){
    //
    // };

    CreateEleFn.onLoadSuccessFn = function (obj) {
        var datagridId = obj.datagridId;
        var proarrsObj = obj.proarrsObj;
        var param = obj.param;
        var loadSuccessFn = obj.loadSuccessFn;
        var isBtnHandleArr = param.isBtnHandle;
        if (loadSuccessFn) {
            loadSuccessFn.call(this);
        };
        param.otherNotAdd = param.otherNotAdd == false ? false : true;
        //新增按钮事件
        if (param.isSpecialDg) {
            var fieldName = proarrsObj.specialfield;
            $(document).off().on('click', '.addBtn', function () {
                Tools.addRow({
                    target: this,
                    idLabel: $('#' + datagridId),
                    fieldName: fieldName,
                    isMerges: false
                })
            })
        };

        if (param.otherNotAdd) {
            $(document).on('click', '.addBtn' + param.suffix, function () {
                Tools.addRow({
                    target: this,
                    isShowSum: proarrsObj.is_show_sum,
                    idLabel: $('#' + datagridId),
                    isMerges: param.isMerges
                });
            });
            //删除按钮事件
            $(document).on('click', '.delBtn', function () {
                Tools.deleteRow({
                    target: this,
                    idLabel: $('#' + datagridId),
                    isTotal: param.is_show_sum,
                    isSmallTotal: false,
                    arr: param.needTotalField,
                    he: param.he,
                    smallHe: param.smallHe,
                    isMerges: false
                });
            });
        };
        //为操作按钮循环添加点击事件
        if (isBtnHandleArr && isBtnHandleArr.length) {
            $.each(isBtnHandleArr, function (key, value) {
                $(document).on('click', '.' + value.btnName, function () {
                    value.btnHandle.call();
                });
            });
        };
    };
    // // *枚举值转换
    // // * 列类型0文本框；1下拉框；2多选下拉框；3单选框；4复选框；5辅助录入（下拉树）；6日期选择框；7整数框；8金额框；12大文本框；
    // 、、、、validatebox、、、
    CreateEleFn.ReturnEnumType = function (column_type, datagridSelfParam) {
        var returnType = "",
            curCon = '';
        switch (column_type) {
            case 0: //文本框
                // 创建可输入的input(完成)
                curCon = 'textbox';
                return curCon;
            case 1: //下拉框
                // 创建可输入的input(完成)
                curCon = 'combobox';
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
                curCon = 'checkbox';
                return curCon;
            case 5: //辅助录入（下拉树）
                //创建checkbox并赋值
                curCon = 'combotree';
                return curCon;
            case 6: //日期选择框
                //创建checkbox并赋值
                curCon = 'datebox';
                return curCon;
            case 7: //整数框
                curCon = 'numberbox';
                return curCon;
            case 8: //金额框
                curCon = 'numberbox';
                // datagridSelfParam.needCalArr.push(datagridSelfParam.property_name);
                return curCon;
            case 12: //大文本框
                curCon = 'textarea';
                return curCon;
        };
        return returnType;
    };


    CreateEleFn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

})();

//datagrid- 验证
$.extend($.fn.validatebox.defaults.rules, {
    // isEnglish: {// 验证英文
    //     validator: function (value) {
    //         return /^[A-Za-z]+$/i.test(value);
    //     },
    //     message: '请输入英文字母'
    // },
    isIntNum: {
        validator: function (value) {
            return /^\d+?$/i.test(value);
        },
        message: '请输入整数'
    },
    isMoney: { // 验证金额
        validator: function (value, param) {
            if (param[0] == 1) {
                return value >= 0 && /^\d+(\.\d{1})?$/i.test(value);
            } else if (param[0] == 2) {
                return value >= 0 && /^\d+(\.\d{2})?$/i.test(value);
            } else if (param[0] == 3) {
                return value >= 0 && /^\d+(\.\d{3})?$/i.test(value);
            } else if (param[0] == 4) {
                return value >= 0 && /^\d+(\.\d{4})?$/i.test(value);
            };
        },
        message: '请输入金额，并确保格式正确'
    },
    isIntOrFloat: {
        validator: function (value, param) {
            if (param[0] == 1) {
                return /^\d+(\.\d{1})?$/i.test(value);
            } else if (param[0] == 2) {
                return /^\d+(\.\d{2})?$/i.test(value);
            } else if (param[0] == 3) {
                return /^\d+(\.\d{3})?$/i.test(value);
            } else if (param[0] == 4) {
                return /^\d+(\.\d{4})?$/i.test(value);
            };
        },
        message: '请输入数字，并确保格式正确'
    },
    // isTextIpt:{
    //     validator: function (value) {
    //         return /^[A-Za-z]+$/i.test(value);
    //     },
    //     message: '请输入max_Len以内'
    // },
    isAmongLen: {
        validator: function (value, param) {
            var len = $.trim(value).length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间."
    }
});








// btn_show_type (string, optional):每一行上的列数（录入视图用） ,
// control_id (string, optional):
// datafilterList (Array[DataFilter], optional),
// default_value_str (string, optional): 录入报表视图默认值 ,
// is_checkbox (integer, optional)是否多选（列表视图用） ,
// is_default_select (integer, optional):是否默认选中 ,
// is_required (integer, optional):是否存在必录项 ,
// is_show_stripe (integer, optional):是否显示斑马线 ,
// key (string, optional),
// psUvColumnList (Array[PsUvColumn], optional):
// queryView (PsUvView, optional):列表视图对应查询视图 ,
// query_control_id (string, optional),
// remark (string, optional):
// sql_script (string, optional):脚本 ,
// view_user_name (string, optional):*/
//-------------------------------------------------------------------
//                     frozenColumns:[],//冻结列
//                     striped: (this.viewData.is_show_stripe == 1 ? true:false),//行条纹化默认false
//                     loadMsg:"数据正在努力加载中",
//                     rownumbers:true,//是否显示行号,默认为false
//                     singleSelect:this.viewData.is_checkbox == 1 ? true : false,//是否单选，默认false
//                     //checkOnSelect:[],//选中时，是否勾选复选框，默认为true
//                     //selectOnCheck:[],//复选框勾选时，是否行选中
//                     remoteSort: false,
//                     queryParams:[],//默认查询条件
//                     //showHeader:[],//是否显示表头
//                     //showFooter:[],//是否显示表底
//                     rowStyler:[],//行颜色，函数
//                     url:[],
//                     data:[]
//                 });
//             },
//             //动态创建form左侧标签
//             buildColumns:function(proarrs){
//                   /* default_value_str agency_id=1;exp_func_id=2;
//                     sql_script +AGENCY[1,2,3]+EXP_FUNC[2,3,4]-FUND_TYPE[3,4,5]

//                     default_value (string, optional):默认值 ,
//                     fixed_style (integer, optional):锁定列位置 ,(0不冻结，1左边冻结，2右边冻结)//
//                     is_usersearch (integer, optional):是否使用自定义查询 ,
//                     parent_id (integer, optional):父节点ID ,
//                     column_id : 自身ID
//                     psUvControlEventList (Array[PsUvControlEvent], optional):
//
//                     sql_script (string, optional):查询语句 ,*/
// **** LEVEL_NUM ：如果指定level_num 那么只能选中同级别的要素，如果是0 则可以选择所有级别，如果是9那么只能选择底级






//完成
// is_show_sum (integer, optional),是否显示合计
// is_show_field : 展示合计行的字段
// is_visible (integer, optional):是否显示
// is_page (integer, optional)
//                     data_source (string, optional):引用对象简称 ,
//---------------------------
// $("#toApplyDataLidt").datagrid({
//     columns:buildColumns(this.viewData.psUvColumnList),//列
//     property_name (string, optional):列数据源绑定属性名称 ,
//     column_user_name (string, optional):列用户定义名称 ,
//     column_length (integer, optional):列的宽度 ,
//     fitColumns: this.viewData.fitColumns== 1 ? true : false,//是否表格自适应默认FALSE
//     is_enabled (integer, optional):是否可编辑 ,
//     is_input (integer, optional):是否必录 ,
//     column_type (integer, optional):列类型 ,
// show_type (string, optional):列显示方式 （默认展示code/name）,
//     is_visible (integer, optional):是否可见 ,
//     formula_express : 公式  '( f1 + f2 ) * f3 + f4 + f5'

//     column_level (integer, optional):表格的行的级次 ,
//     pagination:this.viewData.is_page ==1 ? true:false,//底部分页工具条，默认false
//     //pagePosition:[],//分页工具条的位置'top'、'bottom'、'both'。，默认为bottom（未做）
//     //pageNumber:[],//初始化页码（未做）
//     pageSize:20,//初始化数据
//     pageList:[20,50,100,200],//分页的选择列表
//     dec_len (integer, optional):精度 ,
//     max_length (integer, optional):内容最大字数 ,
//     min_length (integer, optional):内容最小字数 ,
// 'row_span':2,'col_span':1,






// var eleData = [{
//     id:"1",CODENAME:'政府性基金',PARENT_ID:0,text:'政府性基金',code:1
// },{
//     id:"2",CODENAME:'专项收入',PARENT_ID:0,text:'专项收入',code:2
// },{
//     id:"3",CODENAME:'行政事业性收费',PARENT_ID:1,text:'行政事业性收费',code:3
// },{
//     id:"4",CODENAME:'财政专户管理的教育收费',PARENT_ID:1,text:'财政专户管理的教育收费',code:4
// },{
//     id:"5",CODENAME:'一般债券资金',PARENT_ID:1,text:'一般债券资金',code:5
// },{
//     id:"6",CODENAME:'其他政府非税收入',PARENT_ID:2,text:'其他政府非税收入',code:6
// }];






// for(var i = 0;i<dataOrigin.length;i++){
//     columnArr[i]= [];
// }
// columnArr[0] = [];
// if(dataOrigin){
//     $.each(dataOrigin,function(key,value){
//         if(value.is_visible){
//             var obj = {
//                 "field": value.property_name,
//                 "title": value.column_user_name,
//                 "halign": 'center',
//                 "align": (value.column_type == 7 || value.column_type == 8) ? 'right' : 'left',
//                 "width": value.column_length,
//                 "rowspan":value.row_span,
//                 "colspan":value.col_span
//             };
//             if(value.is_enabled){
//                 obj.editor = {
//                     'type':CreateEleFn.ReturnEnumType(value.column_type),
//                     'options':{
//                         required:value.is_input == 1 ? true : false
//                     }
//                 };
//             };
//             //列上是否带有公式
//             if(value.formula_express){
//                 obj.calFormula = value.formula_express;
//             };
//             columnArr[0].push(obj);
//         };
//     });
// };