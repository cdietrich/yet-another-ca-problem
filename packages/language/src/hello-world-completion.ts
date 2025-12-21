import { GrammarAST, GrammarUtils, TextDocument } from "langium";
import { CompletionContext, DefaultCompletionProvider, findFirstFeatures, findNextFeatures, NextFeature } from "langium/lsp";
import { Position } from "vscode-languageserver-types";

export class
HelloWorldCompletionProvider extends DefaultCompletionProvider {
    protected override filterKeyword(context: CompletionContext, keyword: GrammarAST.Keyword): boolean {
        // Filter out keywords that do not contain any word character
        return true;
    }

    protected override findFeaturesAt(document: TextDocument, offset: number): NextFeature[] {
        const text = document.getText({
            start: Position.create(0, 0),
            end: document.positionAt(offset)
        });
        const parserResult = this.completionParser.parse(text);
        const tokens = parserResult.tokens;
        // If the parser didn't parse any tokens, return the next features of the entry rule
        if (parserResult.tokenIndex === 0) {
            const parserRule = GrammarUtils.getEntryRule(this.grammar)!;
            const firstFeatures = findFirstFeatures({
                feature: parserRule.definition,
                type: GrammarUtils.getExplicitRuleType(parserRule)
            });
            if (tokens.length > 0) {
                // We have to skip the first token
                // The interpreter will only look at the next features, which requires every token after the first
                tokens.shift();
                return findNextFeatures(firstFeatures.map(e => [e]), tokens);
            } else {
                return firstFeatures;
            }
        }
        const leftoverTokens = [...tokens].splice(parserResult.tokenIndex);
        // Only pass tokens that are after the cursor offset
        const tokensAfterCursor = leftoverTokens.filter(token => token.startOffset >= offset);
        const features = findNextFeatures([parserResult.elementStack.map(feature => ({ feature }))], tokensAfterCursor);
        return features;
    }
}