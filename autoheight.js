(function(){
  function recalcLayout(){
    var headerH = document.querySelector('header')?.offsetHeight || 0;
    var filtersH = document.querySelector('.filters')?.offsetHeight || 0;
    var footerH  = document.querySelector('footer')?.offsetHeight || 0;
    var topOffset = headerH + filtersH;
    document.documentElement.style.setProperty('--topOffset', topOffset + 'px');
    var vh = window.innerHeight;
    var target = vh - topOffset - footerH - 8;
    var map = document.getElementById('map');
    if(map && target > 120) map.style.height = target + 'px';
  }
  window.addEventListener('load', recalcLayout, {once:true});
  window.addEventListener('resize', recalcLayout);
  new ResizeObserver(recalcLayout).observe(document.body);
})();