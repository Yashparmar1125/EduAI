import { ContentNode } from "../types/ContentNode";
import type { UseReactToPrintOptions } from "../types/UseReactToPrintOptions";
import { UseReactToPrintHookContent } from "../types/UseReactToPrintHookContent";
interface GetContentNodesArgs {
    contentRef?: UseReactToPrintOptions["contentRef"];
    optionalContent?: UseReactToPrintHookContent;
    suppressErrors?: boolean;
}
export declare function getContentNode({ contentRef, optionalContent, suppressErrors }: GetContentNodesArgs): ContentNode;
export {};
