document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const uploadBtn = document.getElementById("upload-btn");
    const galleryContainer = document.querySelector(".gallery-container");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const likeBtn = document.getElementById("like-btn");
    const likeCount = document.getElementById("like-count");
    const deleteBtn = document.getElementById("delete-btn");
    const closeLightbox = document.getElementById("close-lightbox");
    const toggleModeBtn = document.getElementById("toggle-mode");
    
    let currentImage = null;
    let galleryMode = "border"; // Default mode
    
    uploadBtn.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("gallery-image");
                img.dataset.likes = 0;
                
                img.addEventListener("click", () => {
                    currentImage = img;
                    lightboxImg.src = img.src;
                    likeCount.textContent = img.dataset.likes;
                    lightbox.style.visibility = "visible";
                    lightbox.style.opacity = "1";
                });
                
                galleryContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
    
    likeBtn.addEventListener("click", () => {
        if (currentImage) {
            currentImage.dataset.likes = parseInt(currentImage.dataset.likes) + 1;
            likeCount.textContent = currentImage.dataset.likes;
        }
    });
    
    deleteBtn.addEventListener("click", () => {
        if (currentImage) {
            currentImage.remove();
            lightbox.style.visibility = "hidden";
            lightbox.style.opacity = "0";
        }
    });
    
    closeLightbox.addEventListener("click", () => {
        lightbox.style.visibility = "hidden";
        lightbox.style.opacity = "0";
    });
    
    toggleModeBtn.addEventListener("click", () => {
        if (galleryMode === "border") {
            galleryContainer.style.display = "block";
            galleryMode = "swipe";
        } else {
            galleryContainer.style.display = "flex";
            galleryMode = "border";
        }
    });
});
