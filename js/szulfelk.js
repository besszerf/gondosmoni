(function () {

  var hunMonths = [
    'január',
    'február',
    'március',
    'április',
    'május',
    'június',
    'július',
    'augusztus',
    'szeptember',
    'október',
    'november',
    'december',
  ];

  function isValidDate(dateObj) {
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    return true;
  }

  function getHunDate(program) {
    var retValue = program.mikor;
    var pDate = new Date(retValue);
    if (isValidDate(pDate)) {
      retValue = pDate.getFullYear() + '. ';
      retValue += hunMonths[pDate.getMonth()] + ' ';
      retValue += pDate.getDate() + '.';
    }

    retValue += ' ' + program.ido;
    return retValue;
  }

  function isPosDatumCheck(stringDate) {
    var pDate = new Date(stringDate);
    if (isValidDate(pDate)) {
      var today = new Date();
      return pDate.getTime() > today.getTime();
    }

    return false;
  }

  function addClass(element, name) {
    var arr = element.className.split(' ');
    if (arr.indexOf(name) == -1) {
      element.className += ' ' + name;
    }
  }

  function getPrograms() {
    var pParas = document.getElementsByClassName('csb')[0].getElementsByTagName('p');
    var programs = [];
    for (i = 0; i < pParas.length; i++) {
      programs.push(Object.create(null));
      var rawTime = pParas[i].getElementsByClassName('csb-data')[0].innerHTML.trim();
      var timeArr = rawTime.split(' ');
      var ido = rawTime.replace(timeArr[0] + ' ', '');
      programs[i].mikor = timeArr[0];
      programs[i].ido = ido;
      programs[i].hol = pParas[i].getElementsByClassName('csb-data')[1].innerHTML;
      programs[i].para = pParas[i];
    }

    return programs;
  }

  function jump(node) {
    var prog = node.parentNode.parentNode.getElementsByTagName('h3')[0].innerHTML;
    var data = node.parentNode.getElementsByClassName('csb-data');
    var url = './kapcsolat.html?prog=' + prog + '&dat=' + data[0].innerHTML + '&loc=';
    url += data[1].innerHTML + '#contactform';
    window.location.href = encodeURI(url);
  }

  function createSignup(program) {
    var isCreateSignUp = isPosDatumCheck(program.mikor) ? true : false;
    if (isCreateSignUp) {
      var span = document.createElement('span');
      addClass(span, 'signup');
      var text = document.createTextNode('Jelentkezem!');
      span.appendChild(text);
      var brElem = program.para.getElementsByTagName('br')[0];
      program.para.insertBefore(span, brElem);
      span.addEventListener('click', jump.bind(this, span));
    }

  }

  function addSpan(program) {
    program.para.getElementsByClassName('csb-data')[0].innerHTML = getHunDate(program);
    createSignup(program);
  }

  getPrograms().forEach(addSpan);
})();
