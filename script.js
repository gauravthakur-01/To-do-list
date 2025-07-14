let allColors = document.querySelectorAll(".filter div, .action-button div");
let lowerBody = document.querySelector(".lower-body");
// let actionSub = document.querySelector(".sub")
let addBtn = document.querySelector(".addbtn")
let deleteBtn = document.querySelector(".deletebtn")
let modalVisible = false;
let uid = new ShortUniqueId();
let uniqueId = uid.rnd();
// let activeState = false;
let activeState = false;

let color = {
    bisque: "#ffe4c4",
    pink: "#ffc0cb",
    orange: "#ffa500",
    aqua: "#3ff1e7",
    blue: "#d2b48c",
    red: "#ffd700"
};

if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]))
};

let colorArray = ["bisque", "orange", "pink", "aqua",];

for (let i = 0; i < allColors.length; i++) {
    allColors[i].addEventListener('click', (e) => {
        let colorNames = e.currentTarget.classList[0].split("-")[0];
        lowerBody.style.backgroundColor = color[colorNames];
    });

};

deleteBtn.addEventListener("click", function (e) {
    if (addBtn.classList.contains("active-state")) {
        addBtn.classList.remove("active-state");

    }
    deleteBtn.classList.add("active-state");
});


addBtn.addEventListener("click", function (e) {
    if (deleteBtn.classList.contains("active-state")) {
        deleteBtn.classList.remove("active-state")
    }
    addBtn.classList.add("active-state");
    if (modalVisible == true) return;

    let modalContainer = document.createElement("div");
    modalContainer.setAttribute("click-first", true);
    modalContainer.classList.add("modal-container");
    modalContainer.innerHTML = `<div class="modal-screen" contenteditable>ENTER YOUR TEXT </div>
                <div class="modal-filters-container">
                    <div class="bisque modal-filter" style="background-color: bisque;"></div>
                    <div class="orange modal-filter" style="background-color: orange;"></div>
                    <div class="pink modal-filter" style="background-color: pink;"></div>
                    <div class="aqua modal-filter active-modal-filter" style="background-color: aqua;"></div>
                </div>`;

    deleteBtn.addEventListener("click", function (e) {
        if (deleteBtn.classList.contains("active-state")) {
            modalContainer.remove();
            modalVisible = false;
        }
    })

    let allmodalContainer = modalContainer.querySelectorAll(".modal-filter")
    for (let i = 0; i < allmodalContainer.length; i++) {
        allmodalContainer[i].addEventListener("click", function (e) {
            for (let j = 0; j < allmodalContainer.length; j++) {
                allmodalContainer[j].classList.remove("active-modal-filter");
            };
            e.currentTarget.classList.add("active-modal-filter");
        });
    }


    let textArea = modalContainer.querySelector(".modal-screen")
    textArea.addEventListener("click", function (e) {
        if (modalContainer.getAttribute("click-first") == "true") {
            textArea.innerText = "";
            modalContainer.setAttribute("click-first", false);
        };

    });

    textArea.addEventListener("keypress", function (e) {

        if (e.key == "Enter") {
            console.log(e.currentTarget.innertext);
            if (e.currentTarget.innerText == "" || e.currentTarget.innerText == " ") {
                alert("Enter valid input");
                return;
            }

            let task = textArea.innerText;
            let activeModalFilter = document.querySelector(".active-modal-filter");
            let activeColor = activeModalFilter.classList[0];
            let selectedTicketColor = color[activeColor];
            console.log(selectedTicketColor);

            let ticketContainer = document.createElement("div");
            ticketContainer.classList.add("ticket-container")
            ticketContainer.innerHTML =
                `<div class="close-btn">
                <i class="ri-close-fill"></i>
                </div>
                <div class="ticket-info">
                <div class="ticket-id">#${uniqueId}</div>
                <div class="ticket-color" style="background-color: ${selectedTicketColor}"></div>
                </div>
                <div class="ticket-content" >
                //    ${task}  nostrum, eveniet dolorum possimus sit explicabo, modi voluptatum libero ex ipsa aliquam at necessitatibus dicta veniam?
                Architecto qui vero aut ut voluptates rerum eligendi labore quis delectus corrupti autem fugiat, repudiandae hic,
                </div>
                <div class="pencil">
                  <i class="ri-pencil-fill"></i>
                </div>`


            saveLocalStorage(uniqueId, selectedTicketColor, task);

            let ticketContent = ticketContainer.querySelector(".ticket-content");
            ticketContent.addEventListener("input", (e) => {
                // console.log(let taskArr = e.currentTarget.JSON.parse(localStorage.getItem("tasks")).split("#"));
                let ticketFetchId = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let taskArr = JSON.parse(localStorage.getItem("tasks"));
                let requiredIdx = -1;
                for (let i = 0; i < taskArr.length; i++) {
                    if (taskArr[i].uniqueId == ticketFetchId) {
                        requiredIdx = i;
                        break;
                    }
                }
                console.log(taskArr[requiredIdx])

                taskArr[requiredIdx].task = e.currentTarget.innerText;
                localStorage.setItem("tasks", JSON.stringify(taskArr));
            });

            let closed = ticketContainer.querySelector(".close-btn");
            deleteBtn.addEventListener("click", function (e) {
                closed.classList.add("opacity");
            });

            addBtn.addEventListener("click", function (e) {
                closed.classList.remove("opacity");
            });

            let ticketDelete = ticketContainer.querySelectorAll(".close-btn")
            deleteBtn.addEventListener("click", function (e) {
                for (let i = 0; i < ticketDelete.length; i++) {
                    ticketDelete[i].addEventListener("click", function (e) {

                        let ticketFetchId = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];

                        let taskArr = JSON.parse(localStorage.getItem("tasks"));
                        taskArr = taskArr.filter(function (elem) {
                            return elem.uniqueId != ticketFetchId;
                        });
                        ticketContainer.remove()

                        localStorage.setItem("tasks", JSON.stringify(taskArr));
                    });

                    closed.addEventListener("click", function (e) {
                        if (deleteBtn.classList.contains("active-state")) {
                            ticketContainer.remove();
                        }
                    });
                }
            });


            let pencil = ticketContainer.querySelector(".pencil i");
            let enableTicketContent = ticketContainer.querySelector(".ticket-content")

            pencil.addEventListener("click", function (e) {
                if (pencil.classList[0].match("pencil") && (enableTicketContent.getAttribute("contenteditable") == "false")) {
                    pencil.classList.remove("ri-pencil-fill");
                    pencil.classList.add("ri-check-fill");
                    enableTicketContent.setAttribute("contenteditable", true);
                }

                else {
                    pencil.classList.add("ri-pencil-fill");
                    pencil.classList.remove("ri-check-fill");
                    enableTicketContent.setAttribute("contenteditable", false);

                }
            });


            let ticketColor = ticketContainer.querySelector(".ticket-color");
            ticketColor.style.backgroundColor = selectedTicketColor;

            let ticketBGColor = ticketContainer.querySelector(".ticket-color")
            ticketBGColor.addEventListener("click", function (e) {

                let ticketFetchId = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let taskArr = JSON.parse(localStorage.getItem("tasks"));
                let requiredIdx = -1;
                for (let i = 0; i < taskArr.length; i++) {
                    if (taskArr[i].uniqueId == ticketFetchId) {
                        requiredIdx = i;
                        break;
                    }
                }
                console.log(taskArr[requiredIdx])

                console.log(e.currentTarget.classList[0]);
                let currentColor = e.currentTarget.classList[1];
                let index = colorArray.indexOf(currentColor);
                index++;
                index = index % 4;
                console.log(index)
                e.currentTarget.classList.remove(currentColor);
                e.currentTarget.classList.add(colorArray[index]);
                ticketColor.style.backgroundColor = colorArray[index];

                taskArr[requiredIdx].selectedTicketColor = colorArray[index];
                localStorage.setItem("tasks", JSON.stringify(taskArr));

            });
            lowerBody.appendChild(ticketContainer);
            modalContainer.remove();
            modalVisible = false;
        };

    });
    lowerBody.appendChild(modalContainer);
    modalVisible = true;

})

