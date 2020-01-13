/*
 * Author：Dom xiang
 * Contact：312922533@qq.com
 * Date：2019-09-15
 */

/*解决IE下不支持Object.assign()的兼容性*/
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        };
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        };
        return target;
    };
};

/*解决IE下NodeList不支持forEach兼容性 */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
};


/*Domx*/
const Domx = {



    /*版本号*/
    version: '1.1.5',

    /*Document构造完成时*/
    ready: function (fn) {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function () {
                document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                fn();
            }, false);
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState == 'complete') {
                    document.detachEvent('onreadystatechange', arguments.callee);
                    fn();
                };
            });
        };
    },


    /*添加遮罩层*/
    mask: function () {
        let mask = document.querySelector('#DomxMask');
        if (mask == null) {
            let mask = document.createElement('div');
            mask.id = 'DomxMask';
            mask.className = 'domx_mask';
            document.body.appendChild(mask);
        };
    },

    /*移除遮罩层*/
    unmask: function () {
        let mask = document.querySelector('#DomxMask');
        if (mask !== null) {
            document.body.removeChild(mask);
        };
    },

    /*载入中*/
    loading: function (icon) {
        let ico = icon || '载入中...';
        let loading = document.querySelector('#DomxLoading');
        if (loading == null) {
            let loading = document.createElement('div');
            loading.id = 'DomxLoading';
            loading.className = 'domx_loading';
            loading.innerHTML = ico;
            document.body.appendChild(loading);
        };
    },

    /*移除加载中*/
    unloading: function () {
        let loading = document.querySelector('#DomxLoading');
        if (loading !== null) {
            document.body.removeChild(loading);
        };
    },

    /*开启可拖动*/
    dragPanel: function (obj) {
        obj.onmouseover = function () {
            this.style.cursor = 'move';
        };
        obj.onmousedown = function (e) {
            let isMove = true;
            obj.style.opacity = 0.5;
            document.onmousemove = function (e) {
                if (isMove) {
                    obj.style.left = e.pageX + 'px';
                    obj.style.top = e.pageY + 'px';
                }
            };
            document.onmouseup = function () {
                isMove = false;
                obj.style.opacity = 1;
            };
        };
    },


    /*对话框 */
    dialog: function (params) {
        let obj = {};
        obj.title = params.title || null;
        obj.message = params.message || null;
        obj.size = params.size || 'medium';
        obj.ismask = params.ismask || false;
        obj.isdrag = params.isdrag || false;
        obj.isscroll = params.isscroll || false;

        let dialog = document.createElement('div');
        // dialog.id = 'DomxDialog';
        dialog.className = 'domx_dialog ' + obj.size;

        /*是否开启遮罩*/
        if (obj.ismask) {
            document.body.style.overflow = 'hidden';
            Domx.mask();
        };

        /*是否可拖动*/
        if (obj.isdrag) {
            Domx.dragPanel(dialog);
        };

        /*标题栏 */
        let dlg_t = document.createElement('div');
        dlg_t.className = 'domx_dlg_t';
        let dlg_t_text = document.createElement('label');
        dlg_t_text.innerHTML = obj.title;
        dlg_t.appendChild(dlg_t_text);

        /*标题栏按钮组*/
        let btns = document.createElement('span');

        /*关闭按钮*/
        let closebtn = document.createElement('em');
        closebtn.innerHTML = '╳';
        closebtn.addEventListener('click', function () {
            if (obj.ismask) {
                /*是否开启遮罩*/
                Domx.unmask();
                document.body.style.overflow = 'auto';
            };
            document.body.removeChild(dialog);
        });

        /*最大化按钮*/
        let maxbtn = document.createElement('em');
        maxbtn.innerHTML = '↗';
        maxbtn.addEventListener('click', function () {
            if (dialog.className == 'domx_dialog max' || dialog.className == 'domx_dialog min') {
                dialog.className = 'domx_dialog ' + obj.size;
                maxbtn.innerHTML = '↗';
            } else {
                dialog.className = 'domx_dialog max';
                maxbtn.innerHTML = '↙';
            };
        });

        /*最小化按钮*/
        let minbtn = document.createElement('em');
        minbtn.innerHTML = '—';
        minbtn.addEventListener('click', function () {
            dialog.className = 'domx_dialog min';
        });

        btns.appendChild(minbtn);
        btns.appendChild(maxbtn);
        btns.appendChild(closebtn);
        dlg_t.appendChild(dlg_t_text);
        dlg_t.appendChild(btns);
        dialog.appendChild(dlg_t);

        /*对话框内容*/
        let dlg_c = document.createElement('div');

        /*是否滚动条 */
        if (obj.isscroll) {
            dlg_c.className = 'domx_dlg_c scroll';
        } else {
            dlg_c.className = 'domx_dlg_c';
        };

        dlg_c.innerHTML = obj.message;
        dialog.appendChild(dlg_c);

        /*输出到页面*/
        document.body.appendChild(dialog);

        /*移除Diglog的方法*/
        obj.close = function () {
            closebtn.click();
        };
        return obj;
    },



    /*选项卡*/
    tabs: function (selector, params) {
        let obj = {};
        obj.selector = selector;
        let labels = document.querySelectorAll(selector + ' .domx_tabs span');
        let blocks = document.querySelectorAll(selector + ' .domx_tab_block');
        obj.tabs = labels;
        obj.blocks = blocks;
        obj.length = labels.length;
        for (let i = 0; i < labels.length; i++) {
            labels[i].addEventListener('click', function () {
                for (let i = 0; i < labels.length; i++) {
                    labels[i].removeAttribute('class');
                };
                this.className = 'active';
                for (let n = 0; n < blocks.length; n++) {
                    blocks[n].style.display = 'none';
                };
                blocks[i].style.display = 'block';
            });
        };
        return obj;
    },



    /*警告框*/
    alert: function (title, message) {
        let alert = document.createElement('div');
        alert.className = 'domx_alert';

        /*标题栏 */
        let alert_t = document.createElement('div');
        alert_t.className = 'domx_alert_t';
        alert_t.innerHTML = title;

        /*关闭按钮*/
        let closebtn = document.createElement('em');
        closebtn.innerHTML = '╳';
        alert_t.appendChild(closebtn);
        closebtn.addEventListener('click', function () {
            document.body.removeChild(alert);
            Domx.unmask();
        });
        alert.appendChild(alert_t);

        let alert_c = document.createElement('div');
        alert_c.className = 'domx_alert_c';
        alert_c.innerHTML = message;
        alert.appendChild(alert_c);

        /*输出到页面*/
        Domx.mask();
        document.body.appendChild(alert);
    },


    /*确认框*/
    confirm: function (title, message, callback) {
        let confirm = document.createElement('div');
        confirm.className = 'domx_confirm';

        /*标题栏 */
        let confirm_t = document.createElement('div');
        confirm_t.className = 'domx_confirm_t';
        confirm_t.innerHTML = title;
        confirm.appendChild(confirm_t);

        let confirm_c = document.createElement('div');
        confirm_c.className = 'domx_confirm_c';
        confirm_c.innerHTML = message;
        confirm.appendChild(confirm_c);

        let confirm_b = document.createElement('div');
        let truebtn = document.createElement('button');
        let falsebtn = document.createElement('button');
        truebtn.type = 'button';
        falsebtn.type = 'reset';
        confirm_b.className = 'domx_confirm_b';
        confirm_b.appendChild(truebtn);
        confirm_b.appendChild(falsebtn);
        truebtn.innerText = '确定';
        falsebtn.innerText = '取消';
        confirm.appendChild(confirm_b);

        /*输出到页面*/
        Domx.mask();
        document.body.appendChild(confirm);

        /*执行回调*/
        let closeConfirm = function () {
            document.body.removeChild(confirm);
            Domx.unmask();
        };
        truebtn.addEventListener('click', function () {
            closeConfirm();
            if (typeof (callback) == 'function') {
                callback(true);
            };
        });
        falsebtn.addEventListener('click', function () {
            closeConfirm();
            if (typeof (callback) == 'function') {
                callback(false);
            };
        });
    },


    /*可提示输入对话框*/
    prompt: function (tips, defaultText, callback) {
        let prompt = document.createElement('div');
        prompt.className = 'domx_prompt';

        /*标题栏 */
        let prompt_t = document.createElement('div');
        prompt_t.className = 'domx_prompt_t';
        prompt_t.innerHTML = tips;
        prompt.appendChild(prompt_t);

        let prompt_c = document.createElement('div');
        let prompt_input = document.createElement('input');
        prompt_c.className = 'domx_prompt_c';
        prompt_input.value = defaultText;
        prompt_c.appendChild(prompt_input);
        prompt.appendChild(prompt_c);

        let prompt_b = document.createElement('div');
        let truebtn = document.createElement('button');
        let falsebtn = document.createElement('button');
        truebtn.type = 'button';
        falsebtn.type = 'reset';
        prompt_b.className = 'domx_prompt_b';
        prompt_b.appendChild(truebtn);
        prompt_b.appendChild(falsebtn);
        truebtn.innerText = '确定';
        falsebtn.innerText = '取消';
        prompt.appendChild(prompt_b);

        /*输出到页面*/
        Domx.mask();
        document.body.appendChild(prompt);
        let closePrompt = function () {
            document.body.removeChild(prompt);
            Domx.unmask();
        };
        truebtn.onclick = function () {
            closePrompt();
            if (typeof (callback) == 'function') {
                callback(prompt_input.value);
            };
        };
        falsebtn.onclick = function () {
            closePrompt();
        };
    },


    /*取得CSS属性*/
    getstyle: function (obj, attribute) {
        if (obj.currentStyle) {
            return obj.currentStyle[attribute];
        } else {
            return window.getComputedStyle(obj, null)[attribute];
        }
    },

    /*消息提示*/
    message: function (info) {
        let len = document.querySelectorAll('.domx_message').length;
        let message = document.createElement('div');
        let msgbox = document.createElement('span');
        let icon = document.createElement('b');
        let text = document.createElement('label');
        message.className = 'domx_message';
        icon.innerHTML = '&iexcl;';
        text.innerText = info;
        msgbox.appendChild(icon);
        msgbox.appendChild(text);
        message.appendChild(msgbox);
        if (document.querySelectorAll('.domx_message').length > 0) {
            message.style.top = (len * 40) + 'px';
        };
        document.body.appendChild(message);
        setTimeout(function () {
            let opacity = 10;
            let top = 10;
            let animate = function () {
                opacity--;
                top--;
                if (opacity <= 0) {
                    cancelAnimationFrame(animate);
                    document.body.removeChild(message);
                } else {
                    let op = opacity / 10;
                    message.style.top = top + 'px';
                    message.style.opacity = op;
                    requestAnimationFrame(animate);
                };
            };
            animate();
        }, 2000);
    },


    /*动画*/
    animate: function (domobj, json, callback, times) {
        let top = Domx.getstyle(domobj, 'top').replace(/px/, '');
        let fn = function () {
            top--;
            left--;
            console.log(top);
            if (top <= json.top) {
                cancelAnimationFrame(fn);
            } else {
                domobj.style['top'] = top + 'px';
                domobj.style['left'] = left + 'px';
                requestAnimationFrame(fn);
            };
        };
        fn();
    },


    /*序列化表单*/
    serialize: function (selector) {
        let form = document.querySelector(selector).elements;
        let array = [];
        for (let i = 0; i <= form.length; i++) {
            if (form[i] !== undefined) {
                let type = form[i].getAttribute('type');
                let keys = form[i].getAttribute('name');
                let val = form[i].value;
                let obj = {};

                switch (type) {
                    case "file":
                    case "submit":
                    case "button":
                    case "image":
                    case "reset":
                        break;

                    case 'checkbox':
                    case 'radio':
                        if (form[i].checked) {
                            obj[keys] = val;
                            array.push(obj);
                        };
                        break;

                    default:
                        obj[keys] = val;
                        array.push(obj);
                        break;
                };

            };
        };

        let obj = {};
        for (n in array) {
            let key = Object.keys(array[n])[0];
            let val = array[n][key];
            if (obj.hasOwnProperty(key)) {
                obj[key] += ',' + val;
            } else {
                obj[key] = val;
            };
        }
        return obj;
    },



    /*是否包含*/
    includes: function (val, target) {
        var n = target.indexOf(val);
        if (n > -1) {
            return true;
        } else {
            return false;
        };
    },


    /*表单赋值*/
    formval: function (selector, data) {
        let form = document.querySelector(selector).elements;
        let getdataval = function (key) {
            for (i in data) {
                return data[key];
            };
        };

        for (let i = 0; i <= form.length; i++) {
            if (form[i] !== undefined) {
                let type = form[i].getAttribute('type');
                let name = form[i].getAttribute('name');
                switch (type) {
                    case "file":
                    case "submit":
                    case "button":
                    case "image":
                    case "reset":
                        break;

                    case 'text':
                    case 'number':
                        form[i].value = getdataval(name);
                        break;

                    case 'radio':
                        if (form[i].value == getdataval(name)) {
                            form[i].setAttribute("checked", "checked");
                        };
                        break;

                    case 'checkbox':
                        let thisval = Number(form[i].value);
                        if (Domx.includes(thisval, getdataval(name))) {
                            form[i].setAttribute("checked", "checked");
                        };
                        break;

                    default:
                        let nodeName = form[i].nodeName;
                        if (nodeName == 'SELECT') {
                            let options = form[i].children;
                            for (let n = 0; n < options.length; n++) {
                                if (options[n].value == getdataval(name)) {
                                    options[n].setAttribute('selected', 'selected');
                                };
                            };
                        } else {
                            form[i].innerHTML = getdataval(name);
                        };
                        break;
                };
            };
        };
    },


    /*是否为email*/
    isEmail: function (val) {
        let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*length 长度*/
    isLen: function (val, len) {
        if (val.length < len) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为中文汉字*/
    isCN: function (val) {
        let reg = /^[\u4E00-\u9FA5]/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为英文*/
    isEN: function (val) {
        let reg = /^[A-Za-z]+$/;;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为数字*/
    isNumber: function (val) {
        let reg = /^[0-9]+$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为手机号*/
    isPhone: function (val) {
        let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为身份证号码*/
    isIDcard: function (val) {
        let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },


    /*获取浏览器版本信息*/
    browserVer: function () {

        // 取得浏览器的userAgent字符串;
        let userAgent = window.navigator.userAgent.toLowerCase();

        // 判断是否IE<11浏览器;
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("msie") > -1;

        // 判断是否Edge浏览器;
        let isEdge = userAgent.indexOf("edge") > -1 && !isIE;

        // 判断是否IE11浏览器;
        let isIE11 = userAgent.indexOf('trident') > -1 && userAgent.indexOf("rv:11.0") > -1;

        if (isIE) {
            let reIE = new RegExp("msie (\\d+\\.\\d+);");
            reIE.test(userAgent);
            let fIEVersion = parseFloat(RegExp["$1"]);
            //IE7;
            if (fIEVersion == 7) {
                return {
                    type: 'Internet Explorer',
                    version: '7'
                };
            }
            //IE8;
            else if (fIEVersion == 8) {
                return {
                    type: 'Internet Explorer',
                    version: '8'
                };
            }
            //IE9;
            else if (fIEVersion == 9) {
                return {
                    type: 'Internet Explorer',
                    version: '9'
                };
            }
            //IE10;
            else if (fIEVersion == 10) {
                return {
                    type: 'Internet Explorer',
                    version: '10'
                };
            }
            //IE7以下;
            else {
                return {
                    type: 'Internet Explorer',
                    version: 'IE版本<=7'
                };
            }
        }
        //edge;
        else if (isEdge) {
            return {
                type: 'Microsoft Edge',
                version: '0'
            };
        }
        //IE11;
        else if (isIE11) {
            return {
                type: 'Internet Explorer',
                version: '11'
            };
        }
        //不是ie浏览器;
        else {

            //firefox;
            if (userAgent.indexOf("firefox") >= 0) {
                let ver = userAgent.match(/firefox\/([\d.]+)/)[1];
                return {
                    type: "Firefox",
                    version: ver
                };
            }
            //Chrome;
            else if (userAgent.indexOf("chrome") >= 0) {
                let ver = userAgent.match(/chrome\/([\d.]+)/)[1];
                return {
                    type: "Chrome",
                    version: ver
                };
            }
            //Opera;
            else if (userAgent.indexOf("opera") >= 0) {
                let ver = userAgent.match(/opera.([\d.]+)/)[1];
                return {
                    type: "Opera",
                    version: ver
                };
            }
            //Safari;
            else if (userAgent.indexOf("Safari") >= 0) {
                let ver = userAgent.match(/version\/([\d.]+)/)[1];
                return {
                    type: "Safari",
                    version: ver
                };
            }
            //other;
            else {
                return {
                    type: "other",
                    version: "其它浏览器"
                };
            };
        }
    },


    /*非IE浏览器导出table为excel*/
    toXLS: function (selector) {
        let table = document.querySelector(selector).innerHTML;
        let uri = 'data:application/vnd.ms-excel;base64,';
        let template =
            '<html>' +
            '<head><meta charset="UTF-8"></head>' +
            '<body><table border="1">{table}</table></body>' +
            '</html>';
        let base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        let format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            });
        };
        let ctx = {
            worksheet: name || 'Worksheet',
            table: table
        };
        window.location.href = uri + base64(format(template, ctx));
    },


    /*IE浏览器导出table为excel*/
    ietoXLS: function (selector) {
        let table = document.querySelector(selector);
        let idTmr;
        let oXL;
        try {
            oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
        } catch (e) {
            alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
            return false;
        };
        let oWB = oXL.Workbooks.Add(); // 获取workbook对象 ;
        let xlsheet = oWB.Worksheets(1); // 激活当前sheet;
        let sel = document.body.createTextRange();
        sel.moveToElementText(table); // 把表格中的内容移到TextRange中;
        sel.select; // 全选TextRange中内容;
        sel.execCommand("Copy"); // 复制TextRange中内容;
        xlsheet.Paste(); // 粘贴到活动的EXCEL中;
        oXL.Visible = true; // 设置excel可见属性;
        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval(window.clearInterval(idTmr), 1);
        };
    },


    /*ajax上传文件*/
    ajaxupload: function (params) {
        let file = params.file || null;
        let url = params.url || null;
        let success = params.success || function (data) { };
        let error = params.error || function (status) { };
        let excelFile = document.querySelector(file);
        let fileObj = excelFile.files[0];
        let formData = new FormData();
        if (fileObj == undefined) {
            Domx.alert('出错了', '请选择文件后重试！');
            return false;
        };
        formData.append('uploadfile', fileObj);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    success(xhr.responseText);
                } else {
                    error(xhr.status);
                }
            }
        };
        xhr.send(formData);
    },


    /**ajax*/
    ajax: function (params) {
        let url = params.url || null;
        let method = params.method || "get";
        let data = params.data || {};
        let async = params.async || true;
        let success = params.success || function (data) { };
        let error = params.error || function (status) { }

        /*判断是否为空对象*/
        let isEmptyObject = function (obj) {
            for (var prop in obj) {
                return false;
            }
            return true;
        };

        /*格式化数据，将数据对象data转为name=value&name2=value2的形式*/
        let formData = function (data) {
            var newData = "";
            for (var prop in data) {
                newData += encodeURIComponent(prop); //对属性和值编码
                newData += "=";
                newData += encodeURIComponent(data[prop]);
                newData += "&";
            }
            return newData.substring(0, newData.length - 1);
        };

        /*URL必须是字符串*/
        if (typeof (url) !== "string") {
            throw new Error("url must be a string");
        };

        /*DATA必须是对像*/
        if (typeof (data) !== "object") {
            throw new Error("data must be a object");
        };

        /*在当前数据不为空的情况下;*/
        if (!isEmptyObject(data)) {

            /*get的方式下，是通过URL传参，data里面的数据解析并格式化后放到URL后面去;*/
            if (method === "get") {

                /*如果URL中没有？，避免URL后面重复添加？*/
                if (url.indexOf("?") === -1) {
                    url += "?";
                }
                /**
                 * 如果URL中的最后一个字符不是“&”，
                 * 避免URL在拼接数据字符串的地方重复添加“&”
                 */
                else if (url.indexOf("&") !== url.length - 1) {
                    url += "&";
                }
                url += formData(data);
                data = null;
            } else {
                data = formData(data);
            };
        };

        /*创建【XHR】对象。IE7+*/
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                /*请求已完成，且响应已就绪*/
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    success(xhr.responseText); //xhr.responseText表示请求到的数据
                } else {
                    error(xhr.status); //xhr.status表示请求失败是对应的HTTP状态码;
                }
            }
        };
        xhr.open(method, url, async); /*参数依次为：请求方式，地址，是否异步*/

        /*设置发送过去的数据格式为表单形式的数据格式，在post方式时用到*/
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    },

    /*返回范围的随机数*/
    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /*返回随机十六进制颜色*/
    getRandomColor: function () {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    },


    /*数组洗牌（乱序）*/
    shuffle: function (array) {
        let m = array.length,
            t, i;
        while (m) {
            i = Math.floor(Math.random() * m--); //随机选取一个;
            t = array[m]; // 与当前元素进行交换;
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    },


    /*平滑滚动到指定位置*/
    scrollTo: function (selector) {
        document.querySelector(selector).scrollIntoView({
            behavior: 'smooth'
        });
    },


    /*转义html*/
    transformHtml: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br/>");
        return s;
    },


    /*日期格式化*/
    dateFormat: function (date, fmt) {
        let d = new Date(date);
        let o = {
            year: d.getFullYear(),
            month: (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            day: d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
            hour: d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
            minute: d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
            second: d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        };
        return fmt.replace(/yyyy/, o.year)
            .replace(/mm/, o.month)
            .replace(/dd/, o.day)
            .replace(/hh/, o.hour)
            .replace(/mm/, o.minute)
            .replace(/ss/, o.second);
    },


    /*获取地址栏参数*/
    urlParam: function (url, name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = url.substr(url.indexOf("\?") + 1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        };
        return null;
    },


    /*是否客户端为移动终端 */
    isMobile: function () {
        var browser = {
            versions: function () {
                var userAgent = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息    
                    trident: userAgent.indexOf('Trident') > -1, //IE内核   
                    presto: userAgent.indexOf('Presto') > -1, //opera内核   
                    webKit: userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核   
                    gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1, //火狐内核   
                    mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端   
                    ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端   
                    android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1, //android终端或者uc浏览器   
                    iPhone: userAgent.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器   
                    iPad: userAgent.indexOf('iPad') > -1, //是否iPad     
                    webApp: userAgent.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部   
                    weixin: userAgent.indexOf('MicroMessenger') > -1, //是否微信    
                    qq: userAgent.match(/\sQQ/i) == " qq" //是否QQ   
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
            return true;
        } else {
            return false;
        };
    },


    /*是否微信浏览器*/
    isWeixin: function () {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        };
    },


    /*防抖函数 */
    debounce: function (fn, delay, immediate) {
        let timer = null;
        return function () {
            let context = this;
            let args = arguments;
            clearTimeout(timer);
            if (immediate) {
                let callNow = !timer;
                timer = setTimeout(function () {
                    timer = null;
                }, delay);
                if (callNow) {
                    fn.apply(context, args);
                };
            } else {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        };
    },


    /*节流函数*/
    throttle: function (fn, delay) {
        let previous = 0;
        return function () {
            let now = Date.now();
            let context = this;
            let args = arguments;
            if (now - previous > delay) {
                fn.apply(context, args);
                previous = now;
            }
        }
    },


    /*选择穿梭*/
    through: function (params) {
        let obj = {};
        obj.selector = params.selector || null;
        obj.data = params.data || null;
        obj.isscroll = params.isscroll || false;
        obj.size = params.size || 'medium';
        obj.itemfield = params.itemfield || null;
        obj.datafields = params.datafields || null;

        /*按钮组*/
        const arrowbtns = document.createElement('div');
        const leftarrow = document.createElement('p');
        const rightarrow = document.createElement('p');
        const exchangearrow = document.createElement('p');
        leftarrow.innerHTML = '&gt;';
        rightarrow.innerHTML = '&lt;';
        exchangearrow.innerHTML = '&harr;';
        arrowbtns.appendChild(leftarrow);
        arrowbtns.appendChild(rightarrow);
        arrowbtns.appendChild(exchangearrow);
        arrowbtns.className = 'arrowbtns ' + obj.size;

        /*创建选项*/
        const createItem = function (ul, item) {
            let li = document.createElement('li');
            for (let i = 0; i < obj.datafields.length; i++) {
                li.setAttribute('data-' + obj.datafields[i], item[obj.datafields[i]]);
            };
            li.innerText = item[obj.itemfield];
            li.addEventListener('click', function () {
                if (this.getAttribute('class') == 'active') {
                    this.removeAttribute('class');
                } else {
                    this.className = 'active';
                };
                let activeitem = obj.selector + ' .' + this.parentNode.parentNode.classList[0] + ' li.active';
                let parentNode = this.parentNode.parentNode.classList[0];
                let list = document.querySelectorAll(activeitem);
                if (list.length > 0) {
                    if (parentNode == 'selected') {
                        rightarrow.className = 'active';
                    } else {
                        leftarrow.className = 'active';
                    };
                } else {
                    leftarrow.removeAttribute('class');
                    rightarrow.removeAttribute('class');
                };
            });
            ul.appendChild(li);
        };

        /*左边选项*/
        const unselect = document.createElement('div');
        const unselectul = document.createElement('ul');
        data[0].forEach(function (item, i) {
            createItem(unselectul, item);
        });
        unselect.className = 'unselect ' + obj.size;
        unselect.appendChild(unselectul);

        /*右边选项*/
        const selected = document.createElement('div');
        const selectedul = document.createElement('ul');
        data[1].forEach(function (item, i) {
            createItem(selectedul, item);
        });
        selected.className = 'selected ' + obj.size;
        selected.appendChild(selectedul);

        /*组合DOM*/
        document.querySelector(obj.selector).appendChild(unselect);
        document.querySelector(obj.selector).appendChild(arrowbtns);
        document.querySelector(obj.selector).appendChild(selected);

        /*移到左边*/
        leftarrow.addEventListener('click', function () {
            let activeitem = obj.selector + ' .' + unselect.classList[0] + ' li.active';
            let Nodeslist = document.querySelectorAll(activeitem);
            if (Nodeslist.length <= 0) {
                return false;
            };
            Nodeslist.forEach(function (item, i) {
                unselect.children[0].removeChild(item);
                selected.children[0].appendChild(item);
                item.removeAttribute('class');
            });
            this.removeAttribute('class');
        });

        /*移到右边*/
        rightarrow.addEventListener('click', function () {
            let activeitem = obj.selector + ' .' + selected.classList[0] + ' li.active';
            let Nodeslist = document.querySelectorAll(activeitem);
            if (Nodeslist.length <= 0) {
                return false;
            };
            Nodeslist.forEach(function (item, i) {
                selected.children[0].removeChild(item);
                unselect.children[0].appendChild(item);
                item.removeAttribute('class');
            });
            this.removeAttribute('class');
        });

        /*互相交换*/
        exchangearrow.addEventListener('click', function () {
            let unselectItem = obj.selector + ' .' + unselect.classList[0] + ' li.active';
            let selectedItem = obj.selector + ' .' + selected.classList[0] + ' li.active';
            let allItem = obj.selector + ' ul li';
            let unNodes = document.querySelectorAll(unselectItem);
            let seNodes = document.querySelectorAll(selectedItem);
            let allNodes = document.querySelectorAll(allItem);
            unNodes.forEach(function (item, i) {
                unselect.children[0].removeChild(item);
                selected.children[0].appendChild(item);
            });
            seNodes.forEach(function (item, i) {
                selected.children[0].removeChild(item);
                unselect.children[0].appendChild(item);
            });
            allNodes.forEach(function (item, i) {
                item.removeAttribute('class');
            });
            leftarrow.removeAttribute('class');
            rightarrow.removeAttribute('class');
        });

        /*取得数据*/
        obj.getItemInfo = function (t) {
            t == 0 ? items = unselect.classList[0] : items = selected.classList[0];
            let selectItem = obj.selector + ' .' + items + ' li';
            let allNodes = document.querySelectorAll(selectItem);
            let array = [];
            let datafields = obj.datafields;
            allNodes.forEach(function (item, i) {
                let itemobj = {};
                for (let n = 0; n < datafields.length; n++) {
                    itemobj[datafields[n]] = item.dataset[datafields[n]];
                };
                array.push(itemobj);
            });
            return array;
        };
        return obj;
    },


    /*计时器*/
    timer: function (params) {
        let obj = {};
        obj.selector = params.selector || null;
        obj.datetime = params.datetime || null;
        obj.callback = params.callback || null;

        /*时间格式转换为时间戳 */
        const datestr = obj.datetime.replace(/-/g, ":").replace(' ', ':');
        const timeArray = datestr.split(':');
        const date = new Date(timeArray[0], (timeArray[1] - 1), timeArray[2], timeArray[3], timeArray[4], timeArray[5]);
        const timestamp = date.getTime() / 1000;

        /*初始化倒计时DOM*/
        const day = document.createElement('span');
        day.innerHTML = '<em>0</em>天';
        const hour = document.createElement('span');
        hour.innerHTML = '<em>0</em>小时';
        const minute = document.createElement('span');
        minute.innerHTML = '<em>0</em>分';
        const second = document.createElement('span');
        second.innerHTML = '<em>0</em>秒';

        document.querySelector(obj.selector).appendChild(day);
        document.querySelector(obj.selector).appendChild(hour);
        document.querySelector(obj.selector).appendChild(minute);
        document.querySelector(obj.selector).appendChild(second);

        /*开始执行倒计时，并刷新显示信息*/
        obj.startTimer = setInterval(function () {
            let nowtimestamp = Math.round(new Date().getTime() / 1000);
            if (timestamp <= nowtimestamp) {
                obj.stopTimer();
                second.innerHTML = '<em>0</em>秒';
            } else {
                let t = Math.floor(timestamp - nowtimestamp);
                let d = Math.floor(t / (60 * 60 * 24));
                day.innerHTML = '<em>' + d + '</em>天';
                t -= d * (60 * 60 * 24);

                let h = Math.floor(t / (60 * 60));
                hour.innerHTML = '<em>' + h + '</em>小时';
                t -= h * (60 * 60);

                let m = Math.floor(t / (60));
                minute.innerHTML = '<em>' + m + '</em>分';
                t -= m * 60;

                second.innerHTML = '<em>' + t-- + '</em>秒';
            }
        }, 1000);

        /*结束倒计时，并执行回调*/
        obj.stopTimer = function () {
            clearInterval(obj.startTimer);
            obj.callback();
        };
        return obj;
    },


    /*气泡*/
    bubble: function (selector, messagetext, params) {
        let obj = {};
        let position, color, background;
        if (params !== undefined) {
            position = params.position;
            color = params.color;
            background = params.background;
        } else {
            position = null;
            color = null;
            background = null;
        };
        obj.message = messagetext;
        obj.position = position;
        obj.color = color;
        obj.background = background;
        let bubble = document.createElement('div');
        let message = document.createElement('label');
        let triangle = document.createElement('div');
        let triangleclassName, bubbleStyle;
        if (obj.background !== null) {
            message.style.background = obj.background;
        };
        if (obj.color !== null) {
            message.style.color = obj.color;
        };
        message.innerText = obj.message;
        bubble.className = 'domx_bubble';
        bubble.appendChild(message);
        switch (obj.position) {
            case 'top':
                triangleclassName = 'triangle down';
                bubbleStyle = 'margin-top:' + '-' + (selector.clientHeight + 40) + 'px';
                if (obj.background !== null) {
                    triangle.style.borderTopColor = obj.background;
                }
                break;

            case 'bottom':
                triangleclassName = 'triangle up';
                bubbleStyle = 'margin-top:' + selector.clientHeight / 2 + 'px';
                if (obj.background !== null) {
                    triangle.style.borderBottomColor = obj.background;
                }
                break;

            case 'right':
                triangleclassName = 'triangle left';
                bubbleStyle =
                    'margin-left:' + selector.clientWidth + 'px;' +
                    'margin-top:-' + (selector.clientHeight / 2 + 10) + 'px';
                if (obj.background !== null) {
                    triangle.style.borderRightColor = obj.background;
                }
                break;

            case 'left':
                triangleclassName = 'triangle right';
                bubbleStyle =
                    'margin-left:-' + (selector.clientWidth) + 'px;' +
                    'margin-top:-' + (selector.clientHeight / 2 + 10) + 'px';
                if (obj.background !== null) {
                    triangle.style.borderLeftColor = obj.background;
                }
                break;

            default:
                triangleclassName = 'triangle down';
                bubbleStyle = 'margin-top:' + '-' + (selector.clientHeight + 40) + 'px';
                if (obj.background !== null) {
                    triangle.style.borderTopColor = obj.background;
                }
                break;
        };
        triangle.className = triangleclassName;
        bubble.appendChild(triangle);
        selector.appendChild(bubble);
        bubble.style = bubbleStyle;
        setTimeout(function () {
            let opacity = 10;
            let animate = function () {
                opacity--;
                top--;
                if (opacity <= 0) {
                    cancelAnimationFrame(animate);
                    selector.removeChild(bubble);
                } else {
                    let op = opacity / 10;
                    bubble.style.opacity = op;
                    requestAnimationFrame(animate);
                };
            };
            animate();
        }, 2000);
        return obj;
    },



    /*倒计时验证码*/
    isTimer: function (obj, times) {
        let timer = null;
        let typename = obj.nodeName;
        timer = setInterval(function () {
            times--;
            if (times <= 0) {
                if (typename == 'INPUT') {
                    obj.value = '发送验证码';
                } else if (typename == 'BUTTON') {
                    obj.innerText = '发送验证码';
                } else {
                    Domx.alert('出错了', '请在input或者button上使用');
                };
                clearInterval(timer);
                obj.disabled = false;
                times = times;
            } else {
                if (typename == 'INPUT') {
                    obj.value = times + '秒后重试';
                } else if (typename == 'BUTTON') {
                    obj.innerText = times + '秒后重试';
                } else {
                    Domx.alert('出错了', '请在input或者button上使用');
                };
                obj.disabled = true;
            };
        }, 1000);
    },

    /*星级评分*/
    score: function (params) {
        let obj = {};
        obj.selector = params.selector || null;
        obj.value = params.value || 0;
        obj.max = params.max || 5;
        obj.icon = params.icon || '&#9733'
        document.querySelector(obj.selector).className = 'domx_score';
        obj.val = function () {
            return obj.value;
        };
        let allstar = document.querySelectorAll(obj.selector)[0].children;
        for (let i = 0; i < obj.max; i++) {
            let star = document.createElement('span');
            star.innerHTML = obj.icon;
            if (i < obj.value) {
                star.className = 'active';
            };
            star.addEventListener('click', function () {
                for (let n = 0; n < allstar.length; n++) {
                    if (n <= i) {
                        allstar[n].className = 'active';
                    } else {
                        allstar[n].removeAttribute('class');
                    };
                };
                obj.value = i + 1;
            });
            document.querySelector(obj.selector).appendChild(star);
        };
        return obj;
    },
};