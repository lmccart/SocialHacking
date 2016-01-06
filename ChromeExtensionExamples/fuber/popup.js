/* Update the relevant fields with the new data */
function setDOMInfo(info) {
    document.getElementById('total').textContent   = info;
    document.getElementById('inputs').textContent  = info.inputs;
    document.getElementById('buttons').textContent = info.buttons;
}

var fuber = {}

/* Once the DOM is ready... */
$(document).ready(function() {

  $('#submit').click(function() {

    fuber.usr = randomString(30);
    fuber.pw = randomString(20);

    fuber.fname = $('input[name*="fname"]').val();
    fuber.phone = $('input[name*="phone"]').val();

    var lnames = loadStrings('last_names.txt');
    fuber.lname = getRandom(lnames);
    fuber.lname = fuber.lname.charAt(0)+fuber.lname.slice(1).toLowerCase();

    fuber.cc = {};
    fuber.cc.number = $('input[name*="cc_number"]').val();
    fuber.cc.exp_month = $('#cc_exp_month').val();
    fuber.cc.exp_year = $('#cc_exp_year').val();
    fuber.cc.cvv = $('input[name*="cc_cvv"]').val();
    fuber.cc.pcode = $('input[name*="cc_pcode"]').val();

    chrome.runtime.sendMessage({ from: 'popup', subject: 'fuber_data', fuber: fuber });
    chrome.runtime.sendMessage({ from: 'popup', subject: 'init_gmail' });
    chrome.runtime.sendMessage({ from: 'popup', subject: 'init_uber' });
  });


});


//returns random value in array
function getRandom(array){
  var index = Math.floor(Math.random()*array.length);
  var value = array[index];
  return value;
}

//seperates .txt into arrays based on line returns
function loadStrings(file) {
  var result;
  $.ajax({
    type: 'GET',
    url: chrome.extension.getURL(file),
    async: false,
    success: function(data){
        result = data;
    }
  });
  return result.split('\n');
}

function randomString(length) {
  var mask = 'abcdefghijklmnopqrstuvwxyz0123456789.';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}
