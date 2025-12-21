import { describe, expect, test } from "vitest";
import { EmptyFileSystem } from "langium";
import { createHelloWorldServices } from "hello-world-language";
import { expectCompletion as langiumExpectCompletion } from "langium/test"
import type { CompletionList } from "vscode-languageserver-types"


const services = createHelloWorldServices(EmptyFileSystem);
const expectCompletion = langiumExpectCompletion(services.HelloWorld)

const expectCompletionItems = (expected: string[]) => {
    return (list: CompletionList) => {
      return expect(list.items.map(i => i.label)).toEqual(expect.arrayContaining(expected))
    }
  }

describe('Linking tests', () => {

    test('dummy 0', async () => {
        const text = `

<|>
http-endpoint Orders {
}
`

    await expectCompletion({
      index: 0,
      text,
      assert: expectCompletionItems(["@", "http-endpoint"]),
    })
    });

    test('dummy 1', async () => {
        const text = `

http-endpoint Orders {
    <|>
    public write action demo {}
}
`

    await expectCompletion({
      index: 0,
      text,
      assert: expectCompletionItems(["@"]),
    })
    });

    test('dummy 2', async () => {
        const text = `

http-endpoint Orders {
    @description(true)
    <|>
    public write action demo {}
}
`

    await expectCompletion({
      index: 0,
      text,
      assert: expectCompletionItems(["@"]),
    })
    });

    // test('linking of greetings', async () => {
    //     document = await parse(`
    //         person Langium
    //         Hello Langium!
    //     `);

    //     expect(
    //         // here we first check for validity of the parsed document object by means of the reusable function
    //         //  'checkDocumentValid()' to sort out (critical) typos first,
    //         // and then evaluate the cross references we're interested in by checking
    //         //  the referenced AST element as well as for a potential error message;
    //         checkDocumentValid(document)
    //             || document.parseResult.value.greetings.map(g => g.person.ref?.name || g.person.error?.message).join('\n')
    //     ).toBe(s`
    //         Langium
    //     `);
    // });
});
