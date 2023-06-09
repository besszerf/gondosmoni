var changeOnce = function () {
    var elem = document.querySelector('.changeit');
    if (elem) {
        elem.innerHTML = elem.innerHTML.replace('[kukac]', '@');
    }
}

window.addEventListener('load', changeOnce);
