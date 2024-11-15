const pcwTarget = document.querySelector("podium-pcw");
if (!pcwTarget) {
  console.error("PCW error: Could not find a <podium-pcw /> element.");
}

class PodiumPCW extends HTMLElement {
  siteUrl = "https://test.podium-solutions.co.uk/mab/rates-table/CORE-9582/";
  manifestUrl = this.siteUrl + ".vite/manifest.json";
  feedbackElement = null;
  hostElement = document.createElement("div");

  constructor() {
    super();
    this.setConfig();

    this.attachShadow({ mode: "open" });
    this.createHostElement();
    this.showLoader();
    this.fetchSiteAssets();
  }

  setConfig() {
    if (!this.getAttribute("public-path")) {
      console.error("'public-path' attribute is missing. Add to <podium-pcw public-path='URL' />");
    }

    // Set params
    // TODO set prod values
    window.podiumAppConfig = {
      API_LAYER_URL:
    "https://test.podium-solutions.co.uk/mortgagematcher/rates-table/api",
      CDN_URL:
    "https://storage.googleapis.com/podium-test-cdn/static/clients/MortgageMatcher",
      BASE_URL: this.getAttribute("public-path")
    };
  }

  createHostElement() {
    this.hostElement.id = "podium-pcw-app"; // TODO update to unique name
    pcwTarget.insertAdjacentElement("afterend", this.hostElement);
  }

  showLoader() {
    this.feedbackElement = document.createElement("img");
    this.feedbackElement.setAttribute("style", "max-height:50px");

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
    const manifest = await fetch(this.manifestUrl).catch(() => {
      this.showError("PCW Error: failed to load manifest");
    });

    const data = await manifest.json();

    const indexJs = data["index.html"].file;

    const script = document.createElement("script");
    script.type = "module";
    script.crossOrigin = "";
    script.src = this.siteUrl + indexJs;

    document.head.appendChild(script);

    data["index.html"].css.forEach((item) => {
      const styles = document.createElement("link");
      styles.setAttribute("rel", "stylesheet");
      styles.setAttribute("href", this.siteUrl + item);
      document.head.appendChild(styles);
    });

    this.hostElement.removeChild(this.feedbackElement);
  }
}

window.customElements.define("podium-pcw", PodiumPCW);
