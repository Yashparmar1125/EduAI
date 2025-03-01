import { Font } from "../types/font";
import { UseReactToPrintOptions } from "../types/UseReactToPrintOptions";
import { HandlePrintWindowOnLoadData } from "./handlePrintWindowOnLoad";
export declare function appendPrintWindow(printWindow: HTMLIFrameElement, markLoaded: (resource: Element | Font | FontFace, errorMessages?: unknown[]) => void, data: HandlePrintWindowOnLoadData, options: UseReactToPrintOptions): void;
