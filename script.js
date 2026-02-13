// ====== Daily Korean Blog — Interactive Features ======
document.addEventListener('DOMContentLoaded', function() {
    // ====== CATEGORY FILTER ======
    var tabs = document.querySelectorAll('.tab');
    var cards = document.querySelectorAll('.post-card');
    var searchInput = document.getElementById('searchInput');
    var postsGrid = document.getElementById('postsGrid');

    var topicMap = {
        'vocab': ['từ vựng', 'word of day', 'vocab', '📖'],
        'grammar': ['ngữ pháp', 'grammar', 'so sánh', '📐'],
        'writing': ['viết', 'writing', 'câu 51', 'câu 52', 'câu 53', 'câu 54', '✍'],
        'reading': ['đọc', 'reading', 'đọc hiểu', '📰'],
        'listening': ['nghe', 'listening', '🎧']
    };

    function getCategoryForTopic(topic) {
        var t = (topic || '').toLowerCase();
        for (var cat in topicMap) {
            var keywords = topicMap[cat];
            for (var i = 0; i < keywords.length; i++) {
                if (t.indexOf(keywords[i]) !== -1) return cat;
            }
        }
        return 'other';
    }

    // Assign categories
    cards.forEach(function(card) {
        var topic = card.getAttribute('data-topic') || '';
        card.setAttribute('data-category', getCategoryForTopic(topic));
    });

    var activeCategory = 'all';

    function filterPosts() {
        var searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        var visible = 0;

        cards.forEach(function(card) {
            var matchCat = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
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
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ====== READING PROGRESS ======
    var progressBar = document.getElementById('readingProgress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            var height = document.documentElement.scrollHeight - window.innerHeight;
            var progress = height > 0 ? (window.scrollY / height) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
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
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
});

// Global filter function (for footer links)
function filterByCategory(category) {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
        if (tab.getAttribute('data-category') === category) {
            tab.click();
        }
    });
    var target = document.getElementById('lessons');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}
