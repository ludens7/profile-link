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
  description: "인문학을 기반으로 다양한 프로그램을 진행합니다.\n아래 링크로 신청해 주세요.",
  theme: "light",
  password: "6122",
  links: [
    {
      title: "번아웃 리부트 & 독립출판 프로젝트",
      url: "https://incacenter.knu.ac.kr/",
      description: "치유 글쓰기와 독립 출판을 통한 마음 재시동 프로젝트"
    },
    {
      title: "고전으로 풀어내는 힐링 수다",
      url: "https://incacenter.knu.ac.kr/",
      description: "동서양의 고전을 함께 읽고 지혜를 나누는 치유 대화"
    },
    {
      title: "수요일 밤, 낭독으로 지혜를 사유하다",
      url: "https://incacenter.knu.ac.kr/",
      description: "매주 수요일 밤, 낭독을 통해 마음을 성찰하는 낭독 모임"
    }
  ],
  socialLinks: {
    instagram: "https://instagram.com/knu_hcc",
    homepage: "https://incacenter.knu.ac.kr/",
    kakaotalk: "http://pf.kakao.com/_vdxjZG/chat"
  }
};

// SVG Icon templates based on keywords
const SVG_ICONS = {
  github: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  book: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  heart: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  moon: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  pen: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  mail: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  globe: `<svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

/**
 * Detect suitable icon based on URL and title keywords
 */
function getIconForLink(title, url) {
  const cleanTitle = title.toLowerCase().trim();
  const cleanUrl = url.toLowerCase().trim();

  // Keyword check for Humanities/Counseling elements
  if (cleanTitle.includes('독립출판') || cleanTitle.includes('출판') || cleanTitle.includes('쓰기') || cleanTitle.includes('프로젝트') || cleanTitle.includes('pen') || cleanTitle.includes('펜')) {
    return SVG_ICONS.pen;
  } else if (cleanTitle.includes('힐링') || cleanTitle.includes('수다') || cleanTitle.includes('상담') || cleanTitle.includes('마음') || cleanTitle.includes('치유') || cleanTitle.includes('heart') || cleanTitle.includes('하트')) {
    return SVG_ICONS.heart;
  } else if (cleanTitle.includes('밤') || cleanTitle.includes('낭독') || cleanTitle.includes('지혜') || cleanTitle.includes('사유') || cleanTitle.includes('moon') || cleanTitle.includes('달')) {
    return SVG_ICONS.moon;
  } else if (cleanTitle.includes('고전') || cleanTitle.includes('책') || cleanTitle.includes('도서') || cleanTitle.includes('book') || cleanTitle.includes('독서')) {
    return SVG_ICONS.book;
  }

  // Fallbacks based on URL
  if (cleanUrl.includes('github.com')) {
    return SVG_ICONS.github;
  } else if (cleanUrl.includes('blog') || cleanUrl.includes('tistory') || cleanUrl.includes('velog') || cleanUrl.includes('naver.com')) {
    return SVG_ICONS.book;
  } else if (cleanUrl.startsWith('mailto:') || cleanUrl.includes('@')) {
    return SVG_ICONS.mail;
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
  addLinkBtn.addEventListener('click', () => {
    appendLinkEditCard(editorLinksList, { title: '', url: '' });
  });

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
        const description = card.querySelector('.edit-link-description').value.trim();
        if (title && url) {
          updatedLinks.push({ title, url, description });
        }
      });

      const exportData = {
        name: document.getElementById('edit-name').value.trim(),
        tagline: document.getElementById('edit-tagline').value.trim(),
        description: document.getElementById('edit-description').value.trim(),
        theme: document.getElementById('edit-theme').value,
        password: activeProfile.password,
        links: updatedLinks,
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

    // Collect all links from editor cards
    const linkCards = editorLinksList.querySelectorAll('.link-edit-card');
    const updatedLinks = [];
    linkCards.forEach(card => {
      const title = card.querySelector('.edit-link-title').value.trim();
      const url = card.querySelector('.edit-link-url').value.trim();
      const description = card.querySelector('.edit-link-description').value.trim();
      if (title && url) {
        updatedLinks.push({ title, url, description });
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
  const data = localStorage.getItem('profileData_v11');
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
  localStorage.setItem('profileData_v11', JSON.stringify(profile));
}

/**
 * Render profile cards and links based on profile data object
 */
function renderProfile(profile) {
  document.getElementById('profile-name').textContent = profile.name;
  document.getElementById('profile-tagline').textContent = profile.tagline;
  document.getElementById('profile-description').textContent = profile.description;

  // Render all links directly on the first screen
  renderLinks(profile, 'links');

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
 * Helper to render main links with dynamic icons and optional descriptions
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
    linkAnchor.rel = 'noopener noreferrer';
    linkAnchor.className = 'link-item';
    linkAnchor.id = `link-dynamic-${listKey}-${index}`;
    
    // Automatically match appropriate SVG icon based on title keywords
    const iconSvg = getIconForLink(link.title, link.url);
    const descriptionHtml = link.description 
      ? `<span class="link-description">${escapeHtml(link.description)}</span>` 
      : '';

    linkAnchor.innerHTML = `
      <div class="link-icon-bg">
        ${iconSvg}
      </div>
      <div class="link-info-container">
        <span class="link-title">${escapeHtml(link.title)}</span>
        ${descriptionHtml}
      </div>
      <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    linksContainer.appendChild(linkAnchor);
  });
}

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
}

/**
 * Append editing card for link items with title, description, and URL
 */
function appendLinkEditCard(container, link) {
  const card = document.createElement('div');
  card.className = 'link-edit-card';
  
  const linkDesc = link.description || '';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-link" aria-label="링크 삭제">&times;</button>
    <div class="form-group" style="margin-bottom: 8px;">
      <label class="form-label" style="font-size: 11px;">링크 이름</label>
      <input type="text" class="form-input edit-link-title" value="${escapeHtml(link.title)}" placeholder="예: 번아웃 리부트" required>
    </div>
    <div class="form-group" style="margin-bottom: 8px;">
      <label class="form-label" style="font-size: 11px;">링크 설명 (부제목)</label>
      <input type="text" class="form-input edit-link-description" value="${escapeHtml(linkDesc)}" placeholder="예: 프로그램 설명 적기">
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label" style="font-size: 11px;">연결 주소 (URL)</label>
      <input type="text" class="form-input edit-link-url" value="${escapeHtml(link.url)}" placeholder="예: https://..." required>
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
