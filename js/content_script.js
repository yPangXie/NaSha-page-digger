/* 获取页面数据 */
(function() {
    var faviconLink = document.querySelectorAll('link[rel="shortcut icon"]')[0]
                    || document.querySelectorAll('link[rel="short icon"]')[0]
                    || document.querySelectorAll('link[rel="apple-touch-icon"]')[0];
    var faviconMeta = document.querySelectorAll('meta[itemprop="image"]')[0];
    var descriptionMeta = document.querySelectorAll('meta[name="description"]')[0];
    var keywordsMeta = document.querySelectorAll('meta[name="keywords"]')[0];
    var titleElem = document.querySelectorAll('title')[0];
    var favicon = faviconLink ? faviconLink.getAttribute('href') : (faviconMeta ? faviconMeta.getAttribute('content') : '');
    var url = window.location.href || '';

    /* 仅记录三种类型的页面数据. 其他的都无视. */
    if(!/^(https|http)/g.test(url)) return false;

    return {
        favicon: favicon,
        url: url,
        title: titleElem ? titleElem.innerHTML : '',
        description: descriptionMeta ? descriptionMeta.getAttribute('content') : '',
        keywords: keywordsMeta ? keywordsMeta.getAttribute('content') : ''
    };
})();
