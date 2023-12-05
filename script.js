let client = AgoraRTC.createClient(
    {
        mode:"rtc",
        codec:"vp8"
    }
)

let config = {
    appid: "264655385f5c48549bae0190c6b6bc2b",
    token: "007eJxTYGhaz1z6Mj+5folPzBe198VBxTUxvbdT2zgkZnzO4A+1mqzAYGRmYmZqamxhmmaabGJhamKZlJhqYGhpkGyWZJaUbJQkvjwvtSGQkeFArSsrIwMEgvjcDFWZOTmZ+XkKmXnJDAwA1qcgqg==",
    uid: null,
    channel: "zillion inc",
}

let localTracks = {
    audioTracks:null,
    videoTracks:null,
}

let remoteTracks = {}

document.getElementById("join-btn").addEventListener("click", async ()=> {
    console.log("User Joined stream")
    await joinStreams()
})

let joinStreams = async () => {


    [config.uid, localTracks.audioTracks, localTracks.videoTracks] = await Promise.all([
        client.join(config.appid, config.channel, config.token, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ])

    let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}" >
        <p class="user-uid" >${config.uid}</p>
        <div class="video-player player" id="stream-${config.uid}" ></div>
    </div>`

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
    localTracks.videoTracks.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTracks, localTracks.videoTracks])

    client.on("user-published", handleUserJoined)
}

let handleUserJoined = async (user, mediaType) => {
    console.log("user has joined our stream")
    remoteTracks[user.uid] = user

    await subscribe(user, mediaType)

    if (mediaType === "video") {
        let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}" >
            <p class="user-uid" >${user.uid}</p>
            <div class="video-player player" id="stream-${user.uid}" ></div>
        </div>`
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
        user.videoTracks.play(`stream-${config.uid}`)
    }

}