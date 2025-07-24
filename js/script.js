// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    displayCourseList();

    const form = document.getElementById("new-course-form");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
 
      const name = document.getElementById("course-name").value.trim();
      const credits = parseInt(document.getElementById("credits").value);
      const instructor = document.getElementById("instructor").value.trim();
  
      if (name && credits && instructor) {
        addCourse(name, credits, instructor);
        saveData();
        displayCourseList();
        form.reset(); 
      }
    });
  });
  
  function addCourse(name, credits, instructor) {
    const newCourse = {
      id: Date.now(),
      name,
      credits,
      instructor,
      grades: []
    };
    courses.push(newCourse);
  }
  
  function displayCourseList() {
    const ul = document.querySelector(".course-list");
    ul.innerHTML = "";
  
    courses.forEach(course => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="course-name">${course.name}</span>
        <span class="course-credits">(${course.credits} credits)</span>
      `;
      ul.appendChild(li);
    });
  }

  function populateCourseOptions() {
    const select = document.getElementById("courseSelect");
    select.innerHTML = '<option value="">--Select a course--</option>'; // Initialize
  
    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name;
      select.appendChild(option);
    });
  }

  function addGrade(courseId, assignment, score, maxScore, date) {
    const course = courses.find(c => c.id == courseId);
    if (course) {
      course.grades.push({ assignment, score, maxScore, date });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    populateCourseOptions();
  
    document.getElementById("gradeForm").addEventListener("submit", function(e) {
      e.preventDefault();
  
      const courseId = document.getElementById("courseSelect").value;
      const assignment = document.getElementById("assignment").value.trim();
      const score = parseFloat(document.getElementById("score").value);
      const maxScore = parseFloat(document.getElementById("maxScore").value);
      const date = document.getElementById("date").value;
  
      if (courseId && assignment && !isNaN(score) && !isNaN(maxScore) && date) {
        addGrade(courseId, assignment, score, maxScore, date);
        saveData();
        showRecentGrades(courseId);
        this.reset();
      }
    });
  });

  function showRecentGrades(courseId) {
    const course = courses.find(c => c.id == courseId);
    const container = document.getElementById("gradeList");
  
    if (!course) return;
  
    let html = `<h3>${course.name}:</h3><ul>`;
    course.grades.forEach(g => {
      html += `<li>• ${g.assignment}: ${g.score}/${g.maxScore} (${formatDate(g.date)})</li>`;
    });
    html += '</ul>';
  
    const avg = calculateCourseAverage(courseId);
    html += `<p><strong>Course Average: ${avg.toFixed(1)}% (${convertToLetterGrade(avg)})</strong></p>`;
  
    container.innerHTML = html;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  }

  function calculateCourseAverage(courseId) {
    const course = courses.find(c => c.id == courseId);
    if (!course || course.grades.length === 0) return 0;
  
    const totalScore = course.grades.reduce((sum, g) => sum + g.score, 0);
    const totalMax = course.grades.reduce((sum, g) => sum + g.maxScore, 0);
  
    return (totalScore / totalMax) * 100;
  }
  
  function convertToLetterGrade(avg) {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B";
    if (avg >= 70) return "C";
    if (avg >= 60) return "D";
    return "F";
  }

  function convertToGPA(avg) {
    if (avg >= 90) return 4;
    if (avg >= 80) return 3;
    if (avg >= 70) return 2;
    if (avg >= 60) return 1;
    return 0;
  }
  
  function calculateGPA() {
    if (courses.length === 0) return 0;
  
    let totalPoints = 0;
    let totalCredits = 0;
  
    courses.forEach(course => {
      if (course.grades.length > 0) {
        const avg = calculateCourseAverage(course.id);
        const gradePoint = convertToGPA(avg);
        totalPoints += gradePoint * course.credits;
        totalCredits += course.credits;
      }
    });
  
    if (totalCredits === 0) return 0;
  
    return totalPoints / totalCredits;
  }

  function displayGPAandCourses() {
    const gpa = calculateGPA();
    const total = courses.length;
  
    const gpaElement = document.querySelector(".gpa-summary p:nth-child(1) .highlight");
    const totalElement = document.querySelector(".gpa-summary p:nth-child(2) .highlight");
  
    gpaElement.textContent = `${gpa.toFixed(2)}/4.0`;
    totalElement.textContent = total;
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    displayGPAandCourses();
  });