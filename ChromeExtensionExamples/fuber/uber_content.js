$(document).ready(function() {


  // Ask background page for data
  chrome.runtime.sendMessage({
      from:    'content',
      subject: 'send_fuber_data'
  });
    
  // Listen for message from the popup 
  chrome.runtime.onMessage.addListener(function(msg, sender, response) {

    // First, validate the message's structure 
    if (msg.from === 'background' && msg.subject === 'fuber_data') {

      var fuber = msg.fuber;
          
      setTimeout(function() {

        $('#email').val(fuber.usr+'@gmail.com');
        $('#first_name').val(fuber.fname);
        $('#last_name').val(fuber.lname);
        //$('#mobile').val(fuber.phone);

        $('#card_number').val(fuber.cc.number);
        $('#card_code').val(fuber.cc.cvv);
        $('#card_expiration_month-month option[value="' + fuber.cc.exp_month + '"]').prop('selected', true);
        $('#card_expiration_month-month').removeClass('gray');
        $('#card_expiration_year-year option[value="' + fuber.cc.exp_year + '"]').prop('selected', true);
        $('#card_expiration_year-year').removeClass('gray');
        $('#billing_zip').val(fuber.cc.pcode);

        $('#promotion_code').val('FIRSTRIDE30');
        $('.promo-code-wrapper').show();

      }, 2000);
    }

  });

});

