export interface IUser {
    username: string;
    userId: string;
    status: boolean;
}

export interface ITorrent{
    name: string;
    infoHash: string;
    stats: {
        isDone: boolean;
        progress: number;
        downloadSpeed: number;
        downloaded: number;
        uploadSpeed: number;
        uploaded: number
    }
}

export interface jsonMessage {
    status: string;
    data: ITorrent | ITorrent[] | any;
    dataLength?: number;
}

export interface AxiosTorrentAll {
    status: string;
    data: ITorrent[];
}