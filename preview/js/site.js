/* Page transition loader logic (added) */
(function () {
    var loader = document.getElementById('kt-page-loader');
    if (!loader) return;

    function hideLoader() { loader.classList.add('kt-loader-hidden'); }
    function showLoader() { loader.classList.remove('kt-loader-hidden'); }

    // Hide once this page has fully loaded, including back/forward cache restores.
    window.addEventListener('load', hideLoader);
    window.addEventListener('pageshow', function (e) { if (e.persisted) hideLoader(); });

    // Show it again right before leaving for another page.
    document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        if (link.target && link.target !== '' && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        showLoader();
    }, true);

    window.addEventListener('beforeunload', showLoader);
})();
