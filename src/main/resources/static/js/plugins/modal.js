// I ended up not using this function due to being unable to use thymeleaf in it
function _createModal(options) {
    const modal = document.createElement('div');
    modal.classList.add('modal-container');
    modal.insertAdjacentHTML('afterbegin', `<div class="modal-overlay">
            <div class="modal-window">
                <div class="modal-header">
                    <span class="modal-title">Modal title</span>
                    <span class="modal-close" onclick="myModal.close();">&times;</span>
                </div>

                <div class="modal-body"></div>
                <table>
                  <tbody>
                    <tr>
                      <td>Filterbezeichnung</td>
                      <td><input type='text' id="filters-name"></td>
                    </tr>
                    <tr>
                      <td>Filterbedingungen</td>
                      <td>
                        <table id="control-rows">
                          <tbody>

                          </tbody>
                        </table>
                        <p id="error-message"></p>
                      </td>
                      <td>
                        <button onclick="$.addFilterRow();">+</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Eintrag soll erfüllen</td>
                      <td>
                        <input type="radio" id="all" name="whichFiltersApply">
                        <label for="all">alle Bedingungen</label><br>
                        <input type="radio" id="atLeastOne" name="whichFiltersApply">
                        <label for="atLeastOne">mindestens eine Bedingung</label><br>
                        <input type="radio" id="noneOf" name="whichFiltersApply">
                        <label for="noneOf">keine der Bedingungen</label>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <button>Filter to DB speichern</button>
                        <button onclick="downloadFilters();">Filter speichern</button>
                        <button>Abbrechen</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="modal-footer">

                </div>
            </div>
        </div>`);
    document.body.appendChild(modal);
    return modal;
}

$.modal = function(options) {
//    const $modal = _createModal(options);
    const $modal = document.querySelector("div.modal-container")
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

            HTML.compareConditions = `<select name="compareCondition">
                                          <option value="before">liegt vor dem</option>
                                          <option value="on">liegt am</option>
                                          <option value="after">liegt nach dem</option>
                                      </select>`,

            HTML.input = generateDateInputHTML();

            break;

        default:
            break;
    }

    e.target.parentElement.nextElementSibling.innerHTML = HTML.compareConditions;
    e.target.parentElement.nextElementSibling.nextElementSibling.innerHTML = HTML.input;

    if (filterType === "dateOfIssue") {
        updateDateStringInput(e.target.closest('form').children[2]);
    }
}

function generateDateInputHTML() {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  let dateInputHTML = '';

  dateInputHTML += '<select name="day">';
  for (let day = 1; day <= 31; day++) {

    dateInputHTML += ('<option value="' + day + '">' + day + '</option>')
  }
  dateInputHTML += '</select>';

  dateInputHTML += '<select name="month">';
  for (let month of months) {
    dateInputHTML += ('<option value="' + month + '">' + month + '</option>')
  }
  dateInputHTML += '</select>';

  dateInputHTML += '<select name="year">';
  for (let year = 1980; year <= (new Date).getFullYear(); year++) {
    dateInputHTML += ('<option value="' + year + '">' + year + '</option>')
  }
  dateInputHTML += '</select>';
  dateInputHTML += '<input name="input" type="hidden" required>';

  return dateInputHTML;
}

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

function downloadFilters() {
    let filename = (document.querySelector(".filters-name").value || "filters") + '.json';
    const errorMsg = document.querySelector('.error-message');
    let content = 'going crraaazy!';

    content = [];
    for (let row of document.querySelectorAll("form")) {
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
        errorMsg.textContent = 'Alle inputs müssen erfüllt werden!';
        break;
      }
      content.push(rowObject);
    }

    if(errorMsg.textContent !== 'Alle inputs müssen erfüllt werden!') {
        download(filename, JSON.stringify(content, true));
    }
}

function findMonthIndex(month) {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return (months.indexOf(month) || null)
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

function changeButtonToSaveToDB(form) {
    form.children[3].firstElementChild.innerHTML = 'speichern';
}

function howManyRowsShown() {
    const rowsArray = document.querySelector(".control-rows").children;
    return rowsArray.length;
}