import { getFrameLayoutPreset } from '@/services/framePresets';
import cardImportConfig from './cardImportConfig.json';
import type { CardData, CardFace, CardLayout, FrameColor, Rarity } from '@/types/cardData';

export interface ScryfallArtCandidate {
  readonly id: string;
  readonly name: string;
  readonly setCode: string;
  readonly collectorNumber: string;
  readonly artist: string | null;
  readonly artUrl: string;
}

export interface ScryfallImportCandidate {
  readonly id: string;
  readonly label: string;
  readonly raw: Record<string, unknown>;
}

export type CardImportSource = 'scryfall' | 'mtgch' | 'local';

export async function importScryfallCard(cardName: string, base: CardData): Promise<CardData> {
  const query = cardName.trim();
  if (!query) return base;
  const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    if (response.status === 404) throw new Error(`没有找到 "${query}"。`);
    throw new Error(`Scryfall import failed (${response.status}).`);
  }
  const payload: unknown = await response.json();
  if (!isRecord(payload)) throw new Error('Scryfall returned an unexpected payload.');
  return buildImportedCard(payload, base);
}

export function importScryfallCandidate(candidate: ScryfallImportCandidate, base: CardData): CardData {
  return buildImportedCard(candidate.raw, base);
}

export function importCardCandidate(candidate: ScryfallImportCandidate, base: CardData): CardData {
  return buildImportedCard(candidate.raw, base);
}

export async function searchCardImportCandidates(
  source: CardImportSource,
  cardName: string,
  language = 'en',
  includeAllPrints = false,
): Promise<readonly ScryfallImportCandidate[]> {
  if (source === 'local') {
    return searchLocalImportCandidates(cardName);
  }
  if (source === 'mtgch') {
    return searchMtgchImportCandidates(cardName, language, includeAllPrints);
  }
  return searchScryfallImportCandidates(cardName, language, includeAllPrints);
}

export async function searchScryfallImportCandidates(
  cardName: string,
  language = 'en',
  includeAllPrints = false,
): Promise<readonly ScryfallImportCandidate[]> {
  const query = cardName.trim();
  if (!query) return [];
  const uniqueParam = includeAllPrints ? '&unique=prints' : '';
  const search = encodeURIComponent(`name="${query}" lang:${language}`);
  const response = await fetch(
    `https://api.scryfall.com/cards/search?order=released&include_extras=true${uniqueParam}&q=${search}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Scryfall import search failed (${response.status}).`);
  }
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];
  return payload.data.filter(isRecord).map((card) => readImportCandidate(card, includeAllPrints));
}

export async function searchMtgchImportCandidates(
  cardName: string,
  language = 'en',
  includeAllPrints = false,
): Promise<readonly ScryfallImportCandidate[]> {
  const query = cardName.trim();
  if (!query) return [];
  const preferChinese = language === 'cs' || language === 'zhs';
  let cards = await fetchMtgchSearchCards(query, includeAllPrints);
  if (includeAllPrints) {
    cards = await resolveMtgchVersionCards(cards);
  }
  const normalizedCards = await buildMtgchResponseCards(cards, preferChinese);
  return normalizedCards.map((card) => readImportCandidate(card, includeAllPrints));
}

export async function searchLocalImportCandidates(cardName: string): Promise<readonly ScryfallImportCandidate[]> {
  const query = cardName.trim();
  if (!query) return [];
  try {
    const database = await loadLocalCardDatabase();
    if (!database) return [];
    const result = database.exec(buildLocalCardSearchQuery(query));
    const rows = result[0]?.values ?? [];
    return rows
      .map(localCardRowToObject)
      .filter((card) => readString(card, 'type_line'))
      .map((card) => readImportCandidate(card, false));
  } catch {
    return [];
  }
}

export function importScryfallClipboardText(text: string, base: CardData): CardData {
  const payload = scryfallCardFromClipboardText(text);
  if (!payload.name) throw new Error('剪贴板文本没有可导入的卡名。');
  return buildImportedCard(payload, base);
}

export async function searchScryfallArt(cardName: string): Promise<readonly ScryfallArtCandidate[]> {
  const query = cardName.trim();
  if (!query) return [];
  const search = encodeURIComponent(`name="${query}" lang:en`);
  const response = await fetch(
    `https://api.scryfall.com/cards/search?order=released&include_extras=true&unique=art&q=${search}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Scryfall search failed (${response.status}).`);
  }
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.data)) return [];
  return payload.data.flatMap(readArtCandidates);
}

function readImportCandidate(value: Record<string, unknown>, includeAllPrints: boolean): ScryfallImportCandidate {
  const id = readString(value, 'id') ?? `${readString(value, 'set') ?? 'set'}-${readString(value, 'collector_number') ?? 'card'}`;
  const name = readImportOptionName(value);
  const setCode = readString(value, 'set')?.toUpperCase();
  const collectorNumber = readString(value, 'collector_number');
  const typeLine = readImportedString(value, 'type_line', 'printed_type_line');
  const detail = includeAllPrints
    ? setCode && collectorNumber ? `${setCode} #${collectorNumber}` : setCode ?? collectorNumber
    : typeLine;
  return {
    id,
    label: detail ? `${name} (${detail})` : name,
    raw: value,
  };
}

function readImportOptionName(card: Record<string, unknown>): string {
  let name = readString(card, 'printed_name') ?? readString(card, 'name') ?? 'Imported card';
  const flavorName = readString(card, 'flavor_name');
  const printedName = readString(card, 'printed_name');
  const englishName = readString(card, 'name');
  if (flavorName) {
    name += ` (${flavorName})`;
  } else if (printedName && englishName) {
    name += ` (${englishName})`;
  }
  return name;
}

