// VIEL ACADEMY - Main Application Logic
// Features: Course Filters, Dynamic Enrollment Modal, Video/Material Upload System, Teacher Authentication, Gemini AI Tutor, Video Player

document.addEventListener('DOMContentLoaded', () => {
  initTeacherAuth();
  initCourses();
  initEnrollmentModal();
  initStudyMaterialPortal();
  initGeminiAssistant();
  initVideoPlayerModal();
  init3DCardTilt();
  initMobileMenu();
});

/* -------------------------------------------------------------
   0. TEACHER / FACULTY AUTHENTICATION SYSTEM
------------------------------------------------------------- */
const facultyAccounts = [
  { email: 'science@vielacademy.com', pass: 'viel123', name: 'Prof. R. K. Sharma', dept: 'Science Stream (PCM/PCB)' },
  { email: 'commerce@vielacademy.com', pass: 'viel123', name: 'CA Manoj Gupta', dept: 'Commerce & Accountancy' },
  { email: 'arts@vielacademy.com', pass: 'viel123', name: 'Dr. Ananya Verma', dept: 'Humanities & Social Sciences' },
  { email: 'english@vielacademy.com', pass: 'viel123', name: 'Dr. Priya Kapoor', dept: 'Spoken English & Fluency' },
  { email: 'teacher@vielacademy.com', pass: 'viel123', name: 'Prof. R. K. Sharma', dept: 'Viel Academy Faculty' }
];

window.getLoggedInTeacher = function () {
  try {
    const raw = localStorage.getItem('viel_auth_teacher');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

function initTeacherAuth() {
  const loginForm = document.getElementById('teacher-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('teacher-login-email').value.trim().toLowerCase();
      const pass = document.getElementById('teacher-login-password').value.trim();

      // Check matched account or allow academy domain
      let matched = facultyAccounts.find(acc => acc.email.toLowerCase() === email && acc.pass === pass);

      if (!matched) {
        // Fallback for custom teacher email with viel123 or any password >= 4 chars
        if (email.includes('@vielacademy.com') || email.includes('@viel') || pass === 'viel123') {
          const derivedName = email.split('@')[0].replace('.', ' ');
          const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
          matched = {
            email,
            name: `Faculty (${formattedName})`,
            dept: 'Academic Faculty'
          };
        }
      }

      if (matched) {
        localStorage.setItem('viel_auth_teacher', JSON.stringify(matched));
        closeTeacherLoginModal();
        updateTeacherAuthUI();
        showToast(`Welcome, ${matched.name}! Faculty access unlocked.`, 'success');

        // Automatically switch to upload view if user was on the study portal
        const studySec = document.getElementById('study-portal');
        if (studySec) {
          switchPortalTab('upload');
        }
      } else {
        showToast('Invalid Faculty credentials. Use demo accounts or password "viel123"', 'error');
      }
    });
  }

  updateTeacherAuthUI();
}

