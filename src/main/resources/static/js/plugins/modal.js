// Create a hidden modal window element with no pre-loaded data and append it to DOM
function _createModal(primaryKey) {
    const modal = document.createElement('div');
    modal.classList.add('modal-container');
    modal.id = "modal-container-" + primaryKey;
    modal.insertAdjacentHTML('afterbegin', `<div class="modal-overlay">
                                                <div class="modal-window">
                                                    <form action="/filtered_articles" method="POST">
                                                        <div class="modal-header">
                                                            <span class="modal-title">Modal title</span>
                                                            <span class="modal-close" onclick="myModal.close();">&times;</span>
                                                        </div>

                                                        <div class="modal-body container-fluid">
                                                            <div class="row filters-name-row">
                                                                <div>
                                                                    <span>Filterbezeichnung</span>
                                                                </div>
                                                                <div class="filters-name-container">
                                                                    <input type='text' class="filters-name">
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div>
                                                                    <span>Filterbedingungen</span>
                                                                </div>
                                                                <div>
                                                                    <div class="control-rows">

                                                                    </div>
                                                                    <input name="filtersArrayAsJSON" type="hidden" required>
                                                                </div>
                                                                <div class="add-row-button-div">
                                                                    <section class="add-row-button-container">
                                                                        <button class="add-row" onclick="$.addFilterRow(this.closest('.modal-container'));">+</button>
                                                                    </section>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div></div>
                                                                <div>
                                                                    <p class="error-message"></p>
                                                                </div>
                                                            </div>
                                                            <div class="row which-filters-apply-row">
                                                                <div>
                                                                    <span>Eintrag soll erfüllen</span>
                                                                </div>
                                                                <div class="which-filters-apply-container">
                                                                    <section>
                                                                        <input type="radio" id="all" name="whichFiltersApply" required>
                                                                        <label for="all">alle Bedingungen</label>
                                                                    </section>
                                                                    <section>
                                                                        <input type="radio" id="atLeastOne" name="whichFiltersApply" required>
                                                                        <label for="atLeastOne">mindestens eine Bedingung</label>
                                                                    </section>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div></div>
                                                                <div>
                                                                    <button type="button" onclick="downloadFilters(this.closest('.modal-container'));">Filters als JSON exportieren</button>
                                                                    <button type="submit">Filter anwenden</button>
                                                                    <button type="button" onclick="filter">Abbrechen</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>`);
    document.body.appendChild(modal);
    $.addFilterRow(modal);
    addEventListenerToModal(modal);

    return modal;
}

function addEventListenerToModal(modal) {
    document.querySelector('#' + modal.id + ' .control-rows').addEventListener("change", function(e) {

        document.querySelector('#' + modal.id + ' .error-message').textContent = '';

        if (e.target.getAttribute('name') === 'filterType') {
             switchComparingConditions(e);
        }
        if (e.target.getAttribute('name') === 'day' || e.target.getAttribute('name') === 'month' || e.target.getAttribute('name') === 'year') {
            updateDateStringInput(e.target.closest('.input-container'));
        }


    }, false);
}

// Write and erase error messages
function setErrorMessageText(modal, message) {
    const errMsg = document.querySelector("#" + modal.id + ' .error-message');
    errMsg.textContent = message;
}

// When user clicks on a "+" button, a new row appears
$.addFilterRow = function(modal) {

    setErrorMessageText(modal, "");

    const newRow = document.createElement('div');
    newRow.classList.add('single-control-row');

    newRow.insertAdjacentHTML('afterbegin', `<section class="filter-type-container" value="likes">
                      <select name="filterType" required>
                          <option value="likes">Likes</option>
                          <option value="title">Titel</option>
                          <option value="dateOfIssue">Veröffentlichungsdatum</option>
                      </select>
                  </section>
                  <section class="compare-condition-container" value="lessThan">
                      <select name="compareCondition" required>
                          <option value="lessThan">weniger als</option>
                          <option value="moreThan">mehr als</option>
                          <option value="equals">ist gleich</option>
                      </select>
                  </section>
                  <section class="input-container">
                      <input name="input" type="number" required>
                  </section>
                  <section class="remove-row-button-container">
                      <button type="button" onclick="$.removeFilterRow(this);">–</button>
                  </section>`);
    document.querySelector("#" + modal.id + " .control-rows").appendChild(newRow);
}

// Create a new modal window and implement open and close methods to it.
$.modal = function(primaryKey) {
    const $modal = _createModal(primaryKey);
    return {
        open() {
            $modal.classList.add('open');
        },
        close() {
            $modal.classList.remove('open')
        },
        destroy() {}
    }
};

