
/*Console java script*/
$(function() {
  var data = [
  {
    action: 'type',
    strings: ["install tolga-durak^400"],
    output: '<span class="gray">+tolga-durak@1.00.0 installed</span><br>&nbsp;',
    postDelay: 1000
  },
  {
    action: 'type',
    //clear: true,
    strings: ['tolga-durak --help^400'],
    output: $('.mimik-run-output').html()
  },
  {
    action: 'type',
    strings: ["Sitemi ziyaret ettiğiniz için teşekkürler^400"],
    postDelay: 2000
  }

];
  runScripts(data, 0);
});

function runScripts(data, pos) {
    var prompt = $('.prompt'),
        script = data[pos];
    if(script.clear === true) {
      $('.history').html('');
    }
    switch(script.action) {
        case 'type':
          // cleanup for next execution
          prompt.removeData();
          $('.terminal .typed-cursor').text('');
          prompt.typed({
            strings: script.strings,
            typeSpeed: 30,
            callback: function() {
              var history = $('.history').html();
              history = history ? [history] : [];
              history.push('$ ' + prompt.text());
              if(script.output) {
                history.push(script.output);
                prompt.html('');
                $('.history').html(history.join('<br>'));
              }
              // scroll to bottom of screen
              $('section.terminal').scrollTop($('section.terminal').height());
              // Run next script
              pos++;
              if(pos < data.length) {
                setTimeout(function() {
                  runScripts(data, pos);
                }, script.postDelay || 1000);
              }
            }
          });
          break;
        case 'view':

          break;
    }
}
/*introduction*/
$(function() {
	$("#typed").typed({
		strings: ["Kişisel Web Sitesi"],
		typeSpeed: 100,
    backDelay: 1500,
    loop: false,
    callback: function(){$('#introduction-heading span.typed-cursor').text('');}
	});
});
