import { closest } from "./dom";

export function isSelectionForward(selection) {
    if (selection.collapsed) return true;

    const comparedPositions = selection.anchorNode.compareDocumentPosition(selection.focusNode);
    if (!comparedPositions) {
        // It's the same node
        return selection.anchorOffset < selection.focusOffset;
    }

    return (comparedPositions & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
};

const slice = Array.prototype.slice;
export function getEndLineRect(range, isForward) {
    let endLineRects;
    const rangeRects = range.getClientRects();

    if (isForward) {
        let lastLeft = Infinity;
        let i = rangeRects.length;
        while (i--) {
            const rect = rangeRects[i];
            if (rect.left > lastLeft) break;
            lastLeft = rect.left;
        }
        endLineRects = slice.call(rangeRects, i + 1);
    } else {
        let lastRight = -Infinity;
        let i = 0;
        for (; i < rangeRects.length; i++) {
            const rect = rangeRects[i];
            if (rect.right < lastRight) break;
            lastRight = rect.right;
        }
        endLineRects = slice.call(rangeRects, 0, i);
    }

    return {
        top: Math.min(...endLineRects.map(rect => rect.top)),
        bottom: Math.max(...endLineRects.map(rect => rect.bottom)),
        left: endLineRects[0].left,
        right: endLineRects[endLineRects.length - 1].right
    };
};

export function constrainRange(range, selector) {
    const constrainedRange = range.cloneRange();
    if (range.collapsed || !selector) return constrainedRange;

    let ancestor = closest(range.startContainer, selector);
    if (ancestor) {
        if (!ancestor.contains(range.endContainer))
            constrainedRange.setEnd(ancestor, ancestor.childNodes.length);
    } else {
        ancestor = closest(range.endContainer, selector);
        if (ancestor) constrainedRange.setStart(ancestor, 0);
    }

    return constrainedRange;
};
