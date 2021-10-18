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
                                                            <span class="modal-close" onclick="this.closest('.modal-container').close();">&times;</span>
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
                                                                    <input class="filtersAsJSON" name="filtersAsJSON" type="hidden" value='[{"filterType":"likes","compareCondition":"lessThan","input":"34"}]' required>
                                                                </div>
                                                                <div class="add-row-button-div">
                                                                    <section class="add-row-button-container">
                                                                        <button class="add-row" onclick="addFilterRow(this.closest('.modal-container'));">+</button>
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
                                                                        <input type="radio" value="all" name="whichFiltersApply" required>
                                                                        <label for="all">alle Bedingungen</label>
                                                                    </section>
                                                                    <section>
                                                                        <input type="radio" value="atLeastOne" name="whichFiltersApply" required>
                                                                        <label for="atLeastOne">mindestens eine Bedingung</label>
                                                                    </section>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div></div>
                                                                <div>
                                                                    <button type="button" onclick="downloadFilters(this.closest('.modal-container'));">Filters als JSON exportieren</button>
                                                                    <button type="submit" onclick="updateFiltersHiddenInput(this.closest('.modal-container'));">Filter anwenden</button>
                                                                    <button type="button" onclick="this.closest('.modal-container').close();">Abbrechen</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>`);
    document.body.appendChild(modal);

    modal.errorMessage = getErrorMessageObject(modal);
    modal.open = function() {
         modal.classList.add('open');
    },
    modal.close = function() {
        modal.classList.remove('open')
    },
    modal.destroy = function() {}


    addFilterRow(modal);
    addEventListenerToModal(modal);

    return modal;
}

// Create error message object with getters and setters of its text content
function getErrorMessageObject(modal) {
    const $errMsg = document.querySelector("#" + modal.id + " .error-message");

    return {
            setMessage(textContent) {
                $errMsg.textContent = textContent;
            },
            getMessage() {
                return $errMsg.textContent;
            },
            clear() {
                $errMsg.textContent = "";
            }
        }
}

function addEventListenerToModal(modal) {
    document.querySelector('#' + modal.id + ' .control-rows').addEventListener("change", function(e) {

        modal.errorMessage.clear();

        if (e.target.getAttribute('name') === 'filterType') {
             switchComparingConditions(e);
        }
        if (e.target.getAttribute('name') === 'day' || e.target.getAttribute('name') === 'month' || e.target.getAttribute('name') === 'year') {
            updateDateStringInput(e.target.closest('.input-container'));
        }


    }, false);
}

// Write and erase error messages
//function setErrorMessageText(modal, message) {
//    const errMsg = document.querySelector("#" + modal.id + ' .error-message');
//    errMsg.textContent = message;
//}

// When user clicks on a "+" button, a new row appears
function addFilterRow(modal) {

    modal.errorMessage.clear();
    console.log(modal)

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

// When user changes the filter type, both comparing condition and input elements are changed according to the new filter type
function switchComparingConditions(e) {
    let HTML = {};
    let newFilterType = e.target.value;
    switch (newFilterType) {
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
    if (newFilterType === "dateOfIssue") {
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
    const inputSelects = inputContainer.children;
    let dateObj = new Date();
    dateObj.setUTCFullYear(inputSelects[2].value);
    dateObj.setUTCMonth(findMonthIndex(inputSelects[1].value));
    dateObj.setUTCDate(inputSelects[0].value);
    dateObj.setUTCHours(0, 0, 0, 0);

    const hiddenInput = inputSelects[3];

    hiddenInput.value = dateObj.toJSON();

}


function updateFiltersHiddenInput(modal) {
    let hiddenInput = document.querySelector("#" + modal.id + " input.filtersAsJSON");
    let content = getFiltersAsJSON(modal);

    hiddenInput.value = content;
}

// Finds file name
function downloadFilters(modal) {

    if(modal.errorMessage.getMessage() !== 'Alle Inputs müssen erfüllt werden!') {
        let filename = (document.querySelector("#" + modal.id + " .filters-name").value || "filters") + '.json';

        let content = getFiltersAsJSON(modal);
        if (content) {
            download(filename, content);
        } else {
            modal.errorMessage.setMessage('Alle Inputs müssen erfüllt werden!');
        }

    }
}

function findMonthIndex(month) {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return months.indexOf(month);
}

// This takes 2 params: file name and file content. Subsequently, it generates a file and starts the downloading process, asking the user where he'd like to store the file on his computer
function download(filename, content) {
    let element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));

    element.setAttribute('download', filename);
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

// Returns the amount of filter rows of the particular modal window
function howManyRowsShown(modal) {
    const rowsArray = document.querySelector('#' + modal.id + ' .control-rows').children;
    return rowsArray.length;
}

// Takes all the filter rows, generates an array of filter objects and returns its value as json string
function getFiltersAsJSON(modal) {

    let content = [];
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
        return false;
      }
      content.push(rowObject);
    }

    return JSON.stringify(content);
}