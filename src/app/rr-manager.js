/******/ var __webpack_modules__ = ({

/***/ "./src/src/appWindow.js":
/*!******************************!*\
  !*** ./src/src/appWindow.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_updateWizardHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/updateWizardHelper */ "./src/src/utils/updateWizardHelper.js");
/* harmony import */ var _utils_synoApiProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/synoApiProvider */ "./src/src/utils/synoApiProvider.js");


// Namespace definition
Ext.ns('SYNOCOMMUNITY.RRManager');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (// Window definition
Ext.define('SYNOCOMMUNITY.RRManager.AppWindow', {
        helper: SYNOCOMMUNITY.RRManager.Helper,
        apiProvider: SYNOCOMMUNITY.RRManager.SynoApiProvider,
        formatString: function (str, ...args) {
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        },
        extend: "SYNO.SDS.PageListAppWindow",
        activePage: "SYNOCOMMUNITY.RRManager.Overview.Main",
        defaultWinSize: { width: 1160, height: 620 },
        constructor: function (config) {
            const t = this;
            this.apiProvider.init(this.sendWebAPI.bind(this));
            t.callParent([t.fillConfig(config)]);
        },
        fillConfig: function (e) {
            //get app setting from src\app\config
            const jsConfig =e.appInstance.initialConfig?.taskButton?.jsConfig;
            //check if the console tab is enabled
            const showConsoleTab = jsConfig?.enableTTYDTab;
            let tabs = this.getListTabs(showConsoleTab);
            const i = {
                cls: "syno-app-iscsi",
                width: this.defaultWinSize.width,
                height: this.defaultWinSize.height,
                minWidth: this.defaultWinSize.width,
                minHeight: this.defaultWinSize.height,
                activePage: "SYNOCOMMUNITY.RRManager.Overview.Main",
                listItems: tabs,
            };
            return Ext.apply(i, e), i;
        },
        getListTabs: function (showConsoleTab) {
            let items = [
                {
                    text: this.helper.V('ui', 'tab_general'),
                    iconCls: "icon-rr-overview",
                    fn: "SYNOCOMMUNITY.RRManager.Overview.Main",
                },
                {
                    text: this.helper.V('ui', 'tab_addons'),
                    iconCls: "icon-rr-addons",
                    fn: "SYNOCOMMUNITY.RRManager.Addons.Main",
                },
                {
                    text: this.helper.V('ui', 'tab_debug'),
                    iconCls: "icon-debug",
                    fn: "SYNOCOMMUNITY.RRManager.Debug.Main",
                },
                {
                    text: this.helper.V('ui', 'tab_configuration'),
                    iconCls: "icon-rr-setting",
                    fn: "SYNOCOMMUNITY.RRManager.Setting.Main",
                }
            ];
            if (showConsoleTab) {
                items.push({
                    text: 'Console',
                    iconCls: "icon-terminal-and-SNMP",
                    fn: "SYNOCOMMUNITY.RRManager.Ssh.Main",
                });
            }
            return items;
        },
        onOpen: function (a) {
            const t = this;
            t.mon(t.getPageList().getSelectionModel(), "selectionchange", t.onSelectionModelChange, t);
            SYNOCOMMUNITY.RRManager.AppWindow.superclass.onOpen.call(this, a);
        },
        onDestroy: function (e) {
            //this.apiProvider.runScheduledTask('UnMountLoaderDisk');
            SYNOCOMMUNITY.RRManager.AppWindow.superclass.onDestroy.call(this);
        },
        onSelectionModelChange: function () {
            const e = this
                , t = e.getActivePage();
            t && ("SYNOCOMMUNITY.RRManager.Overview.Main" === t.itemId ? e.getPageCt().addClass("iscsi-overview-panel") : e.getPageCt().removeClass("iscsi-overview-panel"));
        },
    }));

/***/ }),

/***/ "./src/src/components/advancedSearchField.js":
/*!***************************************************!*\
  !*** ./src/src/components/advancedSearchField.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.AdvancedSearchField", {
        extend: "SYNO.ux.SearchField",
        initEvents: function () {
            this.callParent(arguments),
                this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this),
                this.mon(this, "keypress", (function (e, t) {
                    t.getKey() === Ext.EventObject.ENTER && (this.searchPanel?.setKeyWord(this.getValue()),
                        this.searchPanel?.onSearch())
                }
                ), this),
                this.mon(this, "destroy", (function () {
                    this.searchPanel?.destroy()
                }
                ), this)
        },
        isInnerComponent: function (event, form) {
            let isInside = false;
            if (event.getTarget(".syno-datetimepicker-inner-menu")) {
                isInside = true;
            }
            form.items.each((item) => {
                if (item instanceof Ext.form.ComboBox) {
                    if (item.view && event.within(item.view.getEl())) {
                        isInside = true;
                        return false;
                    }
                } else if (item instanceof Ext.form.DateField) {
                    if (item.menu && event.within(item.menu.getEl())) {
                        isInside = true;
                        return false;
                    }
                } else if (item instanceof Ext.form.CompositeField && this.isComponentInside(event, item)) {
                    isInside = true;
                    return false;
                }
            }, this);
            return isInside;

        },
        onMouseDown: function (e) {
            const t = this.searchPanel;
            !t || !t.isVisible() || t.inEl || e.within(t.getEl()) || e.within(this.searchtrigger) || this.isInnerComponent(e, this.searchPanel.getForm()) || t.hide()
        },
        onSearchTriggerClick: function () {
            this.searchPanel.isVisible() ? this.searchPanel.hide() : (this.searchPanel.getEl().alignTo(this.wrap, "tr-br?", [6, 0]),
                this.searchPanel.show(),
                this.searchPanel.setKeyWord(this.getValue()))
        },
        onTriggerClick: function () {
            this.callParent(),
                this.searchPanel.onReset()
        }
    }));


/***/ }),

/***/ "./src/src/components/dialogs/passwordConfirmDialog.js":
/*!*************************************************************!*\
  !*** ./src/src/components/dialogs/passwordConfirmDialog.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.PasswordConfirmDialog", {
        extend: "SYNO.SDS.ModalWindow",
        constructor: function (a) {
            this.confirmPasswordHandler = a.confirmPasswordHandler;
            this.callParent([this.fillConfig(a)]);
        },
        fillConfig: function (a) {
            var b = {
                id: "confirm_password_dialog",
                width: 500,
                height: 200,
                resizable: false,
                layout: "fit",
                buttons: [
                    {
                        xtype: "syno_button",
                        text: _T("common", "alt_cancel"),
                        scope: this,
                        handler: function () {
                            Ext.getCmp("confirm_password_dialog").close();
                        },
                    },
                    {
                        xtype: "syno_button",
                        text: _T("common", "submit"),
                        btnStyle: "blue",
                        scope: this,
                        handler: this.onClickSubmit.bind(this),
                    },
                ],
                items: [
                    {
                        xtype: "syno_formpanel",
                        id: "password_form_panel",
                        bodyStyle: "padding: 0",
                        items: [
                            {
                                xtype: "syno_displayfield",
                                value: String.format(_T("common", "enter_user_password")),
                            },
                            {
                                xtype: "syno_textfield",
                                fieldLabel: _T("common", "password"),
                                textType: "password",
                                id: "confirm_password",
                            },
                        ],
                    },
                ]
            };
            Ext.apply(b, a);
            return b;
        },
        onClickSubmit: function () {
            const passwordValue = Ext.getCmp("confirm_password").getValue();
            Ext.getCmp("confirm_password_dialog").close();
            this.confirmPasswordHandler(passwordValue);
        }
    }));

/***/ }),

/***/ "./src/src/components/dialogs/updateAvailableDialog.js":
/*!*************************************************************!*\
  !*** ./src/src/components/dialogs/updateAvailableDialog.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.UpdateAvailableDialog", {
        extend: "SYNO.SDS.ModalWindow",
        helper: SYNOCOMMUNITY.RRManager.Helper,
        constructor: function (a) {
            this.callParent([this.fillConfig(a)]);
        },
        fillConfig: function (a) {
            this.panel = this.createPanel(a);
            this.btnBar = this.createBtnBar(a);
            var c = (a.initHeight || 250) + 200 * (a.msgItemCount || 0);
            var b = {
                cls: "vmm-modal-window",
                width: a.width || 650,
                height: Math.min(c, 650),
                border: false,
                resizable: false,
                layout: "fit",
                items: this.panel,
                fbar: this.btnBar,
            };
            Ext.apply(b, a);
            return b;
        },
        createBtnBar: function (a) {
            if (a.confirmCheck) {
                return {
                    xtype: "toolbar",
                    buttonAlign: "right",
                    cls: "normal-toolbar",
                    items: [
                        {
                            xtype: "syno_button",
                            btnStyle: "grey",
                            text: this.helper.T("common", "cancel"),
                            scope: this,
                            handler: this.close,
                        },
                        {
                            xtype: "syno_button",
                            btnStyle: "red",
                            text: this.helper.T("common", "ok"),
                            scope: this,
                            width: 134,
                            handler: this.onOKClick,
                        },
                    ],
                };
            } else {
                return {
                    xtype: "toolbar",
                    buttonAlign: "center",
                    cls: "center-toolbar",
                    items: [
                        {
                            xtype: "syno_button",
                            btnStyle: "blue",
                            text: this.helper.T("common", "ok"),
                            scope: this,
                            width: 134,
                            handler: this.onOKClick,
                        },
                    ],
                };
            }
        },
        createPanel: function (a) {
            return new SYNO.ux.Panel({
                width: a.width ? a.width : 650,
                items: [
                    {
                        xtype: "label",
                        autoHeight: true,
                        id: (this.msgId = Ext.id()),
                        indent: 1,
                        style: "line-height: 25px;",
                        html: a.message,
                    },
                    {
                        // Display the changelog in a scrollable view
                        xtype: 'box',
                        autoEl: { tag: 'div', html: a.msg.replace(/\n/g, '<br>') },
                        style: 'margin: 10px; overflow-y: auto; border: 1px solid #ccc; padding: 5px;',
                        height: '75%', // Fixed height for the scrollable area
                        anchor: '100%'
                    },{
                        xtype: "syno_checkbox",
                        id: "confirmCheck",
                        boxLabel: this.helper.V("update_available_dialog", "checkbox_dont_show_again"),
                        checked: false,
                        hidden: !a.confirmCheck,
                        indent: 1,
                        style: "line-height: 25px;"
                    }      
                ],
            });
        },
        onOKClick: function () {
            if (this.btnOKHandler) {
                this.btnOKHandler();
            }
            this.close();
        },
    }));

/***/ }),

