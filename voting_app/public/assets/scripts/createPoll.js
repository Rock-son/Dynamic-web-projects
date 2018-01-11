"use strict"

document.addEventListener("DOMContentLoaded", main);


  function main() {

    document.getElementById("options_button").addEventListener("click", addOption);



  }

  function addOption(e) {

    e.preventDefault();    
    if (document.getElementById("new_option").value === "") {return};
    
    const parentNode = document.getElementById("new_option"),
          wrapper = document.createElement("div"),
          input = document.createElement("input"),
          edit = document.createElement("div"),
          remove = document.createElement("div");

    // WRAPPER
    wrapper.className = "wrapper";
    // INPUT
    input.readOnly = true;
    input.name = "options";
    input.value = document.getElementById("new_option").value;     
    input.addEventListener("onblur", onFocusLost);
    // EDIT
    edit.className = "fa fa-pencil edit";
    edit.setAttribute("aria-hidden","true");
    edit.addEventListener("click", editInput);
    // CLOSE
    remove.innerHTML = "X";
    remove.className = "close";
    remove.addEventListener("click", removeWrapper);


    wrapper.appendChild(input);
    wrapper.appendChild(remove);
    wrapper.appendChild(edit);

    document.getElementById("context__options").appendChild(wrapper);
    document.getElementById("new_option").value = "";
    document.getElementById("new_option").focus();
  
}



  function editInput(e) {
      e.target.parentNode.childNodes[0].readOnly = false;
      e.target.parentNode.childNodes[0].focus();
  }

  function onFocusLost(e) {
    console.log("focus!");
      e.target.readOnly = true;
  }

  function removeWrapper(e) {
      e.target.parentNode.childNodes[0].removeEventListener("onblur", onFocusLost);
      e.target.parentNode.childNodes[2].removeEventListener("click", editInput);
      e.target.removeEventListener("click", removeWrapper);
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
  }