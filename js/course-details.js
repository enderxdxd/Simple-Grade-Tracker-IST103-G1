// course-details.js - Simple course details functionality

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initCourseDetails();
});

function initCourseDetails() {
    // Get course ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    if (!courseId) {
        // If no course ID, redirect to dashboard
        window.location.href = 'index.html';
        return;
    }
    
    const course = courses.find(c => c.id == courseId);
    
    if (!course) {
        // If course not found, redirect to dashboard
        window.location.href = 'index.html';
        return;
    }
    
    displayCourseDetails(course);
    displayGradesList(course);
    displayGradeDistribution(course);
    
    // Setup delete button
    const deleteBtn = document.getElementById('delete-course-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteCourse(courseId));
    }
}

function displayCourseDetails(course) {
    // Update course header
    document.getElementById('course-title').textContent = course.name;
    document.getElementById('instructor-name').textContent = course.instructor;
    document.getElementById('course-credits').textContent = `${course.credits} Credits`;
    
    // Calculate course statistics
    const grades = course.grades || [];
    const totalAssignments = grades.length;
    const courseAverage = calculateCourseAverage(course.id);
    const letterGrade = convertToLetterGrade(courseAverage);
    
    // Update summary cards
    document.getElementById('current-grade').textContent = totalAssignments > 0 ? `${courseAverage.toFixed(1)}%` : '--';
    document.getElementById('letter-grade').textContent = totalAssignments > 0 ? letterGrade : 'No Grades';
    document.getElementById('total-assignments').textContent = totalAssignments;
    
    // Calculate average score per assignment
    if (totalAssignments > 0) {
        const totalEarned = grades.reduce((sum, g) => sum + g.score, 0);
        const totalPossible = grades.reduce((sum, g) => sum + g.maxScore, 0);
        const avgScore = totalPossible > 0 ? (totalEarned / totalAssignments).toFixed(1) : 0;
        document.getElementById('average-score').textContent = avgScore;
    } else {
        document.getElementById('average-score').textContent = '--';
    }
    
    // Calculate trend
    displayTrend(grades);
}

function displayTrend(grades) {
    const trendIcon = document.getElementById('trend-icon');
    const trendValue = document.getElementById('trend-value');
    const trendText = document.getElementById('trend-text');
    
    if (grades.length < 2) {
        trendValue.textContent = '--';
        trendText.textContent = 'Need more data';
        return;
    }
    
    // Sort grades by date
    const sortedGrades = [...grades].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Compare first half vs second half
    const midPoint = Math.floor(sortedGrades.length / 2);
    const firstHalf = sortedGrades.slice(0, midPoint);
    const secondHalf = sortedGrades.slice(midPoint);
    
    const firstAvg = firstHalf.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 2) {
        trendIcon.className = 'fas fa-trending-up';
        trendIcon.style.color = '#10b981';
        trendValue.textContent = `+${difference.toFixed(1)}%`;
        trendText.textContent = 'Improving';
    } else if (difference < -2) {
        trendIcon.className = 'fas fa-trending-down';
        trendIcon.style.color = '#ef4444';
        trendValue.textContent = `${difference.toFixed(1)}%`;
        trendText.textContent = 'Declining';
    } else {
        trendIcon.className = 'fas fa-minus';
        trendIcon.style.color = '#6b7280';
        trendValue.textContent = 'Stable';
        trendText.textContent = 'No change';
    }
}

function displayGradesList(course) {
    const tbody = document.getElementById('grades-tbody');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('grades-table');
    
    const grades = course.grades || [];
    
    if (grades.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    emptyState.style.display = 'none';
    
    // Sort grades by date (newest first)
    const sortedGrades = [...grades].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = '';
    
    sortedGrades.forEach(grade => {
        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
        const row = document.createElement('tr');
        
        // Add class based on grade performance
        let gradeClass = '';
        if (percentage >= 90) gradeClass = 'grade-excellent';
        else if (percentage >= 80) gradeClass = 'grade-good';
        else if (percentage >= 70) gradeClass = 'grade-fair';
        else if (percentage >= 60) gradeClass = 'grade-poor';
        else gradeClass = 'grade-failing';
        
        row.className = gradeClass;
        
        row.innerHTML = `
            <td class="assignment-name">${grade.assignment}</td>
            <td class="score">${grade.score}/${grade.maxScore}</td>
            <td class="percentage">${percentage}%</td>
            <td class="date">${formatDate(grade.date)}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function displayGradeDistribution(course) {
    const grades = course.grades || [];
    
    if (grades.length === 0) {
        // Reset all counts to 0
        ['A', 'B', 'C', 'D', 'F'].forEach(grade => {
            document.getElementById(`count-${grade}`).textContent = '0';
            const fill = document.querySelector(`[data-grade="${grade}"]`);
            if (fill) fill.style.width = '0%';
        });
        return;
    }
    
    // Count grades in each range
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    grades.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100;
        if (percentage >= 90) distribution.A++;
        else if (percentage >= 80) distribution.B++;
        else if (percentage >= 70) distribution.C++;
        else if (percentage >= 60) distribution.D++;
        else distribution.F++;
    });
    
    // Update display
    const maxCount = Math.max(...Object.values(distribution));
    
    Object.entries(distribution).forEach(([grade, count]) => {
        document.getElementById(`count-${grade}`).textContent = count.toString();
        
        const fill = document.querySelector(`[data-grade="${grade}"]`);
        if (fill) {
            const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
            fill.style.width = `${width}%`;
        }
    });
}

function deleteCourse(courseId) {
    const course = courses.find(c => c.id == courseId);
    if (!course) return;
    
    const confirmMessage = `Are you sure you want to delete "${course.name}"?\n\nThis will permanently remove:\n- The course\n- All ${course.grades?.length || 0} grades\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        // Remove course from array
        const courseIndex = courses.findIndex(c => c.id == courseId);
        if (courseIndex > -1) {
            courses.splice(courseIndex, 1);
            saveData();
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        }
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}