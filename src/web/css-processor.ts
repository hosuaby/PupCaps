import {AbstractDynamicCssRule, createDynamicCssRule, Filter, FilterType} from '../script/dynamic-css-rules';

const dynamicCssClassPattern = /^\.pup-(\w+)((?:-[^-]+)+)$/;

export class CssProcessor {
    private readonly dynamicCssRules: AbstractDynamicCssRule[] = [];

    constructor() {
        for (const styleSheet of document.styleSheets) {
            for (const styleRule of styleSheet.cssRules) {
                const selectorText = (styleRule as CSSStyleRule).selectorText || '';

                if (selectorText.includes('.pup-')) {
                    const selectors = CssProcessor.parseSelectors(selectorText);
                    const targetSelectors: string[] = [];
                    let filter: Filter | null = null;

                    for (const selector of selectors) {
                        if (selector.match(dynamicCssClassPattern)) {
                            if (filter) {
                                throw new Error(
                                    `Only one dynamic CSS class is allowed per style rule. 
                                    Two dynamic classes were found: .${filter.cssClass} and ${selector}`);
                            }

                            filter = CssProcessor.parseFilter(selector);
                        } else {
                            targetSelectors.push(selector);
                        }
                    }

                    const rule = createDynamicCssRule(targetSelectors, filter!);
                    this.dynamicCssRules.push(rule);
                }
            }
        }
    }

    public applyDynamicClasses<T extends HTMLElement>(target: T, captionIndex: number, timeMs: number, words: string[]): T {
        const dynamicCssClasses = this.dynamicCssClasses(target, captionIndex, timeMs, words);
        let cssClass = target.getAttribute('class') || '';
        dynamicCssClasses.forEach(dynamicClass => cssClass += ' ' + dynamicClass);
        target.setAttribute('class', cssClass);
        return target;
    }

    private dynamicCssClasses(target: HTMLElement, captionIndex: number, timeMs: number, words: string[]): string[] {
        return this.dynamicCssRules
            .filter(rule => rule.isApplied(target, captionIndex, timeMs, words))
            .map(rule => rule.appliedCssClass);
    }

    static parseFilter(dynamicCssClass: string): Filter {
        const match = dynamicCssClass.match(dynamicCssClassPattern);

        if (!match) {
            throw new Error(`CSS class ${dynamicCssClass} do not match required pattern!`);
        }

        const cssClass = dynamicCssClass.slice(1);
        const filterType = match[1] as FilterType;
        const filterArgs = match[2].split('-').slice(1);

        return {
            cssClass,
            type: filterType,
            args: filterArgs,
        }
    }

    static parseSelectors(selectorText: string): string[] {
        const selectors: string[] = [];
        let currentToken = '';
        let lastIsEscaped = false;

        for (let i = 0; i < selectorText.length; i++) {
            const char = selectorText[i];
            if ((char === '.' || char === '#') && !lastIsEscaped) {
                if (currentToken) {
                    selectors.push(currentToken);
                }
                currentToken = char;
            } else if (char === '\\') {
                currentToken += char;
                lastIsEscaped = true;
            } else if (lastIsEscaped) {
                currentToken += char;
                lastIsEscaped = false;
            } else {
                currentToken += char;
            }
        }

        if (currentToken) {
            selectors.push(currentToken);
        }

        return selectors;
    }
}
