const fruitsList = document.querySelector(".fruits__list");
const shuffleButton = document.querySelector(".shuffle__btn");
const filterButton = document.querySelector(".filter__btn");
const sortKindLabel = document.querySelector(".sort__kind");
const sortTimeLabel = document.querySelector(".sort__time");
const sortChangeButton = document.querySelector(".sort__change__btn");
const sortActionButton = document.querySelector(".sort__action__btn");
const kindInput = document.querySelector(".kind__input");
const colorInput = document.querySelector(".color__input");
const weightInput = document.querySelector(".weight__input");
const addActionButton = document.querySelector(".add__action__btn");

const getColor = {
  желтый: "yellow",
  синий: "blue",
  красный: "red",
  зеленый: "green",
  черный: "black",
  оранжевый: "orange",
  фиолетовый: "#8b00ff",
  коричневый: "#cd853f",
};

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "красный", "weight": 17}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let fruitsAll = fruits;

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = "";
  const getColorClass = (color) => {
    const colorMap = {
      фиолетовый: "fruit_violet",
      зеленый: "fruit_green",
      красный: "fruit_carmazin",
      желтый: "fruit_yellow",
      "светло-коричневый": "fruit_lightbrown",
    };
    return colorMap[color.toLowerCase()] || "fruit_default";
  };

  for (let i = 0; i < fruits.length; i++) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    div.innerHTML =
      "Index: " +
      i +
      "<br>" +
      "Kind: " +
      fruits[i].kind +
      "<br>" +
      "Color: " +
      fruits[i].color +
      "<br>" +
      "Weight: " +
      fruits[i].weight;
    li.classList.add("fruit__item");
    li.classList.add(getColorClass(fruits[i].color));
    div.classList.add("fruit__info");
    fruitsList.appendChild(li);
    li.appendChild(div);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    outEl = getRandomInt((i = 0), fruits.length);
    getEl = fruits[outEl];
    fruits.splice(outEl, 1);
    result.push(getEl);
    if (getEl === undefined) {
      result.splice(-1, 1);
      continue;
    }
  }

  fruits = result;
};

//Кнопка перемешивания массива
shuffleButton.addEventListener("click", () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const save = fruitsAll;
  let result = [];
  let min = document.querySelector(".minweight__input").value;
  let max = document.querySelector(".maxweight__input").value;
  if (min == "" || max == "") {
    alert("Не введены данные");
  }
  min = Number(min);
  max = Number(max);
  if (min > 999999) {
    min = 0;
    document.querySelector(".minweight__input").value = min;
  }
  if (max > 999999) {
    max = 999999;
    document.querySelector(".maxweight__input").value = max;
  }
  if (min > max) {
    alert("Упс, кажется вы перепутали значения");
    document.querySelector(".minweight__input").value = max;
    document.querySelector(".maxweight__input").value = min;
    filterFruits();
    return save;
  } else if (min < 0 || max < 0) {
    alert("Одно из указаных значений меньше нуля");
    if (min < 0) {
      min = 0;
      document.querySelector(".minweight__input").value = min;
    }
    if (max < 0) {
      max = 999999;
      document.querySelector(".maxweight__input").value = max;
    }
    return save;
  } else {
    result = save.filter((item) => {
      if (min <= item.weight && max >= item.weight) {
        return true;
      }
    });
    if (result.length < 1) {
      alert("Нет результатов");
      return save;
    }
  }
  fruits = result;
};

filterButton.addEventListener("click", () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort"; // инициализация состояния вида сортировки
let sortTime = "-"; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = [
    "желтый",
    "зеленый",
    "фиолетовый",
    "розово-красный",
    "светло-коричневый",
  ];
  if (priority.indexOf(a) > priority.indexOf(b)) {
    return true;
  } else {
    return false;
  }
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    for (let n = 0; n < fruits.length; n++) {
      for (let i = 0; i < fruits.length - 1 - n; i++) {
        if (comparationColor(fruits[i].color, fruits[i + 1].color)) {
          tmp = fruits[i];
          fruits[i] = fruits[i + 1];
          fruits[i + 1] = tmp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[arr.length - 1];
    const leftlist = [];
    const rightlist = [];

    for (let i = 0; i < arr.length - 1; i++) {
      if (comparationColor(pivot.color, arr[i].color)) {
        leftlist.push(arr[i]);
      } else {
        rightlist.push(arr[i]);
      }
    }
    fruits = [
      ...sortAPI.quickSort(leftlist),
      pivot,
      ...sortAPI.quickSort(rightlist),
    ];
    return fruits;
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener("click", () => {
  if (sortKind == "bubbleSort") {
    sortKind = "quickSort";
  } else {
    sortKind = "bubbleSort";
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener("click", () => {
  sortTimeLabel.textContent = "sorting...";
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  if (
    kindInput.value == "" ||
    colorInput.value == "" ||
    weightInput.value == ""
  ) {
    alert("Заполните все поля");
  } else if (!weightInput.value.match(/^[0-9]+$/)) {
    alert("В поле веса нужно указать только цифры");
  } else if (weightInput.value > 999999) {
    alert("Укажите корректное значение");
  } else {
    acceptedColors = [
      "желтый",
      "зеленый",
      "фиолетовый",
      "розово-красный",
      "светло-коричневый",
    ];
    if (acceptedColors.includes(colorInput.value.toLowerCase())) {
      color = colorInput.value.toLowerCase();
    } else {
      color = acceptedColors[Math.floor(Math.random() * acceptedColors.length)];
      alert("Выберите цвет: " + color);
    }
    fruit = { kind: kindInput.value, color: color, weight: weightInput.value };
    fruitsAll.push(fruit);
  }
  display();
});
