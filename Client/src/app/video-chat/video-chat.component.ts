import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { WebSocketService } from '../chat/service/web-socket.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {
  staffIdProfile!: string;
  loginUser!: string;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  peerConnection: RTCPeerConnection;
  signalSubscription: Subscription | undefined;
  isMuted: boolean = false;
  isSpeakerOn: boolean = true;
  ringtone = new Audio('assets/ata-majhi-3593.mp3');
  config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' }
    ]
  };

  constructor(private webSocketService: WebSocketService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('staffId');
      this.staffIdProfile = encodedId ? Base64.decode(encodedId) : '';
    });
    this.loginUser = sessionStorage.getItem('userId') || '';
    this.peerConnection = new RTCPeerConnection(this.config);
  }

  ngOnInit(): void {
    // Check media devices and initialize WebSocket connection
    this.checkMediaDevices()
      .then(() => this.webSocketService.connect())
      .then(() => {
        this.setupPeerConnection();
        this.startLocalStream();
        this.signalSubscription = this.webSocketService.getSignal(this.loginUser).subscribe(
          signal => this.handleSignal(signal),
          error => console.error('WebSocket signal error:', error)
        );
      })
      .catch(error => {
        console.error('Initialization error:', error);
        alert('Error initializing video chat. Please check your camera and microphone settings.');
      });
  }

  ngOnDestroy(): void {
    this.endCall();
  }

  async checkMediaDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('Available media devices:', devices);

      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      console.log('Video devices:', videoDevices);
      console.log('Audio devices:', audioDevices);

      if (videoDevices.length > 0 || audioDevices.length > 0) {
        const constraints = {
          video: videoDevices.length > 0,
          audio: audioDevices.length > 0,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Media stream obtained:', stream);
      }
    } catch (error) {
      console.error('Error checking media devices:', error);
    }
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      if (localVideo && this.localStream) {
        localVideo.srcObject = this.localStream;
        this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream!));
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing media devices. Please check your camera and microphone settings.');
    }
  }

  setupPeerConnection() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.webSocketService.sendSignal({
          type: 'candidate',
          candidate: event.candidate,
          sender: this.loginUser,
          receiver: this.staffIdProfile
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (event.streams && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
      console.log('Remote stream added:', event.streams[0]);
    };
  }

  async call() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.webSocketService.sendSignal({
        type: 'offer',
        sdp: offer.sdp,
        sender: this.loginUser,
        receiver: this.staffIdProfile
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  async handleSignal(signal: any) {
    try {
      if (signal.type === 'offer') {
        this.playRingtone();
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signal.sdp }));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.webSocketService.sendSignal({
          type: 'answer',
          sdp: answer.sdp,
          sender: this.loginUser,
          receiver: this.staffIdProfile
        });
      } else if (signal.type === 'answer') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signal.sdp }));
      } else if (signal.type === 'candidate') {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }

  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    if (this.signalSubscription) {
      this.signalSubscription.unsubscribe();
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.localStream = undefined;
    this.remoteStream = undefined;
    this.stopRingtone();
  }

  toggleMute() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      this.isMuted = !this.isMuted;
    }
  }

  toggleSpeaker() {
    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    if (remoteVideo) {
      remoteVideo.muted = !remoteVideo.muted;
      this.isSpeakerOn = !this.isSpeakerOn;
    }
  }

  playRingtone() {
    if (this.ringtone) {
      this.ringtone.play();
    }
  }

  stopRingtone() {
    if (this.ringtone) {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
    }
  }
}
