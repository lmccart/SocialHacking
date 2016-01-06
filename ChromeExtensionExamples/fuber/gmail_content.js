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
      console.log(fuber);
      response({});

      // 1. create gmail account (generate: random email, random pw)
      // 2. should be able to skip captcha, but might need to answer verify phone text
      $('#FirstName').val(fuber.fname);
      $('#firstname-placeholder').hide();
      $('#LastName').val(fuber.lname);
      $('#lastname-placeholder').hide();

      $('#GmailAddress').val(fuber.usr);
      $('#Passwd').val(fuber.pw);
      $('#PasswdAgain').val(fuber.pw);

      var m = Math.round(Math.random()*12);
      if (m < 10) {
        m = '0'+m;
      }
      $('#HiddenBirthMonth').val(m);
      $('#BirthDay').val(Math.round(Math.random()*28));
      $('#birthday-placeholder').hide();
      $('#BirthYear').val(2014 - 16 - Math.round(Math.random()*80));
      $('#birthyear-placeholder').hide();
      $('#HiddenGender').val('OTHER');

      $('#RecoveryEmailAddress').val('r'+fuber.usr+'@gmail.com');
      $('#RecoveryPhoneNumber').val(fuber.phone);

      $('#SkipCaptcha').prop('checked', true);
      $('#TermsOfService').prop('checked', true);

      //$('#submitbutton').click();
    }
  });


});