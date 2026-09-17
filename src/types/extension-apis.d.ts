/// <reference types="webextension-polyfill" />

// Declare the global browser variable that we get from webextension-polyfill
declare const browser: Browser;

// Augment the browser namespace with additional properties we need
declare namespace Browser {
    // Runtime
    namespace runtime {
        interface OnInstalledEvent {
            addListener: (listener: (details: { reason: string; previousVersion?: string; }) => void) => void;
        }
        interface OnMessageEvent {
            addListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void) => void;
            removeListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void) => void;
            hasListener: (listener: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean) => boolean;
        }
        interface Runtime {
            onInstalled: OnInstalledEvent;
            onMessage: OnMessageEvent;
            sendMessage: (message: any, options?: any) => Promise<any>;
            getURL: (path: string) => string;
            id: string;
            openOptionsPage: () => Promise<void>;
        }
    }
    
    // Tabs
    namespace tabs {
        interface TabsStatic {
            query: (queryInfo: object) => Promise<Tab[]>;
            sendMessage: (tabId: number, message: any, options?: any) => Promise<any>;
            executeScript: (tabId: number, details: { code?: string; file?: string; allFrames?: boolean; matchAboutBlank?: boolean; runAt?: "document_start" | "document_end" | "document_idle"; } ) => Promise<any[]>;
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
            status?: "loading" | "complete";
            incognito?: boolean;
        }
    }
    
    // Storage
    namespace storage {
        interface StorageStatic {
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
    }
    
    // Menus
    namespace menus {
        interface MenusStatic {
            create: (createProperties: { type?: "normal" | "separator" | "checkbox" | "radio"; title?: string; contexts?: ContextType[]; onclick?: (info: any, tab: Tab | null) => void; documentUrlPatterns?: string[]; targetUrlPatterns?: string[]; enabled?: boolean; checked?: boolean; parentId?: number | string; documentIdPatterns?: string[]; }) => Promise<number | string>;
            update: (id: number | string, updateProperties: { type?: "normal" | "separator" | "checkbox" | "radio"; title?: string; contexts?: ContextType[]; onclick?: (info: any, tab: Tab | null) => void; documentUrlPatterns?: string[]; targetUrlPatterns?: string[]; enabled?: boolean; checked?: boolean; parentId?: number | string; documentIdPatterns?: string[]; }) => Promise<void>;
            remove: (id: number | string) => Promise<void>;
            removeAll: () => Promise<void>;
            getTargetElement: (targetId: number) => Promise<Element>;
        }
        
        // Define the types for the context menu click event
        interface OnClickData {
            menuItemId: string | number;
            selectionText?: string;
            // Add other properties as needed
        }
        
        interface OnClickHandler {
            (info: OnClickData, tab: Tab | null): void;
        }
        
        interface MenusStaticWithEvents extends MenusStatic {
            onClicked: {
                addListener: (listener: OnClickHandler) => void;
                removeListener: (listener: OnClickHandler) => void;
                hasListener: (listener: OnClickHandler) => boolean;
            };
        }
    }
    
    // Commands
    namespace commands {
        interface CommandsStatic {
            onCommand: {
                addListener: (listener: (command: string) => void) => void;
            };
        }
    }
    
    // i18n
    namespace i18n {
        interface I18nStatic {
            getMessage: (messageName: string) => string;
        }
    }
    
    // ContextType
    type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "image" | "video" | "audio" | "launcher";
}
