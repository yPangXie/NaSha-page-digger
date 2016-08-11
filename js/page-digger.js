// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

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
    }, data => {
        fetch("http://bigyoo.me/ns/cmd", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `type=read&action=store&page=${JSON.stringify(data && data[0] || {})}`
        }).then(res => {
            return res.json();
        }).then(data => {
            document.querySelectorAll('[data-role="loading"]')[0].style.display = 'none';

            if(data.success) {
                document.querySelectorAll('[data-role="success"]')[0].style.display = 'block';
            } else {
                var failedEleme = document.querySelectorAll('[data-role="failed"]')[0];
                failedEleme.innerHTML = data.message;
                failedEleme.style.display = 'block';
            }
        }).catch(err => {
            document.querySelectorAll('[data-role="loading"]')[0].style.display = 'none';
            document.querySelectorAll('[data-role="failed"]')[0].style.display = 'block';
        });
    });
});
