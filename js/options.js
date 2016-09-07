"use strict";

const STORAGE = chrome.storage.sync;

STORAGE.get({
    blackList: ""
}, result => {
    if(document.querySelector('[data-role="black-list"]')) document.querySelector('[data-role="black-list"]').value = result.blackList || '';
});

/* 保存数据 */
if(document.querySelector('[data-role="save-black-list"]')) {
    document.querySelector('[data-role="save-black-list"]').addEventListener('click', () => {
        let blackListData = document.querySelector('[data-role="black-list"]').value;
        STORAGE.set({
            blackList: blackListData || ''
        }, result => {
            alert('一般都是能顺利保存成功的.😎');
        });
    }, false);
}

/* 清空数据 */
if(document.querySelector('[data-role="clean-black-list"]')) {
    document.querySelector('[data-role="clean-black-list"]').addEventListener('click', () => {
        let confirmResult = confirm("确定清空了??? 清空可就什么都木有了🤔");
        if(!confirmResult) return false;

        STORAGE.clear(result => {
            document.querySelector('[data-role="black-list"]').value = '';
        });
    });
}
