// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

const REQUEST_URL = 'http://ns.bigyoo.me/cmd';

/* 获取当前tab信息 */
chrome.tabs && chrome.tabs.query({
    // 当前焦点所在的页面
    currentWindow: true,
    // 选中的tab
    active: true
}, foundTabs => {
    if (foundTabs.length == 0) return false;
    chrome.tabs.executeScript(null, {
        file: "js/content_script.js"
    }, contentRes => {
        let pageData = contentRes ? contentRes[0] : {};
        let loadingNode = document.querySelector('[data-role="loading"]');
        let warningNode = document.querySelector('[data-role="warning"]');
        let failedNode = document.querySelector('[data-role="failed"]');
        let successNode = document.querySelector('[data-role="success"]')
        let removeAtricleNode = document.querySelector('[data-role="remove-article"]');

        chrome.storage.sync.get({
            "blackList": ""
        }, storage => {
            if(!pageData
                || !pageData.url
                || storage.blackList.replace(/(\r\z\s)/g, '').split('\n').indexOf(pageData.host) != -1) {
                loadingNode.style.display = 'none';
                warningNode.style.display = 'none';
                failedNode.style.display = 'block';

                return false;
            }
            delete pageData.host;

            fetch(REQUEST_URL, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `type=read&action=store&page=${encodeURIComponent(JSON.stringify(pageData))}`
            }).then(res => {
                return res.json();
            }).then(data => {
                loadingNode.style.display = 'none';

                if(data.success) {
                    successNode.style.display = 'block';
                } else {
                    var errorElem = failedNode;
                    var messageElem = failedNode;
                    if(data.type == 'duplicate') {
                        messageElem = warningNode.querySelector('span');
                        errorElem = warningNode;
                        removeAtricleNode.setAttribute('data-objectid', data.id);
                    }

                    messageElem.innerHTML = data.message;
                    errorElem.style.display = 'block';
                }
            }).catch(err => {
                loadingNode.style.display = 'none';
                failedNode.style.display = 'block';
            });
        });

        /* 干掉当前保存的数据 */
        document.querySelector('[data-role="remove-article"]').addEventListener('click', evt => {
            let id = evt.target.getAttribute('data-objectid') || '';
            if(!id) return false;

            fetch(REQUEST_URL, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `type=read&action=remove&id=${id}`
            }).then(res => {
                return res.json();
            }).then(data => {
                if(data.objectId) window.close();
                else {
                    failedNode.innerHTML = '删除当前文章失败, 再试试.';
                    failedNode.style.display = 'block';
                }
            });
        }, false);
    });
});
