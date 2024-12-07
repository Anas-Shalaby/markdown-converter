// Convert text equations to LaTeX format
export const processTextEquations = (text) => {
  // Replace [EQ]...[/EQ] with $$...$$ for display equations
  let processed = text.replace(/\[EQ\](.*?)\[\/EQ\]/g, '$$$$1$$');
  
  // Replace [IEQ]...[/IEQ] with $...$ for inline equations
  processed = processed.replace(/\[IEQ\](.*?)\[\/IEQ\]/g, '$$1$');
  
  return processed;
};
