document.getElementById("upload-btn").addEventListener("click", function () {
    const fileInput = document.getElementById("file-input");
    const galleryContainer = document.querySelector(".gallery-container");
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            galleryContainer.appendChild(img);
            
            // Simpan gambar ke localStorage
            let savedImages = JSON.parse(localStorage.getItem("gallery")) || [];
            savedImages.push(e.target.result);
            localStorage.setItem("gallery", JSON.stringify(savedImages));
        };
        
        reader.readAsDataURL(file);
    }
});

document.getElementById("save-diary").addEventListener("click", function () {
    const diaryText = document.getElementById("diary-text").value;
    if (diaryText.trim() !== "") {
        localStorage.setItem("diary", diaryText);
        alert("Diary berhasil disimpan!");
    }
});

window.onload = function () {
    // Load diary dari localStorage
    const savedDiary = localStorage.getItem("diary");
    if (savedDiary) {
        document.getElementById("diary-text").value = savedDiary;
    }
    
    // Load gambar dari localStorage
    const savedImages = JSON.parse(localStorage.getItem("gallery")) || [];
    const galleryContainer = document.querySelector(".gallery-container");
    savedImages.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        galleryContainer.appendChild(img);
    });
};

document.getElementById("change-music").addEventListener("click", function () {
    const musicInput = document.getElementById("music-input");
    const musicPlayer = document.getElementById("music-player");
    
    if (musicInput.files.length > 0) {
        const file = musicInput.files[0];
        const objectURL = URL.createObjectURL(file);
        musicPlayer.src = objectURL;
        musicPlayer.play();
    }
});
