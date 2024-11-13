class PodiumPCW extends HTMLElement {
  baseUrl = "/";
  manifestUrl = this.baseUrl + "assets/manifest.json";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const target = document.querySelector("podium-pcw");

    if(!target) {
      console.error("Could not find the <podium-pcw /> element");
    }

    const host = document.createElement("div");
    host.id = "app";
    target.insertAdjacentElement("afterend", host);

    this.fetchSiteAssets()
  }

  showError(shadowRoot) {
    const errorElement = document.createElement("p");
    errorElement.textContent = "Woof.";
    shadowRoot.appendChild(errorElement);
  }

  async fetchSiteAssets() {
    return new Promise(async (resolve, reject) => {
      const manifest = await fetch(this.manifestUrl).catch(() => {
        this.showError();
        reject();
      });

      const data = await manifest.json();

      const indexJs = data["index.html"].file;

      const script = document.createElement("script");
      script.type = "module";
      script.src = this.baseUrl + indexJs;

      document.head.appendChild(script);

      data["index.html"].css.forEach((item) => {
        const styles = document.createElement("link");
        styles.setAttribute("rel", "stylesheet");
        styles.setAttribute("href", this.baseUrl + item);
        document.head.appendChild(styles);
      });

      resolve();
    });
  }
}

window.customElements.define("podium-pcw", PodiumPCW);
