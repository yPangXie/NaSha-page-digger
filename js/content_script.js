"use strict";

/* 获取页面数据 */
(function() {
    let faviconLink = document.querySelector('link[rel="shortcut icon"]')
                    || document.querySelector('link[rel="short icon"]')
                    || document.querySelector('link[rel="apple-touch-icon"]')
                    || document.querySelector('link[rel="apple-touch-icon image_src"]');
    let faviconMeta = document.querySelector('meta[itemprop="image"]');
    let descriptionMeta = document.querySelector('meta[name="description"]')
                    || document.querySelector('meta[name="twitter:description"]');
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    let titleElem = document.querySelector('title');
    let favicon = faviconLink ? faviconLink.getAttribute('href') : (faviconMeta ? faviconMeta.getAttribute('content') : '');
    let url = window.location.href || '';

    /* 仅记录三种类型的页面数据. 其他的都无视. */
    if(!/^(https|http)/g.test(url)) return false;

    return {
        "favicon": favicon,
        "url": url,
        "title": titleElem ? titleElem.innerHTML : '',
        "description": descriptionMeta ? descriptionMeta.getAttribute('content') : '',
        "keywords": keywordsMeta ? keywordsMeta.getAttribute('content') : ''
    };
})();
