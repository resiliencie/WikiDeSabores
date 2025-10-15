/* ======================================================= */
/* ====== WIKI SABORES SOROCABA - SCRIPT V2.1 ====== */
/* ======================================================= */

const App = {
  state: {
    favorites: [],
    ratings: [],
    currentFilter: 'todos',
    searchQuery: '',
    currentTheme: 'light'
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.loadState();
      this.theme.apply();
      
      this.setupEventListeners();

      this.favorites.syncButtons();
      this.favorites.renderSection();

      this.status.checkAll();
      setInterval(() => this.status.checkAll(), 60000);

      this.ratings.setup();
      this.lazyLoader.setup();
      this.updateCardVisibility();
    });
  },

  loadState() {
    this.state.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    this.state.ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    this.state.currentTheme = localStorage.getItem('theme') || 'light';
  },

  saveState() {
    localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
    localStorage.setItem('ratings', JSON.stringify(this.state.ratings));
    localStorage.setItem('theme', this.state.currentTheme);
  },
  
  setupEventListeners() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target.closest('.favorite')) this.favorites.toggle(target.closest('.favorite'));
      if (target.closest('.details-btn')) this.modal.open(target.closest('.details-btn'));
      if (target.closest('.main-nav a')) this.ui.smoothScroll(event, target.closest('.main-nav a'));
      if (target.closest('.copy-btn')) this.modal.copyInfo(target.closest('.copy-btn'));
    });

    window.addEventListener('scroll', this.ui.handleHeaderScroll);
    window.addEventListener('scroll', this.ui.handleBackToTopScroll);
    document.getElementById('back-to-top').addEventListener('click', this.ui.handleBackToTopClick);
    
    document.getElementById('search').addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase().trim();
      this.updateCardVisibility();
    });

    document.getElementById('filter-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        this.state.currentFilter = e.target.dataset.category;
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        this.updateCardVisibility();
      }
    });

    document.getElementById('sort-favorites-btn').addEventListener('click', () => this.favorites.sortByName());
    document.getElementById('clear-favorites-btn').addEventListener('click', () => this.favorites.clearAll());
    document.getElementById('theme-toggle-btn').addEventListener('click', () => this.theme.toggle());
    document.getElementById('suggester-btn').addEventListener('click', () => this.suggester.pickRandom());
  },

  updateCardVisibility() {
    document.querySelectorAll('.card-container .card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const specialties = card.querySelector('.card-meta').textContent.toLowerCase();
      const cardText = `${title} ${description} ${specialties}`;

      const categoryMatch = this.state.currentFilter === 'todos' || cardText.includes(this.state.currentFilter);
      const searchMatch = cardText.includes(this.state.searchQuery);

      card.style.display = (categoryMatch && searchMatch) ? '' : 'none';
    });
  },

  favorites: {
    toggle(button) {
      const cardId = button.closest('.card').querySelector('h3').id;
      const index = App.state.favorites.indexOf(cardId);
      if (index > -1) App.state.favorites.splice(index, 1);
      else App.state.favorites.push(cardId);
      App.saveState();
      this.syncButtons();
      this.renderSection();
    },
    syncButtons() {
      document.querySelectorAll('.favorite').forEach(btn => {
        const cardId = btn.closest('.card').querySelector('h3').id;
        btn.classList.toggle('active', App.state.favorites.includes(cardId));
      });
    },
    renderSection() {
      const container = document.getElementById('favoritos-container');
      container.innerHTML = '';
      if (App.state.favorites.length === 0) {
        container.innerHTML = '<p class="no-favorites-message">Você ainda não favoritou nenhum lugar. Clique no ♥ para adicionar.</p>';
        return;
      }
      App.state.favorites.forEach(favId => {
        const originalCard = document.querySelector(`#${favId}`)?.closest('.card');
        if (originalCard) {
          const clonedCard = originalCard.cloneNode(true);
          clonedCard.classList.add('visible');
          container.appendChild(clonedCard);
        }
      });
    },
    sortByName() {
      App.state.favorites = App.state.favorites
        .map(id => ({ id, title: document.getElementById(id)?.textContent || '' }))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(item => item.id);
      App.saveState();
      this.renderSection();
    },
    clearAll() {
      if (confirm('Tem certeza que deseja limpar todos os seus favoritos?')) {
        App.state.favorites = [];
        App.saveState();
        this.syncButtons();
        this.renderSection();
      }
    }
  },

  status: {
    checkAll() {
      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
      document.querySelectorAll('.card').forEach(card => {
        const statusDiv = card.querySelector('.status-icone');
        if (!statusDiv) return;
        const abreStr = statusDiv.dataset.abre, fechaStr = statusDiv.dataset.fecha;
        const abreMinutes = parseInt(abreStr.split(':')[0]) * 60 + parseInt(abreStr.split(':')[1] || 0);
        let fechaMinutes = parseInt(fechaStr.split(':')[0]) * 60 + parseInt(fechaStr.split(':')[1] || 0);
        if (fechaMinutes < abreMinutes) fechaMinutes += 24 * 60;
        let currentMinutesAdjusted = currentTotalMinutes;
        if (currentTotalMinutes < abreMinutes && (fechaMinutes - (24 * 60) > currentTotalMinutes)) {
            currentMinutesAdjusted += 24 * 60;
        }
        const isOpen = currentMinutesAdjusted >= abreMinutes && currentMinutesAdjusted < fechaMinutes;
        const minutesUntilClose = fechaMinutes - currentMinutesAdjusted;
        const isClosingSoon = isOpen && minutesUntilClose <= 60;
        const statusText = card.querySelector('.status');
        statusText.classList.remove('closing-soon');
        if (isClosingSoon) {
          statusText.textContent = `Fecha em ${minutesUntilClose} min`;
          statusText.classList.add('closing-soon');
        } else {
          statusText.textContent = isOpen ? 'Aberto' : 'Fechado';
        }
        [card.querySelector('.status-dot'), card.querySelector('.status-dot-inline')].forEach(dot => {
          if (dot) {
            dot.classList.toggle('open', isOpen);
            dot.classList.toggle('closed', !isOpen);
          }
        });
      });
    }
  },

  ratings: {
    setup() {
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.addEventListener('click', () => this.handleClick(star, stars)));
      this.updateDisplay();
    },
    handleClick(clickedStar, allStars) {
      const value = parseInt(clickedStar.dataset.value);
      App.state.ratings.push(value);
      App.saveState();
      this.updateDisplay();
      allStars.forEach(s => s.classList.remove('active'));
      clickedStar.classList.add('active');
    },
    updateDisplay() {
      const total = App.state.ratings.length, sum = App.state.ratings.reduce((a, v) => a + v, 0);
      const average = total ? (sum / total).toFixed(1) : 0;
      document.getElementById('average').textContent = average;
      document.getElementById('total').textContent = total;
    }
  },

  modal: {
    open(button) {
      const card = button.closest('.card');
      const modalOverlay = document.getElementById('details-modal');
      document.getElementById('modal-img').src = card.querySelector('img').src;
      document.getElementById('modal-title').textContent = card.querySelector('h3').textContent;
      document.getElementById('modal-description').textContent = card.querySelector('p').textContent;
      document.getElementById('modal-specialties').textContent = card.querySelector('.card-meta').textContent;
      document.getElementById('modal-address').textContent = `Endereço: ${button.dataset.address || 'Não informado'}`;
      document.getElementById('modal-phone').textContent = `Telefone: ${button.dataset.phone || 'Não informado'}`;
      const link = card.querySelector('.card-link'), modalLink = document.getElementById('modal-link');
      if (link) {
        modalLink.href = link.href;
        modalLink.style.display = 'inline-block';
      } else {
        modalLink.style.display = 'none';
      }
      modalOverlay.classList.add('active');
      document.getElementById('modal-close-btn').addEventListener('click', this.close, { once: true });
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.close();
      }, { once: true });
    },
    close() {
      document.getElementById('details-modal').classList.remove('active');
    },
    copyInfo(button) {
        const type = button.dataset.copy;
        const addressText = document.getElementById('modal-address').textContent.replace('Endereço: ', '');
        const phoneText = document.getElementById('modal-phone').textContent.replace('Telefone: ', '');
        const textToCopy = type === 'address' ? addressText : phoneText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copiado!';
            setTimeout(() => { button.textContent = originalText; }, 2000);
        }).catch(err => console.error('Erro ao copiar:', err));
    }
  },

  lazyLoader: {
    setup() {
      const cards = document.querySelectorAll('.card');
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -100px 0px' });
      cards.forEach(card => observer.observe(card));
    }
  },
  
  theme: {
    toggle() {
        App.state.currentTheme = App.state.currentTheme === 'light' ? 'dark' : 'light';
        App.saveState();
        this.apply();
    },
    apply() {
        if (App.state.currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle-btn').textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            document.getElementById('theme-toggle-btn').textContent = '🌙';
        }
    }
  },

  suggester: {
    pickRandom() {
        const visibleCards = [...document.querySelectorAll('.card-container .card')]
            .filter(card => card.style.display !== 'none');
            
        if (visibleCards.length === 0) {
            alert('Nenhum local encontrado para sugerir com os filtros atuais!');
            return;
        }

        document.querySelectorAll('.card.highlighted').forEach(c => c.classList.remove('highlighted'));

        const randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
        randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => randomCard.classList.add('highlighted'), 500);
    }
  },

  ui: {
    handleHeaderScroll() {
      document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 50);
    },
    handleBackToTopScroll() {
      document.getElementById('back-to-top').style.display = (window.scrollY > 300) ? 'block' : 'none';
    },
    handleBackToTopClick(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    smoothScroll(event, link) {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        event.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};

App.init();