(function (context) {
  function AjaxFunction(scope) {
    var xmlHttp;
    try {
      xmlHttp = new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari
    } catch (e) {
      try {
        // Internet Explorer
        xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        try {
          this.xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
          alert('A böngésződ nem támogatja az AJAX-ot! Töltsd le a legújabb' + " 'Google Chrome'-ot, vagy 'Mozilla Firefox'-ot!");
          return false;
        }
      }
    }

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        let output = xmlHttp.responseText;
        if (output.includes("include('class.EmailAddressValidator.php')")) {
          output = '500: Szerver error, kérem értesítsen facebookon keresztül, vagy telefonon. Köszönöm: Besszer Mónika';
          return scope.onError(output);
        }
        scope.onSuccess(output);
      } else if (xmlHttp.readyState == 4) {
        scope.onError(xmlHttp.status + ': ' + xmlHttp.statusText);
      }
    };

    xmlHttp.onerror = function () {
      scope.onError(xmlHttp.status + ': ' + xmlHttp.statusText);
    };

    this.send = function () {
      // open ('GET'/'POST', szerver_oldali_script, aszinkron feldolgozás(true/false))
      xmlHttp.open(scope.method, scope.reqFile, true);
      if (scope.method == 'POST') {
        //header beállítása a form miatt
        xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }

      xmlHttp.send(scope.message);
    };
  }

  function Email(cf) {
    this.contactform = cf;
    // Kapcsolati űrlap ellenőrzése
    this.emptyCheck = function (fieldName, message) {
      //name
      if (this.contactform[fieldName].value != '') {
        document.getElementById('hibauz').style.display = 'inline';
        document.getElementById('hibauz').innerHTML = '';
        return true;
      }
      document.getElementById('hibauz').style.color = 'red';
      document.getElementById('hibauz').style.display = 'inline';
      document.getElementById('hibauz').innerHTML = message;
      document.getElementById(fieldName).focus();
      return false;
    };

    this.emailCheck = function (field) {
      var text = field.value;
      if (!/^\w+([\+.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
        document.getElementById('hibauz').style.color = 'red';
        document.getElementById('hibauz').style.display = 'inline';
        document.getElementById('hibauz').innerHTML = 'HIBA: Rossz e-mail cím!';
        document.getElementById('email').focus();
        return false;
      }
      return true;
    };

    this.context = {
      method: 'POST',
      reqFile: 'cgi-bin/mailer/email.php',
      message:
        'name=' +
        encodeURIComponent(this.contactform.name.value) + // küldő neve
        '&email=' +
        encodeURIComponent(this.contactform.email.value) + // küldő címe
        '&message=' +
        encodeURIComponent(this.contactform.message.value) +
        '&g-recaptcha-response=' +
        encodeURIComponent(this.contactform['g-recaptcha-response'].value),
      onSuccess: function (message) {
        document.getElementById('hibauz').style.color = '#7A991A';
        document.getElementById('hibauz').style.display = 'inline';
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        document.getElementById('hibauz').innerHTML = message;
      },
      onError: function (message) {
        document.getElementById('hibauz').style.color = 'red';
        document.getElementById('hibauz').style.display = 'inline';
        document.getElementById('hibauz').style.width = '150px;';
        document.getElementById('hibauz').innerHTML = message;
      },
    };

    this.ajax = new AjaxFunction(this.context);
    this.send = function () {
      //        console.log('Email is sent.')
      this.ajax.send();
    };
  }

  function send() {
    var cf = document.contactform;
    var email = new Email(cf);
    document.getElementById('hibauz').style.display = 'none';
    if (email.emptyCheck('name', 'HIBA: Adja meg a nevét!') && email.emailCheck(cf.email) && email.emptyCheck('message', 'HIBA: Írjon üzenetet')) {
      email.send();
    }
    return false;
  }

  /* Get the query string from the url */
  function getQueryStringValue(key) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'),
        '$1'
      )
    );
  }

  function addText() {
    var prog = getQueryStringValue('prog');
    var dat = getQueryStringValue('dat');
    var loc = getQueryStringValue('loc');
    if (dat.length != 0 && loc.length != 0) {
      var text = 'Kedves Móni!\n\n Jelentkezek az alábbi programra:\n' + prog + '\nDátum: ' + dat + '\nhely: ' + loc + '\n';
      document.getElementById('message').value = text;
    }
  }

  addText();
  context.send = send;
})(context || {});
