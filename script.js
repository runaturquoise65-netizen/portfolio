// Scripts for internationalized strings; switch between Japanese and English

(function(){
  var root = document.documentElement;
  function setLang(l){
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    document.querySelectorAll('[data-i18n]').forEach(function(element){
      var value = window.runaStrings[l][element.getAttribute('data-i18n')];
      if (value === undefined) { throw new Error('Missing translation: ' + element.getAttribute('data-i18n')); }
      element.innerHTML = value;
    });
    document.querySelectorAll('.collapsible').forEach(updateCollapsibleText);
    document.getElementById('btn-ja').setAttribute('aria-pressed', l === 'ja' ? 'true' : 'false');
    document.getElementById('btn-en').setAttribute('aria-pressed', l === 'en' ? 'true' : 'false');
    try { localStorage.setItem('runa-lang', l); } catch(e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('runa-lang'); } catch(e) {}
  setLang(saved === 'en' ? 'en' : 'ja');
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click', function(){ setLang(b.getAttribute('data-set')); });
  });

  function updateCollapsibleText(button){
    var key = button.getAttribute('aria-expanded') === 'true'
      ? 'collapsible_see_less'
      : 'collapsible_see_more';
    var language = root.getAttribute('lang') || 'ja';
    var value = window.runaStrings[language][key];
    if (value === undefined) { throw new Error('Missing translation: ' + key); }
    button.textContent = value;
  }

  window.changeText = function(button){
    var content = button.nextElementSibling;
    if (!content || !content.classList.contains('content')) {
      throw new Error('A collapsible button must be followed by a content element.');
    }
    var isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    content.hidden = isOpen;
    updateCollapsibleText(button);
  };

  document.querySelectorAll('.collapsible').forEach(function(button){
    var content = button.nextElementSibling;
    if (!content || !content.classList.contains('content')) {
      throw new Error('A collapsible button must be followed by a content element.');
    }
    button.setAttribute('aria-expanded', 'false');
    content.hidden = true;
    updateCollapsibleText(button);
  });

  var copyBtn = document.getElementById('copy-email');
  var done = document.getElementById('copied');
  copyBtn.addEventListener('click', function(){
    var text = document.getElementById('email').textContent.trim();
    function selectFallback(){
      var r = document.createRange();
      r.selectNodeContents(document.getElementById('email'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try {
      navigator.clipboard.writeText(text).then(function(){
        done.hidden = false; setTimeout(function(){ done.hidden = true; }, 2000);
      }, selectFallback);
    } catch(e) { selectFallback(); }
  });
})();
