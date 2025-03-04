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
    const diaryText = document.getElementById("diary-text");
    const saveDiaryBtn = document.getElementById("save-diary");
    const musicInput = document.getElementById("music-input");
    const musicPlayer = document.getElementById("music-player");
    const changeMusicBtn = document.getElementById("change-music");
    
    let currentImage = null;
    let galleryMode = "border";

    function saveGallery() {
        localStorage.setItem("gallery", galleryContainer.innerHTML);
    }

    function loadGallery() {
        galleryContainer.innerHTML = localStorage.getItem("gallery") || "";
        document.querySelectorAll(".gallery-image").forEach(img => {
            img.addEventListener("click", () => openLightbox(img));
        });
    }

    function openLightbox(img) {
        currentImage = img;
        lightboxImg.src = img.src;
        likeCount.textContent = img.dataset.likes || "0";
        lightbox.style.visibility = "visible";
        lightbox.style.opacity = "1";
    }

    uploadBtn.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("gallery-image");
                img.dataset.likes = 0;
                img.addEventListener("click", () => openLightbox(img));
                galleryContainer.appendChild(img);
                saveGallery();
            };
            reader.readAsDataURL(file);
        }
    });

    likeBtn.addEventListener("click", () => {
        if (currentImage) {
            currentImage.dataset.likes = parseInt(currentImage.dataset.likes) + 1;
            likeCount.textContent = currentImage.dataset.likes;
            saveGallery();
        }
    });

    deleteBtn.addEventListener("click", () => {
        if (currentImage) {
            currentImage.remove();
            lightbox.style.visibility = "hidden";
            lightbox.style.opacity = "0";
            saveGallery();
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

    saveDiaryBtn.addEventListener("click", () => {
        localStorage.setItem("diary", diaryText.value);
    });

    diaryText.value = localStorage.getItem("diary") || "";

    changeMusicBtn.addEventListener("click", () => {
        const file = musicInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem("music", e.target.result);
                musicPlayer.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    musicPlayer.src = localStorage.getItem("music") || "";
    loadGallery();
});
