import { Project, SyntaxKind, JsxElement, JsxSelfClosingElement } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.tsx");
const iconsFilePath = "src/components/icons.tsx";
const iconsFile = project.getSourceFileOrThrow(iconsFilePath);

let iconCounter = 1;
const newIcons: string[] = [];

console.log(`Scanning ${sourceFiles.length} files for raw STATIC SVGs...`);

for (const file of sourceFiles) {
  if (file.getFilePath().includes("icons.tsx")) continue;
  if (file.getFilePath().includes("ui/")) continue; // Skip UI library components

  const svgElements = file.getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter(node => node.getOpeningElement().getTagNameNode().getText() === "svg");
  
  const svgSelfClosingElements = file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
    .filter(node => node.getTagNameNode().getText() === "svg");

  const allSvgs = [...svgElements, ...svgSelfClosingElements];

  if (allSvgs.length > 0) {
    let modified = false;
    const addedImports = new Set<string>();

    const sortedSvgs = allSvgs.sort((a, b) => b.getStart() - a.getStart());

    for (const svg of sortedSvgs) {
      let svgText = svg.getText();
      
      // Extract className if exists
      let classNameAttr = "";
      const opening = svg.getKind() === SyntaxKind.JsxElement 
        ? (svg as JsxElement).getOpeningElement() 
        : (svg as JsxSelfClosingElement);
        
      const classNameNode = opening.getAttribute("className");
      if (classNameNode) {
        classNameAttr = classNameNode.getText(); 
        // Remove it temporarily to check for other dynamics
        svgText = svgText.replace(classNameAttr, "");
      }

      // Check if there are ANY dynamic expressions left (e.g. {mobileOpen}, {data.length})
      // We look for `{` in the remaining text. If found, skip extraction!
      if (svgText.includes("{")) {
        console.log(`Skipping dynamic SVG in ${file.getBaseName()}`);
        continue;
      }

      const iconName = `ExtractedIcon${iconCounter++}`;
      addedImports.add(iconName);

      if (classNameNode) {
        svgText = svgText.replace("<svg", "<svg className={className}");
      } else {
        svgText = svgText.replace("<svg", "<svg className={className}");
      }

      const iconCode = `
export function ${iconName}({ className = "" }: { className?: string }) {
  return (
    ${svgText}
  );
}
`;
      newIcons.push(iconCode);

      svg.replaceWithText(`<${iconName} ${classNameAttr} />`);
      modified = true;
    }

    if (modified) {
      const importNames = Array.from(addedImports).join(", ");
      const existingImport = file.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "@/components/icons");
      
      if (existingImport) {
        for (const name of addedImports) {
          existingImport.addNamedImport(name);
        }
      } else {
        file.addImportDeclaration({
          namedImports: Array.from(addedImports),
          moduleSpecifier: "@/components/icons",
        });
      }
      
      file.saveSync();
      console.log(`Extracted ${addedImports.size} SVGs from ${file.getBaseName()}`);
    }
  }
}

if (newIcons.length > 0) {
  console.log(`Appending ${newIcons.length} new icons to icons.tsx...`);
  fs.appendFileSync(iconsFilePath, newIcons.join("\n"));
  console.log("Extraction complete!");
} else {
  console.log("No extractable static SVGs found.");
}
