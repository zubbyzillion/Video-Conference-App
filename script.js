let client = AgoraRTC.createClient(
    {
        mode:"rtc",
        codec:"vp8"
    }
)

let config = {
    appid: "264655385f5c48549bae0190c6b6bc2b",
    token: "007eJxTYFg2n++683SGs2snznX7N1Wi2FPsdD+Lm6bitlWv3f/e+CygwGBkZmJmampsYZpmmmxiYWpimZSYamBoaZBslmSWlGyUNFGnOrUhkJFh2sV5jIwMEAjiczNUZebkZObnKWTmJTMwAAAmlyId",
    uid: null,
    channel: "zillion inc",
}

let localTracks = {
    audioTrack:null,
    videoTrack:null,
}

let remoteTracks = {}

document.getElementById("join-btn").addEventListener("click", async ()=> {
    console.log("User Joined stream")
    await joinStreams()
})

document.getElementById('leave-btn', )

let joinStreams = async () => {


    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ])

    let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}" >
        <p class="user-uid" >${config.uid}</p>
        <div class="video-player player" id="stream-${config.uid}" ></div>
    </div>`

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
    localTracks.videoTrack.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTrack, localTracks.videoTrack])

    client.on("user-published", handleUserJoined)
}

let handleUserLeft = async (user) => {
    console.log("User has left")
    delete remoteTracks[user.uid]
    document.getElementById(`video-wrappere-${user.uid}`)
}

let handleUserJoined = async (user, mediaType) => {
    console.log("user has joined our stream")
    remoteTracks[user.uid] = user

    await client.subscribe(user, mediaType)

    if (mediaType === "video") {
        let videoPlayer = `<div class="video-containers" id="video-wrapper-${user.uid}" >
            <p class="user-uid" >${user.uid}</p>
            <div class="video-player player" id="stream-${user.uid}" ></div>
        </div>`
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
        user.videoTrack.play(`stream-${user.uid}`)
    }

    if (mediaType === "audio") {
        user.audioTrack.play()
    }

}