window.updateTeacherAuthUI = function () {
  const teacher = getLoggedInTeacher();
  const navContainer = document.getElementById('nav-teacher-auth');
  const mobileNavContainer = document.getElementById('mobile-nav-teacher-auth');
  const uploadTabText = document.getElementById('upload-tab-text');
  const uploadTabIcon = document.getElementById('upload-tab-icon');
  const uploadBadgeName = document.getElementById('upload-teacher-badge-name');
  const facultyInput = document.getElementById('upload-faculty');

  if (teacher) {
    // Logged in state for Desktop Nav
    if (navContainer) {
      navContainer.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <i class="fas fa-chalkboard-teacher text-amber-400"></i>
            <span class="max-w-[120px] truncate">${teacher.name}</span>
          </div>
          <button onclick="logoutTeacher()" title="Logout Faculty" class="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors text-xs">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      `;
    }

    // Logged in state for Mobile Nav
    if (mobileNavContainer) {
      mobileNavContainer.innerHTML = `
        <div class="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-user-check text-cyan-400"></i>
            <div class="text-xs">
              <span class="text-white font-bold block">${teacher.name}</span>
              <span class="text-[10px] text-cyan-400 block">${teacher.dept}</span>
            </div>
          </div>
          <button onclick="logoutTeacher()" class="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            Logout
          </button>
        </div>
      `;
    }

    // Update Upload Tab Label & Icon
    if (uploadTabText) uploadTabText.textContent = 'Upload Material / Video (Faculty Unlocked)';
    if (uploadTabIcon) {
      uploadTabIcon.className = 'fas fa-cloud-upload-alt text-amber-400';
    }

    // Update upload view banner & input
    if (uploadBadgeName) {
      uploadBadgeName.textContent = `${teacher.name} (${teacher.dept})`;
    }
    if (facultyInput) {
      facultyInput.value = teacher.name;
    }

  } else {
    // Logged out state
    if (navContainer) {
      navContainer.innerHTML = `
        <button onclick="openTeacherLoginModal()" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-500/40 flex items-center gap-2 transition-all shadow-md shadow-amber-950/30">
          <i class="fas fa-chalkboard-teacher"></i>
          <span class="hidden sm:inline">Teacher Login</span>
          <span class="sm:hidden">Faculty</span>
        </button>
      `;
    }

    if (mobileNavContainer) {
      mobileNavContainer.innerHTML = `
        <button onclick="openTeacherLoginModal()" class="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2">
          <i class="fas fa-chalkboard-teacher"></i>
          <span>Teacher / Faculty Login</span>
        </button>
      `;
    }

    if (uploadTabText) uploadTabText.textContent = 'Upload Material (Teacher Only)';
    if (uploadTabIcon) {
      uploadTabIcon.className = 'fas fa-lock text-amber-400';
    }
  }

  // Re-render materials to show/hide delete buttons
  if (typeof window.reRenderMaterials === 'function') {
    window.reRenderMaterials();
  }
};

window.logoutTeacher = function () {
  localStorage.removeItem('viel_auth_teacher');
  updateTeacherAuthUI();
  switchPortalTab('browse');
  showToast('Logged out of Teacher Portal.', 'info');
};

window.openTeacherLoginModal = function () {
  const modal = document.getElementById('teacher-login-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeTeacherLoginModal = function () {
  const modal = document.getElementById('teacher-login-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

window.fillTeacherLogin = function (email, pass) {
  const emailInput = document.getElementById('teacher-login-email');
  const passInput = document.getElementById('teacher-login-password');
  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = pass;
    showToast(`Loaded credentials for: ${email}`, 'info');
  }
};

window.togglePasswordVisibility = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="far fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="far fa-eye"></i>';
  }
};

/* -------------------------------------------------------------
   1. COURSES DATA & FILTERING
------------------------------------------------------------- */
const coursesData = [
  // Class 12 & 11 Streams
  {
    id: 'c12-science',
    category: 'class-12',
    title: 'Class 12th Science Stream',
    badge: 'Science / Medical / Engg',
    badgeClass: 'badge-science',
    icon: 'fa-atom',
    sections: ['Section A: PCM (Physics, Chemistry, Maths)', 'Section B: PCB (Physics, Chemistry, Biology - NEET)', 'Section C: PCMB (Dual Option)'],
    desc: 'Comprehensive board exam preparation with competitive foundation (JEE & NEET). 3D visual concept explanations, daily numerical practice, and full length mock tests.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science / IP', 'English Core'],
    mode: 'Offline & Online'
  },
  {
    id: 'c12-commerce',
    category: 'class-12',
    title: 'Class 12th Commerce Stream',
    badge: 'Commerce & Finance',
    badgeClass: 'badge-commerce',
    icon: 'fa-chart-line',
    sections: ['Section A: Commerce with Applied Mathematics', 'Section B: Commerce without Mathematics', 'Section C: CA Foundation & CUET Specialized'],
    desc: 'Master Accountancy, Economics, and Business Studies with practical real-world balance sheet analysis, case-study decoding, and CUET mock series.',
    subjects: ['Accountancy', 'Business Studies', 'Economics (Macro + IED)', 'Applied Maths / Core Maths', 'English Core'],
    mode: 'Offline & Online'
  },
  {
    id: 'c12-humanities',
    category: 'class-12',
    title: 'Class 12th Humanities (Arts)',
    badge: 'Humanities & Civil Services',
    badgeClass: 'badge-arts',
    icon: 'fa-landmark',
    sections: ['Section A: Civil Services & Law Foundation', 'Section B: CUET Arts & Social Sciences', 'Section C: Psychology & Creative Arts'],
    desc: 'Specialized answer writing techniques for board exams and CUET UG. In-depth analysis of Indian & World History, Political Theory, Geography, and Socio-Economics.',
    subjects: ['History', 'Political Science', 'Geography', 'Economics', 'Psychology', 'Sociology', 'English'],
    mode: 'Offline & Online'
  },
  {
    id: 'c11-streams',
    category: 'class-11',
    title: 'Class 11th All Streams (PCM / PCB / Commerce / Arts)',
    badge: 'Stream Transition & Foundation',
    badgeClass: 'badge-science',
    icon: 'fa-compass',
    sections: ['Science (PCM / PCB)', 'Commerce (Math / Non-Math)', 'Humanities (History, Pol Sci, Geo, Eco)'],
    desc: 'Bridge the leap between 10th and 11th. Strong conceptual base from Day 1 to ensure peak performance in 12th and competitive entrance exams.',
    subjects: ['Physics', 'Chemistry', 'Maths/Bio', 'Accounts', 'Economics', 'Pol Science', 'History'],
    mode: 'Offline & Online'
  },
  // Class 6 to 10
  {
    id: 'c10-board',
    category: 'class-6-10',
    title: 'Class 10th Board Target Batch',
    badge: 'Class 10th Board Booster',
    badgeClass: 'badge-science',
    icon: 'fa-graduation-cap',
    sections: ['CBSE & State Board Excellence', 'NTSE & Olympiad Advanced Section'],
    desc: '100% NCERT line-by-line coverage, sample papers, case-based questions, and previous 10-year question bank drills.',
    subjects: ['Science (Physics, Chem, Bio)', 'Mathematics (Standard & Basic)', 'Social Science', 'English', 'Hindi'],
    mode: 'Offline & Online'
  },
  {
    id: 'c9-foundation',
    category: 'class-6-10',
    title: 'Class 9th Foundation Batch',
    badge: 'Class 9th High School',
    badgeClass: 'badge-commerce',
    icon: 'fa-brain',
    sections: ['Core Academic Mastery', 'Mental Ability & Logical Reasoning'],
    desc: 'Build strong fundamentals in Science and Mathematics before stepping into 10th board year. Regular weekly unit tests.',
    subjects: ['Science', 'Mathematics', 'Social Science', 'English', 'Hindi'],
    mode: 'Offline & Online'
  },
  {
    id: 'c68-middle',
    category: 'class-6-10',
    title: 'Class 6th to 8th Junior Champions',
    badge: 'Class 6th, 7th & 8th',
    badgeClass: 'badge-arts',
    icon: 'fa-shapes',
    sections: ['Junior Science & Maths Lab', 'Language & Creative Writing Club'],
    desc: 'Nurturing curiosity, problem solving, homework assistance, and solid mathematical calculation speed through Vedic math tricks.',
    subjects: ['Mathematics', 'General Science', 'Social Studies', 'English Grammar', 'Hindi'],
    mode: 'Offline & Online'
  },
  // Competitive Exams
  {
    id: 'comp-exams',
    category: 'competitive',
    title: 'Target Competitive Exams Batch',
    badge: 'Govt. Job & University Entrances',
    badgeClass: 'badge-competitive',
    icon: 'fa-award',
    sections: ['SSC (CGL, CHSL, MTS, CPO, GD)', 'CUET (UG / PG Target)', 'Delhi Police & State Exams', 'NDA & Defence Wings', 'Banking & Railways'],
    desc: 'Comprehensive preparation with shortcut tricks for Quantitative Aptitude, Reasoning, General Knowledge, and English comprehension with daily speed tests.',
    subjects: ['Quantitative Aptitude', 'Reasoning & Mental Ability', 'General Studies (GS & GK)', 'English Comprehension', 'Current Affairs'],
    mode: 'Offline & Online'
  },
  // Spoken English
  {
    id: 'spoken-eng',
    category: 'spoken-english',
    title: 'Spoken English & Personality Development',
    badge: 'Fluency & Soft Skills',
    badgeClass: 'badge-english',
    icon: 'fa-comments',
    sections: ['Level 1: Basic Grammar & Everyday English', 'Level 2: Fluent Speaking & Accent Neutralization', 'Level 3: Public Speaking, GD & Job Interview Mastery'],
    desc: 'Overcome hesitation and speak English with confidence! Live interactive speaking sessions, vocabulary builder, daily conversations, and stage confidence training.',
    subjects: ['Spoken English Fluency', 'Practical Grammar', 'Vocabulary & Idioms', 'Group Discussions (GD)', 'Interview Skills & Body Language'],
    mode: 'Offline & Online'
  }
];

function initCourses() {
  const container = document.getElementById('courses-grid');
  const filterBtns = document.querySelectorAll('.course-filter-btn');
  if (!container) return;

  function render(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' 
      ? coursesData 
      : coursesData.filter(c => c.category === filter);

    filtered.forEach(course => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-6 flex flex-col justify-between card-3d border border-slate-700/60 relative overflow-hidden group';

      const sectionsHtml = course.sections.map(s => `
        <li class="flex items-start text-xs sm:text-sm text-slate-300 pop-3d-low">
          <i class="fas fa-check-circle text-cyan-400 mt-1 mr-2 text-xs"></i>
          <span>${s}</span>
        </li>
      `).join('');

      const subjectsHtml = course.subjects.slice(0, 4).map(sub => `
        <span class="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 pop-3d-low">${sub}</span>
      `).join('');

      card.innerHTML = `
        <div class="card-glare"></div>
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold px-3 py-1 rounded-full ${course.badgeClass} pop-3d-high shadow-md">${course.badge}</span>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-cyan-400 text-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors pop-3d-high shadow-lg">
              <i class="fas ${course.icon}"></i>
            </div>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors pop-3d-med">${course.title}</h3>
          <p class="text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed pop-3d-low">${course.desc}</p>
          
          <div class="mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 pop-3d-low">
            <span class="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Stream Sections / Tracks:</span>
            <ul class="space-y-1.5">
              ${sectionsHtml}
            </ul>
          </div>

          <div class="mb-4 pop-3d-low">
            <span class="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Key Subjects:</span>
            <div class="flex flex-wrap gap-1.5">
              ${subjectsHtml}
              ${course.subjects.length > 4 ? `<span class="text-[11px] px-2 py-1 text-slate-400">+${course.subjects.length - 4} more</span>` : ''}
            </div>
          </div>
        </div>

        <div class="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between pop-3d-med">
          <span class="text-xs text-amber-400 font-semibold"><i class="fas fa-chalkboard-teacher mr-1"></i> ${course.mode}</span>
          <button onclick="openEnrollModal('${course.title}')" class="px-4 py-2 rounded-xl text-xs font-bold glow-btn-cyan flex items-center gap-1.5 shadow-lg">
            <span>Enroll Now</span>
            <i class="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
      const cat = btn.getAttribute('data-filter');
      render(cat);
    });
  });

  render('all');
}

