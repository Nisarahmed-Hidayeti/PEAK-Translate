/// <reference types="webextension-polyfill" />

declare namespace browser {
  // Basic browser API types we need
  interface Runtime {
    onMessage: {
      addListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void) => void;
      removeListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void) => void;
      hasListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean) => boolean;
    };
    sendMessage: (message: any, options?: any) => Promise<any>;
    getURL: (path: string) => string;
    id: string;
  }

  interface Tabs {
    query: (queryInfo: object) => Promise<Tab[]>;
    executeScript: (tabId: number, details: { code?: string; file?: string; allFrames?: boolean; matchAboutBlank?: boolean; runAt?: 'document_start' | 'document_end' | 'document_idle'; } ) => Promise<any[]>;
  }

  interface Storage {
    local: StorageArea;
    session: StorageArea;
    managed: StorageArea;
  }

  interface StorageArea {
    get: (keys: string | string[] | null | { [key: string]: any }) => Promise<{ [key: string]: any }>;
    set: (items: { [key: string]: any }) => Promise<void>;
    remove: (keys: string | string[]) => Promise<void>;
    clear: () => Promise<void>;
  }

  interface Tab {
    id: number;
    windowId: number;
    index: number;
    url?: string;
    title?: string;
    faviconUrl?: string;
    pinned?: boolean;
    active?: boolean;
    audible?: boolean;
    discarded?: boolean;
    autoDiscardable?: boolean;
    mutedInfo?: { muted: boolean; reason?: string };
    status?: 'loading' | 'complete';
    incognito?: boolean;
  }

  interface Menus {
    create: (createProperties: { type?: 'normal' | 'separator' | 'checkbox' | 'radio'; title?: string; contexts?: ContextType[]; onclick?: (info: any, tab: Tab | null) => void; documentUrlPatterns?: string[]; targetUrlPatterns?: string[]; enabled?: boolean; checked?: boolean; parentId?: number | string; documentIdPatterns?: string[]; }) => Promise<number | string>;
    update: (id: number | string, updateProperties: { type?: 'normal' | 'separator' | 'checkbox' | 'radio'; title?: string; contexts?: ContextType[]; onclick?: (info: any, tab: Tab | null) => void; documentUrlPatterns?: string[]; targetUrlPatterns?: string[]; enabled?: boolean; checked?: boolean; parentId?: number | string; documentIdPatterns?: string[]; }) => Promise<void>;
    remove: (id: number | string) => Promise<void>;
    removeAll: () => Promise<void>;
    getTargetElement: (targetId: number) => Promise<Element>;
  }

  type ContextType = 'all' | 'page' | 'frame' | 'selection' | 'link' | 'editable' | 'image' | 'video' | 'audio' | 'launcher';

  const runtime: Runtime;
  const tabs: Tabs;
  const storage: Storage;
  const menus: Menus;
}
