export interface TorrentTransmissionData {
    isDone: boolean;
    downloaded: number;
    downloadSpeed: number;
    uploaded: number;
    uploadSpeed: number;
    progress: number;
}