import { RefObject } from "react";
import type { Font } from "./font";
import { ContentNode } from "./ContentNode";
export interface UseReactToPrintOptions {
    bodyClass?: string;
    contentRef?: RefObject<ContentNode>;
    documentTitle?: string;
    fonts?: Font[];
    ignoreGlobalStyles?: boolean;
    nonce?: string;
    onAfterPrint?: () => void;
    onBeforePrint?: () => Promise<void>;
    onPrintError?: (errorLocation: "onBeforePrint" | "print", error: Error) => void;
    pageStyle?: string;
    preserveAfterPrint?: boolean;
    print?: (target: HTMLIFrameElement) => Promise<any>;
    suppressErrors?: boolean;
    copyShadowRoots?: boolean;
}
