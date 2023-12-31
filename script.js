let client = AgoraRTC.createClient(
    {
        mode:"rtc",
        codec:"vp8"
    }
)

let config = {
    appid: "264655385f5c48549bae0190c6b6bc2b",
    token: "007eJxTYCgp/MqzgbtTZ0rlijMi6zf3GhxhuzJ3/ttveT1f6k/zpocpMBiZmZiZmhpbmKaZJptYmJpYJiWmGhhaGiSbJZklJRsl3ZpYk9oQyMjQGfOKiZEBAkF8boaqzJyczPw8hcy8ZAYGAJDsI5k=",
    uid: null,
    channel: "zillion inc",
}

let localTracks = {
    audioTrack:null,
    videoTrack:null,
}

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
}

let remoteTracks = {}

document.getElementById("join-btn").addEventListener("click", async ()=> {
    console.log("User Joined stream")
    await joinStreams()
})

document.getElementById("mic-btn").addEventListener("click", async () => {
    if(!localTrackState.audioTrackMuted){
        await localTracks.audioTrack.setMuted(true)
        localTrackState.audioTrackMuted = true
    }else{
        await localTracks.audioTrack.setMuted(false)
        localTrackState.audioTrackMuted = false
    }
})

// document.getElementById("camera-btn").addEventListener("click", async () => {
//     if(!localTrackState.videoTrackMuted){
//         await localTracks.videoTrack.setMuted(true)
//         localTrackState.videoTrackMuted = true
//     }else{
//         await localTracks.videoTrack.setMuted(false)
//         localTrackState.videoTrackMuted = false
//     }
// })

document.getElementById('leave-btn').addEventListener("click", async () => {
    for(trackName in localTracks){
        let track = localTracks[trackName]
        if(track){
            //Stops camera and mic
            track.stop()
            //Disconnects from your camera and mic
            track.close()
            localTracks[trackName] = null
        }
    }

    await client.leave()
    document.getElementById('user-streams').innerHTML = ""
})

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