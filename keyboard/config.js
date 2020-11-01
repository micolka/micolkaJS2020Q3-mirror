const keyConfig = {
  en: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", 
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
    "done", "space", "en / ru", "left", "right", "enter",
  ],
  enShifted: [
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'skip',
    'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '{', '}',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', ':', '"',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '<', '>', '?',
    'skip', 'skip', 'skip', 'skip', 'skip', 'skip',
  ],
  ru: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "skip",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "skip", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
    "skip", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "skip", "skip", "skip", 'skip', 'skip', 'skip',
  ],
  ruShifted: [
    "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "skip",
    "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", ",",
    "skip", "skip", "skip", 'skip', 'skip', 'skip',
  ],
  keyCodes: [
    49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
    81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221,
    20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222,
    16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
    -1, 32, -1, 37, 39, 13,
  ]
}

export {keyConfig};