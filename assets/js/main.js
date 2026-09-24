(function () {
  // theproof: the headline check-mark draws itself once the page is shown
  requestAnimationFrame(function () { document.body.classList.add('e-animated'); });

  // mobile menu
  var side = document.querySelector('.side');
  var burger = document.querySelector('.side__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = side.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    side.querySelectorAll('.side__nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        side.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // theproof: highlight the section currently in view in the sidebar
  var links = Array.prototype.slice.call(document.querySelectorAll('.side__nav a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.parentElement.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
