import { basename } from "path";

module.exports = function(e) {
    // ELEMENT IDs
    const CANCEL_BTN = "cancel_option",
          SELECTED_OPTION = "new_option",
          ADD_BTN = "add",
          DELETE = "delete",
          SUBMIT = "submit",
          FIELDSET = "fs",
          WARNING = "warning",
          FORM_OPTIONS = "form__options";

    document.getElementById("poll_form").addEventListener("click", activateOptions);




    function activateOptions(e) {

        // MSIE hack
        if (window.event) e = window.event;

        const fieldset = document.getElementById(FIELDSET),
              id = parseInt(e.target.id != null ? e.target.id : 0),
              idIsNaN = !(id === id); // isNaN is the only thing in JS that is not equal to itself!
        
        if ( e.target.id != null && idIsNaN ) {
            switch (e.target.id) {
                case ADD_BTN:
                    addNewOption(fieldset);
                    break;
                case CANCEL_BTN:
                    cancelNewOption(e);
                    break;
                case SELECTED_OPTION:
                    closeWarning(e);
                case SUBMIT:
                    submitForm(e);
                    break;
                case DELETE + "_btn":
                    showWrapper(fieldset);
                    break;
                case DELETE:
                    fieldset.lastChild.click();
                    break;
                default:
                    break;
            }
        }
        if ( e.target.className != null && !idIsNaN ) {
            switch (e.target.className) {
                case FORM_OPTIONS:
                    selectOption(e);
                    break;            
                default:
                    break;
            }
        }        
    }

    function addNewOption(fieldset) {

        // LEAVE NEW OPT INPUT (if open)
        if (document.getElementById(SELECTED_OPTION)) {
            return;
        }
        // CLOSE DELETE INPUT (if open)
        if (document.getElementById(DELETE)) {
            document.getElementById(CANCEL_BTN).click();
            return;
        }
        if (document.querySelector(".form__options.selected")) {
            document.querySelector(".form__options.selected").className = "form__options";
        } 
        closeWarning(e);

        const input = document.createElement("input"),
              cancelBtn = document.createElement("div"),
              wrapper = document.createElement("div");

        input.className = "form__wrapper__options";
        input.maxLength = 25;
        input.setAttribute("id", SELECTED_OPTION);
        input.name = "newOption";

        cancelBtn.className = "form__wrapper__cancel btn btn--medium btn--full";
        cancelBtn.setAttribute("id", CANCEL_BTN);
        cancelBtn.innerHTML = "Cancel";

        wrapper.appendChild(input);
        wrapper.appendChild(cancelBtn);
        wrapper.className = "form__wrapper";

        fieldset.insertBefore(wrapper, fieldset.lastChild);
        fieldset.lastChild.value = "Submit Vote with My Option";
        input.focus();
    }

    function cancelNewOption(e) {
                
        const fieldset = e.target.parentNode.parentNode,
              wrapper = e.target.parentNode;

        if ( document.getElementById("warning") != null ) {
              fieldset.removeChild(fieldset.lastChild.previousSibling); 
        }
        wrapper.style.width = "0px";
        e.target.style.width = "0px";
        e.target.style.color = "#fff";
        e.target.style.textShadow = "none";

        setTimeout(function() { 
            wrapper.removeChild(wrapper.lastChild);
            wrapper.firstChild.value = "";
            wrapper.firstChild.style.width = "0px";
        }, 50);
        setTimeout(function() { 
            fieldset.removeChild(fieldset.lastChild.previousSibling); 
            fieldset.lastChild.value = "Submit Vote";
        }, 500);
    }

    function selectOption(e) {

        const voted_el = document.getElementById("voted_option"),
              target_data = JSON.parse(document.getElementById("poll_data").value);

        closeWarning(e);

        // PUT VALUE IN INPUT - which will be posted
        voted_el.value = target_data.options[e.target.id][0];

        // WHEN SELECTING - deselect each item and close new option if exists
        const list = document.getElementsByClassName("form__options"),
              newOption = document.getElementById(SELECTED_OPTION),
              deleteOption = document.getElementById(DELETE),
              len = list.length;
        for (let i = 0; i < len; i++) { list.item(i).className = FORM_OPTIONS; }
        if (newOption || deleteOption) {document.getElementById(CANCEL_BTN).click();}

        // ADD "SELECTED" CLASS TO "MESSENGER" DIV
        e.target.className = e.target.className + " selected";        
    }

    function closeWarning(e) {

        let fieldset = document.getElementById("fs");

        if (document.getElementById("warning") != null) {
            fieldset.removeChild(fieldset.lastChild.previousSibling); 
        }
    }

    function submitForm(e) {

        const EMPTY_NEW_OPTION = "empty", NO_VALUE = "no_value";

        let doc = null;
        // IF NEW INPUT EXISTS AND (IS NOT ZERO): SET VAL ELSE ERROR
        if ((doc = document.getElementById(SELECTED_OPTION)) != null) {
            if (doc.value !== "") {
                document.getElementById("voted_option").value = doc.value;
            } else {
                e.preventDefault();
                showError(EMPTY_NEW_OPTION);
            }
        // ELSE CHECK ACTIVE VALUE OR EXISTANCE OF DELETE BTN
        } else if (!document.querySelector(".form__options.selected") && !document.getElementById("delete")) {
                e.preventDefault();
                showError(NO_VALUE);
        }

                function showError(type) {

                    const fieldset = document.getElementById("fs"),
                            error = document.createElement("div");

                    error.setAttribute("id", "warning");
                    error.style.color = "red";
                    switch (type) {
                        case EMPTY_NEW_OPTION:
                            error.innerHTML = "Input new option or close the input field!";
                            break;
                        case NO_VALUE:
                            error.innerHTML = "Please select or add one option!";
                            break;
                        default:
                            error.innerHTML = "Unexpected error. Try reloading the page.";
                            break;
                    }            

                    fieldset.insertBefore(error, fieldset.lastChild);
                }            
    }

    function showWrapper(fieldset) {

        // CLOSE NEW INPUT (if open)
        if (document.getElementById(SELECTED_OPTION)) {
            document.getElementById(CANCEL_BTN).click();
            return;
        }
        // LEAVE OPEN DELETE INPUT
        if (document.getElementById(DELETE)) return;

        // DESELECT ANY SELECTED OPTIONS
        if (document.querySelector(".form__options.selected")) {
            document.querySelector(".form__options.selected").className = "form__options";
        } 


        const input = document.createElement("input"),
              cancelBtn = document.createElement("div"),
              wrapper = document.createElement("div");

        input.className = "form__wrapper__delete btn btn--medium btn--full";
        input.value = "Go ahead!"
        input.name = "delete_poll"
        input.setAttribute("id", DELETE);

        cancelBtn.className = "form__wrapper__cancel-delete btn btn--medium btn--full";
        cancelBtn.setAttribute("id", CANCEL_BTN);
        cancelBtn.innerHTML = "Cancel";

        wrapper.appendChild(input);
        wrapper.appendChild(cancelBtn);
        wrapper.className = "form__wrapper";

        fieldset.insertBefore(wrapper, fieldset.lastChild);
    }
}
