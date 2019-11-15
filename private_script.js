let isPrivate = false;

/**
 * Gets the browser name or returns an empty string if unknown.
 * This function also caches the result to provide for any
 * future calls this function has.
 *
 * @returns {string}
 */
var browser = function() {
  // Return cached result if avalible, else get result then cache it.
  if (browser.prototype._cachedResult) return browser.prototype._cachedResult;

  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function(p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(!window["safari"] || safari.pushNotification);

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1+
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  return (browser.prototype._cachedResult = isOpera
    ? "Opera"
    : isFirefox
    ? "Firefox"
    : isSafari
    ? "Safari"
    : isChrome
    ? "Chrome"
    : isIE
    ? "IE"
    : isEdge
    ? "Edge"
    : isBlink
    ? "Blink"
    : "Don't know");
};

const replacePrivateText = () => {
  document.body.innerHTML = document.body.innerHTML.replace(
    "hello",
    "hello private"
  );
};

console.log(browser());
switch (browser()) {
  case "Firefox":
    var db = indexedDB.open("test");
    db.onerror = function() {
      replacePrivateText();
    };
    break;
  case "IE":
    if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
      replacePrivateText();
    }
    break;
  case "Edge": // not chromium based edge
    if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
      replacePrivateText();
    }
  case "Don't know":
  case "Chrome":
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      replacePrivateText();
      break;
    } // old way to check assuming
    // chrome 76 + https://ww.9to5google.com/2019/08/09/new-york-times-detect-incognito-chrome-76/
    //https://arstechnica.com/information-technology/2019/07/chrome-76-prevents-nyt-and-other-news-sites-from-detecting-incognito-mode/
    //https://mishravikas.com/articles/2019-07/bypassing-anti-incognito-detection-google-chrome.html
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        console.log(`Using ${usage} out of ${quota} bytes.`);
        if (quota < 120000000) {
          replacePrivateText();
        } else {
          console.log("Not Incognito");
        }
      });
    } else {
      console.log("Can not detect");
    }
}

// honorable mention
// Jesse Li timing attack: https://blog.jse.li/posts/chrome-76-incognito-filesystem-timing/