// When user changes the filter type, both comparing condition and input elements are changed according to the new filter type
function switchComparingConditions(e) {
    let HTML = {};
    let filterType = e.target.value;
    switch (filterType) {
        case "likes":
            HTML.compareConditions = `<select name="compareCondition" value="lessThan" required>
                                          <option value="lessThan">weniger als</option>
                                          <option value="moreThan">mehr als</option>
                                          <option value="equals">ist gleich</option>
                                      </select>`;

            HTML.input = `<input name="input" type="number" required>`;
            break;

        case "title":
            HTML.compareConditions = `<select name="compareCondition" value="startsWith" required>
                                          <option value="startsWith" selected>beginnt mit</option>
                                          <option value="contains">enthält</option>
                                          <option value="containsKeywords">enthält Stichwörter</option>
                                      </select>`;

            HTML.input = `<input name="input" type="text" required>`;
            break;

        case "dateOfIssue":

            HTML.compareConditions = `<select name="compareCondition" required>
                                          <option value="before">liegt vor dem</option>
                                          <option value="on">liegt am</option>
                                          <option value="after">liegt nach dem</option>
                                      </select>`,

            HTML.input = generateDateInputHTML();

            break;

        default:
            break;
    }

    const currentRow = e.target.closest('.single-control-row');
    currentRow.children[1].innerHTML = HTML.compareConditions;
    currentRow.children[2].innerHTML = HTML.input;

//    Auto-insert jsoned string value of default date
    if (filterType === "dateOfIssue") {
        updateDateStringInput(e.target.closest('.single-control-row').children[2]);
    }
}

function generateDateInputHTML() {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  let dateInputHTML = '';

  dateInputHTML += '<select name="day" required>';
  for (let day = 1; day <= 31; day++) {

    dateInputHTML += ('<option value="' + day + '">' + day + '</option>')
  }
  dateInputHTML += '</select>';

  dateInputHTML += '<select name="month" required>';
  for (let month of months) {
    dateInputHTML += ('<option value="' + month + '">' + month + '</option>')
  }
  dateInputHTML += '</select>';

  dateInputHTML += '<select name="year" required>';
  for (let year = 1980; year <= (new Date).getFullYear(); year++) {
    dateInputHTML += ('<option value="' + year + '">' + year + '</option>')
  }
  dateInputHTML += '</select>';
  dateInputHTML += '<input name="input" type="hidden" required>';

  return dateInputHTML;
}

// This function takes the date input container, converts day, month and year values into a date and puts its jsoned value into the hidden input.
function updateDateStringInput(inputContainer) {
    const dateSelects = inputContainer.children;
    let dateObj = new Date();
    dateObj.setUTCFullYear(dateSelects[2].value);
    dateObj.setUTCMonth(findMonthIndex(dateSelects[1].value));
    dateObj.setUTCDate(dateSelects[0].value);
    dateObj.setUTCHours(0, 0, 0, 0);

    const inputElem = dateSelects[3];

    inputElem.value = dateObj.toJSON();

}


function downloadFilters(modal) {


    let filename = (document.querySelector("#" + modal.id + " .filters-name").value || "filters") + '.json';
    const errorMsg = document.querySelector("#" + modal.id + " .error-message");
    let content = '';

    content = [];
    for (let row of document.querySelector("#" + modal.id + " .control-rows").children) {
      let rowObject = {};
      rowObject.filterType = row.children[0].firstElementChild.value;
      rowObject.compareCondition = row.children[1].firstElementChild.value;
      if (rowObject.filterType === 'dateOfIssue') {
        const dateSelects = row.children[2].children;
        let dateObj = new Date();
        dateObj.setUTCFullYear(dateSelects[2].value);
        dateObj.setUTCMonth(findMonthIndex(dateSelects[1].value));
        dateObj.setUTCDate(dateSelects[0].value);
        dateObj.setUTCHours(0, 0, 0, 0);

        rowObject.input = dateObj.toJSON();
      } else {
        rowObject.input = row.children[2].firstElementChild.value;
      }

      if(!rowObject.input) {
        errorMsg.textContent = 'Alle Inputs müssen erfüllt werden!';
        break;
      }
      content.push(rowObject);
    }

    if(errorMsg.textContent !== 'Alle Inputs müssen erfüllt werden!') {
        download(filename, JSON.stringify(content, true));
    }
}

function findMonthIndex(month) {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return months.indexOf(month);
}

function download(filename, content) {
    let element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));

    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

//function changeButtonToSaveToDB(form) {
//    form.children[3].firstElementChild.innerHTML = 'speichern';
//}

// Returns the number of rows
function howManyRowsShown(modal) {
    const rowsArray = document.querySelector('#' + modal.id + ' .control-rows').children;
    return rowsArray.length;
}