const template = document.createElement('template');
template.innerHTML = `
<style>
@import "/assets/index.css";
</style>
<script type="module" src="/assets/index.js" defer></script>
<div id="app">App should load here...</div>
`

class PodiumPCW extends HTMLElement {  
  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    // const styles = document.createElement('link');
    // styles.setAttribute("rel", "stylesheet");
    // styles.setAttribute("href", "/asses/index.css");

    // const script = document.createElement('link');
    // script.setAttribute("type", "module");
    // script.setAttribute("defer");
    // script.setAttribute("src", "/assets/index.js");

    const target = document.createElement('div');
    target.classList.add("g__font-delta");
    target.textContent = "Waffles.";

    // // style.textContent = `span { display:inline-block; padding: 0.25rem; background-color: #ccc; }`;

    // let value = isNaN(+this.textContent) ? 0 : +this.textContent;
    
    // value = Intl.NumberFormat("en-GB", {
    //   currency: "GBP",
    //   style: "currency",
    //   maximumFractionDigits: this.getAttribute('decimals') ?? 2,
    //   minimumFractionDigits: this.getAttribute('decimals') ?? 2
    // }).format(value);

    // const el = document.createElement('span');
    // el.textContent = value;

    shadowRoot.appendChild(target);
    // shadowRoot.appendChild(styles);
    // shadowRoot.appendChild(script);    
  }
}   

window.customElements.define("podium-pcw", PodiumPCW);