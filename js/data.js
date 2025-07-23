let courses = [];

function saveData() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

function loadData() {
  const saved = localStorage.getItem("courses");
  if (saved) {
    courses = JSON.parse(saved);
  }
}