document.addEventListener("DOMContentLoaded", function() {
    const videoCardContainer = document.querySelector(".video-wrapper");
    
    if (!videoCardContainer) {
        console.error("Error: Could not find .video-wrapper element in the DOM.");
        return;
    }

    let api_key = "AIzaSyA-inwT83lvNMl7bl7oZnZnk2xo9j7zShk";
    let video_http = "https://www.googleapis.com/youtube/v3/videos?";
    let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

    fetch(
        video_http + new URLSearchParams({
            part: "snippet, contentDetails, statistics, player",
            chart: "mostPopular",
            maxResults: 50,
            regionCode: "IN",
            key: api_key,
        })
    )
        .then((res) => res.json())
        .then((data) => {
            data.items.forEach((item) => {
                getChannelIcon(item);
            });
        })
        .catch((err) => console.log(err));

    const getChannelIcon = (video_data) => {
        fetch(
            channel_http + new URLSearchParams({
                key: api_key,
                part: "snippet",
                id: video_data.snippet.channelId,
            })
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.items && data.items.length > 0) {
                    video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
                    makeVideoCard(video_data);
                } else {
                    // Handle case when no channel data is returned
                    console.error("No channel data found for video:", video_data);
                }
            })
            .catch((error) => {
                console.error("Error fetching channel data:", error);
            });
    };

    const playVideo = (embedHtml) => {
        sessionStorage.setItem("videoEmbedHtml",embedHtml);

        window.location.href = "video-page.html";
    }

    const makeVideoCard = (data) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video");
        videoCard.innerHTML = `
            <div class="video-content">
                <img src="${data.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail">
            </div>
            <div class="video-details">
                <div class="channel-logo">
                    <img src="${data.channelThumbnail}" alt="" class="channel-icon">
                </div>
                <div class="details">
                    <h3 class="title">${data.snippet.title}</h3>
                    <div class="channel-name">${data.snippet.channelTitle}</div>
                </div>
            </div>
        `;
        videoCard.addEventListener("click", () =>{
            playVideo(data.player.embedHtml);
        });

        videoCardContainer.appendChild(videoCard);
    };
});




