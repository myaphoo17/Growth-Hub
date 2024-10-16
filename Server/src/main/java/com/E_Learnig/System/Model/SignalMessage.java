package com.E_Learnig.System.Model;

public class SignalMessage {
    private String type;
    private String sdp;
    private String candidate;
    private String sender;
    private String receiver;

    public SignalMessage() {
    }

    public SignalMessage(String type, String sdp, String candidate, String sender, String receiver) {
        this.type = type;
        this.sdp = sdp;
        this.candidate = candidate;
        this.sender = sender;
        this.receiver = receiver;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    @Override
    public String toString() {
        return "SignalMessage{" +
                "type='" + type + '\'' +
                ", sdp='" + sdp + '\'' +
                ", candidate='" + candidate + '\'' +
                ", sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                '}';
    }
}
