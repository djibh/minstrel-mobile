import { apiGet, apiPut } from './client';

export type PCloudStatus = {
    connected: boolean;
};

export type PCloudConfig = {
    isConfigured: boolean;
    apiBaseUrl: string;
};

export async function getPCloudStatus(): Promise<PCloudStatus> {
    return apiGet<PCloudStatus>('/sources/pcloud/status');
}

export async function getPCloudConfig(): Promise<PCloudConfig> {
    return apiGet<PCloudConfig>('/sources/pcloud/config');
}

export type PCloudConfigPayload = {
    email: string;
    password: string;
    musicFolderPath: string;
    apiBaseUrl: string;
    verificationCode?: string;
};

export type PCloudConfigResult = {
    connected: boolean;
    requiresVerification?: boolean;
    error?: string;
};

export async function updatePCloudConfig(payload: PCloudConfigPayload): Promise<PCloudConfigResult> {
    return apiPut<PCloudConfigResult>('/sources/pcloud/config', payload);
}

export type WebDavStatus = {
    connected: boolean;
};

export type WebDavConfig = {
    isConfigured: boolean;
    serverUrl: string;
    username: string;
    musicFolderPath: string;
};

export async function getWebDavStatus(): Promise<WebDavStatus> {
    return apiGet<WebDavStatus>('/sources/webdav/status');
}

export async function getWebDavConfig(): Promise<WebDavConfig> {
    return apiGet<WebDavConfig>('/sources/webdav/config');
}

export type WebDavConfigPayload = {
    serverUrl: string;
    username: string;
    password: string;
    musicFolderPath: string;
};

export type WebDavConfigResult = {
    connected: boolean;
    error?: string;
};

export async function updateWebDavConfig(payload: WebDavConfigPayload): Promise<WebDavConfigResult> {
    return apiPut<WebDavConfigResult>('/sources/webdav/config', payload);
}
