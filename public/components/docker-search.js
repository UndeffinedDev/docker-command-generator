export class DockerSearch extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      this.shadowRoot.innerHTML = `
        <style>
          .container {
            font-family: sans-serif;
            position: relative;
            width: 300px;
          }
          input {
            width: 100%;
            padding: 8px;
            font-size: 16px;
            box-sizing: border-box;
          }
          ul {
            list-style: none;
            margin: 0;
            padding: 0;
            position: absolute;
            width: 100%;
            background: white;
            border: 1px solid #ccc;
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
          }
          li {
            padding: 8px;
            cursor: pointer;
          }
          li:hover {
            background-color: #f0f0f0;
          }
        </style>
        <div class="container">
          <input type="text" placeholder="Search Docker images..." />
          <ul></ul>
        </div>
      `;
  
      this.input = this.shadowRoot.querySelector("input");
      this.list = this.shadowRoot.querySelector("ul");
  
      this.input.addEventListener("input", () => this.onInput());
      this.list.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
          const realName = e.target.getAttribute("data-name");
          this.input.value = e.target.textContent;
          this.list.innerHTML = '';
          this.dispatchEvent(new CustomEvent("image-selected", {
            detail: { image: realName },
            bubbles: true,
            composed: true
          }));
        }
      });      
    }
  
    async onInput() {
        const query = this.input.value.trim();
        if (query.length < 2) {
          this.list.innerHTML = '';
          return;
        }
      
        try {
          const res = await fetch(`/api/docker-search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          const results = data.results?.slice(0, 10) || [];
      
          this.list.innerHTML = results.map(repo => {
            const name = repo.repo_name || "unknown/repo";
            const emoji = repo.is_official ? '⭐' : repo.is_automated ? '🤖' : '';
            return `<li data-name="${name}">${emoji} ${name}</li>`;
          }).join("");              
      
        } catch (err) {
          console.error("Fetch error:", err);
          this.list.innerHTML = `<li>Error fetching results</li>`;
        }
      }      
  }
  
  customElements.define("docker-search", DockerSearch);
  