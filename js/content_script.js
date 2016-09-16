"use strict";

/* 获取页面数据 */
(function() {
    let faviconMeta = document.querySelector('meta[itemprop="image"]');
    let faviconLink = document.querySelector('link[rel="shortcut icon"]')
                    || document.querySelector('link[rel="short icon"]')
                    || document.querySelector('link[rel="icon"]')
                    || document.querySelector('link[rel="apple-touch-icon"]')
                    || document.querySelector('link[rel="apple-touch-icon image_src"]');
    let descriptionMeta = document.querySelector('meta[name="description"]')
                    || document.querySelector('meta[name="twitter:description"]')
                    || document.querySelector('meta[property="og:description"]');
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    let titleElem = document.querySelector('title');
    let url = window.location.href || '';
    let host = window.location.host || '';
    let protocol = window.location.protocol || 'http:';
    let favicon = faviconLink ? faviconLink.getAttribute('href') : (faviconMeta ? faviconMeta.getAttribute('content') : `${protocol}//${host}/favicon.ico`);

    /* 仅记录三种类型的页面数据. 其他的都无视. */
    if(!/^(https|http)/g.test(url)) return false;

    return {
        "host": window.location.host,
        "favicon": favicon,
        "url": url,
        "title": (titleElem ? titleElem.innerHTML : '').replace(/%/g, '%25'),
        "description": (descriptionMeta ? descriptionMeta.getAttribute('content') : '').replace(/%/g, '%25'),
        "keywords": keywordsMeta ? keywordsMeta.getAttribute('content') : ''
    };
})();