function readArtCandidates(value: unknown): readonly ScryfallArtCandidate[] {
  if (!isRecord(value)) return [];
  const id = readString(value, 'id');
  const name = readString(value, 'name');
  const setCode = readString(value, 'set');
  const collectorNumber = readString(value, 'collector_number');
  if (!id || !name) return [];

  const direct = readCandidateImage(value.image_uris);
  if (direct) {
    return [{
      id,
      name,
      setCode: setCode?.toUpperCase() ?? '',
      collectorNumber: collectorNumber ?? '',
      artist: readString(value, 'artist'),
      artUrl: direct,
    }];
  }

  if (!Array.isArray(value.card_faces)) return [];
  return value.card_faces.flatMap((face, index): readonly ScryfallArtCandidate[] => {
    if (!isRecord(face)) return [];
    const artUrl = readCandidateImage(face.image_uris);
    if (!artUrl) return [];
    return [{
      id: `${id}-${index}`,
      name: readString(face, 'name') ?? name,
      setCode: setCode?.toUpperCase() ?? '',
      collectorNumber: collectorNumber ?? '',
      artist: readString(face, 'artist') ?? readString(value, 'artist'),
      artUrl,
    }];
  });
}

interface SqlJsDatabase {
  exec: (sql: string) => readonly { readonly values: readonly unknown[][] }[];
}

interface SqlJsModule {
  readonly Database: new (data: Uint8Array) => SqlJsDatabase;
}

interface CardImportConfigFile {
  readonly local?: {
    readonly databasePath?: string;
  };
  readonly sqlJs?: {
    readonly baseUrl?: string;
  };
}

declare global {
  interface Window {
    initSqlJs?: (config: { readonly locateFile: (file: string) => string }) => Promise<SqlJsModule>;
  }
}

const CARD_IMPORT_CONFIG = cardImportConfig as CardImportConfigFile;
const SQL_JS_BASE_URL = CARD_IMPORT_CONFIG.sqlJs?.baseUrl ?? '';
const LOCAL_CARD_DATABASE_PATH = CARD_IMPORT_CONFIG.local?.databasePath ?? '';

let sqlJsLoaderPromise: Promise<void> | null = null;
let localDatabasePromise: Promise<SqlJsDatabase | null> | null = null;

