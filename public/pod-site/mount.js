const siteURL = "https://test.podium-solutions.co.uk/mab/rates-table/content_inject/";
const cdnURL = "https://cdn.test.podium-solutions.co.uk/static/clients/mab/";
const manifestURL = `${siteURL}.vite/manifest.json`;
const loadingSpinnerURL = cdnURL + "/mab--loading-spinner.svg";

const pcwTarget = document.querySelector("podium-pcw");
if (!pcwTarget) {
  console.error("PCW error: Could not find a <podium-pcw /> element.");
}

class PodiumPCW extends HTMLElement {
  feedbackElement = null;
  hostElement = document.createElement("div");

  get publicPath() {
    const attr = this.getAttribute("public-path");

    // Removes trailing slash if found
    return attr ? attr.replace(/\/+$/, "") : "";
  }

  get apiURL() {
    return `https://test.podium-solutions.co.uk/mab/rates-table/api/`;
  }

  get brandId() {
    const attr = this.getAttribute("brand-id");
    return attr ? attr : null;
  }

  constructor() {
    super();
    this.setConfig();
    this.attachShadow({ mode: "open" });
    this.createHostElement();
    this.showLoader();
    this.fetchSiteAssets();
  }

  setConfig() {
    // Set params
    window.podiumAppConfig = {
      API_LAYER_URL: this.apiURL,
      CDN_URL: cdnURL,
      BASE_URL: this.publicPath
    };
  }

  createHostElement() {
    this.hostElement.id = "podium-pcw-app";

    // Add brand ID if defined
    if (this.brandId) this.hostElement.setAttribute("data-brand-id", this.brandId);

    pcwTarget.insertAdjacentElement("afterend", this.hostElement);
  }

  showLoader() {
    this.feedbackElement = document.createElement("img");
    this.feedbackElement.setAttribute("style", "max-height:60px");

    this.feedbackElement.src = loadingSpinnerURL;
    this.hostElement.appendChild(this.feedbackElement);
  }

  showError(message) {
    this.feedbackElement = document.createElement("p");
    console.error(message);
    this.feedbackElement.textContent =
      "Sorry, we seem to be unable to show you the mortgage data at the moment.";
  }

  async fetchSiteAssets() {
    const manifest = await fetch(manifestURL).catch(() => {
      this.showError("PCW Error: failed to load manifest");
    });

    const data = await manifest.json();

    const indexJs = data["index.html"].file;

    const script = document.createElement("script");
    script.type = "module";
    script.crossOrigin = "";
    script.src = siteURL + indexJs;

    document.head.appendChild(script);

    data["index.html"].css.forEach((item) => {
      const styles = document.createElement("link");
      styles.setAttribute("rel", "stylesheet");
      styles.setAttribute("href", siteURL + item);
      document.head.appendChild(styles);
    });

    this.hostElement.removeChild(this.feedbackElement);
  }
}

window.customElements.define("podium-pcw", PodiumPCW);
