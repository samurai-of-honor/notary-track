export const main = function () {
  const input = document.getElementById('datepicker');
  const datepicker = new TheDatepicker.Datepicker(input);
  datepicker.render();

  datepicker.options.setInputFormat('d.m.Y');
  datepicker.options.setShowDeselectButton(false);
  const date = new Date();

  const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
  const month = ((date.getMonth() + 1) < 10) ?
    `0${date.getMonth() + 1}` :
    (date.getMonth() + 1);
  const year = date.getFullYear();
  const datestring = `${day}.${month}.${year}`;
  input.value = datestring;
};
