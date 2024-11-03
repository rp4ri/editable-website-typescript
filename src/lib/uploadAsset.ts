function upload(file: File, path: string, progressCallback?: (percentComplete: number) => void): Promise<XMLHttpRequest> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      }
    };

    if (progressCallback) {
      xhr.upload.onprogress = (e: ProgressEvent<EventTarget>) => {
        if (e.lengthComputable && e.total > 0) {
          const percentComplete = (e.loaded / e.total) * 100;
          progressCallback(Math.floor(percentComplete));
        }
      };
    }

    xhr.open('PUT', '/api/upload-asset');
    xhr.send(formData);
  });
}

export default async function uploadAsset(file: File, path: string, onProgress?: (percentComplete: number) => void): Promise<string> {
  await upload(file, path, onProgress);
  return path;
}
