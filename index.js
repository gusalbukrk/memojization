(async () => {
  const emojis = await (await fetch('./emojis/emojis.min.json')).json();

  const categories = Object.values(emojis).reduce((acc, cur) => {
    if ((acc[cur.category] ?? []).includes(cur.subcategory)) return acc;

    acc[cur.category] = [ ...(acc[cur.category] ?? []), cur.subcategory ];
    return acc;
  }, {});

  // console.log(emojis);
  // console.log(categories);

  function getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getNRandomElementsFromArray(arr, n) {
    return Array.from({ length: Math.min(arr.length, n) }).reduce((acc, ) => {
      return [ ...acc, getRandomArrayElement(arr.filter(el => !acc.includes(el))) ];
    }, []);
  }

  function selectEmojis(subcategories) {
    return subcategories.map(subcategory => {
      return Object.entries(emojis).filter(([, data]) => data.subcategory === subcategory).map(([emoji, ]) => emoji);
    }).flat();
  }
  
  function getCheckedSubcategories() {
    return [...document.querySelectorAll('.option :checked')].map(option => option.id);
  }

  function setQuantityMax(max) {
    document.querySelector('#quantity').setAttribute('max', max);
  }

  setQuantityMax(Object.keys(emojis).length);

  // populate aside with options
  const aside = document.querySelector('aside');
  //
  for (const category in categories) {
    const categoryTitle = document.createElement('h5');
    categoryTitle.textContent = category;
    aside.appendChild(categoryTitle);

    for (const subcategory of categories[category]) {
      const option = document.querySelector('template#option').content.cloneNode(true);

      const label = option.querySelector('label');
      const input = option.querySelector('input');

      label.setAttribute('for', subcategory);
      label.textContent = subcategory;
      input.id = subcategory;

      aside.appendChild(option);
    }
  }

  // select subcategories when clicking on category
  document.querySelectorAll('aside h5').forEach((h5, i) => h5.addEventListener('click', () => {
    const siblings = document.body.querySelectorAll(`h5:nth-of-type(${i + 1}) ~ *`);

    let counter = 0; // get quantity of subcategories under category

    for (const sibling of siblings) {
      if (sibling.className === 'option') counter++;
      else break;
    }
    
    [...siblings].slice(0, counter).forEach(sibling => {
      sibling.querySelector('input[type="checkbox"]').click();
    });
  }));

  document.querySelectorAll('.option input').forEach(cb => {
    cb.addEventListener('change', () => {
      const selectedEmojis = selectEmojis(getCheckedSubcategories());
      document.querySelector('#emojis').innerText = selectedEmojis.join(' ');

      setQuantityMax(selectedEmojis.length || Object.keys(emojis).length);
      document.querySelector('#quantity').value = selectedEmojis.length;
    });
  });

  // console.log(getNRandomElementsFromArray(Object.keys(emojis), 10));

  document.querySelector('form').addEventListener('submit', (e) => {
    const quantityInput = document.querySelector('#quantity');
    const quantity = parseInt(quantityInput.value);

    const emojisDiv = document.querySelector('#emojis');

    const selected = emojisDiv.textContent === '' ? Object.keys(emojis) : emojisDiv.textContent.split(' ');

    const randomEmojis = getNRandomElementsFromArray(selected, quantity);

    document.querySelector('input[type="hidden"]').value = randomEmojis.join(' ');
  });
})()