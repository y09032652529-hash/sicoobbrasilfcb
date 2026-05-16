(function () {
  var localOrigin = window.location.origin;
  var paymentHosts = [
    "pay.pagamentoimpostoioff.online",
    "pay.pagamentosegurofacilitado.online",
    "pay.pagamentotarifadecadastroo.online",
    "pay.pagamentotarifadevalidacaoo.online",
    "pay.pagamentotaxaadministrativamp.online",
    "pay.seupagamentoativarconta.online",
    "pay.seupagamentotaxafinanceira.online",
    "pay.seupagamentotaxafiscall.online",
    "velanipagamentos.com.br"
  ];

  function asUrl(value) {
    try {
      return new URL(String(value), localOrigin);
    } catch (_error) {
      return null;
    }
  }

  function isPaymentUrl(value) {
    var url = asUrl(value);
    return !!url && paymentHosts.indexOf(url.hostname) !== -1;
  }

  function isTrackingScript(value) {
    var url = asUrl(value);
    if (!url) return false;
    return (
      url.hostname === "cdn.utmify.com.br" ||
      url.hostname === "connect.facebook.net"
    );
  }

  function goSuccessFinal() {
    window.history.pushState(null, "", "/sucesso-final");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  try {
    var originalAssign = window.location.assign.bind(window.location);
    window.location.assign = function guardedAssign(value) {
      if (isPaymentUrl(value)) {
        console.info("[local] Checkout externo bloqueado:", value);
        goSuccessFinal();
        return;
      }
      return originalAssign(value);
    };
  } catch (_error) {
    console.info("[local] location.assign nao pode ser interceptado neste navegador.");
  }

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest && event.target.closest("a[href]");
      if (link && isPaymentUrl(link.href)) {
        event.preventDefault();
        console.info("[local] Link de checkout externo bloqueado:", link.href);
        goSuccessFinal();
      }
    },
    true
  );

  var originalOpen = window.open;
  window.open = function guardedOpen(value) {
    if (isPaymentUrl(value)) {
      console.info("[local] Popup de checkout externo bloqueado:", value);
      goSuccessFinal();
      return null;
    }
    return originalOpen.apply(window, arguments);
  };

  var originalPushState = history.pushState;
  history.pushState = function guardedPushState(state, title, value) {
    if (value && isPaymentUrl(value)) {
      console.info("[local] Navegacao de checkout externo bloqueada:", value);
      return originalPushState.call(history, state, title, "/sucesso-final");
    }
    return originalPushState.apply(history, arguments);
  };

  var originalReplaceState = history.replaceState;
  history.replaceState = function guardedReplaceState(state, title, value) {
    if (value && isPaymentUrl(value)) {
      console.info("[local] Navegacao de checkout externo bloqueada:", value);
      return originalReplaceState.call(history, state, title, "/sucesso-final");
    }
    return originalReplaceState.apply(history, arguments);
  };

  var originalFetch = window.fetch && window.fetch.bind(window);
  if (originalFetch) {
    window.fetch = function guardedFetch(input) {
      var value = typeof input === "string" ? input : input && input.url;
      if (isPaymentUrl(value)) {
        console.info("[local] Fetch para checkout externo bloqueado:", value);
        return Promise.resolve(
          new Response("{}", {
            status: 200,
            headers: { "content-type": "application/json" }
          })
        );
      }
      return originalFetch.apply(window, arguments);
    };
  }

  var originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function guardedAppendChild(node) {
    if (node && node.tagName === "SCRIPT" && node.src && isTrackingScript(node.src)) {
      console.info("[local] Script externo bloqueado:", node.src);
      return node;
    }
    return originalAppendChild.call(this, node);
  };
})();
