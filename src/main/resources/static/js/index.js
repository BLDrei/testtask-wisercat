const myModal = _createModal(1);

// This function dynamically "sets" all values of options and inputs of a div, as if a user came in and selected these values manually
// It is made to avoid undefined values when exporting to JSON
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

    const modal = button.closest('.modal-container');
    let message = "";

    if(howManyRowsShown(modal) <= 1) {
        message = "Mindestens eine Reihe muss bleiben";
    } else {
        message = "";
        button.closest('.single-control-row').remove();
    }

    modal.errorMessage.setMessage(message);
}

// Same as $.setValuesOfRow, but works for an array
$.setValuesOfRows = function(array) {
    console.log(array);
    for (let div of array) {
        $.setValuesOfRow(div);
    }
}

//$.setValuesOfRows(document.querySelector(".control-rows").children);



