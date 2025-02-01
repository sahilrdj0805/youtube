const apiKey = "AIzaSyB_hbfD4Z6lC0neHeRqyeUM-D_NSc2sRqA";
const categoryId=28;

async function Technology(categoryId) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=${categoryId}&regionCode=US&maxResults=50&key=${apiKey}`
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);


    const container = document.querySelector(".container");

    data.items.map((video) => {
        const card = document.createElement("div");
        card.classList.add("card");


        card.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" />
            <div class="info">
                <h2>${video.snippet.title}</h2>
                <p class="cTitle">${video.snippet.channelTitle}</p>
               
            </div>`;
        card.addEventListener("click", () => {
            // Redirect to the video page with video ID
            window.location.href = `video.html?videoId=${video.id.videoId}`;
        });
        container.appendChild(card);
    });
}

Technology(categoryId);



document.querySelector(".search-button").addEventListener("click", (event) => {
    event.preventDefault(); 

    const query = document.querySelector(".search").value.trim();
    
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});


let voiceBtn = document.querySelector(".voice-btn");
let voiceModal = document.getElementById("voice-modal");
let voiceText = document.getElementById("voice-text");

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (speechRecognition) {
    let recognition = new speechRecognition();


    function speak(text) {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 0.9;
        text_speak.pitch = 0.8;
        text_speak.volume = 1;
        text_speak.lang = "en-US"; // Set to Hindi if needed: "hi-IN"
        window.speechSynthesis.speak(text_speak);
    }

    let timeout;
    let inactivityTimeout;

    recognition.onstart = function () {
        voiceModal.style.display = "flex";
        voiceText.innerText = "Listening...";

        // Set a timeout to check if user speaks within 5 seconds
        timeout = setTimeout(() => {
            voiceText.innerText = "Can't hear, try again.";
            speak("Can't hear, try again.");
            recognition.stop();
        }, 5000); // 5 seconds timeout
        inactivityTimeout = setTimeout(() => {
            voiceModal.style.display = 'none'; // Close the popup
          }, 7000);
    };

    recognition.onresult = function (event) {
        clearTimeout(timeout); // Clear timeout if speech is detected

        let transcript = event.results[0][0].transcript;
        voiceText.innerText = `Searching: "${transcript}"`;

        speak(`Searching for ${transcript} on YouTube.`);

        setTimeout(() => {
            voiceModal.style.display = "none";
            window.location.href = `search.html?q=${encodeURIComponent(transcript)}`;
        }, 1000);
    };

    recognition.onspeechend = function () {
        clearTimeout(timeout);
        recognition.stop();
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        voiceText.innerText = "Error: Can't hear, try again.";
        speak("Can't hear, try again.");
        recognition.stop();
    };

    voiceBtn.addEventListener("click", () => {
        console.log("Mic button clicked");
        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    });
} else {
    console.error("Speech Recognition API not supported in this browser.");
    alert("Your browser does not support speech recognition.");
}
document.addEventListener("DOMContentLoaded", function () {
    // Get all menu items
    const menuItems = document.querySelectorAll(".menu-item");

    // Get current page filename
    let currentPage = window.location.pathname.split("/").pop();

    // Remove active class from all before applying
    menuItems.forEach(item => item.classList.remove("active"));

    // Apply styles separately for each page
    if (currentPage === "index.html") {
        document.querySelector('.menu-item[href="./index.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./index.html"]').style.Color = "red";
    }
    if (currentPage === "gaming.html") {
        document.querySelector('.menu-item[href="./gaming.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./gaming.html"]').style.Color = "red";
    }
    if (currentPage === "blog.html") {
        document.querySelector('.menu-item[href="./blog.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./blog.html"]').style.Color = "red";
    }
    if (currentPage === "sports.html") {
        document.querySelector('.menu-item[href="./sports.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./sports.html"]').style.Color = "red";
    }
    if (currentPage === "technology.html") {
        document.querySelector('.menu-item[href="./technology.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./technology.html"]').style.Color = "red";
    }
    if (currentPage === "music.html") {
        document.querySelector('.menu-item[href="./music.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./music.html"]').style.Color = "red";
    }
    if (currentPage === "news.html") {
        document.querySelector('.menu-item[href="./news.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./news.html"]').style.Color = "red";
    }
    if (currentPage === "education.html") {
        document.querySelector('.menu-item[href="./education.html"]').classList.add("active");
        document.querySelector('.menu-item[href="./education.html"]').style.Color = "red";
    }
});