/***/ "./src/src/components/dialogs/uploadFileDialog.js":
/*!********************************************************!*\
  !*** ./src/src/components/dialogs/uploadFileDialog.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.UploadFileDialog", {
        extend: "SYNO.SDS.ModalWindow",
        constructor: function (a) {
            this.helper = a.helper;
            this.updateHelper = a.updateHelper;
            this.owner = a.owner;
            this.parent = a.parent;
            this.apiProvider = a.apiProvider;
            this.callParent([this.fillConfig(a)]);
        },
        fillConfig: function (a) {
            var b = {
                width: 500,
                height: 400,
                resizable: false,
                layout: "fit",
                items: this.createUploadPannel(),
                buttons: [
                    {
                        xtype: "syno_button",
                        text: this.helper.T("common", "alt_cancel"),
                        scope: this,
                        handler: function () {
                            Ext.getCmp("upload_file_dialog")?.close();
                        },
                    },
                    {
                        xtype: "syno_button",
                        text: this.helper.T("common", "submit"),
                        btnStyle: "blue",
                        scope: this,
                        handler: this.onClickSubmit.bind(this),
                    },
                ],
                showMsg: this.showMsg.bind(this),
                sendArray: this.sendArray.bind(this),
                showProgressIndicator: this.showProgressIndicator.bind(this),
                hideProgressIndicator: this.hideProgressIndicator.bind(this),
                owner: this.owner,
                apiProvider: this.apiProvider,
                parent: this.parent,
            };
            Ext.apply(b, a);
            return b;
        },
        onClickSubmit: function () {
            const form = this.uploadForm.getForm();
            var fileObject = form.el.dom[1].files[0];
            if (!form.isValid()) {
                this.showMsg(this.helper.V('upload_file_dialog', 'upload_update_file_form_validation_invalid_msg'));
                return;
            }
            this.showProgressIndicator();
            this.onUploadFile(fileObject);
            Ext.getCmp("upload_file_dialog")?.close();
        },
        showProgressIndicator: function () {
            this.owner.setStatusBusy();
        },
        hideProgressIndicator: function () {
            if (this.owner) {
                this.owner.clearStatusBusy();
            }
            else if (this.parent.appWin) {
                this.parent.appWin.clearStatusBusy();
            }
            else {
                this.helper.unmask(this.parent);
                this.parent.owner.appWin.clearStatusBusy();
            }
        },
        showMsg: function (msg) {
            let parent = this.owner ?? this.parent?.appWin;
            parent.getMsgBox().alert("", msg);
        },
        createUploadPannel: function () {
            this.uploadForm = new Ext.form.FormPanel({
                title: this.helper.V("upload_file_dialog", "lb_select_update_file"),
                fileUpload: true,
                name: 'upload_form',
                border: !1,
                bodyPadding: 10,
                items: [{
                    xtype: 'syno_filebutton',
                    text: this.helper.V('upload_file_dialog', 'select_file'),
                    name: 'filename',
                    allowBlank: false,
                }],
            });
            return this.uploadForm;
        },
        opts: {
            chunkmode: false,
            filefiledname: "file",
            file: function (file) {
                var createFileObject = function (file, params, id, dtItem) {
                    var modifiedParams = SYNO.SDS.copy(params || {});
                    var lastModifiedTime = SYNO.webfm.utils.getLastModifiedTime(file);

                    if (lastModifiedTime) {
                        modifiedParams = Ext.apply(modifiedParams, {
                            mtime: lastModifiedTime
                        });
                    }

                    return {
                        id: id,
                        file: file,
                        dtItem: dtItem,
                        name: file.name || file.fileName,
                        size: file.size || file.fileSize,
                        progress: 0,
                        status: "NOT_STARTED",
                        params: modifiedParams,
                        chunkmode: false
                    };
                }

                var lastModifiedTime = SYNO.webfm.utils.getLastModifiedTime(file);
                var fileObject = new createFileObject(file, { mtime: lastModifiedTime });
                return fileObject;
            },
            params: {
                path: '',
                overwrite: true
            }
        },
        onUploadFile: function (file) {
            let rrConfigJson = localStorage.getItem('rrConfig');
            let rrConfig = JSON.parse(rrConfigJson);
            let rrManagerConfig = rrConfig.rr_manager_config;
            this.opts.params.path = `/${rrManagerConfig.SHARE_NAME}/${rrManagerConfig.RR_TMP_DIR}`;
            let isChunkMode = false;
            if (-1 !== this.MAX_POST_FILESIZE && file.size > this.MAX_POST_FILESIZE && isChunkMode)
                this.onError({
                    errno: {
                        section: "error",
                        key: "upload_too_large"
                    }
                }, file);
            else {
                let formData = this.prepareStartFormdata(file);
                if (file.chunkmode) {
                    let chunkSize = this.opts.chunksize;
                    let totalChunks = Math.ceil(file.size / chunkSize);
                    this.onUploadPartailFile(formData, file, {
                        start: 0,
                        index: 0,
                        total: totalChunks
                    })
                } else
                    this.sendArray(formData, file)
            }
        },
        prepareStartFormdata: function (file) {
            const isChunkMode = (-1 !== this.MAX_POST_FILESIZE && file.size > this.MAX_POST_FILESIZE);
            if (isChunkMode) {
                const boundary = `----html5upload-${new Date().getTime()}${Math.floor(65535 * Math.random())}`;
                let contentPrefix = "";

                if (this.opts.params) {
                    for (const paramName in this.opts.params) {
                        if (this.opts.params.hasOwnProperty(paramName)) {
                            contentPrefix += `--${boundary}\r\n`;
                            contentPrefix += `Content-Disposition: form-data; name="${paramName}"\r\n\r\n`;
                            contentPrefix += `${unescape(encodeURIComponent(this.opts.params[paramName]))}\r\n`;
                        }
                    }
                }

                if (file.params) {
                    for (const paramName in file.params) {
                        if (file.params.hasOwnProperty(paramName)) {
                            contentPrefix += `--${boundary}\r\n`;
                            contentPrefix += `Content-Disposition: form-data; name="${paramName}"\r\n\r\n`;
                            contentPrefix += `${unescape(encodeURIComponent(file.params[paramName]))}\r\n`;
                        }
                    }
                }

                const filename = unescape(encodeURIComponent(file.name));
                contentPrefix += `--${boundary}\r\n`;
                contentPrefix += `Content-Disposition: form-data; name="${this.opts.filefiledname || "file"}"; filename="${filename}"\r\n`;
                contentPrefix += 'Content-Type: application/octet-stream\r\n\r\n';

                return {
                    formData: contentPrefix,
                    boundary: boundary
                };
            } else {
                const formData = new FormData();

                if (this.opts.params) {
                    for (const paramName in this.opts.params) {
                        if (this.opts.params.hasOwnProperty(paramName)) {
                            formData.append(paramName, this.opts.params[paramName]);
                        }
                    }
                }

                if (file.params) {
                    for (const paramName in file.params) {
                        if (file.params.hasOwnProperty(paramName)) {
                            formData.append(paramName, file.params[paramName]);
                        }
                    }
                }

                return formData;
            }
        },
        onUploadPartailFile: function (e, t, i, o) {
            i.start = i.index * this.opts.chunksize;
            var chunkSize = Math.min(this.opts.chunksize, t.size - i.start);

            if ("PROCESSING" === t.status) {
                var fileSlice;

                if (window.File && File.prototype.slice) {
                    fileSlice = t.file.slice(i.start, i.start + chunkSize);
                } else if (window.File && File.prototype.webkitSlice) {
                    fileSlice = t.file.webkitSlice(i.start, i.start + chunkSize);
                } else if (window.File && File.prototype.mozSlice) {
                    fileSlice = t.file.mozSlice(i.start, i.start + chunkSize);
                } else {
                    this.onError({}, t);
                    return;
                }

                this.sendArray(e, t, fileSlice, i, o);
            }
        },
        _baseUrl: 'webapi/entry.cgi?',
        sendArray: function (formData, fileDetails, fileData, chunkDetails, tempFile) {
            var self = this;
            var headers = {}, requestParams = {};
            var uploadData;

            if (fileDetails.status !== "CANCEL") {
                if (fileDetails.chunkmode) {
                    headers = {
                        "Content-Type": "multipart/form-data; boundary=" + formData.boundary
                    };
                    requestParams = {
                        "X-TYPE-NAME": "SLICEUPLOAD",
                        "X-FILE-SIZE": fileDetails.size,
                        "X-FILE-CHUNK-END": chunkDetails.total <= 1 || chunkDetails.index === chunkDetails.total - 1 ? "true" : "false"
                    };
                    if (tempFile) {
                        Ext.apply(requestParams, {
                            "X-TMP-FILE": tempFile
                        });
                    }
                    if (window.XMLHttpRequest.prototype.sendAsBinary) {
                        uploadData = formData.formdata + (fileData !== "" ? fileData : "") + "\r\n--" + formData.boundary + "--\r\n";
                    } else if (window.Blob) {
                        var data = new Uint8Array(formData.formdata.length + fileData.length + "\r\n--" + formData.boundary + "--\r\n".length);
                        data.set(new TextEncoder().encode(formData.formdata + fileData + "\r\n--" + formData.boundary + "--\r\n"));
                        uploadData = data;
                    }
                } else {
                    formData.append("size", fileDetails.size);
                    fileDetails.name
                        ? formData.append(this.opts.filefiledname, fileDetails, fileDetails.name)
                        : formData.append(this.opts.filefiledname, fileDetails.file);

                    uploadData = formData;
                }
                this.conn = new Ext.data.Connection({
                    method: 'POST',
                    url: `${this._baseUrl}api=SYNO.FileStation.Upload&method=upload&version=2&SynoToken=${localStorage['SynoToken']}`,
                    defaultHeaders: headers,
                    timeout: null
                });
                self.uploadedFilePath = `${this.opts.params.path}/${fileDetails.name}`;
                var request = this.conn.request({
                    headers: requestParams,
                    html5upload: true,
                    chunkmode: fileDetails.chunkmode,
                    uploadData: uploadData,
                    success: (response) => {
                        self.hideProgressIndicator();
                        self.updateHelper.updateFileInfoHandler({
                            path: self.uploadedFilePath
                        });
                    },
                    failure: (response) => {
                        self.helper.unmask(self.parent);
                        self.hideProgressIndicator();
                        self.showMsg(`${self.helper.V('upload_file_dialog', 'file_uploading_failed_msg')}, Error: ${response.responseText}`);
                        console.error(self.helper.V('upload_file_dialog', 'file_uploading_failed_msg'), response);
                    },
                    progress: (progressEvent) => {
                        const percentage = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2);
                        let loader = document.getElementsByClassName("x-loading-message-inner");
                        if (loader?.length > 0) {
                            loader = loader[0];
                            loader.textContent = `${self.helper.T("common", "loading")}. ${self.helper.V("upload_file_dialog", "completed")} ${percentage}%.`;
                        }
                    },
                });
            }
        },
    }));

/***/ }),

/***/ "./src/src/components/iframePanel.js":
/*!*******************************************!*\
  !*** ./src/src/components/iframePanel.js ***!
  \*******************************************/
/***/ (function() {

Ext.define("SYNOCOMMUNITY.RRManager.IframePanel", {
    extend: "SYNO.ux.Panel",    
    constructor: function (config) {
        this.callParent([this.fillConfig(config)]);
    },
    
    fillConfig: function (config) {
        const me = this;
        const cfg = {
            items: [
                {
                    itemId: "iframeBox",
                    xtype: "box",
                    cls: "iframe-panel",
                    height: '600',
                    html: '<iframe src="' + (config.iframeSrc || '') + '" style="width:100%; height:100%; border:none;"></iframe>',
                }
            ],
            listeners: {
                scope: me,
                afterrender: me.onAfterRender,
                update: me.updateIframe,
                src_change: me.onSrcChange
            }
        };
        return Ext.apply(cfg, config);
    },
    
    onAfterRender: function () {
        // Example: Add a click event listener if needed
        this.mon(this.body, "click", this.onMouseClick, this);
    },
    
    updateIframe: function () {
        const iframeBox = this.getComponent("iframeBox");
        iframeBox.update('<iframe src="' + this.iframeSrc + '" style="width:100%; height:100%; border:none;"></iframe>');
    },
    
    setSrc: function (src) {
        this.iframeSrc = src;
        this.fireEvent('src_change');
    },
    
    onSrcChange: function () {
        this.updateIframe();
    },
    
    onMouseClick: function () {
        // Example: Fire an event when the iframe panel is clicked
        this.fireEvent("iframeclick", this);
    }
});


/***/ }),

/***/ "./src/src/components/statusBox.js":
/*!*****************************************!*\
  !*** ./src/src/components/statusBox.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.StatusBox", {
        extend: "SYNO.ux.Panel",
        constructor: function (e) {
            this.callParent([this.fillConfig(e)]);
        },
        fillConfig: function (e) {
            (this.appWin = e.appWin),
                (this.data = e.data),
                (this.tpl = new SYNOCOMMUNITY.RRManager.Overview.StatusBoxTmpl({
                    type: e.type,
                    title: e.title,
                    data: this.data,
                }));
            const t = {
                items: [
                    {
                        itemId: "statusBox",
                        xtype: "box",
                        cls: "iscsi-overview-statusbox-block",
                        html: "",
                    },
                ],
                data: this.data,
                listeners: {
                    scope: this,
                    afterrender: this.onAfterRender,
                    update: this.updateTpl,
                    data_ready: this.onDataReady,
                },
            };
            return Ext.apply(t, e), t;
        },
        onAfterRender: function () {
            this.mon(this.body, "click", this.onMouseClick, this);
        },
        updateTpl: function () {
            this.tpl.overwrite(
                this.getComponent("statusBox").getEl(),
                Ext.apply(
                    {
                        type: this.type,
                        clickType:
                            this.owner.clickedBox === this.type ? "click" : "unclick",
                        errorlevel: this.errorlevel,
                        total: this?.data?.icon,
                        error: 0,
                        warning: 0,
                    },
                    this.tpl.data
                )
            );
        },
        onMouseClick: function () {
            this.owner.fireEvent("selectchange", this.type);
        },
        processRRSummary: function () {
            const luns = [1, 2];
            Ext.each(luns, function (lun) {
                let status = "healthy";
                this.data[status]++;
            }, this);
        },
        //HW info
        processHWSummary: function () {
            const luns = [1, 2];
            Ext.each(luns, function (lun) {
                let status = "healthy";
                this.data[status]++;
            }, this);
        },
        processRRMSummary: function () {
            const luns = [1, 2];
            Ext.each(luns, function (lun) {
                let status = "healthy";
                this.data[status]++;
            }, this);
        },
        onDataReady: function () {
            this.data = { error: 0, warning: 0, healthy: 0 };
            Ext.apply(this.data, this.tpl.data);
            switch (this.storeKey) {
                case "hwinfo_summ":
                    this.processHWSummary();
                    break;
                case "rrinfo_summ":
                    this.processRRSummary();
                    break;
                case "rrminfo_summ":
                    this.processRRMSummary();
            }
            this.data.errorlevel = "healthy";
            this.updateTpl();
        },
    }));

/***/ }),

/***/ "./src/src/components/statusBoxTmpl.js":
/*!*********************************************!*\
  !*** ./src/src/components/statusBoxTmpl.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.StatusBoxTmpl", {
        extend: "Ext.XTemplate",
        helper: SYNOCOMMUNITY.RRManager.Helper,
        formatString: function (str, ...args) {
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        },
        constructor: function (e) {
            let t = "";
            switch (e.type) {
                case 'hw_info':
                    t = this.createTplHwInfo();
                    break;
                case 'rr_info':
                    t = this.createTplRrInfo();
                    break;
                case 'rrm_info':
                    t = this.createTplRrmInfo();
                    break;
            }
            t.push(this.fillConfig(e)),
                this.callParent(t);
        },

        getTranslate: (key) => {
            const translations = {
                'hw_info': 'HW info',
                'rr_info': 'RR version',
                'rrm_info': 'RR Manager version',
            };
            return translations[key];
        },
        getStatusText: (type, status) => {
            const statusTexts = {
                'hw_info': 'RR version',
                'rr_info': 'RR Manager version',
                'rrm_info': 'RR Actions'
            };
            return statusTexts[type];
        },
        isBothErrorWarn: (error, warning) => error !== 0 && warning !== 0,
        showNumber: (number) => {
            return number;
        },

        fillConfig: function (e) {
            const templateConfig = { compiled: true, disableFormats: true },
                translations = {};

            return (
                {
                    // getTranslate: (key) => translations[key],
                    // getStatusText: (type, status) => {
                    //     const statusTexts = {
                    //         'fctarget': translations.status.fctarget[status],
                    //         'target': translations.status.target[status],
                    //         'lun': translations.status.lun[status],
                    //         'event': translations.status.event[status]
                    //     };
                    //     return statusTexts[type];
                    // },
                    // isBothErrorWarn: (error, warning) => error !== 0 && warning !== 0,
                    // showNumber: (number) => number // > 99 ? '99+' : number
                },
                Ext.apply(templateConfig, e)
            );
        },
        createTplHwInfo: function () {
            return [
                '<div class="iscsi-overview-statusbox iscsi-overview-statusbox-{type} iscsi-overview-statusbox-{errorlevel} iscsi-overview-statusbox-{clickType}">',
                '<div class="statusbox-titlebar"></div>',
                '<div class="statusbox-box">',
                '<div class="statusbox-title">',
                "<h3>{[ values.title ]} </h3>",
                "</div>",
                '<div class="statusbox-title-right">',
                "<h3>{[ this.showNumber(values.total) ]}</h3>",
                "</div>",
                '<div class="x-clear"></div>',
                '<div class="statusbox-title-padding">',
                "</div>",
                '<tpl if="! this.isBothErrorWarn(error, warning)">',
                '<div class="statusbox-block statusbox-block-{errorlevel}">',
                '</div>',
                '<div class="statusbox-text" ext:qtip="{[ values.text ]}">{[ values.text ]}</div>',
                '<div class="statusbox-text" ext:qtip="{[ values.text2 ]}">{[ values.text2 ]}</div>',
                '<div class="statusbox-text" ext:qtip="{[ values.text3 ]}">{[ values.text3 ]}</div>',
                "</div>",
                "</tpl>",
                "</div>",
                "</div>",
            ];
        },
        createTplRrInfo: function () {
            return [
                '<div class="iscsi-overview-statusbox iscsi-overview-statusbox-{type} iscsi-overview-statusbox-{errorlevel} iscsi-overview-statusbox-{clickType}">',
                '<div class="statusbox-titlebar"></div>',
                '<div class="statusbox-box">',
                '<div class="statusbox-title">',
                "<h3>{[ values.title ]} </h3>",
                "</div>",
                '<div class="statusbox-title-right">',
                "<h3>{[ this.showNumber(values.total) ]}</h3>",

                "</div>",
                '<div class="x-clear"></div>',
                '<div class="statusbox-title-padding">',
                "</div>",
                '<tpl if="! this.isBothErrorWarn(error, warning)">',
                '<div class="statusbox-block statusbox-block-{errorlevel}">',
                '<div class="statusbox-number">{[ values.rrVersion ]}',
                '</div>',
                '<div class="statusbox-text" ext:qtip="{[ values.rrVersion ]}">{[ values.rrVersion ]}</div>',
                "</div>",
                "</tpl>",
                "</div>",
                "</div>",
            ];
        },
        createTplRrmInfo: function () {
            return [
                '<div class="iscsi-overview-statusbox iscsi-overview-statusbox-{type} iscsi-overview-statusbox-{errorlevel} iscsi-overview-statusbox-{clickType}">',
                '<div class="statusbox-titlebar"></div>',
                '<div class="statusbox-box">',
                '<div class="statusbox-title">',
                "<h3>{[ values.title ]} </h3>",
                "</div>",
                '<div class="statusbox-title-right">',
                "<h3>{[ this.showNumber(values.total) ]}</h3>",
                "</div>",
                '<div class="x-clear"></div>',
                '<div class="statusbox-title-padding">',
                "</div>",
                '<tpl if="! this.isBothErrorWarn(error, warning)">',
                '<div class="statusbox-block statusbox-block-{errorlevel}">',
                '<div class="statusbox-number">{[ values.rrManagerVersion ]}',
                '</div>',
                '<div class="statusbox-text" ext:qtip="{[ values.rrManagerVersion ]}">{[ values.rrManagerVersion ]}</div>',
                "</div>",
                "</tpl>",
                "</div>",
                "</div>",
            ];
        },
    }));

/***/ }),

