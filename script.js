let client = AgoraRTC.createClient(
    {
        mode: "rtc",
        'codec':"vp8"
    }
)

let config = {
    appid: "264655385f5c48549bae0190c6b6bc2b",
    token: "007eJxTYDiaEfKnKLjXd9v87aF5n7I15m1SDNS9vPas5EuWduupFwQUGIzMTMxMTY0tTNNMk00sTE0skxJTDQwtDZLNksySko2S+DdlpzYEMjIcOvGRgREKQXxuhqrMnJzM/DyFzLxkBgYAUNoiqA==",
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

    [config.uid, localTracks.audioTracks, localTracks] = await Promise.all([
        client.join(config.appid, config.channel, config.token),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ])

    let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}" >
        <p class="user-uid" >${config.uid}</p>
        <div class="video-player player" id="stream-${config.uid}" ></div>
    </div>`

    document.getElementById('user-streams').insertAdjacentElement('beforeend', videoPlayer)
    localTracks.videoTracks.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTracks, localTracks.videoTracks])
}