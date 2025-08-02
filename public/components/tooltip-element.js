import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.0.8/+esm';

class TooltipElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .tooltip {
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s;
          position: absolute;
          z-index: 10;
          background: #333;
          color: #fff;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 14px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          left: 125%;
          top: 50%;
          transform: translateY(-50%);
          min-width: 200px;
          max-width: 400px;
        }

        :host(:hover) .tooltip {
          visibility: visible;
          opacity: 1;
        }

        .tooltip::after {
          content: "";
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent #333 transparent transparent;
        }
      </style>
      <slot></slot>
      <div class="tooltip"></div>
    `;
  }

  connectedCallback() {
    const rawTooltip = this.getAttribute("text") || "";
    const tooltipDiv = this.shadowRoot.querySelector(".tooltip");

    const safeHTML = DOMPurify.sanitize(rawTooltip, { USE_PROFILES: { html: true } });
    tooltipDiv.innerHTML = safeHTML;
  }
}

customElements.define("tooltip-element", TooltipElement);
