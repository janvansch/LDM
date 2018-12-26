"use strict";

// ================================================
//  Utilities - Filter table rows by column values
// ================================================
function filterTable(tableId, filterId) {
  //
  //  Read filter definition
  //
  var filter = filterDef(filterId);
  console.log("---> Filter definition: ", filter);
  //
  // Read filter parameter values from DOM
  //
  var filterObj = {};
  var cols = [];
  var x = 0;
  var colFilter = [], criteria = [];
  var colCount = filter.definition.length;
  console.log("---> Filter Column Count: ", colCount);
  for (var i=0; i < colCount; i++) {
    console.log("---> Filter ID: ", filter.definition[i].valueId);
    colFilter[i] = document.getElementById(filter.definition[i].valueId).value;
    if (colFilter[i].length > 0) {
      cols[x] = filter.definition[i].tableCol;
      criteria[x] = colFilter[i];
      console.log("---> Filter values 0:", cols[x], criteria[x]);
      x++;
    }
  }
  //
  // Apply filter to table rows
  //
  const table = document.getElementById(tableId);
  var tr = table.getElementsByTagName("tr");
  var td = [], i, j, txtValue;
  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "";
    if (cols.length > 0) {  
      for (j = 0; j < cols.length; j++) {
        td = tr[i].getElementsByTagName("td")[cols[j]];
        console.log(">>> Cell: ", td);
        if (td) {
          txtValue = td.textContent || td.innerText;
          console.log(`>>> Cell content: ${txtValue} Filter criteria: ${criteria[j]}`);
          if (txtValue.toUpperCase().indexOf(criteria[j].toUpperCase()) === -1) {  
            tr[i].style.display = "none";
          }
        }
      }       
    }
  }
}

// // ====================================
// //  Filter table rows by column values
// // ====================================
// function filterTable(tableId, filterObj) {
//   //
//   // filterObj is an object defined as follows:
//   //  {
//   //    cols : [array of column numbers], 
//   //    criteria : [array of search values for each column]
//   //  }
//   const filterColumns = filterObj.cols;
//   console.log(">>> Filter Columns: ", filterColumns);
//   const filterCriteria = filterObj.criteria;
//   console.log(">>> Filter Criteria: ", filterCriteria);
//   const table = document.getElementById(tableId);
//   var tr = table.getElementsByTagName("tr");
//   var td = [], i, j, txtValue;
//   for (i = 1; i < tr.length; i++) {
//     tr[i].style.display = "";
//     if (filterColumns.length > 0) {  
//       for (j = 0; j < filterColumns.length; j++) {
//         td = tr[i].getElementsByTagName("td")[filterColumns[j]];
//         console.log(">>> Cell: ", td);
//         if (td) {
//           txtValue = td.textContent || td.innerText;
//           console.log(`>>> Cell content: ${txtValue} Filter criteria: ${filterCriteria[j]}`);
//           if (txtValue.toUpperCase().indexOf(filterCriteria[j].toUpperCase()) === -1) {  
//             tr[i].style.display = "none";
//           }
//         }
//       }       
//     }
//   }
// }

// ===============================
//  Utilities - Form Data Extract
// ===============================
//
// -------------------------------------------------------------
//  Return values of specified element type from specified form
// -------------------------------------------------------------
function extractFormData(form, formElement, inputType) {
    console.log("===> Extract Form Data for: ", formElement, inputType);
    var selector = "";
    if (formElement === "input" && inputType !== "") {
      selector = 'input[' + 'type="' + inputType + '"]';
    }
    else if (formElement !== "input" && inputType === undefined) {
      selector = formElement;
    }
    else {
      console.log("===> Selector Error!");
      selector = "";
    }
    var el = form.querySelectorAll(selector);
    var myData = {};
    if (formElement === "input" && inputType === "checkbox") {
      // get checked values
      for (var x = 0; x < el.length; x++) {
        if (el[x].checked) {
          var name = el[x].name;
          var value = el[x].value;
          myData[name] = value;
        }
      }
      return myData;
    }
    else {
      for (var x = 0; x < el.length; x++) {
        var name = el[x].name;
        var value = el[x].value;
        myData[name] = value;
      }
      return myData;
    }
  }
  // ----------------------------------------------------------
  //  Return the values of the checked checkboxes in the group
  // ----------------------------------------------------------
  function getCheckedValues(form, checkboxName) {
    var selector = 'input[' + 'name="' + checkboxName + '"]';
    var el = form.querySelectorAll(selector);
    var checked = {};
    var checkedValues = [];
    for (var x = 0; x < el.length; x++) {
      if (el[x].checked) {
        checkedValues.push(el[x].value);
      }
    }
    if (checkedValues.length !== 0) {
      checked[checkboxName] = checkedValues;
    }
    return checked;
  }
  // ------------------------------------------------
  //  Return the value of the selected radio buttons
  // ------------------------------------------------
  function getRadioCheckedValue(form, radioName) {
    var selector = 'input[' + 'name="' + radioName + '"]';
    var radio = form.querySelectorAll(selector);
    console.log("===> Radio extracted: ", radio);
    var rData = {};
    for (var i = 0; i < radio.length; i++) {
      if(radio[i].checked) {
        var name = radio[i].name;
        var value = radio[i].value;
        rData[name] = value;
        return rData;
      }
    }
    return rData;
  }
  // --------------------------
  //  Reset the specified form
  // --------------------------
  function formReset(form) {
      document.getElementById(form).reset();
  }

