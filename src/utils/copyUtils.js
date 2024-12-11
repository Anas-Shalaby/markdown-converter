import { marked } from "marked";

export const convertToRichText = (content, mode) => {
  if (mode === "markdown") {
    // Configure marked for proper table handling
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      smartLists: true,
      xhtml: true,
    });

    // Convert markdown to HTML with proper table structure
    const html = marked(content);
    // Add Word-compatible styling
    return `
      <html>
        <head>
          <style>
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            h1 { font-size: 2em; margin: 0.67em 0; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }

  // For text mode, wrap content in basic HTML structure
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 2em; margin: 0.67em 0; }
          strong { font-weight: bold; }
          em { font-style: italic; }
        </style>
      </head>
      <body>
        ${content
          .split("\n")
          .map((line) => {
            if (line.startsWith("[H1]")) {
              return `<h1>${line.substring(4)}</h1>`;
            }
            return line
              .replace(/\[B\](.*?)\[\/B\]/g, "<strong>$1</strong>")
              .replace(/\[I\](.*?)\[\/I\]/g, "<em>$1</em>");
          })
          .join("<br>")}
      </body>
    </html>
  `;
};
