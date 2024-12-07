export const textToMarkdown = (text) => {
    return text
      .split('\n')
      .map(line => {
        // Handle basic text formatting
        if (line.trim().startsWith('•') || line.trim().startsWith('·')) {
          return line.replace(/^[•·]\s*/, '- ');
        }
        if (/^[0-9]+\.\s/.test(line)) {
          return line;
        }
        if (line.trim().length === 0) {
          return '';
        }
        // Handle H1 headers (lines starting with [H1])
        if (line.trim().startsWith('[H1]')) {
          return `# ${line.trim().substring(4)}`;
        }
        // Handle bold text [B]text[/B]
        line = line.replace(/\[B\](.*?)\[\/B\]/g, '**$1**');
        // Handle italic text [I]text[/I]
        line = line.replace(/\[I\](.*?)\[\/I\]/g, '*$1*');
        return line;
      })
      .join('\n');
  };
  
  export const markdownToText = (markdown) => {
    return markdown
      .replace(/^#\s+(.*?)$/gm, '[H1]$1') // Convert H1 to [H1]text
      .replace(/\*\*(.*?)\*\*/g, '[B]$1[/B]') // Convert bold
      .replace(/\*(.*?)\*/g, '[I]$1[/I]') // Convert italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert links to text
      .replace(/^\s*[-*+]\s/gm, '• ') // Convert list items to bullets
      .replace(/^\s*[0-9]+\.\s/gm, '') // Remove numbered list markers
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .trim();
  };