// app.js

// ====== DOM Elements ======
const studentBtn = document.getElementById('studentBtn');
const librarianBtn = document.getElementById('librarianBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegisterLink');
const backToLoginButton = document.getElementById('backToLoginButton');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const userTypeSelector = document.getElementById('userTypeSelector');
const mainHeader = document.getElementById('mainHeader');

// ====== Global Variables ======
let userType = 'student'; // default type
let currentUser = null;

// ====== Dummy Database ======
const userDatabase = {
  students: [
    {
      id: "STU001",
      name: "Rahul Sharma",
      email: "student@college.edu",
      password: "password123",
      rollNumber: "CS2021001",
      year: "2",
      branch: "CSE",
    }
  ],
  librarians: [
    {
      id: "LIB001",
      name: "Library Admin",
      email: "librarian@college.edu",
      password: "lib123"
    }
  ]
};

// ====== Event Listeners ======
studentBtn.addEventListener('click', () => switchUserType('student'));
librarianBtn.addEventListener('click', () => switchUserType('librarian'));
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms('register');
});
backToLoginButton.addEventListener('click', () => toggleForms('login'));

// ====== Functions ======

// Switch between Student and Librarian
function switchUserType(type) {
  userType = type;

  studentBtn.classList.remove('active');
  librarianBtn.classList.remove('active');

  if (type === 'student') {
    studentBtn.classList.add('active');
    mainHeader.classList.remove('admin-header');
    document.getElementById('loginHeader').textContent = "Student Login";
    document.getElementById('registerHeader').textContent = "Student Registration";
    document.getElementById('registerPrompt').style.display = "block";
  } else {
    librarianBtn.classList.add('active');
    mainHeader.classList.add('admin-header');
    document.getElementById('loginHeader').textContent = "Librarian Login";
    document.getElementById('registerHeader').textContent = "Librarian Registration";
    document.getElementById('registerPrompt').style.display = "none";
  }
}

// Toggle between login and register forms
function toggleForms(mode) {
  if (mode === 'register') {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
  } else {
    loginSection.classList.remove('hidden');
    registerSection.classList.add('hidden');
  }
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();

  // Show loading spinner while processing
  showLoading();

  const email = document.getElementById('userEmail').value.trim();
  const password = document.getElementById('userPassword').value.trim();

  if (!email || !password) {
    alert('Please fill all fields.');
    hideLoading(); // Hide spinner if validation fails
    return;
  }

  let user = null;
  if (userType === 'student') {
    user = userDatabase.students.find(u => u.email === email && u.password === password);
  } else {
    user = userDatabase.librarians.find(u => u.email === email && u.password === password);
  }

  // After login validation, hide the loading spinner
  hideLoading();

  if (user) {
    currentUser = { ...user, type: userType };
    try {
      localStorage.setItem('libraryUser', JSON.stringify(currentUser));
    } catch (err) {
      console.error('LocalStorage Error:', err);
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'Welcome back!',
      confirmButtonColor: '#3498db'
    });

    showDashboard();
  } else {
    alert('Invalid credentials. Please try again.');
  }
}

// Handle Register
function handleRegister(e) {
  e.preventDefault();

  // Before adding new student/librarian, check if email exists
  let emailExists = false;
  if (userType === 'student') {
    emailExists = userDatabase.students.some(u => u.email === email);
  } else {
    emailExists = userDatabase.librarians.some(u => u.email === email);
  }

  if (emailExists) {
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: 'Email already registered. Please login.',
      confirmButtonColor: '#e74c3c'
    });
    return;
  }

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Additional fields for students
  if (userType === 'student') {
    const rollNumber = document.getElementById('regRoll').value.trim();
    const year = document.getElementById('regYear').value;
    const branch = document.getElementById('regBranch').value;

    if (!rollNumber || !year || !branch) {
      alert('Please fill student details.');
      return;
    }

    const newStudent = {
      id: "STU" + (userDatabase.students.length + 1).toString().padStart(3, '0'),
      name, email, password, rollNumber, year, branch
    };

    userDatabase.students.push(newStudent);
    currentUser = { ...newStudent, type: 'student' };

  } else {
    const newLibrarian = {
      id: "LIB" + (userDatabase.librarians.length + 1).toString().padStart(3, '0'),
      name, email, password
    };

    userDatabase.librarians.push(newLibrarian);
    currentUser = { ...newLibrarian, type: 'librarian' };
  }

  try {
    localStorage.setItem('libraryUser', JSON.stringify(currentUser));
  } catch (err) {
    console.error('LocalStorage Error:', err);
  }

  alert('Registration Successful!');
  showDashboard();
}

// Show dashboard after login
function showDashboard() {
  // Check if currentUser is null before proceeding
  if (!currentUser) {
    console.error('No user logged in');
    return;
  }

  loginSection.classList.add('hidden');
  registerSection.classList.add('hidden');
  userTypeSelector.classList.add('hidden');

  if (currentUser.type === 'student') {
    document.getElementById('studentDashboard').classList.remove('hidden');
    document.getElementById('librarianDashboard').classList.add('hidden');
  } else {
    document.getElementById('studentDashboard').classList.add('hidden');
    document.getElementById('librarianDashboard').classList.remove('hidden');
  }
}

// Initialize app on load
function initApp() {
  try {
    const savedUser = JSON.parse(localStorage.getItem('libraryUser'));
    if (savedUser) {
      currentUser = savedUser;
      userType = currentUser.type;
      switchUserType(userType);
      showDashboard();
    } else {
      // Do nothing if no user is found
      console.log('No saved user, showing login screen.');
    }
  } catch (err) {
    console.error('Failed to load saved user.', err);
  }
}

// Show loading spinner
function showLoading() {
  document.getElementById('loadingSpinner').classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
  document.getElementById('loadingSpinner').classList.add('hidden');
}

// Start
window.addEventListener('load', initApp);
