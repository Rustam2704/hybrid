(function () {
  var body = document.body;
  var lang = body.getAttribute('data-lang') || 'uk';
  var api = body.getAttribute('data-api') || '/hybrid/api';
  var T = {
    uk: { soon: 'скоро', sandbox: 'тестовий режим', price: function (a, c) { return fmt(a, c); }, err: 'Не вдалося почати оплату: ', paddleLoad: 'Не вдалося завантажити Paddle.' },
    en: { soon: 'coming soon', sandbox: 'test mode', price: function (a, c) { return fmt(a, c); }, err: 'Could not start the payment: ', paddleLoad: 'Could not load Paddle.' }
  }[lang];
  function fmt(amount, cur) {
    try { return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'uk-UA', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amount / 100); }
    catch (e) { return (amount / 100) + ' ' + cur; }
  }

  // ---------------- checkout page
  var form = document.getElementById('pay-form');
  if (form) {
    var catalog = null, providers = {};
    var params = new URLSearchParams(location.search);
    fetch(api + '/products').then(function (r) { return r.json(); }).then(function (d) {
      catalog = d.products; providers = d.providers || {};
      var box = document.getElementById('products'); box.innerHTML = '';
      d.products.forEach(function (p, i) {
        var l = document.createElement('label'); l.className = 'pay__product';
        var checked = params.get('product') ? params.get('product') === p.id : i === 0;
        l.innerHTML = '<input type="radio" name="product" value="' + p.id + '"' + (checked ? ' checked' : '') + '>' +
          '<span class="pay__product-body"><b>' + p.name[lang] + '</b><small>' + p.description[lang] + '</small></span>' +
          '<span class="pay__price" data-uah="' + p.prices.UAH + '" data-usd="' + p.prices.USD + '" data-eur="' + p.prices.EUR + '"></span>';
        box.appendChild(l);
      });
      ['liqpay', 'mono', 'intl'].forEach(function (k) {
        var ok = k === 'intl' ? (providers.paddle || providers.liqpay) : providers[k];
        var badge = document.querySelector('[data-status="' + k + '"]');
        var label = document.querySelector('.pay__method[data-provider="' + k + '"]');
        if (!ok) { badge.textContent = T.soon; label.classList.add('is-disabled'); label.querySelector('input').disabled = true; }
        else if (providers.sandbox && k !== 'intl') { badge.textContent = T.sandbox; }
      });
      var first = form.querySelector('input[name="provider"]:not(:disabled)'); if (first) first.checked = true;
      update();
    }).catch(function () { document.getElementById('products').innerHTML = '<p class="pay__muted">API недоступне / API unavailable</p>'; });

    function currentCurrency() {
      var prov = form.provider.value;
      if (prov === 'intl') return form.currency.value;
      return 'UAH';
    }
    function update() {
      var cur = currentCurrency();
      document.getElementById('currency-row').hidden = form.provider.value !== 'intl';
      form.querySelectorAll('.pay__price').forEach(function (el) { el.textContent = fmt(Number(el.getAttribute('data-' + cur.toLowerCase())), cur); });
      var sel = form.querySelector('input[name="product"]:checked'); var total = document.getElementById('total');
      if (sel && catalog) { var p = catalog.filter(function (x) { return x.id === sel.value; })[0]; total.textContent = fmt(p.prices[cur], cur); }
    }
    form.addEventListener('change', update);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('pay-error'); err.hidden = true;
      if (!form.email.checkValidity()) { form.email.reportValidity(); return; }
      var prov = form.provider.value; var cur = currentCurrency();
      var provider = prov === 'intl' ? (providers.paddle ? 'paddle' : 'liqpay') : prov;
      var btn = form.querySelector('.pay__submit'); btn.disabled = true;
      fetch(api + '/checkout', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product: form.product.value, provider: provider, currency: cur, email: form.email.value, lang: lang }) })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || r.status); return d; }); })
        .then(function (d) {
          if (d.provider === 'liqpay') {                     // auto-submit the signed form to LiqPay
            var f = document.createElement('form'); f.method = 'POST'; f.action = d.action; f.acceptCharset = 'utf-8';
            Object.keys(d.fields).forEach(function (k) { var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = d.fields[k]; f.appendChild(i); });
            document.body.appendChild(f); f.submit();
          } else if (d.provider === 'mono') {
            location.href = d.redirect;
          } else if (d.provider === 'paddle') {
            loadPaddle(function () {
              window.Paddle.Environment.set(d.environment);
              window.Paddle.Initialize({ token: d.clientToken, eventCallback: function (ev) {
                if (ev.name === 'checkout.completed') location.href = (lang === 'en' ? 'thanks.html' : 'thanks.html') + '?order=' + d.order;
              } });
              window.Paddle.Checkout.open({ items: [{ priceId: d.priceId, quantity: 1 }], customData: d.customData, customer: d.customer, settings: { locale: lang === 'en' ? 'en' : 'uk', displayMode: 'overlay' } });
              btn.disabled = false;
            });
          }
        })
        .catch(function (ex) { err.textContent = T.err + ex.message; err.hidden = false; btn.disabled = false; });
    });
    function loadPaddle(cb) {
      if (window.Paddle) return cb();
      var s = document.createElement('script'); s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'; s.onload = cb;
      s.onerror = function () { var err = document.getElementById('pay-error'); err.textContent = T.paddleLoad; err.hidden = false; };
      document.head.appendChild(s);
    }
  }

  // ---------------- thank-you page: poll the order until the webhook lands
  var thanks = document.getElementById('thanks');
  if (thanks) {
    var id = new URLSearchParams(location.search).get('order');
    document.getElementById('order-id').textContent = id || '—';
    var tries = 0;
    function show(state) { thanks.setAttribute('data-state', state); thanks.querySelectorAll('[data-when]').forEach(function (el) { el.hidden = el.getAttribute('data-when') !== state; }); }
    show('pending');
    (function poll() {
      if (!id) return show('failed');
      fetch(api + '/order/' + id).then(function (r) { return r.json(); }).then(function (o) {
        if (o.status === 'paid') {
          show('paid'); document.getElementById('order-title').textContent = o.title || '';
          if (o.download) { var row = document.getElementById('download-row'); row.hidden = false; document.getElementById('download').href = o.download; }
        } else if (o.status === 'failed') { show('failed'); }
        else if (++tries < 40) { setTimeout(poll, 3000); }
        else { show('failed'); }
      }).catch(function () { if (++tries < 40) setTimeout(poll, 3000); else show('failed'); });
    })();
  }
})();
