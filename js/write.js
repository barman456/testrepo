var req;
var words = [];
var checked = [];

function updateViewBox() {
  var fm = document.getElementById('fm');
  var html = '';
  var defText = '[Your message will appear here]';
  if(fm) {
    var text = fm.writebox.value;
    if (!window.lang) {
        var ob = document.getElementById('viewbox');
        if (ob) {
            var safeText = defText;
            if (text != '') {
                safeText = text;
                safeText = safeText.replace(/</g,'&lt;');
                safeText = safeText.replace(/>/g,'&gt;');
                safeText = safeText.replace(/\n/g,'<br />\n');
            }
            ob.innerHTML = safeText;
        }
        return;
    }
    var out = new Array();
    var ch = '';
    var ch2 = '';
    var ch3 = '';
    var i;
    var nextwordstart = 0;
    var nextword = '';
    var textleft = text;
    var lastch = '';
    for(i = 0; i < text.length;i++) {
      textleft = text.substring(i);
      ch = text.charAt(i);
if(ch == '\r') {
  continue;
} else if(ch == '\n') {
  lastch = ch;
  out[out.length] = '<br />';
  continue;
}
      ch2 = '';
      ch3 = '';
      var ucode = '';
      var wordstart = nextwordstart;
      if(nextwordstart == i) {
        if(textleft.match(/^([a-zA-Z]+)/)) {
          nextword = RegExp.$1;
          if(words[nextword]) {
            ucode = words[nextword];
            nextwordstart = i + nextword.length;
            i += nextword.length - 1;
            lastch = '';
          } else {
            //if(!checked[nextword] && (nextword.length > 1)) {
            //  checkword(nextword);
            //}
            nextwordstart = i + nextword.length;
          }
        } else {
          var wordboundary = '';
          if(textleft.match(/^([^a-zA-Z]+)/)) {
            wordboundary = RegExp.$1;
          }
          nextwordstart += wordboundary.length ? wordboundary.length : 1;
        }
      }
      if(ucode == '') {
        if(i < text.length) {
          ch2 = ch + text.charAt(i+1);
          if(i < text.length-2) {
            ch3 = ch2 + text.charAt(i+2);
          }
        }
      
        var val = (((wordstart == i) || ivowels[lastch]) && ivowels[ch]) ? ivowels[ch] : (chars[ch] ? chars[ch] : chars[ch.toLowerCase()]);
        var val2 = (((wordstart == i) || ivowels[lastch]) && ivowels[ch2]) ? ivowels[ch2] : (specs[ch2] ? specs[ch2] : chars[ch2]);
        var val3 = (typeof chars[ch3] == 'string') ? chars[ch3] : '';
        var thech = val3 ? ch3 : (val2 ? ch2 : ch);
        var thechlen = thech.length;
        var theval = val3 ? val3 : (val2 ? val2 : val);
        if(chars[lastch] && !ivowels[lastch] && chars[thech] && !ivowels[thech] && !lastch.match(/\d/) && !specs[lastch] && !specs[thech] && !thech.match(/\d|M|H/)) {
          theval = halfchar+theval; // half the letter.
        }
        lastch = thech;
        if(theval) {
          ucode = theval;
          i += thech.length - 1;
        } else {
          code  = text.charCodeAt(i);
        }
      }
      if(ucode == '') {
        ucode = '&#'+code+';';
      }
      if(ucode == 'null') {
        ucode = '';
      }

      if(0 && ch == 'i') {
        if(i > 0) {
          var tmp = out[out.length-1];
          out[out.length-1] = ucode;
          ucode = tmp;
        }
      }
      out[out.length] = ucode;
    }
    var ob = document.getElementById('viewbox');
    if(ob) {
      for(i = 0;i< out.length;i++) {
        html += out[i];
      }
      if (text == '') {
        html = defText;
      }
      ob.innerHTML = html;
    }
  }
  return html;
}

