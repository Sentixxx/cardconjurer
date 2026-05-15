import { useState, type ChangeEvent, type JSX } from 'react';
import { convertCardImage } from '@/services/converter';
import { downloadBlob } from '@/utils/download';

type Status = 'idle' | 'working' | 'done' | 'error';

export function ConverterPage(): JSX.Element {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const processOne = async (file: File): Promise<void> => {
    const sourceUrl = URL.createObjectURL(file);
    try {
      const { blob, versionRecognized } = await convertCardImage(sourceUrl);
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'converted';
      downloadBlob(`${baseName}.png`, blob);
      setMessage(
        versionRecognized
          ? `Converted ${file.name} — downloaded as ${baseName}.png.`
          : `Converted ${file.name}, but the card type was unrecognized; the copyright line may be misplaced.`,
      );
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    event.target.value = '';
    if (!files || files.length === 0) return;
    setStatus('working');
    try {
      for (const file of Array.from(files)) {
        setMessage(`Converting ${file.name}…`);
        await processOne(file);
      }
      setStatus('done');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Conversion failed');
    }
  };

  return (
    <>
      <h2 className="readable-background header-extension title center margin-bottom-large">
        MPC转普通尺寸转换器
      </h2>
      <div className="layer margin-bottom-large">
        <div className="padding margin-bottom readable-background">
          <h5 className="margin-bottom padding input-description">上传您想要转换的图片</h5>
          <div className="padding drop-area">
            <h5 className="margin-bottom padding input-description">拖拽文件到此处</h5>
            <input
              type="file"
              multiple
              accept=".png, .svg, .jpg, .jpeg, .bmp, .webp"
              placeholder="File Upload"
              className="input"
              onChange={(event) => void onFileChange(event)}
            />
            <p>
              <small>
                状态：<code>{status}</code>
              </small>
            </p>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
      <div className="readable-background layer margin-bottom-large">
        <h3 className="padding margin-bottom center">将MPC尺寸的卡牌转换为普通尺寸</h3>
        <h4 className="padding">只需上传您的卡牌图片（一次一张），转换完成的文件将自动下载。</h4>
      </div>
    </>
  );
}
