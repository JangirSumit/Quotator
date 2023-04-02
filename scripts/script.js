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

function renderCompanyList() {
  let companies = localStorage.getItem("company-names");

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
  let companies = localStorage.getItem("company-names");
  if (companies) {
    companies = JSON.parse(companies).filter((c) => c.id !== companyId);
  }
  localStorage.setItem("company-names", JSON.stringify(companies));
}

function addCompanyNameInTheDb(company) {
  let companies = localStorage.getItem("company-names");
  if (companies) {
    companies = JSON.parse(companies);
    companies = [...companies, { name: company, id: getGUID() }];
  } else {
    companies = [{ name: company, id: getGUID() }];
  }

  localStorage.setItem("company-names", JSON.stringify(companies));
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
