function loadScript(script) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(script);
    document.head.appendChild(scriptEl);
}

loadScript('scripts/localstoragedb.min.js');

$(window).scroll(bindScroll);
function bindScroll(){
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    parseItems();
  }
}

var db;
var parser;

$('document').ready(function(){
  var right = $('.rightColumnWrapper');
  console.log(right)
  var html = '<div id="manipulator"><h6 class="uiHeaderTitle">FB Mood Manipulator</h6>';
  html += '<div class="subtitle">How would you like to feel?</div>';
  html += '<div>Positive <input type="range" name="posemo" min="-1" max="1" step="1"></div>';
  html += '<div>Negative <input type="range" name="posemo" min="-1" max="1" step="1"></div>';
  html += '<div>Aggressive <input type="range" name="posemo" min="-1" max="1" step="1"></div>';
  html += '<div>Empathetic <input type="range" name="posemo" min="-1" max="1" step="1"></div>';
  html += '</div>'
  $(right[0]).prepend(html);
  db = new localStorageDB('db', localStorage);
  parser = Parser(db);
  parser.initialize();

  parseItems();
});

function parseItems() {
  var items = $('.userContentWrapper p');
  for (var i=0; i<items.length; i++) {
    if (!$(items[i]).hasClass('checked')) {
      var txt = items[i].innerText;
      if (txt) {
        var traits = parser.parseItem(txt);
        console.log(traits);
        filter(items[i], traits);
      }
    }
  }
}

function filter(item, traits) {
  $(item).addClass('checked');
  if (traits.posemo > 0) {
    $(item).hide();
  }
}
