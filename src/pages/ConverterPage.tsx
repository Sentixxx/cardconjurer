import { useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { convertCardImage } from '@/services/converter';
import { downloadBlob } from '@/utils/download';

type Status = 'idle' | 'working' | 'done' | 'error';

export function ConverterPage(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setStatus('working');
    setMessage(`Converting ${file.name}…`);
    const sourceUrl = URL.createObjectURL(file);
    try {
      const { blob, versionRecognized } = await convertCardImage(sourceUrl);
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'converted';
      downloadBlob(`${baseName}.png`, blob);
      setStatus('done');
      setMessage(
        versionRecognized
          ? `Converted ${file.name} — downloaded as ${baseName}.png.`
          : `Converted ${file.name}, but the card type was unrecognized; the copyright line may be misplaced.`,
      );
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  };

  return (
    <>
      <Placeholder
        routeKey="converter"
        description="Card-image converter — crops + masks an uploaded card image and overlays the Wizards copyright line, matching the legacy /converter tool."
      />
      <section>
        <h2>Upload a card image</h2>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={status === 'working'}>
          Choose image…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <p>
          <small>Status: <code>{status}</code></small>
        </p>
        {message && <p>{message}</p>}
        <p>
          <small>
            Output is a 1500 × 2100 PNG with corners masked off and the Wizards copyright line auto-placed
            via pixel-based type detection (1:1 with the legacy <code>converter.js</code> algorithm).
          </small>
        </p>
      </section>
    </>
  );
}
