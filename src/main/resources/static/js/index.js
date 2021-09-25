const myModal = $.modal();

document.querySelector('.control-rows').addEventListener("change", function(e) {

    document.querySelector('.error-message').textContent = '';

    if (e.target.getAttribute('name') === 'filterType') {
         switchComparingConditions(e);
    }
    if (e.target.getAttribute('name') === 'day' || e.target.getAttribute('name') === 'month' || e.target.getAttribute('name') === 'year') {
        updateDateStringInput(e.target.parentElement);
    }

//    When something in a an imported row of data is changed, you can no longer delete it from a DB, because it is no longer same as in the DB.
//    This changed row must be considered as new data, so this block of code changes button's functionality from deleting from a DB to saving to a DB.
    if (e.target.closest('form').getAttribute('action') === "/modal/delete") {
        e.target.closest('form').setAttribute('action', 'modal/add');
        changeButtonToSaveToDB(e.target.closest('form'));
    }



}, false);

$.addFilterRow = function() {
    const errMsg = document.querySelector('.error-message');
    errMsg.textContent = "";
    const newRow = document.createElement('div');
    newRow.classList.add('single-control-row');

    newRow.insertAdjacentHTML('afterbegin', `<form action="/modal/add" method="POST">
              <section class="filter-type-container" value="likes">
                  <select name="filterType" required>
                      <option value="likes">Likes</option>
                      <option value="title">Titel</option>
                      <option value="dateOfIssue">Veröffentlichungsdatum</option>
                  </select>
              </section>
              <section class="compare-condition-container" value="likes">
                  <select name="compareCondition" required>
                      <option value="lessThan">weniger als</option>
                      <option value="moreThan">mehr als</option>
                      <option value="equals">ist gleich</option>
                  </select>
              </section>
              <section class="input-container">
                  <input name="input" type="number" required>
              </section>
              <section class="DB-button-container">
                  <button type="submit">speichern</button>
              </section>
              <section class="remove-row-button-container">
                  <button type="button" onclick="$.removeFilterRow(this);">–</button>
              </section>
          </form>`);

    document.querySelector(".control-rows").appendChild(newRow);
}

// This function dynamically "sets" all values of a div, as if a user came in and selected these values
// It is made to prevent errors and avoid undefined values when exporting to JSON
$.setValuesOfRow = function(div) {

    const sections = div.firstElementChild.children;

    console.log(sections[0])
    for (let i = 0; i < 3; i++) {
        if(i === 2) {
            if (sections[0].getAttribute('value') === "dateOfIssue") {
                const dateString = sections[2].getAttribute('value');
                const dateObj = new Date(dateString);

                const dateSelects = sections[2].children;
                dateSelects[0].value = dateObj.getUTCDate();
                dateSelects[1].selectedIndex = dateObj.getUTCMonth();
                dateSelects[2].value = dateObj.getUTCFullYear();
                continue;
            }
        }
        sections[i].firstElementChild.value = sections[i].getAttribute('value');
    }
}

$.removeFilterRow = function(button) {
    const errMsg = document.querySelector('.error-message');
    if(howManyRowsShown() <= 1) {
        errMsg.textContent = "Mindestens eine Reihe muss bleiben";
    } else {
        button.closest('div.single-control-row').remove();
        errMsg.textContent = "";
    }
}

// Same as $.setValuesOfRow, but works for an array
$.setValuesOfRows = function(array) {
    console.log(array);
    for (let div of array) {
        $.setValuesOfRow(div);
    }
}


if (howManyRowsShown() === 0) {
    $.addFilterRow();
}

$.setValuesOfRows(document.querySelector(".control-rows").children);



