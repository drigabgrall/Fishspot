
(function(){
  function setMapHeight(){
    var h = document.querySelector('header')?.offsetHeight || 0;
    var f = document.querySelector('.filters')?.offsetHeight || 0;
    var foot = document.querySelector('footer')?.offsetHeight || 0;
    var vh = window.innerHeight;
    var target = vh - h - f - foot - 8; // small margin
    var map = document.getElementById('map');
    if(map && target>120){ map.style.height = target + 'px'; }
  }
  window.addEventListener('load', setMapHeight, {once:true});
  window.addEventListener('resize', setMapHeight);
  new ResizeObserver(setMapHeight).observe(document.body);
})();
