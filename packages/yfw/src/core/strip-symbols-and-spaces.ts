export function stripSymbolsAndSpaces(title: string) {
  var newTitle = title
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .join("");
  return newTitle;
}