/***/ "./src/src/panels/debug/generalTab.js":
/*!********************************************!*\
  !*** ./src/src/panels/debug/generalTab.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Debug.GeneralTab", {
        extend: "SYNO.SDS.Utils.FormPanel",
        constructor: function (e) {
            this.getConf = e.owner.getConf.bind(e.owner);
            this.callParent([this.fillConfig(e)])
        },
        fillConfig: function (e) {
            this.suspendLcwPrompt = !1;
            const t = {
                title: "General",
                name: 'debugGeneral',
                id: 'debugGeneral',
                items: [new SYNO.ux.FieldSet({
                    title: 'CMD Line',
                    collapsible: true,
                    collapsed: false,
                    name: 'cmdLine',
                    id: 'cmdLine',
                    columns: 2,
                    items: [],
                }), new SYNO.ux.FieldSet({
                    title: 'Ethernet Interfaces',
                    collapsible: true,
                    name: 'ethernetInterfaces',
                    id: 'ethernetInterfaces',
                    columns: 2,
                    items: [],
                }), new SYNO.ux.FieldSet({
                    title: 'Syno Mac Addresses',
                    collapsible: true,
                    name: 'macAdresses',
                    id: 'macAdresses',
                    columns: 2,
                    items: [],
                })
                ]
            };
            return Ext.apply(t, e),
                t
        },
        initEvents: function () {
            this.mon(this, "activate", this.onActivate, this)
        },
        onActivate: function () {
            self = this;
            if (self.loaded) return;
            this.getConf().then((e) => {
                var config = e.result;
                var cmdLineFieldSet = Ext.getCmp('cmdLine');
                Object.keys(config.bootParameters).forEach((key) => {
                    cmdLineFieldSet.add(
                        {
                            fieldLabel: key,
                            name: key,
                            xtype: 'syno_displayfield',
                            value: config.bootParameters[key]
                        });
                });
                cmdLineFieldSet.doLayout();

                var ethernetInterfacesFieldSet = Ext.getCmp('ethernetInterfaces');
                config.ethernetInterfaces.forEach((eth) => {
                    ethernetInterfacesFieldSet.add(
                        {
                            fieldLabel: eth.interface,
                            name: eth.interface,
                            xtype: 'syno_displayfield',
                            value: `MAC: ${eth.address}, Status: ${eth.operstate}, Speed: ${eth.speed}, Duplex: ${eth.duplex}`
                        });
                });
                ethernetInterfacesFieldSet.doLayout();

                var macAdressesFieldSet = Ext.getCmp('macAdresses');
                config.syno_mac_addresses.forEach((mac_address, index) => {
                    macAdressesFieldSet.add(
                        {
                            fieldLabel: `Mac ${index}`,
                            columns: 2,
                            xtype: 'syno_displayfield',
                            value: mac_address
                        });
                });

                var debugGeneral = Ext.getCmp('debugGeneral');
                debugGeneral.doLayout();
                self.loaded = true;
            });
        },
        loadForm: function (e) {
            // this.getForm().setValues(e);
        }
    }));

/***/ }),

/***/ "./src/src/panels/healthPanel.js":
/*!***************************************!*\
  !*** ./src/src/panels/healthPanel.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_synoApiProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/synoApiProvider */ "./src/src/utils/synoApiProvider.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.HealthPanel", {
        extend: "SYNO.ux.Panel",
        apiProvider: SYNOCOMMUNITY.RRManager.SynoApiProvider,
        constructor: function (e) {
            this.appWin = e.appWin;
            this.owner = e.owner;
            this.helper = e.owner.helper;
            this.apiProvider.init(this);
            this.callParent([this.fillConfig(e)]);
        },
        onDataReady: function () {
            let status = "normal";
            this.iconTemplate.overwrite(this.getComponent("icon").getEl(), { status: status, 
                style:"background-image:url('webapi/entry.cgi?api=SYNO.Core.Synohdpack&version=1&method=getHDIcon&res=72&retina=false&path=webman/3rdparty/rr-manager/images/rr-manager-{0}.png&app_version=0.1'); background-size: cover;"
            }),
                this.titleTemplate.overwrite(this.upperPanel.getComponent("title").getEl(), {
                    status: status,
                }),
                this.updateDescription("current");
            // this.getComponent("rrActionsPanel")?.setVisible(true);
            this.owner.fireEvent("data_ready");
        },


        fillConfig: function (e) {
            this.poolLinkId = Ext.id();
            this.iconTemplate = this.createIconTpl();
            this.titleTemplate = this.createTitleTpl();
            this.upperPanel = this.createUpperPanel();
            this.lowerPanel = this.createLowerPanel();

            this.descriptionMapping = {
                normal: this.helper.V('ui', 'greetings_text'),
                target_abnormal: []
            };

            const panelConfig = {
                layout: "hbox",
                cls: "iscsi-overview-health-panel",
                autoHeight: true,
                items: [
                    { xtype: "box", itemId: "icon", cls: "health-icon-block" },
                    {
                        xtype: "syno_panel",
                        itemId: "rightPanel",
                        cls: "health-text-block",
                        flex: 1,
                        height: 90,
                        layout: "vbox",
                        layoutConfig: { align: "stretch" },
                        items: [this.upperPanel, this.lowerPanel],
                    }
                ],
                listeners: { scope: this, data_ready: this.onDataReady },
            };
            return Ext.apply(panelConfig, e), panelConfig;
        },
        createIconTpl: function () {
            return new Ext.XTemplate('<div class="health-icon {status}" style="{style}"></div>', {
                compiled: !0,
                disableFormats: !0,
            });
        },
        createTitleTpl: function () {
            return new Ext.XTemplate(
                '<div class="health-text-title {status}">{[this.getStatusText(values.status)]}</div>',
                {
                    compiled: !0,
                    disableFormats: !0,
                    statusText: {
                        normal: "Healthy",
                        warning: "Warning",
                        error: "Error"
                    },
                    getStatusText: function (e) {
                        return this.statusText[e];
                    },
                }
            );
        },
        createUpperPanel: function () {
            return new SYNO.ux.Panel({
                layout: "hbox",
                items: [
                    {
                        xtype: "box",
                        itemId: "title",
                        flex: 1,
                        cls: "iscsi-overview-health-title-block",
                    },
                    {
                        xtype: "syno_button",
                        itemId: "leftBtn",
                        hidden: !0,
                        cls: "iscsi-overview-health-prev-btn",
                        scope: this,
                        handler: this.onLeftBtnClick,
                        text: " ",
                    },
                    {
                        xtype: "syno_button",
                        itemId: "rightBtn",
                        hidden: !0,
                        cls: "iscsi-overview-health-next-btn",
                        scope: this,
                        handler: this.onRightBtnClick,
                        text: " ",
                    },
                ],
            });
        },   
        createLowerPanel: function () {
            return new SYNO.ux.Panel({
                flex: 1,
                items: [
                    {
                        xtype: "syno_displayfield",
                        itemId: "desc",
                        cls: "health-text-content",
                        htmlEncode: !1,
                    },
                ],
            });
        },
        updateDescription: function (status) {
            const self = this;
            this.descriptions = [];
            let description,
                statusDescription,
                index = -1;
            const
                descriptionCount = this.descriptions.length,
                rightPanel = this.getComponent("rightPanel"),
                descriptionField = this.lowerPanel.getComponent("desc"),
                rrVersionField = this.lowerPanel.getComponent("desc2"),
                leftButton = this.upperPanel.getComponent("leftBtn"),
                rightButton = this.upperPanel.getComponent("rightBtn");
                initialHeight = descriptionField.getHeight();
            let panelHeight = rightPanel.getHeight(),
                isHeightChanged = false;
            statusDescription = this.descriptionMapping.normal;
            descriptionField.setValue(self.owner.systemInfoTxt);

            const updatedHeight = descriptionField.getHeight();
            if (
                (updatedHeight !== initialHeight && ((panelHeight = panelHeight - initialHeight + updatedHeight), (isHeightChanged = true)),
                    isHeightChanged && ((rightPanel.height = panelHeight), this.doLayout(), this.owner.doLayout()),
                    this.descriptions.length <= 1)
            )
                return leftButton.hide(), void rightButton.hide();
            (leftButton.hidden || rightButton.hidden) && (leftButton.show(), rightButton.show(), this.doLayout());
        },
        prepareSummaryStatus: function (status, data) {
            // Function body goes here
        },
    }));

/***/ }),

/***/ "./src/src/panels/settings/generalTab.js":
/*!***********************************************!*\
  !*** ./src/src/panels/settings/generalTab.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Setting.GeneralTab", {
        extend: "SYNO.SDS.Utils.FormPanel",
        constructor: function (e) {
            this.callParent([this.fillConfig(e)])
        },
        fillConfig: function (e) {
            this.suspendLcwPrompt = !1;
            const t = {
                title: "General",
                items: [{
                    xtype: "syno_fieldset",
                    title: "Device Info",
                    itemId: "lcw",
                    name: "lcw",
                    id: "lcw",
                    items: [
                        {
                            fieldLabel: 'model',
                            name: 'model',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'productver',
                            name: 'productver',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'buildnum',
                            name: 'buildnum',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'sn',
                            name: 'sn',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        },
                    ]
                },
                new SYNO.ux.FieldSet({
                    title: 'Network Info',
                    collapsible: true,
                    columns: 2,
                    items: [
                        {
                            fieldLabel: 'mac1',
                            name: 'mac1',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'mac2',
                            name: 'mac2',
                            allowBlank: true,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'mac3',
                            name: 'mac3',
                            allowBlank: true,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'mac4',
                            name: 'mac4',
                            allowBlank: true,
                            xtype: 'syno_textfield',
                        }
                    ],
                }),
                new SYNO.ux.FieldSet({
                    title: 'Boot Config',
                    collapsible: true,
                    items: [{
                        fieldLabel: 'vid',
                        name: 'vid',
                        allowBlank: false,
                        xtype: 'syno_textfield',
                    }, {
                        fieldLabel: 'pid',
                        name: 'pid',
                        allowBlank: false,
                        xtype: 'syno_textfield',
                    }, {
                        boxLabel: 'emmcboot',
                        name: 'emmcboot',
                        xtype: 'syno_checkbox',

                    },
                    ]
                })
                ]
            };
            return Ext.apply(t, e),
                t
        },
        initEvents: function () {
            this.mon(this, "activate", this.onActivate, this)
        },
        onActivate: function () {
        },
        loadForm: function (e) {
            this.getForm().setValues(e);
        },
        promptLcwDialog: function (e, t) {
            t && !this.suspendLcwPrompt && this.appWin.getMsgBox().show({
                title: this.title,
                msg: "ddd",
                buttons: {
                    yes: {
                        text: Ext.MessageBox.buttonText.yes,
                        btnStyle: "red"
                    },
                    no: {
                        text: Ext.MessageBox.buttonText.no
                    }
                },
                fn: function (e) {
                    "yes" !== e && this.form.findField("lcw_enabled").setValue(!1)
                },
                scope: this,
                icon: Ext.MessageBox.ERRORRED,
                minWidth: Ext.MessageBox.minWidth
            })
        }
    }));


/***/ }),

