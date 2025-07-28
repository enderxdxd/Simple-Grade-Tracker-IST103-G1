# 📊 Grade Tracker

A modern, responsive web application for tracking academic performance across multiple courses. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### 🎯 Core Functionality
- **Course Management**: Add, view, and organize your academic courses
- **Grade Tracking**: Record and monitor assignment grades with detailed breakdowns
- **GPA Calculation**: Automatic GPA computation based on course credits and grades
- **Performance Analytics**: Visual grade distribution and trend analysis

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Intuitive Navigation**: Easy-to-use forms and clear information hierarchy
- **Real-time Updates**: Instant calculations and visual feedback

### 📈 Analytics & Insights
- **Course Averages**: Automatic calculation of course performance
- **Grade Distribution**: Visual breakdown of A-F grade ranges
- **Trend Analysis**: Performance improvement/decline indicators
- **Summary Dashboard**: Quick overview of academic progress

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. **Download or clone the project**
   ```bash
   git clone https://github.com/yourusername/grade-tracker.git
   cd grade-tracker
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

### Project Structure
```
grade-tracker/
├── index.html              # Main dashboard
├── add-course.html         # Course creation page
├── grades.html             # Grade entry page
├── course-details.html     # Detailed course view
├── styles.css              # All styling
└── js/
    ├── data.js             # Data management
    ├── script.js           # Main application logic
    └── course-details.js   # Course details functionality
```

## 📋 Usage Guide

### 1. Adding Your First Course
1. Click **"Add Your First Course"** on the dashboard
2. Fill in course details:
   - Course name (e.g., "Computer Science 101")
   - Credits (1-6)
   - Instructor name
3. Click **"Save Course"**

### 2. Recording Grades
1. Go to **"Enter Grades"** from the dashboard
2. Select a course from the dropdown
3. Enter assignment details:
   - Assignment name
   - Points earned
   - Total possible points
   - Date
4. Click **"Add Grade"**

### 3. Viewing Course Details
1. Click **"View Details"** on any course card
2. View comprehensive analytics:
   - Current grade and letter grade
   - Assignment history
   - Grade distribution chart
   - Performance trends

### 4. Dashboard Overview
- **GPA Display**: Current cumulative GPA
- **Course Count**: Total number of courses
- **Course Cards**: Quick overview of each course
- **Performance Summary**: At-a-glance academic status

## 🎨 Features in Detail

### Grade Calculation System
- **Letter Grades**: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (<60%)
- **GPA Scale**: 4.0 scale with credit weighting
- **Course Averages**: Weighted by assignment points, not count
- **Real-time Updates**: Immediate recalculation on data changes

### Data Management
- **Local Storage**: All data saved in browser's localStorage
- **Automatic Backup**: Data persists between sessions
- **No Server Required**: Completely client-side application
- **Data Validation**: Input validation and error handling

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layout for tablet screens
- **Desktop Enhanced**: Full-featured desktop experience
- **Touch Friendly**: Large tap targets and gesture support

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript
- **Font Awesome**: Icons for enhanced visual appeal
- **Google Fonts**: Inter and JetBrains Mono typography

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Performance Features
- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Minimal asset size and efficient code
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Responsive**: Instant UI updates and calculations

## 🔧 Customization

### Modifying Grade Scale
Edit the grade conversion functions in `js/script.js`:
```javascript
function convertToLetterGrade(avg) {
    if (avg >= 90) return "A";
    if (avg >= 80) return "B";
    // Modify these values as needed
}
```

### Styling Changes
All styles are in `styles.css` with CSS custom properties for easy theming:
```css
:root {
    --primary: #2563eb;
    --accent: #dc2626;
    /* Modify these colors */
}
```

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Add new functions to `js/script.js`
- Create new pages following the existing HTML structure
- Extend the data model in `js/data.js`

## 📱 Screenshots

### Dashboard
- Clean overview of all courses
- GPA display and course statistics
- Quick action buttons

### Course Details
- Comprehensive grade analysis
- Visual grade distribution
- Performance trend indicators

### Grade Entry
- Simple, intuitive form
- Course selection and validation
- Real-time feedback

## 🤝 Contributing

This is an open-source project! Contributions are welcome:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines
- Keep JavaScript vanilla (no frameworks)
- Maintain responsive design principles
- Follow existing code style and structure
- Test on multiple browsers and devices
- Update documentation for new features

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for the icon library
- **Google Fonts** for typography
- **Modern CSS techniques** for responsive design
- **Web standards** for accessibility features

## 📞 Support

If you have questions or need help:
- Check the issues page for common problems
- Create a new issue for bug reports
- Fork and modify for custom needs

---

**Made with ❤️ for students tracking their academic journey**

*Keep learning, keep growing! 🎓*