// ============================================
//  Utilities - Generic XMLHttpRequest handler
// ============================================

function xhrRequest(method, route, contentType, request, callback) {
    //Validate params - if params not valid end immediately
    if (request == null || route == null || contentType == null) {
      console.log("<<< ERROR - required parameters not provided >>>");
    }
    else if (typeof callback !== "function"){
      console.log("<<< ERROR - the callback is not a function >>>");
    }
    else {
      if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
      }
      else {
        // code for IE6, IE5
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhr.onreadystatechange = function() {
        // Monitor request progress
        console.log("Ready state:", xhr.readyState);
        if (xhr.readyState == 4) {
          // Request complete
          if (xhr.status == 200) {
            // status 200 - success
            var err = false;
            //console.log(">>> Success result: ", xhr);
            callback(err, xhr);
          }
          else {
            // Request failed
            var err = true;
            console.log(`*** XHR request failure ***`);
            console.log(`   >>> status = ${xhr.status}`);
            console.log(`   >>> status msg = ${xhr.statusText}`);
            console.log(`   >>> from = ${xhr.responseURL}`);
            //console.log(">>> Error result: ", xhr);
            callback(err, '');
          }
        }
      }
      //Request transact data from server
      xhr.open(method, route);
      xhr.setRequestHeader("Content-type", contentType);
      xhr.send(request);
    }
  }

// =====================
//  Utilities - General 
// =====================

// ------------
//  Clear form
// ------------
function resetform(form) {
    document.getElementById(form).reset();
  }
  
  // -----------------------
  //  disable & enable form
  // -----------------------
  function formDisable() {
      // Call to disable -> document.getElementById("btnPlaceOrder").disabled = true;
      var limit = document.forms[0].elements.length;
      for (var i=0; i < limit; i++) {
         document.forms[0].elements[i].disabled = true;
      }
  }
  function formEnable() {
      // Call to enable  -> document.getElementById("btnPlaceOrder").disabled = false;
      var limit = document.forms[0].elements.length;
      for (var i=0; i < limit; i++) {
         document.forms[0].elements[i].disabled = false;
      }
  }
  // ---------------------------------
  //  Highlight a row/cell in a table
  // ---------------------------------
  function ChangeColor(tableRow, highLight) {
      if (highLight) {
          // tableRow.style.backgroundColor = '#dcfac9';
          tableRow.style.backgroundColor = '#F7B733';
      }
      else {
          //tableRow.style.backgroundColor = 'rgb(244, 244, 248';
          tableRow.style.backgroundColor = 'transparent';
          // tableRow.style.backgroundColor = 'white';
      }
  }
  // -------------------------------
  //  Test if data item is a string
  // -------------------------------
  function isString(o) {
      return typeof o == "string" || (typeof o == "object" && o.constructor === String);
  }
  // -------------------------------
  //  Test if data item is a string
  // -------------------------------
  function isNumber(o) {
      return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
  }
  
  // // ===========================================
  // //  Functions to add elements and text to DOM
  // // ===========================================
  // /*******************************************************************************************
  //  * By https://www.scribd.com/document/2279811/DOM-Append-Text-and-Elements-With-Javascript *
  //  *******************************************************************************************/
  // // ------------------------------
  // //  add text to existing element
  // // ------------------------------
  // /**************************************************************
  //  * Add test:                                                  *
  //  * node: The element/node that the text is to be appended to. *
  //  * txt: The text to append to the node.                       *
  //  **************************************************************/
  // function appendText(node,txt) {
  //     node.appendChild(document.createTextNode(txt));
  // }
  // // --------------------
  // //  add element to DOM
  // // --------------------
  // /********************************************************
  //  * Add new element:                                     *
  //  *      node = element where to add new element         *
  //  *      tag = the type of element to add                *
  //  *      id = optional id for element                    *
  //  *      htm = optional internal html text for element   *
  //  ********************************************************/
  // function appendElement(node,tag,id,htm) {
  //     var ne = document.createElement(tag);
  //     if(id) ne.id = id;
  //     if(htm) ne.innerHTML = htm;
  //     node.appendChild(ne);
  // }
  // function addElementBefore(node,tag,id,htm) {
  //     var ne = document.createElement(tag);
  //     if(id) ne.id = id;
  //     if(htm) ne.innerHTML = htm;
  //     node.parentNode.insertBefore(ne,node);
  // }
  // function addElementAfter(node,tag,id,htm) {
  //     var ne = document.createElement(tag);
  //     if(id) ne.id = id;
  //     if(htm) ne.innerHTML = htm;
  //     node.parentNode.insertBefore(ne,node.nextSibling);
  // }