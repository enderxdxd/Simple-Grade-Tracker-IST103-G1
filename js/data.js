
let courses = [];

function saveData() {
  try {
    localStorage.setItem("gradeTrackerCourses", JSON.stringify(courses));
    console.log('Data saved successfully:', courses);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem("gradeTrackerCourses");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        courses = parsed;
        console.log('Data loaded successfully:', courses);
      } else {
        courses = [];
        saveData();
      }
    } else {
      courses = [];
    }
    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    courses = [];
    return false;
  }
}