/***/ "./src/src/panels/settings/rrConfigTab.js":
/*!************************************************!*\
  !*** ./src/src/panels/settings/rrConfigTab.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Setting.RRConfigTab", {
        extend: "SYNO.SDS.Utils.FormPanel",
        constructor: function (e) {
            this.callParent([this.fillConfig(e)])
        },
        fillConfig: function (e) {
            this.suspendLcwPrompt = !1;
            const t = {
                title: "RR Config",
                items: [
                    new SYNO.ux.FieldSet({
                        title: 'RR Config',
                        collapsible: true,
                        items: [{
                            fieldLabel: 'lkm',
                            name: 'lkm',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'kernel',
                            name: 'kernel',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            boxLabel: 'dsmlogo',
                            name: 'dsmlogo',
                            xtype: 'syno_checkbox',

                        }, {
                            boxLabel: 'directboot',
                            name: 'directboot',
                            xtype: 'syno_checkbox',
                        }, {
                            boxLabel: 'prerelease',
                            name: 'prerelease',
                            xtype: 'syno_checkbox',
                        }, {
                            fieldLabel: 'bootwait',
                            name: 'bootwait',
                            xtype: 'syno_numberfield',
                        }, {
                            fieldLabel: 'bootipwait',
                            name: 'bootipwait',
                            xtype: 'syno_numberfield',
                        }, {
                            fieldLabel: 'kernelway',
                            name: 'kernelway',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'kernelpanic',
                            name: 'kernelpanic',
                            allowBlank: false,
                            xtype: 'syno_numberfield',
                        }, {
                            boxLabel: 'odp',
                            name: 'odp',
                            xtype: 'syno_checkbox',
                        }, {
                            boxLabel: 'hddsort',
                            name: 'hddsort',
                            xtype: 'syno_checkbox',
                        }, {
                            fieldLabel: 'smallnum',
                            name: 'smallnum',
                            allowBlank: false,
                            xtype: 'syno_numberfield',
                        }, {
                            fieldLabel: 'paturl',
                            name: 'paturl',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'patsum',
                            name: 'patsum',
                            allowBlank: false,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'layout',
                            name: 'layout',
                            allowBlank: true,
                            xtype: 'syno_textfield',
                        }, {
                            fieldLabel: 'keymap',
                            name: 'keymap',
                            allowBlank: true,
                            xtype: 'syno_textfield',
                        }
                        ]
                    })
                ]
            };
            return Ext.apply(t, e),
                t
        },
        initEvents: function () {
            this.mon(this, "activate", this.onActivate, this)
        },
        onActivate: function () {
        },
        loadForm: function (e) {
            this.getForm().setValues(e);
        },
        promptLcwDialog: function (e, t) {
            t && !this.suspendLcwPrompt && this.appWin.getMsgBox().show({
                title: this.title,
                msg: "ddd",
                buttons: {
                    yes: {
                        text: Ext.MessageBox.buttonText.yes,
                        btnStyle: "red"
                    },
                    no: {
                        text: Ext.MessageBox.buttonText.no
                    }
                },
                fn: function (e) {
                    "yes" !== e && this.form.findField("lcw_enabled").setValue(!1)
                },
                scope: this,
                icon: Ext.MessageBox.ERRORRED,
                minWidth: Ext.MessageBox.minWidth
            })
        }
    }));

/***/ }),

/***/ "./src/src/panels/settings/rrManagerConfigTab.js":
/*!*******************************************************!*\
  !*** ./src/src/panels/settings/rrManagerConfigTab.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Setting.RrManagerConfigTab", {
        extend: "SYNO.SDS.Utils.FormPanel",
        constructor: function (e) {
            this.callParent([this.fillConfig(e)])
        },
        fillConfig: function (e) {
            this.suspendLcwPrompt = !1;
            const t = {
                //TODO: implement localization
                title: "RR Manager Settings",
                items: [
                    new SYNO.ux.FieldSet({
                        title: 'RR Manager',
                        collapsible: true,
                        name: 'rrManager',
                        //TODO: implement localization
                        items: [
                            {
                                boxLabel: 'Check for updates on App Startup',
                                name: 'checkRRForUpdates',
                                xtype: 'syno_checkbox',
                            },
                            {
                                boxLabel: 'Enable TTYD package integration',
                                name: 'enableTTYDTab',
                                xtype: 'syno_checkbox',
                            }
                        ]
                    })
                ]
            };
            return Ext.apply(t, e),
                t
        },
        initEvents: function () {
            this.mon(this, "activate", this.onActivate, this)
        },
        onActivate: function () {
        },
        loadForm: function (e) {
            this.getForm().setValues(e);
        },
        promptLcwDialog: function (e, t) {
            t && !this.suspendLcwPrompt && this.appWin.getMsgBox().show({
                title: this.title,
                msg: "ddd",
                buttons: {
                    yes: {
                        text: Ext.MessageBox.buttonText.yes,
                        btnStyle: "red"
                    },
                    no: {
                        text: Ext.MessageBox.buttonText.no
                    }
                },
                fn: function (e) {
                    "yes" !== e && this.form.findField("lcw_enabled").setValue(!1)
                },
                scope: this,
                icon: Ext.MessageBox.ERRORRED,
                minWidth: Ext.MessageBox.minWidth
            })
        }
    }));

/***/ }),

/***/ "./src/src/panels/settings/synoInfoTab.js":
/*!************************************************!*\
  !*** ./src/src/panels/settings/synoInfoTab.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Setting.SynoInfoTab", {
        extend: "SYNO.SDS.Utils.FormPanel",
        constructor: function (e) {
            this.callParent([this.fillConfig(e)])
        },
        fillConfig: function (e) {
            this.suspendLcwPrompt = !1;
            const t = {
                title: "Syno Info",
                items: [
                    new SYNO.ux.FieldSet({
                        title: 'SynoInfo Config',
                        collapsible: true,
                        name: 'synoinfo',
                        items: [
                            {
                                boxLabel: 'Support Disk compatibility',
                                name: 'support_disk_compatibility',
                                xtype: 'syno_checkbox',

                            }, {
                                boxLabel: 'Support Memory compatibility',
                                name: 'support_memory_compatibility',
                                xtype: 'syno_checkbox',

                            }, {
                                boxLabel: 'Support Led brightness adjustment',
                                name: 'support_led_brightness_adjustment',
                                xtype: 'syno_checkbox',

                            }, {
                                boxLabel: 'Support leds lp3943',
                                name: 'support_leds_lp3943',
                                xtype: 'syno_checkbox',

                            }, {
                                boxLabel: 'Support syno hybrid RAID',
                                name: 'support_syno_hybrid_raid',
                                xtype: 'syno_checkbox',

                            }, {
                                boxLabel: 'Support RAID group',
                                name: 'supportraidgroup',
                                xtype: 'syno_checkbox',

                            }, {
                                fieldLabel: 'Max LAN port',
                                name: 'maxlanport',
                                allowBlank: false,
                                xtype: 'syno_numberfield',
                            }, {
                                fieldLabel: 'Netif seq',
                                name: 'netif_seq',
                                allowBlank: false,
                                xtype: 'syno_textfield',
                            }, {
                                fieldLabel: 'Buzzer offen',
                                name: 'buzzeroffen',
                                allowBlank: true,
                                xtype: 'syno_textfield',
                            }
                        ]
                    })
                ]
            };
            return Ext.apply(t, e),
                t
        },
        initEvents: function () {
            this.mon(this, "activate", this.onActivate, this)
        },
        onActivate: function () {
        },
        loadForm: function (e) {
            this.getForm().setValues(e);
        },
        promptLcwDialog: function (e, t) {
            t && !this.suspendLcwPrompt && this.appWin.getMsgBox().show({
                title: this.title,
                msg: "ddd",
                buttons: {
                    yes: {
                        text: Ext.MessageBox.buttonText.yes,
                        btnStyle: "red"
                    },
                    no: {
                        text: Ext.MessageBox.buttonText.no
                    }
                },
                fn: function (e) {
                    "yes" !== e && this.form.findField("lcw_enabled").setValue(!1)
                },
                scope: this,
                icon: Ext.MessageBox.ERRORRED,
                minWidth: Ext.MessageBox.minWidth
            })
        }
    }));

/***/ }),

/***/ "./src/src/panels/statusBoxsPanel.js":
/*!*******************************************!*\
  !*** ./src/src/panels/statusBoxsPanel.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.StatusBoxsPanel", {
        extend: "SYNO.ux.Panel",
        apiProvider: SYNOCOMMUNITY.RRManager.SynoApiProvider,
        constructor: function (e) {
            this.appWin = e.appWin;
            this.owner = e.owner;
            this.helper = e.owner.helper;
            this.data = {};
            this.apiProvider.init(this);
            this.callParent([this.fillConfig(e)]);
        },
        onDataReady: function (data) {
            this.loadData(data);
            Ext.each(this.statusBoxes, (e) => {
                e.fireEvent("data_ready");
            });

            this.owner.fireEvent("data_ready");
        },
        fillConfig: function (e) {
            const statusBoxConfig = { owner: this, appWin: e.appWin, flex: 1 };
            this.selectedBox = "hw_info";
            this.statusBoxes = [
                new SYNOCOMMUNITY.RRManager.Overview.StatusBox(
                    Ext.apply({
                        type: "hw_info", title: "HW Info", storeKey: "hwinfo_summ",
                        data: {
                            title: "HW Info",
                            icon: "🖥️",
                            text: this?.data?.systemInfoTxt ?? "--",
                            text2: this?.data?.systemInfoTxt ?? "--",
                            text3: this?.data?.systemInfoTxt ?? "--",
                            error: 0,
                            warning: 0,
                            healthy: 2,
                            type: "healthy"
                        }
                    }, statusBoxConfig)),
                new SYNO.ux.Panel({ width: 10 }),

                new SYNOCOMMUNITY.RRManager.Overview.StatusBox(
                    Ext.apply({
                        type: "rr_info", title: "RR version", storeKey: "rrinfo_summ",
                        data: {
                            title: "RR version",
                            icon: "💊",
                            text: "This is some long text RR",
                            version: this?.data?.rrVersion ?? "--",
                            error: 0,
                            warning: 0,
                            type: "healthy"
                        }
                    }, statusBoxConfig),
                ),
                new SYNO.ux.Panel({ width: 10 }),

                new SYNOCOMMUNITY.RRManager.Overview.StatusBox(
                    Ext.apply(
                        {
                            type: "rrm_info", title: "RR Manager", storeKey: "rrminfo_summ",
                            data: {
                                title: "RR Manager",
                                icon: "🛡️",
                                text: "This is some long text RR Manager",
                                version: this?.data?.rrManagerVersion ?? "--",
                                error: 0,
                                warning: 0,
                                type: "healthy"
                            }
                        }, statusBoxConfig)
                ),
            ];
            const panelConfig = {
                hidden: true,
                cls: "iscsi-overview-status-panel",
                layout: "hbox",
                layoutConfig: { align: "stretch" },
                items: this.statusBoxes,
                listeners: {
                    scope: this,
                    selectchange: this.onSelectChange,
                    data_ready: this.onDataReady,
                },
            };
            return Ext.apply(panelConfig, e), panelConfig;
        },
        onSelectChange: function (e) {
            console.log("--onSelectChange StatusBoxsPanel")
            // (this.clickedBox = e),
            //     Ext.each(this.statusBoxs, (e) => {
            //         e.fireEvent("update");
            //     }),
            //     this.owner.panels.detailPanel.fireEvent("select", e);
        },
        loadData: function (data) {
            const self = this;
            self.show();
            self.statusBoxes.forEach((statusBox) => {
                if (statusBox.tpl && statusBox.tpl.data) {
                    Ext.apply(statusBox.tpl.data, data);
                    statusBox.updateTpl();
                }
            });
        }
    }));

/***/ }),

