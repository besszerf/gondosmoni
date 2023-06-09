    //toggle cookie-warning-content
    function toggleGDPR(id) {
      var x = document.getElementById(id);
      if (x.className.indexOf("av-hide") !== -1) {
        x.className = x.className.replace(" av-hide", "");
        //console.log(x.className);
      } else {
        x.className += " av-hide";
      }
    }

    function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function createPPBanner() {
      var text = `<div id="warn-cookies" onclick="toggleGDPR('cookie-warning-content')"></div>
        <div class="center"><span id="GDPR">Kizárólag az Ön által megadott személyes adatait kezeljük.
          Az adatvédelmi szabályzat elfogadását sütiben rögzítjük.
          <a href="./adatvedelem.html">Adatvédelmi szabályzat</a></span>
            <p><a class="av-button av-theme av-hover-white" href="javascript:void(0);" onclick="acceptCookies()">Elfogadom</a></p>
        </div>`;
      var elem = document.querySelector('#cookie-warning-content');
      if (elem) {
        elem.innerHTML = text;
      }
    }

    function checkCookies() {
      createPPBanner();
      let cookiesAccepted = false;
      //check cookies
      var c = getCookie('PrivacyPolicy');
      if (c === 'accepted') cookiesAccepted = true;
      //console.log(`Get cookie: ${c}`);
      if (!cookiesAccepted)
        document.getElementById('warn-cookies').click();
    }

    // saving cookie
    function acceptCookies() {
      //save cookie
      var d = new Date();
      d.setTime(d.getTime() + (5 * 365 * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      var c = "PrivacyPolicy=accepted" + ";" + expires + ";path=/";
      document.cookie = c;
      //console.log(`Set cookie: ${c}`);
      document.getElementById('warn-cookies').click();
    }
(function () {

  var pagesData = {};
  window.addEventListener('load', function () {

    pagesData.menuLists = [];
    var siteMenu = document.getElementById('menu');
    if (siteMenu) {
      pagesData.menuLists = Array.prototype.slice.call(
        siteMenu.getElementsByTagName('li'));
  
      pagesData.navDiv = document.getElementById('nav');
  
      // Window resize esetén mindenképp jelenjen meg a menü
      window.addEventListener('resize', function () {
        pagesData.navDiv.style.display = 'block';
      }, false);
  
      // Kis méret esetén a menü gomb működtetése //
      var menuButton = document.querySelector('.headBut');
      menuButton.addEventListener('click', function () {
        pagesData.navDiv.style.display = (pagesData.navDiv.style.display == 'none') ?
          'block' :
          'none';
      }, false);
  
      // Kis méret esetén becsukni a menüt
      if (window.matchMedia("(max-width: 600px)").matches) {
        pagesData.navDiv.style.display = 'none';
      }
  
      // Menu <li> -kre addEventListener (click) - aktiválja a <a href=...> hyperlinket//
      var menuAkt = [];
      for (i = 0; i < pagesData.menuLists.length; i++) {
        menuAkt[i] = function (_i) {
          return function () {
            pagesData.menuLists[_i].getElementsByTagName('a')[0].click();
          };
        }(i);
        pagesData.menuLists[i].addEventListener('click', menuAkt[i], false); // Az i jelzi, hogy melyik menügomb
      }       
    }
        /** GDPR */
    checkCookies();
  }, false); // window addEventlistener('load')
})();
