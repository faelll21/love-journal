// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Menambahkan gambar ke galeri
function addImageToGallery(url, imageId) {
    const galleryContainer = document.querySelector(".gallery-container");

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");
    imgContainer.id = imageId;

    const img = document.createElement("img");
    img.src = url;
    img.classList.add("image");

    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.innerHTML = "❤️";
    likeButton.addEventListener("click", function() {
        if (likeButton.style.color === "red") {
            likeButton.style.color = "black";
        } else {
            likeButton.style.color = "red";
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = "❌";
    deleteButton.addEventListener("click", function() {
        deleteImage(imageId);
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(likeButton);
    imgContainer.appendChild(deleteButton);
    galleryContainer.appendChild(imgContainer);
}

// Menghapus gambar dari galeri
function deleteImage(imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
        imageElement.remove();  // Menghapus gambar dari galeri
        db.collection("images").doc(imageId).delete();  // Hapus gambar dari Firestore
    }
}

// Mengganti ke mode border
document.getElementById("border-mode").addEventListener("click", function() {
    const galleryContainer = document.querySelector(".gallery-container");
    galleryContainer.classList.remove("swipe-mode");
    galleryContainer.classList.add("border-mode");
});

// Mengganti ke mode swipe
document.getElementById("swipe-mode").addEventListener("click", function() {
    const galleryContainer = document.querySelector(".gallery-container");
    galleryContainer.classList.remove("border-mode");
    galleryContainer.classList.add("swipe-mode");
});

// Menyimpan gambar ke Firestore dan menampilkan gambar secara real-time
document.getElementById("upload-btn").addEventListener("click", function() {
    const fileInput = document.getElementById("file-input");
    const galleryContainer = document.querySelector(".gallery-container");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const imageId = new Date().getTime().toString();  // ID unik berdasarkan waktu
            addImageToGallery(imageUrl, imageId);

            // Simpan gambar ke Firestore
            db.collection("images").add({
                imageUrl: imageUrl,
                timestamp: new Date()
            });
        };

        reader.readAsDataURL(file);
    }
});

// Memuat gambar dari Firestore secara real-time
window.onload = function() {
    const savedDiary = localStorage.getItem("diary");
    if (savedDiary) {
        document.getElementById("diary-text").value = savedDiary;
    }

    // Memuat gambar dari Firestore secara real-time
    db.collection("images").orderBy("timestamp").onSnapshot(snapshot => {
        const galleryContainer = document.querySelector(".gallery-container");
        galleryContainer.innerHTML = "";  // Clear gallery before loading new images
        snapshot.forEach(doc => {
            const imageUrl = doc.data().imageUrl;
            const imageId = doc.id;
            addImageToGallery(imageUrl, imageId);
        });
    });
};

// Fungsi untuk mengganti musik
document.getElementById("change-music").addEventListener("click", function() {
    const musicInput = document.getElementById("music-input");
    const musicPlayer = document.getElementById("music-player");

    if (musicInput.files.length > 0) {
        const file = musicInput.files[0];
        const objectURL = URL.createObjectURL(file);
        musicPlayer.src = objectURL;
        musicPlayer.play();
    }
});
