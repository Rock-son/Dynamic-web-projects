// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
          
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);


//MAIN
document.addEventListener("DOMContentLoaded", main);


  function main() {

    document.getElementById("options_button").addEventListener("click", addOption);



  }

  function addOption(e) {

    e.preventDefault();    
    if (document.getElementById("new_form_option").value === "") {return};
    
    const parentNode = document.getElementById("new_form_option"),
          wrapper = document.createElement("div"),
          input = document.createElement("input"),
          edit = document.createElement("div"),
          close = document.createElement("div");
    // WRAPPER
    wrapper.className = "wrapper";
    // INPUT
    input.readOnly = true;
    input.name = "options";
    input.value = document.getElementById("new_form_option").value;
    // EDIT
    edit.className = "fa fa-pencil edit";
    edit.setAttribute("aria-hidden","true");
    // CLOSE
    close.innerHTML = "X";
    close.className = "close";

    wrapper.appendChild(input);
    wrapper.appendChild(edit);
    wrapper.appendChild(close);


    document.getElementById("context__options").appendChild(wrapper);
    document.getElementById("new_form_option").value = "";
    document.getElementById("new_form_option").focus();
  }

  function editEvent() {
    
  }