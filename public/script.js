function parseMemory(value) {
  if (!value) return 0;

  const match = value.toLowerCase().match(/^(\d+(?:\.\d+)?)([bkmgt])$/);
  if (!match) return NaN;

  const number = parseFloat(match[1]);
  const unit = match[2];

  const unitMultipliers = {
    b: 1,
    k: 1024,
    m: 1024 ** 2,
    g: 1024 ** 3,
    t: 1024 ** 4,
  };

  return number * (unitMultipliers[unit] || NaN);
}

document.getElementById("dockerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const image = document.getElementById("image").value.trim();
  const name = document.getElementById("containerName").value.trim();

  const hostPort = document.getElementById("hostPort").value.trim();
  const containerPort = document.getElementById("containerPort").value.trim();

  const hostVolume = document.getElementById("hostVolume").value.trim();
  const containerVolume = document.getElementById("containerVolume").value.trim();

  const cpuCores = document.getElementById("cpuCores").value.trim();
  const memory = document.getElementById("memory").value.trim();
  const memorySwap = document.getElementById("memorySwap").value.trim();
  const storageLimit = document.getElementById("storageLimit").value.trim();

  const isNegative = (value, isMemory = false) => {
    if (!value) return false;

    if (isMemory) {
      const bytes = parseMemory(value);
      return isNaN(bytes) || bytes < 0;
    }

    const number = parseFloat(value);
    return isNaN(number) || number < 0;
  };

  if (
    isNegative(hostPort) ||
    isNegative(containerPort) ||
    isNegative(cpuCores) ||
    isNegative(memory, true) ||
    isNegative(memorySwap, true)
  ) {
    Swal.fire({
      title: "Invalid Input",
      text: "Ports, CPUs, and memory values must be non-negative and valid.",
      icon: "error"
    });
    return;
  }

  const memoryInBytes = parseMemory(memory);
  const memorySwapInBytes = parseMemory(memorySwap);

  if (memory && memorySwap && memorySwapInBytes < memoryInBytes) {
    Swal.fire({
      title: "Error",
      text: "Swap memory must be greater than or equal to memory.",
      icon: "error"
    });
    return;
  }

  let command = `docker run`;

  if (name) command += ` --name ${name}`;
  if (hostPort && containerPort) command += ` -p ${hostPort}:${containerPort}`;
  if (hostVolume && containerVolume) command += ` -v ${hostVolume}:${containerVolume}`;

  if (cpuCores) command += ` --cpus=${cpuCores}`;
  if (memory) command += ` --memory=${memory}`;
  if (memorySwap) command += ` --memory-swap=${memorySwap}`;
  if (storageLimit) command += ` --storage-opt size=${storageLimit}`;

  envVars.forEach(({ key, value }) => {
    command += ` -e ${key}=${value}`;
  });

  command += ` ${image}`;

  document.getElementById("output").textContent = command;
});

const envList = document.getElementById("envList");
const envVars = [];

document.getElementById("addEnvVar").addEventListener("click", () => {
  const key = document.getElementById("envKey").value.trim();
  const value = document.getElementById("envValue").value.trim();

  if (!key || !value) return;

  envVars.push({ key, value });
  renderEnvList();

  document.getElementById("envKey").value = "";
  document.getElementById("envValue").value = "";
});

function renderEnvList() {
  envList.innerHTML = "";
  envVars.forEach((env, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${env.key} → ${env.value}
      <button type="button" onclick="removeEnvVar(${index})">X</button>
    `;
    envList.appendChild(li);
  });
}

window.removeEnvVar = function (index) {
  envVars.splice(index, 1);
  renderEnvList();
};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector('docker-search').addEventListener('image-selected', (e) => {
    document.getElementById('image').value = e.detail.image;
  });
});