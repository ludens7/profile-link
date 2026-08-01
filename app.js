document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initShare();
  initProfilePage();
});

/* ==========================================
   1. Theme Management (Light / Dark Mode)
   ========================================== */
function initTheme() {
  const profile = getProfileData();
  const initialTheme = profile.theme || 'dark';
  setTheme(initialTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* ==========================================
   2. Share Profile Functionality
   ========================================== */
function initShare() {
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');
  if (!shareBtn || !toast) return;

  shareBtn.addEventListener('click', async () => {
    let shareUrl = window.location.href;
    if (shareUrl.startsWith('file://')) {
      shareUrl = 'https://codingkim.github.io/profile';
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        showToast(toast, '프로필 링크가 복사되었습니다!');
      } else {
        fallbackCopyText(shareUrl);
        showToast(toast, '프로필 링크가 복사되었습니다!');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast(toast, '링크 복사에 실패했습니다.');
    }
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

function showToast(toastElement, message) {
  toastElement.textContent = message;
  toastElement.classList.add('show');
  toastElement.setAttribute('aria-hidden', 'false');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toastElement.classList.remove('show');
    toastElement.setAttribute('aria-hidden', 'true');
  }, 2500);
}

/* ==========================================
   3. Dynamic Profile & Settings Management
   ========================================== */

const DEFAULT_PROFILE = {
  name: "KNU_HCC",
  tagline: "경북대학교 인문카운슬링센터",
  description: "인문학을 기반으로 다양한 프로그램을 진행합니다.",
  theme: "light",
  password: "6122",
  links: [
    {
      title: "진행중인 프로그램",
      url: "#programs"
    },
    {
      title: "센터가 궁금하다면? 홈페이지로",
      url: "https://incacenter.knu.ac.kr/"
    },
    {
      title: "궁금한 건 바로 문의! 카카오채널",
      url: "http://pf.kakao.com/_vdxjZG/chat"
    },
    {
      title: "인스타 둘러보기",
      url: "https://instagram.com/knu_hcc"
    }
  ],
  programLinks: [
    {
      title: "번아웃 리부트 & 독립출판 프로젝트",
      url: "https://incacenter.knu.ac.kr/"
    },
    {
      title: "고전으로 풀어내는 힐링 수다",
      url: "https://incacenter.knu.ac.kr/"
    },
    {
      title: "수요일 밤, 낭독으로 지혜를 사유하다",
      url: "https://incacenter.knu.ac.kr/"
    }
  ],
  socialLinks: {
    instagram: "https://instagram.com/knu_hcc",
    homepage: "https://incacenter.knu.ac.kr/",
    kakaotalk: "http://pf.kakao.com/_vdxjZG/chat"
  }
};

// Global state tracking ongoing program link toggle
let showingPrograms = false;

// SVG Icon templates based on keywords
const SVG_ICONS = {
  github: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  blog: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  monitor: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  mail: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  globe: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

/**
 * Detect suitable icon based on URL
 */
function getIconForUrl(url) {
  const cleanUrl = url.toLowerCase().trim();
  if (cleanUrl.includes('github.com')) {
    return SVG_ICONS.github;
  } else if (cleanUrl.includes('blog') || cleanUrl.includes('tistory') || cleanUrl.includes('velog') || cleanUrl.includes('naver.com')) {
    return SVG_ICONS.blog;
  } else if (cleanUrl.startsWith('mailto:') || cleanUrl.includes('@')) {
    return SVG_ICONS.mail;
  } else if (cleanUrl.includes('portfolio') || cleanUrl.includes('dev') || cleanUrl.includes('design') || cleanUrl.includes('incacenter')) {
    return SVG_ICONS.monitor;
  } else {
    return SVG_ICONS.globe;
  }
}

/**
 * Initialize dynamic profile page rendering and settings controls
 */
function initProfilePage() {
  let profile = getProfileData();
  renderProfile(profile);

  // Settings Buttons & Modal elements
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authPasswordInput = document.getElementById('auth-password');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const authView = document.getElementById('modal-auth-view');
  const editorView = document.getElementById('modal-editor-view');
  
  const profileForm = document.getElementById('profile-editor-form');
  const addLinkBtn = document.getElementById('add-link-btn');
  const editorLinksList = document.getElementById('editor-links-list');
  const editorCancelBtn = document.getElementById('editor-cancel-btn');
  const passChangeError = document.getElementById('password-change-error');

  if (!settingsBtn || !settingsModal) return;

  // Open settings modal
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    settingsModal.setAttribute('aria-hidden', 'false');
    
    // Reset view states
    authView.style.display = 'flex';
    editorView.style.display = 'none';
    authPasswordInput.value = '';
    authErrorMsg.classList.remove('show');
    passChangeError.classList.remove('show');
  });

  // Close settings modal helper
  const closeModal = () => {
    settingsModal.classList.remove('active');
    settingsModal.setAttribute('aria-hidden', 'true');
  };

  modalCloseBtn.addEventListener('click', closeModal);
  editorCancelBtn.addEventListener('click', closeModal);



  // Verify password to enter editing view
  const performAuth = () => {
    const inputPass = authPasswordInput.value;
    const currentProfile = getProfileData();
    if (inputPass === currentProfile.password) {
      authErrorMsg.classList.remove('show');
      authView.style.display = 'none';
      editorView.style.display = 'block';
      loadEditorForm(currentProfile);
    } else {
      authErrorMsg.classList.add('show');
    }
  };

  authSubmitBtn.addEventListener('click', performAuth);
  authPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performAuth();
    }
  });

  // Dynamic Link Management inside Settings Panel
  const addProgramLinkBtn = document.getElementById('add-program-link-btn');
  const editorProgramLinksList = document.getElementById('editor-program-links-list');

  addLinkBtn.addEventListener('click', () => {
    appendLinkEditCard(editorLinksList, { title: '', url: '' });
  });

  if (addProgramLinkBtn && editorProgramLinksList) {
    addProgramLinkBtn.addEventListener('click', () => {
      appendLinkEditCard(editorProgramLinksList, { title: '', url: '' });
    });
  }

  // Export current settings to clipboard for source code default
  const exportJsonBtn = document.getElementById('export-json-btn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const activeProfile = getProfileData();
      
      const linkCards = editorLinksList.querySelectorAll('.link-edit-card');
      const updatedLinks = [];
      linkCards.forEach(card => {
        const title = card.querySelector('.edit-link-title').value.trim();
        const url = card.querySelector('.edit-link-url').value.trim();
        if (title && url) {
          updatedLinks.push({ title, url });
        }
      });

      const progLinkCards = editorProgramLinksList.querySelectorAll('.link-edit-card');
      const updatedProgLinks = [];
      progLinkCards.forEach(card => {
        const title = card.querySelector('.edit-link-title').value.trim();
        const url = card.querySelector('.edit-link-url').value.trim();
        if (title && url) {
          updatedProgLinks.push({ title, url });
        }
      });

      const exportData = {
        name: document.getElementById('edit-name').value.trim(),
        tagline: document.getElementById('edit-tagline').value.trim(),
        description: document.getElementById('edit-description').value.trim(),
        theme: document.getElementById('edit-theme').value,
        password: activeProfile.password,
        links: updatedLinks,
        programLinks: updatedProgLinks,
        socialLinks: {
          instagram: document.getElementById('edit-instagram').value.trim(),
          homepage: document.getElementById('edit-homepage').value.trim(),
          kakaotalk: document.getElementById('edit-kakaotalk').value.trim()
        }
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      
      navigator.clipboard.writeText(jsonStr).then(() => {
        const toast = document.getElementById('toast');
        showToast(toast, '기본값 JSON 코드가 복사되었습니다! 채팅창에 붙여넣어 주세요.');
      }).catch(err => {
        console.error('Failed to copy JSON config: ', err);
        alert('복사에 실패했습니다. 아래 콘솔 창의 JSON을 복사해 주세요:\n\n' + jsonStr);
      });
    });
  }

  // Handle setting updates on save
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newPass = document.getElementById('new-password').value.trim();
    const confirmNewPass = document.getElementById('confirm-new-password').value.trim();

    // Password validation if they entered something
    if (newPass || confirmNewPass) {
      if (newPass !== confirmNewPass) {
        passChangeError.classList.add('show');
        return;
      }
    }

    passChangeError.classList.remove('show');

    // Collect all main links from editor cards
    const linkCards = editorLinksList.querySelectorAll('.link-edit-card');
    const updatedLinks = [];
    linkCards.forEach(card => {
      const title = card.querySelector('.edit-link-title').value.trim();
      const url = card.querySelector('.edit-link-url').value.trim();
      if (title && url) {
        updatedLinks.push({ title, url });
      }
    });

    // Collect all program links from editor cards
    const progLinkCards = editorProgramLinksList.querySelectorAll('.link-edit-card');
    const updatedProgLinks = [];
    progLinkCards.forEach(card => {
      const title = card.querySelector('.edit-link-title').value.trim();
      const url = card.querySelector('.edit-link-url').value.trim();
      if (title && url) {
        updatedProgLinks.push({ title, url });
      }
    });

    // Save profile data
    const activeProfile = getProfileData();
    const updatedProfile = {
      name: document.getElementById('edit-name').value.trim(),
      tagline: document.getElementById('edit-tagline').value.trim(),
      description: document.getElementById('edit-description').value.trim(),
      theme: document.getElementById('edit-theme').value,
      password: newPass ? newPass : activeProfile.password,
      links: updatedLinks,
      programLinks: updatedProgLinks,
      socialLinks: {
        instagram: document.getElementById('edit-instagram').value.trim(),
        homepage: document.getElementById('edit-homepage').value.trim(),
        kakaotalk: document.getElementById('edit-kakaotalk').value.trim()
      }
    };

    saveProfileData(updatedProfile);
    setTheme(updatedProfile.theme);
    renderProfile(updatedProfile);
    closeModal();
    
    const toast = document.getElementById('toast');
    showToast(toast, '설정이 성공적으로 저장되었습니다!');
  });
}

