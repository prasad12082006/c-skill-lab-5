let students = JSON.parse(localStorage.getItem("students")) || [];

// Add a student
function addStudent() {
  const nameInput = document.getElementById("studentName");
  const rollInput = document.getElementById("rollNo");

  const name = nameInput.value.trim();
  const rollNo = rollInput.value.trim();

  if (name === "" || rollNo === "") {
    alert("Please enter student name and roll number.");
    return;
  }

  if (students.some(student => student.rollNo === rollNo)) {
    alert("This roll number already exists.");
    return;
  }

  students.push({
    name: name,
    rollNo: rollNo,
    present: 0,
    absent: 0,
    today: "Not Marked"
  });

  saveData();
  nameInput.value = "";
  rollInput.value = "";
  renderStudents();
}

// Mark attendance
function markAttendance(index, status) {
  const student = students[index];

  // Prevent counting the same day's attendance twice
  if (student.today === "Present" || student.today === "Absent") {
    alert("Today's attendance is already marked for this student.");
    return;
  }

  if (status === "Present") {
    student.present++;
    student.today = "Present";
  } else {
    student.absent++;
    student.today = "Absent";
  }

  saveData();
  renderStudents();
}

// Delete student
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveData();
    renderStudents();
  }
}

// Calculate attendance percentage
function getPercentage(student) {
  const total = student.present + student.absent;

  if (total === 0) {
    return 0;
  }

  return ((student.present / total) * 100).toFixed(2);
}

// Display students
function renderStudents() {
  const table = document.getElementById("studentTable");
  const search = document.getElementById("searchBox").value.toLowerCase();

  table.innerHTML = "";

  students.forEach((student, index) => {
    if (
      !student.name.toLowerCase().includes(search) &&
      !student.rollNo.toLowerCase().includes(search)
    ) {
      return;
    }

    let statusClass = "status-not-marked";

    if (student.today === "Present") {
      statusClass = "status-present";
    } else if (student.today === "Absent") {
      statusClass = "status-absent";
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.rollNo}</td>
      <td>${student.name}</td>
      <td>${student.present}</td>
      <td>${student.absent}</td>
      <td>${getPercentage(student)}%</td>
      <td class="${statusClass}">${student.today}</td>
      <td>
        <button class="present-btn" onclick="markAttendance(${index}, 'Present')">
          Present
        </button>
        <button class="absent-btn" onclick="markAttendance(${index}, 'Absent')">
          Absent
        </button>
        <button class="delete-btn" onclick="deleteStudent(${index})">
          Delete
        </button>
      </td>
    `;

    table.appendChild(row);
  });

  updateStats();
}

// Update dashboard statistics
function updateStats() {
  document.getElementById("totalStudents").textContent = students.length;

  const present = students.filter(student => student.today === "Present").length;
  const absent = students.filter(student => student.today === "Absent").length;

  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
}

// Save data in browser
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Reset today's status when a new calendar day starts
function resetForNewDay() {
  const savedDate = localStorage.getItem("attendanceDate");
  const today = new Date().toISOString().split("T")[0];

  if (savedDate !== today) {
    students.forEach(student => {
      student.today = "Not Marked";
    });

    localStorage.setItem("attendanceDate", today);
    saveData();
  }
}

resetForNewDay();
renderStudents();
