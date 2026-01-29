// Get JWT token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Parse JWT token
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Check access on page load
function checkAccess(allowedRoles, redirectTo = 'login.html') {
  const token = getCookie('token');
  if (!token) {
    window.location.href = redirectTo;
    return null;
  }
  const user = parseJwt(token);
  if (!user || !allowedRoles.includes(user.role)) {
    window.location.href = redirectTo;
    return null;
  }
  return user;
}

// Show/hide sidebar items based on role
function setupSidebar(user) {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    const page = link.getAttribute('href');
    if (page === 'hr.html' && user.role !== 'Admin') link.style.display = 'none';
    if (page === 'employees.html' && !['Admin','HR Manager'].includes(user.role)) link.style.display = 'none';
    if (page === 'attendance.html' && !['Admin','HR Manager','Team Lead'].includes(user.role)) link.style.display = 'none';
    if (page === 'leave.html' && !['Admin','HR Manager','Employee'].includes(user.role)) link.style.display = 'none';
  });
}

// Logout button handling
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('https://hr-dashboard-orgj.onrender.com/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Clear token just in case
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Logout failed', err);
    }
  });
}
