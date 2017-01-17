/**
 * @file mip-test-hw 组件
 * @author
 */

define(function (require) {

    var customElement = require('customElement').create();

    /**
     * 构造元素，只会运行一次
     */
    customElement.prototype.build = function () {
        console.log('Hello World!');
        console.log('Hello 2017!');
    };

    return customElement;
});
