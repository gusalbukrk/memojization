/**
 * @file Node script to generate the emoji data file from 3 distinct sources.
 */

import emojiUnicode from 'emoji-unicode';

import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const base = await (
  await fetch(
    'https://unpkg.com/unicode-emoji-json@0.4.0/data-by-emoji.json'
  )
).json();

const keywords = await (
  await fetch(
    'https://unpkg.com/emojilib@3.0.10/dist/emoji-en-US.json'
  )
).json();

// contains various information but we'll only take the subcategory
const subcategories = await (
  await fetch(
    'https://unpkg.com/emoji-datasource@15.0.1/emoji.json'
  )
).json();

const emojis = Object.fromEntries(Object.entries(base).map(([emoji, data]) => {
  const e = [emoji, {}];

  e[1].name = data.name;
  e[1].category = data.group;

  e[1].keywords = keywords[emoji];

  const code = emojiUnicode(emoji);
  e[1].code = code;

  e[1].subcategory = (
    subcategories.find(s => s.unified.toLowerCase() === code.replace(/ /g, '-')) ??

    // 14 emojis weren't found by the 1st find call, prepending 00 is needed to find them
    subcategories.find(s => s.unified.toLowerCase() === `00${code.replace(/ /g, '-')}`)
  ).subcategory;

  return e;
}));

// console.log(Object.keys(emojis).length);

fs.writeFileSync(join(__dirname, 'emojis.json'), JSON.stringify(emojis, null, 2));
fs.writeFileSync(join(__dirname, 'emojis.min.json'), JSON.stringify(emojis));

console.log('Done!');
