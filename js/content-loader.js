// Applies any admin-edited text/images to this page. Every element tagged
// data-edit="some.key" gets its content replaced with whatever value is
// stored in Firestore at siteContent/{pageId}.some.key (pageId comes from
// <body data-page="...">). If nothing has been edited yet, or the field
// isn't set, the original hardcoded HTML is left alone.
(function () {
  const pageId = document.body.getAttribute("data-page");
  if (!pageId) return;

  const configScript = document.currentScript;
  const base = configScript.getAttribute("data-base") || "";

  import(base + "js/firebase-config.js").then(({ firebaseConfig }) => {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/siteContent/${pageId}?key=${firebaseConfig.apiKey}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json || !json.fields) return;
        Object.keys(json.fields).forEach((key) => {
          const field = json.fields[key];
          const value = field.stringValue;
          if (value == null) return;
          document.querySelectorAll(`[data-edit="${cssEscape(key)}"]`).forEach((el) => {
            if (el.tagName === "IMG") el.src = value;
            else el.textContent = value;
          });
        });
      })
      .catch((err) => console.error("content-loader: failed to load site content:", err));
  });

  function cssEscape(str) {
    return str.replace(/["\\]/g, "\\$&");
  }
})();
