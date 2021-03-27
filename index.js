var listAnswer = [];
var listQuestion = [];

const btnCreateAnswer = document.getElementById("createAnswer");
const divAnswer = document.getElementById("duck-ans");
const edtQuestion = document.getElementById("edtQuestion");
const tableQuestion = document.getElementById("table-question");
const rbtSingleChoice = document.getElementById("singleType");

btnCreateAnswer.addEventListener("click", () => {
  if (listAnswer.length < 5) {
    //luu du lieu
    if (listAnswer.length !== 0) {
      listAnswer = getListAnswer();
    }
    listAnswer.push({ content: "", check: false });
    reRender();
  }
});

btnCancel.addEventListener("click", () => {
  //   document.getElementById("duck-ans").style.display = "none";
  listAnswer.length = 0;
  console.log("bam ne");
  //   reRender();
});

function reRender() {
  divAnswer.innerHTML = "";
  listAnswer.forEach(
    (e, i) => (divAnswer.innerHTML += createElementAnswer(e, i))
  );
  divAnswer.innerHTML +=
    listAnswer.length !== 0 ? createButtonSubmitCancel() : "";
  divAnswer.style.display = "block";
}

function getListAnswer() {
  const result = [];
  const contents = [];
  document
    .querySelectorAll("div.form-group.border-bottom.duck-div-ans textarea")
    .forEach((con) => contents.push(con.value));

  const correctAns = [];
  document
    .querySelectorAll("div.form-group.border-bottom.duck-div-ans input")
    .forEach((ch) => correctAns.push(ch.checked));
  contents.forEach((e, i) => {
    result.push({ content: e, check: correctAns[i] });
  });
  return result;
}

function createElementAnswer(element, index) {
  const eAns = `  
    <div class="form-group border-bottom duck-div-ans">
    <div class="d-flex justify-content-between w-100 mb-1">
      <label for="answer" class="font-weight-bold"
        >Answer ${String.fromCharCode(index + 65)}:</label
      >
      <a
        href="#" 
        onclick="event.preventDefault(), removeAnswer(${index})"
        class="border border-dark rounded-circle text-secondary"
        ><i class="fas fa-times p-2"></i
      ></a>
    </div>
    <textarea
      name=""
      rows="3"
      class="form-control" 
    >${element.content}</textarea>
    <div class="form-check mt-2 mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="CorrectAnswer${index}"
        ${element.check ? "checked" : ""}
      />
      <label class="form-check-label" for="CorrectAnswer${index}">
        Is Correct Answer
      </label>
    </div>
    <span class = "d-none text-danger ans" id> Khong duoc bo trong</span>
  </div>`;
  return eAns;
}

function createButtonSubmitCancel() {
  return ` <div class="form-row d-flex flex-row-reverse p-2">
    <button
      type="button"
      class="btn btn-outline-dark ml-2"
      id="btnCancel"
      onclick="btnCancelClick()"
    >
      Cancel
    </button>
    <button type="button" class="btn btn-outline-primary"
    onclick="btnSubmitClick()" >
      Submit
    </button>
  </div>`;
}

function hiddenSpanErrors() {
  document
    .querySelectorAll("span.text-danger")
    .forEach((sp) => sp.classList.add("d-none"));
}

function btnCancelClick() {
  clearContentInQuestion(false);
}

function removeAnswer(index) {
  listAnswer = getListAnswer();
  listAnswer.splice(index, 1);
  reRender();
}

function validData(rowQuestion) {
  hiddenSpanErrors(false);
  let isShowSpanErrors = false;
  let countCorrectAns = 0;
  if (rowQuestion.content.length === 0) {
    document.getElementById("sp-question-errors").classList.remove("d-none");
    isShowSpanErrors = true;
  }

  const spanErrors = document.querySelectorAll("span.text-danger.ans");

  rowQuestion.answers.forEach((ans, index) => {
    console.log("buon vl", ans);
    if (ans.content.length === 0) {
      spanErrors[index].classList.remove("d-none");
      isShowSpanErrors = true;
    }
    countCorrectAns += ans.check ? 1 : 0;
  });

  if (rowQuestion.dtype === 0 ? countCorrectAns === 1 : countCorrectAns > 1) {
    return !isShowSpanErrors;
  } else {
    alert("Vui long chon du so luong dap an cho loai cau hoi");
    return false;
  }
}

function clearContentInQuestion(isClearContent) {
  hiddenSpanErrors();
  if (isClearContent) {
    edtQuestion.value = "";
  }
  listAnswer.length = 0;
  reRender();
}

function btnSubmitClick() {
  console.log("bam submit");
  //valid du lieu

  if (listAnswer.length !== 0) {
    listAnswer = getListAnswer();
  }
  let rowQuestion = {
    content: edtQuestion.value,
    dtype: getTypeOfQuestion(),
    answers: [...listAnswer],
  };

  if (!validData(rowQuestion)) {
    // alert("he he he");
    return;
  }
  listQuestion.push(rowQuestion);
  reRenderQuestion();
  clearContentInQuestion(true);
}

function getTypeOfQuestion() {
  return rbtSingleChoice.checked ? 0 : 1;
}

function reRenderQuestion() {
  tableQuestion.innerHTML = "";
  //ve giao dien
  listQuestion.forEach(
    (ans, index) => (tableQuestion.innerHTML += createRowQuestion(ans, index))
  );
}

function removeQuestion(index) {
  console.log(listQuestion, "bam ne : ", index);
  listQuestion.splice(index, 1);
  console.log(listQuestion, "bam ne : ", index);
  reRenderQuestion();
}

function createAnsForQuestion(ans, index) {
  return `<tr class="${ans.check ? "correct-answer" : ""}">
  <th scope="row"></th>
  <td>${String.fromCharCode(index + 65)}</td>
  <td>${ans.content}</td>
  <td></td>
</tr> `;
}

function createRowQuestion(question, index) {
  let strRow = `<tr class="font-weight-bold">
  <th scope="row">${index + 1}</th>
  <td>${question.dtype == 0 ? "Single Choice" : "Multiple Choices"}</td>
  <td>${question.content}</td>
  <td>
    <a
      href="#"
      onclick="event.preventDefault(), removeQuestion(${index})"
      class="border border-dark rounded-circle text-secondary"
      ><i class="fas fa-times px-2"></i
    ></a>
  </td>
</tr>`;
  question.answers.forEach(
    (ans, index) => (strRow += createAnsForQuestion(ans, index))
  );
  return strRow;
}