/***/ "./src/src/tabs/addons.js":
/*!********************************!*\
  !*** ./src/src/tabs/addons.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Addons.Main", {
        extend: "SYNO.ux.GridPanel",
        helper: SYNOCOMMUNITY.RRManager.Helper,
        itemsPerPage: 1e3,
        constructor: function (e) {
            this.appWin = e.appWin;
            const self = this;
            Ext.apply(self, e);
            let config = self.fillConfig(e);
            self.itemsPerPage = self.appWin.appInstance.getUserSettings(self.itemId + "-dsPageLimit") || self.itemsPerPage;
            self.callParent([config]);
            self.mon(
                self,
                "resize",
                (e, width, height) => {
                    self.updateFbarItems(width);
                },
                self
            );
        },
        getPageRecordStore: function () {
            return new Ext.data.SimpleStore({
                fields: ["value", "display"],
                data: [
                    [100, 100],
                    [500, 500],
                    [1e3, 1e3],
                    [3e3, 3e3],
                ],
            });
        },
        getCategoryStore: function () {
            return new Ext.data.SimpleStore({
                fields: ["value", "display"],
                data: [
                    ["", this.helper.V('ui', 'addons_all')],
                    ["system", this.helper.V('ui', 'addons_system')],
                ],
            });
        },
        onChangeDisplayRecord: function (e, t, i) {
            const self = this,
                addonsStore = self.addonsStore;
            const newItemsPerPage = e.getValue();
            if (self.itemsPerPage !== newItemsPerPage) {
                self.itemsPerPage = newItemsPerPage;
                self.paging.pageSize = self.itemsPerPage;
                addonsStore.load({ params: { offset: 0, limit: self.itemsPerPage } });
                self.appWin.appInstance.setUserSettings(
                    self.itemId + "-dsPageLimit",
                    self.itemsPerPage
                );
            }
        },
        onChangeCategory: function (e, t, i) {
            const s = this,
                n = s.addonsStore,
                a = e.getValue();
            a !== n.baseParams.category &&
                (Ext.apply(n.baseParams, { category: a }), s.loadData());
        },
        initPageComboBox: function (e) {
            return new SYNO.ux.ComboBox({
                name: "page_rec",
                hiddenName: "page_rec",
                hiddenId: Ext.id(),
                store: e,
                displayField: "display",
                valueField: "value",
                triggerAction: "all",
                value: this.itemsPerPage,
                editable: !1,
                width: 72,
                mode: "local",
                listeners: { select: { fn: this.onChangeDisplayRecord, scope: this } },
            });
        },
        initCategoryComboBox: function (e) {
            return new SYNO.ux.ComboBox({
                name: "category",
                store: e,
                displayField: "display",
                valueField: "value",
                value: "",
                width: 120,
                mode: "local",
                listeners: { select: { fn: this.onChangeCategory, scope: this } },
            });
        },
        initPagingToolbar: function () {
            return new SYNO.ux.PagingToolbar({
                store: this.addonsStore,
                displayInfo: !0,
                pageSize: this.itemsPerPage,
                showRefreshBtn: !0,
                cls: "iscsi-log-toolbar",
                items: [
                    {
                        xtype: "tbtext",
                        style: "padding-right: 4px",
                        text: "Items per page",
                    },
                    this.initPageComboBox(this.getPageRecordStore()),
                ],
            });
        },
        initSearchForm: function () {
            // return new SYNO.SDS.iSCSI.SearchFormPanel({
            //     cls: "iscsi-search-panel",
            //     renderTo: Ext.getBody(),
            //     shadow: !1,
            //     hidden: !0,
            //     owner: this,
            // });
        },
        initToolbar: function () {
            const e = this,
                t = new SYNO.ux.Toolbar();
            return (
                // (e.clearButton = new SYNO.ux.Button({
                //     xtype: "syno_button",
                //     text: "Clear",
                //     handler: e.onLogClear,
                //     scope: e,
                // })),
                (e.saveButton = new SYNO.ux.Button({
                    xtype: "syno_button",
                    text: e.helper.V("ui", "save_addons_btn"),
                    handler: e.onAddonsSave,
                    btnStyle: "blue",
                    scope: e,
                })),
                (e.searchField = new SYNOCOMMUNITY.RRManager.AdvancedSearchField({
                    iconStyle: "filter",
                    owner: e,
                })),
                (e.searchField.searchPanel = e.searchPanel),
                // t.add(e.clearButton),
                t.add(e.saveButton),
                t.add("->"),
                t.add(e.initCategoryComboBox(e.getCategoryStore())),
                t.add({ xtype: "tbspacer", width: 4 }),
                t.add(e.searchField),
                t
            );
            // return [];
        },
        initEvents: function () {
            // this.mon(this.searchPanel, "search", this.onSearch, this),
            this.mon(this, "activate", this.onActive, this);
        },
        _getLng: function (lng) {
            const localeMapping = {
                'dan': 'da_DK', // Danish in Denmark
                'ger': 'de_DE', // German in Germany
                'enu': 'en_US', // English (United States)
                'spn': 'es_ES', // Spanish (Spain)
                'fre': 'fr_FR', // French in France
                'ita': 'it_IT', // Italian in Italy
                'hun': 'hu_HU', // Hungarian in Hungary
                'nld': 'nl_NL', // Dutch in The Netherlands
                'nor': 'no_NO', // Norwegian in Norway
                'plk': 'pl_PL', // Polish in Poland
                'ptg': 'pt_PT', // European Portuguese
                'ptb': 'pt_BR', // Brazilian Portuguese
                'sve': 'sv_SE', // Swedish in Sweden
                'trk': 'tr_TR', // Turkish in Turkey
                'csy': 'cs_CZ', // Czech in Czech Republic
                'gre': 'el_GR', // Greek in Greece
                'rus': 'uk-UA',
                'heb': 'he_IL', // Hebrew in Israel
                'ara': 'ar_SA', // Arabic in Saudi Arabia
                'tha': 'th_TH', // Thai in Thailand
                'jpn': 'ja_JP', // Japanese in Japan
                'chs': 'zh_CN', // Simplified Chinese in China
                'cht': 'zh_TW', // Traditional Chinese in Taiwan
                'krn': 'ko_KR', // Korean in Korea
                'vi': 'vi-VN', // Vietnam in Vietnam 
            };
            return Object.keys(localeMapping).indexOf(lng) > -1
                ? localeMapping[lng] : localeMapping['enu'];
        },
        getStore: function () {
            var gridStore = new SYNO.API.JsonStore({
                autoDestroy: true,
                appWindow: this.appWin,
                restful: true,
                root: "result",
                url: `/webman/3rdparty/rr-manager/scripts/getAddons.cgi`,
                idProperty: "name",
                fields: [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'version',
                    type: 'string'
                }, {
                    name: 'description',
                    type: 'object'
                }, {
                    name: 'system',
                    type: 'boolean'
                }, {
                    name: 'installed',
                    type: 'boolean'
                }],
                listeners: {
                    exception: this.loadException,
                    beforeload: this.onBeforeStoreLoad,
                    load: this.onAfterStoreLoad,
                    scope: this,
                }
            });
            return gridStore;
        },
        getColumnModel: function () {
            var currentLngCode = this._getLng(SYNO?.SDS?.Session?.lang || "enu");
            this.Col1 = new SYNO.ux.EnableColumn({
                header: this.helper.V("ui", "col_system"),
                dataIndex: "system",
                id: "system",
                name: "system",
                width: 100,
                align: "center",
                enableFastSelectAll: false,
                disabled: true,
                bindRowClick: true
            })
            this.Col2 = new SYNO.ux.EnableColumn({
                header: this.helper.V("ui", "col_installed"),
                dataIndex: "installed",
                name: "installed",
                id: "installed",
                width: 100,
                align: "center",
                enableFastSelectAll: false,
                disabled: true,
                bindRowClick: true
            });

            return new Ext.grid.ColumnModel({
                columns: [
                    {
                        header: this.helper.V("ui", "col_name"),
                        width: 60,
                        dataIndex: 'name'
                    }, {
                        header: this.helper.V("ui", "col_version"),
                        width: 30,
                        dataIndex: 'version'
                    }, {
                        header: this.helper.V("ui", "col_description"),
                        width: 300,
                        dataIndex: 'description',
                        renderer: function (value, metaData, record, row, col, store, gridView) {
                            return value[currentLngCode] ?? value['en_US'];
                        }
                    }, this.Col1, this.Col2,
                ],
                defaults: { sortable: !1, menuDisabled: !1 },
            });
        },
        fillConfig: function (e) {
            const t = this;
            // (t.searchPanel = t.initSearchForm()),
            (t.addonsStore = t.getStore()),
                (t.paging = t.initPagingToolbar());
            const i = {
                border: !1,
                trackResetOnLoad: !0,
                layout: "fit",
                itemId: "iscsi_log",
                tbar: t.initToolbar(),
                enableColumnMove: !1,
                enableHdMenu: !1,
                bbar: t.paging,
                store: t.addonsStore,
                colModel: t.getColumnModel(),
                view: new SYNO.ux.FleXcroll.grid.BufferView({
                    rowHeight: 27,
                    scrollDelay: 30,
                    borderHeight: 1,
                    emptyText: "no_log_available",
                    templates: {
                        cell: new Ext.XTemplate(
                            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="-1" {cellAttr}>',
                            '<div class="{this.selectableCls} x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
                            "</td>",
                            { selectableCls: SYNO.SDS.Utils.SelectableCLS }
                        ),
                    },
                }),
                plugins: [this.Col1, this.Col2],
                selModel: new Ext.grid.RowSelectionModel({
                    singleSelect: false
                }),
                loadMask: !0,
                stripeRows: !0,
                listeners: {
                    cellclick: {
                        delay: 100,
                        scope: this,
                        fn: this.onCellClick
                    },
                }
            };
            return Ext.apply(i, e), i;
        },
        onCellClick: function (grid, recordIndex, i, s) {
            var record = grid.store.data.get(recordIndex);
            var id = grid.getColumnModel().getColumnAt(i).id;
            if (id !== 'system' && record.data['system'] === false) {
                record.data[id] = !record.data[id];
                grid.getView().refresh();
            }
        },
        isBelong: function (e, t) {
            let i;
            for (i in t) if (t[i] !== e[i]) return !1;
            return !0;
        },
        isTheSame: function (e, t) {
            return this.isBelong(e, t) && this.isBelong(t, e);
        },
        onSearch: function (e, t) {
            const i = this,
                s = i.addonsStore;
            if (!i.isTheSame(s.baseParams, t)) {
                const e = ["name", "description"];
                if (
                    (t.date_from &&
                        (t.date_from =
                            Date.parseDate(
                                t.date_from,
                                SYNO.SDS.DateTimeUtils.GetDateFormat()
                            ) / 1e3),
                        t.date_to)
                ) {
                    const e = Date.parseDate(
                        t.date_to,
                        SYNO.SDS.DateTimeUtils.GetDateFormat()
                    );
                    e.setDate(e.getDate() + 1), (t.date_to = e / 1e3 - 1);
                }
                e.forEach((e) => {
                    s.baseParams[e] = t[e];
                }),
                    i.loadData();
            }
            i.searchField.searchPanel.hide();
        },
        onActive: function () {
            if (this.loaded) return;
            this.loadData();
        },
        enableButtonCheck: function () {
            this.addonsStore.getTotalCount()
                ? (this.saveButton.enable())
                : (this.saveButton.disable());
        },
        loadData: function () {
            const e = this.addonsStore;
            const t = { offset: 0, limit: this.itemsPerPage };
            e.load({ params: t });
            this.enableButtonCheck();
            this.loaded = true;
        },
        loadException: function () {
            this.appWin.clearStatusBusy(), this.setMask(!0);
        },
        onBeforeStoreLoad: function (e, t) {
            this.appWin.setStatusBusy();
        },
        onAfterStoreLoad: function (e, t, i) {
            const s = this;
            s.appWin.clearStatusBusy(),
                t.length < 1 ? s.setMask(!0) : s.setMask(!1),
                s.setPagingToolbar(e, s.paging),
                this.enableButtonCheck();
        },
        setMask: function (e) {
            SYNOCOMMUNITY.RRManager.SetEmptyIcon(this, e);
        },
        setPagingToolbar: function (e, t) {
            this.setPagingToolbarVisible(t, e.getTotalCount() > this.itemsPerPage);
        },
        setPagingToolbarVisible: function (e, t) {
            e.setButtonsVisible(!0);
        },
        updateFbarItems: function (e) {
            this.isVisible();
        },
        showMsg: function (msg) {
            this.owner.getMsgBox().alert("title", msg);
        },
        onClearLogDone: function (e, t, i, s) {
            e
                ? this.loadData()
                : this.appWin
                    .getMsgBox()
                    .alert(
                        this.appWin.title,
                        "error_system"
                    ),
                this.appWin.clearStatusBusy();
        },
        onAddonsSave: function (e) {
            var installedAddons = this.addonsStore.getRange().filter(x => { return x.data.installed == true }).map((x) => { return x.id });
            var newAddons = {};
            installedAddons.forEach((x) => {
                newAddons[x] = '';
            });
            var rrConfigJson = localStorage.getItem("rrConfig");
            var rrConfig = JSON.parse(rrConfigJson);
            rrConfig.user_config.addons = newAddons;
            this.appWin.setStatusBusy();
            this.appWin.handleFileUpload(rrConfig.user_config);
        },
        onLogClear: function () {
        },
        onExportCSV: function () {
            this.onLogSave("csv");
        },
        onExportHtml: function () {
            this.onLogSave("html");
        },
        onLogSave: function (e) {
        },
        saveLog: function (e) {
        },
        destroy: function () {
            this.rowNav && (Ext.destroy(this.rowNav), (this.rowNav = null)),
                this.searchField && this.searchField.fireEvent("destroy"),
                this.callParent([this]);
        },
    }));

/***/ }),

/***/ "./src/src/tabs/debug.js":
/*!*******************************!*\
  !*** ./src/src/tabs/debug.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Debug.Main", {
    extend: "SYNO.SDS.Utils.TabPanel",
    API: {},
    constructor: function (e) {
        (this.appWin = e.appWin),
            (this.owner = e.owner),
            this.callParent([this.fillConfig(e)]);
    },
    _prefix: '/webman/3rdparty/rr-manager/scripts/',
    callCustomScript: function (scriptName) {

        return new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: `${this._prefix}${scriptName}`,
                method: 'GET',
                timeout: 60000,
                headers: {
                    'Content-Type': 'text/html'
                },
                success: function (response) {
                    // if response text is string need to decode it
                    if (typeof response?.responseText === 'string') {
                        resolve(Ext.decode(response?.responseText));
                    } else {
                        resolve(response?.responseText);
                    }
                },
                failure: function (result) {
                    if (typeof result?.responseText === 'string' && result?.responseText && !result?.responseText.startsWith('<')) {
                        var response = Ext.decode(result?.responseText);
                        reject(response?.error);
                    }
                    else {
                        reject('Failed with status: ' + result?.status);
                    }
                }
            });
        });
    },
    fillConfig: function (e) {
        this.generalTab = new SYNOCOMMUNITY.RRManager.Debug.GeneralTab({
            appWin: this.appWin,
            owner: this,
            itemId: "GeneralTab",
        });

        const tabs = [this.generalTab];

        const settingsConfig = {
            title: "Settings",
            autoScroll: true,
            useDefaultBtn: true,
            labelWidth: 200,
            fieldWidth: 240,
            activeTab: 0,
            deferredRender: false,
            items: tabs,
            listeners: {
                activate: this.updateAllForm,
                scope: this
            },
        };

        return Ext.apply(settingsConfig, e);
    },
    loadAllForms: function (e) {
        this.items.each((t) => {
            if (Ext.isFunction(t.loadForm)) {
                if (t.itemId == "SynoInfoTab") {
                    t.loadForm(e.synoinfo);
                } else {
                    t.loadForm(e);
                }
            }
        });
    },
    updateEnv: function (e) {
    },
    updateAllForm: async function () {
        this.setStatusBusy();
        try {
            const e = await this.getConf();
            this.loadAllForms(e), this.updateEnv(e);
        } catch (e) {
            SYNO.Debug(e);
        }
        this.clearStatusBusy();
    },
    getConf: function () {
        return this.callCustomScript('getNetworkInfo.cgi')
    },
    setConf: function () {
        var user_config = this.getParams();
        var rrConfigJson = localStorage.getItem("rrConfig");
        var rrConfigOrig = JSON.parse(rrConfigJson);
        rrConfigOrig.user_config = user_config;
        localStorage.setItem("rrConfig", JSON.stringify(rrConfigOrig));

        return this.appWin.handleFileUpload(user_config);
    }
}));


/***/ }),

/***/ "./src/src/tabs/main.js":
/*!******************************!*\
  !*** ./src/src/tabs/main.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _components_dialogs_updateAvailableDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/dialogs/updateAvailableDialog */ "./src/src/components/dialogs/updateAvailableDialog.js");
