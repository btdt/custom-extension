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

/**
 * 高亮关键词
 * @param {HTMLElement} node HTML 节点
 * @param {String} keyword 关键词
 * @param {Boolean} matchCase 区分大小写
 */
function highlight(node = document?.body || {}, keyword = '', matchCase = false) {
    const mode = matchCase ? 'g' : 'gi';
    const reg = new RegExp(String(keyword).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), mode);
    if (node.nodeType === 3) {
        const match = node.data.match(new RegExp(reg));
        if (match) {
            console.log(reg, node.data, match);
            const result = node.data
                .replace(/\</g, '&lt;')
                .replace(/\>/g, '&gt;')
                .replace(/\&/g, '&amp;')
                .replace(/\'/g, '&#x27;')
                .replace(/\"/g, '&quot;')
                .replace(/\`/g, '&#x60;')
                .replace(reg, '<span data-highlight="custom">$&</span>');
            const resultElement = document.createRange().createContextualFragment(result);
            node.parentNode.replaceChild(resultElement, node);
        }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.dataset.highlight !== 'custom') {
        node.childNodes.forEach(item => {
            highlight(item, keyword, matchCase);
        });
    }
}

/**
 * 取消关键词高亮
 * @param {HTMLElement} node HTML节点
 */
function cancelHighlight(node = document?.body || {}) {
    if (node.nodeType === 1) {
        if (node.dataset.highlight === 'custom') {
            const resultElement = document.createTextNode(node.innerText);
            const parentNode = node.parentNode;
            parentNode.replaceChild(resultElement, node);
        }
        node.childNodes.forEach(item => {
            cancelHighlight(item);
        });
    }
}

/**
 * 消息通知
 * @param {String} message 消息内容
 * @param {Number} timeout 持续时间
 */
function notice(message, timeout = 3000) {
    if (!('Notification' in window) || Notification.permission === 'denied') {
        alert(message);
    } else if (Notification.permission === 'granted') {
        const notification = new Notification(message);
        setTimeout(() => {
            notification.close();
        }, timeout);
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const notification = new Notification(message);
                setTimeout(() => {
                    notification.close();
                }, timeout);
            } else {
                alert(message);
            }
        });
    }
}

/**
 * 复制字符串
 * @param {String} text 复制的字符串
 * @returns {Promise<String>}
 */
function copy(text) {
    return new Promise((resolve, reject) => {
        navigator?.clipboard?.writeText(text).then(
            () => {
                console.log(`copy \x1b[94m${text}\x1b[0m success`);
                resolve(text);
            },
            err => {
                console.error(err);
                try {
                    const input = document.createElement('input');
                    input.value = text;
                    input.style.display = 'hidden';
                    document.body.appendChild(input);
                    input.select();
                    document?.execCommand('copy');
                    document.body.removeChild(input);
                    resolve(text);
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        );
    });
}
