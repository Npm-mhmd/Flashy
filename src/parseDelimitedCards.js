export function parseDelimitedCards(source, delimiter, skipHeader = false) {
  if (!delimiter) throw new Error('Choose a separator before previewing the file.');

  const text = source.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (text.startsWith(delimiter, index)) {
      row.push(field);
      field = '';
      index += delimiter.length - 1;
    } else if (character === '\n' || character === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      if (character === '\r' && text[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }

  if (inQuotes) throw new Error('The file contains an unclosed quoted field.');
  if (field || row.length > 0) rows.push([...row, field]);

  const populatedRows = rows.filter(columns => columns.some(value => value.trim()));
  const dataRows = skipHeader ? populatedRows.slice(1) : populatedRows;
  const cards = [];
  let skipped = 0;

  dataRows.forEach(columns => {
    const front = columns[0]?.trim() || '';
    const back = columns.slice(1).join(delimiter).trim();

    if (!front || !back) {
      skipped += 1;
      return;
    }

    cards.push({ front, back });
  });

  return { cards, skipped };
}
