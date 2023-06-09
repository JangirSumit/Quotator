const COMPANY_DETAILS_KEY = "company-details";
const ITEM_DETAILS_KEY = "item-details";

renderCompanyList();
renderItemList();

function getGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

document.getElementById("add-company").addEventListener("click", function (e) {
  const name = document.getElementById("company-name").value;
  const gstNumber = document.getElementById("gst-number").value;
  const adderss = document.getElementById("company-address").value;

  const isValid = name && gstNumber && adderss;

  if (isValid) {
    addCompanyDetailsInTheDb(name, gstNumber, adderss);
    renderCompanyList();
    document.getElementById("company-name").value = "";
  }
});

document
  .getElementById("companies-list")
  .addEventListener("click", function (e) {
    const companyID = e.target.dataset.companyid;
    if (companyID) {
      removenameFromDb(companyID);
      renderCompanyList();
    }
  });

document.getElementById("items-list").addEventListener("click", function (e) {
  const itemId = e.target.dataset.itemid;
  if (itemId) {
    removeItemFromDb(itemId);
    renderItemList();
  }
});

document.getElementById("add-item").addEventListener("click", function (e) {
  const name = document.getElementById("item-name").value;
  const description = document.getElementById("item-description").value;
  const quantity = document.getElementById("item-quantity").value;
  const unit = document.getElementById("item-unit").value;
  const rateRange1 = document.getElementById("item-rate-range-1").value;
  const rateRange2 = document.getElementById("item-rate-range-2").value;

  const isValid = name && description && quantity && unit && rateRange1;

  if (isValid) {
    addItemInTheDb(name, description, quantity, unit, rateRange1, rateRange2);
    renderItemList();
  }
});

function renderCompanyList() {
  let companies = localStorage.getItem(COMPANY_DETAILS_KEY);
  const d = JSON.parse(companies);
  let body = "";

  if (d && d.length) {
    const companyListHeader = getCompanyListHeader(d[0])

    body = companyListHeader + "<tbody>";

    d.forEach((element, index) => {
      body += getCompanyDetailsListItem(element, index);
    });

    body += "</tbody>";
  }

  document.getElementById("companies-list").innerHTML = body;
}

function renderItemList() {
  let items = localStorage.getItem(ITEM_DETAILS_KEY);
  const d = JSON.parse(items);
  let body = "";

  if (d && d.length) {
       const itemListHeader = getItemListHeader(d[0]);

    body = itemListHeader + "<tbody>";

    d.forEach((element, index) => {
      body += getItemListItem(element, index);
    });

    body += "</tbody>";
  }

  document.getElementById("items-list").innerHTML = body;
}

function removenameFromDb(companyId) {
  let companies = localStorage.getItem(COMPANY_DETAILS_KEY);
  if (companies) {
    companies = JSON.parse(companies).filter((c) => c.id !== companyId);
  }
  localStorage.setItem(COMPANY_DETAILS_KEY, JSON.stringify(companies));
}

function removeItemFromDb(itemId) {
  let items = localStorage.getItem(ITEM_DETAILS_KEY);
  if (items) {
    items = JSON.parse(items).filter((c) => c.id !== itemId);
  }
  localStorage.setItem(ITEM_DETAILS_KEY, JSON.stringify(items));
}

function addCompanyDetailsInTheDb(
  name, 
  gstNumber,
  adderss
  ) {
  const newRecord = {
    id: getGUID(),
    name,
    gstNumber,
    adderss
   };

  let companies = localStorage.getItem(COMPANY_DETAILS_KEY);
  if (companies) {
    companies = JSON.parse(companies);
    companies = [...companies, newRecord];
  } else {
    companies = [newRecord];
  }

  localStorage.setItem(COMPANY_DETAILS_KEY, JSON.stringify(companies));
}

function addItemInTheDb(
  name,
  description,
  quantity,
  unit,
  rateRange1,
  rateRange2
) {
  const newRecord = {
    id: getGUID(),
    name,
    description,
    quantity,
    unit,
    rateRange1,
    rateRange2,
    newRate: getRandomRate(rateRange1, rateRange2)
  };

  let items = localStorage.getItem(ITEM_DETAILS_KEY);
  if (items) {
    items = JSON.parse(items);
    items = [...items, newRecord];
  } else {
    items = [newRecord];
  }

  localStorage.setItem(ITEM_DETAILS_KEY, JSON.stringify(items));
}

function getCompanyDetailsListItem(data, index) {
  return `
                <tr>
                <td scope="row">${index + 1}</td>
                <td>${data.name}</td>
                <td>${data.gstNumber}</td>
                <td>${data.adderss}</td>
                <td data-companyId="${
                  data.id
                }"><span class="badge bg-primary cursor-pointer" id="delete-company" data-companyId="${data.id}">X</span></td>
                </tr>
    `;
}

function getItemListItem(data, index) {
  return `
      <tr>
      <td scope="row">${index + 1}</td>
      <td>${data.name}</td>
      <td style="max-width: 400px;">${data.description}</td>
      <td>${data.quantity}</td>
      <td>${data.unit}</td>
      <td>${data.newRate}</td>
      <td>${data.newRate * data.quantity}</td>
      <td data-item-id="${
        data.id
      }"><span class="badge bg-primary cursor-pointer" id="delete-item" data-itemId="${
    data.id
  }">X</span></td>
    </tr>
    `;
}

function getRandomRate(rateRange1, rateRange2) {
  if (!rateRange2) {
    return rateRange1;
  }

  const newRate = Math.ceil(
    Math.random() * (parseFloat(rateRange2) - parseFloat(rateRange1)) +
      parseFloat(rateRange1)
  );

  return Math.ceil(newRate / 100) * 100;
}

function getCompanyListHeader(data) {
  let ths = `<th scope="col">#</th>`

  Object.keys(data).forEach((d) => {
    if(d!= "id"){
    ths += `<th scope="col">${capitalizeString(d)}</th>`;
    }
  });
  ths +=`
          <th scope="col"></th>`;
  return`
  <thead>
            <tr>
            ${ths}
            </tr>
  </thead>`;
}

function getItemListHeader(data) {
  let ths = `<th scope="col">#</th>`;

  Object.keys(data).forEach((d) => {
    if (d != "id" && d != "rateRange1" && d != "rateRange2") {
      if (d == "newRate") {
        d = "Unit Price"
      }
      ths += `<th scope="col">${capitalizeString(d)}</th>`;
    }
  });
  ths += `
          <th scope="col">Total</th>
          <th scope="col"></th>`;

  return `
  <thead>
                <tr>
                  ${ths}
                </tr>
              </thead>
  `;
}

function capitalizeString(str) {
  return str[0].toUpperCase() + str.substring(1);
}

