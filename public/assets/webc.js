class PodiumPCW extends HTMLElement {  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const target = document.querySelector('podium-pcw');
    const host = document.createElement("div");
    host.id = "app";
    target.insertAdjacentElement("afterend", host);

    this.fetchSiteAssets();
  }

  async fetchSiteAssets() {
    const source = "/";
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
}

window.customElements.define("podium-pcw", PodiumPCW);
