/*
 * WebDesignFOX – Tawk.to language-aware widget loader
 *
 * Loads exactly one Tawk.to widget based on the current localized page URL.
 */
(function () {
  "use strict";

  if (document.querySelector(".window-honda")) {
    var galleryStyle = document.createElement("link");
    galleryStyle.rel = "stylesheet";
    galleryStyle.href = "/cunderlik-gallery.css?v=1";
    document.head.appendChild(galleryStyle);
  }

  var PROPERTY_ID = "6a951d52c3c46c344587662a";
  var widgets = {
    sk: "1k1b9121q",
    de: "1k1bb2aln",
    en: "1k1bb9ast",
    hr: "1k1bjvbjq",
    fr: "1k1blk6o4",
    it: "1k1bovo5t",
    pl: "1k1bp5qda",
    es: "1k1bp6lk5",
    sv: "1k1bpdngj"
  };

  var supported = Object.keys(widgets);
  var normalizeLanguage = function (value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  };
  var urlLang = normalizeLanguage(window.location.pathname.split("/")[1]);
  var htmlLang = normalizeLanguage(document.documentElement.lang);
  var language = supported.indexOf(urlLang) !== -1 ? urlLang : htmlLang;
  if (supported.indexOf(language) === -1) language = "sk";

  try {
    localStorage.setItem("wdfox-language", language);
  } catch (_) {}

  var mxCard = document.querySelector(".project-honda");
  if (mxCard) {
    var mxTitle = mxCard.querySelector(".project-info h3");
    if (mxTitle && language === "sk") mxTitle.textContent = "Čunderlík MX Academy";

    var mxWindow = mxCard.querySelector(".window-honda");
    if (mxWindow && !mxWindow.querySelector(".cunderlik-extra-photo")) {
      var extraStyle = document.createElement("style");
      extraStyle.textContent = ".window-honda .cunderlik-extra-photo{position:absolute;left:144px;top:12px;width:122px;height:92px;object-fit:cover;border:3px solid #fff;border-radius:12px;z-index:7;box-shadow:0 8px 20px rgba(0,0,0,.32)}@media(max-width:640px){.window-honda .cunderlik-extra-photo{left:116px;top:10px;width:96px;height:72px;border-radius:10px}}";
      document.head.appendChild(extraStyle);

      var extraPhoto = document.createElement("img");
      extraPhoto.className = "cunderlik-extra-photo";
      extraPhoto.alt = "Čunderlík MX Academy – archívna fotografia";
      extraPhoto.loading = "lazy";
      extraPhoto.src = "data:image/webp;base64,UklGRioyAABXRUJQVlA4IB4yAABw2gCdASpoAQ4BPp1Em0mlpCImq7Sr6NATiWNuxv0+4VfUupmYPz0+tHWEtaBvY49NXmJ9A7zSfuN+x3u0enr0GP6b/kuuc9Frpgf3XttXk1/Q8LfQCGXaf2R/8bwb+h+opit26vC+ZBfp4deILw5tAfyb/AbqLGs/VHywp5sMMeH94M38P76kwoGnG87ZMFVxiAIdfOmTTWn6BiRzOGBwHO9t9ewf/c5EtwtMyaOSSiN9c1uzEVNuVT3E10/rAlzhTS/nfJHcLd8nIeBpgzuwFRpL1234rGoY8GLBkkxfkf01c4uYtHdw+pTADbgJsk3/n0OlTj4cWiCl/NNzD+ahcDlEdMxyuY6b1ZzvmCVkNPiPPWwpzE3C/K5a4ditCFK9KEUmZ8n8s32ztcHklhsNhjfPr83bwApmkdxmRi5reFqp6RNiCrdwiwQig9+0xGpxZhud61c2hf5Jj8cLXAis0jIS2tao+6hw8uWZW1w+iTBbhnazvYQzft3btW2Gmp/aRjKXUwF/J8OH+1nuFzuvCaIehiRp3XKGTLe9RzfSJK7zXxDcMcSXQBPejy7i6oKc1MPqkLvxN1A9bgDYgvtq6AgWYOLJdL0htwCyzKzN8G+0mYubf0yctrWQ3GyvCEEDVHKC9Ktw2GPKlSblfQUWZV95sVulmcXgq72NTjpdtIiAV/b6fFo3V8ATRS3OJVL+eq+C4+vbiJ92u5NbiNf8rcodAvbtVLCArFIhLFiNr7NPZl6SLiMqwzumy0xR0g9sL7bO95l8csO/6gV0741nQDk2iOfz14d2CQmOwBbWNeKFqCb0A9jAufxQLT/klgGZclkAftBSyPkIk8lov2Fgum3YUkhIQ3sq76DbHZXeo3/NUKm/BhW8ZpfHufw7ky22+xsKKKdcDHL4Nf3zrue+l+aFloEd4212v5aQjxBhb2YJJBnwquw3b2N55kuZ+yF0MOeJsrqDm1+ssC0ri70qeAAs2hXGp6I/DjFmkrB90N3nNw7jQqY4yxXUXw4F+boePx/e9yjt71l45TUMBNYQ6AkeYR4vB+nhw3b8GlXRvz7EPn+MnfDHBnDLl9y4jSl47JVh3aw6HNi9TTGrPEcWPoNDbICpR/KYVopIG7dJE9RzfSJK7zXxDcMcSXQBPejy7i6oKc1MPqkLvxN1A9bgDYgvtq6AgWYOLJdL0htwCyzKzN8G+0mYubf0yctrWQ3GyvCEEDVHKC9Ktw2GPKlSblfQUWZV95sVulmcXgq72NTjpdtIiAV/b6fFo3V8ATRS3OJVL+eq+C4+vbiJ92u5NbiNf8rcodAvbtVLCArFIhLFiNr7NPZl6SLiMqwzumy0xR0g9sL7bO95l8csO/6gV0741nQDk2iOfz14d2CQmOwBbWNeKFqCb0A9jAufxQLT/klgGZclkAftBSyPkIk8lov2Fgum3YUkhIQ3sq76DbHZXeo3/NUKm/BhW8ZpfHufw7ky22+xsKKKdcDHL4Nf3zrue+l+aFloEd4212v5aQjxBhb2YJJBnwquw3b2N55kuZ+yF0MOeJsrqDm1+ssC0ri70qeAAs2hXGp6I/DjFmkrB90N3nNw3tD5n4cQmQq8t+3Y6z9v5xJQAA==";
      mxWindow.appendChild(extraPhoto);
    }
  }

  var widgetId = widgets[language] || widgets.sk;

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  window.Tawk_API.customStyle = {
    zIndex: 2147483647,
    visibility: {
      desktop: {
        position: "br",
        xOffset: 20,
        yOffset: 20
      },
      mobile: {
        position: "br",
        xOffset: 12,
        yOffset: 12
      }
    }
  };
  window.WebDesignFOXChatLanguage = language;
  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, callback) {
    var nextWidget = widgets[nextLanguage];
    if (!nextWidget || typeof window.Tawk_API.switchWidget !== "function") {
      callback();
      return;
    }

    if (typeof window.Tawk_API.endChat === "function") {
      try {
        window.Tawk_API.endChat();
      } catch (_) {}
    }

    window.setTimeout(function () {
      window.Tawk_API.switchWidget({
        propertyId: PROPERTY_ID,
        widgetId: nextWidget
      }, function () {
        callback();
      });
    }, 250);
  };

  var script = document.createElement("script");
  script.id = "tawk-language-script";
  script.async = true;
  script.src = "https://embed.tawk.to/" + PROPERTY_ID + "/" + widgetId;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  document.head.appendChild(script);

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest(".live-chat-bubble");
    if (!trigger) return;
    event.preventDefault();
    if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
      window.Tawk_API.maximize();
    }
  });
})();
