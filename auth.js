// API Configuration
// ================= USE YOUR LIVE BACKEND =================
// Your backend is already live on Railway - use this URL
const API_URL = 'https://finflow-expense-tracker-backend-production.up.railway.app/api';

// For local development, uncomment this:
// const API_URL = window.location.hostname === 'localhost' || 
//                 window.location.hostname === '127.0.0.1'
//                 ? 'http://localhost:5000/api'
//                 : 'https://finflow-expense-tracker-backend-production.up.railway.app/api';

// Show/Hide Forms
function showSignup() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
  hideMessage();
}

function showLogin() {
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  hideMessage();
}

// Toggle Password Visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector('.toggle-password i');
  
  if (input.type === 'password') {
    input.type = 'text';
    button.classList.remove('fa-eye');
    button.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    button.classList.remove('fa-eye-slash');
    button.classList.add('fa-eye');
  }
}

// Show Message
function showMessage(message, type = 'success') {
  const alert = document.getElementById('messageAlert');
  const messageText = document.getElementById('messageText');
  const icon = alert.querySelector('i');
  
  messageText.textContent = message;
  alert.className = `message-alert ${type}`;
  alert.classList.remove('hidden');
  
  // Update icon based on type
  if (type === 'success') {
    icon.className = 'fas fa-check-circle';
  } else if (type === 'error') {
    icon.className = 'fas fa-exclamation-circle';
  } else if (type === 'warning') {
    icon.className = 'fas fa-exclamation-triangle';
  } else if (type === 'info') {
    icon.className = 'fas fa-info-circle';
  }
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    hideMessage();
  }, 5000);
}

function hideMessage() {
  const alert = document.getElementById('messageAlert');
  alert.classList.add('hidden');
}

// Test backend connection with more detailed logging
async function testBackend() {
  try {
    console.log('Testing backend connection to:', API_URL);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connected successfully:', data);
      return true;
    } else {
      console.warn('⚠️ Backend responded with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    console.log('Make sure your backend is running at:', API_URL);
    return false;
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const loginBtn = document.getElementById('loginBtn');
  
  // Validate
  if (!email || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading state
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  
  try {
    console.log('Attempting login for:', email);
    console.log('API URL:', API_URL);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      mode: 'cors'
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showMessage('Login successful! Redirecting...', 'success');
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      showMessage(`Unable to connect to server at ${API_URL}. Please check your internet connection.`, 'error');
    } else {
      showMessage('An unexpected error occurred: ' + error.message, 'error');
    }
  } finally {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt btn-icon"></i> Sign In';
  }
}

// Handle Signup
async function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const signupBtn = document.getElementById('signupBtn');
  
  // Validate
  if (!name || !email || !password || !confirmPassword) {
    showMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error');
    return;
  }
  
  // Show loading state
  signupBtn.classList.add('loading');
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  
  try {
    console.log('Attempting signup for:', email);
    console.log('API URL:', API_URL);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password }),
      mode: 'cors'
    });
    
    const data = await response.json();
    console.log('Signup response:', data);
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showMessage('Account created successfully! Redirecting...', 'success');
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showMessage(data.message || 'Registration failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      showMessage(`Unable to connect to server at ${API_URL}. Please check your internet connection.`, 'error');
    } else {
      showMessage('An unexpected error occurred: ' + error.message, 'error');
    }
  } finally {
    signupBtn.classList.remove('loading');
    signupBtn.disabled = false;
    signupBtn.innerHTML = '<i class="fas fa-user-plus btn-icon"></i> Join GameHub';
  }
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', async () => {
  console.log('Auth page loaded');
  console.log('API URL:', API_URL);
  console.log('Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');
  
  // Test backend connection on page load
  const isConnected = await testBackend();
  if (!isConnected) {
    showMessage(`⚠️ Cannot connect to backend at ${API_URL}. Please check your internet connection.`, 'error');
  } else {
    // Only show this if backend is connected
    console.log('✅ Backend is live and reachable!');
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Verify token is still valid
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        window.location.href = 'index.html';
      } else {
        // Invalid token, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Keep on login page if validation fails
    }
  }
});
