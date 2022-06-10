// document.onload = function () {
//     console.log(chrome);
//     const list = document.getElementsByClassName('item');
//     console.log(list);
//     list.forEach(item => {
//         item.onclick = function () {
//             const info = {
//                 menuItemId: item.dataset.id
//             };
//             chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//                 const tab = tabs[0];
//                 chrome.tabs.sendMessage(tab?.id, info, messageCallback);
//             });
//         };
//     });
// };

// chrome.runtime.onConnectExternal.addListener(port => {
//     port.onMessage.addListener(message => {
//         notice(message);
//     });
// });
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     notice(request);
//     sendResponse(request);
// });