/* -------------------------------------------------------------
   2. DYNAMIC ENROLLMENT MODAL LOGIC
------------------------------------------------------------- */
const enrollModal = document.getElementById('enroll-modal');
const courseSelect = document.getElementById('enroll-course-select');
const streamSectionContainer = document.getElementById('enroll-stream-section-container');
const streamSectionSelect = document.getElementById('enroll-stream-section-select');

const streamOptionsMap = {
  'class-12-science': [
    'Section A: PCM (Physics + Chemistry + Maths + English)',
    'Section B: PCB (Physics + Chemistry + Biology + English - NEET Focus)',
    'Section C: PCMB (Physics + Chemistry + Maths + Biology)'
  ],
  'class-12-commerce': [
    'Section A: Commerce with Applied Mathematics',
    'Section B: Commerce without Mathematics (Core Commerce)',
    'Section C: CUET & CA Foundation Booster'
  ],
  'class-12-humanities': [
    'Section A: History + Political Science + Geography + English',
    'Section B: History + Political Science + Economics + English',
    'Section C: Psychology + Sociology + Pol Science + History (Civil Services Foundation)'
  ],
  'class-11-science': [
    'Section A: PCM (Physics, Chemistry, Maths)',
    'Section B: PCB (Physics, Chemistry, Biology)',
    'Section C: PCMB Comprehensive'
  ],
  'class-11-commerce': [
    'Section A: Commerce with Mathematics',
    'Section B: Commerce without Mathematics'
  ],
  'class-11-humanities': [
    'Humanities (Arts): History, Political Science, Geography, Economics'
  ],
  'class-10': [
    'Class 10th Board Target Batch (Science + Maths + SST + English)',
    'Class 10th Olympiad & Foundation Track'
  ],
  'class-9': [
    'Class 9th Foundation Batch (Science + Maths + SST + English)'
  ],
  'class-6-8': [
    'Class 8th All Subjects Foundation',
    'Class 7th All Subjects Foundation',
    'Class 6th All Subjects Foundation'
  ],
  'competitive': [
    'SSC Special Batch (CGL / CHSL / MTS / GD)',
    'CUET (UG / PG) Target Batch',
    'Delhi Police & Defence Exam Batch',
    'Banking & Railways Exam Special'
  ],
  'spoken-english': [
    'Spoken English & Personality Development (Beginner to Fluent)',
    'Advanced English & Job Interview Mastery'
  ]
};