async function loadSqlJs(): Promise<SqlJsModule | null> {
  if (!SQL_JS_BASE_URL || typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (!window.initSqlJs) {
    sqlJsLoaderPromise ??= loadExternalScriptOnce(`${SQL_JS_BASE_URL}/sql-wasm.js`);
    await sqlJsLoaderPromise;
  }
  if (!window.initSqlJs) return null;
  return window.initSqlJs({ locateFile: (file) => `${SQL_JS_BASE_URL}/${file}` });
}

function loadExternalScriptOnce(scriptPath: string): Promise<void> {
  const existing = document.querySelector(`script[src="${scriptPath}"]`);
  if (existing instanceof HTMLScriptElement && existing.dataset.loaded === 'true') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = existing instanceof HTMLScriptElement ? existing : document.createElement('script');
    script.defer = true;
    script.src = scriptPath;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${scriptPath}`));
    if (!existing) document.head.appendChild(script);
  });
}

async function loadLocalCardDatabase(): Promise<SqlJsDatabase | null> {
  localDatabasePromise ??= (async () => {
    if (!LOCAL_CARD_DATABASE_PATH) return null;
    const databaseResponse = await fetch(LOCAL_CARD_DATABASE_PATH);
    if (!databaseResponse.ok) return null;
    const databaseBuffer = await databaseResponse.arrayBuffer();
    if (!isSqliteDatabase(databaseBuffer)) return null;
    const SQL = await loadSqlJs();
    if (!SQL) return null;
    return new SQL.Database(new Uint8Array(databaseBuffer));
  })();
  return localDatabasePromise;
}

function isSqliteDatabase(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, SQLITE_HEADER.length));
  return SQLITE_HEADER.every((byte, index) => bytes[index] === byte);
}

const SQLITE_HEADER = [83, 81, 76, 105, 116, 101, 32, 102, 111, 114, 109, 97, 116, 32, 51, 0] as const;

function buildLocalCardSearchQuery(cardName: string): string {
  const safeName = cardName.replace(/'/g, "''");
  return `SELECT zhs.*, cards.manaCost FROM zhs JOIN cards ON zhs.uuid = cards.uuid WHERE zhs.name LIKE '%${safeName}%'`;
}

function localCardRowToObject(itemArray: readonly unknown[]): Record<string, unknown> {
  return {
    object: 'card',
    id: stringFromValue(itemArray[0]) ?? `local-${stringFromValue(itemArray[1]) ?? 'card'}`,
    number: stringFromValue(itemArray[1]),
    collector_number: stringFromValue(itemArray[1]),
    name: stringFromValue(itemArray[2]) ?? '',
    face_name: stringFromValue(itemArray[3]),
    flavor_name: stringFromValue(itemArray[4]),
    type_line: stringFromValue(itemArray[5]) ?? '',
    oracle_text: stringFromValue(itemArray[6])?.replace(/\\n/g, '\n') ?? '',
    flavor_text: stringFromValue(itemArray[7])?.replace(/\\n/g, '\n') ?? '',
    mana_cost: stringFromValue(itemArray[10]),
    lang: 'cs',
  };
}

function buildMtgchSearchUrl(cardName: string): string {
  const params = new URLSearchParams({
    q: cardName,
    page: '1',
    order: '-released_at',
    priority_chinese: 'true',
    view: '0',
    unique: 'oracle_id',
  });
  return `https://mtgch.com/api/v1/result?${params.toString()}`;
}

function buildMtgchCardDetailUrl(cardId: string): string {
  return `https://mtgch.com/api/v1/card/${encodeURIComponent(cardId)}/`;
}

function buildMtgchVersionsUrl(cardId: string): string {
  return `https://mtgch.com/api/v1/versions/${encodeURIComponent(cardId)}/`;
}

function buildScryfallCardUrl(setCode: string, collectorNumber: string): string {
  return `https://api.scryfall.com/cards/${encodeURIComponent(setCode.toLowerCase())}/${encodeURIComponent(collectorNumber)}`;
}

async function fetchJsonRequest(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed: ${url}`);
  return response.json();
}

function readRecordArray(value: unknown): readonly Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getMtgchSearchCards(result: unknown): readonly Record<string, unknown>[] {
  if (!isRecord(result)) return [];
  return readRecordArray(result.items)
    .concat(readRecordArray(result.results))
    .concat(readRecordArray(result.data))
    .concat(readRecordArray(result.cards));
}

async function fetchMtgchSearchCards(cardName: string, includeAllPrints: boolean): Promise<readonly Record<string, unknown>[]> {
  const result = await fetchJsonRequest(buildMtgchSearchUrl(cardName));
  const cards = getMtgchSearchCards(result);
  return includeAllPrints ? cards.filter((card) => readString(card, 'id')) : cards;
}

async function fetchMtgchCardById(cardId: string): Promise<Record<string, unknown> | null> {
  const result = await fetchJsonRequest(buildMtgchCardDetailUrl(cardId));
  return isRecord(result) ? result : null;
}

async function fetchMtgchVersions(cardId: string): Promise<readonly Record<string, unknown>[]> {
  const result = await fetchJsonRequest(buildMtgchVersionsUrl(cardId));
  return readRecordArray(result);
}

async function resolveMtgchVersionCards(cards: readonly Record<string, unknown>[]): Promise<readonly Record<string, unknown>[]> {
  const versionGroups = await Promise.all(
    cards
      .map((card) => readString(card, 'id'))
      .filter((id): id is string => Boolean(id))
      .map(fetchMtgchVersions),
  );
  const versionIds = [...new Set(versionGroups.flat().map((version) => readString(version, 'id')).filter((id): id is string => Boolean(id)))];
  const details = await Promise.all(versionIds.map(fetchMtgchCardById));
  return details.filter((card): card is Record<string, unknown> => Boolean(card));
}

async function fetchScryfallCard(setCode: string, collectorNumber: string): Promise<Record<string, unknown> | null> {
  const result = await fetchJsonRequest(buildScryfallCardUrl(setCode, collectorNumber));
  return isRecord(result) ? result : null;
}

function getValidString(...values: readonly unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return '';
}

function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function htmlToCardText(html: unknown): string {
  if (typeof html !== 'string' || !html) return '';
  return decodeHtmlEntities(html)
    .replace(/<i class=["']sr-only["']>(.*?)<\/i>/gi, '$1')
    .replace(/<i\b[^>]*>/gi, '')
    .replace(/<\/i>/gi, '')
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '')
    .replace(/<p>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function getBestMtgchImageUris(imageUris: unknown): Record<string, unknown> | null {
  if (!isRecord(imageUris)) return null;
  const artCrop = getValidString(imageUris.art_crop, imageUris.large, imageUris.normal, imageUris.small);
  return artCrop ? { ...imageUris, art_crop: artCrop } : null;
}

function getScryfallFaceImageUris(scryfallCard: Record<string, unknown> | null, faceIndex: number): Record<string, unknown> | null {
  if (!scryfallCard) return null;
  const faces = readRecordArray(scryfallCard.card_faces);
  const faceImageUris = faces[faceIndex]?.image_uris;
  return getBestMtgchImageUris(faceImageUris) ?? getBestMtgchImageUris(scryfallCard.image_uris);
}

async function populateFallbackImageUris(card: Record<string, unknown>): Promise<Record<string, unknown>> {
  const setCode = readString(card, 'set');
  const collectorNumber = readString(card, 'collector_number');
  const faces = readRecordArray(card.card_faces);
  const needsPrimaryImage = !getBestMtgchImageUris(card.image_uris);
  const needsFaceImage = faces.some((face) => !getBestMtgchImageUris(face.image_uris));
  if ((!needsPrimaryImage && !needsFaceImage) || !setCode || !collectorNumber) return card;

  try {
    const scryfallCard = await fetchScryfallCard(setCode, collectorNumber);
    const next: Record<string, unknown> = { ...card };
    if (needsPrimaryImage) {
      next.image_uris = getScryfallFaceImageUris(scryfallCard, readMtgchFaceIndex(card));
    }
    if (needsFaceImage && faces.length > 0) {
      next.card_faces = faces.map((face, index) => ({
        ...face,
        image_uris: getBestMtgchImageUris(face.image_uris) ?? getScryfallFaceImageUris(scryfallCard, index),
      }));
    }
    return next;
  } catch {
    return card;
  }
}

function readMtgchFaceIndex(card: Record<string, unknown>): number {
  const faceIndex = card.face_index;
  return typeof faceIndex === 'number' && faceIndex > -1 ? faceIndex : 0;
}

function getMtgchTranslatedFields(source: Record<string, unknown>): {
  readonly name: string;
  readonly text: string;
  readonly type: string;
  readonly flavorText: string;
  readonly flavorName: string;
} {
  return {
    name: getValidString(
      source.zhs_name,
      source.atomic_official_name,
      source.atomic_translated_name,
      source.full_translated_name,
      source.full_official_name,
      source.display_name,
      source.primary_name,
    ),
    text: getValidString(source.zhs_text, source.atomic_translated_text, source.printed_text, source.oracle_text),
    type: getValidString(source.zhs_type_line, source.atomic_translated_type, source.printed_type_line, source.type_line),
    flavorText: getValidString(
      source.zhs_flavor_text,
      source.atomic_translated_flavor_text,
      source.printed_flavor_text,
      source.flavor_text,
    ),
    flavorName: getValidString(source.zhs_flavor_name, source.atomic_translated_flavor_name, source.flavor_name),
  };
}

function cleanMtgchNormalizedText(normalized: Record<string, unknown>): Record<string, unknown> {
  const oracleText = readString(normalized, 'oracle_text');
  const flavorText = readString(normalized, 'flavor_text');
  const printedText = readString(normalized, 'printed_text');
  if (oracleText) {
    normalized.oracle_text = oracleText.includes('{CARDNAME}') ? oracleText.replace(/\\n/g, '\n') : oracleText.replaceAll('CARDNAME', '{CARDNAME}').replace(/\\n/g, '\n');
  }
  if (flavorText) normalized.flavor_text = flavorText.replace(/\\n/g, '\n');
  if (printedText) normalized.printed_text = printedText.replace(/\\n/g, '\n');
  if (normalized.toughness === null) delete normalized.toughness;
  if (normalized.power === null) delete normalized.power;
  return normalized;
}

function buildMtgchOtherFaceSource(
  face: Record<string, unknown>,
  index: number,
  cardDetail: Record<string, unknown>,
): Record<string, unknown> {
  return {
    object: 'card_face',
    name: readString(face, 'name') ?? readString(face, 'face_name') ?? '',
    face_name: readString(face, 'name') ?? readString(face, 'face_name') ?? '',
    mana_cost: getValidString(face.mana_cost, face.mana_cost_html),
    artist: readString(face, 'artist') ?? readString(cardDetail, 'artist'),
    image_uris: getBestMtgchImageUris(face.image_uris),
    zhs_image_uris: face.zhs_image_uris,
    type_line: getValidString(face.type_line_en, face.type_line),
    printed_type_line: getValidString(face.type_line_zhs, face.type_line_atomic, face.printed_type_line),
    oracle_text: htmlToCardText(face.oracle_text_en_html) || readString(face, 'oracle_text'),
    printed_text: htmlToCardText(face.oracle_text_zhs_html) || htmlToCardText(face.oracle_text_atomic_html) || readString(face, 'printed_text'),
    flavor_text: htmlToCardText(face.flavor_text_en_html) || readString(face, 'flavor_text'),
    printed_flavor_text:
      htmlToCardText(face.flavor_text_zhs_html) || htmlToCardText(face.flavor_text_atomic_html) || readString(face, 'printed_flavor_text'),
    flavor_name: readString(face, 'flavor_name'),
    zhs_name: readString(face, 'name_zhs'),
    atomic_official_name: readString(face, 'name_atomic'),
    atomic_translated_type: face.type_line_atomic,
    atomic_translated_text: face.oracle_text_atomic_html,
    atomic_translated_flavor_text: face.flavor_text_atomic_html,
    atomic_translated_flavor_name: face.flavor_name_zhs,
    face_index: index + 1,
    layout: readString(cardDetail, 'layout') ?? (cardDetail.is_dfc ? 'transform' : 'normal'),
    lang: readString(cardDetail, 'lang') ?? 'en',
  };
}

function buildMtgchPrimarySource(cardDetail: Record<string, unknown>, primaryFace: Record<string, unknown>): Record<string, unknown> {
  const faces = readRecordArray(cardDetail.faces);
  return {
    ...cardDetail,
    name: readString(primaryFace, 'name') ?? readString(cardDetail, 'name'),
    face_name: readString(primaryFace, 'name') ?? readString(cardDetail, 'face_name'),
    mana_cost: getValidString(cardDetail.mana_cost, primaryFace.mana_cost, primaryFace.mana_cost_html),
    artist: readString(cardDetail, 'artist') ?? readString(primaryFace, 'artist'),
    image_uris: getBestMtgchImageUris(cardDetail.image_uris) ?? getBestMtgchImageUris(primaryFace.image_uris),
    zhs_image_uris: cardDetail.zhs_image_uris ?? primaryFace.zhs_image_uris,
    type_line: readString(cardDetail, 'type_line') ?? readString(primaryFace, 'type_line_en'),
    printed_type_line: getValidString(cardDetail.printed_type_line, primaryFace.type_line_zhs, primaryFace.type_line_atomic),
    oracle_text: readString(cardDetail, 'oracle_text') ?? htmlToCardText(primaryFace.oracle_text_en_html),
    printed_text:
      readString(cardDetail, 'printed_text') ??
      getValidString(htmlToCardText(primaryFace.oracle_text_zhs_html), htmlToCardText(primaryFace.oracle_text_atomic_html)),
    flavor_text: readString(cardDetail, 'flavor_text') ?? htmlToCardText(primaryFace.flavor_text_en_html),
    printed_flavor_text:
      readString(cardDetail, 'printed_flavor_text') ??
      getValidString(htmlToCardText(primaryFace.flavor_text_zhs_html), htmlToCardText(primaryFace.flavor_text_atomic_html)),
    flavor_name: readString(cardDetail, 'flavor_name') ?? readString(primaryFace, 'flavor_name'),
    zhs_name: readString(cardDetail, 'zhs_name') ?? readString(primaryFace, 'name_zhs'),
    atomic_official_name: readString(cardDetail, 'atomic_official_name') ?? readString(primaryFace, 'name_atomic'),
    atomic_translated_type: cardDetail.atomic_translated_type ?? primaryFace.type_line_atomic,
    atomic_translated_text: cardDetail.atomic_translated_text ?? primaryFace.oracle_text_atomic_html,
    atomic_translated_flavor_text: cardDetail.atomic_translated_flavor_text ?? primaryFace.flavor_text_atomic_html,
    atomic_translated_flavor_name: cardDetail.atomic_translated_flavor_name ?? primaryFace.flavor_name_zhs,
    object: readString(cardDetail, 'object') ?? 'card',
    layout: readString(cardDetail, 'layout') ?? (cardDetail.is_dfc ? 'transform' : 'normal'),
    lang: readString(cardDetail, 'lang') ?? 'en',
    other_faces: faces.length > 1
      ? faces.slice(1).map((face, index) => buildMtgchOtherFaceSource(face, index, cardDetail))
      : cardDetail.other_faces,
  };
}

function normalizeMtgchCard(cardDetail: Record<string, unknown>, preferChinese: boolean): Record<string, unknown> {
  const faces = readRecordArray(cardDetail.faces);
  const normalizedSource = faces[0] ? buildMtgchPrimarySource(cardDetail, faces[0]) : cardDetail;
  const translated = getMtgchTranslatedFields(normalizedSource);
  const setCode = getValidString(normalizedSource.setCode, normalizedSource.set, normalizedSource.set_code).toLowerCase();
  const normalized: Record<string, unknown> = {
    ...normalizedSource,
    object: readString(normalizedSource, 'object') ?? 'card',
    en_name: getValidString(normalizedSource.en_name, normalizedSource.name, normalizedSource.officialName),
    name: preferChinese ? getValidString(translated.name, normalizedSource.name) : getValidString(normalizedSource.name, translated.name),
    printed_name: getValidString(translated.name, normalizedSource.printed_name),
    lang: preferChinese ? 'cs' : 'en',
    oracle_text: preferChinese
      ? getValidString(translated.text, normalizedSource.oracle_text)
      : getValidString(normalizedSource.oracle_text, translated.text),
    printed_text: getValidString(translated.text, normalizedSource.printed_text),
    type_line: preferChinese
      ? getValidString(translated.type, normalizedSource.type_line)
      : getValidString(normalizedSource.type_line, translated.type),
    printed_type_line: getValidString(translated.type, normalizedSource.printed_type_line),
    mana_cost: getValidString(normalizedSource.manaCost, normalizedSource.mana_cost),
    flavor_text: preferChinese
      ? getValidString(translated.flavorText, normalizedSource.flavor_text)
      : getValidString(normalizedSource.flavor_text, translated.flavorText),
    printed_flavor_text: getValidString(translated.flavorText, normalizedSource.printed_flavor_text),
    flavor_name: getValidString(translated.flavorName, normalizedSource.flavor_name),
    set: setCode,
    setCode,
    collector_number: getValidString(normalizedSource.collector_number, normalizedSource.number),
    number: getValidString(normalizedSource.number, normalizedSource.collector_number),
    illustration_id: getValidString(normalizedSource.illustration_id, normalizedSource.scryfallIllustrationId),
    image_uris: null,
    printed_image_uris: null,
  };
  const otherFaces = readRecordArray(normalizedSource.other_faces);
  if (otherFaces.length > 0) {
    normalized.card_faces = otherFaces.map((face) =>
      normalizeMtgchCard({
        ...normalizedSource,
        ...face,
        image_uris: null,
        zhs_image_uris: face.zhs_image_uris ?? normalizedSource.zhs_image_uris,
        other_faces: [],
      }, preferChinese),
    );
  }
  return cleanMtgchNormalizedText(normalized);
}

async function buildMtgchResponseCards(
  importedCards: readonly Record<string, unknown>[],
  preferChinese: boolean,
): Promise<readonly Record<string, unknown>[]> {
  const cards = importedCards.map((card) => normalizeMtgchCard(card, preferChinese)).filter((card) => readString(card, 'type_line'));
  return Promise.all(cards.map(populateFallbackImageUris));
}

function scryfallCardFromClipboardText(text: string): Record<string, unknown> {
  const lines = text.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return {};
  const nameParts = parseClipboardNameLine(lines.shift() ?? '');
  const cardObject: Record<string, unknown> = {
    name: nameParts.name,
    lang: 'en',
  };
  if (nameParts.manaCost) {
    cardObject.mana_cost = nameParts.manaCost;
  }
  if (lines.length === 0) return cardObject;

  const typeLine = lines.shift() ?? '';
  cardObject.type_line = typeLine;
  if (lines.length === 0) return cardObject;

  if (!applyClipboardStats(cardObject, lines, typeLine)) {
    applyClipboardPowerToughness(cardObject, lines);
  }
  if (lines.length > 0) {
    cardObject.oracle_text = lines.join('\n');
  }
  return cardObject;
}

function parseClipboardNameLine(line: string): { readonly name: string; readonly manaCost?: string } {
  const manaStart = line.indexOf('{');
  if (manaStart > 0) {
    return {
      name: line.slice(0, manaStart).trim(),
      manaCost: line.slice(manaStart).trim(),
    };
  }
  return { name: line.trim() };
}

function applyClipboardStats(cardObject: Record<string, unknown>, lines: string[], typeLine: string): boolean {
  const last = lines[lines.length - 1] ?? '';
  if (!/^[+-]?\d+$/.test(last)) return false;
  if (/\bplaneswalker\b/i.test(typeLine)) {
    cardObject.loyalty = last;
    lines.pop();
    return true;
  }
  if (/\bbattle\b/i.test(typeLine)) {
    cardObject.defense = last;
    lines.pop();
    return true;
  }
  return false;
}

function applyClipboardPowerToughness(cardObject: Record<string, unknown>, lines: string[]): boolean {
  const last = lines[lines.length - 1] ?? '';
  const match = /([0-9+*.-]+)\/([0-9+*.-]+)/.exec(last);
  if (!match) return false;
  cardObject.power = match[1];
  cardObject.toughness = match[2];
  lines.pop();
  return true;
}

function readCandidateImage(value: unknown): string | null {
  if (!isRecord(value)) return null;
  return readString(value, 'art_crop') ?? readString(value, 'large') ?? readString(value, 'normal');
}

function buildImportedCard(source: Record<string, unknown>, base: CardData): CardData {
  const faces = Array.isArray(source.card_faces) ? source.card_faces.filter(isRecord) : [];
  const mainSource = faces[0] ?? source;
  const secondSource = faces[1] ?? null;
  const mainImageUris = isRecord(source.image_uris) ? source.image_uris : mainSource.image_uris;
  const importedName =
    readImportedName(mainSource, source) ??
    readImportedName(source) ??
    base.name;
  const sourceLayout = readString(source, 'layout');
  const isPlanar = sourceLayout === 'planar';
  const importedTypeLine =
    readImportedString(mainSource, 'type_line', 'printed_type_line', source) ??
    readImportedString(source, 'type_line', 'printed_type_line') ??
    base.typeLine;
  const importedRulesText = normalizeOracleText(
    readImportedString(mainSource, 'oracle_text', 'printed_text', source) ??
      readImportedString(source, 'oracle_text', 'printed_text') ??
      '',
    isPlanar,
  );
  const frameVersionId = inferFrameVersionId(source, mainSource, base.frameVersionId);
  const layoutPreset = getFrameLayoutPreset(frameVersionId);
  const replaceExistingLayout = frameVersionId !== base.frameVersionId || isPlanar;
  const layout = (replaceExistingLayout ? layoutPreset?.layout : null) ?? inferLayout(mainSource, source);
  const setCode = readString(source, 'set')?.toUpperCase() ?? base.setCode ?? null;
  const rarity = readRarity(readString(source, 'rarity')) ?? base.rarity;
  const isAdventure = sourceLayout === 'adventure';
  return {
    ...base,
    key: slugify(readString(source, 'en_name') ?? readString(source, 'name') ?? importedName),
    name: importedName,
    typeLine: importedTypeLine,
    rulesText: importedRulesText,
    manaCost: readString(mainSource, 'mana_cost') ?? readString(source, 'mana_cost'),
    adventureName: isAdventure && secondSource ? readImportedName(secondSource, source) : null,
    adventureTypeLine: isAdventure && secondSource ? readImportedString(secondSource, 'type_line', 'printed_type_line', source) : null,
    adventureRulesText: isAdventure && secondSource
      ? normalizeOracleText(readImportedString(secondSource, 'oracle_text', 'printed_text', source) ?? '', false)
      : null,
    adventureManaCost: isAdventure && secondSource ? readString(secondSource, 'mana_cost') : null,
    powerToughness: readPowerToughness(mainSource),
    loyalty: readString(mainSource, 'loyalty') ?? readString(source, 'loyalty'),
    layout,
    sagaSettings: null,
    planeswalkerSettings: null,
    frameVersionId,
    frameUrl: inferFrameUrl(source, frameVersionId, base.frameUrl),
    artUrl: readCandidateImage(mainImageUris),
    artBounds: resolveImportedLayoutValue(layoutPreset?.artBounds, base.artBounds, replaceExistingLayout),
    manaBounds: resolveImportedLayoutValue(layoutPreset?.manaBounds, base.manaBounds, replaceExistingLayout),
    titleBounds: resolveImportedLayoutValue(layoutPreset?.titleBounds, base.titleBounds, replaceExistingLayout),
    typeBounds: resolveImportedLayoutValue(layoutPreset?.typeBounds, base.typeBounds, replaceExistingLayout),
    rulesBounds: resolveImportedLayoutValue(layoutPreset?.rulesBounds, base.rulesBounds, replaceExistingLayout),
    powerToughnessBounds: resolveImportedLayoutValue(
      layoutPreset?.powerToughnessBounds,
      base.powerToughnessBounds,
      replaceExistingLayout,
    ),
    loyaltyBounds: resolveImportedLayoutValue(layoutPreset?.loyaltyBounds, base.loyaltyBounds, replaceExistingLayout),
    artOffsetX: 0,
    artOffsetY: 0,
    artZoom: 1,
    artRotation: 0,
    artGrayscale: false,
    setCode,
    rarity,
    setSymbolUrl: setCode && rarity ? `/img/setSymbols/official/${setCode.toLowerCase()}-${rarity.toLowerCase()}.svg` : base.setSymbolUrl,
    setSymbolBounds: resolveImportedLayoutValue(layoutPreset?.setSymbolBounds, base.setSymbolBounds, replaceExistingLayout),
    setSymbolOffsetX: 0,
    setSymbolOffsetY: 0,
    setSymbolScale: 1,
    watermarkBounds: resolveImportedLayoutValue(layoutPreset?.watermarkBounds, base.watermarkBounds, replaceExistingLayout),
    watermarkOffsetX: 0,
    watermarkOffsetY: 0,
    watermarkScale: 1,
    cardNumber: readString(source, 'collector_number') ?? base.cardNumber,
    artist: readString(mainSource, 'artist') ?? readString(source, 'artist') ?? base.artist,
    flavorText:
      readImportedString(mainSource, 'flavor_text', 'printed_flavor_text', source) ??
      readImportedString(source, 'flavor_text', 'printed_flavor_text') ??
      base.flavorText,
    frameColor: inferFrameColor(source, mainSource) ?? base.frameColor,
    face2: secondSource && !isAdventure ? buildImportedFace(secondSource, base, frameVersionId, source) : null,
    width: replaceExistingLayout ? layoutPreset?.cardWidth ?? base.width : base.width,
    height: replaceExistingLayout ? layoutPreset?.cardHeight ?? base.height : base.height,
  };
}

function resolveImportedLayoutValue<T>(
  presetValue: T | null | undefined,
  baseValue: T | null | undefined,
  replaceExistingLayout: boolean,
): T | null {
  if (replaceExistingLayout) return presetValue ?? baseValue ?? null;
  return baseValue ?? presetValue ?? null;
}

function buildImportedFace(
  source: Record<string, unknown>,
  base: CardData,
  frameVersionId: CardData['frameVersionId'] = base.frameVersionId,
  parentSource: Record<string, unknown> = source,
): CardFace {
  const layoutPreset = getFrameLayoutPreset(frameVersionId);
  const layout = layoutPreset?.layout ?? inferLayout(source, source);
  return {
    name: readImportedName(source, parentSource) ?? 'Reverse Face',
    typeLine: readImportedString(source, 'type_line', 'printed_type_line', parentSource) ?? '',
    rulesText: normalizeOracleText(readImportedString(source, 'oracle_text', 'printed_text', parentSource) ?? '', false),
    manaCost: readString(source, 'mana_cost'),
    adventureName: null,
    adventureTypeLine: null,
    adventureRulesText: null,
    adventureManaCost: null,
    powerToughness: readPowerToughness(source),
    loyalty: readString(source, 'loyalty'),
    layout,
    sagaSettings: null,
    planeswalkerSettings: null,
    artUrl: readCandidateImage(source.image_uris),
    frameUrl: null,
    frameColor: inferFrameColor(source) ?? base.frameColor,
    frameVersionId,
    artOffsetX: 0,
    artOffsetY: 0,
    artZoom: 1,
    artRotation: 0,
    artGrayscale: false,
    artBounds: layoutPreset?.artBounds ?? null,
    manaBounds: layoutPreset?.manaBounds ?? null,
    titleBounds: layoutPreset?.titleBounds ?? null,
    typeBounds: layoutPreset?.typeBounds ?? null,
    rulesBounds: layoutPreset?.rulesBounds ?? null,
    powerToughnessBounds: layoutPreset?.powerToughnessBounds ?? null,
    loyaltyBounds: layoutPreset?.loyaltyBounds ?? null,
    flavorText: readImportedString(source, 'flavor_text', 'printed_flavor_text', parentSource),
  };
}

function readPowerToughness(source: Record<string, unknown>): string | null {
  const power = readString(source, 'power');
  const toughness = readString(source, 'toughness');
  return power && toughness ? `${power}/${toughness}` : null;
}

function readRarity(value: string | null): Rarity | null {
  const rarity = value?.toLowerCase();
  if (rarity === 'common' || rarity === 'c') return 'C';
  if (rarity === 'uncommon' || rarity === 'u') return 'U';
  if (rarity === 'rare' || rarity === 'r') return 'R';
  if (rarity === 'mythic' || rarity === 'mythic rare' || rarity === 'm') return 'M';
  if (rarity === 'special' || rarity === 'bonus' || rarity === 'p') return 'P';
  return null;
}

function shouldUsePrintedFields(cardLike: Record<string, unknown>, sourceCard: Record<string, unknown> = cardLike): boolean {
  const lang = readString(sourceCard, 'lang') ?? readString(cardLike, 'lang');
  return Boolean(lang && lang !== 'en');
}

function readImportedName(
  cardLike: Record<string, unknown>,
  sourceCard: Record<string, unknown> = cardLike,
): string | null {
  return shouldUsePrintedFields(cardLike, sourceCard)
    ? readString(cardLike, 'printed_name') ?? readString(cardLike, 'name') ?? readString(cardLike, 'en_name')
    : readString(cardLike, 'name') ?? readString(cardLike, 'en_name') ?? readString(cardLike, 'printed_name');
}

function readImportedString(
  cardLike: Record<string, unknown>,
  englishKey: string,
  printedKey: string,
  sourceCard: Record<string, unknown> = cardLike,
): string | null {
  return shouldUsePrintedFields(cardLike, sourceCard)
    ? readString(cardLike, printedKey) ?? readString(cardLike, englishKey)
    : readString(cardLike, englishKey) ?? readString(cardLike, printedKey);
}

function inferLayout(face: Record<string, unknown>, card: Record<string, unknown>): CardLayout {
  const typeLine = `${readString(face, 'type_line') ?? ''} ${readString(card, 'type_line') ?? ''}`;
  if (/\bplaneswalker\b/i.test(typeLine)) return 'planeswalker';
  if (/\bsaga\b/i.test(typeLine)) return 'saga';
  return 'standard';
}

function inferFrameVersionId(
  card: Record<string, unknown>,
  face: Record<string, unknown>,
  baseFrameVersionId: CardData['frameVersionId'],
): CardData['frameVersionId'] {
  const sourceLayout = readString(card, 'layout');
  const typeLine = `${readString(face, 'type_line') ?? ''} ${readString(card, 'type_line') ?? ''}`;
  if (sourceLayout === 'planar' || /\b(?:Plane|Phenomenon)\b/i.test(typeLine)) return 'planechase';
  if (sourceLayout === 'modal_dfc') return 'modal';
  if (baseFrameVersionId !== 'm15') return baseFrameVersionId;
  if (/\bplaneswalker\b/i.test(typeLine)) return 'm15Planeswalker';
  if (/\bsaga\b/i.test(typeLine)) return 'saga';
  return baseFrameVersionId;
}

function inferFrameUrl(
  card: Record<string, unknown>,
  frameVersionId: CardData['frameVersionId'],
  baseFrameUrl: string | null | undefined,
): string | null {
  if (frameVersionId !== 'planechase') return baseFrameUrl ?? null;
  const typeLine = readString(card, 'type_line') ?? '';
  if (/\bPhenomenon\b/i.test(typeLine)) return '/img/frames/planechase/phenomenon.png';
  return '/img/frames/planechase/tall.png';
}

// 上游 creator-23.js:6670–6704 import 流程在 oracle_text 上做的预处理：
//   1. 行首 keyword（前导到 " — "）+ 括号 reminder text 包 `{i}...{/i}`，但豁免列表跳过
//   2. curlyQuotes（直引号 → 弯引号）
//   3. token：{Q}→{untap}、{∞}→{inf}、`• `→`• {indent}`
//   4. companion 文案 "any time you could cast a sorcery" → "as a sorcery"
const ITALIC_EXEMPTIONS: ReadonlySet<string> = new Set([
  'Boast', 'Cycling', 'Visit', 'Prize',
  'I', 'II', 'III', 'IV',
  'I, II', 'II, III', 'III, IV',
  'I, II, III', 'II, III, IV', 'I, II, III, IV',
  '• Khans', '• Dragons', '• Mirran', '• Phyrexian',
  'Prototype', 'Companion', 'To solve', 'Solved',
]);

const COMPANION_LONG = '(If this card is your chosen companion, you may put it into your hand from outside the game for {3} any time you could cast a sorcery.)';
const COMPANION_SHORT = '(If this card is your chosen companion, you may put it into your hand from outside the game for {3} as a sorcery.)';

function normalizeOracleText(text: string, isPlanar: boolean): string {
  if (!text) return text;
  let working = isPlanar ? text.replace(/(^|\n)Whenever chaos ensues,?\s*/gi, '$1{planechase} ') : text;
  // 已包含 {i} 的认为是已加工过的（zhs/atomic 来源），跳过 italic 标注
  if (!/\{i\}/i.test(working)) {
    working = applyItalicMarkup(working);
  }
  working = curlyQuotes(working);
  working = working
    .replace(/\{Q\}/g, '{untap}')
    .replace(/\{∞\}/g, '{inf}')
    .replace(/• /g, '• {indent}');
  working = working.replace(COMPANION_LONG, COMPANION_SHORT);
  return working;
}

// 等价上游 6684-6687 的正则：匹配 `(...)` 或行首 keyword（直到 " — "）
function applyItalicMarkup(text: string): string {
  return text.replace(/\((?:.*?)\)|[^"\n]+(?= — )/g, (match) => {
    if (ITALIC_EXEMPTIONS.has(match)) return match;
    return `{i}${match}{/i}`;
  });
}

// 等价上游 4802 curlyQuotes：直引号 → 弯引号
function curlyQuotes(input: string): string {
  return input
    .replace(/ '/g, ' ‘')
    .replace(/^'/, '‘')
    .replace(/'/g, '’')
    .replace(/ "/g, ' “')
    .replace(/" /g, '” ')
    .replace(/\."/, '.”')
    .replace(/"$/, '”')
    .replace(/"\)/g, '”)')
    .replace(/"/g, '“');
}

function inferFrameColor(source: Record<string, unknown>, face: Record<string, unknown> = source): FrameColor | null {
  const colorsSource = Array.isArray(face.colors) ? face.colors : source.colors;
  const colors = Array.isArray(colorsSource) ? colorsSource.filter((value): value is string => typeof value === 'string') : [];
  const typeLine = `${readString(face, 'type_line') ?? ''} ${readString(source, 'type_line') ?? ''}`;
  if (colors.length === 0) {
    if (/\bland\b/i.test(typeLine)) return 'L';
    if (/\bartifact\b/i.test(typeLine)) return 'A';
    return 'C';
  }
  if (colors.length > 1) return 'M';
  const [color] = colors;
  return color === 'W' || color === 'U' || color === 'B' || color === 'R' || color === 'G' ? color : null;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'imported-card';
}

function readString(record: Record<string, unknown>, key: string): string | null {
  return stringFromValue(record[key]);
}

function stringFromValue(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() ? value : null;
  if (typeof value === 'number') return String(value);
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