/* harmony import */ var _components_dialogs_passwordConfirmDialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/dialogs/passwordConfirmDialog */ "./src/src/components/dialogs/passwordConfirmDialog.js");
/* harmony import */ var _components_dialogs_uploadFileDialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/dialogs/uploadFileDialog */ "./src/src/components/dialogs/uploadFileDialog.js");
/* harmony import */ var _utils_updateHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/updateHelper */ "./src/src/utils/updateHelper.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Overview.Main", {
        extend: "SYNO.ux.Panel",
        helper: SYNOCOMMUNITY.RRManager.Helper,
        updateHelper: SYNOCOMMUNITY.RRManager.UpdateHelper,
        apiProvider: SYNOCOMMUNITY.RRManager.SynoApiProvider,
        formatString: function (str, ...args) {
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        },

        handleFileUpload: function (jsonData, rrManagerConfig) {
            if (jsonData) {
                this.apiProvider._handleFileUpload(jsonData).then(x => {
                    this.apiProvider.runScheduledTask('ApplyRRConfig');
                    this.showMsg(this.helper.V('ui', 'rr_config_applied'));
                    this.appWin.clearStatusBusy();
                });
            }
            //TODO: implement modify rrManagerConfig
            if (rrManagerConfig) {
                this.apiProvider._handleFileUpload(rrManagerConfig).then(x => {
                    this.apiProvider.runScheduledTask('ApplyRRConfig');
                    this.showMsg(this.helper.V('ui', 'rr_config_applied'));
                    this.appWin.clearStatusBusy();
                });
            }
        },
        constructor: function (e) {
            this.installed = false;
            this.appWin = e.appWin;
            this.data = {
                myText: "test text"
            };
            this.appWin.handleFileUpload = this.handleFileUpload.bind(this);
            this.loaded = false;
            this.callParent([this.fillConfig(e)]);
            this.apiProvider.init(this.sendWebAPI.bind(this));
            this.updateHelper.init(this.apiProvider, this);
            this.mon(
                this,
                "data_ready",
                () => {
                    if (this.getActivePage)
                        this.getActivePage().fireEvent("data_ready");
                },
                this
            );
        },
        createActionsSection: function () {
            return new SYNO.ux.FieldSet({
                title: this.helper.V('ui', 'section_rr_actions'),
                items: [
                    {
                        xtype: 'syno_panel',
                        activeTab: 0,
                        plain: true,
                        items: [
                            {
                                xtype: 'syno_compositefield',
                                hideLabel: true,
                                items: [{
                                    xtype: 'syno_displayfield',
                                    value: this.helper.V('ui', 'run_update'),
                                    width: 140
                                },
                                {
                                    xtype: 'syno_button',
                                    btnStyle: 'green',
                                    text: this.helper.V('health_panel', 'btn_from_pc'),
                                    handler: this.onFromPC.bind(this)
                                },
                                {
                                    xtype: 'syno_button',
                                    btnStyle: 'blue',
                                    text: this.helper.V('health_panel', 'btn_from_ds'),
                                    handler: this.onFromDS.bind(this)
                                }]
                            },
                        ],
                        deferredRender: true
                    },
                ]
            });
        },
        fillConfig: function (e) {
            // this.uploadFileDialog = this.createUplaodFileDialog();
            this.panels = {
                healthPanel: new SYNOCOMMUNITY.RRManager.Overview.HealthPanel({
                    appWin: e.appWin,
                    owner: this,
                }),
                statusBoxsPanel: new SYNOCOMMUNITY.RRManager.Overview.StatusBoxsPanel({
                    appWin: e.appWin,
                    owner: this,
                }),
                actionsPanel: {
                    xtype: "syno_panel",
                    itemId: "rrActionsPanel",
                    cls: "iscsi-overview-statusbox iscsi-overview-statusbox-lun iscsi-overview-statusbox-healthy iscsi-overview-statusbox-click",
                    flex: 1,
                    height: 96,
                    hidden: true,
                    layout: "vbox",
                    layoutConfig: { align: "stretch" },
                    items: [this.createActionsSection()],
                },
            };
            const t = {
                itemId: "taskTabPanel",
                deferredRender: false,
                layoutOnTabChange: true,
                border: false,
                plain: true,
                activeTab: 0,
                region: "center",
                height: 500,
                layout: "vbox",
                cls: "blue-border",
                layoutConfig: { align: "stretch" },
                items: Object.values(this.panels),
                listeners: {
                    scope: this,
                    activate: this.onActivate,
                    deactivate: this.onDeactive,
                    data_ready: this.onDataReady,
                },
            };
            return Ext.apply(t, e), t;
        }, _getRrConfig: function () {
            const rrConfigJson = localStorage.getItem('rrConfig');
            return JSON.parse(rrConfigJson);
        },
        __checkDownloadFolder: function (callback) {
            var self = this;
            const rrConfig = this._getRrConfig();
            const config = rrConfig.rr_manager_config;
            self.apiProvider.getSharesList().then(x => {
                var shareName = `/${config['SHARE_NAME']}`;
                var sharesList = x.shares;
                localStorage.setItem('sharesList', JSON.stringify(sharesList));
                var downloadsShareMetadata = sharesList.find(x => x.path.toLowerCase() == shareName.toLowerCase());
                if (!downloadsShareMetadata) {
                    var msg = this.formatString(this.helper.V('ui', 'share_notfound_msg'), config['SHARE_NAME']);
                    self.appWin.setStatusBusy({ text: this.helper.V('ui', 'checking_dependencies_loader') });
                    self.showMsg(msg);
                    return;
                }
                if (callback) callback();
            });
        },

        __checkRequiredTasks: async function () {
            var self = this;
            var tasksList = ["RunRrUpdate", "ApplyRRConfig"];
            //list of required tasks
            var requiredTasks = [
                {
                    name: "SetRootPrivsToRrManager",
                    createTaskCallback: self.createAndRunSchedulerTaskSetRootPrivilegesForRrManager.bind(this),
                    updateTaskCallback: self.updateAndRunSchedulerTaskSetRootPrivilegesForRrManager.bind(this)
                }];
            try {
                let response = await self.apiProvider.getTaskList();
                var tasks = response.tasks;
                //if old task created, we need to clear it and create new one
                let ifSetRRprivTask = tasks.find(x => x.name === "SetRootPrivsToRrManager");
                var tasksToCreate = tasksList.filter(task => !tasks.find(x => x.name === task));
                if (tasksToCreate.length > 0 || ifSetRRprivTask) {
                    async function craeteTasks() {
                        const task = requiredTasks[0];
                        if (ifSetRRprivTask) {
                            //Update existing task
                            if (task.updateTaskCallback) {
                                var data = await self.showPasswordConfirmDialog(task.name);
                                task.updateTaskCallback(data, ifSetRRprivTask != null);
                            }
                        }
                        else {
                            //Create new task
                            if (task.createTaskCallback) {
                                var data = await self.showPasswordConfirmDialog(task.name);
                                task.createTaskCallback(data, ifSetRRprivTask != null);
                            }
                        }
                        // After all tasks have been created, you might want to notify the user.
                        self.showMsg(self.helper.V('ui', 'tasks_created_msg'));
                        self.owner.clearStatusBusy();
                    }
                    self.appWin.getMsgBox().confirm(
                        "Confirmation",
                        self.formatString(
                            self.helper.formatString(self.helper.V('ui', 'required_tasks_is_missing'), tasksToCreate),
                            self.helper.V('ui', 'required_components_missing')),
                        (userResponse) => {
                            if ("yes" === userResponse) {
                                craeteTasks();
                            } else {
                                Ext.getCmp(self.id).getEl().mask(self.helper.formatString(self.helper.V('ui', 'required_components_missing_spinner_msg'), tasksNames), "x-mask-loading");
                            }
                        }, self,
                        {
                            cancel: { text: _T("common", "cancel") },
                            yes: { text: _T("common", "agree"), btnStyle: 'red' }
                        }, {
                        icon: "confirm-delete-icon"
                    }
                    );
                }
            } catch (error) {
                self.showMsg(`Error checking or creating RRM tasks: ${error}`);
                console.error(`Error checking or creating RRM tasks: ${error}`);
            }
            finally {
                self.owner.clearStatusBusy();
            }
        },
        showPasswordConfirmDialog: function (taskName) {
            return new Promise((resolve, reject) => {
                var window = new SYNOCOMMUNITY.RRManager.Overview.PasswordConfirmDialog({
                    owner: this.appWin,
                    title: `${_T("common", "enter_password_to_continue")} for task: ${taskName}.`,
                    confirmPasswordHandler: resolve
                });
                window.open();
            });
        },
        createAndRunSchedulerTaskSetRootPrivilegesForRrManager: function (data) {
            self = this;
            this.apiProvider.getPasswordConfirm(data).then(data => {
                this.apiProvider.createTask("SetRootPrivsToRrManager",
                    "/var/packages/rr-manager/target/app/install.sh",
                    data
                ).then(x => {
                    self.sendRunSchedulerTaskWebAPI(data);
                });
            });
        },
        updateAndRunSchedulerTaskSetRootPrivilegesForRrManager: function (data) {
            self = this;
            this.apiProvider.getPasswordConfirm(data).then(data => {
                this.apiProvider.updateTask("SetRootPrivsToRrManager",
                    "/var/packages/rr-manager/target/app/install.sh",
                    data
                ).then(x => {
                    self.sendRunSchedulerTaskWebAPI(data);
                });
            });
        },
        showPrompt: function (title, message, text, yesCallback) {
            var window = new SYNOCOMMUNITY.RRManager.Overview.UpdateAvailableDialog({
                owner: this.appWin,
                title: title,
                message: message,
                msg: text,
                msgItemCount: 3,
                confirmCheck: true,
                btnOKHandler: yesCallback
            });
            window.open();
        },
        onActivate: function () {
            const self = this;
            if (this.loaded) return;
            //TODO: implement localization
            self.appWin.setStatusBusy({ text: 'Loading system info...' });
            (async () => {
                // handle the error during the initialization
                try {
                    //await self.apiProvider.init(self.sendWebAPI.bind(self));


                    const [systemInfo, packages, rrCheckVersion] = await Promise.all([
                        self.apiProvider.getSytemInfo(),
                        self.apiProvider.getPackagesList(),
                        self.initialConfig.appWin.initialConfig.appInstance.taskButton.jsConfig.checkRRForUpdates
                            ? self.apiProvider.checkRRVersion() : null
                    ]);
                    self.systemInfo = systemInfo;
                    var isModernDSM = systemInfo.version_string.includes("7.2.2");
                    self.apiProvider.setIsModernDSM(isModernDSM);

                    self.__checkDownloadFolder(self.__checkRequiredTasks.bind(self));
                    if (systemInfo && packages) {
                        self.rrCheckVersion = rrCheckVersion;
                        //TODO: implement localization
                        self.systemInfoTxt = `Welcome to RR Manager!`; // 
                        const rrManagerPackage = packages.packages.find((packageInfo) => packageInfo.id == 'rr-manager');

                        self.panels?.healthPanel?.fireEvent(
                            "select",
                            self.panels?.healthPanel?.clickedBox
                        );
                        self.panels.statusBoxsPanel.fireEvent(
                            "select",
                            self.panels.statusBoxsPanel.clickedBox
                        );
                        await self.updateAllForm();
                        var data = {
                            text: `Model: ${systemInfo?.model}`,
                            text2: `RAM: ${systemInfo?.ram} MB`,
                            text3: `DSM version: ${systemInfo?.version_string}`,
                            rrManagerVersion: `${rrManagerPackage?.version}`,
                            rrVersion: self.rrConfig.rr_version
                        };
                        Ext.apply(data, self.data);
                        if (!self.installed) {
                            //create rr tmp folder
                            self.rrManagerConfig = self.rrConfig.rr_manager_config;
                            SYNO.API.currentManager.requestAPI('SYNO.FileStation.CreateFolder', "create", "2", {
                                folder_path: `/${self.rrManagerConfig.SHARE_NAME}`,
                                name: self.rrManagerConfig.RR_TMP_DIR,
                                force_parent: false
                            });
                            self.installed = true;
                        }
                        self.panels?.healthPanel?.fireEvent("data_ready");
                        self.panels?.statusBoxsPanel?.fireEvent("data_ready", data);
                        self.loaded = true;
                    }

                    if (rrCheckVersion && self.isUpdateAvailable(rrCheckVersion)) {
                        self.showPrompt(self.helper.V('ui', 'prompt_update_available_title'),
                            self.helper.formatString(self.helper.V('ui', 'prompt_update_available_message'), rrCheckVersion.tag),
                            rrCheckVersion.notes, self.donwloadUpdate.bind(self));
                    }
                } catch (error) {
                    self.appWin.clearStatusBusy();
                    self.showMsg(`Error during RRM initialization: ${error}`);
                    return;
                }
            })();
        },
        isUpdateAvailable: function (rrCheckVersion) {
            // Tag format: 24.11.1
            if (rrCheckVersion?.status !== "update available" || rrCheckVersion?.tag == "null" || this.rrConfig.rr_version === rrCheckVersion?.tag) {
                return false;
            }

            const currentVersion = this.rrConfig.rr_version.split('.').map(Number);
            const newVersion = rrCheckVersion.tag.split('.').map(Number);

            for (let i = 0; i < Math.max(currentVersion.length, newVersion.length); i++) {
                const current = currentVersion[i] || 0;
                const newVer = newVersion[i] || 0;
                if (newVer > current) {
                    return true;
                } else if (newVer < current) {
                    return false;
                }
            }

            return false;
        },

        showMsg: function (msg) {
            this.owner.getMsgBox().alert("title", msg);
        },
        donwloadUpdate: function () {
            self = this;
            SYNO.API.currentManager.requestAPI('SYNO.DownloadStation2.Task', "create", "2", {
                type: "url",
                destination: `${self.rrManagerConfig.SHARE_NAME}/${self.rrManagerConfig.RR_TMP_DIR}`,
                create_list: true,
                url: [self.rrCheckVersion.updateAllUrl]
            });
        },
        updateAllForm: async function () {
            this.owner.setStatusBusy();
            try {
                const rrConfig = await this.getConf();
                var configName = 'rrConfig';

                this.appWin[configName] = rrConfig;
                this[configName] = rrConfig;

                localStorage.setItem(configName, JSON.stringify(rrConfig));
            } catch (e) {
                SYNO.Debug(e);
            } finally {
                this.owner.clearStatusBusy();
            }
        },

        getConf: function () {
            return this.apiProvider.callCustomScript('getConfig.cgi')
        },
        onDeactive: function () {
            this.panels?.healthPanel?.fireEvent(
                "deactivate",
                this.panels?.healthPanel?.clickedBox
            );

        },
        onDataReady: async function () {
            const e = this;
            e.loaded = true;
            e.getComponent("rrActionsPanel")?.setVisible(true);
            e.doLayout();
            // need to clean the spinner when form has been loaded
            e.appWin.clearStatusBusy();
        },
        getActivateOverviewPanel: function () {
            if (this.getActiveTab()) {
                return this.getActiveTab().overviewPanel;
            }
            return null;
        },
        onFromPC: function () {
            this.uploadFileDialog = this.createUplaodFileDialog();
            this.uploadFileDialog.open();
        },
        onFromDS: function () {
            self = this;
            if (!Ext.isDefined(this.dialog)) {
                var a = this.getFileExtsByImageType().toString().replace(/\./g, "");
                this.dialog = new SYNO.SDS.Utils.FileChooser.Chooser({
                    parent: this,
                    owner: this.appWin,
                    closeOwnerWhenNoShare: true,
                    closeOwnerNumber: 0,
                    enumRecycle: true,
                    superuser: true,
                    usage: { type: "open", multiple: true },
                    title: this.helper.T("upload_file_dialog", "choose_file_title"),
                    folderToolbar: true,
                    getFilterPattern: function () {
                        return a;
                    },
                    treeFilter: this.helper.VMMDSChooserTreeFilter,
                    listeners: {
                        scope: this,
                        choose: function (d, b, c) {
                            b.records.forEach(function (f) {
                                var e = {
                                    name: f
                                        .get("path")
                                        .substring(
                                            f.get("path").lastIndexOf("/") + 1,
                                            f.get("path").lastIndexOf(".")
                                        ),
                                    path: f.get("path"),
                                    real_path: _S("hostname") + f.get("path"),
                                    get_patch_by: "from_ds",
                                    file_size: f.get("filesize"),
                                };
                                if (!this.preCheck(e)) {
                                    return true;
                                }
                                self.updateHelper.updateFileInfoHandler(e);
                            }, this);
                            this.dialog.close();
                        },
                        close: function () {
                            delete this.dialog;
                        },
                    },
                });
            }
            this.dialog.show();
        },
        createUplaodFileDialog: function () {
            this.uploadFileDialog = new SYNOCOMMUNITY.RRManager.Overview.UploadFileDialog({
                parent: this,
                owner: this.appWin,
                helper: this.helper,
                updateHelper: this.updateHelper,
                id: "upload_file_dialog",
                title: this.helper.V("ui", "upload_file_dialog_title"),
                apiProvider: this.apiProvider
            });
            return this.uploadFileDialog;
        },
        preCheck: function (a) {
            var b = a.path.substring(a.path.lastIndexOf("."));
            if (-1 === this.getFileExtsByImageType().indexOf(b)) {
                return false;
            }
            return true;
        },
        exts: {
            zip: [".zip"],
        },
        imageType: "zip",
        getFileExtsByImageType: function () {
            return this.exts[this.imageType];
        },
    }));

