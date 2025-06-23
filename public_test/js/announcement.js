function closeAnnouncement() {
    const announcementBar = document.getElementById('announcement-bar');
    announcementBar.classList.add('hidden');
    localStorage.setItem('announcementDismissed', 'true');
}

document.addEventListener('DOMContentLoaded', function() {
    const announcementBar = document.getElementById('announcement-bar');
    if (localStorage.getItem('announcementDismissed') === 'true') {
        announcementBar.classList.add('hidden');
    }
}); 