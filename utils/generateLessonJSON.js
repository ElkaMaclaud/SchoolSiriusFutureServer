// const getRandomDate = (start, end) => {
//   const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//   const minutes = Math.round(date.getMinutes() / 15) * 15; // Округляем минуты до ближайшего кратного 15
//   date.setMinutes(minutes);
//   return date;
// };

// const data = [];

// for (let i = 0; i < 100; i++) {
//   const startDate = new Date(2024, 1, 1); // Начальная дата - 1 февраля 2024 года
//   const endDate = new Date(2024, 6, 30); // Конечная дата - 30 июля 2024 года
//   const randomDate = getRandomDate(startDate, endDate);
//   randomDate.setHours(Math.floor(Math.random() * 9) + 8); // Устанавливаем случайное время от 8:00 до 16:00
//   const lesson = {
//     date: randomDate.toISOString(),
//     lessonName: "Ментальная арифметика",
//   };
//   data.push(lesson);
// }

// console.log(data);

const getRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15; // Округляем минуты до ближайшего кратного 15
  date.setMinutes(roundedMinutes);
  return date;
};

const data = [];

for (let i = 0; i < 100; i++) {
  const startDate = new Date(2024, 1, 1); // Начальная дата - 1 февраля 2024 года
  const endDate = new Date(2024, 6, 30); // Конечная дата - 30 июля 2024 года
  const randomDate = getRandomDate(startDate, endDate);
  randomDate.setHours(Math.floor(Math.random() * 9) + 8); // Устанавливаем случайное время от 8:00 до 16:00
  const lesson = {
    date: randomDate.toISOString(),
    lessonName: "Ментальная арифметика",
  };
  data.push(lesson);
}

console.log(data);

// const getRandomDate = (start, end) => {
//   const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//   const minutes = date.getMinutes();
//   const roundedMinutes = Math.round(minutes / 15) * 15; // Округляем минуты до ближайшего кратного 15
//   date.setMinutes(roundedMinutes);
//   date.setSeconds(0); // Округляем секунды до 00
//   return date;
// };

// const data = [];

// for (let i = 0; i < 100; i++) {
//   const startDate = new Date(2024, 1, 1); // Начальная дата - 1 февраля 2024 года
//   const endDate = new Date(2024, 6, 30); // Конечная дата - 30 июля 2024 года
//   const randomDate = getRandomDate(startDate, endDate);
//   randomDate.setHours(Math.floor(Math.random() * 9) + 8); // Устанавливаем случайное время от 8:00 до 16:00
//   const lesson = {
//     date: randomDate.toISOString(),
//     lessonName: "Ментальная арифметика",
//   };
//   data.push(lesson);
// }

// console.log(data);

  