function initEnrollmentModal() {
  if (!courseSelect) return;

  courseSelect.addEventListener('change', () => {
    const val = courseSelect.value;
    const options = streamOptionsMap[val];

    if (options && options.length > 0) {
      streamSectionContainer.classList.remove('hidden');
      streamSectionSelect.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    } else {
      streamSectionContainer.classList.add('hidden');
      streamSectionSelect.innerHTML = '<option value="General Batch">General Batch</option>';
    }
  });

  const form = document.getElementById('enroll-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('enroll-name').value.trim();
      const phone = document.getElementById('enroll-phone').value.trim();
      const courseText = courseSelect.options[courseSelect.selectedIndex]?.text || '';
      const sectionText = !streamSectionContainer.classList.contains('hidden') ? streamSectionSelect.value : 'General Stream';
      const mode = document.querySelector('input[name="batch_mode"]:checked')?.value || 'Offline (Ganga Vihar Center)';
      const message = document.getElementById('enroll-notes')?.value.trim() || 'Excited to join Viel Academy!';

      if (!name || !phone) {
        showToast('Please enter your Name and Phone Number!', 'error');
        return;
      }

      // Format WhatsApp message
      const text = `*NEW ENROLLMENT INQUIRY - VIEL ACADEMY*%0A%0A` +
        `👤 *Student Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contact Mobile:* ${encodeURIComponent(phone)}%0A` +
        `📚 *Course/Class:* ${encodeURIComponent(courseText)}%0A` +
        `🎯 *Selected Stream / Section:* ${encodeURIComponent(sectionText)}%0A` +
        `🏫 *Batch Mode:* ${encodeURIComponent(mode)}%0A` +
        `💬 *Message/Goal:* ${encodeURIComponent(message)}%0A%0A` +
        `_Sent from Viel Academy Official Website Portal_`;

      const whatsappUrl = `https://wa.me/917503036881?text=${text}`;

      // Show instant confirmation modal/toast
      showToast('Enrollment request submitted! Redirecting to WhatsApp for instant confirmation...', 'success');
      if (typeof window.trigger3DParticleBurst === 'function') {
        window.trigger3DParticleBurst();
      }
      
      closeEnrollModal();
      form.reset();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1200);
    });
  }
}

window.openEnrollModal = function (preselectTitle = '') {
  const modal = document.getElementById('enroll-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (preselectTitle && courseSelect) {
    if (preselectTitle.includes('Science') && preselectTitle.includes('12')) {
      courseSelect.value = 'class-12-science';
    } else if (preselectTitle.includes('Commerce') && preselectTitle.includes('12')) {
      courseSelect.value = 'class-12-commerce';
    } else if (preselectTitle.includes('Humanities') || preselectTitle.includes('Arts')) {
      courseSelect.value = 'class-12-humanities';
    } else if (preselectTitle.includes('11')) {
      courseSelect.value = 'class-11-science';
    } else if (preselectTitle.includes('10')) {
      courseSelect.value = 'class-10';
    } else if (preselectTitle.includes('Competitive')) {
      courseSelect.value = 'competitive';
    } else if (preselectTitle.includes('English')) {
      courseSelect.value = 'spoken-english';
    }
    courseSelect.dispatchEvent(new Event('change'));
  }
};

