# Docker Command Generator

A web application that helps users generate complex `docker run` commands through a user-friendly interface. It features live Docker image search, customizable options for ports, volumes, environment variables, and resource limits, and provides instant command output.

## Features

- **Live Docker Image Search:** Search Docker Hub images with autocomplete and select official or automated images.
- **Customizable Command Options:** Set container name, port and volume mappings, environment variables, CPU/memory limits, and storage options.
- **Instant Command Generation:** See the generated `docker run` command in real time as you fill out the form.
- **User-Friendly UI:** Clean, responsive design with tooltips and helpful error messages.

## Demo

<img width="1280" height="1073" alt="example_fullpage" src="https://github.com/user-attachments/assets/766a3583-9829-443f-9079-108272b6b733" />

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/UndeffinedDev/docker-command-generator.git
   cd docker-command-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the server (runs on port 80 by default):

```bash
npm run start
```

Then open [http://localhost](http://localhost) in your browser.

## Project Structure

```
.
├── index.js                      # Express server, serves static frontend and Docker Hub search API
├── package.json                  # Project metadata and dependencies
├── public/
│   ├── index.html                # Main HTML file
│   ├── script.js                 # Frontend logic for form and command generation
│   ├── style.css                 # Styles for the UI
│   └── components/
│       ├── docker-search.js      # Web component for live Docker image search
│       └── tooltip-element.js    # Web component for tooltips (uses DOMPurify)
|-- LICENSE
└── README.md
```

## Usage

1. **Search for an image:** Start typing in the "Image" field. Select from the live search results.
2. **Fill in options:** Set container name, ports, volumes, environment variables, and resource limits as needed.
3. **Generate command:** The Docker command appears below the form. Copy and use it in your terminal.

## Technical Details

### Backend (`index.js`)

- Uses Express to serve static files from `public/`.
- Provides `/api/docker-search` endpoint that proxies search queries to Docker Hub's API.

### Frontend

- **index.html:** Contains the form and loads all scripts/components.
- **script.js:** Handles form submission, command assembly, and environment variable management.
- **docker-search.js:** Custom element for live image search, fetches from backend API, emits `image-selected` event.
- **tooltip-element.js:** Custom element for tooltips, sanitizes HTML with DOMPurify for security.
- **style.css:** Responsive, clean styles for all UI elements.

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [sweetalert2](https://sweetalert2.github.io/) (CDN, for alerts)
- [DOMPurify](https://github.com/cure53/DOMPurify) (CDN, for tooltip sanitization)

## Security

- Tooltips are sanitized with DOMPurify to prevent XSS.

## License

ISC
