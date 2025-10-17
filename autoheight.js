
(function(){
  function recalcLayout(){
    var headerH = document.querySelector('header')?.offsetHeight || 0;
    var filtersH = document.querySelector('.filters')?.offsetHeight || 0;
    var footerH  = document.querySelector('footer')?.offsetHeight || 0;
    var topOffset = headerH + filtersH;

    // 1) dit au CSS où commence la zone de carte/panneau
    document.documentElement.style.setProperty('--topOffset', topOffset + 'px');

    // 2) ajuste la hauteur de la carte pour remplir l’écran
    var vh = window.innerHeight;
    var target = vh - topOffset - footerH - 8; // petite marge
    var map = document.getElementById('map');
    if(map && target > 120) map.style.height = target + 'px';
  }

  window.addEventListener('load', recalcLayout, {once:true});
  window.addEventListener('resize', recalcLayout);
  new ResizeObserver(recalcLayout).observe(document.body);
})();

