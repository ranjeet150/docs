(function () {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;

    var STORAGE_KEY = "neko-locale-check-done";
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    window.localStorage.setItem(STORAGE_KEY, "1");

    var path = window.location.pathname;
    if (path === "/es" || path.indexOf("/es/") === 0) return;

    var languages =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || ""];

    var prefersSpanish = languages.some(function (lang) {
      return /^es\b/i.test(lang);
    });

    if (!prefersSpanish) return;

    var target = path === "/" ? "/es" : "/es" + path;
    window.location.replace(target + window.location.search + window.location.hash);
  } catch (e) {
    // Never block page rendering if detection fails for any reason.
  }
})();
