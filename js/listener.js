chrome.runtime.onMessage.addListener((request, sender, sendResponse = function () {}) => {
    console.log(request);
    const text = request?.selectionText || getSelection().toString();
    if (request.menuItemId === 'highlight') {
        cancelHighlight(document.body);
        document.normalize();
        highlight(document.body, text, Boolean(request?.matchCase));
        sendResponse({ type: 'highlight', visible: true });
    } else if (request.menuItemId === 'cancel-highlight') {
        cancelHighlight(document.body);
        document.normalize();
        sendResponse({ type: 'highlight', visible: false });
    } else if (request.menuItemId === 'uuid') {
        const uuid = getUUID();
        console.log(uuid);
        copy(uuid)
            .then(res => {
                sendResponse({ type: 'uuid', message: `【${res}】已复制到剪贴板` });
            })
            .catch(err => {
                sendResponse({ type: 'uuid', message: err });
            });
    } else if (request.menuItemId === 'color-picker') {
        if ('EyeDropper' in window) {
            const eyeDropper = new window.EyeDropper();
            eyeDropper.open().then(res => {
                copy(res.sRGBHex)
                    .then(res => {
                        sendResponse({ type: 'color-picker', message: `【${res}】已复制到剪贴板` });
                    })
                    .catch(err => {
                        sendResponse({ type: 'color-picker', message: err });
                    });
            });
        }
    } else if (request.menuItemId === 'translate') {
        window.open(`https://www.deepl.com/translator#en/zh/${text}`);
    } else if (request.menuItemId === 'top') {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
    return true;
});
