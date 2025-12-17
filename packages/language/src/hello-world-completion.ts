import { GrammarAST } from "langium";
import { CompletionContext, DefaultCompletionProvider } from "langium/lsp";

export class
HelloWorldCompletionProvider extends DefaultCompletionProvider {
    protected override filterKeyword(context: CompletionContext, keyword: GrammarAST.Keyword): boolean {
        // Filter out keywords that do not contain any word character
        return true;
    }
}