window.closeEnrollModal = function () {
  const modal = document.getElementById('enroll-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* -------------------------------------------------------------
   3. VIDEO & STUDY MATERIAL SECTION (UPLOAD & EXPLORE)
------------------------------------------------------------- */
const defaultMaterials = [
  {
    id: 1,
    type: 'video',
    title: 'Class 12th Physics: Electrostatics & Coulomb\'s Law Full Revision',
    category: 'Class 12 Science',
    subject: 'Physics',
    desc: 'Master the fundamental electrostatic forces, electric fields, and high-weightage board exam numerical problems.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed
    videoRealId: 'dQw4w9WgXcQ',
    author: 'Viel Academy Faculty',
    date: '2026-10-20'
  },
  {
    id: 2,
    type: 'pdf',
    title: 'Class 12th Commerce: Partnership Fundamentals Formula & Balance Sheet Cheat Sheet',
    category: 'Class 12 Commerce',
    subject: 'Accountancy',
    desc: 'Complete summary of Profit & Loss Appropriation, Goodwill Valuation, and Capital Account adjustments.',
    url: '#',
    author: 'Commerce Wing',
    date: '2026-10-22'
  },
  {
    id: 3,
    type: 'pdf',
    title: 'Class 12th Humanities: Political Science - Contemporary World Politics Mind Maps',
    category: 'Class 12 Humanities',
    subject: 'Political Science',
    desc: 'High-scoring visual mindmaps and 6-mark answer templates for Cold War era, UN system, and Globalisation.',
    url: '#',
    author: 'Humanities Cell',
    date: '2026-10-24'
  },
  {
    id: 4,
    type: 'video',
    title: 'Spoken English: 50 Daily Used Phrases & Hesitation Removal Techniques',
    category: 'Spoken English',
    subject: 'English Fluency',
    desc: 'Practical exercises to eliminate Hindi-to-English translation in mind and speak effortlessly in public and interviews.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoRealId: 'dQw4w9WgXcQ',
    author: 'Communication Coach',
    date: '2026-10-25'
  },
  {
    id: 5,
    type: 'video',
    title: 'Competitive Exams: Quantitative Aptitude Speed Math & Vedic Shortcuts',
    category: 'Competitive Exams',
    subject: 'Quant & Aptitude',
    desc: 'Solve 2-digit multiplications, squares, percentage fractions, and ratio problems in under 10 seconds for SSC & CUET.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoRealId: 'dQw4w9WgXcQ',
    author: 'Competitive Faculty',
    date: '2026-10-26'
  },
  {
    id: 6,
    type: 'pdf',
    title: 'Class 10th Science: Complete Chemical Reactions & Equations NCERT Booster',
    category: 'Class 10th',
    subject: 'Science',
    desc: 'Balanced chemical equations, redox reactions, indicators, and frequently asked Board PYQs with answers.',
    url: '#',
    author: 'Junior Science Team',
    date: '2026-10-26'
  }
];

function initStudyMaterialPortal() {
  const portalGrid = document.getElementById('materials-grid');
  const typeFilterBtns = document.querySelectorAll('.mat-type-filter');
  const classFilterSelect = document.getElementById('mat-class-filter');
  const uploadForm = document.getElementById('faculty-upload-form');

  // Load from LocalStorage or default
  let materials = JSON.parse(localStorage.getItem('viel_academy_materials'));
  if (!materials || materials.length === 0) {
    materials = defaultMaterials;
    localStorage.setItem('viel_academy_materials', JSON.stringify(materials));
  }

  let activeType = 'all';
  let activeClass = 'all';

  function renderMaterials() {
    if (!portalGrid) return;
    portalGrid.innerHTML = '';

    const list = materials.filter(item => {
      const matchType = activeType === 'all' || item.type === activeType;
      const matchClass = activeClass === 'all' || item.category === activeClass;
      return matchType && matchClass;
    });

    if (list.length === 0) {
      portalGrid.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <i class="fas fa-folder-open text-4xl mb-3 text-cyan-400/50"></i>
          <p class="text-base font-semibold">No materials found in this category.</p>
          <p class="text-xs text-slate-500 mt-1">Use the "Upload Material / Video" tab to add resources!</p>
        </div>
      `;
      return;
    }

    const teacher = getLoggedInTeacher();

    list.forEach(item => {
      const isVideo = item.type === 'video';
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all relative';
      
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${isVideo ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'} flex items-center gap-1.5">
              <i class="fas ${isVideo ? 'fa-play-circle' : 'fa-file-pdf'}"></i>
              ${isVideo ? 'Video Lecture' : 'PDF Study Notes'}
            </span>
            <span class="text-[11px] text-slate-400">${item.category}</span>
          </div>

          <h4 class="text-base font-bold text-white mb-2 leading-snug line-clamp-2">${item.title}</h4>
          <p class="text-xs text-slate-400 mb-4 line-clamp-2">${item.desc}</p>
        </div>

        <div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 py-2 border-t border-slate-800/80 mb-3">
            <span><i class="fas fa-book-open text-cyan-400 mr-1"></i> ${item.subject}</span>
            <span><i class="far fa-user text-amber-400 mr-1"></i> ${item.author || 'Viel Faculty'}</span>
          </div>

          ${isVideo ? `
            <button onclick="openVideoPlayer('${item.title}', '${item.url}')" class="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950/50">
              <i class="fas fa-play text-xs"></i>
              <span>Watch Video Lecture (Free)</span>
            </button>
          ` : `
            <button onclick="downloadStudyMaterial('${item.title}')" class="w-full py-2.5 rounded-xl text-xs font-bold glow-btn-cyan flex items-center justify-center gap-2">
              <i class="fas fa-download text-xs"></i>
              <span>Download PDF Notes</span>
            </button>
          `}

          ${teacher ? `
            <div class="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span class="text-[10px] text-emerald-400 font-semibold"><i class="fas fa-check-circle mr-1"></i> Faculty Verified</span>
              <button onclick="deleteStudyMaterial(${item.id})" class="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors">
                <i class="fas fa-trash-alt text-[10px]"></i>
                <span>Remove</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
      portalGrid.appendChild(card);
    });
  }

  // Assign global re-render function
  window.reRenderMaterials = renderMaterials;

  // Global Delete Material Handler (for Teachers only)
  window.deleteStudyMaterial = function (id) {
    const currentTeacher = getLoggedInTeacher();
    if (!currentTeacher) {
      showToast('Only authenticated teachers can remove materials.', 'error');
      return;
    }
    if (confirm('Are you sure you want to remove this study resource from Viel Academy?')) {
      materials = materials.filter(m => m.id !== id);
      localStorage.setItem('viel_academy_materials', JSON.stringify(materials));
      showToast('Resource removed successfully.', 'info');
      renderMaterials();
    }
  };

  // Filter Buttons
  typeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeFilterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
      activeType = btn.getAttribute('data-type');
      renderMaterials();
    });
  });

  if (classFilterSelect) {
    classFilterSelect.addEventListener('change', (e) => {
      activeClass = e.target.value;
      renderMaterials();
    });
  }

  // Upload Form Handler (Teacher / Admin Only)
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const activeTeacher = getLoggedInTeacher();
      if (!activeTeacher) {
        showToast('Access Denied: Teacher login required to publish materials!', 'error');
        openTeacherLoginModal();
        return;
      }

      const title = document.getElementById('upload-title').value.trim();
      const type = document.getElementById('upload-type').value;
      const category = document.getElementById('upload-category').value;
      const subject = document.getElementById('upload-subject').value.trim();
      const url = document.getElementById('upload-url').value.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const desc = document.getElementById('upload-desc').value.trim();
      const faculty = document.getElementById('upload-faculty').value.trim() || activeTeacher.name;

      if (!title || !subject) {
        showToast('Please fill all required upload fields', 'error');
        return;
      }

      // Convert normal YouTube watch link to embed format if needed
      let formattedUrl = url;
      if (type === 'video' && url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1]?.split('&')[0];
        if (videoId) formattedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (type === 'video' && url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) formattedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      const newMaterial = {
        id: Date.now(),
        type,
        title,
        category,
        subject,
        url: formattedUrl,
        desc,
        author: faculty,
        date: new Date().toISOString().split('T')[0]
      };

      materials.unshift(newMaterial);
      localStorage.setItem('viel_academy_materials', JSON.stringify(materials));

      showToast(`Successfully published "${title}" as ${activeTeacher.name}!`, 'success');
      uploadForm.reset();

      // Pre-fill faculty name again
      document.getElementById('upload-faculty').value = activeTeacher.name;

      // Switch back to browse view
      switchPortalTab('browse');
      renderMaterials();
    });
  }

  renderMaterials();
}