/**
 * Get profile data from localStorage or save default
 */
function getProfileData() {
  const data = localStorage.getItem('profileData_v8');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing profile data from local storage, resetting to default', e);
    }
  }
  saveProfileData(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

/**
 * Save profile data to localStorage
 */
function saveProfileData(profile) {
  localStorage.setItem('profileData_v8', JSON.stringify(profile));
}

/**
 * Render profile cards and links based on profile data object
 */
function renderProfile(profile) {
  document.getElementById('profile-name').textContent = profile.name;
  document.getElementById('profile-tagline').textContent = profile.tagline;
  document.getElementById('profile-description').textContent = profile.description;

  // Render the links dynamically based on the active view state
  if (showingPrograms) {
    renderLinks(profile, 'programLinks');
  } else {
    renderLinks(profile, 'links');
  }

  // Render Footer Social Links dynamically
  const instaElem = document.getElementById('social-instagram');
  const homeElem = document.getElementById('social-homepage');
  const kakaoElem = document.getElementById('social-kakaotalk');

  if (instaElem) {
    if (profile.socialLinks?.instagram) {
      instaElem.href = profile.socialLinks.instagram;
      instaElem.style.display = 'flex';
    } else {
      instaElem.style.display = 'none';
    }
  }

  if (homeElem) {
    if (profile.socialLinks?.homepage) {
      homeElem.href = profile.socialLinks.homepage;
      homeElem.style.display = 'flex';
    } else {
      homeElem.style.display = 'none';
    }
  }

  if (kakaoElem) {
    if (profile.socialLinks?.kakaotalk) {
      kakaoElem.href = profile.socialLinks.kakaotalk;
      kakaoElem.style.display = 'flex';
    } else {
      kakaoElem.style.display = 'none';
    }
  }
}

/**
 * Helper to render main links or program links with intercepting logic
 */
function renderLinks(profile, listKey) {
  const linksContainer = document.getElementById('links-container');
  if (!linksContainer) return;

  // Clear existing items but retain the sr-only tag
  linksContainer.innerHTML = '<h2 class="sr-only">공식 링크 목록</h2>';

  const list = profile[listKey] || [];

  list.forEach((link, index) => {
    const linkAnchor = document.createElement('a');
    linkAnchor.href = link.url;
    
    // Open in the same window so smartphone Back button returns to the first screen
    if (link.url !== '#programs') {
      linkAnchor.rel = 'noopener noreferrer';
    }
    
    linkAnchor.className = listKey === 'programLinks' ? 'link-item program-link-item' : 'link-item';
    linkAnchor.id = `link-dynamic-${listKey}-${index}`;
    
    // Automatically match appropriate SVG icon
    const iconSvg = getIconForUrl(link.url);

    linkAnchor.innerHTML = `
      <div class="link-icon-bg">
        ${iconSvg}
      </div>
      <span class="link-title">${escapeHtml(link.title)}</span>
      <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    // Intercept click if it is the ongoing programs link
    if (link.url === '#programs') {
      linkAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Avoid triggering global close click handler instantly
        switchToProgramsView();
      });
    }

    linksContainer.appendChild(linkAnchor);
  });
}

/**
 * Smooth transition to Ongoing Programs view
 */
function switchToProgramsView(pushHistory = true) {
  const linksContainer = document.getElementById('links-container');
  if (!linksContainer) return;

  linksContainer.classList.add('fade-out');
  setTimeout(() => {
    showingPrograms = true;
    const profile = getProfileData();
    renderLinks(profile, 'programLinks');
    linksContainer.classList.remove('fade-out');
    
    if (pushHistory) {
      history.pushState({ view: 'programs' }, '', '#programs');
    }
  }, 180);
}

/**
 * Smooth transition back to Main links view
 */
function switchToMainView(popHistory = true) {
  const linksContainer = document.getElementById('links-container');
  if (!linksContainer) return;

  linksContainer.classList.add('fade-out');
  setTimeout(() => {
    showingPrograms = false;
    const profile = getProfileData();
    renderLinks(profile, 'links');
    linksContainer.classList.remove('fade-out');
    
    if (popHistory && window.location.hash === '#programs') {
      history.back();
    }
  }, 180);
}

// Global click event to close program view when clicking outside
document.addEventListener('click', (e) => {
  if (showingPrograms) {
    const clickedProgramLink = e.target.closest('.program-link-item');
    const clickedSettings = e.target.closest('#settings-btn') || e.target.closest('.modal-box') || e.target.closest('#theme-toggle');
    
    if (!clickedProgramLink && !clickedSettings) {
      switchToMainView(true); // Pops the history back
    }
  }
});

// Intercept browser/smartphone hardware back button
window.addEventListener('popstate', () => {
  if (showingPrograms && window.location.hash !== '#programs') {
    switchToMainView(false); // Go to main view but do not call history.back()
  } else if (!showingPrograms && window.location.hash === '#programs') {
    switchToProgramsView(false); // Go to programs view but do not push new state
  }
});

/**
 * Load settings editor values
 */
function loadEditorForm(profile) {
  document.getElementById('edit-name').value = profile.name;
  document.getElementById('edit-tagline').value = profile.tagline;
  document.getElementById('edit-description').value = profile.description;
  
  // Load theme style selector
  document.getElementById('edit-theme').value = profile.theme || 'dark';
  
  // Load social links
  document.getElementById('edit-instagram').value = profile.socialLinks?.instagram || '';
  document.getElementById('edit-homepage').value = profile.socialLinks?.homepage || '';
  document.getElementById('edit-kakaotalk').value = profile.socialLinks?.kakaotalk || '';
  
  // Reset password change fields
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-new-password').value = '';

  const editorLinksList = document.getElementById('editor-links-list');
  editorLinksList.innerHTML = ''; // Clear previous items

  profile.links.forEach(link => {
    appendLinkEditCard(editorLinksList, link);
  });

  const editorProgramLinksList = document.getElementById('editor-program-links-list');
  if (editorProgramLinksList) {
    editorProgramLinksList.innerHTML = ''; // Clear previous items
    const progLinks = profile.programLinks || [];
    progLinks.forEach(link => {
      appendLinkEditCard(editorProgramLinksList, link);
    });
  }
}

/**
 * Append editing card for link items
 */
function appendLinkEditCard(container, link) {
  const card = document.createElement('div');
  card.className = 'link-edit-card';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-link" aria-label="링크 삭제">&times;</button>
    <div class="form-group" style="margin-bottom: 8px;">
      <label class="form-label" style="font-size: 11px;">링크 이름</label>
      <input type="text" class="form-input edit-link-title" value="${escapeHtml(link.title)}" placeholder="예: GitHub" required>
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label" style="font-size: 11px;">연결 주소 (URL)</label>
      <input type="text" class="form-input edit-link-url" value="${escapeHtml(link.url)}" placeholder="예: https://github.com/..." required>
    </div>
  `;

  // Attach delete behavior to the &times; button
  const removeBtn = card.querySelector('.btn-remove-link');
  removeBtn.addEventListener('click', () => {
    card.remove();
  });

  container.appendChild(card);
}

/**
 * Escape HTML to prevent XSS issues in user input
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
