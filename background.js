// contextMenus
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: 'highlight',
    title: '高亮 %s',
    contexts: ['selection'],
    visible: true
});
chrome.contextMenus.create({
    id: 'cancel-highlight',
    title: '取消高亮',
    contexts: ['all'],
    visible: false
});
chrome.contextMenus.create({
    id: 'color-picker',
    title: '选取颜色',
    contexts: ['all']
});
chrome.contextMenus.create({
    id: 'translate',
    title: '翻译 %s',
    contexts: ['selection']
});
chrome.contextMenus.create({
    id: 'edit',
    title: '编辑页面',
    contexts: ['all']
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, info, messageCallback);
});
// omnibox
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    const list = [];
    list.push(
        ...[
            {
                content: `highlight ${text}`,
                description: `高亮 ${text}`
            },
            {
                content: 'cancel-highlight',
                description: '取消高亮'
            },
            {
                content: `translate ${text}`,
                description: `翻译 ${text}`
            }
        ]
    );
    suggest(list);
});
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    const textSplit = text.split(' ');
    const info = {
        menuItemId: textSplit[0],
        selectionText: text.substring(textSplit[0].length + 1)
    };
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab?.id, info, messageCallback);
    });
});
chrome.commands.onCommand.addListener(function (command) {
    console.log('command', command);
    const info = {
        menuItemId: command
    };
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab?.id, info, messageCallback);
    });
});
function messageCallback(response) {
    if (response?.type === 'highlight') {
        chrome.contextMenus.update('cancel-highlight', { visible: response.visible });
    }
    if (response?.message) {
        const uuid = getUUID();
        chrome.notifications.create(uuid, {
            type: 'basic',
            message: response.message,
            title: '',
            iconUrl: chrome.runtime.getURL('notification.png')
        });
        setTimeout(() => {
            chrome.notifications.clear(uuid);
        }, 5000);
    }
}
/**
 * 生成 UUID
 * @returns {string} uuid
 */
function getUUID() {
    if (!crypto) {
        console.warn('getUUID(): not support crypto');
        const url = URL.createObjectURL(new Blob([]));
        const delimiter = window ? '/' : ':';
        const uuid = url.slice(url.lastIndexOf(delimiter));
        URL.revokeObjectURL(url);
        return uuid;
    }
    const getRandomValues = function () {
        if (typeof crypto?.getRandomValues === 'function') {
            return crypto.getRandomValues(...arguments);
        } else if (typeof crypto?.webcrypto?.getRandomValues === 'function') {
            return crypto.webcrypto.getRandomValues(...arguments);
        }
    };
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, i =>
        (i ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (i / 4)))).toString(16)
    );
}
