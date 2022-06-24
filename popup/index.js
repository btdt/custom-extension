window.addEventListener('load', async () => {
    const inputElement = document.getElementById('keyword');
    inputElement.focus();
    const tab = await getCurrentTab();
    console.log(tab);
    const keyword = localStorage.getItem(`keyword[${tab.id}]`);
    if (keyword) inputElement.value = keyword;
    const matchCase = localStorage.getItem('match-case');
    const matchCaseElement = document.getElementById('match-case');
    Number(matchCase) && matchCaseElement.classList.add('active');
    callHighlight();
});

document.getElementById('keyword').addEventListener('input', async function () {
    const tab = await getCurrentTab();
    localStorage.setItem(`keyword[${tab.id}]`, this.value);
    callHighlight();
});

document.getElementById('keyword').addEventListener('keypress', e => {
    if (e.code === 'Enter') callHighlight();
});

document.getElementById('match-case').addEventListener('click', () => {
    switchMatchCase();
});

document.getElementById('match-case').addEventListener('keypress', e => {
    if (['Enter', 'Space'].includes(e.code)) switchMatchCase();
});

function getCurrentTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            resolve(tabs[0]);
        });
    });
}

async function callHighlight() {
    const tab = await getCurrentTab();
    const keyword = localStorage.getItem(`keyword[${tab.id}]`);
    if (!keyword) return;
    const info = {
        menuItemId: 'highlight',
        selectionText: keyword,
        matchCase: Boolean(Number(localStorage.getItem('match-case')))
    };
    chrome.tabs.sendMessage(tab?.id, info);
}

function switchMatchCase() {
    const matchCase = localStorage.getItem('match-case');
    localStorage.setItem('match-case', Number(matchCase) ? 0 : 1);
    const matchCaseElement = document.getElementById('match-case');
    matchCaseElement.classList.toggle('active');
    callHighlight();
}
