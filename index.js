const emojis = await (await fetch('./emojis/emojis.min.json')).json();
console.log(emojis);
