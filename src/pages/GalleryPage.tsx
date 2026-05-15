import { useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { useSavedCards } from '@/hooks/useSavedCards';
import { useNavigate } from '@/lib/router';
import { downloadTextFile, readTextFile } from '@/utils/download';

export function GalleryPage(): JSX.Element {
  const { registry, remove, refresh, exportJson, importJson } = useSavedCards();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [lastImport, setLastImport] = useState<string | null>(null);

  const onExport = (): void => {
    downloadTextFile(`cardforger-cards-${new Date().toISOString().slice(0, 10)}.json`, exportJson());
  };

  const onImportClick = (): void => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await readTextFile(file);
      const report = importJson(text);
      setLastImport(`Imported ${report.accepted.length} card(s); skipped ${report.skipped}.`);
    } catch {
      setLastImport('Import failed: could not read file.');
    }
  };

  return (
    <>
      <Placeholder
        routeKey="gallery"
        description="Saved cards from localStorage (legacy contract: cardKeyList + per-card keys)."
      />
      <section>
        <h2>Saved cards ({registry.keys.length})</h2>
        <button type="button" onClick={refresh}>
          Refresh
        </button>{' '}
        <button type="button" onClick={onExport} disabled={registry.keys.length === 0}>
          Export JSON
        </button>{' '}
        <button type="button" onClick={onImportClick}>
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        {lastImport && <p>{lastImport}</p>}
        {registry.keys.length === 0 ? (
          <p>No cards saved yet.</p>
        ) : (
          <ul>
            {registry.keys.map((key) => (
              <li key={key}>
                <span>{key}</span>{' '}
                <button type="button" onClick={() => navigate('creator', { key })}>
                  Load
                </button>{' '}
                <button type="button" onClick={() => remove(key)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
