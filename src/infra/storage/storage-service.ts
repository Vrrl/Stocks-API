export interface IStorageService {
  saveImage(base64: string, name: string, contentType: string): Promise<void>;
}
