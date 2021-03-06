/**
 * @file MIP 官网组件预览
 * @author xuexb <fe.xiaowu@gmail.com>
 * @description 只支持一个页面，预览一个组件下的所有示例，不支持一个页面预览多个组件
 */

define(function (require) {
    var customElement = require('customElement').create();
    var previewLightboxElement = document.querySelector('#example-lightbox');
    var iframeElement = null;

    var config;
    try {
        config = JSON.parse(document.querySelector('#mip-components-config').innerText);
        config.preset = unescape(config.preset || '');
    }
    catch (e) {
        config = null;
    }

    /**
     * 显示预览窗
     */
    var showPopup = function () {
        previewLightboxElement.style.display = 'block';
    };

    /**
     * 关闭预览窗
     */
    var hidePopup = function () {
        previewLightboxElement.style.display = 'none';

        // 销毁 iframe
        if (iframeElement) {
            previewLightboxElement.querySelector('.iphone').removeChild(iframeElement);
            iframeElement = null;
        }
    };

    /**
     * 获取 iframe 窗体
     *
     * @return {HTMLElement}
     */
    var getIframe = function () {
        if (!iframeElement) {
            iframeElement = document.createElement('iframe');
            previewLightboxElement.querySelector('.iphone').appendChild(iframeElement);
        }

        return iframeElement;
    };

    /**
     * 获取预览代码的标题
     *
     * @param {string} element 预览按钮上级元素
     * @return {string}
     */
    var getTitle = function (element) {
        var titleElement = element.previousElementSibling;

        if (/^h\d+/.test(titleElement.tagName.toLowerCase())) {
            return titleElement.innerText;
        }

        return getTitle(titleElement);
    };

    /**
     * 获取预览的 html 代码
     *
     * @param {Object} options 预览的数据
     * @param {string} options.code 代码
     * @param {string} options.title 标题
     * @return {string}
     */
    var getHtml = function (options) {
        var html = [
            '<!DOCTYPE html>',
            '<html mip>',
            '<head>',
                '<meta charset="UTF-8">',
                '<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">',
                '<title>MIP</title>',
                '<link rel="stylesheet" href="https://mipcache.bdstatic.com/static/v1/mip.css">',
                '<style>',
                    '.preview-heading {',
                        'font-size: 14px;',
                        'color: #fff;',
                        'background-color: #2d3c59;',
                        'padding: 10px 2px;',
                        'font-weight: 300;',
                    '}',
                '</style>',
            '</head>',
            '<body>',
                '{{ preset }}',
                '{{ title }}',
                '{{ content }}',
                '<script src="https://mipcache.bdstatic.com/static/v1/mip.js"></script>',
                '{{ deps }}',
            '</body>',
            '</html>'
        ].join('');

        var data = {
            deps: config.deps ? config.deps.map(function (url) {
                return '<script src="' + url + '"></script>';
            }).join('') : '',
            content: options.code,
            preset: config.preset,
            title: options.title ? '<h1 class="preview-heading">' + options.title + '</h1>' : ''
        };

        return html.replace(/{{\s*(.+?)\s*}}/g, function ($0, key) {
            return data[key] || '';
        });
    };

    // 只有当读取配置生效时才注册事件
    if (config && config.preview && previewLightboxElement) {
        customElement.prototype.firstInviewCallback = function () {
            var element = this.element;

            element.addEventListener('click', function () {
                var iframe = getIframe();
                var title = getTitle(element);
                var preview = iframe.contentDocument || iframe.contentWindow.document;
                var html = getHtml({
                    code: element.nextElementSibling.innerText,
                    title: title
                });

                showPopup();

                preview.open();
                preview.write(html);
                preview.close();
            }, false);
        };

        previewLightboxElement.addEventListener('click', hidePopup);
    }

    return customElement;
});
