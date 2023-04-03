const COMPANY_NAMES_KEY = COMPANY_NAMES_KEY;
const ITEM_DETAILS_KEY = "item-details";

function getGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

document.getElementById("add-company").addEventListener("click", function (e) {
  const companyName = document.getElementById("company-name").value;

  if (companyName) {
    addCompanyNameInTheDb(companyName);
    renderCompanyList();
    document.getElementById("company-name").value = "";
  }
});

document
  .getElementById("companies-list")
  .addEventListener("click", function (e) {
    const companyID = e.target.dataset.companyid;
    if (companyID) {
      removeCompanyNameFromDb(companyID);
      renderCompanyList();
    }
  });

document.getElementById("add-company").addEventListener("click", function (e) {
  const name = document.getElementById("item-name").value;
  const description = document.getElementById("item-description").value;
  const quantity = document.getElementById("item-quantity").value;
  const unit = document.getElementById("item-unit").value;
  const rateRange1 = document.getElementById("item-rate-range-1").value;
  const rateRange2 = document.getElementById("item-rate-range-2").value;

  const isValid = name && description && quantity && unit && rateRange1;

  if (isValid) {
    addItemInTheDb(name, description, quantity, unit, rateRange1, rateRange2);
  }
});

function renderCompanyList() {
  let companies = localStorage.getItem(COMPANY_NAMES_KEY);

  if (companies) {
    const d = JSON.parse(companies);
    let html = "";

    d.forEach((element) => {
      html += getCompanyNameListItem(element);
    });

    document.getElementById("companies-list").innerHTML = html;
  }
}

function removeCompanyNameFromDb(companyId) {
  let companies = localStorage.getItem(COMPANY_NAMES_KEY);
  if (companies) {
    companies = JSON.parse(companies).filter((c) => c.id !== companyId);
  }
  localStorage.setItem(COMPANY_NAMES_KEY, JSON.stringify(companies));
}

function addCompanyNameInTheDb(company) {
  const newRecord = { id: getGUID(), name: company };

  let companies = localStorage.getItem(COMPANY_NAMES_KEY);
  if (companies) {
    companies = JSON.parse(companies);
    companies = [...companies, newRecord];
  } else {
    companies = [newRecord];
  }

  localStorage.setItem(COMPANY_NAMES_KEY, JSON.stringify(companies));
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
  };

  let items = localStorage.getItem(ITEM_DETAILS_KEY);
  if (items) {
    items = JSON.parse(items);
    items = [
      ...items,
      newRecord,
    ];
  } else {
    companies = [
      newRecord,
    ];
  }

  localStorage.setItem(ITEM_DETAILS_KEY, JSON.stringify(companies));
}

function getCompanyNameListItem(data) {
  return `
                <li data-companyId="${data.id}"
                  class="list-group-item d-flex justify-content-between align-items-center">
                 ${data.name}
                  <span class="badge bg-primary" id="delete-company" data-companyId="${data.id}">X</span>
                </li>
    `;
}