// Portal Tab Switching (Browse vs Upload with Teacher Authentication Check)
window.switchPortalTab = function (tabName) {
  const browseView = document.getElementById('portal-browse-view');
  const uploadView = document.getElementById('portal-upload-view');
  const lockView = document.getElementById('portal-teacher-lock-view');
  const tabBrowseBtn = document.getElementById('tab-btn-browse');
  const tabUploadBtn = document.getElementById('tab-btn-upload');

  if (tabName === 'browse') {
    if (browseView) browseView.classList.remove('hidden');
    if (uploadView) uploadView.classList.add('hidden');
    if (lockView) lockView.classList.add('hidden');

    if (tabBrowseBtn) {
      tabBrowseBtn.classList.add('border-cyan-400', 'text-cyan-400');
      tabBrowseBtn.classList.remove('border-transparent', 'text-slate-400');
    }
    if (tabUploadBtn) {
      tabUploadBtn.classList.remove('border-amber-400', 'text-amber-400');
      tabUploadBtn.classList.add('border-transparent', 'text-slate-400');
    }
  } else {
    // Check if Teacher is logged in
    const teacher = getLoggedInTeacher();

    if (browseView) browseView.classList.add('hidden');

    if (tabUploadBtn) {
      tabUploadBtn.classList.add('border-amber-400', 'text-amber-400');
      tabUploadBtn.classList.remove('border-transparent', 'text-slate-400');
    }
    if (tabBrowseBtn) {
      tabBrowseBtn.classList.remove('border-cyan-400', 'text-cyan-400');
      tabBrowseBtn.classList.add('border-transparent', 'text-slate-400');
    }

    if (teacher) {
      // Unlocked: Show upload form
      if (lockView) lockView.classList.add('hidden');
      if (uploadView) uploadView.classList.remove('hidden');

      const uploadBadge = document.getElementById('upload-teacher-badge-name');
      const facultyInput = document.getElementById('upload-faculty');
      if (uploadBadge) uploadBadge.textContent = `${teacher.name} (${teacher.dept})`;
      if (facultyInput) facultyInput.value = teacher.name;
    } else {
      // Locked: Show Teacher Auth Lock Card
      if (uploadView) uploadView.classList.add('hidden');
      if (lockView) lockView.classList.remove('hidden');
      showToast('Faculty login required to upload study material & lectures.', 'info');
    }
  }
};

