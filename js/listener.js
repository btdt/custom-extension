chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.menuItemId === 'highlight') {
        cancelHighlight(document.body);
        document.normalize();
        highlight(document.body, request.selectionText);
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
    } else if (request.menuItemId === 'pascal-to-kebab') {
        setTimeout(() => {
            const node = document.getSelection().focusNode;
            const reg = new RegExp(request.selectionText);
            if (node.nodeType !== 3) {
                node.querySelector('input').value.replace(reg, pascalToKebab(request.selectionText));
            } else {
                node.data = node.data.replace(reg, pascalToKebab(request.selectionText));
            }
        }, 200);
    } else if (request.menuItemId === 'kebab-to-pascal') {
        const node = document.getSelection().focusNode;
        const reg = new RegExp(request.selectionText);
        if (node.nodeType !== 3) {
            node.querySelector('input').value.replace(reg, kebabToPascal(request.selectionText));
        } else {
            node.data = node.data.replace(reg, kebabToPascal(request.selectionText));
        }
    } else if (request.menuItemId === 'top') {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    } else if (request.menuItemId === 'hex') {
        fetch(request.srcUrl)
            .then(res => {
                res.blob().then(file => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const arr = new Uint8Array(reader.result);
                        console.log(arr);
                        sendResponse({ type: 'hex', message: '请打开控制台查看' });
                    };
                    reader.readAsArrayBuffer(file);
                });
            })
            .catch(err => {
                sendResponse({ type: 'hex', message: err });
            });
    } else if (request.menuItemId === 'translate') {
        window.open(`https://www.deepl.com/translator#en/zh/${request.selectionText}`);
    }
    return true;
});

window.addEventListener('keypress', e => {
    if (e.code === 'KeyQ' && e.ctrlKey && !e.shiftKey) {
        const text = getSelection().toString();
        cancelHighlight(document.body);
        document.normalize();
        if (text) highlight(document.body, text);
    }
});
