const source = "/";

async function fetchSiteFiles() {
  const manifest = await fetch(source + "assets/manifest.json");
  const data = await manifest.json();

  const indexJs = data["index.html"].file;

  const script = document.createElement("script");
  script.type = "module";
  script.src = source + indexJs;

  document.head.appendChild(script);

  data["index.html"].css.forEach((item) => {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("href", source + item);
    document.head.appendChild(styles);
  });
}

fetchSiteFiles();
