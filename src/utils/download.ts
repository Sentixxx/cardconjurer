export function downloadBlob(filename: string, blob: Blob): void {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, text: string, mime = 'application/json'): void {
  downloadBlob(filename, new Blob([text], { type: mime }));
}

export function readTextFile(file: File): Promise<string> {
  return file.text();
}
