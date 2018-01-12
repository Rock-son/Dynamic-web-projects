/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener("DOMContentLoaded", main);

function main() {

    document.getElementById("options_btn").addEventListener("click", addOption);
    document.getElementById("submit_btn").addEventListener("click", checkInputs);

    document.getElementById("pollTitle").addEventListener("focus", deleteWarning);
    document.getElementById("new_option").addEventListener("focus", deleteWarning);
}

function deleteWarning(e) {

    var parent = e.target.parentNode,
        nextSibling = e.target.nextSibling;

    if (nextSibling.className === "context__form__alert title") {
        parent.removeChild(e.target.nextSibling);
    } else if (nextSibling.nextSibling.className === "context__form__alert options") {
        parent.removeChild(e.target.nextSibling.nextSibling);
    }
}

function checkInputs(e) {

    e.preventDefault();
    var parent = document.getElementById("fs"),
        titleEL = document.getElementById("pollTitle"),
        title = titleEL.value.trim(),
        button = document.getElementById("options_btn"),
        options = document.getElementById("context__options"),
        nrChildren = options.childNodes.length,
        warning = document.createElement("div");

    warning.innerHTML = "Please input data!";

    if (title != "" && nrChildren > 0) {
        e.target.click();
    } else if (title === "" && nrChildren === 0) {

        if (document.getElementsByClassName("context__form__alert title")[0] == null) {
            warning.className = "context__form__alert title";
            parent.insertBefore(warning.cloneNode(true), titleEL.nextSibling);
        }
        if (document.getElementsByClassName("context__form__alert options")[0] == null) {
            warning.className = "context__form__alert options";
            parent.insertBefore(warning.cloneNode(true), button.nextSibling);
        }
    } else if (title === "" && nrChildren > 0) {
        if (document.getElementsByClassName("context__form__alert title")[0] == null) {
            warning.className = "context__form__alert title";
            parent.insertBefore(warning.cloneNode(true), titleEL.nextSibling);
        }
    } else if (title !== "" && nrChildren === 0) {

        if (!document.getElementsByClassName("context__form__alert options")[0] == null) {
            warning.className = "context__form__alert options";
            parent.insertBefore(warning.cloneNode(true), button.nextSibling);
        }
    }
}

function addOption(e) {

    e.preventDefault();
    if (document.getElementById("new_option").value.trim() === "") {
        return;
    };

    var parentNode = document.getElementById("new_option"),
        wrapper = document.createElement("div"),
        input = document.createElement("input"),
        edit = document.createElement("div"),
        remove = document.createElement("div");

    // WRAPPER EL
    wrapper.className = "wrapper";
    // INPUT EL
    input.name = "options";
    input.value = document.getElementById("new_option").value;
    input.addEventListener("focusout", onFocusLost);
    // EDIT EL
    edit.className = "fa fa-pencil edit";
    edit.setAttribute("aria-hidden", "true");
    edit.addEventListener("click", editInput);
    // REMOVE EL
    remove.className = "fa fa-trash-o close";
    remove.setAttribute("aria-hidden", "true");
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
    e.target.readOnly = true;
}

function removeWrapper(e) {

    var parent = e.target.parentNode.parentNode,
        wrapper = e.target.parentNode;

    wrapper.childNodes[0].removeEventListener("focusout", onFocusLost);
    wrapper.childNodes[2].removeEventListener("click", editInput);
    e.target.removeEventListener("click", removeWrapper);

    wrapper.style.width = "0px";
    wrapper.removeChild(e.target.nextSibling);
    wrapper.removeChild(e.target);

    setTimeout(function () {
        parent.removeChild(wrapper);
    }, 200);
}

/***/ })
/******/ ]);