/**
 * Created by yixin on 18/7/22.
 */

define(["knockout"], function(ko) {

    ko.components.register('blank', {
                    viewModel: function() {

                    },
                template: "<span></span>"
    })

    var Page = function (componentName, title, keywords, dataModel) {
        this.dataModel = ko.observable(dataModel || {});
        this.componentName = ko.observable(componentName || "blank");
        this.params = ko.observable({});

    }
    var page = new Page();

    var update = function (componentName, data, title, keywords, dataModel, template, params, restParams) {
        if (dataModel && (data.template || data.render)) {
            if (!ko.components.isRegistered(componentName)) {
                if (dataModel && typeof dataModel === "function") {
                    dataModel.prototype.dispose = function () {
                        // 组件被移除之前, 调用distory
                        if (data.beforeDistory && typeof data.beforeDistory === "function") {
                            //data.beforeDistory(this);
                            data.beforeDistory.call(this);
                        }
                    }
                    if(dataModel.prototype.afterRender && !dataModel.prototype.koDescendantsComplete){
                        dataModel.prototype.koDescendantsComplete = dataModel.prototype.afterRender;
                    }
                }
                var finalTemplate = (data.template ? data.template : "" ) + (data.render ? data.render : "");   //  render 为template标签的内容, 如果template对象 和render对象都有内容 则合并,否则只取其一
                ko.components.register(componentName, {
                    //viewModel: dataModel,
                    viewModel: {
                        createViewModel: function (params, componentInfo) {
                            var viewData = new dataModel(params, componentInfo);
                            //调用 beforeCreate
                            if (data.beforeCreate && typeof data.beforeCreate === "function") {
                                data.beforeCreate.call(viewData);
                            }
                            return viewData;
                        }
                    },
                    template: finalTemplate
                });
            }
        }
        page.dataModel(dataModel || {});
        page.componentName(componentName || defPage.blankComponent);
        page.params(params || {});

    }

    var pageInit = function (data, componentName, restParams) {
        // 针对 webpack1 或 2打包的结果分析data
        if (typeof data === "function") {
            data = data();
        }
        if (data["default"]) {
            data = data["default"];
        }

        update(componentName, data, data.title, data.keywords, data.viewModel, data.template, data.params, restParams);

    }

    // 执行渲染
    ko.applyBindings(page, document.getElementsByTagName("html")[0]);

    return pageInit;
    
})