// ====== Daily Korean Blog — Interactive Features v2 ======
(function(){
'use strict';

// ====== THEME ======
var html = document.documentElement;
function getTheme() {
    return localStorage.getItem('dk-theme') || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
}
function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('dk-theme', t);
}
if (!html.getAttribute('data-theme') || html.getAttribute('data-theme') === 'light') {
    setTheme(getTheme());
}

document.addEventListener('DOMContentLoaded', function() {

    // ====== THEME TOGGLE ======
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }

    // ====== HAMBURGER MENU ======
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var overlay = null;

    if (hamburger && navLinks) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function toggleMenu(open) {
            var isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('open');
            navLinks.classList.toggle('open', isOpen);
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            overlay.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        hamburger.addEventListener('click', function() { toggleMenu(); });
        overlay.addEventListener('click', function() { toggleMenu(false); });

        navLinks.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() { toggleMenu(false); });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) toggleMenu(false);
        });
    }

    // ====== CATEGORY FILTER ======
    var tabs = document.querySelectorAll('.tab');
    var cards = document.querySelectorAll('.post-card');
    var searchInput = document.getElementById('searchInput');
    var postsGrid = document.getElementById('postsGrid');
    var vocabGrid = document.getElementById('vocabGrid');
    var grammarGrid = document.getElementById('grammarGrid');

    var topicMap = {
        'writing': ['viết', 'writing', 'câu 51', 'câu 52', 'câu 53', 'câu 54', '✍'],
        'reading': ['đọc', 'reading', 'đọc hiểu', '📰'],
        'listening': ['nghe', 'listening', '🎧']
    };

    function getCategoriesForTopic(topic) {
        var t = (topic || '').toLowerCase();
        var cats = [];
        for (var cat in topicMap) {
            for (var i = 0; i < topicMap[cat].length; i++) {
                if (t.indexOf(topicMap[cat][i]) !== -1) { cats.push(cat); break; }
            }
        }
        if (cats.length === 0) cats.push('other');
        return cats;
    }

    cards.forEach(function(card) {
        var existing = (card.getAttribute('data-categories') || '').trim();
        if (!existing) {
            var topic = card.getAttribute('data-topic') || '';
            card.setAttribute('data-categories', getCategoriesForTopic(topic).join(' '));
        }
    });

    var activeCategory = 'all';
    var dedicatedSections = {};
    if (vocabGrid) dedicatedSections['vocab'] = vocabGrid;
    if (grammarGrid) dedicatedSections['grammar'] = grammarGrid;

    function filterPosts() {
        if (dedicatedSections[activeCategory]) {
            if (postsGrid) postsGrid.style.display = 'none';
            if (vocabGrid) vocabGrid.style.display = 'none';
            if (grammarGrid) grammarGrid.style.display = 'none';
            dedicatedSections[activeCategory].style.display = '';
            return;
        }
        if (postsGrid) postsGrid.style.display = '';
        if (vocabGrid) vocabGrid.style.display = 'none';
        if (grammarGrid) grammarGrid.style.display = 'none';

        var searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        var visible = 0;

        cards.forEach(function(card) {
            var cats = (card.getAttribute('data-categories') || '').split(' ');
            var matchCat = activeCategory === 'all' || cats.indexOf(activeCategory) !== -1;
            var h3 = card.querySelector('h3');
            var title = h3 ? h3.textContent.toLowerCase() : '';
            var topic = (card.getAttribute('data-topic') || '').toLowerCase();
            var matchSearch = !searchTerm || title.indexOf(searchTerm) !== -1 || topic.indexOf(searchTerm) !== -1;

            if (matchCat && matchSearch) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        var existing = document.querySelector('.no-results');
        if (existing) existing.remove();

        if (visible === 0 && postsGrid) {
            var msg = document.createElement('div');
            msg.className = 'no-results';
            msg.textContent = 'Không tìm thấy bài học phù hợp.';
            postsGrid.appendChild(msg);
        }
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            activeCategory = this.getAttribute('data-category');
            filterPosts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }

    // ====== BACK TO TOP ======
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, {passive: true});
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ====== READING PROGRESS ======
    var progressBar = document.getElementById('readingProgress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            var height = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (height > 0 ? (window.scrollY / height) * 100 : 0) + '%';
        }, {passive: true});
    }

    // ====== SMOOTH SCROLL ======
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var id = this.getAttribute('href').slice(1);
            var el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ====== NAVBAR SCROLL EFFECT ======
    var navbar = document.getElementById('navbar') || document.querySelector('.post-navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'none';
        }, {passive: true});
    }

    // ====== INTERSECTION OBSERVER ANIMATION ======
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.post-card, .vocab-card, .grammar-card, .course-card, .feature-item, .roadmap-step').forEach(function(el) {
            el.classList.add('animate-in');
            observer.observe(el);
        });
    }

    // ====== LESSON PROGRESS TRACKING ======
    var path = window.location.pathname;
    if (path.match(/\/(curriculum|topik2|topik-ii|topik-advanced|eps-topik|conversation)\/[A-Z0-9]+-\d+\.html/)) {
        try {
            var visited = JSON.parse(localStorage.getItem('dk-visited') || '{}');
            visited[path] = Date.now();
            localStorage.setItem('dk-visited', JSON.stringify(visited));
        } catch(e) {}
    }

    // Show visited indicators
    function updateProgressIndicators() {
        try {
            var visited = JSON.parse(localStorage.getItem('dk-visited') || '{}');
            document.querySelectorAll('a[href]').forEach(function(a) {
                var href = a.getAttribute('href');
                if (href && !href.startsWith('http')) {
                    var normalized = '/' + href.replace(/^\.\.\//, '').replace(/^\//, '');
                    if (visited[normalized]) {
                        a.classList.add('lesson-visited');
                    }
                }
            });
        } catch(e) {}
    }
    updateProgressIndicators();

});

// Global filter function
function filterByCategory(category) {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        if (tab.getAttribute('data-category') === category) { tab.click(); }
    });
    var target = document.getElementById('lessons');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}
})();
