"use strict"
const xssFilters = require("xss-filters");


document.addEventListener("DOMContentLoaded", main);


  function main() {

    document.getElementById("pollTitle").focus();
    document.getElementById("options_btn").addEventListener("click", addOption);
    document.getElementById("submit_btn").addEventListener("click", checkInputs);

    document.getElementById("pollTitle").addEventListener("focus", deleteWarning);
    document.getElementById("new_option").addEventListener("focus", deleteWarning);
  }





function deleteWarning(e) {

  const parent = e.target.parentNode,
        nextSibling = e.target.nextSibling;
        
  if (nextSibling.className === "context__form__alert title") {
      parent.removeChild(e.target.nextSibling);
  } else if (nextSibling.nextSibling.className === "context__form__alert options") {
      parent.removeChild(e.target.nextSibling.nextSibling);
  }
}




function checkInputs(e) {

  e.preventDefault();
  const parent = document.getElementById("fs"),
        titleEL = document.getElementById("pollTitle"),
        title = titleEL.value.trim(),        
        button = document.getElementById("options_btn"),
        options = document.getElementById("container__options"),
        nrChildren = options.childNodes.length,
        warning = document.createElement("div");
        
  warning.innerHTML = "Input data!"
  
  if (title != "" && nrChildren > 0 ) {
      parent.parentNode.submit();

  } else if (title === "" && nrChildren === 0 ) {      
      
      if (document.getElementsByClassName("context__form__alert title")[0] == null) {
          warning.className = "context__form__alert title";
          parent.insertBefore(warning.cloneNode(true), titleEL.nextSibling);
      }
      if (document.getElementsByClassName("context__form__alert options")[0] == null) {
          warning.className = "context__form__alert options";
          parent.insertBefore(warning.cloneNode(true), button.nextSibling);
      }

  } else if (title === "" && nrChildren > 0 ) {
      if (document.getElementsByClassName("context__form__alert title")[0] == null) {
          warning.className = "context__form__alert title";
          parent.insertBefore(warning.cloneNode(true), titleEL.nextSibling);
      }

  } else if (title !== "" && nrChildren === 0) {
      
      if (document.getElementsByClassName("context__form__alert options")[0] == null) {
          warning.className = "context__form__alert options";
          parent.insertBefore(warning.cloneNode(true), button.nextSibling);
      }
  }
}

function addOption(e) {

    e.preventDefault();
    if (document.getElementById("new_option").value.trim() === "") {return};
    
    const parentNode = document.getElementById("new_option"),
          wrapper = document.createElement("div"),
          input = document.createElement("input"),
          edit = document.createElement("div"),
          remove = document.createElement("div");

    // WRAPPER EL
    wrapper.className = "wrapper";
    // INPUT EL
    input.readOnly = true;
    input.maxLength = 50;
    input.name = "options";
    input.value = xssFilters.inHTMLData(document.getElementById("new_option").value);
    input.addEventListener("focusout", onFocusLost);
    // EDIT EL
    edit.className = "fa fa-pencil edit";
    edit.setAttribute("aria-hidden","true");
    edit.addEventListener("click", editInput);
    // REMOVE EL
    remove.className = "fa fa-window-close close";
    remove.setAttribute("aria-hidden","true");
    remove.addEventListener("click", removeWrapper);


    wrapper.appendChild(input);
    wrapper.appendChild(remove);
    wrapper.appendChild(edit);

    document.getElementById("container__options").appendChild(wrapper);
    document.getElementById("new_option").value = "";
    document.getElementById("new_option").focus();  
}

function editInput(e) {
  e.target.parentNode.childNodes[0].readOnly = false;
  e.target.parentNode.childNodes[0].focus();
}

function onFocusLost(e) {
    e.target.readOnly = true;
}

function removeWrapper(e) {
  
    const parent = e.target.parentNode.parentNode,
          wrapper = e.target.parentNode;

    wrapper.childNodes[0].removeEventListener("focusout", onFocusLost);
    wrapper.childNodes[1].removeEventListener("click", removeWrapper);
    wrapper.childNodes[2].removeEventListener("click", editInput);

    wrapper.style.width = "0px";
    wrapper.removeChild(e.target.nextSibling);
    wrapper.removeChild(e.target);

    setTimeout(function(){ parent.removeChild(wrapper); }, 200);
}