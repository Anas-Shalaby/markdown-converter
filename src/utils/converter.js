// Helper function to clean equation content
const cleanEquation = (eq) => {
  return eq
    // Remove extra newlines and spaces while preserving content
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    // Fix spacing around operators
    .replace(/\s*([<>=+\-*])\s*/g, ' $1 ')
    .trim();
};

// Helper function to format equation for text mode
const formatEquationForText = (eq) => {
  return eq
    // Clean up subscripts: f_{max} -> f_max
    .replace(/([_^])\{(\w+)\}/g, '$1$2')
    // Clean up text commands: \text{max} -> max
    .replace(/\\text\{(\w+)\}/g, '$1')
    // Clean up common math operators
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\int/g, '∫')
    .replace(/\\infty/g, '∞')
    .replace(/\\pi/g, 'π')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\omega/g, 'ω')
    // Clean up any remaining LaTeX commands
    .replace(/\\\w+/g, '')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper function to detect if text is already a valid equation
const isValidEquation = (text) => {
  // Check for properly formatted equations
  if ((text.startsWith('$$') && text.endsWith('$$')) ||
      (text.startsWith('$') && text.endsWith('$')) ||
      (text.startsWith('\\(') && text.endsWith('\\)')) ||
      (text.startsWith('\\[') && text.endsWith('\\]'))) {
    return true;
  }
  return false;
};

// Helper function to combine related equations
const combineEquations = (text) => {
  // Find sequences of equations separated by operators
  return text.replace(/\$([^$]+)\$\s*([=<>+\-*/])\s*\$([^$]+)\$/g, (_, eq1, op, eq2) => {
    return `$${formatEquationForText(eq1)} ${op} ${formatEquationForText(eq2)}$`;
  });
};

export const textToMarkdown = (text) => {
  if (!text) return '';

  // First, handle any display equations in the entire text
  text = text
    // Handle \[...\] display equations
    .replace(/\\[\s\n]*\[([\s\S]*?)\\[\s\n]*\]/g, (_, eq) => `$$${cleanEquation(eq)}$$`)
    // Handle \(...\) inline equations
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${cleanEquation(eq)}$`);
  
  // Handle triple dollar equations
  text = text.replace(/\${3}([\s\S]*?)\${3}/g, (_, eq) => {
    return combineEquations(eq);
  });
  
  return text
    .split('\n')
    .map(line => {
      // Handle equation tags
      if (line.includes('[EQ]')) {
        return line.replace(/\[EQ\](.*?)\[\/EQ\]/g, (_, eq) => `$$${cleanEquation(eq)}$$`);
      }
      if (line.includes('[IEQ]')) {
        return line.replace(/\[IEQ\](.*?)\[\/IEQ\]/g, (_, eq) => `$${cleanEquation(eq)}$`);
      }

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

      // Handle markdown elements
      if (line.trim().startsWith('[H1]')) {
        return `# ${line.trim().substring(4)}`;
      }
      line = line.replace(/\[B\](.*?)\[\/B\]/g, '**$1**');
      line = line.replace(/\[I\](.*?)\[\/I\]/g, '*$1*');

      // Process potential inline equations
      return combineEquations(line);
    })
    .join('\n');
};

export const markdownToText = (markdown) => {
  if (!markdown) return '';
  
  let text = markdown;
  
  // First combine related equations
  text = combineEquations(text);
  
  // Handle display equations
  text = text
    // Handle \[...\] display equations
    .replace(/\\[\s\n]*\[([\s\S]*?)\\[\s\n]*\]/g, (_, eq) => 
      `[EQ]${formatEquationForText(eq)}[/EQ]`)
    // Handle \(...\) inline equations
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => 
      `[IEQ]${formatEquationForText(eq)}[/IEQ]`)
    // Handle display math with $$
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => 
      `[EQ]${formatEquationForText(eq)}[/EQ]`)
    // Handle inline math with single $
    .replace(/\$([^$]+?)\$/g, (_, eq) => 
      `[IEQ]${formatEquationForText(eq)}[/IEQ]`);
  
  // Handle other markdown elements
  text = text
    // Headers
    .replace(/^# (.*$)/gm, '[H1]$1')
    .replace(/^## (.*$)/gm, '[H2]$1')
    .replace(/^### (.*$)/gm, '[H3]$1')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '[B]$1[/B]')
    // Italic
    .replace(/\*(.*?)\*/g, '[I]$1[/I]')
    // Lists
    .replace(/^\- /gm, '• ')
    .replace(/^\* /gm, '• ');

  return text;
};