/***/ }),

/***/ "./src/src/tabs/setting.js":
/*!*********************************!*\
  !*** ./src/src/tabs/setting.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define("SYNOCOMMUNITY.RRManager.Setting.Main", {
        extend: "SYNO.SDS.Utils.TabPanel",
        helper: SYNOCOMMUNITY.RRManager.Helper,
        constructor: function (e) {
            (this.appWin = e.appWin),
                (this.owner = e.owner),
                this.callParent([this.fillConfig(e)]);
        },
        fillConfig: function (e) {
            this.generalTab = new SYNOCOMMUNITY.RRManager.Setting.GeneralTab({
                appWin: this.appWin,
                owner: this,
                itemId: "GeneralTab",
            });

            this.rrConfigTab = new SYNOCOMMUNITY.RRManager.Setting.RRConfigTab({
                appWin: this.appWin,
                owner: this,
                itemId: "RRConfigTab",
            });

            this.synoInfoTab = new SYNOCOMMUNITY.RRManager.Setting.SynoInfoTab({
                appWin: this.appWin,
                owner: this,
                itemId: "SynoInfoTab",
            });

            this.rrManagerConfigTab = new SYNOCOMMUNITY.RRManager.Setting.RrManagerConfigTab({
                appWin: this.appWin,
                owner: this,
                itemId: "RrManagerConfigTab",
            });


            const tabs = [this.generalTab, this.rrConfigTab, this.synoInfoTab, this.rrManagerConfigTab];

            const settingsConfig = {
                title: "Settings",
                autoScroll: true,
                useDefaultBtn: true,
                labelWidth: 200,
                fieldWidth: 240,
                activeTab: 0,
                deferredRender: false,
                items: tabs,
                listeners: {
                    activate: this.updateAllForm,
                    scope: this
                },
            };

            return Ext.apply(settingsConfig, e);
        },
        loadAllForms: function (config) {
            const user_config = config.user_config;
            const rrm_config = config.rrm_config;
            this.items.each((t) => {
                if (t && typeof t.loadForm !== undefined && Ext.isFunction(t.loadForm)) {
                    if (t.itemId == "SynoInfoTab") {
                        t.loadForm(user_config.synoinfo);
                    }if(t.itemId == "RrManagerConfigTab") {
                        debugger;
                        t.loadForm(rrm_config);
                    }
                     else {
                        t.loadForm(user_config);
                    }
                }
            });
        },
        updateEnv: function (e) {
        },
        updateAllForm: async function () {
            this.setStatusBusy();
            try {
                const e = await this.getConf();
                this.loadAllForms(e), this.updateEnv(e);
            } catch (e) {
                SYNO.Debug(e);
            }
            this.clearStatusBusy();
        },
        applyHandler: function () {
            this.confirmApply() && this.doApply().catch((error) =>
                alert("Error", error)
            );
        },
        doApply: async function () {
            this.setStatusBusy();
            try {
                (async () => {
                    await this.setConf();
                    await this.updateAllForm();
                    // await this.appWin.runScheduledTask('ApplyRRConfig');
                    this.clearStatusBusy();
                    this.setStatusOK();
                })();
            } catch (e) {
                SYNO.Debug(e);
                this.clearStatusBusy();
                this.appWin.getMsgBox().alert(this.title, this.API.getErrorString(e));
            }
        },
        getParams: function () {
            const generalTab = this.generalTab.getForm().getValues();
            const rrConfigTab = this.rrConfigTab.getForm().getValues();
            const rrManagerConfigTab = this.rrManagerConfigTab.getForm().getValues();
            localStorage.setItem("rrManagerConfig", JSON.stringify(rrManagerConfigTab));

            const synoInfoTab = this.synoInfoTab.getForm().getValues();
            const synoInfoTabFixed = {
                synoinfo: synoInfoTab
            };

            var rrConfigJson = localStorage.getItem("rrConfig");
            var rrConfig = JSON.parse(rrConfigJson);
            return Object.assign(rrConfig?.user_config, generalTab, rrConfigTab, synoInfoTabFixed);
        },
        getConf: function () {
            var rrConfigJson = localStorage.getItem("rrConfig");
            var rrConfig = JSON.parse(rrConfigJson);
            var rrManagerConfig = this.appWin.appInstance.initialConfig.taskButton.jsConfig

            return {
                user_config: rrConfig?.user_config,
                rrm_config: rrManagerConfig,
            };
        },
        setConf: function () {
            var user_config = this.getParams();
            var rrConfigJson = localStorage.getItem("rrConfig");
            var rrConfigOrig = JSON.parse(rrConfigJson);
            var rrManagerConfigJson = localStorage.getItem("rrConfig");
            var rrManagerConfigOrig = JSON.parse(rrManagerConfigJson);
            rrConfigOrig.user_config = user_config;
            localStorage.setItem("rrConfig", JSON.stringify(rrConfigOrig));

            return this.appWin.handleFileUpload(user_config, rrManagerConfigOrig);
        },
        confirmApply: function () {
            if (!this.isAnyFormDirty())
                return (
                    this.setStatusError({
                        text: this.helper.V("ui", "frm_validation_no_change"),
                        clear: !0,
                    }),
                    !1
                );
            const e = this.getAllForms().find((e) => !e.isValid());
            return (
                !e ||
                (this.setActiveTab(e.itemId),
                    this.setStatusError({
                        text: this.helper.V("ui", "frm_validation_fill_required_fields"),
                    }),
                    !1)
            );
        },
        onPageConfirmLostChangeSave: function () {
            return this.confirmApply() ? this.doApply() : Promise.reject();
        },
    }));

/***/ }),

/***/ "./src/src/tabs/ssh.js":
/*!*****************************!*\
  !*** ./src/src/tabs/ssh.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _components_iframePanel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/iframePanel */ "./src/src/components/iframePanel.js");
/* harmony import */ var _components_iframePanel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_iframePanel__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ext.define('SYNOCOMMUNITY.RRManager.Ssh.Main', {
    extend: 'SYNO.ux.Panel',
    helper: SYNOCOMMUNITY.RRManager.Helper,
    apiProvider: SYNOCOMMUNITY.RRManager.SynoApiProvider,

    constructor: function (e) {
        this.installed = false;
        this.appWin = e.appWin;
        this.loaded = false;
        this.callParent([this.fillConfig(e)]);
        this.mon(
            this,
            'data_ready',
            () => {
                if (this.getActivePage) {
                    this.getActivePage().fireEvent('data_ready');
                }
            },
            this
        );
    },
    fillConfig: function (e) {
        const me = this;
        const cfg = {
            layout: 'fit',
            width: '100%',
            autoHeight: true,
            items: [
                new SYNOCOMMUNITY.RRManager.IframePanel({
                    iframeSrc: document.location.origin + '/ttyd',
                }),
            ],            
            listeners: {
                scope: me,
                afterrender: me.onAfterRender,
                resize: me.onResize
            },

        };
        return Ext.apply(cfg, e);
    },
    getOptions: function () {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const path = window.location.pathname.replace(/[/]+$/, '');
        const wsUrl = [protocol, '//', window.location.hostname, ':7681', path, '/ws', window.location.search].join('');
        const tokenUrl = [window.location.protocol, '//', window.location.hostname, , ':7681', '/token'].join('');
        const clientOptions = {
            rendererType: 'webgl',
            disableLeaveAlert: false,
            disableResizeOverlay: false,
            enableZmodem: false,
            enableTrzsz: false,
            enableSixel: false,
            isWindows: false,
            unicodeVersion: '11',
        };
        const termOptions = {
            fontSize: 13,
            fontFamily: 'Consolas,Liberation Mono,Menlo,Courier,monospace',
            theme: {
                foreground: '#d2d2d2',
                background: '#2b2b2b',
                cursor: '#adadad',
                black: '#000000',
                red: '#d81e00',
                green: '#5ea702',
                yellow: '#cfae00',
                blue: '#427ab3',
                magenta: '#89658e',
                cyan: '#00a7aa',
                white: '#dbded8',
                brightBlack: '#686a66',
                brightRed: '#f54235',
                brightGreen: '#99e343',
                brightYellow: '#fdeb61',
                brightBlue: '#84b0d8',
                brightMagenta: '#bc94b7',
                brightCyan: '#37e6e8',
                brightWhite: '#f1f1f0',
            },
            allowProposedApi: true,
        };
        const flowControl = {
            limit: 100000,
            highWater: 10,
            lowWater: 4,
        };
        return {
            wsUrl,
            tokenUrl,
            clientOptions,
            termOptions,
            flowControl
        }
    },
    onAfterRender: function () {
        const me = this;
        // Ext.defer(function () {
        //     const container = me.getComponent("terminalContainer");
        //     if (container) {
        //         const containerEl = container.getEl().dom;
        //         me.options = me.getOptions();
        //         me.xterm = new Xterm(me.options);
        //         me.xterm.refreshToken();
        //         me.xterm.open(containerEl);
        //         me.xterm.connect();
        //         // // Adjust terminal size to fit the container
        //         me.resizeTerminal();

        //     } else {
        //         console.error('Terminal container not found');
        //     }
        // }, 50);
    },
    onResize: function () {
        this.resizeTerminal();
    },
    resizeTerminal: function () {
        const me = this;
        if (me.xterm) {
            const containerEl = me.getEl().dom;
            const width = containerEl.clientWidth;
            const height = containerEl.clientHeight;

            // Calculate new cols and rows based on the container size
            const cols = Math.floor(width / me.xterm.terminal._core._renderService.dimensions.device.cell.width);
            const rows = Math.floor(height / me.xterm.terminal._core._renderService.dimensions.device.cell.height);
            if (cols && rows) {
                me.xterm.terminal.resize(cols, rows);
            }
        }
    },
    onActivate: function () {
        const self = this;
        if (this.loaded) return;

        (async () => {
            // Your async code here
        })();
    },

    updateAllForm: async function () {
        this.owner.setStatusBusy();
        try {
            const rrConfig = await this.getConf();
            const configName = 'rrConfig';

            this.appWin[configName] = rrConfig;
            this[configName] = rrConfig;

            localStorage.setItem(configName, JSON.stringify(rrConfig));
        } catch (e) {
            SYNO.Debug(e);
        } finally {
            this.owner.clearStatusBusy();
        }
    },

    onDeactivate: function () {
        this.panels?.healthPanel?.fireEvent(
            'deactivate',
            this.panels?.healthPanel?.clickedBox
        );
    },

    onDataReady: async function () {
        const e = this;
        e.loaded = true;
        e.appWin.clearStatusBusy();
    },

    getActivateOverviewPanel: function () {
        if (this.getActiveTab()) {
            return this.getActiveTab().overviewPanel;
        }
        return null;
    }
}));


/***/ }),

