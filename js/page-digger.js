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
        chrome.storage.sync.get({
            "blackList": ""
        }, storage => {
            let pageData = contentRes ? contentRes[0] : {};
            if(!pageData
                || !pageData.url
                || storage.blackList.replace(/(\r\z\s)/g, '').split('\n').indexOf(pageData.host) != -1) {
                document.querySelector('[data-role="loading"]').style.display = 'none';
                document.querySelector('[data-role="failed"]').style.display = 'block';

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
                document.querySelector('[data-role="loading"]').style.display = 'none';

                if(data.success) {
                    document.querySelector('[data-role="success"]').style.display = 'block';
                } else {
                    let failedEleme = document.querySelector('[data-role="failed"]');
                    failedEleme.innerHTML = data.message;
                    failedEleme.style.display = 'block';
                }
            }).catch(err => {
                document.querySelector('[data-role="loading"]').style.display = 'none';
                document.querySelector('[data-role="failed"]').style.display = 'block';
            });
        });
    });
});
