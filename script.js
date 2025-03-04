// Firebase config and initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

// Handle Image Upload
document.getElementById("upload-btn").addEventListener("click", function () {
    const fileInput = document.getElementById("file-input");
    const galleryContainer = document.querySelector(".gallery-container");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = storage.ref("images/" + file.name);
        storageRef.put(file).then(snapshot => {
            storageRef.getDownloadURL().then(url => {
                // Save image URL to Firestore
                db.collection("gallery").add({
                    url: url,
                    likes: 0
                });

                // Display the uploaded image
                const img = document.createElement("img");
                img.src = url;
                img.classList.add("gallery-img");

                // Animasi smooth
                img.addEventListener('click', function () {
                    img.classList.toggle("zoom-in");
                });

                // Display Like button
                const likeBtn = document.createElement("button");
                likeBtn.textContent = "❤️ Like";
                likeBtn.classList.add("like-btn");
                
                // Like functionality
                likeBtn.addEventListener("click", function () {
                    db.collection("gallery").where("url", "==", url).get().then(snapshot => {
                        snapshot.forEach(doc => {
                            const likeCount = doc.data().likes || 0;
                            db.collection("gallery").doc(doc.id).update({
                                likes: likeCount + 1
                            });
                        });
                    });
                });

                // Append to gallery
                const imgContainer = document.createElement("div");
                imgContainer.appendChild(img);
                imgContainer.appendChild(likeBtn);
                galleryContainer.appendChild(imgContainer);
            });
        });
    }
});

// Load images and likes from Firebase on page load
window.onload = function () {
    const galleryContainer = document.querySelector(".gallery-container");
    db.collection("gallery").get().then(snapshot => {
        snapshot.forEach(doc => {
            const img = document.createElement("img");
            img.src = doc.data().url;
            img.classList.add("gallery-img");

            // Animasi smooth
            img.addEventListener('click', function () {
                img.classList.toggle("zoom-in");
            });

            // Display Like button
            const likeBtn = document.createElement("button");
            likeBtn.textContent = `❤️ Like ${doc.data().likes}`;
            likeBtn.classList.add("like-btn");
            
            // Like functionality
            likeBtn.addEventListener("click", function () {
                const likeCount = doc.data().likes || 0;
                db.collection("gallery").doc(doc.id).update({
                    likes: likeCount + 1
                });
            });

            // Append to gallery
            const imgContainer = document.createElement("div");
            imgContainer.appendChild(img);
            imgContainer.appendChild(likeBtn);
            galleryContainer.appendChild(imgContainer);
        });
    });
};

// Handle Diary Save
document.getElementById("save-diary").addEventListener("click", function () {
    const diaryText = document.getElementById("diary-text").value;
    if (diaryText.trim() !== "") {
        db.collection("diary").add({
            text: diaryText,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Diary berhasil disimpan!");
        }).catch(error => {
            alert("Terjadi kesalahan: " + error.message);
        });
    }
});

// Handle Music Upload
document.getElementById("change-music").addEventListener("click", function () {
    const musicInput = document.getElementById("music-input");
    const musicPlayer = document.getElementById("music-player");

    if (musicInput.files.length > 0) {
        const file = musicInput.files[0];
        const storageRef = storage.ref("music/" + file.name);
        storageRef.put(file).then(snapshot => {
            storageRef.getDownloadURL().then(url => {
                musicPlayer.src = url;
                musicPlayer.play();
            });
        });
    }
});
