import * as chrono from 'chrono-node';

let initialized = false;

window.dates = `
next wednesday
Mon Mar 31 2025 20:48:42 GMT-0700 (Pacific Daylight Time)
2025-03-31T20:48:42.000Z
`;


window.BTTInitialize = function BTTInitialize() {
  initialized = true;
  checkSelectedTextForDate();
}

async function checkSelectedTextForDate() {
  const selectedText = await get_string_variable({variable_name: 'selected_text'});
  if (selectedText.length > 50) {
    // The selected text is too long to process
    return;
  }

  const parsedDate = chrono.parseDate(selectedText);
  if (parsedDate) {
    const dateString = parsedDate.toISOString();
    document.getElementById('date').innerText = dateString;
  } else {
    return;
  }
}

window.BTTNotification = async function BTTNotification(note) {
  if (!initialized) {
    return;
  }

  let data = JSON.parse(note);
  console.log(data.note, data.name);

  // example to get the currently active app, this works for any BTT variable you define:
  if(data.note == "BTTVariableChanged" && data.name == 'selected_text') {
     // the notification does only contain the name of the changed variable, so you'll need to retrieve
     // the value yourself:
     checkSelectedTextForDate();
  }

}