/***/ "./src/src/utils/synoApiProvider.js":
/*!******************************************!*\
  !*** ./src/src/utils/synoApiProvider.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SYNOCOMMUNITY.RRManager.SynoApiProvider = {
        sendWebAPI: null,
        _prefix: '/webman/3rdparty/rr-manager/scripts/',
        init: function (sendWebAPI, isModernDSM = true) {
            this.sendWebAPI = sendWebAPI;
            this.isModernDSM = isModernDSM;
        },
        setIsModernDSM: function (isModernDSM) {
            this.isModernDSM = isModernDSM;
        },
        getSytemInfo: function () {
            that = this;
            return new Promise((resolve, reject) => {
                let args = {
                    api: 'SYNO.DSM.Info',
                    method: 'getinfo',
                    version: 2,
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to get getSytemInfo!');
                    }
                };
                that.sendWebAPI(args);
            });
        },
        getPackagesList: function () {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    additional: ["maintainer", "dsm_app_launch_name", "url", "available_operation", "install_type"],
                    ignore_hidden: false,
                };
                let args = {
                    api: 'SYNO.Core.Package',
                    method: 'list',
                    version: 2,
                    params: params,
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to get packages!');
                    }
                };
                that.sendWebAPI(args);
            });
        },
        getTaskList: function () {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    sort_by: "next_trigger_time",
                    sort_direction: "ASC",
                    offset: 0,
                    limit: 50
                };
                let args = {
                    api: 'SYNO.Core.TaskScheduler',
                    method: 'list',
                    version: 2,
                    params: params,
                    callback: function (success, response) {
                        success ? resolve(response) : reject(`Unable to get DSM task list!, success: ${success}, code: ${response.code}`);
                    }
                };
                that.sendWebAPI(args);
            });
        },
        getSharesList: function () {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    filetype: 'dir', // URL-encode special characters if needed
                    sort_by: 'name',
                    check_dir: true,
                    additional: ["real_path"],
                    enum_cluster: false,
                    node: 'fm_root'
                };
                let args = {
                    api: 'SYNO.FileStation.List',
                    method: 'list_share',
                    version: 2,
                    params: params,
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to get getSharesList!');
                    }
                };
                that.sendWebAPI(args);
            });
        },
        runScheduledTask: function (taskName) {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    task_name: taskName
                };
                let args = {
                    api: 'SYNO.Core.EventScheduler',
                    method: 'run',
                    version: 1,
                    params: params,
                    stop_when_error: false,
                    mode: 'sequential',
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to get packages!');
                    }
                };
                that.sendWebAPI(args);
            });
        },
        _handleFileUpload: function (jsonData) {
            let url = `${this._prefix}uploadConfigFile.cgi`;
            return new Promise((resolve, reject) => {
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    jsonData: jsonData,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (response) {
                        resolve(Ext.decode(response.responseText));
                    },
                    failure: function (response) {
                        reject('Failed with status: ' + response.status);
                    }
                });
            });
        },
        getPasswordConfirm: function (data) {
            self = this;
            return new Promise((resolve, reject) => {
                let args = {
                    api: "SYNO.Core.User.PasswordConfirm",
                    method: "auth",
                    version: self.isModernDSM ? 2 : 1,
                    params: {
                        password: data
                    }, callback: function (success, message) {
                        success ? resolve(message?.SynoConfirmPWToken)
                            : reject('Unable to create task!');
                    },
                };
                self.sendWebAPI(args);
            });
        },
        createTask: function (task_name, operation, token) {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    task_name: task_name,
                    owner: { 0: "root" },
                    event: "bootup",
                    enable: false,
                    depend_on_task: "",
                    notify_enable: false,
                    notify_mail: "",
                    notify_if_error: false,
                    operation_type: "script",
                    operation: decodeURIComponent(operation)
                };

                if (token != "") {
                    params.SynoConfirmPWToken = token
                }

                let args = {
                    api: token ? "SYNO.Core.EventScheduler.Root" : "SYNO.Core.EventScheduler",
                    method: "create",
                    version: 1,
                    params: params,
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to create task!');
                    },
                    scope: this,
                };
                that.sendWebAPI(args);
            });
        },
        updateTask: function (task_name, operation, token) {
            that = this;
            return new Promise((resolve, reject) => {
                let params = {
                    task_name: task_name,
                    owner: { 0: "root" },
                    event: "bootup",
                    enable: false,
                    depend_on_task: "",
                    notify_enable: false,
                    notify_mail: "",
                    notify_if_error: false,
                    operation_type: "script",
                    operation: decodeURIComponent(operation)
                };

                if (token != "") {
                    params.SynoConfirmPWToken = token
                }

                let args = {
                    api: token ? "SYNO.Core.EventScheduler.Root" : "SYNO.Core.EventScheduler",
                    method: "set",
                    version: 1,
                    params: params,
                    callback: function (success, message) {
                        success ? resolve(message) : reject('Unable to create task!');
                    },
                    scope: this,
                };
                that.sendWebAPI(args);
            });
        },
        sendRunSchedulerTaskWebAPI: function (token) {
            args = {
                api: "SYNO.Core.EventScheduler",
                method: "run",
                version: 1,
                params: {
                    task_name: "SetRootPrivsToRrManager",
                },
                callback: function (success, message, data) {
                    if (!success) {
                        console.log("error run EventScheduler task");
                        return;
                    }
                },
                scope: this,
            };

            if (token != "") {
                args.params.SynoConfirmPWToken = token
            }
            this.sendWebAPI(args);
        },
        checkRRVersion: function () {
            return this.callCustomScript('getRrReleaseInfo.cgi');
        },
        getUpdateFileInfo: function (file) {
            return new Promise((resolve, reject) => {
                Ext.Ajax.request({
                    url: `${this._prefix}readUpdateFile.cgi`,
                    method: 'GET',
                    timeout: 60000,
                    params: {
                        file: file
                    },
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    success: function (response) {
                        // if response text is string need to decode it
                        if (typeof response?.responseText === 'string' && response?.responseText != "") {
                            resolve(Ext.decode(response?.responseText));
                        } else {
                            resolve(response?.responseText);
                        }
                    },
                    failure: function (result) {
                        if (typeof result?.responseText === 'string' && result?.responseText) {
                            var response = Ext.decode(result?.responseText);
                            reject(response?.error);
                        }
                        else {
                            reject('Failed with status: ' + response?.status);
                        }
                    }
                });
            });
        },
        callCustomScript: function (scriptName) {

            return new Promise((resolve, reject) => {
                Ext.Ajax.request({
                    url: `${this._prefix}${scriptName}`,
                    method: 'GET',
                    timeout: 60000,
                    headers: {
                        'Content-Type': 'text/html'
                    },
                    success: function (response) {
                        // if response text is string need to decode it
                        if (typeof response?.responseText === 'string') {
                            resolve(Ext.decode(response?.responseText));
                        } else {
                            resolve(response?.responseText);
                        }
                    },
                    failure: function (result) {
                        if (typeof result?.responseText === 'string' && result?.responseText && !result?.responseText.startsWith('<')) {
                            var response = Ext.decode(result?.responseText);
                            reject(response?.error);
                        }
                        else {
                            reject('Failed with status: ' + result?.status);
                        }
                    }
                });
            });
        },
    });

/***/ }),

/***/ "./src/src/utils/updateHelper.js":
/*!***************************************!*\
  !*** ./src/src/utils/updateHelper.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SYNOCOMMUNITY.RRManager.UpdateHelper = {
        init: function (apiProvider, findAppWindow) {
          this.apiProvider = apiProvider;
          this.appWin = findAppWindow.appWin;
          this.helper = findAppWindow.helper;
          this.showMsg = findAppWindow.showMsg.bind(findAppWindow);
        },
        updateFileInfoHandler: function (fileInfo) {
            if (!fileInfo) {
                this.showMsg("File path is not provided");
                return;
            }
            let sharesList = JSON.parse(localStorage.getItem('sharesList'));
            let shareName = fileInfo.path.split("/")[1];
            let shareInfo = sharesList.find(share => share.name.toLocaleLowerCase() === shareName.toLocaleLowerCase());
            if (!shareInfo) {
                this.showMsg("Share not found");
                return;
            }
            var shareRealPath = shareInfo.additional.real_path;
            var fileInfo = shareRealPath.replace(shareName, fileInfo.path.slice(1));
            this.apiProvider.callCustomScript(`uploadUpdateFileInfo.cgi?file=${encodeURIComponent(fileInfo)}`).then(() => {
                this.onRunRrUpdateManuallyClick(fileInfo);
                this.apiProvider.runScheduledTask("RunRrUpdate");
            });
        },
        MAX_POST_FILESIZE: Ext.isWebKit ? -1 : window.console && window.console.firebug ? 20971521 : 4294963200,
        onRunRrUpdateManuallyClick: function (updateFilePath) {
            const self = this;
            const rrConfigJson = localStorage.getItem('rrConfig');
            const rrConfig = JSON.parse(rrConfigJson);

            function runUpdate() {
                self.apiProvider.getUpdateFileInfo(updateFilePath).then((responseText) => {
                    if (!responseText.success) {
                        self.helper.unmask(self.owner);
                        self.showMsg(self.helper.formatString(self.helper.V('upload_file_dialog', 'unable_update_rr_msg'), responseText?.error ?? "No response from the scripts/readUpdateFile.cgi script."));
                        return;
                    }
                    const configName = 'rrUpdateFileVersion';
                    self[configName] = responseText;
                    const currentRrVersion = rrConfig.rr_version;
                    const updateRrVersion = self[configName].updateVersion;

                    async function runUpdate() {
                        //show the spinner
                        self.helper.mask(self.appWin);
                        self.apiProvider.runScheduledTask('RunRrUpdate');
                        const maxCountOfRefreshUpdateStatus = 350;
                        let countUpdatesStatusAttemp = 0;

                        const updateStatusInterval = setInterval(async function () {
                            const checksStatusResponse = await self.apiProvider.callCustomScript('checkUpdateStatus.cgi?filename=rr_update_progress');
                            if (!checksStatusResponse?.success) {
                                clearInterval(updateStatusInterval);
                                self.helper.unmask(self.appWin);
                                self.showMsg(checksStatusResponse?.status);
                            }
                            const response = checksStatusResponse.result;
                            self.helper.mask(self.appWin, self.helper.formatString(self.helper.V('upload_file_dialog', 'update_rr_progress_msg'), response?.progress ?? "--", response?.progressmsg ?? "--"), 'x-mask-loading');
                            countUpdatesStatusAttemp++;
                            if (countUpdatesStatusAttemp == maxCountOfRefreshUpdateStatus || response?.progress?.startsWith('-')) {
                                clearInterval(updateStatusInterval);
                                self.helper.unmask(self.appWin);
                                self.showMsg(self.helper.formatString(self.helper.V('upload_file_dialog', 'update_rr_progress_msg'), response?.progress, response?.progressmsg));
                            } else if (response?.progress == '100') {
                                self.helper.unmask(self.appWin);
                                clearInterval(updateStatusInterval);
                                self.showMsg(self.helper.V('upload_file_dialog', 'update_rr_completed'));
                            }
                        }, 1500);
                    }
                    self.helper.unmask(self.owner);
                    self.appWin.getMsgBox().confirmDelete(
                        "Confirmation",
                        self.helper.formatString(self.helper.V('upload_file_dialog', 'update_rr_confirmation'), currentRrVersion, updateRrVersion),
                        (userResponse) => {
                            if ("yes" === userResponse) {
                                runUpdate();
                            }
                        },
                        e,
                        {
                            yes: {
                                text: self.helper.V('upload_file_dialog', 'btn_proceed'),
                                btnStyle: "red",
                            },
                            no: { text: self.helper.T("common", "cancel") },
                        }
                    );
                }).catch(error => {
                    self.showMsg(`Error. ${error}`);
                });
            }
            self.appWin.getMsgBox().confirmDelete(
                "Confirm",
                self.helper.V('upload_file_dialog', 'file_uploading_succesfull_msg'),
                (result) => {
                    if (result === "yes") {
                        runUpdate();
                    }
                },
                e,
                {
                    yes: {
                        text: self.helper.T("common", "yes"),
                        btnStyle: "red",
                    },
                    no: { text: Ext.MessageBox.buttonText.no },
                }
            ); 
        },
    });

/***/ }),

/***/ "./src/src/utils/updateWizardHelper.js":
/*!*********************************************!*\
  !*** ./src/src/utils/updateWizardHelper.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
// Namespace definition
Ext.ns('SYNOCOMMUNITY.RRManager');
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SYNOCOMMUNITY.RRManager.Helper = {
        T: function (a, b) {
            return _T(a, b);
        },
        V: function (category, element) {
            return _TT("SYNOCOMMUNITY.RRManager.AppInstance", category, element)
        },
        formatString: function (str, ...args) {
            return str.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        },
        maskLoading: function (a) {
            a.getEl().mask(this.T("common", "loading"), "x-mask-loading");
        },
        unmask: function (a) {
            a?.getEl()?.unmask();
        },
        mask: function (b, a) {
            b?.getEl()?.mask(a, "x-mask-loading");
        },
        diskSizeRenderer: function (a) {
            return Ext.util.Format.fileSize(a);
        },
        tryUnmaskAndReload: function (a, b, c) {
            this.unmask(a);
            // b.reload();
            // c();
        },
        getError: function (a) {
            return _T("error", a);
        },
    });

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ !function() {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function() { return module['default']; } :
/******/ 			function() { return module; };
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ }();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ !function() {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = function(exports, definition) {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ }();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ !function() {
/******/ 	__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ }();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ !function() {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ }();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**************************!*\
  !*** ./src/src/index.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _appWindow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./appWindow */ "./src/src/appWindow.js");
/* harmony import */ var _tabs_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tabs/main */ "./src/src/tabs/main.js");
/* harmony import */ var _panels_healthPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panels/healthPanel */ "./src/src/panels/healthPanel.js");
/* harmony import */ var _components_statusBoxTmpl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/statusBoxTmpl */ "./src/src/components/statusBoxTmpl.js");
/* harmony import */ var _components_statusBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/statusBox */ "./src/src/components/statusBox.js");
/* harmony import */ var _panels_statusBoxsPanel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./panels/statusBoxsPanel */ "./src/src/panels/statusBoxsPanel.js");
/* harmony import */ var _tabs_addons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tabs/addons */ "./src/src/tabs/addons.js");
/* harmony import */ var _components_advancedSearchField__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/advancedSearchField */ "./src/src/components/advancedSearchField.js");
/* harmony import */ var _tabs_setting__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tabs/setting */ "./src/src/tabs/setting.js");
/* harmony import */ var _panels_settings_generalTab__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./panels/settings/generalTab */ "./src/src/panels/settings/generalTab.js");
/* harmony import */ var _panels_settings_rrConfigTab__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./panels/settings/rrConfigTab */ "./src/src/panels/settings/rrConfigTab.js");
/* harmony import */ var _panels_settings_synoInfoTab__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./panels/settings/synoInfoTab */ "./src/src/panels/settings/synoInfoTab.js");
/* harmony import */ var _panels_settings_rrManagerConfigTab__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./panels/settings/rrManagerConfigTab */ "./src/src/panels/settings/rrManagerConfigTab.js");
/* harmony import */ var _tabs_debug__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tabs/debug */ "./src/src/tabs/debug.js");
/* harmony import */ var _panels_debug_generalTab__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./panels/debug/generalTab */ "./src/src/panels/debug/generalTab.js");
/* harmony import */ var _tabs_ssh__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tabs/ssh */ "./src/src/tabs/ssh.js");


//tab main






//tab addons



//tab settings(configuration)






//tab debug



//tab ssh


// Namespace definition
Ext.ns('SYNOCOMMUNITY.RRManager');
// Application definition
Ext.define('SYNOCOMMUNITY.RRManager.AppInstance', {
    extend: 'SYNO.SDS.AppInstance',
    appWindowName: 'SYNOCOMMUNITY.RRManager.AppWindow',
    constructor: function () {
        this.callParent(arguments)
    }
});

SYNOCOMMUNITY.RRManager.SetEmptyIcon = (e, t) => {
    let i = e.el.child(".contentwrapper");
    if (i) {
        for (; i.child(".contentwrapper");)
            i = i.child(".contentwrapper");
        t && !i.hasClass("san-is-empty") ? i.addClass("san-is-empty") : !t && i.hasClass("san-is-empty") && i.removeClass("san-is-empty")
    }
};
}();

//# sourceMappingURL=rr-manager.js.map