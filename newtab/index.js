window.addEventListener('load', () => {
    chrome.bookmarks.getTree(tree => {
        console.log(tree);
        const container = document.getElementById('list');
        const listElements = [];
        // const list = localStorage.getItem('list') || buildList(tree, []);
        // list.splice(20);
        const list = [
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'medium'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'medium'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'large'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'wide'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'medium'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'wide'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'medium'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            },
            {
                title: 'about:blank',
                url: 'about:blank',
                size: 'small'
            }
        ];
        list.forEach(item => {
            const $item = document.createElement('a');
            const $child = document.createElement('div');
            const $icon = document.createElement('div');
            const $title = document.createElement('div');
            $item.classList.add('item');
            // $item.classList.add(['small', 'medium', 'large'][Math.floor(Math.random() * 3)]);
            $item.classList.add(item.size);
            $item.title = item.title;
            $child.classList.add('box');
            $icon.classList.add('icon');
            $title.classList.add('title');
            $title.innerText = item.title;
            $child.append($icon, $title);
            $item.appendChild($child);
            $item.href = item.url;
            $item.target = '_self';
            listElements.push($item);
        });
        container.append(...listElements);
    });
});

document.getElementById('keyword').addEventListener('focus', function () {
    this.placeholder = '';
});
document.getElementById('keyword').addEventListener('blur', function () {
    this.placeholder = '搜索网页';
});

function buildList(list = [], iterator = []) {
    list.map(item => {
        if (item.url) {
            iterator.push(item);
        } else if (item.children) {
            buildList(item.children, iterator);
        }
    });
    return iterator;
}
