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
}, function (foundTabs) {
    if (foundTabs.length == 0) return false;
    chrome.tabs.executeScript(null, {
        file: "js/content_script.js"
    }, function(data) {
        fetch("http://bigyoo.me/ns/cmd", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: `type=read&action=store&page=${data && data[0] || {}}`
        }).then(function(res) {
            return res.json();
        }).then(function(data) {
            $('[data-role="loading"]').hide();
            data.success ? $('[data-role="success"]').show() : $('[data-role="failed"]').html(data.message).show();
        }).catch(function(err) {
            $('[data-role="loading"]').hide();
            $('[data-role="failed"]').show();
        });
    });
});
