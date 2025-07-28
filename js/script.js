// Simple script.js - keeping it basic and functional

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  
  // Initialize based on current page
  if (window.location.pathname.includes('add-course.html')) {
      initAddCoursePage();
  } else if (window.location.pathname.includes('grades.html')) {
      initGradesPage();
  } else if (window.location.pathname.includes('course-details.html')) {
      // Course details functionality is handled by course-details.js
      return;
  } else {
      initDashboard();
  }
});

// Add Course Page
function initAddCoursePage() {
  displayCourseList();
  updateCourseCount();
  
  const form = document.getElementById("new-course-form");
  if (form) {
      form.addEventListener("submit", function (e) {
          e.preventDefault();
          
          const name = document.getElementById("course-name").value.trim();
          const credits = parseInt(document.getElementById("credits").value);
          const instructor = document.getElementById("instructor").value.trim();
          
          if (name && credits && instructor) {
              if (addCourse(name, credits, instructor)) {
                  displayCourseList();
                  updateCourseCount();
                  form.reset();
                  // Focus back to course name for quick entry
                  document.getElementById("course-name").focus();
              }
          }
      });
  }
}

// Grades Page
function initGradesPage() {
  populateCourseOptions();
  
  const form = document.getElementById("gradeForm");
  if (form) {
      form.addEventListener("submit", function(e) {
          e.preventDefault();
          
          const courseId = document.getElementById("courseSelect").value;
          const assignment = document.getElementById("assignment").value.trim();
          const score = parseFloat(document.getElementById("score").value);
          const maxScore = parseFloat(document.getElementById("maxScore").value);
          const date = document.getElementById("date").value;
          
          if (courseId && assignment && !isNaN(score) && !isNaN(maxScore) && date) {
              addGrade(courseId, assignment, score, maxScore, date);
              showRecentGrades(courseId);
              // Reset form but keep course selected
              const selectedCourse = courseId;
              form.reset();
              document.getElementById("courseSelect").value = selectedCourse;
              document.getElementById("date").value = new Date().toISOString().split('T')[0];
              document.getElementById("assignment").focus();
          }
      });
  }
  
  const courseSelect = document.getElementById("courseSelect");
  if (courseSelect) {
      courseSelect.addEventListener("change", function() {
          if (this.value) {
              showRecentGrades(this.value);
          } else {
              document.getElementById("gradeList").innerHTML = `
                  <div class="empty-state">
                      <i class="fas fa-clipboard-list"></i>
                      <p>Select a course to view grades</p>
                      <p class="help-text">Choose a course from the dropdown above to see your recorded grades and course average.</p>
                  </div>
              `;
          }
      });
  }
  
  // Set today's date
  const dateInput = document.getElementById("date");
  if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
  }
}

// Dashboard
function initDashboard() {
  displayGPAandCourses();
  displayDashboardCourses();
}

// Core Functions
function addCourse(name, credits, instructor) {
  try {
      if (!name || !credits || !instructor) {
          console.error('Missing required fields');
          return false;
      }
      
      const newCourse = {
          id: Date.now(),
          name: name.trim(),
          credits: parseInt(credits),
          instructor: instructor.trim(),
          grades: []
      };
      
      courses.push(newCourse);
      const saved = saveData();
      
      if (!saved) {
          console.error('Failed to save course');
          courses = courses.filter(c => c.id !== newCourse.id);
          return false;
      }
      
      console.log('Course added successfully:', newCourse);
      return true;
  } catch (error) {
      console.error('Error adding course:', error);
      return false;
  }
}

function addGrade(courseId, assignment, score, maxScore, date) {
  const course = courses.find(c => c.id == courseId);
  if (course) {
      course.grades.push({
          id: Date.now(),
          assignment,
          score,
          maxScore,
          date
      });
      saveData();
  }
}

function populateCourseOptions() {
  const select = document.getElementById("courseSelect");
  if (!select) return;
  
  select.innerHTML = '<option value="">--Select a course--</option>';
  
  courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name;
      select.appendChild(option);
  });
}

function displayCourseList() {
  const ul = document.querySelector(".course-list");
  if (!ul) return;
  
  ul.innerHTML = "";
  
  if (courses.length === 0) {
      const li = document.createElement("li");
      li.innerHTML = '<span class="no-courses">No courses added yet</span>';
      li.style.justifyContent = 'center';
      ul.appendChild(li);
      return;
  }
  
  courses.forEach(course => {
      const avg = calculateCourseAverage(course.id);
      const letterGrade = avg > 0 ? convertToLetterGrade(avg) : 'No grades';
      
      const li = document.createElement("li");
      li.innerHTML = `
          <div class="course-item-content">
              <span class="course-name">${course.name}</span>
              <div class="course-details">
                  <span class="course-credits">${course.credits} credits</span>
                  ${avg > 0 ? `<span class="course-grade">${letterGrade} (${avg.toFixed(1)}%)</span>` : ''}
              </div>
          </div>
      `;
      ul.appendChild(li);
  });
}

