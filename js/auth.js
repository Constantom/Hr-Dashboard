function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function checkAccess(allowedRoles, redirectTo = 'index.html') {
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

function setupLogout(buttonId = 'logoutBtn') {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await fetch('https://hr-dashboard-orgj.onrender.com/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Logout failed', err);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const token = getCookie('token');
  if (token) {
    const user = parseJwt(token);
    if (user) {
      setupSidebar(user);
      setupLogout('logoutBtn');
    }
  }
});
