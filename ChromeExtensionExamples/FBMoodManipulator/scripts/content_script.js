function loadScript(script) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(script);
    document.head.appendChild(scriptEl);
}

loadScript('scripts/localstoragedb.min.js');

var db;
var parser;
var goals = { 'posemo': 0, 'aggression': 0, 'we': 0};

$('document').ready(function(){
  var right = $('.rightColumnWrapper');
  var html = '<div id="manipulator"><div id="man_heading"><img src="'+chrome.extension.getURL('fb_happy.png')+'" />';
  html += '<h6 class="uiHeaderTitle">Mood Manipulator</h6></div>';
  html += '<div class="subtitle">How would you like to feel?</div>';
  html += '<div class="manip_settings"><table>';
  html += '<tr><td>Positive</td><td><input type="range" id="posemo" min="0" max="2" step="1"></td></tr>';
  html += '<tr><td>Aggressive</td><td><input type="range" id="aggression" min="0" max="2" step="1"></td></tr>';
  html += '<tr><td>Empathetic</td><td><input type="range" id="we" min="0" max="2" step="1"></td></tr>';
  html += '<tr><td>Vulnerable</td><td><input type="range" id="honesty" min="0" max="2" step="1"></td></tr>';
  html += '<tr><td></td><td><table style="width:100%;color: #9197a3;"><tr><td>less</td><td style="text-align:right;padding:0">more</td></table></td></tr>';
  html += '</table></div></div>';

  $(right[0]).prepend(html);
  db = new localStorageDB('db', localStorage);
  parser = Parser(db);
  parser.initialize();

  parseItems();

  $(window).scroll(bindScroll);
  function bindScroll(){
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      parseItems();
    }
  }

  $('input[type="range"]').change(function() {
    var t = $(this).attr('id');
    goals[t] = parseInt($(this).val(), 10);
    parseItems(true);
  });
});

function parseItems(reset) {
  if (reset) {
    $('.checked').removeClass('checked');
  }

  var items = $('.userContentWrapper p').append( $('.UFICommentBody') );
  for (var i=0; i<items.length; i++) {
    if (!$(items[i]).hasClass('checked')) {

      if (!$(items[i]).data('analyzed')) {
        var txt = items[i].innerText;
        if (txt) {
          var traits = parser.parseItem(txt);
          for (var t in traits) {
            $(items[i]).data(t, traits[t]);
          }
          filter(items[i], traits);
        }
      } else {
        filter(items[i], $(items[i]).data());
      }
    }
  }
}

function filter(item, traits) {
  //console.log('parse')
  $(item).data('analyzed', true);
  $(item).addClass('checked');
  var hidden = false;
  var parent = $(item).closest('div[data-referrer]');
  for (var g in goals) {
    if ((goals[g] < 2 && traits[g] > goals[g]) || traits[g] < goals[g]) {
      $(parent).hide();
      hidden = true;
      // console.log('hiding')
      // console.log($(item));
    } 
  }
  if (!hidden) {
    $(parent).show();
  }
}
