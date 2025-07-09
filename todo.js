
    const input = document.getElementById("todoInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const todoList = document.getElementById("todoList");
    const addBtn = document.getElementById("addBtn");

    addBtn.addEventListener("click", () => {
      const taskText = input.value.trim();         //trim():remove leading spaces
      if (taskText === "") {
        alert("Task is empty");
        return;
      }
      const priority = prioritySelect.value;

      if (document.querySelector(".empty-state")) {
        document.querySelector(".empty-state").remove();
      }

      const todoHTML = `
        <div class="todo-item">
          <input type="checkbox" class="todo-checkbox" />
          <div class="todo-text">${taskText}</div>
          <div class="priority-${priority}">${priority}</div>
          <button class="action-btn">Edit</button>
          <button class="action-btn">Delete</button>
        </div>
      `;
      todoList.insertAdjacentHTML("beforeend", todoHTML);//This line inserts HTML content (todoHTML) into the todoList element at the end of 
      // its current content.
      input.value = "";
      updateStats();
    });

    todoList.addEventListener("click", function(event) {
      const target = event.target;  // event.target:where event as occur 

      // Toggle completion
  /*<div class="todo-item">   <!-- closest() will return this
      <input type="checkbox" class="todo-checkbox" />  <!-- event.target
     </div> */
      if (target.classList.contains("todo-checkbox")) {
        target.closest(".todo-item").classList.toggle("task-done");
        updateStats();
        applyCurrentFilters();  //This function name suggests it re-applies the current active filters to the to-do list
        //So, after toggling the task (done/not done), the UI needs to refresh the list based on the current filter.
      }

      // Delete task
      if (target.innerText === "Delete") {
        const todoItem = target.closest(".todo-item");
        todoItem.remove();
        if (todoList.children.length === 0) {
          todoList.innerHTML = `<div class="empty-state">No tasks yet</div>`;
        }
        updateStats();
        applyCurrentFilters();
      }

      // Edit task
      if (target.innerText === "Edit") {
        const todoItem = target.closest(".todo-item");
        const textDiv = todoItem.querySelector(".todo-text");
        const currentText = textDiv.innerText;
        textDiv.innerHTML = `<input type="text" class="edit-input" value="${currentText}" />`;
        target.innerText = "Save";
      }

//how  task edit work,fistt buy milk is written as innerHTML when we click edit it convert into textField     
// <div class="todo-text">Buy milk</div> chnages to <div class="todo-text">
                                                    // <input type="text" class="edit-input" value="Buy milk" />
                                                     //</div>

      // Save edited task
      else if (target.innerText === "Save") {
        const todoItem = target.closest(".todo-item");
        const inputField = todoItem.querySelector(".edit-input");
        const newText = inputField.value.trim();
        if (newText === "") {
          alert("Task cannot be empty");
          return;
        }
        const textDiv = todoItem.querySelector(".todo-text");
        textDiv.innerText = newText;
        target.innerText = "Edit";
      }
    });

    function updateStats() {
      const all = document.querySelectorAll(".todo-item");
      const completed = document.querySelectorAll(".task-done");
      const total = all.length;
      const done = completed.length;
      const pending = total - done;
      const rate = total === 0 ? 0 : Math.round((done / total) * 100);   //Math.round-JS function:It rounds a number to the nearest integer.

      document.getElementById("totalTasks").innerText = total; //Here you're assigning a value directly.
//innerText will convert the number 10 into the string "10" automatically.


      document.getElementById("pendingTasks").innerText = pending;
      document.getElementById("completedTasks").innerText = done;
      document.getElementById("completionRate").innerText = `${rate}%`;//Here you're mixing text and a variable, so you use template literals 
      // (backticks: `).     //${rate} injects the value into the string.
    }

    // Filters
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const statusFilter = this.dataset.filter;
        const priorityFilter = document.getElementById("priorityFilter").value;
        applyFilters(statusFilter, priorityFilter);
      });
    });

    document.getElementById("priorityFilter").addEventListener("change", function () {
      const priorityFilter = this.value;
      const activeBtn = document.querySelector(".filter-btn.active");
      const statusFilter = activeBtn ? activeBtn.dataset.filter : "all";   
      applyFilters(statusFilter, priorityFilter);
    });

    function applyCurrentFilters() {
      const activeBtn = document.querySelector(".filter-btn.active");
      const status = activeBtn ? activeBtn.dataset.filter : "all";
      const priority = document.getElementById("priorityFilter").value;
      applyFilters(status, priority);
    }

    function applyFilters(statusFilter, priorityFilter) {
      document.querySelectorAll(".todo-item").forEach(item => {
        let visible = true;

        const isDone = item.classList.contains("task-done");
        const priorityClass = item.querySelector("div[class^='priority-']").classList; //Selects any <div> whose class starts with "priority-" 
    //^= 	Means "starts with" in CSS attribute selector     //.classlist to know exactly which class

//If the user selects "completed" but this item is not done → hide it.
//If user selects "pending" but this item is already done → hide it.
        if (statusFilter === "completed" && !isDone) visible = false;
        if (statusFilter === "pending" && isDone) visible = false;

        if (priorityFilter !== "all" && !priorityClass.contains(`priority-${priorityFilter}`)) {
          visible = false;
        }

        item.style.display = visible ? "flex" : "none";
      });
    }