function displayDashboardCourses() {
  const container = document.getElementById("course-cards-container");
  if (!container) return;
  
  const emptyState = container.querySelector(".empty-dashboard-state");
  
  if (courses.length === 0) {
      if (emptyState) {
          emptyState.style.display = "block";
      }
      return;
  }
  
  if (emptyState) {
      emptyState.style.display = "none";
  }
  
  // Clear existing course cards (except empty state)
  const existingCards = container.querySelectorAll(".course-card");
  existingCards.forEach(card => card.remove());
  
  courses.forEach(course => {
      const avg = calculateCourseAverage(course.id);
      const letterGrade = avg > 0 ? convertToLetterGrade(avg) : 'No grades';
      const gradeClass = getGradeClass(letterGrade);
      const assignmentCount = course.grades ? course.grades.length : 0;
      
      const courseCard = document.createElement("article");
      courseCard.className = "course-card";
      courseCard.innerHTML = `
          <div class="course-header">
              <div class="course-badge">
                  <i class="fas fa-book"></i>
              </div>
          </div>
          <div class="course-info">
              <h3>${course.name}</h3>
              <p class="course-instructor">
                  <i class="fas fa-user"></i>
                  ${course.instructor}
              </p>
              <div class="course-stats">
                  <div class="stat-item">
                      <span class="stat-label">Current Grade</span>
                      <span class="${gradeClass}">${avg > 0 ? `${letterGrade} (${avg.toFixed(0)}%)` : 'No grades yet'}</span>
                  </div>
                  <div class="stat-item">
                      <span class="stat-label">Assignments</span>
                      <span class="assignments">${assignmentCount} completed</span>
                  </div>
              </div>
          </div>
          <div class="course-footer">
              <a href="course-details.html?id=${course.id}" class="view-details-btn">
                  <i class="fas fa-chart-bar"></i>
                  View Details
              </a>
          </div>
      `;
      
      container.appendChild(courseCard);
  });
}

function getGradeClass(letterGrade) {
  switch(letterGrade.charAt(0)) {
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      case 'D': return 'grade-d';
      case 'F': return 'grade-f';
      default: return 'grade-none';
  }
}

function updateCourseCount() {
  const countElement = document.getElementById("courses-total");
  if (countElement) {
      const count = courses.length;
      countElement.textContent = `${count} course${count !== 1 ? 's' : ''}`;
  }
}

function showRecentGrades(courseId) {
  const course = courses.find(c => c.id == courseId);
  const container = document.getElementById("gradeList");
  
  if (!course || !container) return;
  
  if (!course.grades || course.grades.length === 0) {
      container.innerHTML = `
          <div class="empty-state">
              <i class="fas fa-clipboard-list"></i>
              <h3>${course.name}</h3>
              <p>No grades recorded yet for this course.</p>
              <p class="help-text">Add your first assignment grade to start tracking your progress.</p>
          </div>
      `;
      return;
  }
  
  // Sort grades by date (newest first)
  const sortedGrades = [...course.grades].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let html = `<h3>${course.name} - ${course.instructor}</h3><ul>`;
  
  sortedGrades.forEach(grade => {
      const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
      html += `<li>• ${grade.assignment}: ${grade.score}/${grade.maxScore} (${percentage}% - ${formatDate(grade.date)})</li>`;
  });
  
  html += '</ul>';
  
  const avg = calculateCourseAverage(courseId);
  const letterGrade = convertToLetterGrade(avg);
  
  html += `
      <div class="course-summary">
          <strong>Course Average: ${avg.toFixed(1)}% (${letterGrade})</strong>
          <p class="grade-count">${course.grades.length} assignment${course.grades.length !== 1 ? 's' : ''} recorded</p>
      </div>
  `;
  
  container.innerHTML = html;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
}

function calculateCourseAverage(courseId) {
  const course = courses.find(c => c.id == courseId);
  if (!course || !course.grades || course.grades.length === 0) return 0;
  
  const totalScore = course.grades.reduce((sum, g) => sum + (g.score || 0), 0);
  const totalMax = course.grades.reduce((sum, g) => sum + (g.maxScore || 0), 0);
  
  return totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
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
      if (course.grades && course.grades.length > 0) {
          const avg = calculateCourseAverage(course.id);
          const gradePoint = convertToGPA(avg);
          totalPoints += gradePoint * (course.credits || 3);
          totalCredits += (course.credits || 3);
      }
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function displayGPAandCourses() {
  const gpa = calculateGPA();
  const total = courses.length;
  
  const gpaElement = document.querySelector(".gpa-summary .highlight, .gpa-value");
  const totalElement = document.querySelector(".course-count");
  
  if (gpaElement) {
      gpaElement.textContent = `${gpa.toFixed(2)}/4.0`;
  }
  
  if (totalElement) {
      totalElement.textContent = total.toString();
  }
}