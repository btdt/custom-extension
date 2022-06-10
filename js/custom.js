window.addEventListener('load', () => {
    const favoriteList = document.querySelectorAll('.jenkins-table span.icon-fav-active');
    favoriteList.forEach(item => {
        item.offsetParent.parentNode.style.backgroundColor = '#44ccff';
    });
});