window.downloadStudyMaterial = function (title) {
  showToast(`Preparing free PDF download: "${title}"...`, 'success');
  // Generate downloadable text notes blob
  const textContent = `VIEL ACADEMY - STUDY MATERIAL & REVISION NOTES\n` +
    `Motto: Let the Dream Big...\n` +
    `Title: ${title}\n` +
    `Address: C-39, Street No. 2, Ganga Vihar, Gokalpuri, North East Delhi - 110094\n` +
    `Contact: 7503036881, 9599231387 | vielacademy@gmail.com\n\n` +
    `All these classes and revision resources are free for our subscribers and learners.\n` +
    `------------------------------------------------------------------------\n` +
    `Key Focus Concepts:\n` +
    `- Concept 1: Theoretical definitions and core principles\n` +
    `- Concept 2: High scoring answer templates and step-by-step solutions\n` +
    `- Concept 3: Important NCERT & Previous 10-Year Board Questions\n` +
    `- Concept 4: Practical tips and memory shortcuts\n\n` +
    `Join our offline/online batches today!`;

  const blob = new Blob([textContent], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_VielAcademy.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/* -------------------------------------------------------------
   4. VIDEO PLAYER MODAL
------------------------------------------------------------- */
function initVideoPlayerModal() {
  const modal = document.getElementById('video-player-modal');
  if (!modal) return;
}

window.openVideoPlayer = function (title, embedUrl) {
  const modal = document.getElementById('video-player-modal');
  const iframe = document.getElementById('video-iframe');
  const titleEl = document.getElementById('video-player-title');
  if (!modal || !iframe) return;

  titleEl.textContent = title;
  iframe.src = embedUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeVideoPlayer = function () {
  const modal = document.getElementById('video-player-modal');
  const iframe = document.getElementById('video-iframe');
  if (!modal || !iframe) return;

  iframe.src = '';
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* -------------------------------------------------------------
   5. GEMINI AI STUDY BUDDY / TUTOR ASSISTANT
------------------------------------------------------------- */
const knowledgeBase = {
  'science': "In Class 12 Science (PCM/PCB), key high-scoring chapters include Electrostatics, Magnetism, Optics in Physics; Coordination Compounds and Organic Reaction Mechanisms in Chemistry; and Calculus & Probability in Maths. At Viel Academy, our batch mentors emphasize NCERT line-by-line questions and 3D visual problem-solving.",
  'commerce': "In Class 12 Commerce, focus heavily on Accounting for Partnership Firms, Share Capital, Cash Flow Statements, and Macroeconomics (National Income & Money-Banking). Our teachers provide real balance sheet walkthroughs and CUET mocks to ensure 100/100 readiness.",
  'arts': "In Class 12 Humanities, master structured 6-marker and 8-marker answer formats for History (Harappan civilization, Bhakti-Sufi traditions, Mahatma Gandhi era) and Political Science (Cold War era, Contemporary South Asia, Democratic Upsurge). Viel Academy trains students with Civil Services foundation insights.",
  'competitive': "For Competitive exams (SSC, CUET, NDA, Delhi Police, CTET), speed math and shortcut elimination techniques are key. Master percentages, ratio proportions, syllogisms, and daily current affairs. Viel Academy provides weekly speed test rankings.",
  'spoken': "To master Spoken English: 1) Stop translating from your native language to English in your head. 2) Practice shadow speaking (listen and repeat). 3) Speak aloud 15 minutes daily. Viel Academy conducts live interactive speaking batches with GD and interview prep."
};

function initGeminiAssistant() {
  const chatForm = document.getElementById('gemini-chat-form');
  const chatInput = document.getElementById('gemini-chat-input');
  const chatMessages = document.getElementById('gemini-messages-container');
  const apiKeyInput = document.getElementById('gemini-api-key-input');

  if (!chatForm || !chatInput || !chatMessages) return;

  // Load saved API key if any
  const savedKey = localStorage.getItem('viel_gemini_api_key');
  if (savedKey && apiKeyInput) {
    apiKeyInput.value = savedKey;
  }

  if (apiKeyInput) {
    apiKeyInput.addEventListener('change', () => {
      localStorage.setItem('viel_gemini_api_key', apiKeyInput.value.trim());
      showToast('Gemini API Key updated for real-time AI responses!', 'success');
    });
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    // Append user message
    appendMessage('user', query);
    chatInput.value = '';

    // Trigger 3D AI Core pulse
    if (typeof window.trigger3DParticleBurst === 'function') {
      window.trigger3DParticleBurst();
    }

    // Show AI typing placeholder
    const typingIndicator = appendTypingIndicator();
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const customApiKey = apiKeyInput?.value.trim() || localStorage.getItem('viel_gemini_api_key');

    if (customApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${customApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are the official Gemini AI Study Companion for VIEL ACADEMY (Motto: "Let the Dream Big..."). Viel Academy provides expert coaching for Class 6th to 12th (Science PCM/PCB, Commerce, Humanities Arts), Competitive Exams (SSC, CUET, NDA, Police), and Spoken English in Ganga Vihar, Delhi. Answer this student inquiry clearly, encouragingly, and academically:\n\n${query}`
              }]
            }]
          })
        });

        const data = await response.json();
        typingIndicator.remove();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          const aiText = data.candidates[0].content.parts[0].text;
          appendMessage('ai', aiText);
        } else {
          throw new Error('Could not parse Gemini API response');
        }
      } catch (err) {
        typingIndicator.remove();
        console.warn('API call failed or quota reached, falling back to smart educational engine:', err);
        generateSmartLocalAnswer(query);
      }
    } else {
      setTimeout(() => {
        typingIndicator.remove();
        generateSmartLocalAnswer(query);
      }, 700);
    }
  });

  function generateSmartLocalAnswer(q) {
    const lower = q.toLowerCase();
    let reply = "";

    if (lower.includes('science') || lower.includes('physics') || lower.includes('chemistry') || lower.includes('math') || lower.includes('biology')) {
      reply = `🔬 **Viel Academy Science Mentor:**\n${knowledgeBase.science}\n\n💡 *Tip for "${q}":* Always write formula steps and draw neat ray/circuit diagrams for full CBSE board marks. You can join our Science Batch offline at Ganga Vihar or via live online classes!`;
    } else if (lower.includes('commerce') || lower.includes('account') || lower.includes('economics') || lower.includes('business')) {
      reply = `📊 **Viel Academy Commerce Mentor:**\n${knowledgeBase.commerce}\n\n💡 *Tip for "${q}":* In Accountancy, keep journal narrations crisp and remember working notes carry 30% of the total question marks!`;
    } else if (lower.includes('arts') || lower.includes('humanities') || lower.includes('history') || lower.includes('political') || lower.includes('pol science')) {
      reply = `🏛️ **Viel Academy Humanities Mentor:**\n${knowledgeBase.arts}\n\n💡 *Tip for "${q}":* Use bullet points with bold sub-headings and map work to guarantee 95%+ in Arts stream!`;
    } else if (lower.includes('spoken') || lower.includes('english') || lower.includes('fluent') || lower.includes('hesitation') || lower.includes('speak')) {
      reply = `🗣️ **Viel Academy English Coach:**\n${knowledgeBase.spoken}\n\n💡 *Tip:* Join our Spoken English Evening Practice sessions where every student gets stage speaking time!`;
    } else if (lower.includes('ssc') || lower.includes('cuet') || lower.includes('competitive') || lower.includes('police') || lower.includes('nda')) {
      reply = `🏆 **Viel Academy Competitive Wing:**\n${knowledgeBase.competitive}\n\n💡 *Pro-Tip:* Target 80% accuracy in Quantitative Aptitude by mastering 1-30 tables and square roots!`;
    } else if (lower.includes('address') || lower.includes('contact') || lower.includes('phone') || lower.includes('location') || lower.includes('fees')) {
      reply = `📍 **Viel Academy Centre Details:**\n- **Address:** C-39, Street No. 2, Ganga Vihar, Gokalpuri, North East Delhi - 110094, India.\n- **Call / WhatsApp:** 7503036881, 9599231387\n- **Email:** vielacademy@gmail.com\n- **Note:** All YouTube classes are 100% FREE for subscribers & curious learners!`;
    } else {
      reply = `✨ **Viel Academy Gemini AI Assistant:**\nThank you for asking! At Viel Academy, "Let the Dream Big..." is our promise. For ${q}, our mentors provide dedicated concept clarity, free video lectures, and personalized doubt sessions.\n\nWould you like to enroll in our Offline Batch at Ganga Vihar or join our interactive Online Live Batch? Click the 'Enroll Now' button above!`;
    }

    appendMessage('ai', reply);
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;

    // Simple markdown formatting for bold and bullets
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    msgDiv.innerHTML = `
      <div class="max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
        sender === 'user'
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-br-none shadow-md'
          : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-lg'
      }">
        ${sender === 'ai' ? '<div class="flex items-center gap-1.5 text-cyan-400 font-bold mb-1 text-[11px]"><i class="fas fa-sparkles"></i> <span>Gemini Study Tutor</span></div>' : ''}
        ${formattedText}
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start mb-3';
    typingDiv.innerHTML = `
      <div class="bg-slate-800/80 text-slate-400 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 border border-slate-700/60">
        <i class="fas fa-circle-notch fa-spin text-cyan-400"></i>
        <span>Gemini is thinking & formulating answer...</span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    return typingDiv;
  }
}

window.askGeminiPrompt = function (text) {
  const input = document.getElementById('gemini-chat-input');
  const form = document.getElementById('gemini-chat-form');
  if (input && form) {
    input.value = text;
    form.dispatchEvent(new Event('submit'));
    // Smooth scroll to chat if needed
    document.getElementById('gemini-section')?.scrollIntoView({ behavior: 'smooth' });
  }
};

/* -------------------------------------------------------------
   6. 3D CARD TILT & SPECULAR GLARE EFFECT
------------------------------------------------------------- */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.card-3d, .glass-card');
  cards.forEach(card => {
    // Inject glare element if missing
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`;
        glare.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

/* -------------------------------------------------------------
   7. MOBILE MENU TOGGLE
------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
}

/* -------------------------------------------------------------
   8. TOAST NOTIFICATION UTILITY
------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' 
    ? 'bg-emerald-600/90 border-emerald-400 text-white' 
    : type === 'error'
    ? 'bg-rose-600/90 border-rose-400 text-white'
    : 'bg-cyan-600/90 border-cyan-400 text-white';

  toast.className = `${bgClass} backdrop-blur-md px-4 py-3 rounded-xl border shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 transform translate-y-3 transition-all duration-300`;
  
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fas ${icon} text-base"></i><span>${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3');
    toast.classList.add('translate-y-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}