function saveLocalStorage(uniqueId, selectedTicketColor, task,) {
    let requiredObject = { uniqueId, selectedTicketColor, task };
    let taskArr = JSON.parse(localStorage.getItem("tasks"));
    taskArr.push(requiredObject);
    localStorage.setItem("tasks", JSON.stringify(taskArr));
}

let red = document.createElement("div")
red.addEventListener("click", function (e) {
    lowerBody.style.backgroundColor = "red";
}
);


function createn() {

    let taskArr = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < taskArr.length; i++) {
        let ticketIdLs = taskArr[i].uniqueId;
        let ticketTaskLs = taskArr[i].task;
        let ticketColorLs = taskArr[i].selectedTicketColor;


        let ticketContainer = document.createElement("div");
        ticketContainer.classList.add("ticket-container")
        ticketContainer.innerHTML =
            `<div class="close-btn">
                <i class="ri-close-fill"></i>
                </div>
                <div class="ticket-info">
                <div class="ticket-id">#${ticketIdLs}</div>
                <div class="ticket-color" style="background-color: ${ticketColorLs}"></div>
                </div>
                <div class="ticket-content" >
                  ${ticketTaskLs}
                </div>
                <div class="pencil">
                  <i class="ri-pencil-fill"></i>
                </div>`

                let closed = ticketContainer.querySelector(".close-btn");
            deleteBtn.addEventListener("click", function (e) {
                closed.classList.add("opacity");
            });

            addBtn.addEventListener("click", function (e) {
                closed.classList.remove("opacity");
            });

            let ticketDelete = ticketContainer.querySelectorAll(".close-btn")
            deleteBtn.addEventListener("click", function (e) {
                for (let i = 0; i < ticketDelete.length; i++) {
                    ticketDelete[i].addEventListener("click", function (e) {

                        let ticketFetchId = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];

                        let taskArr = JSON.parse(localStorage.getItem("tasks"));
                        taskArr = taskArr.filter(function (elem) {
                            return elem.uniqueId != ticketFetchId;
                        });
                        ticketContainer.remove()

                        localStorage.setItem("tasks", JSON.stringify(taskArr));
                    });

                    closed.addEventListener("click", function (e) {
                        if (deleteBtn.classList.contains("active-state")) {
                            ticketContainer.remove();
                        }
                    });
                }
            });


            let pencil = ticketContainer.querySelector(".pencil i");
            let enableTicketContent = ticketContainer.querySelector(".ticket-content")

            pencil.addEventListener("click", function (e) {
                if (pencil.classList[0].match("pencil") && (enableTicketContent.getAttribute("contenteditable") == "false")) {
                    pencil.classList.remove("ri-pencil-fill");
                    pencil.classList.add("ri-check-fill");
                    enableTicketContent.setAttribute("contenteditable", true);
                }

                else {
                    pencil.classList.add("ri-pencil-fill");
                    pencil.classList.remove("ri-check-fill");
                    enableTicketContent.setAttribute("contenteditable", false);

                }
            });

        let ticketBGColor = ticketContainer.querySelector(".ticket-color")
        ticketBGColor.addEventListener("click", function (e) {

            let ticketFetchId = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
            let taskArr = JSON.parse(localStorage.getItem("tasks"));
            let requiredIdx = -1;
            for (let i = 0; i < taskArr.length; i++) {
                if (taskArr[i].uniqueId == ticketFetchId) {
                    requiredIdx = i;
                    break;
                }
            }
            console.log(taskArr[requiredIdx])

            console.log(e.currentTarget.classList[0]);
            let currentColor = e.currentTarget.classList[1];
            let index = colorArray.indexOf(currentColor);
            index++;
            index = index % 4;
            console.log(index)
            e.currentTarget.classList.remove(currentColor);
            e.currentTarget.classList.add(colorArray[index]);
            ticketColor.style.backgroundColor = colorArray[index];

            taskArr[requiredIdx].selectedTicketColor = colorArray[index];
            localStorage.setItem("tasks", JSON.stringify(taskArr));


        });
        lowerBody.appendChild(ticketContainer);
        modalVisible = false;
    }
}


createn();

