import { basename } from "path";

module.exports = function(event) {
    // ids
    const CANCEL_OPTION = "cancel_option",
          NEW_OPTION = "new_option",
          ADD = "add",
          DELETE = "delete",
          SUBMIT = "submit",
          FIELDSET = "fs";

    document.getElementById("poll_form").addEventListener("click", activateOptions);




    function activateOptions(event) {

        // MSIE hack
        if (window.event) event = window.event;

        const addBtn = document.getElementById(ADD),
              deleteBtn = document.getElementById(DELETE),
              submitBtn = document.getElementById(SUBMIT),
              fieldset = document.getElementById(FIELDSET);
        
        if (event.target.id == null) return;
        if (event.target.className == null) return;

        switch (event.target.id) {
            case ADD:
                addOption(fieldset, addBtn, submitBtn);
                break;
            case CANCEL_OPTION:
                cancelNewOption(event);
                break;
            default:
                break;
        }
    }

    function addOption(fieldset, addBtn, submitBtn) {

        if (document.getElementById(NEW_OPTION)) return;
        
        const input = document.createElement("input"),
              cancelBtn = document.createElement("div"),
              wrapper = document.createElement("div");

        input.className = "form__wrapper__options";
        input.maxLength = 25;
        input.setAttribute("name", "voted_option");
        input.setAttribute("id", NEW_OPTION);
        input.name = "newOption";

        cancelBtn.className = "form__wrapper__cancel btn btn--medium btn--full";
        cancelBtn.setAttribute("id", CANCEL_OPTION);
        cancelBtn.innerHTML = "Cancel";

        wrapper.appendChild(input);
        wrapper.appendChild(cancelBtn);
        wrapper.className = "form__wrapper";

        fieldset.insertBefore(wrapper, fieldset.lastChild);
        input.focus();
    }

    function cancelNewOption(event) {
        
        if (window.event) event = window.event;
        
        const fieldset = event.target.parentNode.parentNode,
              wrapper = event.target.parentNode;

        wrapper.style.width = "0px";
        event.target.style.width = "0px";
        event.target.style.color = "#fff";
        event.target.style.textShadow = "none";

        setTimeout(function(){ wrapper.removeChild(wrapper.lastChild); }, 50);
        setTimeout(function(){ fieldset.removeChild(fieldset.lastChild.previousSibling); }, 300);
    }
}

