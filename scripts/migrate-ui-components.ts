import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.tsx");

for (const sf of sourceFiles) {
  let needsCard = false;
  let needsButton = false;
  let needsBadge = false;
  let needsInput = false;

  interface Edit {
    start: number;
    end: number;
    newText: string;
  }
  const edits: Edit[] = [];

  const jsxElements = sf.getDescendantsOfKind(SyntaxKind.JsxElement);
  const jsxSelfClosingElements = sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

  const processElement = (el: any, openingElement: any, closingElement?: any) => {
    const currentTagName = openingElement.getTagNameNode().getText();
    if (["Card", "Button", "Badge", "Input", "InteractiveCard"].includes(currentTagName)) return;

    const classAttr = openingElement.getAttribute("className");
    if (!classAttr) return;

    const classInitializer = classAttr.getInitializer();
    if (!classInitializer) return;

    let classStr = "";
    if (classInitializer.isKind(SyntaxKind.StringLiteral)) {
      classStr = classInitializer.getLiteralValue();
    } else if (classInitializer.isKind(SyntaxKind.JsxExpression)) {
      const expr = classInitializer.getExpression();
      if (expr) classStr = expr.getText();
    }

    if (!classStr) return;

    let targetTagName = "";
    const attributesToAdd: string[] = [];
    let newClassStr = classStr;
    const isStringLiteral = classInitializer.isKind(SyntaxKind.StringLiteral);

    if (classStr.includes("glass-card")) {
      needsCard = true;
      targetTagName = "Card";
      if (classStr.includes("glass-card-interactive")) {
        attributesToAdd.push("interactive={true}");
      }
      newClassStr = newClassStr.replace(/glass-card-interactive/g, "").replace(/glass-card/g, "").replace(/\s+/g, " ").trim();
    } 
    else if (/btn-(gold|outline|ghost|danger)/.test(classStr)) {
      needsButton = true;
      targetTagName = "Button";
      const match = classStr.match(/btn-(gold|outline|ghost|danger)/);
      if (match) {
        const variant = match[1];
        attributesToAdd.push(`variant="${variant}"`);
      }
      newClassStr = newClassStr.replace(/btn-(gold|outline|ghost|danger)/g, "").replace(/\s+/g, " ").trim();
    }
    else if (/badge-(success|warning|error|info|gold|neutral)/.test(classStr) || /\bbadge\b/.test(classStr)) {
      needsBadge = true;
      targetTagName = "Badge";
      const match = classStr.match(/badge-(success|warning|error|info|gold|neutral)/);
      const variant = match ? match[1] : "neutral";
      if (variant !== "neutral") {
        attributesToAdd.push(`variant="${variant}"`);
      }
      newClassStr = newClassStr.replace(/badge-(success|warning|error|info|gold|neutral)/g, "").replace(/\bbadge\b/g, "").replace(/\s+/g, " ").trim();
    }
    else if (/\binput\b/.test(classStr) && currentTagName === "input") {
      needsInput = true;
      targetTagName = "Input";
      if (classStr.includes("input-mono")) {
        attributesToAdd.push("mono={true}");
      }
      newClassStr = newClassStr.replace(/input-mono/g, "").replace(/\binput\b/g, "").replace(/\s+/g, " ").trim();
    }

    if (!targetTagName) return;

    if (isStringLiteral) {
      edits.push({
        start: classAttr.getStart(),
        end: classAttr.getEnd(),
        newText: newClassStr ? `className="${newClassStr}"` : ""
      });
    } else {
      const exprStart = classInitializer.getStart();
      const exprEnd = classInitializer.getEnd();
      const originalText = classInitializer.getText();
      let modifiedText = originalText;
      if (targetTagName === "Card") {
        modifiedText = modifiedText.replace(/glass-card-interactive/g, "").replace(/glass-card/g, "");
      } else if (targetTagName === "Button") {
        modifiedText = modifiedText.replace(/btn-(gold|outline|ghost|danger)/g, "");
      } else if (targetTagName === "Badge") {
        modifiedText = modifiedText.replace(/badge-(success|warning|error|info|gold|neutral)/g, "").replace(/\bbadge\b/g, "");
      } else if (targetTagName === "Input") {
        modifiedText = modifiedText.replace(/input-mono/g, "").replace(/\binput\b/g, "");
      }
      edits.push({
        start: exprStart,
        end: exprEnd,
        newText: modifiedText
      });
    }

    if (attributesToAdd.length > 0) {
      const tagNameEnd = openingElement.getTagNameNode().getEnd();
      edits.push({
        start: tagNameEnd,
        end: tagNameEnd,
        newText: " " + attributesToAdd.join(" ")
      });
    }

    edits.push({
      start: openingElement.getTagNameNode().getStart(),
      end: openingElement.getTagNameNode().getEnd(),
      newText: targetTagName
    });

    if (closingElement) {
      edits.push({
        start: closingElement.getTagNameNode().getStart(),
        end: closingElement.getTagNameNode().getEnd(),
        newText: targetTagName
      });
    }
  };

  for (const el of jsxElements) {
    processElement(el, el.getOpeningElement(), el.getClosingElement());
  }

  for (const el of jsxSelfClosingElements) {
    processElement(el, el, undefined);
  }

  if (edits.length > 0) {
    // Must sort descending so end indices don't shift when replacing!
    edits.sort((a, b) => b.start - a.start);
    
    let text = sf.getFullText();
    for (const edit of edits) {
      text = text.substring(0, edit.start) + edit.newText + text.substring(edit.end);
    }
    
    sf.replaceWithText(text);

    const addImportIfNeeded = (componentName: string) => {
      const hasImport = sf.getImportDeclarations().some(i => i.getModuleSpecifierValue() === `@/components/ui/${componentName}`);
      if (!hasImport) {
        sf.addImportDeclaration({
          namedImports: [componentName],
          moduleSpecifier: `@/components/ui/${componentName}`
        });
      }
    };

    if (needsCard) addImportIfNeeded("Card");
    if (needsButton) addImportIfNeeded("Button");
    if (needsBadge) addImportIfNeeded("Badge");
    if (needsInput) addImportIfNeeded("Input");

    sf.saveSync();
    console.log(`Updated ${sf.getFilePath()}`);
  }
}

console.log("Migration complete.");
