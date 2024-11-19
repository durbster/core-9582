const pcwTarget = document.querySelector("podium-pcw");
if (!pcwTarget) {
  console.error("PCW error: Could not find a <podium-pcw /> element.");
}

class PodiumPCW extends HTMLElement {
  //manifestUrl = this.siteUrl + ".vite/manifest.json";
  feedbackElement = null;
  hostElement = document.createElement("div");

  get publicPath() {
    const attr = this.getAttribute("public-path");

    // Removes trailing slash if found
    return attr ? attr.replace(/\/+$/, "") : "";
  }

  get siteURL() {
    const attr = this.getAttribute("site-url");

    if (!attr) {
      console.error("PCW error: Missing site-url attribute on th <podium-pcw /> element.");
      this.showError();
      // TODO Return blank
      return "https://test.podium-solutions.co.uk/mab/rates-table/CORE-9582/";
    }

    return attr;
  }

  get manifestURL() {
    return this.getAttribute("site-url") + ".vite/manifest.json";
  }

  constructor() {
    super();
    this.setConfig();

    console.log(`public-path`, this.getAttribute("public-path"));
    console.log(`site-url`, this.getAttribute("site-url"));

    this.attachShadow({ mode: "open" });
    this.createHostElement();
    this.showLoader();
    this.fetchSiteAssets();
  }

  setConfig() {
    // Set params
    // TODO set prod values
    window.podiumAppConfig = {
      API_LAYER_URL:
    "https://test.podium-solutions.co.uk/mab/rates-table/api/",
      CDN_URL:
    "https://storage.googleapis.com/podium-test-cdn/static/clients/MortgageMatcher",
      PUBLIC_PATH: this.publicPath
    };
  }

  createHostElement() {
    this.hostElement.id = "podium-pcw-app";
    pcwTarget.insertAdjacentElement("afterend", this.hostElement);
  }

  showLoader() {
    this.feedbackElement = document.createElement("img");
    this.feedbackElement.setAttribute("style", "max-height:60px");

    // TODO Move to prod or CDN
    this.feedbackElement.src =
      "https://storage.googleapis.com/podium-test-cdn/static/clients/mab/mab--loading-spinner.svg";

    this.hostElement.appendChild(this.feedbackElement);
  }

  showError(message) {
    this.feedbackElement = document.createElement("p");
    console.error(message);
    this.feedbackElement.textContent =
      "Sorry, we seem to be unable to show you the mortgage data at the moment.";
  }

  async fetchSiteAssets() {
    console.log(`--`, this.manifestURL);

    const manifest = await fetch(this.manifestURL).catch(() => {
      this.showError("PCW Error: failed to load manifest");
    });

    const data = await manifest.json();

    const indexJs = data["index.html"].file;

    const script = document.createElement("script");
    script.type = "module";
    script.crossOrigin = "";
    script.src = this.siteURL + indexJs;

    document.head.appendChild(script);

    data["index.html"].css.forEach((item) => {
      const styles = document.createElement("link");
      styles.setAttribute("rel", "stylesheet");
      styles.setAttribute("href", this.siteURL + item);
      document.head.appendChild(styles);
    });

    this.hostElement.removeChild(this.feedbackElement);
  }
}

window.customElements.define("podium-pcw", PodiumPCW);
