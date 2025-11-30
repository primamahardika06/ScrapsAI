document.addEventListener("DOMContentLoaded", (event) => {
  // 1. Get the necessary elements
  const dropArea = document.getElementById("dropArea");
  const imagePreview = document.getElementById("image-preview");
  const browseLink = dropArea.querySelector("a");

  // Prevent default drag behaviors for the entire document
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // 2. Highlight/Unhighlight drop area on drag events
  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    dropArea.classList.remove("highlight");
  }

  // 3. Handle dropped files
  dropArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
  }

  // 4. Handle files selected via 'Browse here' link (Simulate a click on a hidden input)
  browseLink.addEventListener("click", (e) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Accept only image files
    fileInput.style.display = "none";

    // Add a listener to handle file selection
    fileInput.addEventListener("change", (event) => {
      handleFiles(event.target.files);
    });

    // Trigger the file selection dialog
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput); // Clean up the element after the dialog is shown
  });

  // 5. Process files (Preview and potentially upload preparation)
  function handleFiles(files) {
    // Clear previous previews
    imagePreview.innerHTML = "";

    // Check if files exist and are images
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      previewFile(files[0]);
      // Here you would typically store the file object for the 'Analyze Now' button
      // Example: window.uploadedFile = files[0];
      // alert(`File ready for analysis: ${files[0].name}`);
    } else if (files.length > 0) {
      alert("Please drop an image file.");
    }
  }

  // 6. Display file preview
  function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const img = document.createElement("img");
      img.src = reader.result;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "200px";
      img.style.marginTop = "15px";
      img.style.borderRadius = "8px";
      imagePreview.appendChild(img);

      // Optionally, show file name
      const p = document.createElement("p");
      p.textContent = `File loaded: ${file.name}`;
      p.style.fontSize = "0.9em";
      imagePreview.appendChild(p);
    };
  }
});

const video = document.getElementById("camera-view");
const canvas = document.getElementById("canvas-output");
const shutterButton = document.getElementById("shutter");
const imgOutput = document.getElementById("camera-output");
const context = canvas.getContext("2d");
const camView = document.getElementById("viewCam")
const viewCam = document.getElementById("cam_view")

// Meminta akses ke kamera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error accessing camera:", error);
  });


camView.onclick = function(){
    viewCam.style.display = 'flex'
    viewCam.style.position = 'absolute'
}

// Menangani klik tombol shutter
shutterButton.addEventListener("click", () => {
  // Mengatur dimensi canvas agar sama dengan ukuran video
  viewCam.style.display = 'none'
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Menggambar frame video ke canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Mengubah gambar canvas menjadi data URL dan menampilkannya di img
  imgOutput.src = canvas.toDataURL("image/png");
});
