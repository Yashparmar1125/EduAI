import { Font } from "../types/font";
import type { UseReactToPrintOptions } from "../types/UseReactToPrintOptions";
export interface HandlePrintWindowOnLoadData {
    contentNode: Node;
    clonedContentNode: Node;
    clonedImgNodes: never[] | NodeListOf<HTMLImageElement>;
    clonedVideoNodes: never[] | NodeListOf<HTMLVideoElement>;
    numResourcesToLoad: number;
    originalCanvasNodes: never[] | NodeListOf<HTMLCanvasElement>;
}
type MarkLoaded = (resource: Element | Font | FontFace, errorMessages?: unknown[]) => void;
export declare function handlePrintWindowOnLoad(printWindow: HTMLIFrameElement, markLoaded: MarkLoaded, data: HandlePrintWindowOnLoadData, options: UseReactToPrintOptions): void;
export {};