function focusBox() {
  var fm = document.getElementById('fm');
  if(fm) {
    var hash = ''+document.location.hash;
    if(hash == '') {
      fm.writebox.focus();
    }
  }
}

function copyText() {
  var ta = document.createElement('textarea');
  var fm = document.getElementById('fm');
  var viewbox = document.getElementById('viewbox');
  if(viewbox) {
    ta.innerHTML = viewbox.innerHTML;
    var tempval=fm.viewbox;
    var len = String(viewbox.innerHTML).length;
    if(len > 0) {
      ta.focus();
      ta.select();
      therange=ta.createTextRange();
      therange.execCommand("Copy");
    } else {
      alert('No text to copy.');
    }
  }
}

function checkWord(word) {
  var rnd = Math.random();
  var url = '/scripts/checkword.php?lang='+escape(lang)+'&word='+escape(word)+'&rnd='+rnd;
  loadXmlDoc(url);
}

function updateWords() {
    var items = req.responseXML.getElementsByTagName('word');
    var i;
    for(i = 0; i < items.length;i++) {
      var word = getElementTextNS("","text",items[i],0);
      var unicode = getElementTextNS("","unicode",items[i],0);
      checked[word] = 1;
      if(unicode) {
        words[word] = unicode;
      }
    }
    updateViewBox();
}

function loadXmlDoc(url) {
    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        req.onreadystatechange = processReqChange;
        req.open("GET", url, true);
        req.send(null);
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        isIE = true;
        req = new ActiveXObject("Microsoft.XMLHTTP");
        if (req) {
            req.onreadystatechange = processReqChange;
            req.open("GET", url, true);
            req.send();
        }
    }
}

// handle onreadystatechange event of req object
function processReqChange() {
    // only if req shows "loaded"
    if (req.readyState == 4) {
        // only if "OK"
        if (req.status == 200) {
          updateWords();
         } else {
            //alert("There was a problem retrieving the XML data:\n" +
                //req.statusText);
         }
    }
}

function getElementTextNS(prefix, local, parentElem, index) {
    var result = "";
    if (prefix && isIE) {
        // IE/Windows way of handling namespaces
        result = parentElem.getElementsByTagName(prefix + ":" + local)[index];
    } else {
        // the namespace versions of this method
        // (getElementsByTagNameNS()) operate
        // differently in Safari and Mozilla, but both
        // return value with just local name, provided
        // there aren't conflicts with non-namespace element
        // names
        result = parentElem.getElementsByTagName(local)[index];
    }
    if (result) {
        // get text, accounting for possible
        // whitespace (carriage return) text nodes
        if (result.childNodes.length > 1) {
            return result.childNodes[1].nodeValue;
        } else {
            if(result.firstChild) {
              return result.firstChild.nodeValue;
            } else {
              return '';
            }
        }
    } else {
        return "n/a";
    }
}

function validEmail(email) {
    var res = String(email).match(/^.+@.+$/) ? true : false;
    return res;
}

function checkForm(fm,mainFormId) {
  var err = '';
  fm.text.value = '';
  var msg = updateViewBox();
  var mainForm = document.getElementById(mainFormId);
  fm.msg.value = msg;
  if(mainForm) {
    if(mainForm.writebox) {
      fm.text.value = mainForm.writebox.value;
    }
  }

  if(!validEmail(fm.toemail.value)) {
    err = 'Please enter a valid address for the To field.';
  } else if(!validEmail(fm.fromemail.value)) {
    err = 'Please enter a valid email address for the From field.';
  } else if(fm.msg.value == "") {
    err = 'No message has been entered.';
  }
  if(err != '') {
    alert(err);
  }
  return (err == '');
}

function pfv() {
  var fm = document.getElementById('fm');
  var fm2 = document.getElementById('pf');
  if(fm && fm2) {
    if(fm.viewbox.value != '') {
      fm2.pfmsg.value = fm.viewbox.value;
      fm2.submit();
    } else {
      alert("Enter your message first.");
    }
  }
}

